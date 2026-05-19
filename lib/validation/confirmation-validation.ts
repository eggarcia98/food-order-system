import { HttpError, isRecord } from "@/lib/api/http";

/**
 * Validates confirmation code parameter
 */
export function validateConfirmationCode(
  code: unknown,
): code is string {
  if (!code || Array.isArray(code)) {
    return false;
  }
  return typeof code === "string" && code.length > 0;
}

/**
 * Validates request body for order confirmation
 * Returns normalized values or throws with status code
 */
export function validateConfirmationRequest(body: unknown): {
  fulfillmentTypeId: number;
  arrivalFrom: string;
  arrivalTo: string;
} {
  if (!isRecord(body)) {
    throw new HttpError("Request body is required", 400);
  }

  // Validate fulfillmentTypeId
  const fulfillmentTypeId = Number(body?.fulfillmentTypeId);
  if (
    !Number.isInteger(fulfillmentTypeId) ||
    fulfillmentTypeId <= 0
  ) {
    throw new HttpError("Invalid fulfillment type", 400);
  }

  // Validate arrivalFrom
  if (!body?.arrivalFrom) {
    throw new HttpError("arrival_from is required", 400);
  }

  // Validate arrivalTo
  if (!body?.arrivalTo) {
    throw new HttpError("arrival_to is required", 400);
  }

  return {
    fulfillmentTypeId,
    arrivalFrom: String(body.arrivalFrom),
    arrivalTo: String(body.arrivalTo),
  };
}

/**
 * Parse request JSON with error handling
 */
export async function parseRequestBody(
  request: Request,
): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError("Invalid JSON in request body", 400);
  }
}
