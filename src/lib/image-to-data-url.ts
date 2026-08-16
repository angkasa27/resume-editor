const PROFILE_PHOTO_MAX_DIMENSION = 512;
const PROFILE_PHOTO_QUALITY = 0.85;
const PROFILE_PHOTO_MAX_BYTES = 8 * 1024 * 1024;

type ReadProfilePhotoError =
  | "unsupported-type"
  | "too-large"
  | "decode-failed"
  | "encode-failed";

export class ProfilePhotoError extends Error {
  readonly kind: ReadProfilePhotoError;

  constructor(kind: ReadProfilePhotoError, message: string) {
    super(message);
    this.kind = kind;
  }
}

/** A crop rectangle in source-image pixels (matches react-easy-crop's `Area`). */
export type CropArea = { x: number; y: number; width: number; height: number };

/**
 * Validate (type + size) and decode an image file. Caller owns `objectUrl` and
 * must `URL.revokeObjectURL` it. Throws `ProfilePhotoError` on bad input.
 */
export async function loadImageFile(
  file: File,
): Promise<{ objectUrl: string; image: HTMLImageElement }> {
  if (!file.type.startsWith("image/")) {
    throw new ProfilePhotoError(
      "unsupported-type",
      "Please choose an image file (PNG, JPG, WEBP).",
    );
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new ProfilePhotoError(
      "too-large",
      "Image is too large. Choose a file under 8 MB.",
    );
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    return { objectUrl, image };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

/**
 * Draw a crop region onto a canvas, downscale to `maxDimension`, and return a
 * JPEG data URL.
 */
export function cropImageToDataUrl(
  image: HTMLImageElement,
  area: CropArea,
  {
    maxDimension = PROFILE_PHOTO_MAX_DIMENSION,
    quality = PROFILE_PHOTO_QUALITY,
  }: { maxDimension?: number; quality?: number } = {},
): string {
  const { width, height } = fitWithin(area.width, area.height, maxDimension);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new ProfilePhotoError(
      "encode-failed",
      "Could not process the image. Try a different file.",
    );
  }
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height,
  );
  return canvas.toDataURL("image/jpeg", quality);
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new ProfilePhotoError(
          "decode-failed",
          "Could not read the image. Try a different file.",
        ),
      );
    image.src = src;
  });
}

/**
 * Scale (width, height) so neither side exceeds `max`, preserving aspect ratio.
 * Pure — unit-tested. Returns the input unchanged when already within.
 */
export function fitWithin(width: number, height: number, max: number) {
  if (width <= max && height <= max) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  const scale = width >= height ? max / width : max / height;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}
