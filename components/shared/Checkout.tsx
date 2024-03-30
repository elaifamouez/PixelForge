"use client";

import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { handleError } from "@/lib/utils";

import { useToast } from "@/components/ui/use-toast";

export const Checkout = ({
	plan,
	amount,
	credits,
	buyerId,
}: {
	plan: string;
	amount: number;
	credits: number;
	buyerId: string;
}) => {
	const router = useRouter();

	const { toast } = useToast();

	const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

	const createPayPalOrder = async () => {
		try {
			const response = await fetch("api/create-paypal-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ amount }),
			});

			const order = await response.json();

			return order.id;
		} catch (error) {
			handleError(error);
		}
	};

	const onApprovePayPalOrder = async (order: any) => {
		try {
			const response = await fetch("api/approve-paypal-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ order, plan, amount, credits, buyerId }),
			});

			const approval = await response.json();

			router.refresh();

			console.log("Approval data: ", approval);

			setTimeout(() => {
				router.push("/profile");
			}, 3000);

			toast({
				title: "Purchase successful",
				description: "Your purchase was completed successfully.",
				duration: 5000,
				className: "success-toast",
			});
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<section>
			<PayPalScriptProvider options={{ clientId: paypalClientId }}>
				<PayPalButtons
					style={{
						color: "blue",
						layout: "vertical",
						shape: "pill",
						tagline: false,
					}}
					createOrder={createPayPalOrder}
					onApprove={onApprovePayPalOrder}
				/>
			</PayPalScriptProvider>
		</section>
	);
};