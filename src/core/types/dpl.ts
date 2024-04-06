export type Dpl = {
  version: '0.1.0';
  name: 'dpl';
  instructions: [
    {
      name: 'createUser';
      accounts: [
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'userPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'phoneNumberHash';
          type: 'string';
        },
      ];
    },
    {
      name: 'createCharger';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'charger';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'chargerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'operator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'chargerSession';
      accounts: [
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'userAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'charger';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'chargerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMintOwner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMintOwnerAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'operator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'operatorAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'charger';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'pubkey';
            type: 'publicKey';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'nftMint';
            type: 'publicKey';
          },
          {
            name: 'operator';
            type: 'publicKey';
          },
          {
            name: 'allTimeRevenue';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'user';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'pubkey';
            type: 'publicKey';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'phoneNumberHash';
            type: 'string';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'PhoneNumberHash32Bytes';
      msg: 'Phone number hash must be 32 bytes';
    },
    {
      code: 6001;
      name: 'InvalidMint';
      msg: 'Invalid mint';
    },
    {
      code: 6002;
      name: 'InvalidAmount';
      msg: 'Invalid amount';
    },
  ];
};

export const IDL: Dpl = {
  version: '0.1.0',
  name: 'dpl',
  instructions: [
    {
      name: 'createUser',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'userPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'phoneNumberHash',
          type: 'string',
        },
      ],
    },
    {
      name: 'createCharger',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'charger',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'chargerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'operator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'chargerSession',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'userAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'charger',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'chargerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMintOwner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMintOwnerAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'operator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'operatorAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'charger',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'publicKey',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'nftMint',
            type: 'publicKey',
          },
          {
            name: 'operator',
            type: 'publicKey',
          },
          {
            name: 'allTimeRevenue',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'user',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'publicKey',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'phoneNumberHash',
            type: 'string',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'PhoneNumberHash32Bytes',
      msg: 'Phone number hash must be 32 bytes',
    },
    {
      code: 6001,
      name: 'InvalidMint',
      msg: 'Invalid mint',
    },
    {
      code: 6002,
      name: 'InvalidAmount',
      msg: 'Invalid amount',
    },
  ],
};
