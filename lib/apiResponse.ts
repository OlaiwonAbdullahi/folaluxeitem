// Helpers that build the `ApiResponse<T>` envelope the frontend `lib/api.ts`
// client expects: { statusCode, data, message, success }.

export function ok<T>(data: T, message = "Success", statusCode = 200) {
  return Response.json(
    { statusCode, data, message, success: true },
    { status: statusCode },
  );
}

export function created<T>(data: T, message = "Created") {
  return ok(data, message, 201);
}

export function fail(statusCode: number, message: string) {
  return Response.json(
    { statusCode, data: null, message, success: false },
    { status: statusCode },
  );
}

// Wrap a route handler so thrown errors become a clean 500 (or a typed status
// via HttpError) instead of leaking stack traces.
export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleError(error: unknown) {
  if (error instanceof HttpError) {
    return fail(error.statusCode, error.message);
  }
  console.error("[api] unhandled error:", error);
  const message =
    error instanceof Error ? error.message : "Something went wrong";
  return fail(500, message);
}
