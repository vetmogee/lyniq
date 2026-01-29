/**
 * Utility functions for working with images stored as JSON in the database
 */

export interface ImageData {
  data: string; // base64 encoded image data
  mimeType: string;
  filename: string | null;
}

/**
 * Parse image data from JSON string stored in database
 */
export function parseImageData(jsonString: string): ImageData | null {
  try {
    return JSON.parse(jsonString) as ImageData;
  } catch {
    return null;
  }
}

/**
 * Get data URL from image data JSON string for display in img tags
 */
export function getImageDataUrl(jsonString: string): string | null {
  const imageData = parseImageData(jsonString);
  if (!imageData || !imageData.data) {
    return null;
  }
  return `data:${imageData.mimeType};base64,${imageData.data}`;
}

/**
 * Convert File to base64 JSON string format
 */
export async function fileToImageDataJson(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString('base64');
  
  return JSON.stringify({
    data: base64Data,
    mimeType: file.type,
    filename: file.name,
  });
}
