import ImageKit from "imagekit";
import { HttpError } from "./apiResponse";

let client: ImageKit | null = null;

function getClient(): ImageKit {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new HttpError(
      500,
      "ImageKit is not configured (set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT)",
    );
  }

  if (!client) {
    client = new ImageKit({ publicKey, privateKey, urlEndpoint });
  }
  return client;
}

export interface UploadedImage {
  url: string;
  altText: string;
  isMain: boolean;
}

// Upload a set of File objects (from multipart FormData) to ImageKit and return
// the structured ProductImage list the Product model stores.
export async function uploadProductImages(
  files: File[],
  altPrefix: string,
  startAsMain = true,
): Promise<UploadedImage[]> {
  const ik = getClient();
  const results: UploadedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await ik.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name || `image-${i}`}`,
      folder: "/folaluxe/products",
      useUniqueFileName: true,
    });
    results.push({
      url: uploaded.url,
      altText: altPrefix,
      isMain: startAsMain && i === 0,
    });
  }

  return results;
}
