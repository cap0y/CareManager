// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
const App: React.FC = () => {
const [activeTab, setActiveTab] = useState('home');
const [selectedService, setSelectedService] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
const [showProfileMenu, setShowProfileMenu] = useState(false);
const handleLogin = (provider: 'email' | 'google' | 'kakao') => {
// Here you would implement actual authentication logic
console.log(`Logging in with ${provider}`);
setIsAuthenticated(true);
setShowAuthModal(false);
};
const handleLogout = () => {
setIsAuthenticated(false);
setShowProfileMenu(false);
};
const services = [
{ id: 'hospital', name: '병원 동행', icon: 'fas fa-hospital', color: 'bg-blue-100 text-blue-600' },
{ id: 'shopping', name: '장보기', icon: 'fas fa-shopping-cart', color: 'bg-green-100 text-green-600' },
{ id: 'housework', name: '가사 도움', icon: 'fas fa-home', color: 'bg-purple-100 text-purple-600' },
{ id: 'companion', name: '말벗', icon: 'fas fa-comments', color: 'bg-orange-100 text-orange-600' }
];
const careManagers = [
{
id: 1,
name: '김미영',
age: 45,
rating: 4.9,
reviews: 127,
experience: '5년',
location: '서울 강남구',
hourlyRate: 25000,
services: ['병원 동행', '장보기'],
certified: true,
image: 'https://readdy.ai/api/search-image?query=Professional%20Korean%20middle-aged%20woman%20caregiver%20with%20warm%20smile%20wearing%20neat%20uniform%20against%20clean%20white%20background%2C%20healthcare%20professional%20portrait%2C%20gentle%20expression%2C%20trustworthy%20appearance&width=120&height=120&seq=cm1&orientation=squarish'
},
{
id: 2,
name: '박정수',
age: 52,
rating: 4.8,
reviews: 89,
experience: '7년',
location: '서울 송파구',
hourlyRate: 23000,
services: ['가사 도움', '말벗'],
certified: true,
image: 'https://readdy.ai/api/search-image?query=Experienced%20Korean%20female%20caregiver%20with%20kind%20face%20and%20professional%20appearance%20wearing%20clean%20uniform%20against%20simple%20white%20background%2C%20mature%20healthcare%20worker%20portrait%2C%20caring%20expression&width=120&height=120&seq=cm2&orientation=squarish'
},
{
id: 3,
name: '이순희',
age: 48,
rating: 4.7,
reviews: 156,
experience: '6년',
location: '서울 마포구',
hourlyRate: 24000,
services: ['병원 동행', '말벗', '장보기'],
certified: true,
image: 'https://readdy.ai/api/search-image?query=Friendly%20Korean%20woman%20caregiver%20with%20professional%20demeanor%20wearing%20healthcare%20uniform%20against%20clean%20white%20background%2C%20experienced%20care%20provider%20portrait%2C%20compassionate%20smile&width=120&height=120&seq=cm3&orientation=squarish'
}
];
const renderHome = () => (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
<div className="flex items-center space-x-2">
<i className="fas fa-heart text-2xl text-pink-500"></i>
<span className="text-xl font-bold text-gray-800">케어링크</span>
</div>
<div className="flex items-center space-x-4">
{isAuthenticated ? (
<>
<i className="fas fa-bell text-gray-600 text-lg cursor-pointer"></i>
<div className="relative">
<Avatar
className="w-8 h-8 cursor-pointer"
onClick={() => setShowProfileMenu(!showProfileMenu)}
>
<AvatarImage src="https://readdy.ai/api/search-image?query=Professional%20Korean%20person%20avatar%20with%20friendly%20expression%20against%20clean%20background%2C%20modern%20profile%20picture%20style&width=32&height=32&seq=user1&orientation=squarish" />
<AvatarFallback>김</AvatarFallback>
</Avatar>
{showProfileMenu && (
<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
<div className="px-4 py-2 border-b">
<p className="font-semibold text-gray-800">김민수</p>
<p className="text-sm text-gray-500">kimminsu@email.com</p>
</div>
<div className="py-1">
<button onClick={() => setActiveTab('profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
<i className="fas fa-user mr-2"></i>회원 정보
</button>
<button onClick={() => setActiveTab('bookings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
<i className="fas fa-calendar mr-2"></i>예약 현황
</button>
<button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
<i className="fas fa-sign-out-alt mr-2"></i>로그아웃
</button>
</div>
</div>
)}
</div>
</>
) : (
<Button
onClick={() => {
setAuthMode('login');
setShowAuthModal(true);
}}
className="!rounded-button"
>
로그인
</Button>
)}
</div>
</div>
{/* Auth Modal */}
{showAuthModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg w-96 p-6">
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold">{authMode === 'login' ? '로그인' : '회원가입'}</h2>
<button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-700">
<i className="fas fa-times"></i>
</button>
</div>
<div className="space-y-4">
<Input
type="email"
placeholder="이메일"
className="w-full !rounded-button"
/>
<Input
type="password"
placeholder="비밀번호"
className="w-full !rounded-button"
/>
<Button
onClick={() => handleLogin('email')}
className="w-full bg-blue-600 hover:bg-blue-700 text-white !rounded-button"
>
{authMode === 'login' ? '로그인' : '회원가입'}
</Button>
<div className="relative my-6">
<div className="absolute inset-0 flex items-center">
<div className="w-full border-t border-gray-300"></div>
</div>
<div className="relative flex justify-center text-sm">
<span className="px-2 bg-white text-gray-500">또는</span>
</div>
</div>
<Button
onClick={() => handleLogin('google')}
variant="outline"
className="w-full !rounded-button"
>
<i className="fab fa-google mr-2"></i>
Google로 계속하기
</Button>
<Button
onClick={() => handleLogin('kakao')}
className="w-full bg-yellow-400 hover:bg-yellow-500 text-black !rounded-button"
>
<i className="fas fa-comment mr-2"></i>
카카오로 계속하기
</Button>
<div className="text-center mt-4">
<button
onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
className="text-sm text-blue-600 hover:underline"
>
{authMode === 'login' ? '회원가입하기' : '이미 계정이 있으신가요? 로그인'}
</button>
</div>
</div>
</div>
</div>
)}
{/* Hero Section */}
<div
className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-12"
style={{
backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20healthcare%20technology%20background%20with%20soft%20gradient%20colors%2C%20elderly%20care%20concept%20illustration%2C%20warm%20and%20caring%20atmosphere%20with%20subtle%20medical%20elements%2C%20clean%20and%20professional%20design&width=1440&height=300&seq=hero1&orientation=landscape')`,
backgroundSize: 'cover',
backgroundPosition: 'center'
}}
>
<div className="relative z-10 max-w-2xl">
<h1 className="text-3xl font-bold mb-4">부모님을 위한<br />믿을 수 있는 케어 서비스</h1>
<p className="text-lg mb-6 opacity-90">전문 케어 매니저가 부모님의 일상을 안전하고 따뜻하게 돌봐드립니다</p>
</div>
</div>
{/* Service Categories */}
<div className="px-6 py-8">
<h2 className="text-xl font-bold text-gray-800 mb-6">서비스 카테고리</h2>
<div className="grid grid-cols-2 gap-4">
{services.map((service) => (
<Card
key={service.id}
className="cursor-pointer hover:shadow-md transition-shadow border-[0.5px]"
onClick={() => setSelectedService(service.id)}
>
<CardContent className="p-6 text-center">
<div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}>
<i className={`${service.icon} text-2xl`}></i>
</div>
<h3 className="font-semibold text-gray-800">{service.name}</h3>
</CardContent>
</Card>
))}
</div>
</div>
{/* Recommended Care Managers */}
<div className="px-6 py-8 bg-white">
<div className="flex justify-between items-center mb-6">
<h2 className="text-xl font-bold text-gray-800">추천 케어 매니저</h2>
<Button variant="ghost" className="text-blue-600 !rounded-button whitespace-nowrap cursor-pointer">
전체보기 <i className="fas fa-chevron-right ml-1"></i>
</Button>
</div>
<div className="space-y-4">
{careManagers.map((manager) => (
<Card key={manager.id} className="cursor-pointer hover:shadow-md transition-shadow border-[0.5px]">
<CardContent className="p-4">
<div className="flex items-start space-x-4">
<div className="relative">
<Avatar className="w-16 h-16">
<AvatarImage src={manager.image} />
<AvatarFallback>{manager.name[0]}</AvatarFallback>
</Avatar>
{manager.certified && (
<div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
<i className="fas fa-check text-white text-xs"></i>
</div>
)}
</div>
<div className="flex-1">
<div className="flex items-center space-x-2 mb-1">
<h3 className="font-semibold text-gray-800">{manager.name}</h3>
<span className="text-sm text-gray-500">({manager.age}세)</span>
{manager.certified && (
<Badge variant="secondary" className="text-xs">인증</Badge>
)}
</div>
<div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
<div className="flex items-center">
<i className="fas fa-star text-yellow-400 mr-1"></i>
<span>{manager.rating}</span>
<span className="ml-1">({manager.reviews})</span>
</div>
<span>경력 {manager.experience}</span>
<span>{manager.location}</span>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-wrap gap-1">
{manager.services.map((service, index) => (
<Badge key={index} variant="outline" className="text-xs">
{service}
</Badge>
))}
</div>
<div className="text-right">
<div className="text-lg font-bold text-blue-600">
{manager.hourlyRate.toLocaleString()}원
</div>
<div className="text-xs text-gray-500">시간당</div>
</div>
</div>
</div>
</div>
<div className="flex space-x-2 mt-4">
<Button variant="outline" className="flex-1 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-comment mr-2"></i>
문의하기
</Button>
<Button className="flex-1 bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-calendar mr-2"></i>
예약하기
</Button>
</div>
</CardContent>
</Card>
))}
</div>
</div>
{/* Real-time Popular */}
<div className="px-6 py-8">
<h2 className="text-xl font-bold text-gray-800 mb-6">실시간 인기 케어 매니저</h2>
<div className="grid grid-cols-1 gap-4">
{careManagers.slice(0, 2).map((manager, index) => (
<Card key={manager.id} className="cursor-pointer hover:shadow-md transition-shadow">
<CardContent className="p-4">
<div className="flex items-center space-x-3">
<div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full font-bold text-sm">
{index + 1}
</div>
<Avatar className="w-12 h-12">
<AvatarImage src={manager.image} />
<AvatarFallback>{manager.name[0]}</AvatarFallback>
</Avatar>
<div className="flex-1">
<div className="flex items-center space-x-2">
<h4 className="font-semibold">{manager.name}</h4>
<Badge variant="secondary" className="text-xs">HOT</Badge>
</div>
<div className="flex items-center text-sm text-gray-600">
<i className="fas fa-star text-yellow-400 mr-1"></i>
<span>{manager.rating} ({manager.reviews})</span>
</div>
</div>
<div className="text-right">
<div className="font-bold text-blue-600">{manager.hourlyRate.toLocaleString()}원</div>
<div className="text-xs text-gray-500">시간당</div>
</div>
</div>
</CardContent>
</Card>
))}
</div>
</div>
</div>
);
const renderSearch = () => (
<div className="min-h-screen bg-gray-50">
{/* Search Header */}
<div className="bg-white shadow-sm px-6 py-4">
<div className="flex items-center space-x-3 mb-4">
<div className="flex-1 relative">
<Input
placeholder="지역, 서비스명으로 검색해보세요"
className="pl-10 pr-4 py-3 border-gray-300 !rounded-button text-sm"
/>
<i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<Button variant="outline" className="px-4 py-3 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-filter"></i>
</Button>
</div>
{/* Filter Chips */}
<div className="flex space-x-2 overflow-x-auto">
<Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-map-marker-alt mr-1"></i>
지역 선택
</Button>
{services.map((service) => (
<Button
key={service.id}
variant={selectedService === service.id ? "default" : "outline"}
size="sm"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setSelectedService(selectedService === service.id ? '' : service.id)}
>
{service.name}
</Button>
))}
</div>
</div>
{/* Filter Options */}
<div className="bg-white border-b px-6 py-3">
<div className="flex space-x-4 text-sm">
<Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
평점순 <i className="fas fa-chevron-down ml-1"></i>
</Button>
<Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
후기순 <i className="fas fa-chevron-down ml-1"></i>
</Button>
<Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
경력순 <i className="fas fa-chevron-down ml-1"></i>
</Button>
<Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
요금순 <i className="fas fa-chevron-down ml-1"></i>
</Button>
</div>
</div>
{/* Search Results */}
<div className="px-6 py-4">
<div className="flex justify-between items-center mb-4">
<span className="text-sm text-gray-600">총 {careManagers.length}명의 케어 매니저</span>
<div className="flex items-center space-x-2">
<Button variant="ghost" size="sm" className="p-2 !rounded-button cursor-pointer">
<i className="fas fa-th-large"></i>
</Button>
<Button variant="ghost" size="sm" className="p-2 !rounded-button cursor-pointer">
<i className="fas fa-list"></i>
</Button>
</div>
</div>
<div className="space-y-4">
{careManagers.map((manager) => (
<Card key={manager.id} className="cursor-pointer hover:shadow-md transition-shadow border-[0.5px]">
<CardContent className="p-4">
<div className="flex items-start space-x-4">
<div className="relative">
<Avatar className="w-16 h-16">
<AvatarImage src={manager.image} />
<AvatarFallback>{manager.name[0]}</AvatarFallback>
</Avatar>
{manager.certified && (
<div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
<i className="fas fa-check text-white text-xs"></i>
</div>
)}
</div>
<div className="flex-1">
<div className="flex items-center space-x-2 mb-1">
<h3 className="font-semibold text-gray-800">{manager.name}</h3>
<span className="text-sm text-gray-500">({manager.age}세)</span>
{manager.certified && (
<Badge variant="secondary" className="text-xs">인증</Badge>
)}
</div>
<div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
<div className="flex items-center">
<i className="fas fa-star text-yellow-400 mr-1"></i>
<span>{manager.rating}</span>
<span className="ml-1">({manager.reviews})</span>
</div>
<span>경력 {manager.experience}</span>
<span>{manager.location}</span>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-wrap gap-1">
{manager.services.map((service, index) => (
<Badge key={index} variant="outline" className="text-xs">
{service}
</Badge>
))}
</div>
<div className="text-right">
<div className="text-lg font-bold text-blue-600">
{manager.hourlyRate.toLocaleString()}원
</div>
<div className="text-xs text-gray-500">시간당</div>
</div>
</div>
</div>
</div>
<div className="flex space-x-2 mt-4">
<Button variant="outline" className="flex-1 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-comment mr-2"></i>
문의하기
</Button>
<Button className="flex-1 bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-calendar mr-2"></i>
예약하기
</Button>
</div>
</CardContent>
</Card>
))}
</div>
</div>
</div>
);
const renderBookings = () => (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-white shadow-sm px-6 py-4">
<h1 className="text-xl font-bold text-gray-800">예약 현황</h1>
</div>
<Tabs defaultValue="upcoming" className="w-full">
<TabsList className="grid w-full grid-cols-3 bg-white border-b">
<TabsTrigger value="upcoming" className="!rounded-button">예정된 예약</TabsTrigger>
<TabsTrigger value="ongoing" className="!rounded-button">진행 중</TabsTrigger>
<TabsTrigger value="completed" className="!rounded-button">완료된 예약</TabsTrigger>
</TabsList>
<TabsContent value="upcoming" className="px-6 py-4">
<Card className="border-[0.5px]">
<CardContent className="p-4">
<div className="flex items-start space-x-4">
<Avatar className="w-12 h-12">
<AvatarImage src={careManagers[0].image} />
<AvatarFallback>{careManagers[0].name[0]}</AvatarFallback>
</Avatar>
<div className="flex-1">
<div className="flex items-center justify-between mb-2">
<h3 className="font-semibold">{careManagers[0].name}</h3>
<Badge className="bg-blue-100 text-blue-600">예약 확정</Badge>
</div>
<div className="text-sm text-gray-600 space-y-1">
<div className="flex items-center">
<i className="fas fa-calendar mr-2 w-4"></i>
<span>2025년 7월 20일 (일) 14:00 - 17:00</span>
</div>
<div className="flex items-center">
<i className="fas fa-hospital mr-2 w-4"></i>
<span>병원 동행 서비스</span>
</div>
<div className="flex items-center">
<i className="fas fa-map-marker-alt mr-2 w-4"></i>
<span>서울 강남구 삼성동</span>
</div>
</div>
<div className="flex items-center justify-between mt-3">
<span className="font-semibold text-blue-600">75,000원</span>
<div className="flex space-x-2">
<Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-comment mr-1"></i>
채팅
</Button>
<Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-phone mr-1"></i>
통화
</Button>
</div>
</div>
</div>
</div>
</CardContent>
</Card>
</TabsContent>
<TabsContent value="ongoing" className="px-6 py-4">
<Card>
<CardContent className="p-4">
<div className="flex items-start space-x-4">
<Avatar className="w-12 h-12">
<AvatarImage src={careManagers[1].image} />
<AvatarFallback>{careManagers[1].name[0]}</AvatarFallback>
</Avatar>
<div className="flex-1">
<div className="flex items-center justify-between mb-2">
<h3 className="font-semibold">{careManagers[1].name}</h3>
<Badge className="bg-green-100 text-green-600">서비스 진행 중</Badge>
</div>
<div className="text-sm text-gray-600 space-y-1">
<div className="flex items-center">
<i className="fas fa-clock mr-2 w-4"></i>
<span>진행 시간: 1시간 30분</span>
</div>
<div className="flex items-center">
<i className="fas fa-home mr-2 w-4"></i>
<span>가사 도움 서비스</span>
</div>
<div className="flex items-center">
<i className="fas fa-map-marker-alt mr-2 w-4"></i>
<span>서울 송파구 잠실동</span>
</div>
</div>
{/* Real-time Status */}
<div className="bg-green-50 rounded-lg p-3 mt-3">
<div className="flex items-center text-sm text-green-700">
<i className="fas fa-check-circle mr-2"></i>
<span>부모님 댁에 도착했습니다 (15:30)</span>
</div>
</div>
<div className="flex items-center justify-between mt-3">
<span className="font-semibold text-blue-600">69,000원</span>
<div className="flex space-x-2">
<Button size="sm" className="bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-map mr-1"></i>
실시간 위치
</Button>
<Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-comment mr-1"></i>
채팅
</Button>
</div>
</div>
</div>
</div>
</CardContent>
</Card>
</TabsContent>
<TabsContent value="completed" className="px-6 py-4">
<div className="space-y-4">
{careManagers.map((manager, index) => (
<Card key={manager.id}>
<CardContent className="p-4">
<div className="flex items-start space-x-4">
<Avatar className="w-12 h-12">
<AvatarImage src={manager.image} />
<AvatarFallback>{manager.name[0]}</AvatarFallback>
</Avatar>
<div className="flex-1">
<div className="flex items-center justify-between mb-2">
<h3 className="font-semibold">{manager.name}</h3>
<Badge variant="secondary">완료</Badge>
</div>
<div className="text-sm text-gray-600 space-y-1">
<div className="flex items-center">
<i className="fas fa-calendar mr-2 w-4"></i>
<span>2025년 7월 {15 + index}일 완료</span>
</div>
<div className="flex items-center">
<i className="fas fa-clock mr-2 w-4"></i>
<span>서비스 시간: 3시간</span>
</div>
</div>
<div className="flex items-center justify-between mt-3">
<span className="font-semibold text-gray-600">{(manager.hourlyRate * 3).toLocaleString()}원</span>
<Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-star mr-1"></i>
리뷰 작성
</Button>
</div>
</div>
</div>
</CardContent>
</Card>
))}
</div>
</TabsContent>
</Tabs>
</div>
);
const renderChat = () => (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-white shadow-sm px-6 py-4">
<h1 className="text-xl font-bold text-gray-800">채팅</h1>
</div>
{/* Chat List */}
<div className="bg-white">
{careManagers.map((manager, index) => (
<div key={manager.id} className="border-b border-gray-100 px-6 py-4 cursor-pointer hover:bg-gray-50">
<div className="flex items-center space-x-3">
<div className="relative">
<Avatar className="w-12 h-12">
<AvatarImage src={manager.image} />
<AvatarFallback>{manager.name[0]}</AvatarFallback>
</Avatar>
{index === 0 && (
<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
<span className="text-white text-xs">1</span>
</div>
)}
</div>
<div className="flex-1">
<div className="flex items-center justify-between mb-1">
<h3 className="font-semibold text-gray-800">{manager.name}</h3>
<span className="text-xs text-gray-500">
{index === 0 ? '방금 전' : `${index + 1}시간 전`}
</span>
</div>
<p className="text-sm text-gray-600 truncate">
{index === 0
? '네, 내일 오후 2시에 병원 동행 가능합니다.'
: '서비스 관련해서 궁금한 점이 있으시면 언제든 연락주세요.'
}
</p>
</div>
</div>
</div>
))}
</div>
{/* Chat Room Preview */}
<div className="px-6 py-4">
<Card className="border-[0.5px]">
<CardHeader className="pb-3">
<div className="flex items-center space-x-3">
<Avatar className="w-10 h-10">
<AvatarImage src={careManagers[0].image} />
<AvatarFallback>{careManagers[0].name[0]}</AvatarFallback>
</Avatar>
<div className="flex-1">
<h3 className="font-semibold">{careManagers[0].name}</h3>
<div className="flex items-center space-x-2 text-sm text-gray-500">
<span>온라인</span>
<Button variant="ghost" size="sm" className="p-1 !rounded-button cursor-pointer">
<i className="fas fa-phone text-blue-600"></i>
</Button>
</div>
</div>
</div>
</CardHeader>
<CardContent className="pt-0">
<ScrollArea className="h-64 w-full">
<div className="space-y-3">
{/* Messages */}
<div className="flex justify-start">
<div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
<p className="text-sm">안녕하세요! 병원 동행 서비스 문의드립니다.</p>
<span className="text-xs text-gray-500">14:20</span>
</div>
</div>
<div className="flex justify-end">
<div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs">
<p className="text-sm">네, 안녕하세요! 어떤 병원으로 동행이 필요하신가요?</p>
<span className="text-xs text-blue-100">14:22</span>
</div>
</div>
<div className="flex justify-start">
<div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
<p className="text-sm">강남 세브란스병원 정형외과입니다. 내일 오후 2시 예약이에요.</p>
<span className="text-xs text-gray-500">14:25</span>
</div>
</div>
<div className="flex justify-end">
<div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs">
<p className="text-sm">네, 내일 오후 2시에 병원 동행 가능합니다. 1시 30분경에 댁으로 방문드리겠습니다.</p>
<span className="text-xs text-blue-100">14:27</span>
</div>
</div>
</div>
</ScrollArea>
{/* Message Input */}
<div className="flex items-center space-x-2 mt-4 pt-4 border-t">
<div className="flex-1 relative">
<Input
placeholder="메시지를 입력하세요..."
className="pr-20 border-gray-300 !rounded-button text-sm"
/>
<div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
<Button variant="ghost" size="sm" className="p-1 !rounded-button cursor-pointer">
<i className="fas fa-paperclip text-gray-400"></i>
</Button>
<Button variant="ghost" size="sm" className="p-1 !rounded-button cursor-pointer">
<i className="fas fa-camera text-gray-400"></i>
</Button>
</div>
</div>
<Button size="sm" className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-paper-plane"></i>
</Button>
</div>
</CardContent>
</Card>
</div>
</div>
);
const renderProfile = () => (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-white shadow-sm px-6 py-4">
<h1 className="text-xl font-bold text-gray-800">마이페이지</h1>
</div>
{/* Profile Section */}
<div className="bg-white px-6 py-6 border-b">
<div className="flex items-center space-x-4">
<Avatar className="w-16 h-16">
<AvatarImage src="https://readdy.ai/api/search-image?query=Professional%20Korean%20person%20avatar%20with%20friendly%20expression%20against%20clean%20background%2C%20modern%20profile%20picture%20style&width=64&height=64&seq=user2&orientation=squarish" />
<AvatarFallback>김</AvatarFallback>
</Avatar>
<div className="flex-1">
<h2 className="text-lg font-semibold text-gray-800">김민수</h2>
<p className="text-sm text-gray-600">kimminsu@email.com</p>
<p className="text-sm text-gray-600">010-1234-5678</p>
</div>
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-edit mr-2"></i>
편집
</Button>
</div>
</div>
{/* Menu Items */}
<div className="bg-white mt-2">
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab('bookings')}>
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-calendar-alt text-gray-600 w-5"></i>
<span className="text-gray-800">예약 내역</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
<div className="px-6 py-4 border-b hover:bg-gray-50">
<a href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/71b9c941-dc19-44bf-aa60-300cc9ae91bd" data-readdy="true" className="block">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-credit-card text-gray-600 w-5"></i>
<span className="text-gray-800">결제 내역</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</a>
</div>
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-star text-gray-600 w-5"></i>
<span className="text-gray-800">내가 쓴 리뷰</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-heart text-gray-600 w-5"></i>
<span className="text-gray-800">찜한 케어 매니저</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
</div>
{/* Settings */}
<div className="bg-white mt-2">
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-bell text-gray-600 w-5"></i>
<span className="text-gray-800">알림 설정</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-shield-alt text-gray-600 w-5"></i>
<span className="text-gray-800">개인정보 보호</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
<div className="px-6 py-4 border-b cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-question-circle text-gray-600 w-5"></i>
<span className="text-gray-800">고객 지원</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
<div className="px-6 py-4 cursor-pointer hover:bg-gray-50">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<i className="fas fa-sign-out-alt text-red-600 w-5"></i>
<span className="text-red-600">로그아웃</span>
</div>
<i className="fas fa-chevron-right text-gray-400"></i>
</div>
</div>
</div>
{/* Statistics */}
<div className="px-6 py-6">
<h3 className="text-lg font-semibold text-gray-800 mb-4">이용 통계</h3>
<div className="grid grid-cols-2 gap-4">
<Card className="border-[0.5px]">
<CardContent className="p-4 text-center">
<div className="text-2xl font-bold text-blue-600 mb-1">12</div>
<div className="text-sm text-gray-600">총 예약 횟수</div>
</CardContent>
</Card>
<Card>
<CardContent className="p-4 text-center">
<div className="text-2xl font-bold text-green-600 mb-1">36시간</div>
<div className="text-sm text-gray-600">총 서비스 시간</div>
</CardContent>
</Card>
</div>
</div>
</div>
);
const renderContent = () => {
switch (activeTab) {
case 'home':
return renderHome();
case 'search':
return renderSearch();
case 'bookings':
return renderBookings();
case 'chat':
return renderChat();
case 'profile':
return renderProfile();
default:
return renderHome();
}
};
return (
<div className="w-full max-w-md mx-auto bg-white relative">
{renderContent()}
{/* Bottom Navigation */}
<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 px-6 py-2">
<div className="flex justify-around">
{[
{ id: 'home', icon: 'fas fa-home', label: '홈' },
{ id: 'search', icon: 'fas fa-search', label: '검색' },
{ id: 'bookings', icon: 'fas fa-calendar', label: '예약현황' },
{ id: 'chat', icon: 'fas fa-comment', label: '채팅' },
{ id: 'profile', icon: 'fas fa-user', label: '마이페이지' }
].map((tab) => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`flex flex-col items-center py-2 px-3 cursor-pointer ${
activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
}`}
>
<i className={`${tab.icon} text-lg mb-1`}></i>
<span className="text-xs">{tab.label}</span>
</button>
))}
</div>
</div>
{/* Bottom padding to prevent content from being hidden behind navigation */}
<div className="h-20"></div>
</div>
);
};
export default App