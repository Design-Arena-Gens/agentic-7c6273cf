"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  categories,
  equipments,
  rentalPlans,
  type Equipment,
  type RentalPlan,
} from "@/data/equipment";
import { formatINR } from "@/lib/currency";

interface CheckoutFormState {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  projectLocation: string;
  startDate: string;
  notes: string;
}

const defaultFormState: CheckoutFormState = {
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  projectLocation: "",
  startDate: "",
  notes: "",
};

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function EquipmentCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [selectedPlan, setSelectedPlan] = useState<RentalPlan>("weekly");
  const [form, setForm] = useState<CheckoutFormState>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredEquipments = useMemo(() => {
    const search = query.trim().toLowerCase();

    return equipments.filter((equipment) => {
      const matchesQuery =
        !search ||
        equipment.name.toLowerCase().includes(search) ||
        equipment.description.toLowerCase().includes(search) ||
        equipment.category.toLowerCase().includes(search);

      const matchesCategory =
        category === "All" || equipment.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const handleBook = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedPlan("weekly");
    setForm(defaultFormState);
    setFeedback(null);
  };

  const handleCheckoutSubmit = async () => {
    if (!selectedEquipment) return;

    if (!form.contactName || !form.contactEmail || !form.contactPhone) {
      setFeedback({
        type: "error",
        message: "Fill in contact name, email, and phone to proceed.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const amount = selectedEquipment.pricing[selectedPlan];
      const response = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          plan: selectedPlan,
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          ...form,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Unable to create payment order.");
      }

      const data: {
        key: string;
        order: { id: string; amount: number; currency: string };
      } = await response.json();

      if (!data.key) {
        throw new Error(
          "Razorpay key is missing. Ensure environment variables are configured.",
        );
      }

      const { Razorpay } = window;
      const checkout = new Razorpay({
        key: data.key,
        order_id: data.order.id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "CiviRent Rentals",
        description: `${selectedEquipment.name} – ${selectedPlan} plan`,
        notes: {
          equipmentId: selectedEquipment.id,
          plan: selectedPlan,
          projectLocation: form.projectLocation,
          startDate: form.startDate,
        },
        prefill: {
          name: form.contactName,
          email: form.contactEmail,
          contact: form.contactPhone,
        },
        theme: {
          color: "#0f172a",
        },
        handler: () => {
          setFeedback({
            type: "success",
            message:
              "Payment initiated successfully. Our operations team will reach out within 2 working hours.",
          });
          setSelectedEquipment(null);
        },
      });

      checkout.on("payment.failed", (err) => {
        const reason =
          typeof err === "object" && err !== null && "error" in err
            ? (err as { error: { description?: string } }).error.description
            : "Payment failed. Please try again.";
        setFeedback({ type: "error", message: reason ?? "Payment failed." });
      });

      checkout.open();
    } catch (error) {
      if (error instanceof Error) {
        setFeedback({
          type: "error",
          message: error.message,
        });
      } else {
        setFeedback({
          type: "error",
          message: "Something went wrong. Try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAmount = selectedEquipment
    ? selectedEquipment.pricing[selectedPlan]
    : 0;

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-3">
            <input
              type="search"
              placeholder="Search equipment, applications, or specs..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
            />
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as (typeof categories)[number])
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none ring-slate-300 transition focus:ring md:w-48"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {filteredEquipments.length} unit
            {filteredEquipments.length === 1 ? "" : "s"} ready across India
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredEquipments.map((equipment) => (
          <article
            key={equipment.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-56 overflow-hidden bg-slate-100">
              <Image
                src={equipment.image}
                alt={equipment.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                priority={false}
              />
              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow">
                {equipment.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
              <header className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {equipment.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {equipment.description}
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Field Highlights
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {equipment.highlight}
                  </p>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  {equipment.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 font-medium text-slate-800">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </header>

              <div className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">
                      Weekly plan
                    </p>
                    <p className="text-base font-bold">
                      {formatINR(equipment.pricing.weekly)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBook(equipment)}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-100"
                  >
                    Book & Pay
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Available in {equipment.availability.locations.join(", ")} ·{" "}
                  {equipment.availability.leadTime}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setSelectedEquipment(null)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:bg-slate-100"
            >
              Close
            </button>

            <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
              <div className="px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Reservation
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedEquipment.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Select a rental plan and share project details to lock the
                  machine. You will be redirected to Razorpay for payment.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {rentalPlans.map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => setSelectedPlan(plan.key)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        selectedPlan === plan.key
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em]">
                        {plan.label}
                      </span>
                      <span className="mt-1 block text-sm font-medium">
                        {formatINR(selectedEquipment.pricing[plan.key])}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {plan.description}
                      </span>
                    </button>
                  ))}
                </div>

                <dl className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <dt>Rental plan</dt>
                    <dd className="capitalize">{selectedPlan}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <dt>Payable now</dt>
                    <dd>{formatINR(activeAmount)}</dd>
                  </div>
                  <div className="text-xs text-slate-500">
                    GST will be added on the payment gateway. Off-hire credits
                    post inspection.
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-900/5 p-8 md:border-l md:border-t-0">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Contact Name
                  <input
                    value={form.contactName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        contactName: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                    placeholder="Site head / procurement"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Contact Email
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        contactEmail: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                    placeholder="name@company.com"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Contact Phone
                  <input
                    value={form.contactPhone}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        contactPhone: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                    placeholder="+91 98765 43210"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Project Location
                  <input
                    value={form.projectLocation}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        projectLocation: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                    placeholder="City, site address"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Target Mobilization Date
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        startDate: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Site Notes (Optional)
                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        notes: event.target.value,
                      }))
                    }
                    className="mt-2 h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-slate-300 transition focus:ring"
                    placeholder="Access, shift timing, safety requirements..."
                  />
                </label>
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isSubmitting}
                  className="mt-2 flex items-center justify-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {isSubmitting ? "Processing..." : "Proceed to Razorpay"}
                </button>
                <p className="text-xs text-slate-500">
                  By proceeding, you agree to CiviRent&apos;s rental terms,
                  transport charges, and site induction compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-xl ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </>
  );
}
