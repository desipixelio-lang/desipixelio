import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(req: Request) {
  const { amount } = await req.json();

  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: "INR",
    receipt: "receipt_" + Math.random().toString(36).substring(7),
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}