import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import paypal from "@paypal/checkout-server-sdk";

import client from "@/lib/paypal/index";

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		const paypalClient = client();

		const body = await req.json();

		const { amount } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated.", { status: 401 });
		}

		const orderRequest = new paypal.orders.OrdersCreateRequest();

		orderRequest.requestBody({
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "USD",
						value: amount,
					},
				},
			],
		});

		const orderResponse = await paypalClient.execute(orderRequest);

		console.log("Order ID:", orderResponse.result?.id);

		return NextResponse.json({ id: orderResponse.result.id });
	} catch (error) {
		console.log("[CREATE_PAYPAL_ORDER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}