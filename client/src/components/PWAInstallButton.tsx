import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [forceHomePopup, setForceHomePopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // PWA 설치 조건을 충족하는 경우에만 처리
      console.log("PWA 설치 조건 충족: beforeinstallprompt 이벤트 발생");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 설치 상태 체크
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone
      ) {
        setIsStandalone(true);
        return;
      }

      // 즉시 설치 프롬프트 표시
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 1000); // 1초 후 표시
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      console.log("PWA가 설치되었습니다");
    };

    // 이벤트 리스너 등록
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Service Worker 등록 및 업데이트 감지 (public/sw.js 기준)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((e) =>
          console.warn("서비스워커 등록 실패(이미 등록되었을 수 있음):", e),
        );
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        setShowUpdateAvailable(true);
      });
    }

    // 홈 화면에서는 설치 이벤트가 없더라도 강제로 팝업 표시
    const onHome =
      typeof window !== "undefined" &&
      window.location &&
      window.location.pathname === "/";
    if (
      onHome &&
      !(
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone
      )
    ) {
      setForceHomePopup(true);
      setShowInstallPrompt(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // 사용자에게 설치 프롬프트 표시
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("사용자가 PWA 설치를 수락했습니다");
      } else {
        console.log("사용자가 PWA 설치를 거부했습니다");
      }
    } catch (error) {
      console.error("PWA 설치 중 오류 발생:", error);
    } finally {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // 사용자의 첫 상호작용 시 자동으로 설치 프롬프트를 띄움(브라우저 요구: 사용자 제스처 필요)
  useEffect(() => {
    if (!deferredPrompt || isStandalone || !showInstallPrompt) return;
    const trigger = async () => {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch (_) {
      } finally {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        setForceHomePopup(false);
        document.removeEventListener("click", trigger, true);
        document.removeEventListener("touchstart", trigger, true);
      }
    };
    document.addEventListener("click", trigger, true);
    document.addEventListener("touchstart", trigger, true);
    return () => {
      document.removeEventListener("click", trigger, true);
      document.removeEventListener("touchstart", trigger, true);
    };
  }, [deferredPrompt, isStandalone, showInstallPrompt]);

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    // 24시간 동안 다시 표시하지 않음
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  const handleUpdateClick = () => {
    window.location.reload();
  };

  // 표시 조건: 홈 강제 표시 또는 일반 표시, 단 설치됨이면 숨김
  const shouldShowInstallPrompt = () => {
    if (!showInstallPrompt && !forceHomePopup) return false;

    // 이미 설치된 상태인지 확인
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return false;
    }

    // 24시간 제한 임시 비활성화 (디버깅 목적)
    // const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    // if (dismissedTime) {
    //   const timeDiff = Date.now() - parseInt(dismissedTime);
    //   const twentyFourHours = 24 * 60 * 60 * 1000;
    //   if (timeDiff < twentyFourHours) {
    //     return false;
    //   }
    // }

    return true;
  };

  if (isStandalone) return null;
  if (!shouldShowInstallPrompt() && !showUpdateAvailable) return null;

  return (
    <>
      {/* PWA 설치 프롬프트 */}
      {shouldShowInstallPrompt() && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 md:bottom-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                시니어랑 앱 설치
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                더 빠른 접속과 오프라인 사용을 위해 앱을 설치하세요
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-1" />
                설치
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismissInstall}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 업데이트 알림 */}
      {showUpdateAvailable && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-blue-600 text-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium">새 버전 사용 가능</h3>
              <p className="text-xs opacity-90 mt-1">
                새로운 기능과 개선사항이 포함된 업데이트가 있습니다
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleUpdateClick}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                업데이트
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUpdateAvailable(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
