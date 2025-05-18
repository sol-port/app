import { useCallback, } from 'react';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { serialize } from 'borsh';

import { useWallet } from "@solana/wallet-adapter-react";

const PROGRAM_ID = new PublicKey("HtCNseNfYmyJEYGw36Lf2xEZk26kyPZq6tp5Ei2QcoFD");

class DepositInPortfolioArgs {
  amount: bigint;
  portfolio: number[];

  constructor(fields: { amount: bigint, portfolio: number[] }) {
    this.amount = fields.amount;
    this.portfolio = fields.portfolio;
  }
}

export const useDepositInPortfolio = () => {
  const { connected, wallets, publicKey, sendTransaction } = useWallet();

  const depositInPortfolio = useCallback(
    async (
      amount: bigint,
      portfolio: number[],
    ) => {
      const wallet = wallets[0];
      if (!connected || !wallet || !publicKey) return;

      let connection = new Connection(clusterApiUrl('devnet'));

      let transaction = new Transaction();

      // PDA 주소 계산
      const [vaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      const [vaultDataPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("deposit"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const discriminator = Buffer.from([108, 178, 40, 165, 213, 230, 87, 1]);
      const DepositSchema = new Map([
        [DepositInPortfolioArgs, {
          kind: 'struct',
          fields: [
            ['amount', 'u64'],
            ['portfolio', ['u16', 27]],
          ]
        }]
      ]);

      const depositInPortfolioArgs = new DepositInPortfolioArgs({
        amount: amount,
        portfolio: portfolio,
      });

      const serializedArgs = serialize(DepositSchema, depositInPortfolioArgs);

      const instructionData = Buffer.concat([discriminator, serializedArgs]);

      const instruction = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: vaultPDA, isSigner: false, isWritable: true },
          { pubkey: vaultDataPDA, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      });
      console.log("instruction", instruction);

      transaction.add(instruction);
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = publicKey;

      console.log("before sendTransaction");
      const signature = await sendTransaction(transaction, connection);

      console.log("after sendTransaction");

      return signature;
    },
    [connected, wallets, publicKey]
  );

  return { depositInPortfolio };
}
