import { createConnection } from '../program';
import { Metaplex } from '@metaplex-foundation/js';

const METAPLEX = Metaplex.make(createConnection());

export async function mintNft(name, owner) {
  const { nft } = await METAPLEX.nfts().create(
    {
      uri: 'https://pbs.twimg.com/profile_images/1769312077074849792/cSa9xIEm_400x400.jpg',
      name: name,
      sellerFeeBasisPoints: 100,
      symbol: 'DECHARGE',
      creators: [{ address: owner, share: 100 }],
      isMutable: false,
    },
    { commitment: 'finalized' },
  );

  return nft;
}
