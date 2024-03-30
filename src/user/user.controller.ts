import { Wallet, web3 } from '@coral-xyz/anchor';
import { Body, Controller, Post } from '@nestjs/common';
import { getUserPDA } from 'src/core/pda';
import { deChargeProgram } from 'src/core/program';
import { CreateUserRequest } from 'src/core/types/request';
import { generateHash } from 'src/util/util';

@Controller('user')
export class UserController {
  @Post('create')
  async createUser(@Body() body: CreateUserRequest) {
    const userWallet = new Wallet(web3.Keypair.generate());
    const program = deChargeProgram(userWallet);
    const hashedPhoneNumber = generateHash(body.phoneNumber);

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
      userPda: userPda,
      tx: tx,
    };
  }
}
