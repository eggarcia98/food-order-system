import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";

const db = prisma as any;

function isLinkExpired(expiresAt: Date) {
  return expiresAt.getTime() < Date.now();
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/orders/confirm/[code]">,
) {
  try {
    const { code } = await ctx.params;

    if (!code || Array.isArray(code)) {
      return NextResponse.json({ error: "Invalid confirmation code" }, { status: 400 });
    }

    const link = await db.orderConfirmationLink.findUnique({
      where: { token: code },
      include: {
        order: {
          include: {
            customer: true,
            order_items: {
              include: {
                ItemVariant: {
                  include: {
                    MenuItem: true,
                  },
                },
              },
            },
            order_item_extras: {
              include: {
                MenuExtras: true,
              },
            },
            fulfillment_type: true,
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Confirmation link not found" }, { status: 404 });
    }

    if (isLinkExpired(link.expires_at)) {
      return NextResponse.json({ error: "Confirmation link expired" }, { status: 410 });
    }

    const fulfillmentTypes = await db.fulfillmentType.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      order: link.order,
      fulfillmentTypes,
      link: {
        token: link.token,
        expires_at: link.expires_at,
        used_at: link.used_at,
      },
    });
  } catch (error) {
    console.error("Error loading confirmation page data:", error);
    return NextResponse.json({ error: "Failed to load confirmation data" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/orders/confirm/[code]">,
) {
  try {
    const { code } = await ctx.params;

    if (!code || Array.isArray(code)) {
      return NextResponse.json({ error: "Invalid confirmation code" }, { status: 400 });
    }

    const link = await db.orderConfirmationLink.findUnique({
      where: { token: code },
      select: { order_id: true, expires_at: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Confirmation link not found" }, { status: 404 });
    }

    if (isLinkExpired(link.expires_at)) {
      return NextResponse.json({ error: "Confirmation link expired" }, { status: 410 });
    }

    if (link.used_at) {
      return NextResponse.json({ error: "This confirmation link has already been used" }, { status: 410 });
    }

    const body = await request.json().catch(() => null);

    const fulfillmentTypeId = Number(body?.fulfillmentTypeId);
    const arrivalFrom = body?.arrivalFrom ? new Date(body.arrivalFrom) : null;
    const arrivalTo = body?.arrivalTo ? new Date(body.arrivalTo) : null;

    if (!Number.isInteger(fulfillmentTypeId) || fulfillmentTypeId <= 0) {
      return NextResponse.json({ error: "Invalid fulfillment type" }, { status: 400 });
    }

    if (!arrivalFrom || Number.isNaN(arrivalFrom.getTime())) {
      return NextResponse.json({ error: "Invalid arrival_from date" }, { status: 400 });
    }

    if (!arrivalTo || Number.isNaN(arrivalTo.getTime())) {
      return NextResponse.json({ error: "Invalid arrival_to date" }, { status: 400 });
    }

    if (arrivalTo.getTime() <= arrivalFrom.getTime()) {
      return NextResponse.json({ error: "arrival_to must be greater than arrival_from" }, { status: 400 });
    }

    const updatedOrder = await db.order.update({
      where: { id: link.order_id },
      data: {
        fulfillment_type_id: fulfillmentTypeId,
        arrival_from: arrivalFrom,
        arrival_to: arrivalTo,
        customer_confirmed_at: new Date(),
      },
      include: {
        customer: true,
        fulfillment_type: true,
        order_items: {
          include: {
            ItemVariant: {
              include: {
                MenuItem: true,
              },
            },
          },
        },
        order_item_extras: {
          include: {
            MenuExtras: true,
          },
        },
      },
    });

    // Mark the confirmation link as used
    await db.orderConfirmationLink.update({
      where: { token: code },
      data: { used_at: new Date() },
    });

    return NextResponse.json({ order: updatedOrder, updated: true });
  } catch (error) {
    console.error("Error updating order confirmation:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
