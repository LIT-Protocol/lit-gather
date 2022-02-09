const resourceIds = [
    //  axie
    {
      addr: '0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d"}',
      },
      chain: 'ethereum',
    },

    // Wrapped Cryptopunks (WPUNKS)
    {
      addr: '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xb7f7f6c52f2e2fdb1963eab30438024864c313f6"}',
      },
      chain: 'ethereum',
    },

    // CRYPTOPUNKS (Ͼ)
    {
      addr: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"}',
      },
      chain: 'ethereum',
    },

    // BoredApeYachtClub (BAYC)
    {
      addr: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}',
      },
      chain: 'ethereum',
    },

    // Zed Token (ZT)
    {
      addr: '0xff488fd296c38a24cccc60b43dd7254810dab64e',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xff488fd296c38a24cccc60b43dd7254810dab64e"}',
      },
      chain: 'ethereum',
    },

    //  Lost Poets (POETS)
    {
      addr: '0x4b3406a41399c7FD2BA65cbC93697Ad9E7eA61e5',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0x4b3406a41399c7FD2BA65cbC93697Ad9E7eA61e5"}',
      },
      chain: 'ethereum',
    },

    // VeeFriends (VFT)
    {
      addr: '0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb"}',
      },
      chain: 'ethereum',
    },

    //  CyberKongz (KONGZ)
    {
      addr: '0x57a204aa1042f6e66dd7730813f4024114d74f37',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0x57a204aa1042f6e66dd7730813f4024114d74f37"}',
      },
      chain: 'ethereum',
    },

    //  CyberKongz VX (KONGZ VX)
    {
      addr: '0x7EA3Cca10668B8346aeC0bf1844A49e995527c8B',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0x7EA3Cca10668B8346aeC0bf1844A49e995527c8B"}',
      },
      chain: 'ethereum',
    },

    //  Loot (LOOT)
    {
      addr: '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7"}',
      },
      chain: 'ethereum',
    },

    // Meebits (⚇)
    {
      addr: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7"}',
      },
      chain: 'ethereum',
    },

    // The Meta Key (MetaKey)
    {
      addr: '0x10daa9f4c0f985430fde4959adb2c791ef2ccf83',
      accessControlConditions: [
        {
          contractAddress: '0x10daa9f4c0f985430fde4959adb2c791ef2ccf83',
          standardContractType: 'ERC1155',
          chain: 'ethereum',
          method: 'balanceOfBatch',
          parameters: [
            ':userAddress,:userAddress,:userAddress,:userAddress',
            '1,2,10003,10004',
          ],
          returnValueTest: {
            comparator: '>',
            value: '0',
          },
        },
      ],
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"ethereum","contractAddress":"0x10daa9f4c0f985430fde4959adb2c791ef2ccf83","version":2}',
      },
      chain: 'ethereum',
    },

    //  Lit Genesis Gate (LITGATE)
    {
      addr: '0xA3D109E28589D2AbC15991B57Ce5ca461Ad8e026',
      resourceId: {
        baseUrl: 'gather.town',
        path: '/app/tXVe5OYt6nHS9Ey5/lit-protocol',
        orgId: '',
        role: '',
        extraData:
          '{"chain":"polygon","contractAddress":"0xA3D109E28589D2AbC15991B57Ce5ca461Ad8e026"}',
      },
      chain: 'polygon',
    },
  ]

  export default resourceIds
