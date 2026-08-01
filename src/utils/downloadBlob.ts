export const downloadBlob = (blob: Blob, filename: string): void => {
  const pdfBlob =
    blob.type && blob.type.includes('pdf')
      ? blob
      : new Blob([blob], { type: 'application/pdf' });
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const asPdfBlob = (blob: Blob): Blob =>
  blob.type && blob.type.includes('pdf')
    ? blob
    : new Blob([blob], { type: 'application/pdf' });

/** URL temporal para embeber o abrir el PDF (sin forzar descarga). */
export const createPdfObjectUrl = (blob: Blob): string => URL.createObjectURL(asPdfBlob(blob));

export const revokePdfObjectUrl = (url: string | null | undefined): void => {
  if (url) URL.revokeObjectURL(url);
};

export const openBlob = (blob: Blob): void => {
  const url = createPdfObjectUrl(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export const assertPdfBlob = async (blob: Blob): Promise<Blob> => {
  const header = await blob.slice(0, 5).text();
  if (!header.startsWith('%PDF')) {
    let message = 'El archivo descargado no es un PDF válido';
    try {
      const text = await blob.text();
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed?.message) message = parsed.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return new Blob([blob], { type: 'application/pdf' });
};
