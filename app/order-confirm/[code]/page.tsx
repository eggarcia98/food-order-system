"use client";
export const runtime = "edge";


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
  const [confirmed, setConfirmed] = useState(false);

  function getNextSunday(): Date {
    const today = new Date();
    const day = today.getDay();
    // If today is Sunday (day === 0), use today; otherwise calculate days until Sunday
    const daysUntilSunday = day === 0 ? 0 : (7 - day);
    const nextSunday = new Date(today);
    nextSunday.setDate(nextSunday.getDate() + daysUntilSunday);
    return nextSunday;
  }

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

  function toTimeInputValue(dateIso?: string | null): string {
    if (!dateIso) return "";
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function timeToISOString(timeStr: string, referenceDate: Date): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const result = new Date(referenceDate);
    result.setHours(hours, minutes, 0, 0);
    return result.toISOString();
  }

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
        
        // Leave time inputs empty (show as --:--)
        setArrivalFrom("");
        setArrivalTo("");

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
      // Reconstruct full ISO datetime from time values
      const nextSunday = getNextSunday();
      const fullArrivalFrom = timeToISOString(arrivalFrom, nextSunday);
      const fullArrivalTo = timeToISOString(arrivalTo, nextSunday);

      const res = await fetch(`/api/orders/confirm/${encodeURIComponent(code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentTypeId,
          arrivalFrom: fullArrivalFrom,
          arrivalTo: fullArrivalTo,
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
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-8 text-center">
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
          <p className="text-lg text-text-light mb-6">Thank you for confirming your order.</p>
          <div className="bg-soft-blue/10 border border-brand-blue/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Need to make changes?</strong> Contact us via WhatsApp for any modifications to your order.
            </p>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-6">
          <h2 className="text-xl font-light text-foreground mb-4">Order Details</h2>

          <div className="mb-4 text-sm text-text-light">
            <p>Customer: {(data.order.customer?.first_name || "") + " " + (data.order.customer?.last_name || "")}</p>
            {data.order.comments ? <p>Comments: {data.order.comments}</p> : null}
          </div>

          <div className="space-y-4">
            {data.order.order_items.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-light text-foreground mb-4">Dishes</h3>
                {data.order.order_items.map((item) => (
                  <div key={`main-${item.id}`} className="flex justify-between text-sm mb-3">
                    <span className="text-foreground flex-1">
                      {item.ItemVariant.MenuItem.name} - {item.ItemVariant.variant_name}
                    </span>
                    <span className="text-soft-pink/80 font-light ml-2">×{item.quantity}</span>
                    <span className="text-brand-blue font-light ml-4">${(item.quantity * item.unit_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {data.order.order_item_extras.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-light text-foreground mb-4">Extras</h3>
                {data.order.order_item_extras.map((item) => (
                  <div key={`extra-${item.id}`} className="flex justify-between text-sm mb-3">
                    <span className="text-foreground flex-1">{item.MenuExtras.name}</span>
                    <span className="text-soft-pink/80 font-light ml-2">×{item.quantity}</span>
                    <span className="text-brand-blue font-light ml-4">${(item.quantity * item.unit_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-soft-pink/20 pt-4 mt-4 flex justify-between items-center">
            <span className="text-foreground font-light">Total</span>
            <span className="text-brand-blue font-light">${total.toFixed(2)}</span>
          </div>

          {(data.order.arrival_from || data.order.arrival_to) && (
            <div className="mt-4 pt-4 border-t border-soft-pink/20 text-sm">
              {data.order.fulfillment_type && <p><strong>Fulfillment Type:</strong> {data.order.fulfillment_type.name}</p>}
              {data.order.arrival_from && <p><strong>Arrival From:</strong> {new Date(data.order.arrival_from).toLocaleString()}</p>}
              {data.order.arrival_to && <p><strong>Arrival To:</strong> {new Date(data.order.arrival_to).toLocaleString()}</p>}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-6">
        <h1 className="text-3xl font-light text-foreground mb-2">Confirm Your Order</h1>
        <p className="text-sm text-text-light">Link expires: {new Date(data.link.expires_at).toLocaleString()}</p>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-6">
        <h2 className="text-xl font-light text-foreground mb-4">Order Summary</h2>

        <div className="mb-4 text-sm text-text-light">
          <p>Customer: {(data.order.customer?.first_name || "") + " " + (data.order.customer?.last_name || "")}</p>
          {data.order.comments ? <p>Comments: {data.order.comments}</p> : null}
        </div>

        <div className="space-y-4">
          {data.order.order_items.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-light text-foreground mb-4">Dishes</h3>
              {data.order.order_items.map((item) => (
                <div key={`main-${item.id}`} className="flex justify-between text-sm mb-3">
                  <span className="text-foreground flex-1">
                    {item.ItemVariant.MenuItem.name} - {item.ItemVariant.variant_name}
                  </span>
                  <span className="text-soft-pink/80 font-light ml-2">×{item.quantity}</span>
                  <span className="text-brand-blue font-light ml-4">${(item.quantity * item.unit_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {data.order.order_item_extras.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-light text-foreground mb-4">Sides</h3>
              {data.order.order_item_extras.map((item) => (
                <div key={`extra-${item.id}`} className="flex justify-between text-sm mb-3">
                  <span className="text-foreground flex-1">{item.MenuExtras.name}</span>
                  <span className="text-soft-pink/80 font-light ml-2">×{item.quantity}</span>
                  <span className="text-brand-blue font-light ml-4">${(item.quantity * item.unit_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-soft-pink/20 pt-4 mt-4 flex justify-between items-center">
          <span className="text-foreground font-light">Total</span>
          <span className="text-brand-blue font-light">${total.toFixed(2)}</span>
        </div>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-6">
        <h2 className="text-xl font-light text-foreground mb-4">Choose Your Arrival Time</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light mb-2 text-text-light">Fulfillment Type</label>
            <select
              value={fulfillmentTypeId}
              onChange={(e) => setFulfillmentTypeId(e.target.value)}
              required
              className="w-full box-border h-12 px-4 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition appearance-none"
            >
              <option value="">Select one</option>
              {data.fulfillmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <p className="text-lg  text-brand-blue">Please, select your preferred arrival time window</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light mb-2 text-text-light">Arrival From</label>
              <input
                type="time"
                required
                min="10:30"
                max="16:00"
                value={arrivalFrom}
                onChange={(e) => setArrivalFrom(e.target.value)}
                className="w-full box-border h-12 px-4 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition appearance-none"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-text-light">Arrival To</label>
              <input
                type="time"
                required
                min="10:30"
                max="16:00"
                value={arrivalTo}
                onChange={(e) => setArrivalTo(e.target.value)}
                className="w-full box-border h-12 px-4 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition appearance-none"
              />
            </div>
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
