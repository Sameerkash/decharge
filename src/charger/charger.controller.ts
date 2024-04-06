import { BN, Wallet, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';

import { Body, Controller, Post } from '@nestjs/common';
import { mintNft } from 'src/core/nft/nft';
import { getChargerPDA } from 'src/core/pda';
import {
  deChargeProgram,
  getOrCreateTokenAccountAddress,
} from 'src/core/program';
import { USDC_DEVNET_ADDRESS } from 'src/core/types/address';
import {
  CreateChargerSession,
  CreateChargerStation,
} from 'src/core/types/request';

@Controller('charger')
export class ChargerController {
  @Post('create')
  async createCharger(@Body() body: CreateChargerStation) {
    const ownerkeys = web3.Keypair.fromSecretKey(Buffer.from(body.ownerKey));
    const ownerWallet = new Wallet(ownerkeys);
    const ownerAta = await getOrCreateTokenAccountAddress(ownerkeys);

    const operatorWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.operatorKey)),
    );

    const chargerKeys = web3.Keypair.generate();
    const chargerWallet = new Wallet(chargerKeys);
    const [chargerPda] = getChargerPDA(chargerWallet.publicKey);

    const program = deChargeProgram(ownerWallet);
    const nftMint = await mintNft('DeCharge Ownership', ownerkeys);

    const tx = await program.methods
      .createCharger()
      .accounts({
        operator: operatorWallet.publicKey,
        payer: ownerWallet.publicKey,
        charger: chargerWallet.publicKey,
        nftMint: nftMint.address,
        chargerPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([ownerWallet.payer])
      .rpc({
        skipPreflight: false,
        commitment: 'confirmed',
        maxRetries: 3,
      });

    return {
      charger: {
        chargerPublicKey: chargerKeys.publicKey,
        chargerKey: chargerKeys.secretKey,
        chargerPda: chargerPda.toString(),
      },
      nft: {
        address: nftMint.address.toString(),
        ownerAddress: ownerWallet.publicKey,
        ownerAta: ownerAta.address.toString(),
      },
      txHash: tx,
    };
  }

  @Post('session')
  async createChargerSession(@Body() body: CreateChargerSession) {
    const userKeys = web3.Keypair.fromSecretKey(Buffer.from(body.userKey));
    const userWallet = new Wallet(userKeys);
    const userAta = await getOrCreateTokenAccountAddress(userKeys);

    const program = deChargeProgram(userWallet);
    const operatorATA = new web3.PublicKey(body.operatorAta);

    /// Pub key defintions
    const chargerPubKey = new web3.PublicKey(body.chargerPublicKey);
    const chargerPda = new web3.PublicKey(body.chargerPda);
    const operatorPublicKey = new web3.PublicKey(body.operatorPublicKey);
    const nftMint = new web3.PublicKey(body.nftMintPublicKey);
    const nftMintOwner = new web3.PublicKey(body.nftOwnerPublicKey);
    const nftOwnerAta = new web3.PublicKey(body.nftOwnerAta);

    const amount = new BN(body.amount);

    const tx = await program.methods
      .chargerSession(amount)
      .accounts({
        charger: chargerPubKey,
        user: userWallet.publicKey,
        chargerPda: chargerPda,
        operator: operatorPublicKey,
        operatorAta: operatorATA,
        nftMint: nftMint,
        nftMintOwner: nftMintOwner,
        nftMintOwnerAta: nftOwnerAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        userAta: userAta.address,
        mint: new web3.PublicKey(USDC_DEVNET_ADDRESS),
      })
      .signers([userWallet.payer])
      .rpc({
        skipPreflight: false,
        commitment: 'confirmed',
        maxRetries: 0,
      });

    return {
      tx,
    };
  }
}
