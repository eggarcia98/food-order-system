"use client";

import { useEffect, useMemo, useState } from "react";

type FulfillmentType = {
  id: number;
  name: string;
};

type OrderSummary = {
  id: number;
  order_code: string;
  comments?: string | null;
  customer_note?: string | null;
  arrival_from?: string | null;
  arrival_to?: string | null;
  customer_confirmed_at?: string | null;
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
  } | null;
  fulfillment_type?: {
    id: number;
    name: string;
  } | null;
  order_items: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    ItemVariant: {
      variant_name: string;
      MenuItem: {
        name: string;
      };
    };
  }>;
  order_item_extras: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    MenuExtras: {
      name: string;
    };
  }>;
};

type ApiResponse = {
  order: OrderSummary;
  fulfillmentTypes: FulfillmentType[];
  link: {
    token: string;
    expires_at: string;
    used_at: string | null;
  };
};

function toDateTimeLocalInputValue(dateIso?: string | null): string {
  if (!dateIso) return "";
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

export default function OrderConfirmPage(
  props: { params: Promise<{ code: string }> },
) {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const [fulfillmentTypeId, setFulfillmentTypeId] = useState<string>("");
  const [arrivalFrom, setArrivalFrom] = useState<string>("");
  const [arrivalTo, setArrivalTo] = useState<string>("");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    props.params.then((p) => setCode(p.code));
  }, [props.params]);

  useEffect(() => {
    if (!code) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/confirm/${encodeURIComponent(code)}`, {
          method: "GET",
          cache: "no-store",
        });

        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.error || "Failed to load order confirmation data");
        }

        setData(body as ApiResponse);

        const order = (body as ApiResponse).order;
        setFulfillmentTypeId(order.fulfillment_type?.id ? String(order.fulfillment_type.id) : "");
        setArrivalFrom(toDateTimeLocalInputValue(order.arrival_from ?? null));
        setArrivalTo(toDateTimeLocalInputValue(order.arrival_to ?? null));
        setCustomerNote(order.customer_note ?? "");

        // If link is already used, show the success screen
        if ((body as ApiResponse).link.used_at) {
          setConfirmed(true);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  const total = useMemo(() => {
    if (!data?.order) return 0;
    const mainTotal = data.order.order_items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const extraTotal = data.order.order_item_extras.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    return mainTotal + extraTotal;
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/orders/confirm/${encodeURIComponent(code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentTypeId,
          arrivalFrom,
          arrivalTo,
          customerNote,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "Failed to update order");
      }

      setData((prev) => {
        if (!prev) return prev;
        return { ...prev, order: body.order };
      });
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-text-light">Loading order confirmation...</p>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-light text-foreground mb-4">Order Confirmation</h1>
        <p className="text-brand-red">{error}</p>
      </main>
    );
  }

  if (!data) return null;

  if (confirmed) {
    return (
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-green-600 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-lg text-text-light mb-4">Thank you for confirming your order.</p>
          <p className="text-sm text-text-light">Order code: <span className="font-medium">{data.order.order_code}</span></p>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-light text-foreground mb-4">Order Details</h2>

          <div className="mb-4 text-sm text-text-light">
            <p>Customer: {(data.order.customer?.first_name || "") + " " + (data.order.customer?.last_name || "")}</p>
            <p>Phone: {data.order.customer?.phone_number || "-"}</p>
            {data.order.comments ? <p>Comments: {data.order.comments}</p> : null}
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="font-light text-foreground">Items</h3>
            {data.order.order_items.map((item) => (
              <div key={`main-${item.id}`} className="flex justify-between border-b border-soft-pink/20 py-2 text-sm">
                <span>
                  {item.quantity}x {item.ItemVariant.MenuItem.name} - {item.ItemVariant.variant_name}
                </span>
                <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
              </div>
            ))}

            {data.order.order_item_extras.length > 0 && (
              <>
                <h3 className="font-light text-foreground mt-4">Extras</h3>
                {data.order.order_item_extras.map((item) => (
                  <div key={`extra-${item.id}`} className="flex justify-between border-b border-soft-pink/20 py-2 text-sm">
                    <span>{item.quantity}x {item.MenuExtras.name}</span>
                    <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}

            <div className="flex justify-between pt-2 text-lg font-medium border-t border-soft-pink/20">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {data.order.fulfillment_type && (
            <div className="mt-4 pt-4 border-t border-soft-pink/20 text-sm">
              <p><strong>Fulfillment Type:</strong> {data.order.fulfillment_type.name}</p>
              {data.order.arrival_from && <p><strong>Arrival From:</strong> {new Date(data.order.arrival_from).toLocaleString()}</p>}
              {data.order.arrival_to && <p><strong>Arrival To:</strong> {new Date(data.order.arrival_to).toLocaleString()}</p>}
              {data.order.customer_note && <p><strong>Note:</strong> {data.order.customer_note}</p>}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-light text-foreground mb-2">Confirm Your Order</h1>
        <p className="text-sm text-text-light">Order code: {data.order.order_code}</p>
        <p className="text-sm text-text-light">Link expires: {new Date(data.link.expires_at).toLocaleString()}</p>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-light text-foreground mb-4">Order Summary</h2>

        <div className="mb-4 text-sm text-text-light">
          <p>Customer: {(data.order.customer?.first_name || "") + " " + (data.order.customer?.last_name || "")}</p>
          <p>Phone: {data.order.customer?.phone_number || "-"}</p>
          {data.order.comments ? <p>Comments: {data.order.comments}</p> : null}
        </div>

        <div className="space-y-2">
          {data.order.order_items.map((item) => (
            <div key={`main-${item.id}`} className="flex justify-between border-b border-soft-pink/20 py-2">
              <span>
                {item.quantity}x {item.ItemVariant.MenuItem.name} - {item.ItemVariant.variant_name}
              </span>
              <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
            </div>
          ))}

          {data.order.order_item_extras.map((item) => (
            <div key={`extra-${item.id}`} className="flex justify-between border-b border-soft-pink/20 py-2">
              <span>{item.quantity}x Extra: {item.MenuExtras.name}</span>
              <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between pt-2 text-lg font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-light text-foreground mb-4">Choose Delivery / Pickup Window</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light mb-2 text-text-light">Fulfillment Type</label>
            <select
              value={fulfillmentTypeId}
              onChange={(e) => setFulfillmentTypeId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream"
            >
              <option value="">Select one</option>
              {data.fulfillmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light mb-2 text-text-light">Arrival From</label>
              <input
                type="datetime-local"
                required
                value={arrivalFrom}
                onChange={(e) => setArrivalFrom(e.target.value)}
                className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-text-light">Arrival To</label>
              <input
                type="datetime-local"
                required
                value={arrivalTo}
                onChange={(e) => setArrivalTo(e.target.value)}
                className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light mb-2 text-text-light">Customer Note (optional)</label>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream"
            />
          </div>

          {error ? <p className="text-brand-red text-sm">{error}</p> : null}
          {success ? <p className="text-green-600 text-sm">{success}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="btn-brand-blue px-6 py-3 rounded-lg text-sm font-light disabled:opacity-60"
          >
            {saving ? "Saving..." : "Confirm Order"}
          </button>
        </form>
      </section>
    </main>
  );
}
