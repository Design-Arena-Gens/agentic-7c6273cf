import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutPayload {
  amount: number;
  plan?: string;
  equipmentId?: string;
  equipmentName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  projectLocation?: string;
  startDate?: string;
  notes?: string;
}

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        message:
          "Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      },
      { status: 500 },
    );
  }

  let payload: CheckoutPayload;
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }

  const amount = Number(payload.amount);
  if (!amount || Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { message: "A valid amount is required to create a Razorpay order." },
      { status: 400 },
    );
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `civirent_${payload.equipmentId ?? "order"}_${Date.now()}`,
      notes: {
        plan: payload.plan ?? "weekly",
        equipmentId: payload.equipmentId ?? "",
        equipmentName: payload.equipmentName ?? "",
        projectLocation: payload.projectLocation ?? "",
        startDate: payload.startDate ?? "",
        contactName: payload.contactName ?? "",
        contactEmail: payload.contactEmail ?? "",
        contactPhone: payload.contactPhone ?? "",
        additionalNotes: payload.notes ?? "",
      },
    });

    return NextResponse.json({
      key: keyId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    return NextResponse.json(
      {
        message:
          "We could not reach Razorpay to create an order. Please try again.",
      },
      { status: 502 },
    );
  }
}
