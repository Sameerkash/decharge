export type CreateUserRequest = {
  phoneNumber: string;
};

export type CreateChargerStation = {
  ownerKey: ArrayBuffer;
  operatorKey: ArrayBuffer;
};

export type CreateChargerSession = {
  amount: number;
  userKey: ArrayBuffer;

  operatorKey: ArrayBuffer;
  operatorPublicKey: string;
  operatorAta: string;

  chargerPublicKey: string;
  chargerPda: string;

  nftMintPublicKey: string;
  nftOwnerPublicKey: string;
  nftOwnerAta: string;
};
