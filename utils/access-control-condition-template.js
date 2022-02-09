const accessControlConditionTemplate = [
    {
      contractAddress: '',
      standardContractType: 'ERC721',
      chain: 'ethereum',
      method: 'balanceOf',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '>',
        value: '0',
      },
    },
  ]
  export default accessControlConditionTemplate