import ecc from '@bitcoinerlab/secp256k1';
import type { BIP44Node } from '@metamask/key-tree';
import { payments } from 'bitcoinjs-lib';
import * as bitcoin from 'bitcoinjs-lib';

import { getAccount } from './private-key';

export const getAddress = async (): Promise<{
  p2wpkh: string;
  // p2sh: string;
  // p2tr: string;
  // p2pkh: string;
  node: BIP44Node;
}> => {
  const network = bitcoin.networks.testnet;
  bitcoin.initEccLib(ecc);

  const account = await getAccount();
  console.log({ account });

  const p2wpkh = payments.p2wpkh({
    // eslint-disable-next-line no-restricted-globals
    pubkey: Buffer.from(account.compressedPublicKeyBytes),
    network,
  });
  console.log({ p2wpkh });

  // const p2sh = payments.p2sh({
  //   // eslint-disable-next-line no-restricted-globals
  //   pubkey: Buffer.from(account.compressedPublicKeyBytes),
  //   network,
  // });
  // console.log({ p2sh });
  //

  // try {
  // eslint-disable-next-line no-restricted-globals
  const pubkeyForP2TR = Buffer.from(account.publicKey);
  const p2tr = bitcoin.payments.p2tr({
    // eslint-disable-next-line no-restricted-globals
    internalPubkey: pubkeyForP2TR.slice(1, 33),
    network,
  });
  console.log({ p2tr });
  // } catch (p2trError) {
  //   console.log({ p2trError });
  // }
  //
  // const p2pkh = bitcoin.payments.p2pkh({
  //   // eslint-disable-next-line no-restricted-globals
  //   pubkey: Buffer.from(account.compressedPublicKeyBytes),
  // network
  // });
  // console.log({ p2pkh });

  // if (!p2wpkh.address || !p2sh.address || !p2tr.address || !p2pkh.address) {
  //   throw new Error('Address not found');
  // }

  if (
    !p2wpkh.address ||
    // || !p2sh.address
    !p2tr.address
  ) {
    throw new Error('Address not found');
  }

  return {
    p2wpkh: p2wpkh.address,
    // p2sh: p2sh.address,
    node: account,
    p2tr: p2tr.address,
    // p2pkh: p2pkh.address,
  };
};
