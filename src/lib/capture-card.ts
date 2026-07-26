/**
 * Reliable DOM → PNG capture for Sunday Stack Check.
 *
 * Critical mobile bug we fixed:
 * - Never leave the export stage at high z-index above the lightbox.
 * - Capture under a solid full-viewport black mask so the giant card
 *   is never visible behind UI.
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
          if ("decode" in img) {
            img.decode().then(done).catch(done);
          }
        }),
    ),
  );
}

async function blobLooksBlank(blob: Blob): Promise<boolean> {
  if (blob.size < 8_000) return true;
  if (blob.size < 40_000) return blob.size < 12_000;
  return false;
}

function restoreStyles(
  el: HTMLElement,
  prev: Record<string, string>,
) {
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
  el.style.clipPath = prev.clipPath;
  el.removeAttribute("data-capturing");
}

/**
 * Capture `el` at exact pixel size.
 * Stage is painted off-screen under a black mask — never above the lightbox.
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
    clipPath: el.style.clipPath,
  };

  // Full-viewport opaque mask — above page, above stage, BELOW lightbox (z 99999)
  const mask = document.createElement("div");
  mask.setAttribute("data-export-mask", "true");
  Object.assign(mask.style, {
    position: "fixed",
    left: "0",
    top: "0",
    right: "0",
    bottom: "0",
    width: "100vw",
    height: "100dvh",
    minHeight: "100vh",
    background: "#000000",
    zIndex: "9000",
    pointerEvents: "none",
  });
  document.body.appendChild(mask);

  // Stage under the mask (z 8999). Never use billions — that sat above lightbox z-200.
  el.setAttribute("data-capturing", "true");
  Object.assign(el.style, {
    position: "fixed",
    left: "0",
    top: "0",
    right: "auto",
    bottom: "auto",
    width: `${size.w}px`,
    height: `${size.h}px`,
    zIndex: "8999",
    opacity: "1",
    transform: "none",
    pointerEvents: "none",
    visibility: "visible",
    clipPath: "none",
  });

  try {
    await waitForImages(el);
    await sleep(80);
    el.getBoundingClientRect();
    await sleep(40);

    const opts = {
      width: size.w,
      height: size.h,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#050506",
      style: {
        transform: "none",
        margin: "0",
        opacity: "1",
        visibility: "visible",
      },
      skipFonts: true,
    } as const;

    let blob = await toBlob(el, opts);
    if (!blob || (await blobLooksBlank(blob))) {
      await sleep(120);
      blob = await toBlob(el, opts);
    }

    if (!blob || (await blobLooksBlank(blob))) {
      const dataUrl = await toPng(el, opts);
      const res = await fetch(dataUrl);
      blob = await res.blob();
      if (await blobLooksBlank(blob)) {
        throw new Error("Capture produced a blank image");
      }
      // Restore BEFORE returning so React lightbox never fights a floating stage
      restoreStyles(el, prev);
      mask.remove();
      return { dataUrl, blob };
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.readAsDataURL(blob!);
    });

    restoreStyles(el, prev);
    mask.remove();
    return { dataUrl, blob };
  } catch (e) {
    restoreStyles(el, prev);
    mask.remove();
    throw e;
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

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2_000);
}

export async function saveImageCrossPlatform(
  blob: Blob,
  filename: string,
): Promise<"lightbox" | "download"> {
  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  if (isIOS) {
    return "lightbox";
  }

  triggerDownload(blob, filename);
  return "download";
}

export function openXCompose(tweetText: string) {
  const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  const isMobileUa =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobileUa) {
    window.location.assign(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
