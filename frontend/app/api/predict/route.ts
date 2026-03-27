/**
 * app/api/predict/route.ts
 * ─────────────────────────────────────────────────────────
 * Next.js Route Handler — proxies POST /api/predict
 * to your local Flask / FastAPI ML backend.
 * ─────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";

const ML_BACKEND_URL =
  process.env.ML_BACKEND_URL ?? "http://localhost:5000";

interface PredictRequestBody {
  query: string;
}

interface MLBackendResponse {
  result: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: PredictRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const { query } = body;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return NextResponse.json(
      { error: "Field 'query' is required and must be a non-empty string." },
      { status: 422 }
    );
  }

  let mlResponse: Response;
  try {
    mlResponse = await fetch(`${ML_BACKEND_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    const message = isTimeout
      ? "ML backend timed out after 15 seconds."
      : "Cannot reach ML backend. Is it running on " + ML_BACKEND_URL + "?";

    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!mlResponse.ok) {
    const text = await mlResponse.text().catch(() => "");
    return NextResponse.json(
      { error: `ML backend returned ${mlResponse.status}: ${text}` },
      { status: mlResponse.status }
    );
  }

  let mlData: MLBackendResponse;
  try {
    mlData = await mlResponse.json();
  } catch {
    return NextResponse.json(
      { error: "ML backend returned invalid JSON." },
      { status: 502 }
    );
  }

  return NextResponse.json({ result: mlData.result ?? "No result returned." });
}

export function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}