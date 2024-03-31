import { Wallet, web3 } from '@coral-xyz/anchor';
import { Body, Controller, Post } from '@nestjs/common';
import { getUserPDA } from 'src/core/pda';
import { airdrop, createConnection, deChargeProgram } from 'src/core/program';
import { CreateUserRequest } from 'src/core/types/request';

@Controller('user')
export class UserController {
  @Post('create')
  async createUser(@Body() body: CreateUserRequest) {
    const userKeys = web3.Keypair.generate();
    const userWallet = new Wallet(userKeys);
    const program = deChargeProgram(userWallet);
    const hashedPhoneNumber = body.phoneNumber;

    await airdrop(
      createConnection(),
      userWallet.publicKey,
      web3.LAMPORTS_PER_SOL * 0.1,
    );

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

    return {
      user: {
        publicKey: userWallet.publicKey,
        secretKey: userKeys.secretKey,
        userPda: userPda,
      },
      txHash: tx,
    };
  }
}
