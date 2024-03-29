"use server";

import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";


export async function createTransaction(transaction: CreateTransactionParams) {
    console.log("Creating transaction")
    try{
        await connectToDatabase();

        //Create a new transaction with the buyerId
        const newTransaction = await Transaction.create({
            ...transaction, buyer: transaction.buyerId
          })

        await updateCredits(transaction.buyerId, transaction.credits);

        return JSON.parse(JSON.stringify(newTransaction));

    } catch (error) {
        handleError(error);
    }
}