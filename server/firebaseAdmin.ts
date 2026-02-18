import admin from "firebase-admin";
import "dotenv/config";

/**
 * Railway / Render 등 PaaS 환경에서 FIREBASE_PRIVATE_KEY 를 안전하게 파싱한다.
 * 다양한 입력 형태를 모두 처리:
 *  1) JSON 문자열로 감싸진 경우 (큰따옴표 제거)
 *  2) 리터럴 \\n → 실제 줄바꿈 변환
 *  3) 이미 실제 줄바꿈이 포함된 경우 그대로 사용
 *  4) PEM 헤더/푸터가 올바른지 검증
 */
function parsePrivateKey(raw?: string): string {
  if (!raw) {
    console.warn("⚠️ FIREBASE_PRIVATE_KEY 가 비어 있습니다.");
    return "";
  }

  let key = raw.trim();

  // 디버깅: 원본 값의 길이와 앞/뒤 문자 출력 (키 내용은 노출하지 않음)
  console.log(`🔑 Private Key 파싱 시작 - 원본 길이: ${key.length}, 앞 30자: "${key.substring(0, 30)}..."`);

  // 1) JSON.parse 시도 — JSON 문자열로 전달된 경우 (예: "\"-----BEGIN...\"")
  if (key.startsWith('"') || key.startsWith("'")) {
    try {
      const parsed = JSON.parse(key);
      if (typeof parsed === "string") {
        key = parsed;
        console.log("🔑 JSON.parse 로 언래핑 성공");
      }
    } catch {
      // JSON이 아니면 수동으로 따옴표 제거
      if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
      ) {
        key = key.slice(1, -1);
        console.log("🔑 수동 따옴표 제거 완료");
      }
    }
  }

  // 2) 리터럴 \\n → 실제 줄바꿈 변환 (두 글자 문자열 '\' + 'n' → 진짜 개행)
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
    console.log("🔑 리터럴 \\\\n → 줄바꿈 변환 완료");
  }

  // 3) PEM 헤더/푸터 검증
  if (!key.includes("-----BEGIN")) {
    console.error("❌ Private Key 에 PEM 헤더(-----BEGIN)가 없습니다!");
    console.error(`❌ 현재 키의 앞 50자: "${key.substring(0, 50)}"`);
  }
  if (!key.includes("-----END")) {
    console.error("❌ Private Key 에 PEM 푸터(-----END)가 없습니다!");
  }

  // 4) 줄바꿈 개수 확인 (정상적인 RSA 키는 ~28줄)
  const lineCount = key.split("\n").length;
  console.log(`🔑 Private Key 파싱 완료 - 줄 수: ${lineCount}, 총 길이: ${key.length}`);

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