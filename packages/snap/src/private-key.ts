import type { BIP44Node } from '@metamask/key-tree';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

export const getAccount = async (): Promise<BIP44Node> => {
  const bitCoinTestnetNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 1, // 1 is for all Testnets
    },
  });

  console.log({ bitCoinTestnetNode });

  const deriveBitcoinTestnetPrivateKey = await getBIP44AddressKeyDeriver(
    bitCoinTestnetNode,
  );

  return deriveBitcoinTestnetPrivateKey(0);
};
