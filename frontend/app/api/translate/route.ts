import { NextResponse } from "next/server";

async function translateWithRetry(text: string, targetLang: string, retries = 3): Promise<string> {
  const cleanText = typeof text === 'string' ? text.trim() : "";
  if (!cleanText || targetLang === "en") return text;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`,
        { signal: AbortSignal.timeout(5000) } // 5s timeout
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let translated = "";
      if (data && data[0]) {
        data[0].forEach((item: any) => {
          if (item[0]) translated += item[0];
        });
      }
      return translated || text;
    } catch (err) {
      if (i === retries - 1) return text; // fallback to original on final retry
      await new Promise(r => setTimeout(r, 500 * (i + 1))); // wait 500ms, 1000ms...
    }
  }
  return text;
}

export async function POST(req: Request) {
  try {
    const { texts, targetLang } = await req.json();
    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ results: texts });
    }

    // Process in batches of 15 to avoid Google Translate 429 / 500 Timeouts on massive arrays
    const CHUNK_SIZE = 15;
    const results: string[] = [];

    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const chunk = texts.slice(i, i + CHUNK_SIZE);
      const chunkResults = await Promise.all(chunk.map((text: string) => translateWithRetry(text, targetLang || "en")));
      results.push(...chunkResults);
      // Small 100ms breather between chunks to ensure network stability
      if (i + CHUNK_SIZE < texts.length) {
        await new Promise(r => setTimeout(r, 100));
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    // On massive failure, instantly return the original english array to prevent UI lag
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
