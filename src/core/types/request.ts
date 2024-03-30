export type CreateUserRequest = {
  phoneNumber: string;
};

export type CreateChargerStation = {
  ownerKey: ArrayBuffer;
  operatorKey: ArrayBuffer;
  chargerKey: ArrayBuffer;
  nftMintPublicKey: string;
  tokenPublicKey: string;
};

export type CreateChargerSession = {
  ownerKey: ArrayBuffer;
  operatorKey: ArrayBuffer;
  chargerKey: ArrayBuffer;
  nftMintPublicKey: string;
  tokenPublicKey: string;
};
