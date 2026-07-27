import { revalidatePath, revalidateTag } from "next/cache";
import {
  dailySnapshotId,
  fetchStackCheckSnapshot,
} from "../../../../lib/stack-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily Stack Check publish job.
 * Vercel Cron: 21:00 UTC (`0 21 * * *` in vercel.json).
 *
 * Auth: Authorization: Bearer $CRON_SECRET
 * (Vercel injects this for scheduled crons when CRON_SECRET is set.)
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const snapshotId = dailySnapshotId();

  // Invalidate published cache so the next page load rebuilds today's snapshot
  // Next.js 16 requires a cache life profile (e.g. "max" = SWR)
  revalidateTag("stack-check", "max");
  revalidateTag(`stack-check-${snapshotId}`, "max");
  revalidatePath("/stack-check");

  try {
    // Fresh pull for the cron response (also exercises all adapters)
    const snap = await fetchStackCheckSnapshot();
    return Response.json({
      ok: true,
      snapshotId: snap.snapshotId,
      weekEnding: snap.weekEnding,
      generatedAt: snap.generatedAt,
      tweetMarker: snap.tweetMarker,
      sourcesOk: snap.sources.filter((s) => s.ok).length,
      sourcesTotal: snap.sources.length,
      errors: snap.errors,
    });
  } catch (e) {
    return Response.json(
      {
        ok: false,
        snapshotId,
        error: e instanceof Error ? e.message : "Snapshot failed",
      },
      { status: 500 },
    );
  }
}
