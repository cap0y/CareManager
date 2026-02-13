// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
const App: React.FC = () => {
const [selectedMenu, setSelectedMenu] = useState('caremanagers');
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [selectedFilter, setSelectedFilter] = useState('all');
const [selectedCareManagers, setSelectedCareManagers] = useState<number[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [selectedCareManager, setSelectedCareManager] = useState<any>(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [sortField, setSortField] = useState('name');
const [sortDirection, setSortDirection] = useState('asc');
const menuItems = [
{ id: 'dashboard', label: '대시보드', icon: 'fas fa-tachometer-alt' },
{ id: 'members', label: '회원 관리', icon: 'fas fa-users' },
{ id: 'caremanagers', label: '케어매니저 관리', icon: 'fas fa-user-nurse' },
{ id: 'services', label: '서비스/결제 관리', icon: 'fas fa-credit-card' },
{ id: 'settlement', label: '정산 관리', icon: 'fas fa-calculator' },
{ id: 'disputes', label: '분쟁 조정', icon: 'fas fa-balance-scale' },
{ id: 'content', label: '콘텐츠 관리', icon: 'fas fa-edit' }
];
const careManagersData = [
{
id: 1,
name: '김미영',
phone: '010-1234-5678',
email: 'kim@example.com',
region: '서울 강남구',
status: 'approved',
rating: 4.8,
joinDate: '2024-01-15',
services: 156,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm001&orientation=squarish',
certifications: ['간병사 자격증', '응급처치 자격증'],
experience: '5년',
specialties: ['노인 케어', '병원 동행', '가사 도움'],
address: '서울시 강남구 역삼동',
bio: '5년간의 케어 경험을 바탕으로 정성스럽고 전문적인 서비스를 제공합니다.'
},
{
id: 2,
name: '박수진',
phone: '010-2345-6789',
email: 'park@example.com',
region: '서울 서초구',
status: 'pending',
rating: 4.6,
joinDate: '2024-02-20',
services: 89,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm002&orientation=squarish',
certifications: ['간병사 자격증'],
experience: '3년',
specialties: ['장보기', '말벗', '가사 도움'],
address: '서울시 서초구 서초동',
bio: '따뜻한 마음으로 어르신들을 돌보는 것이 저의 사명입니다.'
},
{
id: 3,
name: '이정화',
phone: '010-3456-7890',
email: 'lee@example.com',
region: '경기 성남시',
status: 'approved',
rating: 4.9,
joinDate: '2023-11-10',
services: 234,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm003&orientation=squarish',
certifications: ['간병사 자격증', '응급처치 자격증', '치매 케어 자격증'],
experience: '8년',
specialties: ['치매 케어', '병원 동행', '재활 도움'],
address: '경기도 성남시 분당구',
bio: '전문적인 치매 케어 경험을 바탕으로 최고의 서비스를 제공합니다.'
},
{
id: 4,
name: '최영희',
phone: '010-4567-8901',
email: 'choi@example.com',
region: '인천 남동구',
status: 'rejected',
rating: 4.2,
joinDate: '2024-03-05',
services: 45,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm004&orientation=squarish',
certifications: ['간병사 자격증'],
experience: '2년',
specialties: ['가사 도움', '말벗'],
address: '인천시 남동구 구월동',
bio: '성실하고 꼼꼼한 케어 서비스를 제공하겠습니다.'
},
{
id: 5,
name: '정민선',
phone: '010-5678-9012',
email: 'jung@example.com',
region: '부산 해운대구',
status: 'approved',
rating: 4.7,
joinDate: '2023-12-18',
services: 178,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm005&orientation=squarish',
certifications: ['간병사 자격증', '응급처치 자격증'],
experience: '6년',
specialties: ['노인 케어', '장보기', '병원 동행'],
address: '부산시 해운대구 우동',
bio: '부산 지역에서 6년간 케어 서비스를 제공해온 경험 많은 케어매니저입니다.'
},
{
id: 6,
name: '강소영',
phone: '010-6789-0123',
email: 'kang@example.com',
region: '대구 수성구',
status: 'pending',
rating: 4.4,
joinDate: '2024-02-28',
services: 67,
profileImage: 'https://readdy.ai/api/search-image?query=professional%20korean%20female%20caregiver%20wearing%20medical%20uniform%20smiling%20warmly%20in%20clean%20modern%20healthcare%20facility%20with%20soft%20natural%20lighting%20and%20minimalist%20white%20background&width=80&height=80&seq=cm006&orientation=squarish',
certifications: ['간병사 자격증'],
experience: '4년',
specialties: ['가사 도움', '말벗', '장보기'],
address: '대구시 수성구 범어동',
bio: '어르신들과의 소통을 중요하게 생각하며 따뜻한 케어를 제공합니다.'
}
];
const itemsPerPage = 5;
const totalPages = Math.ceil(careManagersData.length / itemsPerPage);
const getStatusBadge = (status: string) => {
const statusConfig = {
approved: { label: '승인', className: 'bg-green-100 text-green-800' },
pending: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
rejected: { label: '거부', className: 'bg-red-100 text-red-800' }
};
const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
return <Badge className={config.className}>{config.label}</Badge>;
};
const renderStars = (rating: number) => {
const stars = [];
const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 !== 0;
for (let i = 0; i < fullStars; i++) {
stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
}
if (hasHalfStar) {
stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
}
const remainingStars = 5 - Math.ceil(rating);
for (let i = 0; i < remainingStars; i++) {
stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-300"></i>);
}
return stars;
};
const filteredData = careManagersData.filter(manager => {
const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
manager.phone.includes(searchTerm) ||
manager.region.toLowerCase().includes(searchTerm.toLowerCase());
const matchesFilter = selectedFilter === 'all' || manager.status === selectedFilter;
return matchesSearch && matchesFilter;
});
const sortedData = [...filteredData].sort((a, b) => {
let aValue = a[sortField as keyof typeof a];
let bValue = b[sortField as keyof typeof b];
if (typeof aValue === 'string') {
aValue = aValue.toLowerCase();
bValue = (bValue as string).toLowerCase();
}
if (sortDirection === 'asc') {
return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
} else {
return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
}
});
const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
const handleSort = (field: string) => {
if (sortField === field) {
setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
} else {
setSortField(field);
setSortDirection('asc');
}
};
const handleSelectAll = (checked: boolean) => {
if (checked) {
setSelectedCareManagers(paginatedData.map(manager => manager.id));
} else {
setSelectedCareManagers([]);
}
};
const handleSelectManager = (id: number, checked: boolean) => {
if (checked) {
setSelectedCareManagers([...selectedCareManagers, id]);
} else {
setSelectedCareManagers(selectedCareManagers.filter(managerId => managerId !== id));
}
};
const handleBulkAction = (action: string) => {
console.log(`Bulk ${action} for managers:`, selectedCareManagers);
setSelectedCareManagers([]);
};
const handleViewDetails = (manager: any) => {
setSelectedCareManager(manager);
setIsDetailModalOpen(true);
};
const handleStatusChange = (managerId: number, newStatus: string) => {
console.log(`Changing status of manager ${managerId} to ${newStatus}`);
};
return (
<div className="min-h-screen bg-gray-50">
{isMobileMenuOpen && (
<div
className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
onClick={() => setIsMobileMenuOpen(false)}
/>
)}
<div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
} lg:translate-x-0`}>
<div className="p-6 border-b border-gray-200">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
<i className="fas fa-heart text-white text-lg"></i>
</div>
<div>
<h1 className="text-xl font-bold text-gray-900">케어플랫폼</h1>
<p className="text-sm text-gray-500">관리자 대시보드</p>
</div>
</div>
</div>
<ScrollArea className="h-[calc(100vh-100px)]">
<nav className="p-4 space-y-2">
<a
href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/7c0a070a-5939-49c0-b90b-645c57d6dcc0"
data-readdy="true"
className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button text-gray-700 hover:bg-gray-100"
>
<i className="fas fa-arrow-left text-lg"></i>
<span className="font-medium">대시보드로 돌아가기</span>
</a>
{menuItems.map((item) => (
item.id === 'services' ? (
<a
href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/f46b3b22-c11d-4bc7-8c05-edefb8646273"
data-readdy="true"
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedMenu === item.id
? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<i className={`${item.icon} text-lg`}></i>
<span className="font-medium">{item.label}</span>
</a>
) : (
<button
key={item.id}
onClick={() => {
setSelectedMenu(item.id);
setIsMobileMenuOpen(false);
}}
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedMenu === item.id
? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<i className={`${item.icon} text-lg`}></i>
<span className="font-medium">{item.label}</span>
</button>
)
))}
</nav>
</ScrollArea>
</div>
<div className="lg:ml-64">
<header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<Button
variant="ghost"
size="sm"
className="lg:hidden cursor-pointer !rounded-button whitespace-nowrap"
onClick={() => setIsMobileMenuOpen(true)}
>
<i className="fas fa-bars text-lg"></i>
</Button>
<div>
<h2 className="text-2xl font-bold text-gray-900">케어매니저 관리</h2>
<p className="text-gray-600">케어매니저들의 정보를 조회하고 관리하세요</p>
</div>
</div>
<div className="flex items-center space-x-4">
<Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
<i className="fas fa-download mr-2"></i>
목록 내보내기
</Button>
<Button size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
<i className="fas fa-sync-alt mr-2"></i>
새로고침
</Button>
</div>
</div>
</header>
<main className="p-6 space-y-6">
<Card>
<CardHeader>
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
<CardTitle className="text-lg font-semibold">케어매니저 목록</CardTitle>
<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
<div className="relative">
<i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
<Input
placeholder="이름, 연락처, 지역으로 검색..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10 w-full sm:w-64 text-sm"
/>
</div>
<div className="flex space-x-2">
<Button
variant={selectedFilter === 'all' ? 'default' : 'outline'}
size="sm"
onClick={() => setSelectedFilter('all')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
전체
</Button>
<Button
variant={selectedFilter === 'approved' ? 'default' : 'outline'}
size="sm"
onClick={() => setSelectedFilter('approved')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
승인
</Button>
<Button
variant={selectedFilter === 'pending' ? 'default' : 'outline'}
size="sm"
onClick={() => setSelectedFilter('pending')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
대기
</Button>
<Button
variant={selectedFilter === 'rejected' ? 'default' : 'outline'}
size="sm"
onClick={() => setSelectedFilter('rejected')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
거부
</Button>
</div>
</div>
</div>
</CardHeader>
<CardContent>
{selectedCareManagers.length > 0 && (
<div className="mb-4 p-4 bg-blue-50 rounded-lg">
<div className="flex items-center justify-between">
<span className="text-sm text-blue-700">
{selectedCareManagers.length}명이 선택되었습니다
</span>
<div className="flex space-x-2">
<Button
size="sm"
variant="outline"
onClick={() => handleBulkAction('approve')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-check mr-1"></i>
일괄 승인
</Button>
<Button
size="sm"
variant="outline"
onClick={() => handleBulkAction('reject')}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-times mr-1"></i>
일괄 거부
</Button>
<Button
size="sm"
variant="outline"
onClick={() => handleBulkAction('delete')}
className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 hover:text-red-700"
>
<i className="fas fa-trash mr-1"></i>
일괄 삭제
</Button>
</div>
</div>
</div>
)}
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="border-b border-gray-200">
<th className="text-left p-4">
<input
type="checkbox"
checked={selectedCareManagers.length === paginatedData.length && paginatedData.length > 0}
onChange={(e) => handleSelectAll(e.target.checked)}
className="rounded border-gray-300"
/>
</th>
<th className="text-left p-4">
<button
onClick={() => handleSort('name')}
className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
>
<span>이름</span>
<i className={`fas fa-sort ${sortField === 'name' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''} text-xs`}></i>
</button>
</th>
<th className="text-left p-4">
<button
onClick={() => handleSort('phone')}
className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
>
<span>연락처</span>
<i className={`fas fa-sort ${sortField === 'phone' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''} text-xs`}></i>
</button>
</th>
<th className="text-left p-4">
<button
onClick={() => handleSort('region')}
className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
>
<span>서비스 지역</span>
<i className={`fas fa-sort ${sortField === 'region' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''} text-xs`}></i>
</button>
</th>
<th className="text-left p-4">
<button
onClick={() => handleSort('status')}
className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
>
<span>승인 상태</span>
<i className={`fas fa-sort ${sortField === 'status' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''} text-xs`}></i>
</button>
</th>
<th className="text-left p-4">
<button
onClick={() => handleSort('rating')}
className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
>
<span>평점</span>
<i className={`fas fa-sort ${sortField === 'rating' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''} text-xs`}></i>
</button>
</th>
<th className="text-left p-4 font-medium text-gray-700">관리</th>
</tr>
</thead>
<tbody>
{paginatedData.map((manager) => (
<tr key={manager.id} className="border-b border-gray-100 hover:bg-gray-50">
<td className="p-4">
<input
type="checkbox"
checked={selectedCareManagers.includes(manager.id)}
onChange={(e) => handleSelectManager(manager.id, e.target.checked)}
className="rounded border-gray-300"
/>
</td>
<td className="p-4">
<div className="flex items-center space-x-3">
<img
src={manager.profileImage}
alt={manager.name}
className="w-10 h-10 rounded-full object-cover"
/>
<div>
<p className="font-medium text-gray-900">{manager.name}</p>
<p className="text-sm text-gray-500">{manager.email}</p>
</div>
</div>
</td>
<td className="p-4 text-gray-700">{manager.phone}</td>
<td className="p-4 text-gray-700">{manager.region}</td>
<td className="p-4">{getStatusBadge(manager.status)}</td>
<td className="p-4">
<div className="flex items-center space-x-1">
{renderStars(manager.rating)}
<span className="ml-2 text-sm text-gray-600">({manager.rating})</span>
</div>
</td>
<td className="p-4">
<div className="flex items-center space-x-2">
<Button
size="sm"
variant="outline"
onClick={() => handleViewDetails(manager)}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-eye mr-1"></i>
상세
</Button>
{manager.status === 'pending' && (
<>
<Button
size="sm"
onClick={() => handleStatusChange(manager.id, 'approved')}
className="cursor-pointer !rounded-button whitespace-nowrap bg-green-600 hover:bg-green-700"
>
<i className="fas fa-check mr-1"></i>
승인
</Button>
<Button
size="sm"
variant="outline"
onClick={() => handleStatusChange(manager.id, 'rejected')}
className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 hover:text-red-700"
>
<i className="fas fa-times mr-1"></i>
거부
</Button>
</>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
<div className="flex items-center justify-between mt-6">
<div className="text-sm text-gray-500">
총 {filteredData.length}명 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)}명 표시
</div>
<div className="flex items-center space-x-2">
<Button
variant="outline"
size="sm"
onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
disabled={currentPage === 1}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-chevron-left mr-1"></i>
이전
</Button>
<div className="flex space-x-1">
{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
<Button
key={page}
variant={currentPage === page ? 'default' : 'outline'}
size="sm"
onClick={() => setCurrentPage(page)}
className="cursor-pointer !rounded-button whitespace-nowrap w-8 h-8 p-0"
>
{page}
</Button>
))}
</div>
<Button
variant="outline"
size="sm"
onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
disabled={currentPage === totalPages}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
다음
<i className="fas fa-chevron-right ml-1"></i>
</Button>
</div>
</div>
</CardContent>
</Card>
</main>
</div>
<Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
<DialogHeader>
<DialogTitle className="text-xl font-bold">케어매니저 상세 정보</DialogTitle>
</DialogHeader>
{selectedCareManager && (
<div className="space-y-6">
<div className="flex items-start space-x-6">
<img
src={selectedCareManager.profileImage}
alt={selectedCareManager.name}
className="w-24 h-24 rounded-full object-cover"
/>
<div className="flex-1">
<h3 className="text-2xl font-bold text-gray-900">{selectedCareManager.name}</h3>
<div className="flex items-center space-x-2 mt-2">
{renderStars(selectedCareManager.rating)}
<span className="text-lg font-medium">({selectedCareManager.rating})</span>
<span className="text-gray-500">• {selectedCareManager.services}회 서비스</span>
</div>
<div className="mt-2">
{getStatusBadge(selectedCareManager.status)}
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<Card>
<CardHeader>
<CardTitle className="text-lg">기본 정보</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div>
<Label className="text-sm font-medium text-gray-600">이름</Label>
<Input value={selectedCareManager.name} className="mt-1" />
</div>
<div>
<Label className="text-sm font-medium text-gray-600">연락처</Label>
<Input value={selectedCareManager.phone} className="mt-1" />
</div>
<div>
<Label className="text-sm font-medium text-gray-600">이메일</Label>
<Input value={selectedCareManager.email} className="mt-1" />
</div>
<div>
<Label className="text-sm font-medium text-gray-600">주소</Label>
<Input value={selectedCareManager.address} className="mt-1" />
</div>
<div>
<Label className="text-sm font-medium text-gray-600">서비스 지역</Label>
<Input value={selectedCareManager.region} className="mt-1" />
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle className="text-lg">경력 및 자격</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div>
<Label className="text-sm font-medium text-gray-600">경력</Label>
<Input value={selectedCareManager.experience} className="mt-1" />
</div>
<div>
<Label className="text-sm font-medium text-gray-600">자격증</Label>
<div className="mt-1 space-y-2">
{selectedCareManager.certifications.map((cert: string, index: number) => (
<Badge key={index} variant="outline" className="mr-2">
{cert}
</Badge>
))}
</div>
</div>
<div>
<Label className="text-sm font-medium text-gray-600">전문 분야</Label>
<div className="mt-1 space-y-2">
{selectedCareManager.specialties.map((specialty: string, index: number) => (
<Badge key={index} className="mr-2 bg-blue-100 text-blue-800">
{specialty}
</Badge>
))}
</div>
</div>
<div>
<Label className="text-sm font-medium text-gray-600">가입일</Label>
<Input value={selectedCareManager.joinDate} className="mt-1" />
</div>
</CardContent>
</Card>
</div>
<Card>
<CardHeader>
<CardTitle className="text-lg">자기소개</CardTitle>
</CardHeader>
<CardContent>
<Textarea
value={selectedCareManager.bio}
rows={4}
className="w-full"
/>
</CardContent>
</Card>
<div className="flex justify-end space-x-4">
<Button
variant="outline"
onClick={() => setIsDetailModalOpen(false)}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
취소
</Button>
<Button
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-save mr-2"></i>
저장
</Button>
</div>
</div>
)}
</DialogContent>
</Dialog>
</div>
);
};
export default App