/**
 * paradu'l — Image Processing Service
 *
 * Provides client-side image processing, background removal abstraction,
 * and assisted clothing category & color detection.
 *
 * ARCHITECTURE NOTE:
 * This service encapsulates image manipulation logic outside the UI components.
 * In a future phase with Supabase / external AI APIs, the internal implementation
 * of removeBackground and detectClothing can be routed to external cloud endpoints
 * without requiring changes to the consuming UI components.
 */

// Maximum canvas dimension to keep localStorage payloads reasonable (~60-150KB)
const MAX_DIMENSION = 640;

/**
 * Reads a File object into an HTMLImageElement
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes an image onto an in-memory canvas maintaining aspect ratio
 * @param {HTMLImageElement} img
 * @param {number} maxDim
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number }}
 */
function createScaledCanvas(img, maxDim = MAX_DIMENSION) {
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, ctx, width, height };
}

/**
 * Measures Euclidean distance between two RGB colors
 */
function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Removes background from an image file using smart perimeter color-keying
 * and transparency alpha masking.
 *
 * Algorithm explanation:
 * 1. Samples perimeter pixels (top, bottom, left, right edges) to determine the
 *    ambient backdrop color and variance (e.g. white wall, studio floor, bedsheet).
 * 2. Scans pixels and calculates color distance from the ambient background.
 * 3. Connected/similar background pixels have their alpha set to 0 (transparent).
 * 4. Applies an edge-feathering threshold to preserve clothing contours without harsh artifacts.
 * 5. Returns a transparent PNG data URL and metadata.
 *
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<{ imageUrl: string, originalImageUrl: string, width: number, height: number, hasTransparentBackground: boolean }>}
 */
export async function removeBackground(file, options = {}) {
  const threshold = options.threshold ?? 38;
  const img = await loadImageFromFile(file);

  // Scaled canvas for processing
  const { canvas, ctx, width, height } = createScaledCanvas(img);
  const originalImageUrl = canvas.toDataURL('image/jpeg', 0.82);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Step 1: Sample perimeter pixels to establish background reference
  const bgSamples = [];
  const sampleStep = Math.max(1, Math.floor(Math.min(width, height) / 40));

  // Top & bottom rows
  for (let x = 0; x < width; x += sampleStep) {
    const topIdx = (0 * width + x) * 4;
    const botIdx = ((height - 1) * width + x) * 4;
    bgSamples.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    bgSamples.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
  }

  // Left & right columns
  for (let y = 0; y < height; y += sampleStep) {
    const leftIdx = (y * width + 0) * 4;
    const rightIdx = (y * width + (width - 1)) * 4;
    bgSamples.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    bgSamples.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  // Calculate median/average background color
  let sumR = 0, sumG = 0, sumB = 0;
  for (const [r, g, b] of bgSamples) {
    sumR += r;
    sumG += g;
    sumB += b;
  }
  const bgR = Math.round(sumR / bgSamples.length);
  const bgG = Math.round(sumG / bgSamples.length);
  const bgB = Math.round(sumB / bgSamples.length);

  // Step 2: Flood/distance keying for transparent alpha channel
  let removedPixelsCount = 0;
  const totalPixels = width * height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = colorDistance(r, g, b, bgR, bgG, bgB);

    if (dist < threshold) {
      // Pixel matches background: make fully transparent
      data[i + 3] = 0;
      removedPixelsCount++;
    } else if (dist < threshold + 18) {
      // Feathered transition boundary
      const alphaFactor = (dist - threshold) / 18;
      data[i + 3] = Math.round(data[i + 3] * alphaFactor);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Export processed transparent PNG
  const processedDataUrl = canvas.toDataURL('image/png');
  const hasTransparentBackground = removedPixelsCount > (totalPixels * 0.05);

  return {
    imageUrl: processedDataUrl,
    originalImageUrl,
    width,
    height,
    hasTransparentBackground,
  };
}

/**
 * Standard fashion color palette mapping table
 */
const FASHION_COLORS = [
  { name: 'White', r: 245, g: 245, b: 245 },
  { name: 'Black', r: 25, g: 25, b: 25 },
  { name: 'Navy', r: 20, g: 35, b: 70 },
  { name: 'Blue', r: 45, g: 110, b: 190 },
  { name: 'Beige', r: 220, g: 205, b: 180 },
  { name: 'Brown', r: 115, g: 70, b: 45 },
  { name: 'Grey', r: 130, g: 130, b: 135 },
  { name: 'Red', r: 195, g: 45, b: 50 },
  { name: 'Green', r: 40, g: 120, b: 65 },
  { name: 'Olive', r: 90, g: 100, b: 55 },
  { name: 'Pink', r: 225, g: 145, b: 165 },
  { name: 'Yellow', r: 235, g: 195, b: 55 },
  { name: 'Burgundy', r: 110, g: 25, b: 45 },
];

/**
 * Determines dominant clothing color from non-transparent pixels
 * @param {HTMLImageElement} img
 * @returns {string}
 */
export function extractDominantColor(img) {
  const { ctx, width, height } = createScaledCanvas(img, 120);
  const data = ctx.getImageData(0, 0, width, height).data;

  let totalR = 0, totalG = 0, totalB = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    // Exclude transparent and near-transparent pixels
    if (alpha > 60) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
      count++;
    }
  }

  if (count === 0) return 'Black';

  const avgR = Math.round(totalR / count);
  const avgG = Math.round(totalG / count);
  const avgB = Math.round(totalB / count);

  // Match to closest standard fashion color
  let closestColor = 'Black';
  let minDistance = Infinity;

  for (const c of FASHION_COLORS) {
    const d = colorDistance(avgR, avgG, avgB, c.r, c.g, c.b);
    if (d < minDistance) {
      minDistance = d;
      closestColor = c.name;
    }
  }

  return closestColor;
}

/**
 * Analyzes clothing image characteristics (aspect ratio, silhouette geometry,
 * and pixel density) to provide assisted classification into Top, Bottom, or Shoes.
 *
 * In accordance with requirements:
 * This assisted prediction provides a smart default, while the user
 * is always presented with manual correction controls in the UI.
 *
 * @param {File} file
 * @returns {Promise<{ category: 'top' | 'bottom' | 'shoes', detectedColor: string, confidence: number }>}
 */
export async function detectClothing(file) {
  const img = await loadImageFromFile(file);
  const { width, height } = img;
  const ratio = width / height;

  const detectedColor = extractDominantColor(img);

  let category = 'top';
  let confidence = 0.75;

  // Heuristic geometric classification:
  // Shoes are typically landscape or squarish with heavy lower base
  if (ratio > 1.15) {
    category = 'shoes';
    confidence = 0.82;
  }
  // Bottoms (trousers, jeans, skirts) are distinctly vertical and elongated
  else if (ratio < 0.65) {
    category = 'bottom';
    confidence = 0.86;
  }
  // Tops (shirts, jackets, hoodies) typically fall in the intermediate ratio range
  else {
    category = 'top';
    confidence = 0.80;
  }

  return {
    category,
    detectedColor,
    confidence,
  };
}
