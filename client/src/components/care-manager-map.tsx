import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CareManager } from '@shared/schema';
import { useLocation } from "wouter";
import { normalizeImageUrl } from '@/lib/url';

interface CareManagerMapProps {
  searchQuery?: string;
}

// 구글 맵 로딩 상태를 추적하는 전역 변수
let googleMapsLoaded = false;
let googleMapsLoading = false;
let callbackQueue: Array<() => void> = [];

// 이미지 URL 처리 함수
const processImageUrl = (imageUrl: string | undefined): string => {
  const normalized = normalizeImageUrl(imageUrl);
  return normalized || '/images/profile/default.png';
};

// 구글 맵 로드 함수
const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 Google Maps API가 로드되어 있는지 확인
    if (window.google && window.google.maps) {
      console.log('Google Maps API가 이미 로드되어 있음');
      resolve();
      return;
    }

    // 기존 Google Maps 스크립트를 모두 제거 (캐시 문제 해결)
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => {
      const scriptElement = script as HTMLScriptElement;
      console.log('기존 Google Maps 스크립트 제거:', scriptElement.src);
      script.remove();
    });

    console.log('새로운 Google Maps API 스크립트 로드 시작');
    
    const script = document.createElement('script');
    // 캐시 버스팅을 위한 타임스탬프 추가
    const timestamp = new Date().getTime();
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZZkoRGw9UByZ2vuNC9j95H4EYcxCl1Vs&libraries=places&callback=initGoogleMaps&v=3.exp&_=${timestamp}`;
    script.async = true;
    script.defer = true;
    
    // 전역 콜백 함수 생성
    const callbackName = `initGoogleMaps_${timestamp}`;
    (window as any)[callbackName] = () => {
      console.log('Google Maps API 콜백 호출됨');
      if (window.google && window.google.maps) {
        console.log('Google Maps API 객체 확인됨');
        // 콜백 함수 정리
        delete (window as any)[callbackName];
        resolve();
      } else {
        console.error('Google Maps API 콜백 후에도 객체가 없음');
        delete (window as any)[callbackName];
        reject(new Error('Google Maps API 객체를 찾을 수 없음'));
      }
    };
    
    // URL에 콜백 이름 업데이트
    script.src = script.src.replace('callback=initGoogleMaps', `callback=${callbackName}`);
    
    script.onerror = (error) => {
      console.error('Google Maps API 스크립트 로드 실패:', error);
      delete (window as any)[callbackName];
      reject(new Error('Google Maps API 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

const CareManagerMap = ({ searchQuery = '' }: CareManagerMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // 모든 케어 매니저 데이터 가져오기
  const { data: careManagers, isLoading } = useQuery<CareManager[]>({
    queryKey: ['/api/care-managers', searchQuery],
  });

  // 컴포넌트 마운트/언마운트 시 상태 리셋
  useEffect(() => {
    // 컴포넌트가 마운트될 때 상태 리셋
    setInitialized(false);
    setIsMapReady(false);
    setMapInstance(null);
    setMarkers([]);
    setInfoWindows([]);
    
    return () => {
      // 컴포넌트가 언마운트될 때 정리
      setInitialized(false);
      setIsMapReady(false);
      setMapInstance(null);
      setMarkers([]);
      setInfoWindows([]);
    };
  }, []);

  // Google Maps 로드 및 초기화
  useEffect(() => {
    console.log('CareManagerMap useEffect 실행됨', { 
      mapRefCurrent: !!mapRef.current, 
      isMapReady,
      documentHidden: document.hidden 
    });
    
    let isMounted = true;
    let initTimeout: NodeJS.Timeout;
    
    const waitForMapRef = async () => {
      // mapRef.current가 null인 경우 최대 3초 동안 기다림
      let attempts = 0;
      while (attempts < 30 && !mapRef.current && isMounted) {
        console.log(`mapRef 대기 중... (시도 ${attempts + 1}/30)`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!mapRef.current) {
        console.error('mapRef.current를 찾을 수 없음');
        return false;
      }
      
      console.log('mapRef.current 확인됨');
      return true;
    };
    
    if (isMapReady) {
      console.log('조기 종료: 이미 지도가 준비됨');
      return;
    }
    
    const initializeMap = async () => {
      try {
        console.log('Google Maps 초기화 시작');
        
        // mapRef.current가 준비될 때까지 대기
        const hasMapRef = await waitForMapRef();
        if (!hasMapRef || !isMounted) {
          console.log('mapRef 대기 실패 또는 컴포넌트 언마운트됨');
          return;
        }

        console.log('맵 요소 크기:', {
          offsetWidth: mapRef.current!.offsetWidth,
          offsetHeight: mapRef.current!.offsetHeight,
          clientWidth: mapRef.current!.clientWidth,
          clientHeight: mapRef.current!.clientHeight
        });

        // 맵 요소의 크기가 설정될 때까지 대기
        let attempts = 0;
        while (attempts < 20 && mapRef.current && (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0)) {
          console.log(`맵 요소 크기 대기 중... (시도 ${attempts + 1}/20)`, {
            offsetWidth: mapRef.current.offsetWidth,
            offsetHeight: mapRef.current.offsetHeight
          });
          await new Promise(resolve => setTimeout(resolve, 250));
          attempts++;
        }

        if (!isMounted || !mapRef.current) {
          console.log('컴포넌트가 언마운트되었거나 맵 요소가 없음');
          return;
        }

        console.log('최종 맵 요소 크기:', {
          offsetWidth: mapRef.current.offsetWidth,
          offsetHeight: mapRef.current.offsetHeight
        });

        // Google Maps API가 이미 로드되어 있는지 확인
        if (!window.google || !window.google.maps) {
          console.log('Google Maps API 로드 중...');
          await loadGoogleMapsApi();
        }
        
        if (!isMounted || !mapRef.current) {
          console.log('컴포넌트가 언마운트되었거나 맵 요소가 없음');
          return;
        }
        
        console.log('지도 초기화 실행');
        initMap();
        setInitialized(true);
        setIsMapReady(true);
        
      } catch (error) {
        console.error('Google Maps 로드 오류:', error);
        // 오류 발생 시 재시도
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              console.log('재시도 실행');
              setInitialized(false);
              setIsMapReady(false);
            }
          }, 3000);
        }
      }
    };

    // 탭 활성화 감지
    const handleVisibilityChange = () => {
      if (!document.hidden && mapRef.current && !isMapReady) {
        console.log('탭이 활성화됨 - 지도 초기화 재시도');
        initTimeout = setTimeout(initializeMap, 500);
      }
    };

    // 초기 설정 - IntersectionObserver 없이 직접 초기화
    if (document.hidden) {
      console.log('탭이 비활성 상태 - visibility 이벤트 등록');
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      console.log('탭이 활성 상태 - 직접 초기화 시작');
      // 약간의 지연 후 초기화 (DOM이 완전히 렌더링될 때까지)
      initTimeout = setTimeout(initializeMap, 200);
    }
    
    return () => {
      console.log('CareManagerMap cleanup 실행됨');
      isMounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // 의존성 배열을 빈 배열로 변경하여 한 번만 실행
  
  // 지도 컨테이너 스타일 설정
  useEffect(() => {
    if (!mapRef.current) return;
    
    // 지도 컨테이너 스타일 설정
    mapRef.current.style.width = '100%';
    mapRef.current.style.height = '100%';
  }, []); // 한 번만 실행
  
  // 지도 초기화 및 마커 추가
  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    
    // 기본 위치: 서울
    const defaultCenter = { lat: 37.5665, lng: 126.9780 };
    
    const mapOptions = {
      center: defaultCenter,
      zoom: 11,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapId: "DEMO_MAP_ID" // 지도 ID 추가 (고급 마커 사용을 위해 필요)
      // styles 속성 제거 - mapId와 함께 사용 시 오류 발생
    };
    
    // 지도 생성
    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);
    
    // 케어 매니저 데이터가 있으면 마커 추가
    if (careManagers && careManagers.length) {
      addCareManagerMarkers(map, careManagers);
    }
  };
  
  // 케어 매니저 데이터가 로드되면 지도에 마커 다시 추가
  useEffect(() => {
    if (mapInstance && careManagers && careManagers.length > 0) {
      console.log('케어 매니저 데이터로 마커 업데이트:', careManagers.length);
      addCareManagerMarkers(mapInstance, careManagers);
    }
  }, [mapInstance, careManagers, searchQuery]);

  // 페이지 리사이즈 시 지도 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance && isMapReady && window.google?.maps?.event) {
        setTimeout(() => {
          window.google.maps.event.trigger(mapInstance, 'resize');
          
          // 마커가 있는 경우 경계 재설정
          if (markers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach(marker => {
              const position = marker.position || (marker.getPosition && marker.getPosition());
              if (position) {
                bounds.extend(position);
              }
            });
            mapInstance.fitBounds(bounds);
          }
        }, 200);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMapReady, mapInstance, markers]);
  
  // 케어 매니저 마커 추가 함수
  const addCareManagerMarkers = (map: any, managers: CareManager[]) => {
    // 기존 마커 제거
    markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    
    // 기존 인포윈도우 닫기
    infoWindows.forEach(window => {
      if (window && window.close) {
        window.close();
      }
    });
    
    // 검색어에 따라 필터링
    const filteredManagers = searchQuery
      ? managers.filter(manager =>
          manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          manager.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : managers;

    console.log('필터링된 케어 매니저:', filteredManagers.length);

    if (filteredManagers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers: any[] = [];
    const newInfoWindows: any[] = [];
    
    // 각 케어 매니저에 대한 마커 생성
    filteredManagers.forEach(manager => {
      // 지오코딩 서비스 생성
      const geocoder = new window.google.maps.Geocoder();
      
      // 주소를 좌표로 변환
      geocoder.geocode({ 'address': manager.location }, (results: any, status: any) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const position = results[0].geometry.location;
          
          // 미니 인포윈도우 내용 - 프로필 이미지 포함
          const miniInfoContent = `
            <div style="width: 120px; text-align: center;">
              <!-- 프로필 이미지와 클릭 기능 추가 -->
              <a href="/care-manager/${manager.id}" style="text-decoration: none;">
                <div style="width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 4px; border: 2px solid white; background-color: #6C5CE7; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                  ${manager.imageUrl 
                    ? `<img src="${processImageUrl(manager.imageUrl)}" alt="${manager.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.innerHTML='${manager.name.charAt(0)}'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontWeight='bold'; this.style.fontSize='18px';" />`
                    : `<div style="display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">${manager.name.charAt(0)}</div>`
                  }
                </div>
              </a>
              
              <div style="font-weight: bold; font-size: 12px; background-color: rgba(255,255,255,0.9); padding: 2px 4px; border-radius: 4px; margin-bottom: 3px;">${manager.name}
                ${manager.certified ? '<span style="color: #3B82F6; margin-left: 3px;">✓</span>' : ''}
              </div>
              
              <!-- 평점 표시 -->
              <div style="font-size: 11px; background-color: rgba(255,255,255,0.8); padding: 2px 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 3px;">
                <span style="color: #FBBF24;">★</span>
                <span>${manager.rating / 10}</span>
              </div>
            </div>
          `;
          
          // 마커 생성 (고급 마커 사용)
          let marker;
          
          // AdvancedMarkerElement 기능 사용 가능 여부 확인
          if (window.google && window.google.maps && window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
            // 고급 마커 콘텐츠 생성
            const markerContent = document.createElement('div');
            markerContent.className = 'custom-marker';
            markerContent.style.backgroundColor = '#6C5CE7';
            markerContent.style.borderRadius = '50%';
            markerContent.style.width = '20px';
            markerContent.style.height = '20px';
            markerContent.style.border = '2px solid white';
            markerContent.style.cursor = 'pointer';
            
            // 고급 마커 생성
            marker = new window.google.maps.marker.AdvancedMarkerElement({
              position,
              map,
              title: manager.name,
              content: markerContent,
            });
          } else {
            // 대체 마커 (fallback) - 기존 방식
            marker = new window.google.maps.Marker({
              position,
              map,
              title: manager.name,
              animation: window.google.maps.Animation.DROP,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#6C5CE7',
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
                scale: 10
              }
            });
          }
          
          // 미니 인포윈도우 생성 (항상 표시)
          const miniInfo = new window.google.maps.InfoWindow({
            content: miniInfoContent,
            disableAutoPan: true, // 지도 자동 이동 비활성화
            pixelOffset: new window.google.maps.Size(0, -20)
          });
          
          try {
            // 항상 표시
            miniInfo.open(map, marker);
          } catch (e) {
            console.warn('인포윈도우 열기 실패:', e);
          }
          
          // 전체 정보가 담긴 인포윈도우 내용 - 프로필 이미지 포함
          const infoWindowContent = `
            <div style="width: 200px; padding: 8px; text-align: center;">
              <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid #fff; margin: 0 auto 8px auto; background-color: #6C5CE7; display: flex; align-items: center; justify-content: center;">
                ${manager.imageUrl 
                  ? `<img 
                      src="${processImageUrl(manager.imageUrl)}" 
                      alt="${manager.name}"
                      style="width: 100%; height: 100%; object-fit: cover;"
                      onerror="this.onerror=null; this.src='/images/placeholder.jpg';"
                    />`
                  : `<div style="display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">${manager.name.charAt(0)}</div>`
                }
              </div>
              <div style="font-weight: 600; margin-bottom: 4px;">${manager.name}</div>
              <div style="color: #666; font-size: 14px; margin-bottom: 4px;">${manager.location}</div>
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span>⭐ ${manager.rating / 10}</span>
              </div>
              <button 
                style="background-color: #6C5CE7; color: white; border-radius: 9999px; padding: 4px 12px; border: none; font-size: 14px; cursor: pointer;"
                onclick="window.location.href='/care-manager/${manager.id}'"
              >
                상세 보기
              </button>
            </div>
          `;
          
          // 인포윈도우 생성
          const infoWindow = new window.google.maps.InfoWindow({
            content: infoWindowContent,
            pixelOffset: new window.google.maps.Size(0, -10)
          });
          
          // 마커 클릭 이벤트 - try-catch 처리 추가
          try {
            marker.addListener('click', () => {
              // 열려있는 모든 인포윈도우 닫기
              newInfoWindows.forEach(window => {
                try {
                  window.close();
                } catch (e) {
                  console.warn('인포윈도우 닫기 실패:', e);
                }
              });
              
              // 클릭한 마커의 인포윈도우 열기
              try {
                infoWindow.open(map, marker);
              } catch (e) {
                console.warn('인포윈도우 열기 실패:', e);
              }
            });
          } catch (e) {
            console.warn('마커 클릭 이벤트 등록 실패:', e);
          }
          
          // 새로운 마커와 인포윈도우 추가
          newMarkers.push(marker);
          newInfoWindows.push(infoWindow);
          newInfoWindows.push(miniInfo);
          
          // 경계에 위치 추가
          bounds.extend(position);
          
          // 모든 마커가 추가된 후 지도 경계 조정
          if (newMarkers.length === filteredManagers.length) {
            map.fitBounds(bounds);
            // 너무 가깝게 확대되는 것을 방지
            const listener = window.google.maps.event.addListener(map, 'idle', () => {
              if (map.getZoom() && map.getZoom() > 15) {
                map.setZoom(15);
              }
              window.google.maps.event.removeListener(listener);
            });
            
            // 상태 업데이트
            setMarkers(newMarkers);
            setInfoWindows(newInfoWindows);
          }
        }
      });
    });
  };
  
  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-500">지도를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg">
      {!careManagers && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-10">
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <p className="text-red-500">케어 매니저 정보를 불러오지 못했습니다.</p>
            <p className="text-sm text-gray-500 mt-1">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 타입 선언 추가
declare global {
  interface Window {
    google: any;
    [key: string]: any; // 동적 콜백 함수명을 위한 인덱스 시그니처
  }
}

export default CareManagerMap;