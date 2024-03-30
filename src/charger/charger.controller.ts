import { Wallet, web3 } from '@coral-xyz/anchor';
import { Body, Controller, Post } from '@nestjs/common';
import { getChargerPDA } from 'src/core/pda';
import { deChargeProgram } from 'src/core/program';
import {
  CreateChargerSession,
  CreateChargerStation,
} from 'src/core/types/request';

@Controller('charger')
export class ChargerController {
  @Post('create')
  async createCharger(@Body() body: CreateChargerStation) {
    const ownerWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.ownerKey)),
    );

    const operatorWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.operatorKey)),
    );

    const chargerKey = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.chargerKey)),
    );

    const program = deChargeProgram(ownerWallet);
    const [chargerPda] = getChargerPDA(chargerKey.publicKey);

    const nftMint = new web3.PublicKey(body.nftMintPublicKey);
    const tokenProgram = new web3.PublicKey(body.tokenPublicKey);

    const tx = await program.methods
      .createCharger()
      .accounts({
        operator: operatorWallet.publicKey,
        payer: ownerWallet.publicKey,
        charger: chargerKey.publicKey,
        nftMint,
        chargerPda,
        tokenProgram,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([ownerWallet.payer])
      .rpc({
        skipPreflight: false,
        commitment: 'confirmed',
        maxRetries: 3,
      });

    return {
      tx,
    };
  }

  @Post('session')
  async createChargerSession(@Body() body: CreateChargerSession) {
    const ownerWallet = new Wallet(
      web3.Keypair.fromSecretKey(Buffer.from(body.ownerKey)),
    );

    const program = deChargeProgram(ownerWallet);
    const tx = await program.methods
      .chargerSession({})
      .accounts({})
      .signers([ownerWallet.payer])
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
