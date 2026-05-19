import { NextResponse } from "next/server";
import {
  fetchConfirmationData,
  confirmOrder,
} from "@/lib/services/confirmation-service";
import {
  validateConfirmationCode,
  validateConfirmationRequest,
  parseRequestBody,
} from "@/lib/validation/confirmation-validation";
import { getErrorStatus } from "@/lib/api/http";

export const runtime = "edge";

/**
 * GET /api/orders/confirm/[code]
 * Fetch order confirmation data with fulfillment options
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/orders/confirm/[code]">,
) {
  try {
    const { code } = await ctx.params;

    if (!validateConfirmationCode(code)) {
      return NextResponse.json(
        { error: "Invalid confirmation code" },
        { status: 400 },
      );
    }

    const data = await fetchConfirmationData(code);

    return NextResponse.json({
      order: data.order,
      fulfillmentTypes: data.fulfillmentTypes,
      link: data.link,
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/orders/confirm/[code]
 * Confirm order with fulfillment details and arrival times
 */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/orders/confirm/[code]">,
) {
  try {
    const { code } = await ctx.params;

    if (!validateConfirmationCode(code)) {
      return NextResponse.json(
        { error: "Invalid confirmation code" },
        { status: 400 },
      );
    }

    const body = await parseRequestBody(request);
    const validatedRequest = validateConfirmationRequest(body);

    const order = await confirmOrder(code, validatedRequest);

    return NextResponse.json(
      { order, updated: true },
    );
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Centralized error handling for confirmation routes
 */
function handleError(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status = getErrorStatus(error) || 500;
    const isExpected = [400, 404, 410].includes(status);

    if (!isExpected) {
      console.error("Confirmation error:", error);
    }

    return NextResponse.json({ error: error.message }, { status });
  }

  console.error("Unknown error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
