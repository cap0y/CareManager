// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as echarts from 'echarts';
const App: React.FC = () => {
const [selectedMenu, setSelectedMenu] = useState('dashboard');
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
useEffect(() => {
// 거래액 추이 차트
const revenueChart = echarts.init(document.getElementById('revenueChart'));
const revenueOption = {
animation: false,
title: {
text: '거래액 추이',
textStyle: {
fontSize: 16,
fontWeight: 'bold'
}
},
tooltip: {
trigger: 'axis'
},
legend: {
data: ['일별', '주별', '월별']
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: {
type: 'category',
data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
},
yAxis: {
type: 'value',
axisLabel: {
formatter: '{value}만원'
}
},
series: [
{
name: '일별',
type: 'line',
data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
smooth: true
},
{
name: '주별',
type: 'line',
data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410],
smooth: true
},
{
name: '월별',
type: 'line',
data: [150, 232, 201, 154, 190, 330, 410, 320, 280, 350, 420, 480],
smooth: true
}
]
};
revenueChart.setOption(revenueOption);
// 서비스 유형별 분포 차트
const serviceChart = echarts.init(document.getElementById('serviceChart'));
const serviceOption = {
animation: false,
title: {
text: '서비스 유형별 분포',
textStyle: {
fontSize: 16,
fontWeight: 'bold'
}
},
tooltip: {
trigger: 'item'
},
legend: {
orient: 'vertical',
left: 'left'
},
series: [
{
name: '서비스 유형',
type: 'pie',
radius: '50%',
data: [
{ value: 1048, name: '병원 동행' },
{ value: 735, name: '장보기' },
{ value: 580, name: '가사 도움' },
{ value: 484, name: '말벗' },
{ value: 300, name: '기타' }
],
emphasis: {
itemStyle: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
}
}
}
]
};
serviceChart.setOption(serviceOption);
// 지역별 이용 현황 차트
const regionChart = echarts.init(document.getElementById('regionChart'));
const regionOption = {
animation: false,
title: {
text: '지역별 이용 현황',
textStyle: {
fontSize: 16,
fontWeight: 'bold'
}
},
tooltip: {
trigger: 'axis',
axisPointer: {
type: 'shadow'
}
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: {
type: 'value',
boundaryGap: [0, 0.01]
},
yAxis: {
type: 'category',
data: ['제주도', '강원도', '충청도', '전라도', '경상도', '경기도', '서울']
},
series: [
{
name: '이용 건수',
type: 'bar',
data: [18203, 23489, 29034, 104970, 131744, 630230, 681807]
}
]
};
regionChart.setOption(regionOption);
// 윈도우 리사이즈 시 차트 크기 조정
const handleResize = () => {
revenueChart.resize();
serviceChart.resize();
regionChart.resize();
};
window.addEventListener('resize', handleResize);
return () => {
window.removeEventListener('resize', handleResize);
revenueChart.dispose();
serviceChart.dispose();
regionChart.dispose();
};
}, []);
const menuItems = [
{ id: 'dashboard', name: '대시보드', icon: 'fas fa-tachometer-alt' },
{ id: 'members', name: '회원 관리', icon: 'fas fa-users' },
{ id: 'caregivers', name: '케어매니저 관리', icon: 'fas fa-user-nurse' },
{ id: 'services', name: '서비스/결제 관리', icon: 'fas fa-credit-card' },
{ id: 'settlement', name: '정산 관리', icon: 'fas fa-calculator' },
{ id: 'disputes', name: '분쟁 조정', icon: 'fas fa-gavel' },
{ id: 'content', name: '콘텐츠 관리', icon: 'fas fa-edit' }
];
const statsCards = [
{
title: '총 회원 수',
value: '12,847',
change: '+12.5%',
changeType: 'increase',
icon: 'fas fa-users'
},
{
title: '케어매니저 수',
value: '1,234',
change: '+8.2%',
changeType: 'increase',
icon: 'fas fa-user-nurse'
},
{
title: '일별 거래액',
value: '₩2,847,000',
change: '+15.3%',
changeType: 'increase',
icon: 'fas fa-won-sign'
},
{
title: '서비스 요청 현황',
value: '156',
change: '-2.1%',
changeType: 'decrease',
icon: 'fas fa-clipboard-list'
}
];
const recentActivities = [
{
type: '신규 회원 가입',
user: '김영희님',
time: '5분 전',
status: 'success'
},
{
type: '신규 서비스 요청',
user: '박철수님',
time: '12분 전',
status: 'pending'
},
{
type: '케어매니저 신청',
user: '이미영님',
time: '23분 전',
status: 'review'
},
{
type: '정산 처리 완료',
user: '정수진님',
time: '1시간 전',
status: 'completed'
},
{
type: '신규 회원 가입',
user: '최민호님',
time: '2시간 전',
status: 'success'
}
];
const getStatusBadge = (status: string) => {
switch (status) {
case 'success':
return <Badge className="bg-green-100 text-green-800">완료</Badge>;
case 'pending':
return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>;
case 'review':
return <Badge className="bg-blue-100 text-blue-800">검토중</Badge>;
case 'completed':
return <Badge className="bg-purple-100 text-purple-800">처리완료</Badge>;
default:
return <Badge>상태</Badge>;
}
};
return (
<div className="min-h-screen bg-gray-50">
{/* 모바일 메뉴 오버레이 */}
{isMobileMenuOpen && (
<div
className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
onClick={() => setIsMobileMenuOpen(false)}
/>
)}
{/* 좌측 네비게이션 */}
<div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
} lg:translate-x-0`}>
<div className="flex flex-col h-full">
{/* 로고 영역 */}
<div className="flex items-center justify-between p-6 border-b">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
<i className="fas fa-heart text-white text-lg"></i>
</div>
<div>
<h1 className="text-xl font-bold text-gray-900">케어링크</h1>
<p className="text-sm text-gray-500">관리자</p>
</div>
</div>
<Button
variant="ghost"
size="sm"
className="lg:hidden !rounded-button cursor-pointer whitespace-nowrap"
onClick={() => setIsMobileMenuOpen(false)}
>
<i className="fas fa-times"></i>
</Button>
</div>
{/* 메뉴 항목들 */}
<ScrollArea className="flex-1 px-4 py-6">
<nav className="space-y-2">
{menuItems.map((item) => (
<a
key={item.id}
href={
item.id === 'caregivers' 
? 'https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/15e7a580-5e32-484d-a718-b17f91fa9029'
: item.id === 'members'
? 'https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/9ec81547-ee70-413c-bc32-a9291821cf05'
: '#'
}
data-readdy={item.id === 'caregivers' || item.id === 'members' ? 'true' : undefined}
className="block w-full"
>
<Button
variant={selectedMenu === item.id ? "default" : "ghost"}
className={`w-full justify-start !rounded-button cursor-pointer whitespace-nowrap ${
selectedMenu === item.id
? 'bg-blue-600 text-white hover:bg-blue-700'
: 'text-gray-700 hover:bg-gray-100'
}`}
onClick={() => {
setSelectedMenu(item.id);
setIsMobileMenuOpen(false);
}}
>
<i className={`${item.icon} mr-3 text-sm`}></i>
{item.name}
</Button>
</a>
))}
</nav>
</ScrollArea>
{/* 하단 사용자 정보 */}
<div className="p-4 border-t">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
<i className="fas fa-user text-gray-600"></i>
</div>
<div>
<p className="text-sm font-medium text-gray-900">관리자</p>
<p className="text-xs text-gray-500">admin@carelink.com</p>
</div>
</div>
</div>
</div>
</div>
{/* 메인 컨텐츠 영역 */}
<div className="lg:ml-64">
{/* 상단 헤더 */}
<header className="bg-white shadow-sm border-b px-6 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<Button
variant="ghost"
size="sm"
className="lg:hidden !rounded-button cursor-pointer whitespace-nowrap"
onClick={() => setIsMobileMenuOpen(true)}
>
<i className="fas fa-bars text-lg"></i>
</Button>
<div>
<h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
<p className="text-sm text-gray-500">케어링크 관리자 대시보드에 오신 것을 환영합니다</p>
</div>
</div>
<div className="flex items-center space-x-4">
<Button variant="outline" className="!rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-download mr-2"></i>
리포트 다운로드
</Button>
<Button className="!rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-sync-alt mr-2"></i>
새로고침
</Button>
</div>
</div>
</header>
{/* 대시보드 메인 컨텐츠 */}
<main className="p-6 space-y-6">
{/* 핵심 지표 카드들 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{statsCards.map((card, index) => (
<Card key={index} className="hover:shadow-lg transition-shadow duration-200">
<CardContent className="p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-gray-600">{card.title}</p>
<p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
<div className="flex items-center mt-2">
<span className={`text-sm font-medium ${
card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
}`}>
<i className={`fas ${
card.changeType === 'increase' ? 'fa-arrow-up' : 'fa-arrow-down'
} mr-1`}></i>
{card.change}
</span>
<span className="text-sm text-gray-500 ml-2">전일 대비</span>
</div>
</div>
<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
card.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
}`}>
<i className={`${card.icon} text-lg ${
card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
}`}></i>
</div>
</div>
</CardContent>
</Card>
))}
</div>
{/* 차트 섹션 */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card>
<CardHeader>
<CardTitle className="flex items-center justify-between">
<span>거래액 추이</span>
<div className="flex space-x-2">
<Button variant="outline" size="sm" className="!rounded-button cursor-pointer whitespace-nowrap">일별</Button>
<Button variant="outline" size="sm" className="!rounded-button cursor-pointer whitespace-nowrap">주별</Button>
<Button variant="outline" size="sm" className="!rounded-button cursor-pointer whitespace-nowrap">월별</Button>
</div>
</CardTitle>
</CardHeader>
<CardContent>
<div id="revenueChart" style={{ width: '100%', height: '300px' }}></div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle>서비스 유형별 분포</CardTitle>
</CardHeader>
<CardContent>
<div id="serviceChart" style={{ width: '100%', height: '300px' }}></div>
</CardContent>
</Card>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* 지역별 이용 현황 */}
<Card className="lg:col-span-2">
<CardHeader>
<CardTitle>지역별 이용 현황</CardTitle>
</CardHeader>
<CardContent>
<div id="regionChart" style={{ width: '100%', height: '300px' }}></div>
</CardContent>
</Card>
{/* 최근 활동 내역 */}
<Card>
<CardHeader>
<CardTitle>최근 활동 내역</CardTitle>
</CardHeader>
<CardContent>
<ScrollArea className="h-80">
<div className="space-y-4">
{recentActivities.map((activity, index) => (
<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
<div className="flex-1">
<p className="text-sm font-medium text-gray-900">{activity.type}</p>
<p className="text-xs text-gray-600">{activity.user}</p>
<p className="text-xs text-gray-500">{activity.time}</p>
</div>
<div>
{getStatusBadge(activity.status)}
</div>
</div>
))}
</div>
</ScrollArea>
</CardContent>
</Card>
</div>
{/* 하단 요약 정보 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Card>
<CardHeader>
<CardTitle className="text-lg">금일 신규 가입</CardTitle>
</CardHeader>
<CardContent>
<div className="text-center">
<p className="text-3xl font-bold text-blue-600">47명</p>
<p className="text-sm text-gray-500 mt-2">어제보다 12명 증가</p>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle className="text-lg">대기중인 승인</CardTitle>
</CardHeader>
<CardContent>
<div className="text-center">
<p className="text-3xl font-bold text-orange-600">23건</p>
<p className="text-sm text-gray-500 mt-2">케어매니저 신청 승인 대기</p>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle className="text-lg">처리 대기 분쟁</CardTitle>
</CardHeader>
<CardContent>
<div className="text-center">
<p className="text-3xl font-bold text-red-600">3건</p>
<p className="text-sm text-gray-500 mt-2">긴급 처리 필요</p>
</div>
</CardContent>
</Card>
</div>
</main>
</div>
</div>
);
};
export default App