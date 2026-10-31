
import type {
  ApiError,
  ClassificationResult,
  Experiment,
  Health,
  ReportName,
  ReportResponse,
  ThemeResult,
} from "../types/api";

/**
 * DowntimeReason Miner — API Client
 *
 * Backend:
 * http://127.0.0.1:8000
 *
 * API prefix:
 * /api/v1
 *
 * Supports both environment values:
 * - http://127.0.0.1:8000
 * - http://127.0.0.1:8000/api/v1
 *
 * Prevents duplicate /api/v1 paths.
 */

const DEFAULT_API_URL = "http://127.0.0.1:8000";

const API_PREFIX = "/api/v1";

function normalizeBaseUrl(value: string): string {
  let url = value.trim().replace(/\/+$/, "");

  // Remove any duplicate API prefixes at the end.
  while (/\/api\/v1$/i.test(url)) {
    url = url.replace(/\/api\/v1$/i, "");
  }

  return url || DEFAULT_API_URL;
}

const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_API_URL;

const BASE_URL = normalizeBaseUrl(RAW_BASE_URL);

const API_URL = `${BASE_URL}${API_PREFIX}`;

/**
 * Existing frontend pages expect:
 *
 * {
 *   result: {
 *     ...
 *   }
 * }
 */
interface ResultEnvelope<T> {
  result: T;
}

/**
 * Safely build an API endpoint URL.
 */
function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}

/**
 * Convert backend errors into readable messages.
 */
function formatErrorDetail(detail: unknown): string {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (
          item !== null &&
          typeof item === "object" &&
          "msg" in item
        ) {
          return String(item.msg);
        }

        return JSON.stringify(item);
      })
      .join("; ");
  }

  if (detail !== null && detail !== undefined) {
    return JSON.stringify(detail);
  }

  return "Unexpected API error.";
}

/**
 * Centralized HTTP request handler.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(path);

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the FastAPI backend. " +
      "Make sure it is running at " +
      BASE_URL
    );
  }

  if (!response.ok) {
    let message =
      `HTTP ${response.status}: ${response.statusText}`;

    try {
      const body: unknown = await response.json();

      if (
        body !== null &&
        typeof body === "object" &&
        "detail" in body
      ) {
        message = formatErrorDetail(body.detail);
      }
    } catch {
      // Keep the HTTP status error.
    }

    const error = new Error(message) as ApiError;
    error.status = response.status;

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * JSON POST request options.
 */
function post(body: unknown): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify(body),
  };
}

/**
 * The backend may return either:
 *
 * {
 *   result: { ... }
 * }
 *
 * or:
 *
 * {
 *   label: "...",
 *   ...
 * }
 *
 * Normalize both formats so existing React
 * components can always access response.result.
 */
function normalizeResult<T>(
  payload: T | ResultEnvelope<T>
): ResultEnvelope<T> {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "result" in payload
  ) {
    return payload as ResultEnvelope<T>;
  }

  return {
    result: payload as T,
  };
}

/**
 * Public API service.
 */
export const api = {
  /**
   * GET /api/v1/health
   *
   * Checks backend health and model availability.
   */
  health(): Promise<Health> {
    return request<Health>("/health");
  },

  /**
   * POST /api/v1/classify
   *
   * Classify a maintenance note using
   * Experiment 01 or Experiment 02.
   */
  async classify(
    text: string,
    experiment: Experiment = "02"
  ): Promise<ResultEnvelope<ClassificationResult>> {
    const response = await request<
      ClassificationResult |
      ResultEnvelope<ClassificationResult>
    >(
      "/classify",
      post({
        text,
        experiment,
      })
    );

    return normalizeResult(response);
  },

  /**
   * Compare Experiment 01 and Experiment 02.
   *
   * Both models receive the exact same input.
   * The existing classification endpoint
   * is called twice.
   */
  async compare(
    text: string
  ): Promise<{
    experiment_01: ClassificationResult;
    experiment_02: ClassificationResult;
  }> {
    const [baseline, improved] = await Promise.all([
      api.classify(text, "01"),
      api.classify(text, "02"),
    ]);

    return {
      experiment_01: baseline.result,
      experiment_02: improved.result,
    };
  },

  /**
   * POST /api/v1/themes
   *
   * Assign an industrial maintenance note
   * to an unsupervised research cluster.
   */
  async theme(
    text: string
  ): Promise<ResultEnvelope<ThemeResult>> {
    const response = await request<
      ThemeResult |
      ResultEnvelope<ThemeResult>
    >(
      "/themes",
      post({
        text,
      })
    );

    return normalizeResult(response);
  },

  /**
   * Alias retained for compatibility.
   */
  themes(
    text: string
  ): Promise<ResultEnvelope<ThemeResult>> {
    return api.theme(text);
  },

  /**
   * GET /api/v1/analytics/{report_name}
   *
   * Retrieve a saved Kaggle research report.
   */
  report(
    name: ReportName,
    limit = 100
  ): Promise<ReportResponse> {
    const safeLimit = Math.max(
      1,
      Math.min(1000, Math.floor(limit))
    );

    const encodedName = encodeURIComponent(name);

    return request<ReportResponse>(
      `/analytics/${encodedName}?limit=${safeLimit}`
    );
  },
};
