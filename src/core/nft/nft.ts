import { web3 } from '@coral-xyz/anchor';
import { connection } from '../program';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

const METAPLEX = Metaplex.make(connection);

export async function mintNft(name, owner: web3.Keypair) {
  METAPLEX.use(keypairIdentity(owner));
  const { nft } = await METAPLEX.nfts().create(
    {
      uri: 'https://pbs.twimg.com/profile_images/1769312077074849792/cSa9xIEm_400x400.jpg',
      name: name,
      sellerFeeBasisPoints: 100,
      symbol: 'DECHARGE',
      creators: [{ address: owner.publicKey, share: 100 }],
      isMutable: false,
    },
    { commitment: 'finalized' },
  );

  return nft;
}
