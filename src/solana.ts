import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useMagic } from './components/MagicProvider';

export const checkIn = async (userPublicKey: any): Promise<string> => {

  // const transaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: userPublicKey,
  //     toPubkey: userPublicKey, 
  //     lamports: 1,
  //   }),
  // );

  return "Last Check-in " + new Date().toLocaleString();
};
