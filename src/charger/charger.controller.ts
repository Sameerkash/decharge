import { Wallet, web3 } from '@coral-xyz/anchor';
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
    const ownerWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.ownerKey)),
    );
    const userWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.userKey)),
    );

    const program = deChargeProgram(ownerWallet);
    const tx = await program.methods
      .chargerSession({
        amount: body.amount,
      })
      .accounts({
        charger: body.chargerPublicKey,
        user: userWallet.publicKey,
        chargerPda: body.chargerPda,
        operator: body.operatoryPublicKey,
        operatorAta: body.operatoryAta,
        nftMint: body.nftMintPublicKey,
        nftMintOwner: body.nftOwnerPublicKey,
        nftMintOwnerAta: body.nftOwnerAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        userAta: body.userAta,
        mint: USDC_DEVNET_ADDRESS,
      })
      .signers([userWallet.payer])
      .rpc({
        skipPreflight: false,
        commitment: 'confirmed',
        maxRetries: 3,
      });

    return {
      tx,
    };
  }
}
