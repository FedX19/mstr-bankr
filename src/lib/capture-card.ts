/**
 * Reliable DOM → PNG capture for Sunday Stack Check.
 *
 * Blank-image pitfalls this avoids:
 * - Nodes parked at left:-9999px (browsers skip paint)
 * - opacity:0 / visibility:hidden (html-to-image often yields empty canvas)
 * - Capturing before images decode
 * - Oversized style overrides that collapse layout
 */

export type CaptureSize = { w: number; h: number };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForImages(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          // decode() is more reliable when available
          if ("decode" in img) {
            img.decode().then(done).catch(done);
          }
        }),
    ),
  );
}

/** Heuristic: all-black / near-empty blob is a failed capture */
async function blobLooksBlank(blob: Blob): Promise<boolean> {
  if (blob.size < 8_000) return true;
  // Quick size check is enough for most failures (true blanks are tiny)
  if (blob.size < 40_000) {
    // Could still be a sparse card; allow through if reasonably sized PNG
    return blob.size < 12_000;
  }
  return false;
}

/**
 * Capture `el` at exact pixel size. Temporarily parks the node in-viewport
 * at full opacity so the browser paints it (required for html-to-image).
 */
export async function captureElementPng(
  el: HTMLElement,
  size: CaptureSize,
): Promise<{ dataUrl: string; blob: Blob }> {
  const { toPng, toBlob } = await import("html-to-image");

  const prev = {
    position: el.style.position,
    left: el.style.left,
    top: el.style.top,
    right: el.style.right,
    bottom: el.style.bottom,
    width: el.style.width,
    height: el.style.height,
    zIndex: el.style.zIndex,
    opacity: el.style.opacity,
    transform: el.style.transform,
    pointerEvents: el.style.pointerEvents,
    visibility: el.style.visibility,
  };

  // Solid black full-screen mask so users never see the giant export stage flash
  const mask = document.createElement("div");
  mask.setAttribute("data-export-mask", "true");
  mask.style.cssText = [
    "position:fixed",
    "inset:0",
    "background:#050506",
    "z-index:2147483646",
    "pointer-events:none",
  ].join(";");
  document.body.appendChild(mask);

  // Paint on-screen under the mask (html-to-image still serializes the node)
  el.style.position = "fixed";
  el.style.left = "0";
  el.style.top = "0";
  el.style.right = "auto";
  el.style.bottom = "auto";
  el.style.width = `${size.w}px`;
  el.style.height = `${size.h}px`;
  el.style.zIndex = "2147483645"; // under mask
  el.style.opacity = "1";
  el.style.transform = "none";
  el.style.pointerEvents = "none";
  el.style.visibility = "visible";

  try {
    await waitForImages(el);
    // Let layout + paint settle (critical on iOS Safari)
    await sleep(80);
    el.getBoundingClientRect();
    await sleep(40);

    const opts = {
      width: size.w,
      height: size.h,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#050506",
      // Do NOT force position:relative here — that collapses our fixed stage
      style: {
        transform: "none",
        margin: "0",
        opacity: "1",
        visibility: "visible",
      },
      // Skip external stylesheets that can hang iOS
      skipFonts: true,
    } as const;

    let blob = await toBlob(el, opts);
    if (!blob || (await blobLooksBlank(blob))) {
      // Retry once after another paint tick
      await sleep(120);
      blob = await toBlob(el, opts);
    }

    if (!blob || (await blobLooksBlank(blob))) {
      // Last resort: toPng then convert
      const dataUrl = await toPng(el, opts);
      const res = await fetch(dataUrl);
      blob = await res.blob();
      if (await blobLooksBlank(blob)) {
        throw new Error("Capture produced a blank image");
      }
      return { dataUrl, blob };
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.readAsDataURL(blob!);
    });

    return { dataUrl, blob };
  } finally {
    mask.remove();
    // Restore offscreen parking styles
    el.style.position = prev.position;
    el.style.left = prev.left;
    el.style.top = prev.top;
    el.style.right = prev.right;
    el.style.bottom = prev.bottom;
    el.style.width = prev.width;
    el.style.height = prev.height;
    el.style.zIndex = prev.zIndex;
    el.style.opacity = prev.opacity;
    el.style.transform = prev.transform;
    el.style.pointerEvents = prev.pointerEvents;
    el.style.visibility = prev.visibility;
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(",");
  const mime = /data:([^;]+);/.exec(header)?.[1] ?? "image/png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/** Desktop download (works in Chrome/Firefox; limited on iOS Safari) */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  // Delay revoke so Safari can start the download
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2_000);
}

/**
 * Save image WITHOUT the OS share sheet (no Windows / iOS share UI).
 * - iOS: return "lightbox" so the app shows long-press save UI
 * - Desktop: anchor download
 */
export async function saveImageCrossPlatform(
  blob: Blob,
  filename: string,
): Promise<"lightbox" | "download"> {
  // Never call navigator.share here — that opens Microsoft/iOS share sheets.

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      // iPadOS 13+ reports as Mac; detect touch Macs
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  if (isIOS) {
    return "lightbox";
  }

  triggerDownload(blob, filename);
  return "download";
}

/** Open X compose directly — never OS share sheet */
export function openXCompose(tweetText: string) {
  const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  // Prefer same-tab navigation on mobile so X can offer “Open in app”
  const isMobileUa =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobileUa) {
    window.location.assign(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
