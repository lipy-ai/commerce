import { ErrorResponse, ServerContext } from "@/types";
import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const globalError: ErrorHandler<ServerContext> = (err, c) => {
  const cause = process.env.NODE_ENV === "production" ? undefined : err.stack;
  console.log(cause);
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: { message: err.message, cause: err.cause },
        },
        err.status
      );
    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error: {
        message:
          process.env.NODE_ENV === "production"
            ? "Interal Server Error"
            : err.message,
        cause,
      },
    },
    500
  );
};
