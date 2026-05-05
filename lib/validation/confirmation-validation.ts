/**
 * Order Confirmation Validation
 * Validates request inputs and parameters
 */

interface ConfirmationRequestBody {
  fulfillmentTypeId?: any;
  arrivalFrom?: any;
  arrivalTo?: any;
}

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
export function validateConfirmationRequest(body: any): {
  fulfillmentTypeId: number;
  arrivalFrom: string;
  arrivalTo: string;
} {
  if (!body) {
    const error = new Error("Request body is required");
    (error as any).status = 400;
    throw error;
  }

  // Validate fulfillmentTypeId
  const fulfillmentTypeId = Number(body?.fulfillmentTypeId);
  if (
    !Number.isInteger(fulfillmentTypeId) ||
    fulfillmentTypeId <= 0
  ) {
    const error = new Error("Invalid fulfillment type");
    (error as any).status = 400;
    throw error;
  }

  // Validate arrivalFrom
  if (!body?.arrivalFrom) {
    const error = new Error("arrival_from is required");
    (error as any).status = 400;
    throw error;
  }

  // Validate arrivalTo
  if (!body?.arrivalTo) {
    const error = new Error("arrival_to is required");
    (error as any).status = 400;
    throw error;
  }

  return {
    fulfillmentTypeId,
    arrivalFrom: body.arrivalFrom,
    arrivalTo: body.arrivalTo,
  };
}

/**
 * Parse request JSON with error handling
 */
export async function parseRequestBody(
  request: Request,
): Promise<any> {
  try {
    return await request.json();
  } catch {
    const error = new Error("Invalid JSON in request body");
    (error as any).status = 400;
    throw error;
  }
}
