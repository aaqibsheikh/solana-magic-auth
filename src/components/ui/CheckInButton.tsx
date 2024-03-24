import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { checkIn } from '../../solana';

interface Props {
  userPublicKey: string; // Assume this comes from the user's wallet connection
}

export const CheckInButton: React.FC<Props> = ({ userPublicKey }) => {
  const handleCheckIn = async () => {
    const publicKey = new PublicKey(userPublicKey);
    const result = await checkIn(publicKey);
    console.log(result); // Handle the result appropriately
  };

  return (
    <button onClick={handleCheckIn}>Check-In</button>
  );
};
