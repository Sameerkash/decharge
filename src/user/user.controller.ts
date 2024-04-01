import { Wallet, web3 } from '@coral-xyz/anchor';
import { Body, Controller, Post } from '@nestjs/common';
import { getUserPDA } from 'src/core/pda';
import {
  airdrop,
  airdropUSDC,
  createConnection,
  deChargeProgram,
  getOrCreateTokenAccountAddress,
} from 'src/core/program';
import { CreateUserRequest } from 'src/core/types/request';
import { generatePhoneNumberHash } from 'src/util/util';

@Controller('user')
export class UserController {
  @Post('create')
  async createUser(@Body() body: CreateUserRequest) {
    const userKeys = web3.Keypair.generate();
    const userWallet = new Wallet(userKeys);
    const program = deChargeProgram(userWallet);
    const hashedPhoneNumber = generatePhoneNumberHash(body.phoneNumber);

    await airdrop(
      createConnection(),
      userWallet.publicKey,
      web3.LAMPORTS_PER_SOL * 0.1,
    );

    console.log({ userKeys });

    const userAta = await getOrCreateTokenAccountAddress(userKeys);
    console.log({ userAta });

    await airdropUSDC({
      senderKeypair: userKeys,
      senderTokenAccount: userAta,
    });

    const [userPda] = getUserPDA(userWallet.publicKey);

    const tx = await program.methods
      .createUser(hashedPhoneNumber)
      .accounts({
        user: userWallet.publicKey,
        userPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([userWallet.payer])
      .rpc({
        skipPreflight: true,
        commitment: 'confirmed',
        maxRetries: 3,
      });

    console.log({ userAta, userPda, hashedPhoneNumber });
    return {
      user: {
        publicKey: userWallet.publicKey,
        secretKey: userKeys.secretKey,
        userPda: userPda,
        userAta: userAta,
        hashedPhoneNumber: hashedPhoneNumber,
      },
      txHash: tx,
    };
  }
}
