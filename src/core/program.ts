import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
import { Dpl, IDL } from './types/dpl';
import { mainKey } from './keys/main.key';

export const PROGRAM_ID = new web3.PublicKey(
  'MfQ5MtGrou6TxQuBSGAFiQMuPTUWe7Y7kscbswUw31c',
);

let connection: web3.Connection;

export function createConnection(devnet = true) {
  if (devnet) {
    if (!connection) {
      connection = new web3.Connection(
        'https://api.devnet.solana.com',
        'confirmed',
      );
    }
    return connection;
  } else {
    return new web3.Connection('http://localhost:8899', 'confirmed');
  }
}

export const deChargeProgram = (wallet: Wallet): Program<Dpl> => {
  return new Program(
    IDL,
    PROGRAM_ID,
    new AnchorProvider(createConnection(), wallet, {
      commitment: 'confirmed',
    }),
  ) as unknown as Program<Dpl>;
};

const mainKeypair = web3.Keypair.fromSecretKey(Buffer.from(mainKey));

export async function airdrop(
  connection: web3.Connection,
  to: web3.PublicKey,
  amount?: number,
) {
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

  await connection.sendRawTransaction(tx.serialize());
}
