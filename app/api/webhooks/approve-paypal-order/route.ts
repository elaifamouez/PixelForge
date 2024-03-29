import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { createTransaction } from "@/lib/actions/transaction.actions";

export async function POST(request: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated.", { status: 401 });
		}

		const body = await request.json();

		const { order, plan, amount, credits, buyerId } = body;

		const transaction = {
			paypalId: order.orderID,
			amount: amount,
			plan: plan,
			credits: credits,
			buyerId: buyerId,
			createdAt: new Date(),
		};

		const newTransaction = await createTransaction(transaction);

		return NextResponse.json({ message: "OK", transaction: newTransaction });
	} catch (error) {
		console.log("[APPROVE_PAYPAL_ORDER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}