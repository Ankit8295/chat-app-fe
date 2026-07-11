import { isAxiosError } from "axios";

export const API_ERROR_BACKEND_UNAVAILABLE = "error-backend-unavailable";

export type BackendApiError = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type ApiError = {
  message: string;
};

export type ApiFormError = ApiError & {
  fieldErrors?: Record<string, string[]>;
};

export function mapBackendFieldErrors(fieldErrors?: Record<string, string>) {
  if (!fieldErrors) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, message]) => [field, [message]]),
  );
}

export function normalizeApiError(
  error: unknown,
  fallbackMessage: string,
): ApiError {
  const apiError = getBackendApiError(error);

  if (!apiError) {
    return { message: API_ERROR_BACKEND_UNAVAILABLE };
  }

  return {
    message: apiError.message ?? fallbackMessage,
  };
}

export function normalizeApiFormError(
  error: unknown,
  fallbackMessage: string,
): ApiFormError {
  const apiError = getBackendApiError(error);

  if (!apiError) {
    return { message: API_ERROR_BACKEND_UNAVAILABLE };
  }

  return {
    message: apiError.message ?? fallbackMessage,
    fieldErrors: mapBackendFieldErrors(apiError.fieldErrors),
  };
}

function getBackendApiError(error: unknown) {
  if (!isAxiosError<BackendApiError>(error)) {
    return undefined;
  }

  return error.response?.data;
}
