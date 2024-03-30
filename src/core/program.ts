import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
import { Dpl, IDL } from './types/dpl';

export const PROGRAM_ID = new web3.PublicKey(
  'MfQ5MtGrou6TxQuBSGAFiQMuPTUWe7Y7kscbswUw31c',
);

export function createConnection(devnet = true) {
  if (devnet) {
    return new web3.Connection('https://api.devnet.solana.com', 'confirmed');
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
