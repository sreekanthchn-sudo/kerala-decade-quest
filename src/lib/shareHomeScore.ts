/** Capture off-screen #home-share-score-frame and return PNG blob. */
export async function captureHomeSharePng(): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  try {
    await document.fonts?.ready;
  } catch {
    /* ignore */
  }

  await new Promise((r) => setTimeout(r, 80));
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const el = document.getElementById('home-share-score-frame');
  if (!el) return null;

  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(el as HTMLElement, {
      scale: 2,
      backgroundColor: '#0a0a0a',
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
    });
    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 0.95);
    });
  } catch {
    return null;
  }
}

export async function shareHomeScoreImageAndText(params: {
  title: string;
  text: string;
  url: string;
}): Promise<'ok' | 'cancel' | 'need-fallback'> {
  const { title, text, url } = params;
  if (typeof navigator === 'undefined' || !navigator.share) {
    return 'need-fallback';
  }

  const blob = await captureHomeSharePng();
  const file =
    blob &&
    new File([blob], 'knowkeralam-quiz-score.png', {
      type: 'image/png',
    });

  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title, text, files: [file] });
      return 'ok';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return 'cancel';
    }
  }

  try {
    await navigator.share({ title, text, url });
    return 'ok';
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') return 'cancel';
    return 'need-fallback';
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a');
  const u = URL.createObjectURL(blob);
  a.href = u;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(u);
}
