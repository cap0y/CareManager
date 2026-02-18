import { useEffect, useMemo, useRef, useState } from "react";

const AvatarChatPage = () => {
  const vtuberBaseUrl = useMemo(() => {
    const envUrl = (import.meta as any).env?.VITE_VTUBER_URL as
      | string
      | undefined;
    // 기본값은 로컬 서버 포트
    const url =
      envUrl && envUrl.trim().length > 0
        ? envUrl.trim()
        : "https://aiavatar.up.railway.app/chat?model=10an_culture";
    // 마지막 슬래시 정리
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }, []);

  // 메인 UI가 없는 경우(404) 사용자가 직접 주소창에서 /web-tool로 이동할 수 있도록
  const iframeSrc = `${vtuberBaseUrl}/`;

  // 모바일 화면 유지 + 설정(사이드바) 접근용 데스크톱 보기 토글
  const [desktopMode, setDesktopMode] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const desktopWidth = 800; // 내부 앱이 사이드바를 노출하는 기준 폭

  // 뷰포트 실측 기반 가용 높이 계산(하단 공백 제거)
  const [containerPxHeight, setContainerPxHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const updateHeight = () => {
      const el = containerRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const vv = (window as any).visualViewport;
      const viewportH = vv?.height ?? window.innerHeight;
      // 약간의 여유 픽셀(스크롤바/경계) 보정
      const padding = 4;
      const next = Math.max(50, Math.floor(viewportH - top - padding));
      setContainerPxHeight(next);
    };

    updateHeight();
    const vv = (window as any).visualViewport;
    vv?.addEventListener("resize", updateHeight);
    vv?.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);
    return () => {
      vv?.removeEventListener("resize", updateHeight);
      vv?.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!desktopMode) {
      setScale(1);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const newScale = Math.min(1, width / desktopWidth);
      setScale(newScale);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [desktopMode]);

  return (
    <div className="min-h-[100dvh] w-full bg-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-1">
        <h2 className="text-1xl sm:text-1xl font-bold text-gray-800 mb-1">
          말벗(아바타) 대화
        </h2>
        {/* 모바일 하단 잘림 방지를 위해 100dvh 사용, iOS 안전 영역 고려 */}
        <div
          ref={containerRef}
          className="relative w-full rounded-xl shadow border bg-white overflow-hidden"
          style={{
            height: containerPxHeight
              ? `${containerPxHeight}px`
              : "calc(100dvh - 120px - env(safe-area-inset-bottom, 0px))",
          }}
        >
          {/* 토글 버튼 */}
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            {!desktopMode ? (
              <button
                className="px-3 py-1 rounded-md text-xs bg-indigo-600 text-white shadow"
                onClick={() => setDesktopMode(true)}
              >
                설정 열기
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded-md text-xs bg-gray-700 text-white shadow"
                onClick={() => setDesktopMode(false)}
              >
                기본 보기
              </button>
            )}
          </div>

          {desktopMode ? (
            <div
              style={{
                width: `${desktopWidth}px`,
                height: `calc((100dvh - 120px - env(safe-area-inset-bottom, 0px)) / ${scale})`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <iframe
                title="Open-LLM-VTuber"
                src={iframeSrc}
                className="w-full h-full border-0 block"
                allow="microphone; camera; clipboard-read; clipboard-write; autoplay"
              />
            </div>
          ) : (
            <iframe
              title="Open-LLM-VTuber"
              src={iframeSrc}
              className="w-full h-full border-0 block"
              allow="microphone; camera; clipboard-read; clipboard-write; autoplay"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarChatPage;
