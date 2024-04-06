import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
import { Dpl, IDL } from './types/dpl';
import { mainKey } from './keys/main.key';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  USDC_DEVNET_ADDRESS,
} from './types/address';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';

export const PROGRAM_ID = new web3.PublicKey(
  '8uwxL2etDeowSko5FXiZLfUJCU9qwFQsmsqrLKjQpFV4',
);

export const connection: web3.Connection = new web3.Connection(
  'https://api.devnet.solana.com',
  'confirmed',
);

// export function createConnection() {
//   if (!connection) {
//     connection = new web3.Connection(
//       'https://api.devnet.solana.com',
//       'confirmed',
//     );
//   }
//   return connection;
// }

export const deChargeProgram = (wallet: Wallet): Program<Dpl> => {
  return new Program(
    IDL,
    PROGRAM_ID,
    new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    }),
  ) as unknown as Program<Dpl>;
};

const mainKeypair = web3.Keypair.fromSecretKey(Buffer.from(mainKey));

export async function airdrop(to: web3.PublicKey, amount?: number) {
  // transfer from the default account to the new account
  const tx = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: new web3.PublicKey(mainKeypair.publicKey),
      toPubkey: to,
      lamports: amount || web3.LAMPORTS_PER_SOL * 0.01,
    }),
  );

  tx.feePayer = mainKeypair.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.sign(mainKeypair);

  const hash = await connection.sendRawTransaction(tx.serialize());
  console.log({ hash });
}

export async function airdropUSDC({ receiverTokenAccount }) {
  const mainWallet = web3.Keypair.fromSecretKey(Buffer.from(mainKey));
  const mainWalletAta = await getOrCreateTokenAccountAddress(mainWallet);

  console.log({ mainWalletAta });

  const signature = await transfer(
    connection,
    mainWallet,
    mainWalletAta.address,
    receiverTokenAccount.address,
    mainWallet.publicKey,
    500000,
  );

  return signature;
}

export async function getOrCreateTokenAccountAddress(
  accountKeyPair: web3.Keypair,
) {
  const mainWallet = web3.Keypair.fromSecretKey(Buffer.from(mainKey));
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mainWallet,
    new PublicKey(USDC_DEVNET_ADDRESS),
    accountKeyPair.publicKey,
    true,
    'confirmed',
  );

  console.log({ tokenAccount });

  return tokenAccount;
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): Promise<web3.PublicKey> {
  return PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  )[0];
}
