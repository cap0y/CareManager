import { useMemo } from "react";

const AvatarChatPage = () => {
  const vtuberBaseUrl = useMemo(() => {
    const envUrl = (import.meta as any).env?.VITE_VTUBER_URL as string | undefined;
    // 기본값은 로컬 서버 포트
    const url = envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:12393";
    // 마지막 슬래시 정리
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }, []);

  // 메인 UI가 없는 경우(404) 사용자가 직접 주소창에서 /web-tool로 이동할 수 있도록
  const iframeSrc = `${vtuberBaseUrl}/`;

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">말벗(아바타) 대화</h1>
        <div className="w-full rounded-xl overflow-hidden shadow border bg-white" style={{height: "calc(100vh - 200px)"}}>
          <iframe
            title="Open-LLM-VTuber"
            src={iframeSrc}
            className="w-full h-full border-0"
            allow="microphone; camera; clipboard-read; clipboard-write; autoplay"
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarChatPage;


