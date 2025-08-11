import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  createOrGetChatRoom, 
  sendChatMessage, 
  getChatMessages,
  subscribeToMessages,
  getUserChatRooms,
  markMessagesAsRead,
  db
} from "@/firebase";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { serverTimestamp } from "firebase/firestore";
import { normalizeImageUrl } from '@/lib/url';

// 메시지 타입에 이미지 URL 추가
interface Message {
  id: number | string;
  content: string;
  sender: string;
  timestamp: string;
  raw?: any; // Firestore 원본 데이터 (필요시)
  imageUrl?: string; // 이미지 URL 필드 추가
}

// 채팅 파트너 정보 타입
interface ChatPartner {
  id: number | string;
  name: string;
  imageUrl?: string;
}

// 채팅 목록 항목 타입
interface ChatListItem {
  id: number | string;
  senderId: number | string;
  senderName: string;
  senderImage?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

// Firestore 채팅방 타입 정의
interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastActivity?: {
    seconds: number;
    nanoseconds: number;
  };
  createdAt?: any;
}

// Firestore 메시지 타입에 이미지 URL 추가
interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  read: boolean;
  imageUrl?: string; // 이미지 URL 필드 추가
}

const Chat = () => {
  const { user, setShowAuthModal } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [chatList, setChatList] = useState<ChatListItem[]>([]); // 빈 배열로 시작
  const [needAuth, setNeedAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageListenerRef = useRef<(() => void) | null>(null);
  
  // 전화번호 표시 모달 상태
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // 상태 관리 부분 수정 - 단일 이미지에서 여러 이미지로 변경
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 인증 상태 확인
  useEffect(() => {
    if (!user) {
      setNeedAuth(true);
    } else {
      setNeedAuth(false);
    }
  }, [user]);
  
  // 인증 필요 시 모달 표시
  useEffect(() => {
    if (needAuth) {
      setShowAuthModal(true);
    }
  }, [needAuth, setShowAuthModal]);

  // 채팅 목록 로드
  useEffect(() => {
    if (!user) return;
    
    const loadChatRooms = async () => {
      setIsLoading(true);
      try {
        // Firebase에서 채팅방 목록 로드
        const { success, rooms, error } = await getUserChatRooms(user.uid);
        
        if (success && rooms && rooms.length > 0) {
          console.log("채팅방 목록 데이터:", rooms);
          
          // 채팅방 목록 처리 부분
          const formattedRooms = await Promise.all((rooms as ChatRoom[])
            // 잘못된 형식의 채팅방 필터링
            .filter(room => {
              // ID가 올바른 형식인지 확인
              const isValidId = room.id && room.id.startsWith('chat_') && room.id.split('_').length === 3;
              
              // participants가 배열이고 2명이 있는지 확인
              const hasValidParticipants = 
                room.participants && 
                Array.isArray(room.participants) && 
                room.participants.length === 2;
              
              // 자신과의 채팅방인지 확인
              const isSelfChat = hasValidParticipants && 
                room.participants.filter(id => id === user.uid).length > 1;
              
              if (!isValidId || !hasValidParticipants) {
                console.warn("유효하지 않은 채팅방 무시:", room);
                return false;
              }
              
              if (isSelfChat) {
                console.warn("자신과의 채팅방 무시:", room);
                return false;
              }
              
              return true;
            })
            .map(async room => {
              // 상대방 ID 찾기
              const partnerId = room.participants.find(id => id !== user.uid);
              if (!partnerId) {
                console.warn("채팅 상대를 찾을 수 없음:", room);
                return null; // partnerId가 없으면 null 반환
              }
              
              // 케어 매니저의 실제 정보 가져오기
              let partnerName = `케어 매니저 #${partnerId}`;
              let partnerImage = "/placeholder-avatar.png";
              
              try {
                // 케어 매니저 정보 API 호출
                const response = await fetch(`/api/care-managers/${partnerId}`);
                if (response.ok) {
                  const careManager = await response.json();
                  if (careManager && careManager.name) {
                    partnerName = careManager.name;
                    partnerImage = careManager.imageUrl || "/placeholder-avatar.png";
                    console.log(`케어 매니저 정보 로드됨: ${partnerName}`);
                  }
                } else {
                  console.warn(`케어 매니저 정보 로드 실패: ${partnerId}`);
                }
              } catch (error) {
                console.error(`케어 매니저 정보 조회 오류 (ID: ${partnerId}):`, error);
              }
              
              return {
                id: room.id,
                senderId: partnerId,
                senderName: partnerName,
                senderImage: partnerImage,
                lastMessage: room.lastMessage || "새로운 대화가 시작되었습니다.",
                timestamp: room.lastActivity ? formatDistanceToNow(new Date(room.lastActivity.seconds * 1000), {
                  addSuffix: true,
                  locale: ko
                }) : "방금 전",
                unread: 0 // 읽지 않은 메시지 수는 별도 쿼리 필요
              };
            })
          );
          
          // null 값과 빈 senderId를 가진 항목 필터링 (타입 가드 사용)
          const validRooms = formattedRooms.filter((room): room is NonNullable<typeof room> => 
            room !== null && !!room.senderId
          );
          
          if (validRooms.length > 0) {
            console.log("포맷된 채팅 목록:", validRooms);
            setChatList(validRooms);
          } else {
            console.warn("유효한 채팅방이 없음");
            setChatList([]);
          }
        } else {
          console.warn("채팅방 목록 로드 실패 또는 빈 목록:", error || "빈 목록");
          setChatList([]);
        }
      } catch (err) {
        console.error("채팅방 목록 로드 중 오류:", err);
        setChatList([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChatRooms();
  }, [user]);
  
  // Firestore 연결 상태 설정
  useEffect(() => {
    if (db) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
    
    return () => {
      // 이전 메시지 리스너가 있다면 해제
      if (messageListenerRef.current) {
        messageListenerRef.current();
      }
    };
  }, []);
  
  // URL에서 'to' 매개변수를 가져와서 해당 채팅방으로 이동
  useEffect(() => {
    if (!user) {
      // 사용자가 없으면 더 이상 처리하지 않음
      return;
    }
    
    console.log("현재 URL:", location);
    
    // URL 매개변수 추출
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    const nameParam = urlParams.get('name');
    console.log("URL 파라미터 'to':", toParam, "name:", nameParam);
    
    if (toParam) {
      // 자신과의 채팅인지 확인
      if (toParam === user.uid) {
        console.warn("자신과의 채팅 시도:", toParam);
        alert("자신과의 채팅은 지원되지 않습니다.");
        setLocation("/chat");
        return;
      }
      
      console.log("채팅방 진입 시도 - ID:", toParam);
      setIsLoading(true);
      setShowChatList(false); // 채팅 목록 숨기기
      
      // 문자열로 된 ID를 타겟 ID로 변환
      const targetId = toParam;
      
      // Firestore를 사용하여 채팅방 생성/참여
      createOrGetChatRoom(user.uid, targetId)
        .then(result => {
          if (result.success) {
            const newRoomId = result.roomId || "";
            setRoomId(newRoomId);
            console.log("채팅방 생성/참여 성공:", newRoomId);
            
            // 채팅 파트너 정보 찾기
            const partnerInfo = chatList.find(m => m.senderId.toString() === targetId);
            
            // 채팅 파트너 정보 설정 - URL에서 받은 이름 우선 사용
            let partnerName = partnerInfo?.senderName || `케어 매니저 #${targetId}`;
            if (nameParam) {
              partnerName = decodeURIComponent(nameParam);
            }
            
            const partner: ChatPartner = {
              id: targetId,
              name: partnerName,
              imageUrl: partnerInfo?.senderImage || "/placeholder-avatar.png"
            };
            
            setChatPartner(partner);
            
            // 메시지 내역 로드
            if (newRoomId) {
              getChatMessages(newRoomId)
                .then(messageResult => {
                  if (messageResult.success && messageResult.messages) {
                    // 메시지 포맷 변환 - any 타입으로 처리
                    const formattedMessages = messageResult.messages.map((msg: any) => ({
                      id: msg.id,
                      content: msg.content || '',
                      sender: msg.senderId === user.uid ? 'user' : 'other',
                      timestamp: formatMessageTimestamp(msg.timestamp),
                      imageUrl: msg.imageUrl,
                      raw: msg
                    }));
                    
                    setMessages(formattedMessages);
                    console.log("메시지 내역 로드 완료:", formattedMessages.length, "개");
                    
                    // 읽지 않은 메시지들을 읽음으로 표시
                    markMessagesAsRead(newRoomId, user.uid).catch(err => {
                      console.log("메시지 읽음 표시 실패 (무시됨):", err);
                    });
                  } else {
                    console.log("메시지 내역이 없습니다.");
                    setMessages([]);
                  }
                  
                  // 이전 리스너가 있다면 해제
                  if (messageListenerRef.current) {
                    messageListenerRef.current();
                  }
                  
                  // 실시간 메시지 구독
                  messageListenerRef.current = subscribeToMessages(newRoomId, (newMessages: ChatMessage[]) => {
                    const formattedNewMessages = newMessages.map(msg => ({
                      id: msg.id,
                      content: msg.content,
                      sender: msg.senderId === user.uid ? 'user' : 'other',
                      timestamp: formatMessageTimestamp(msg.timestamp),
                      imageUrl: msg.imageUrl,
                      raw: msg
                    }));
                    
                    setMessages(formattedNewMessages);
                    
                    // 새 메시지가 도착하면 자동으로 읽음 표시
                    markMessagesAsRead(newRoomId, user.uid).catch(err => {
                      console.log("새 메시지 읽음 표시 실패 (무시됨):", err);
                    });
                  });
                  
                  setIsLoading(false);
                  setIsInitialized(true);
                })
                .catch(error => {
                  console.error("메시지 내역 로드 중 오류:", error);
                  setIsLoading(false);
                  setIsInitialized(true);
                });
            } else {
              setIsLoading(false);
            }
            
            // 상대방 전화번호 가져오기 (실제로는 API에서 가져와야 함)
            setPhoneNumber(`010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
            
          } else {
            console.error("채팅방 생성/참여 실패:", result.error);
            setIsLoading(false);
            
            // 실패 시 채팅 목록으로 돌아가기
            setShowChatList(true);
            alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
          }
        })
        .catch(error => {
          console.error("채팅방 생성/참여 중 오류:", error);
          setIsLoading(false);
          
          // 오류 시 채팅 목록으로 돌아가기
          setShowChatList(true);
          alert("채팅방 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        });
    } else {
      console.log("채팅 목록 표시 (URL 파라미터 없음)");
      // 'to' 파라미터가 없으면 채팅 목록 표시
      setShowChatList(true);
      setChatPartner(null);
      setRoomId(null);
      setMessages([]);
      setIsInitialized(false);
      
      // 이전 메시지 리스너가 있다면 해제
      if (messageListenerRef.current) {
        messageListenerRef.current();
        messageListenerRef.current = null;
      }
    }
  }, [user, location]); // location을 의존성에 추가하여 URL 변경시 다시 실행

  // 메시지 목록이 업데이트될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // 로딩 오류 해결을 위한 재시도 로직 추가
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const loadChatData = async () => {
      if (!user || !roomId) return;
      
      try {
        const messageResult = await getChatMessages(roomId);
        if (messageResult.success) {
          // 메시지 포맷 변환
          const formattedMessages = (messageResult.messages as ChatMessage[]).map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.senderId === user.uid ? 'user' : 'other',
            timestamp: formatMessageTimestamp(msg.timestamp),
            imageUrl: msg.imageUrl,
            raw: msg
          }));
          
          setMessages(formattedMessages);
          setIsLoading(false);
          setIsInitialized(true);
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadChatData, 1000); // 1초 후 재시도
        } else {
          console.error("메시지 로드 실패 (최대 재시도 횟수 초과):", messageResult.error);
          setIsLoading(false);
        }
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadChatData, 1000); // 1초 후 재시도
        } else {
          console.error("메시지 로드 중 오류 (최대 재시도 횟수 초과):", error);
          setIsLoading(false);
        }
      }
    };
    
    if (isLoading && roomId && user) {
      loadChatData();
    }
  }, [roomId, user, isLoading]);

  // 날짜 포맷 함수
  const formatMessageTimestamp = (timestamp: any) => {
    if (!timestamp) return '방금 전';
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const now = new Date();
    
    // 오늘 날짜인지 확인
    const isToday = date.getDate() === now.getDate() && 
                     date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else {
      // 오늘이 아니면 날짜도 표시
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // URL이 상대 경로인 경우 절대 경로로 변환
  const getAbsoluteImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return normalizeImageUrl(url);
  };

  // URL 감지 및 링크 변환 함수
  const convertLinksToHtml = (text: string) => {
    if (!text) return '';
    
    // URL 패턴 (http, https로 시작하는 링크)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // URL을 <a> 태그로 교체
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-blue-600 underline" rel="noopener noreferrer">${url}</a>`;
    });
  };

  // 메시지 표시 부분 수정 - 여러 이미지를 그룹으로 표시
  const renderMessage = (msg: Message) => {
    // 쉼표로 구분된 이미지 URL을 배열로 변환
    const imageUrls = msg.imageUrl ? msg.imageUrl.split(',') : [];
    
    // URL을 HTML 링크로 변환
    const htmlContent = convertLinksToHtml(msg.content);
    
    return (
      <div
        key={msg.id}
        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
          msg.sender === 'user'
            ? 'bg-yellow-300 text-gray-900 rounded-br-sm'
            : 'bg-white text-gray-900 rounded-bl-sm'
        }`}>
          {imageUrls.length > 0 && (
            <div className="mb-2">
              {imageUrls.length === 1 ? (
                // 이미지가 하나인 경우
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={getAbsoluteImageUrl(imageUrls[0])} 
                    alt="첨부 이미지" 
                    className="max-w-full h-auto"
                    onClick={() => window.open(getAbsoluteImageUrl(imageUrls[0]), '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : (
                // 이미지가 여러 개인 경우 - 그리드 형태로 표시
                <div className="grid grid-cols-2 gap-1">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img 
                        src={getAbsoluteImageUrl(url)} 
                        alt={`첨부 이미지 ${index + 1}`} 
                        className="w-full h-auto"
                        onClick={() => window.open(getAbsoluteImageUrl(url), '_blank')}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {msg.content && (
            <div 
              className="text-sm" 
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
          <span className={`text-xs mt-1 block text-gray-600`}>
            {msg.timestamp}
          </span>
        </div>
      </div>
    );
  };

  // 인증이 필요하면 빈 화면 반환
  if (needAuth) {
    return null;
  }

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const validFiles: File[] = [];
      
      // 각 파일에 대해 유효성 검사
      files.forEach(file => {
        // 파일 크기 제한 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert(`파일 '${file.name}'의 크기가 5MB를 초과합니다. 더 작은 이미지를 선택해주세요.`);
          return;
        }
        
        // 파일 타입 제한
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          alert(`'${file.name}'은(는) 지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.`);
          return;
        }
        
        validFiles.push(file);
      });
      
      setImageUploads(prevFiles => [...prevFiles, ...validFiles]);
      console.log(`${validFiles.length}개의 이미지 선택됨`);
    }
  };
  
  // 이미지 첨부 버튼 클릭 핸들러
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    setImageUploads(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // 메시지 전송 함수 - 서버 이미지 업로드 사용
  const handleSendMessage = async () => {
    if ((!message.trim() && imageUploads.length === 0) || !roomId || !user) return;
    
    const trimmedMessage = message.trim();
    const imageUrls: string[] = [];
    
    // 메시지 입력창 초기화 (즉시 UI 반응)
    setMessage("");
    
    // 이미지가 있으면 업로드
    if (imageUploads.length > 0) {
      setIsUploading(true);
      try {
        // 모든 이미지 업로드 작업 병렬 처리
        const uploadPromises = imageUploads.map(async (file) => {
          console.log("이미지 업로드 시작:", file.name);
          
          // 서버 API로 이미지 업로드
          const formData = new FormData();
          formData.append('image', file);
          
          // 채팅방 ID를 쿼리 파라미터로 전달
          const uploadResponse = await fetch(`/api/upload/chat-image?roomId=${roomId}`, {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`이미지 업로드 실패: ${uploadResponse.status}`);
          }
          
          const uploadResult = await uploadResponse.json();
          if (uploadResult.success && uploadResult.url) {
            console.log("이미지 업로드 성공:", uploadResult.url);
            return uploadResult.url;
          } else {
            throw new Error("이미지 업로드 응답이 올바르지 않습니다");
          }
        });
        
        // 모든 업로드가 완료될 때까지 기다림
        imageUrls.push(...await Promise.all(uploadPromises));
      } catch (error) {
        console.error("이미지 업로드 중 오류:", error);
        alert("일부 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsUploading(false);
        return; // 이미지 업로드 실패 시 메시지 전송 중단
      } finally {
        setIsUploading(false);
        setImageUploads([]); // 업로드 완료 후 이미지 목록 초기화
      }
    }
    
    try {
      console.log("메시지 전송 시도:", trimmedMessage, "이미지:", imageUrls.length > 0 ? `${imageUrls.length}개` : "없음");
      
      // 이미지와 텍스트를 하나의 메시지로 전송 (이미지를 그룹화)
      const result = await sendChatMessage(roomId, trimmedMessage, user.uid, imageUrls.join(','));
      
      if (!result.success) {
        console.error("메시지 전송 실패:", result.error);
        alert("메시지 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
      alert("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // 채팅 목록 항목 클릭 핸들러 수정
  const handleChatItemClick = async (chat: ChatListItem) => {
    console.log("채팅 항목 클릭:", chat);
    
    // senderId가 비어있는지 확인
    if (!chat.senderId) {
      console.error("채팅 상대 ID가 없습니다");
      alert("채팅 상대를 찾을 수 없습니다. 페이지를 새로고침해 보세요.");
      return;
    }

    // 자신과의 채팅인지 확인
    if (chat.senderId === user?.uid) {
      console.warn("자신과의 채팅 시도:", chat.senderId);
      alert("자신과의 채팅은 지원되지 않습니다.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 채팅방 생성 또는 조회
      const result = await createOrGetChatRoom(user!.uid, chat.senderId.toString());
      console.log("채팅방 생성/조회 결과:", result);
      
      if (result.success && result.roomId) {
        // 채팅방 정보 설정
        setRoomId(result.roomId);
        setChatPartner({
          id: chat.senderId,
          name: chat.senderName,
          imageUrl: chat.senderImage
        });
        
        // 채팅 목록 숨기기
        setShowChatList(false);
        
        // 상대방 전화번호 가져오기 (실제로는 API에서 가져와야 함)
        setPhoneNumber(`010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
        
        // 메시지 내역 로드
        const messageResult = await getChatMessages(result.roomId);
        if (messageResult.success) {
          // 메시지 포맷 변환
          const formattedMessages = (messageResult.messages as ChatMessage[]).map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.senderId === user!.uid ? 'user' : 'other',
            timestamp: formatMessageTimestamp(msg.timestamp),
            imageUrl: msg.imageUrl,
            raw: msg
          }));
          
          setMessages(formattedMessages);
          
          // 메시지를 읽음으로 표시
          try {
            await markMessagesAsRead(result.roomId, user!.uid);
          } catch (err) {
            console.log("메시지 읽음 표시 실패 (무시됨):", err);
          }
          
          // 실시간 메시지 구독 설정
          if (messageListenerRef.current) {
            messageListenerRef.current(); // 이전 리스너 해제
          }
          
          messageListenerRef.current = subscribeToMessages(result.roomId, (newMessages: ChatMessage[]) => {
            // 새 메시지 포맷 변환
            const formattedNewMessages = newMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              sender: msg.senderId === user!.uid ? 'user' : 'other',
              timestamp: formatMessageTimestamp(msg.timestamp),
              imageUrl: msg.imageUrl,
              raw: msg
            }));
            
            // 새 메시지가 도착하면 자동으로 읽음 표시
            markMessagesAsRead(result.roomId, user!.uid).catch(err => {
              console.log("새 메시지 읽음 표시 실패 (무시됨):", err);
            });
            
            // 상태 업데이트
            setMessages(formattedNewMessages);
          });
          
          // 읽은 상태로 표시
          setChatList(prev => 
            prev.map(item => 
              item.id === chat.id ? {...item, unread: 0} : item
            )
          );
          
          // 초기화 완료
          setIsInitialized(true);
          
          // URL 업데이트 (마지막에 수행)
          setLocation(`/chat?to=${chat.senderId}`);
        } else {
          console.error("메시지 내역 로드 실패:", messageResult.error);
        }
      } else {
        console.error("채팅방 생성/조회 실패:", result.error);
        alert("채팅방에 입장할 수 없습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("채팅 입장 중 오류:", error);
      alert("채팅방 입장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 메시지 표시 부분 수정 - 여러 이미지를 그룹으로 표시
  // Firebase 함수 수정
  // 불필요한 함수 제거 (firebase.ts에 이미 구현됨)
  // const updateSendChatMessage = async (roomId: string, content: string, senderId: string, imageUrl?: string) => {
  //   try {
  //     // 채팅방의 메시지 컬렉션에 새 메시지 추가
  //     const messagesRef = collection(db, "chatRooms", roomId, "messages");
  //     const newMessage = {
  //       content,
  //       senderId,
  //       timestamp: serverTimestamp(),
  //       read: false
  //     };
      
  //     // 이미지 URL이 있으면 추가
  //     if (imageUrl) {
  //       newMessage.imageUrl = imageUrl;
  //     }
      
  //     const docRef = await addDoc(messagesRef, newMessage);
      
  //     // 채팅방의 마지막 메시지와 활동 시간 업데이트
  //     const roomRef = doc(db, "chatRooms", roomId);
  //     await setDoc(roomRef, {
  //       lastMessage: content,
  //       lastActivity: serverTimestamp()
  //     }, { merge: true });
      
  //     return { success: true, messageId: docRef.id };
  //   } catch (error) {
  //     console.error("메시지 전송 오류:", error);
  //     return { success: false, error };
  //   }
  // };

  // 뒤로가기 핸들러
  const handleBackToList = () => {
    // 현재 메시지 리스너 해제
    if (messageListenerRef.current) {
      messageListenerRef.current();
      messageListenerRef.current = null;
    }
    
    // 상태 초기화
    setRoomId(null);
    setChatPartner(null);
    setIsInitialized(false);
    setMessages([]);
    setShowChatList(true);
    
    // URL 업데이트
    setLocation('/chat');
  };

  // 전화 버튼 클릭 핸들러
  const handlePhoneClick = () => {
    setShowPhoneModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 pb-8"> {/* 배경 색상 변경 */}
      {/* Header - 간소화 */}
      <div className="bg-white shadow-sm px-4 py-2"> {/* 헤더 배경 변경 */}
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">채팅</h1> {/* 텍스트 색상 변경 */}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="p-1 rounded-full h-7 w-7 text-gray-600 hover:bg-gray-100"
              title="새로고침"
              disabled={isLoading}
              type="button"
            >
              <i className="fas fa-sync-alt text-xs"></i>
            </Button>
            <Badge variant={isConnected ? "outline" : "destructive"} className={`px-2 py-0 text-xs ${isConnected ? 'bg-green-100 text-green-700 border-green-200' : ''}`}>
              {isConnected ? '연결됨' : '연결 끊김'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 py-2 mb-8"> {/* 여백 감소 */}
        {isLoading ? (
          // 로딩 표시
          <div className="flex items-center justify-center h-60 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : showChatList || !chatPartner ? (
          // 채팅 목록 화면
          <Card className="bg-white shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <h3 className="text-md font-semibold text-gray-800">채팅 목록</h3>
            </CardHeader>
            <CardContent className="p-0">
              {chatList.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">채팅 내역이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {chatList.map((chat, index) => (
                    <div
                      key={chat.id}
                      className="p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleChatItemClick(chat);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getAbsoluteImageUrl(chat.senderImage)} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">{chat.senderName?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          {chat.unread > 0 && (
                            <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center p-0">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-800 truncate text-sm">{chat.senderName || "알 수 없음"}</h4>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // 채팅방 화면 - 높이 축소
          <div className="flex flex-col h-[calc(100vh-200px)]"> {/* 전체 높이 감소 */}
            {/* 채팅 헤더 */}
            <div className="bg-white rounded-t-lg shadow-sm border border-gray-100 px-3 py-2"> {/* 패딩 감소 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 rounded-full mr-1 hover:bg-gray-100 h-7 w-7 text-gray-600" /* 크기 감소 */
                    onClick={handleBackToList}
                    type="button"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                  </Button>
                  <Avatar className="w-8 h-8"> {/* 크기 감소 */}
                    <AvatarImage src={getAbsoluteImageUrl(chatPartner?.imageUrl)} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">{chatPartner?.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{chatPartner?.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        온라인
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-lg hover:bg-blue-50 h-7 w-7 text-blue-600" /* 크기 감소 */
                  onClick={handlePhoneClick}
                  type="button"
                >
                  <i className="fas fa-phone text-sm"></i>
                </Button>
              </div>
            </div>
            
            {/* 채팅 메시지 영역 */}
            <div 
              ref={scrollAreaRef} 
              className="flex-grow bg-blue-100 border-x border-gray-100 overflow-y-auto p-3" /* 패딩 감소 */
            >
              <div className="space-y-3"> {/* 간격 감소 */}
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500 text-sm">대화를 시작해 보세요</p>
                  </div>
                ) : (
                  messages.map(msg => renderMessage(msg))
                )}
              </div>
            </div>
            
            {/* 메시지 입력 영역 - 수정 */}
            <div className="bg-white border border-gray-100 px-3 py-2 rounded-b-lg shadow-sm">
              {/* 이미지 미리보기 */}
              {imageUploads.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {imageUploads.map((file, index) => (
                    <div key={index} className="relative border border-gray-200 rounded-md overflow-hidden p-1 bg-white">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`업로드 이미지 ${index + 1}`} 
                        className="h-20 w-auto object-cover"
                      />
                      <button 
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 bg-opacity-70 text-white rounded-full p-1 text-xs"
                        type="button"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={isUploading ? "이미지 업로드 중..." : "메시지를 입력하세요..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10 border-gray-300 bg-white text-gray-800 rounded-xl focus:ring-1 focus:ring-blue-500 text-sm h-9"
                    disabled={!isConnected || isUploading}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 rounded-lg h-6 w-6"
                      onClick={handleAttachClick}
                      disabled={isUploading}
                      type="button"
                    >
                      <i className="fas fa-paperclip text-gray-400 text-xs"></i>
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex-shrink-0 h-9 w-9"
                  disabled={(!message.trim() && imageUploads.length === 0) || !isConnected || isUploading}
                  type="button"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <i className="fas fa-paper-plane text-sm"></i>
                  )}
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-1">연결이 끊겼습니다. 재연결을 시도하는 중...</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 전화번호 표시 모달 - 간소화 */}
      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent className="sm:max-w-md bg-white text-gray-800 border-gray-200">
          <DialogHeader>
            <DialogTitle>통화 연결</DialogTitle>
            <DialogDescription className="text-gray-500">
              아래 전화번호로 연결할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col items-center">
            <p className="text-xl font-bold mb-3 text-gray-800">{phoneNumber}</p> {/* 크기 감소 */}
            <div className="flex gap-3"> {/* 간격 감소 */}
              <Button 
                variant="outline" 
                className="w-24 border-gray-300 text-gray-700 hover:bg-gray-100" /* 크기 감소 */
                onClick={() => setShowPhoneModal(false)}
              >
                취소
              </Button>
              <Button 
                className="w-24 bg-blue-500 hover:bg-blue-600" /* 크기 감소 */
                onClick={() => {
                  window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`;
                }}
              >
                전화 걸기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{ __html: `
        /* 네비게이션 하단 영역 숨김 처리 - 더 강력한 선택자 사용 */
        nav, .navigation, footer, .footer, [role="navigation"] {
          display: none !important;
        }
        /* 채팅 영역이 네비게이션 바 위에 확장되도록 */
        html, body, #root {
          height: 100vh;
          overflow: hidden;
          margin-bottom: 50px !important;
          padding-bottom: 50px !important;
        }
      `}} />
    </div>
  );
};

export default Chat;
