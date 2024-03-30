import { web3 } from '@coral-xyz/anchor';
import { PROGRAM_ID } from './program';

export const getUserPDA = (wallet: web3.PublicKey) => {
  // user wallet
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('user'), wallet.toBuffer()],
    PROGRAM_ID,
  );
};

export const getChargerPDA = (wallet: web3.PublicKey) => {
  // charger wallet
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('charger'), wallet.toBuffer()],
    PROGRAM_ID,
  );
};
