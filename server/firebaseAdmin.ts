import admin from "firebase-admin";
import "dotenv/config";

/**
 * Railway / Render 등 PaaS 환경에서 FIREBASE_PRIVATE_KEY 를 안전하게 파싱한다.
 * - 양쪽 큰따옴표가 포함된 경우 제거
 * - 리터럴 문자열 \n 을 실제 줄바꿈으로 변환
 */
function parsePrivateKey(raw?: string): string {
  if (!raw) return "";
  // 1) 양쪽 큰따옴표 제거 (Railway에서 값을 복사할 때 포함될 수 있음)
  let key = raw;
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  // 2) 리터럴 \n → 실제 줄바꿈 변환
  key = key.replace(/\\n/g, "\n");
  return key;
}

// 서비스 계정 키 – 환경 변수(.env)에서 읽어옴
const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || "")}`,
  universe_domain: "googleapis.com",
} as admin.ServiceAccount;

if (!admin.apps.length) {
  // private_key 가 비어 있으면 Firebase Admin 초기화를 건너뛰어 서버 기동은 유지
  if (privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK 초기화 완료");
  } else {
    console.warn("⚠️ FIREBASE_PRIVATE_KEY 가 비어 있어 Firebase Admin 초기화를 건너뜁니다.");
    admin.initializeApp(); // credential 없이 초기화 (인증 기능 제한됨)
  }
}

export const adminAuth = admin.auth(); 