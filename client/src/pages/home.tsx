import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { productAPI } from "@/lib/api";
import CareManagerCard from "@/components/care-manager-card";
import ProductCard from "@/components/product-card";
import BookingModal from "@/components/booking-modal";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import type { Service, CareManager, Notice } from "@shared/schema";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import CareManagerMap from "@/components/care-manager-map";

// 배경 이미지 슬라이더 컴포넌트
const BackgroundImageSlider = () => {
  const images = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
    ];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5초마다 이미지 변경
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <div className="absolute inset-0 z-0">
      {images.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-center bg-cover"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentIndex === index ? 0.4 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card'); // 카드/리스트 뷰 전환 상태 추가
  const { user, setShowAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    manager?: CareManager;
    serviceId?: number;
  }>({
    isOpen: false
  });
  
  // Carousel API states
  const [recommendedApi, setRecommendedApi] = useState<any>();
  const [popularApi, setPopularApi] = useState<any>();
  const [productApi, setProductApi] = useState<any>();
  
  // Refs for auto slide intervals
  const recommendedSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const popularSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const productSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  const { data: careManagers = [] } = useQuery<CareManager[]>({
    queryKey: ['/api/care-managers'],
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<any[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const result = await productAPI.getProducts({ limit: 8 });
        return Array.isArray(result) ? result : result?.products || [];
      } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        return [];
      }
    },
  });

  // 추천 케어 매니저 자동 슬라이드 효과
  useEffect(() => {
    if (!recommendedApi) return;

    recommendedSlideIntervalRef.current = setInterval(() => {
      recommendedApi.scrollNext();
    }, 8000); // 8초마다 슬라이드

    return () => {
      if (recommendedSlideIntervalRef.current) {
        clearInterval(recommendedSlideIntervalRef.current);
      }
    };
  }, [recommendedApi]);
  
  // 인기 케어 매니저 자동 슬라이드 효과
  useEffect(() => {
    if (!popularApi) return;

    popularSlideIntervalRef.current = setInterval(() => {
      popularApi.scrollNext();
    }, 10000); // 10초로 변경하여 더 천천히 슬라이드 되도록 함

    return () => {
      if (popularSlideIntervalRef.current) {
        clearInterval(popularSlideIntervalRef.current);
      }
    };
  }, [popularApi]);

  // 상품 자동 슬라이드 효과
  useEffect(() => {
    if (!productApi) return;

    productSlideIntervalRef.current = setInterval(() => {
      productApi.scrollNext();
    }, 6000); // 6초마다 슬라이드

    return () => {
      if (productSlideIntervalRef.current) {
        clearInterval(productSlideIntervalRef.current);
      }
    };
  }, [productApi]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleServiceClick = (service: Service) => {
    setLocation(`/search?service=${encodeURIComponent(service.name)}`);
  };

  // 공지사항 로드
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // 공지사항을 서버에서 불러오기
  const { data: noticeData = [] } = useQuery<Notice[]>({
    queryKey: ['/api/notices']
  });

  useEffect(() => {
    if (noticeData && noticeData.length > 0) {
      setNotices(noticeData);
    }
  }, [noticeData]);

  const handleMessageClick = async (manager: CareManager) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // 케어매니저의 상세 페이지로 이동
    setLocation(`/care-manager/${manager.id}`);
    
    // 이전 메시지 전송 코드는 제거하고 상세 페이지로 이동만 수행
  };

  const handleBookingClick = async (manager: CareManager) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    const firstServiceName = (manager.services as any[]).length > 0 ? (typeof (manager.services as any[])[0] === "string" ? (manager.services as any[])[0] : (manager.services as any[])[0].name) : "";
    setBookingModal({
      isOpen: true,
      manager,
      serviceId: services.find(s=> s.name===firstServiceName)?.id || 1
    });
  };

  // 인기 있는 케어 매니저 (리뷰가 많은 순)
  const popularCareManagers = [...careManagers].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  
  // 추천 케어 매니저 (평점이 높은 순)
  const recommendedCareManagers = [...careManagers].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-2">
      <Header />

      {/* 예약 모달 */}
      {bookingModal.isOpen && bookingModal.manager && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false })}
          manager={bookingModal.manager}
          userId={user?.uid ? parseInt(user.uid) : 1} // 숫자형으로 전달
          serviceId={bookingModal.serviceId || 1}
          onSuccess={() => {
            toast({
              title: "예약 성공",
              description: "예약이 성공적으로 등록되었습니다.",
            });
            // 예약 성공 후 추가 작업이 필요하다면 여기에 작성
          }}
        />
      )}


      {/* Hero Section - 이미지 슬라이더 추가 */}
      <section className="relative overflow-hidden">
        <BackgroundImageSlider />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
              부모님을 위한<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                믿을 수 있는 케어 서비스
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              전문 케어 매니저가 부모님의 일상을 안전하게 돌봐드립니다
            </p>
            
            {/* Mobile Search */}
            <div className="sm:hidden mb-6 px-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="지역, 서비스명으로 검색해보세요"
                  className="w-full py-2 pl-10 pr-4 rounded-xl border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/70 focus:border-white/50 focus:ring-white/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"></i>
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-lg py-1 px-2 text-xs bg-white/30 hover:bg-white/40 text-white"
                  onClick={handleSearch}
                >
                  검색
                </Button>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden sm:block max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full border border-white/30 p-1">
                <Input
                  type="text"
                  placeholder="지역, 서비스명으로 검색해보세요"
                  className="flex-grow border-0 bg-transparent text-white placeholder:text-white/70 focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  className="gradient-orange text-white rounded-full px-6 py-2"
                  onClick={handleSearch}
                >
                  <i className="fas fa-search mr-2"></i>
                  검색
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            어떤 서비스가 필요하신가요?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service) => (
              <Card 
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleServiceClick(service)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${service.color} w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-3`}>
                    <i className={`${service.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.averageDuration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 케어 매니저 수평 슬라이드 */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 whitespace-nowrap">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  추천 케어 매니저
                </span>
              </h2>
              <p className="text-base text-gray-600">검증된 전문 케어 매니저들을 만나보세요</p>
            </div>
            <Button
              onClick={() => setLocation('/search')}
              className="gradient-purple text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md text-sm whitespace-nowrap"
            >
              전체보기 <i className="fas fa-chevron-right ml-1"></i>
            </Button>
          </div>
          
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setRecommendedApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendedCareManagers.map((manager) => (
                  <CarouselItem key={manager.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <CareManagerCard
                      manager={manager}
                      onMessage={() => handleMessageClick(manager)}
                      onBook={() => handleBookingClick(manager)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between w-full px-1 z-20 pointer-events-none">
                <CarouselPrevious className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
                <CarouselNext className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
              </div>
            </Carousel>
          </div>
          
          {/* 지도 추가 - 추천 케어 매니저 섹션 아래에 배치 */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">지역별 케어매니저</h2>
                <p className="text-gray-600">내 주변의 케어매니저를 확인해보세요</p>
              </div>
            </div>
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg" id="home-map-container">
              {/* key 속성을 추가하여 컴포넌트가 다시 마운트되도록 함 */}
              <CareManagerMap />
            </div>
          </div>
        </div>
      </section>

      {/* 추천 상품 수평 슬라이드 */}
      <section className="py-10 sm:py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 whitespace-nowrap">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  추천 상품
                </span>
              </h2>
              <p className="text-base text-gray-600">신선하고 좋은 상품들을 만나보세요</p>
            </div>
            <Button
              onClick={() => setLocation('/shop')}
              className="gradient-green text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md text-sm whitespace-nowrap"
            >
              쇼핑몰 가기 <i className="fas fa-shopping-cart ml-1"></i>
            </Button>
          </div>
          
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setProductApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {isLoadingProducts ? (
                  // 로딩 상태
                  Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Card className="h-full">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                ) : products.length > 0 ? (
                  // 상품 데이터 표시
                  products.slice(0, 8).map((product) => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))
                ) : (
                  // 데이터 없음 상태
                  <CarouselItem className="pl-2 md:pl-4 basis-full">
                    <Card className="h-full">
                      <CardContent className="p-8 text-center">
                        <div className="text-gray-500 mb-2">
                          <i className="fas fa-shopping-basket text-4xl mb-4"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">상품이 없습니다</h3>
                        <p className="text-gray-600 mb-4">곧 새로운 상품들을 준비하겠습니다!</p>
                        <Button onClick={() => setLocation('/shop')} variant="outline">
                          쇼핑몰 방문하기
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between w-full px-1 z-20 pointer-events-none">
                <CarouselPrevious className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
                <CarouselNext className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works + 공지사항 */}
      <section className="py-10 sm:py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 공지 + 이용방법을 좌우 배치 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 공지사항 (1/3) */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <i className="fas fa-bullhorn text-blue-500 mr-2"></i>
                공지사항
              </h2>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {notices.length === 0 && (
                  <div className="text-center py-3">
                    <span className="text-gray-500 text-sm">등록된 공지가 없습니다.</span>
                  </div>
                )}
                {notices.slice(0,5).map((notice)=>(
                  <div 
                    key={notice.id} 
                    className="flex items-center justify-between py-2 px-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      console.log(`공지사항 클릭: ID ${notice.id}, 제목 ${notice.title}`);
                      setLocation(`/notice/${notice.id}`);
                    }}
                  >
                    <div className="flex items-center">
                      <i className="fas fa-circle text-red-500 text-[6px] mr-2"></i>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">{notice.title}</span>
                    </div>
                    <div className="text-xs text-gray-400">{notice.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이용 방법 (2/3) */}
            <div className="md:col-span-2">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">이용 방법</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  빠르고 안전하게 케어 서비스를 예약하는 방법을 확인해보세요
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <i className="fas fa-search text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">1. 케어매니저 검색</h3>
                  <p className="text-gray-600">지역, 서비스 유형으로 원하는 케어 매니저를 찾아보세요</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <i className="fas fa-calendar-alt text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">2. 날짜 및 시간 선택</h3>
                  <p className="text-gray-600">필요한 서비스 날짜와 시간을 간편하게 선택하세요</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <i className="fas fa-check-circle text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">3. 예약 완료</h3>
                  <p className="text-gray-600">간편한 결제 후 전문 케어 매니저가 방문합니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 후기 - 수평 슬라이드로 변경 */}
      <section className="py-10 sm:py-12 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">고객 후기</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              케어 서비스를 이용한 고객님들의 진솔한 이야기를 들어보세요
            </p>
          </div>
          
          <div className="relative">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {[
                  {
                    name: "김민지",
                    text: "어머니를 돌봐주셨던 김영희 케어 매니저님 정말 감사합니다. 어머니도 매우 만족하셨고, 앞으로도 계속 이용할 예정입니다.",
                    rating: 5,
                    job: "직장인"
                  },
                  {
                    name: "박상현",
                    text: "아버지의 병원 동행이 필요했는데, 친절하고 세심하게 도와주셔서 정말 큰 도움이 되었습니다. 케어 품질이 매우 우수합니다.",
                    rating: 5,
                    job: "자영업자"
                  },
                  {
                    name: "이지연",
                    text: "케어 매니저님의 전문성에 놀랐습니다. 부모님께서 전에 없이 편안해하셨어요. 다음에도 같은 매니저님으로 예약할 예정입니다.",
                    rating: 4.8,
                    job: "프리랜서"
                  },
                  {
                    name: "최준호",
                    text: "정기적으로 부모님 케어를 맡기고 있는데, 항상 만족스럽습니다. 케어 매니저분들의 전문성과 친절함에 감사드립니다.",
                    rating: 5,
                    job: "회사원"
                  },
                  {
                    name: "장미영",
                    text: "첫 이용이라 걱정했는데, 매니저님께서 세심하게 돌봐주셔서 안심하고 맡길 수 있었습니다. 다음에도 꼭 이용할 예정입니다.",
                    rating: 4.9,
                    job: "교사"
                  }
                ].map((testimonial, idx) => (
                  <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0 mr-4">
                            <Avatar className="w-12 h-12 border-2 border-white/20">
                              <AvatarFallback className="bg-purple-700 text-white">{testimonial.name[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="font-bold text-lg text-white">{testimonial.name}</p>
                            <p className="text-sm text-white/70">{testimonial.job}</p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < Math.floor(testimonial.rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                            ></i>
                          ))}
                          <span className="ml-2 text-white/70">{testimonial.rating}</span>
                        </div>
                        <p className="text-white/80 italic">"{testimonial.text}"</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between w-full px-1 z-20 pointer-events-none">
                <CarouselPrevious className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
                <CarouselNext className="pointer-events-auto bg-white/70 hover:bg-white shadow-md border-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-orange {
          background: linear-gradient(135deg, #ff8a00 0%, #ff5630 100%);
        }
        
        .gradient-purple {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }
        
        .gradient-green {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </div>
  );
};

export default Home;