import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// CLOUDINARY_URL 환경변수가 설정되어 있으면 SDK가 자동으로 파싱한다.
// 형식: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// 만약 개별 변수를 사용하고 싶다면 아래처럼 직접 설정도 가능:
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

if (!process.env.CLOUDINARY_URL) {
  console.warn("⚠️ CLOUDINARY_URL 환경변수가 설정되지 않았습니다. 이미지 업로드가 실패할 수 있습니다.");
}

/**
 * multer 메모리 버퍼(Buffer)를 Cloudinary에 업로드한다.
 * @param buffer  파일 버퍼
 * @param folder  Cloudinary 폴더명 (예: "profile", "item", "chat")
 * @returns       Cloudinary 응답 (secure_url 등 포함)
 */
export function uploadBuffer(
  buffer: Buffer,
  folder: string,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `caremanager/${folder}`,
        resource_type: "image",
        // 자동 품질 최적화 & webp 포맷 변환
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary 업로드 결과가 없습니다."));
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export { cloudinary };

