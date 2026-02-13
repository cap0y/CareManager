// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const App: React.FC = () => {
const [selectedMenu, setSelectedMenu] = useState('disputes');
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [disputeTypeFilter, setDisputeTypeFilter] = useState('all');
const [selectedItems, setSelectedItems] = useState<number[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [sortField, setSortField] = useState('reportDate');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
const [selectedDispute, setSelectedDispute] = useState<any>(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [dateRange, setDateRange] = useState({ start: '', end: '' });
const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
const [processNote, setProcessNote] = useState('');
const itemsPerPage = 10;
const menuItems = [
{ id: 'dashboard', label: '대시보드', icon: 'fas fa-tachometer-alt' },
{ id: 'members', label: '회원 관리', icon: 'fas fa-users' },
{ id: 'caremanagers', label: '케어매니저 관리', icon: 'fas fa-user-nurse' },
{ id: 'services', label: '서비스/결제 관리', icon: 'fas fa-credit-card' },
{ id: 'settlement', label: '정산 관리', icon: 'fas fa-calculator' },
{ id: 'disputes', label: '분쟁 조정', icon: 'fas fa-balance-scale' },
{ id: 'content', label: '콘텐츠 관리', icon: 'fas fa-edit' }
];
const disputeData = [
{
id: 1,
disputeId: 'DSP-2024-001',
reporterType: '회원',
reporterName: '김철수',
targetName: '김영희',
disputeType: '서비스 품질',
title: '약속 시간 미준수 및 서비스 불만',
reportDate: '2024-01-15',
status: 'received',
deadline: '2024-01-22',
serviceId: 'SRV-2024-001',
serviceType: '병원 동행',
serviceDate: '2024-01-14',
reportContent: '약속된 시간보다 30분 늦게 도착했고, 병원에서 대기하는 동안 계속 개인 전화를 받아서 불쾌했습니다.',
targetResponse: '교통체증으로 인한 지연이었고, 응급상황으로 전화를 받을 수밖에 없었습니다.',
evidence: ['통화 기록', '위치 정보'],
processHistory: []
},
{
id: 2,
disputeId: 'DSP-2024-002',
reporterType: '케어매니저',
reporterName: '이수진',
targetName: '박영수',
disputeType: '비용',
title: '추가 서비스 비용 미지급',
reportDate: '2024-01-16',
status: 'processing',
deadline: '2024-01-23',
serviceId: 'SRV-2024-002',
serviceType: '가사 도움',
serviceDate: '2024-01-15',
reportContent: '계약된 청소 범위를 초과하여 베란다 청소까지 요청받았으나 추가 비용을 지급받지 못했습니다.',
targetResponse: '베란다 청소는 기본 서비스에 포함된다고 생각했습니다.',
evidence: ['서비스 계약서', '추가 작업 사진'],
processHistory: [
{ date: '2024-01-17', action: '중재 시작', note: '양측 의견 수렴 중' }
]
},
{
id: 3,
disputeId: 'DSP-2024-003',
reporterType: '회원',
reporterName: '최민정',
targetName: '정미영',
disputeType: '태도',
title: '불친절한 서비스 태도',
reportDate: '2024-01-17',
status: 'completed',
deadline: '2024-01-24',
serviceId: 'SRV-2024-003',
serviceType: '말벗',
serviceDate: '2024-01-16',
reportContent: '대화 중 무례한 언행과 불친절한 태도로 기분이 상했습니다.',
targetResponse: '그런 의도가 아니었으나 오해를 드린 점 사과드립니다.',
evidence: ['녹음 파일'],
processHistory: [
{ date: '2024-01-18', action: '중재 시작', note: '양측 의견 수렴' },
{ date: '2024-01-20', action: '합의 도출', note: '케어매니저 사과 및 서비스 개선 약속' },
{ date: '2024-01-21', action: '분쟁 해결', note: '양측 합의 완료' }
]
},
{
id: 4,
disputeId: 'DSP-2024-004',
reporterType: '케어매니저',
reporterName: '송혜교',
targetName: '이영호',
disputeType: '기타',
title: '서비스 중 안전사고 책임 문제',
reportDate: '2024-01-18',
status: 'processing',
deadline: '2024-01-25',
serviceId: 'SRV-2024-004',
serviceType: '장보기',
serviceDate: '2024-01-17',
reportContent: '장보기 서비스 중 회원이 넘어져 다쳤는데 케어매니저 책임이라고 주장하고 있습니다.',
targetResponse: '케어매니저가 주의를 기울이지 않아 발생한 사고입니다.',
evidence: ['사고 현장 사진', '의료진단서'],
processHistory: [
{ date: '2024-01-19', action: '중재 시작', note: '사고 경위 조사 중' }
]
},
{
id: 5,
disputeId: 'DSP-2024-005',
reporterType: '회원',
reporterName: '김미경',
targetName: '강동원',
disputeType: '서비스 품질',
title: '서비스 시간 단축 및 품질 저하',
reportDate: '2024-01-19',
status: 'cancelled',
deadline: '2024-01-26',
serviceId: 'SRV-2024-005',
serviceType: '병원 동행',
serviceDate: '2024-01-18',
reportContent: '4시간 서비스로 계약했으나 3시간만 제공받았고 서비스 품질도 기대에 못 미쳤습니다.',
targetResponse: '응급상황으로 인해 서비스 시간이 단축되었으나 사전에 양해를 구했습니다.',
evidence: ['서비스 기록'],
processHistory: [
{ date: '2024-01-20', action: '분쟁 취소', note: '신고자 요청으로 분쟁 철회' }
]
},
{
id: 6,
disputeId: 'DSP-2024-006',
reporterType: '케어매니저',
reporterName: '김태희',
targetName: '박준호',
disputeType: '비용',
title: '서비스 취소 수수료 분쟁',
reportDate: '2024-01-20',
status: 'received',
deadline: '2024-01-27',
serviceId: 'SRV-2024-006',
serviceType: '가사 도움',
serviceDate: '2024-01-19',
reportContent: '서비스 당일 갑작스런 취소로 인한 손실에 대한 보상을 요구합니다.',
targetResponse: '급한 일이 생겨 취소했을 뿐 수수료를 지급할 의무는 없다고 생각합니다.',
evidence: ['취소 알림 기록'],
processHistory: []
}
];
const getDisputeStatusBadge = (status: string) => {
const statusConfig = {
received: { label: '접수', className: 'bg-gray-100 text-gray-800' },
processing: { label: '처리중', className: 'bg-yellow-100 text-yellow-800' },
completed: { label: '완료', className: 'bg-green-100 text-green-800' },
cancelled: { label: '취소', className: 'bg-red-100 text-red-800' }
};
const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.received;
return <Badge className={config.className}>{config.label}</Badge>;
};
const getDisputeTypeBadge = (type: string) => {
const typeConfig = {
'서비스 품질': { className: 'bg-blue-100 text-blue-800' },
'비용': { className: 'bg-orange-100 text-orange-800' },
'태도': { className: 'bg-pink-100 text-pink-800' },
'기타': { className: 'bg-purple-100 text-purple-800' }
};
const config = typeConfig[type as keyof typeof typeConfig] || { className: 'bg-gray-100 text-gray-800' };
return <Badge className={config.className}>{type}</Badge>;
};
const getReporterTypeBadge = (type: string) => {
const typeConfig = {
'회원': { className: 'bg-green-100 text-green-800' },
'케어매니저': { className: 'bg-blue-100 text-blue-800' }
};
const config = typeConfig[type as keyof typeof typeConfig] || { className: 'bg-gray-100 text-gray-800' };
return <Badge className={config.className}>{type}</Badge>;
};
const filteredDisputes = disputeData.filter(dispute => {
const matchesSearch = dispute.disputeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
dispute.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
dispute.targetName.toLowerCase().includes(searchTerm.toLowerCase());
const matchesDisputeType = disputeTypeFilter === 'all' || dispute.disputeType === disputeTypeFilter;
const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
const matchesDateRange = (!dateRange.start || dispute.reportDate >= dateRange.start) &&
(!dateRange.end || dispute.reportDate <= dateRange.end);
return matchesSearch && matchesDisputeType && matchesStatus && matchesDateRange;
});
const sortedDisputes = [...filteredDisputes].sort((a, b) => {
let aValue, bValue;
switch (sortField) {
case 'reportDate':
aValue = new Date(a.reportDate).getTime();
bValue = new Date(b.reportDate).getTime();
break;
case 'deadline':
aValue = new Date(a.deadline).getTime();
bValue = new Date(b.deadline).getTime();
break;
case 'reporterName':
aValue = a.reporterName;
bValue = b.reporterName;
break;
default:
aValue = new Date(a.reportDate).getTime();
bValue = new Date(b.reportDate).getTime();
}
if (sortDirection === 'asc') {
return aValue > bValue ? 1 : -1;
} else {
return aValue < bValue ? 1 : -1;
}
});
const totalPages = Math.ceil(sortedDisputes.length / itemsPerPage);
const paginatedDisputes = sortedDisputes.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);
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
setSelectedItems(paginatedDisputes.map(d => d.id));
} else {
setSelectedItems([]);
}
};
const handleSelectItem = (id: number, checked: boolean) => {
if (checked) {
setSelectedItems([...selectedItems, id]);
} else {
setSelectedItems(selectedItems.filter(item => item !== id));
}
};
const handleViewDetails = (dispute: any) => {
setSelectedDispute(dispute);
setIsDetailModalOpen(true);
};
const handleStartProcess = (dispute: any) => {
setSelectedDispute(dispute);
setIsProcessModalOpen(true);
};
const handleProcessDispute = () => {
console.log(`Processing dispute: ${selectedDispute?.id} with note: ${processNote}`);
setIsProcessModalOpen(false);
setProcessNote('');
};
const handleResolveDispute = (disputeId: number) => {
console.log(`Resolving dispute: ${disputeId}`);
};
const getTotalStats = () => {
const received = filteredDisputes.filter(d => d.status === 'received');
const processing = filteredDisputes.filter(d => d.status === 'processing');
const completed = filteredDisputes.filter(d => d.status === 'completed');
const avgProcessTime = completed.length > 0 ?
completed.reduce((sum, d) => {
const reportDate = new Date(d.reportDate);
const completedDate = d.processHistory.length > 0 ?
new Date(d.processHistory[d.processHistory.length - 1].date) : reportDate;
return sum + Math.ceil((completedDate.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
}, 0) / completed.length : 0;
return {
totalDisputes: filteredDisputes.length,
completed: completed.length,
processing: processing.length,
avgProcessTime: Math.round(avgProcessTime)
};
};
const stats = getTotalStats();
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
{menuItems.map((item) => (
<button
key={item.id}
onClick={() => {
if (item.id === 'content') {
  window.location.href = 'https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/b2ec8f52-d205-4ddf-9048-f70016f9032e';
} else {
  setSelectedMenu(item.id);
  setIsMobileMenuOpen(false);
}
}}
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedMenu === item.id
? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<i className={`${item.icon} text-lg`}></i>
{item.id === 'content' ? (
  <a href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/b2ec8f52-d205-4ddf-9048-f70016f9032e" data-readdy="true" className="font-medium">{item.label}</a>
) : (
  <span className="font-medium">{item.label}</span>
)}
</button>
))}
<div className="pt-4 border-t border-gray-200">
<a
href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/7d60ee16-3010-4b58-b2d0-f3a73d8c5cb1"
data-readdy="true"
className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button text-gray-700 hover:bg-gray-100"
>
<i className="fas fa-arrow-left text-lg"></i>
<span className="font-medium">원본 페이지로 돌아가기</span>
</a>
</div>
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
<h2 className="text-2xl font-bold text-gray-900">분쟁 조정</h2>
<p className="text-gray-600">케어매니저와 회원 간의 서비스 분쟁을 관리하고 조정하세요</p>
</div>
</div>
<div className="flex items-center space-x-4">
<Button
variant="outline"
size="sm"
className="cursor-pointer !rounded-button whitespace-nowrap"
onClick={() => {
setSearchTerm('');
setStatusFilter('all');
setDisputeTypeFilter('all');
setDateRange({ start: '', end: '' });
}}
>
<i className="fas fa-filter mr-2"></i>
필터 초기화
</Button>
<Button size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
<i className="fas fa-sync-alt mr-2"></i>
새로고침
</Button>
</div>
</div>
</header>
<main className="p-6 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<Card>
<CardContent className="p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-gray-600">전체 분쟁 건수</p>
<p className="text-2xl font-bold text-gray-900">{stats.totalDisputes}</p>
</div>
<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
<i className="fas fa-balance-scale text-red-600 text-xl"></i>
</div>
</div>
</CardContent>
</Card>
<Card>
<CardContent className="p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-gray-600">처리 완료</p>
<p className="text-2xl font-bold text-green-600">{stats.completed}</p>
</div>
<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
<i className="fas fa-check-circle text-green-600 text-xl"></i>
</div>
</div>
</CardContent>
</Card>
<Card>
<CardContent className="p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-gray-600">처리 중</p>
<p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
</div>
<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
<i className="fas fa-clock text-yellow-600 text-xl"></i>
</div>
</div>
</CardContent>
</Card>
<Card>
<CardContent className="p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-gray-600">평균 처리 기간</p>
<p className="text-2xl font-bold text-blue-600">{stats.avgProcessTime}일</p>
</div>
<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
<i className="fas fa-calendar-alt text-blue-600 text-xl"></i>
</div>
</div>
</CardContent>
</Card>
</div>
<Card>
<CardHeader>
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
<CardTitle className="text-lg font-semibold">분쟁 목록</CardTitle>
<div className="flex flex-col sm:flex-row gap-4">
<div className="relative">
<i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
<Input
placeholder="분쟁 ID, 신고자명, 대상자명으로 검색..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10 w-full sm:w-80 text-sm border border-gray-300"
/>
</div>
<div className="flex gap-2">
<Select value={statusFilter} onValueChange={setStatusFilter}>
<SelectTrigger className="w-32">
<SelectValue placeholder="상태" />
</SelectTrigger>
<SelectContent>
<SelectItem value="all">전체</SelectItem>
<SelectItem value="received">접수</SelectItem>
<SelectItem value="processing">처리중</SelectItem>
<SelectItem value="completed">완료</SelectItem>
<SelectItem value="cancelled">취소</SelectItem>
</SelectContent>
</Select>
<Select value={disputeTypeFilter} onValueChange={setDisputeTypeFilter}>
<SelectTrigger className="w-32">
<SelectValue placeholder="분쟁 유형" />
</SelectTrigger>
<SelectContent>
<SelectItem value="all">전체</SelectItem>
<SelectItem value="서비스 품질">서비스 품질</SelectItem>
<SelectItem value="비용">비용</SelectItem>
<SelectItem value="태도">태도</SelectItem>
<SelectItem value="기타">기타</SelectItem>
</SelectContent>
</Select>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row gap-4 mt-4">
<div className="flex items-center space-x-2">
<label className="text-sm font-medium text-gray-700">기간:</label>
<Input
type="date"
value={dateRange.start}
onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
className="w-40 text-sm border border-gray-300"
/>
<span className="text-gray-500">~</span>
<Input
type="date"
value={dateRange.end}
onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
className="w-40 text-sm border border-gray-300"
/>
</div>
</div>
</CardHeader>
<CardContent>
{selectedItems.length > 0 && (
<div className="mb-4 p-4 bg-blue-50 rounded-lg">
<div className="flex items-center justify-between">
<span className="text-sm text-blue-800">
{selectedItems.length}개 항목이 선택되었습니다
</span>
<div className="flex gap-2">
<Button
size="sm"
variant="outline"
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-play mr-2"></i>
일괄 처리
</Button>
<Button
size="sm"
variant="outline"
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-download mr-2"></i>
보고서 다운로드
</Button>
</div>
</div>
</div>
)}
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="border-b border-gray-200">
<th className="text-left py-3 px-4">
<input
type="checkbox"
checked={selectedItems.length === paginatedDisputes.length && paginatedDisputes.length > 0}
onChange={(e) => handleSelectAll(e.target.checked)}
className="cursor-pointer"
/>
</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">분쟁 ID</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">신고자</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">대상자</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">분쟁 유형</th>
<th
className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
onClick={() => handleSort('reportDate')}
>
<div className="flex items-center space-x-1">
<span className="font-medium text-gray-700">접수일</span>
<i className={`fas fa-sort text-gray-400 text-xs ${
sortField === 'reportDate' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
}`}></i>
</div>
</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
<th
className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
onClick={() => handleSort('deadline')}
>
<div className="flex items-center space-x-1">
<span className="font-medium text-gray-700">처리기한</span>
<i className={`fas fa-sort text-gray-400 text-xs ${
sortField === 'deadline' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
}`}></i>
</div>
</th>
<th className="text-left py-3 px-4 font-medium text-gray-700">관리</th>
</tr>
</thead>
<tbody>
{paginatedDisputes.map((dispute) => (
<tr key={dispute.id} className="border-b border-gray-100 hover:bg-gray-50">
<td className="py-3 px-4">
<input
type="checkbox"
checked={selectedItems.includes(dispute.id)}
onChange={(e) => handleSelectItem(dispute.id, e.target.checked)}
className="cursor-pointer"
/>
</td>
<td className="py-3 px-4">
<span className="font-mono text-sm text-blue-600">{dispute.disputeId}</span>
</td>
<td className="py-3 px-4">
<div className="flex flex-col space-y-1">
<span className="font-medium text-gray-900">{dispute.reporterName}</span>
{getReporterTypeBadge(dispute.reporterType)}
</div>
</td>
<td className="py-3 px-4">
<span className="font-medium text-gray-900">{dispute.targetName}</span>
</td>
<td className="py-3 px-4">{getDisputeTypeBadge(dispute.disputeType)}</td>
<td className="py-3 px-4 text-gray-600">{dispute.reportDate}</td>
<td className="py-3 px-4">{getDisputeStatusBadge(dispute.status)}</td>
<td className="py-3 px-4">
<span className={`text-sm ${
new Date(dispute.deadline) < new Date() && dispute.status !== 'completed'
? 'text-red-600 font-medium'
: 'text-gray-600'
}`}>
{dispute.deadline}
</span>
</td>
<td className="py-3 px-4">
<div className="flex items-center space-x-2">
<Button
size="sm"
variant="outline"
onClick={() => handleViewDetails(dispute)}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-eye text-xs"></i>
</Button>
{dispute.status === 'received' && (
<Button
size="sm"
variant="outline"
onClick={() => handleStartProcess(dispute)}
className="cursor-pointer !rounded-button whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50"
>
<i className="fas fa-play text-xs"></i>
</Button>
)}
{dispute.status === 'processing' && (
<Button
size="sm"
variant="outline"
onClick={() => handleResolveDispute(dispute.id)}
className="cursor-pointer !rounded-button whitespace-nowrap text-green-600 border-green-200 hover:bg-green-50"
>
<i className="fas fa-check text-xs"></i>
</Button>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
{totalPages > 1 && (
<div className="flex items-center justify-between mt-6">
<div className="text-sm text-gray-600">
총 {filteredDisputes.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredDisputes.length)}개 표시
</div>
<div className="flex items-center space-x-2">
<Button
variant="outline"
size="sm"
onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
disabled={currentPage === 1}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-chevron-left"></i>
</Button>
{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
<Button
key={page}
variant={currentPage === page ? "default" : "outline"}
size="sm"
onClick={() => setCurrentPage(page)}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
{page}
</Button>
))}
<Button
variant="outline"
size="sm"
onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
disabled={currentPage === totalPages}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
<i className="fas fa-chevron-right"></i>
</Button>
</div>
</div>
)}
</CardContent>
</Card>
</main>
</div>
<Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
<DialogHeader>
<DialogTitle className="text-xl font-bold">분쟁 상세 정보</DialogTitle>
</DialogHeader>
{selectedDispute && (
<div className="space-y-6">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card>
<CardHeader>
<CardTitle className="text-lg">분쟁 기본 정보</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">분쟁 ID</span>
<span className="font-mono text-sm text-blue-600">{selectedDispute.disputeId}</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">분쟁 유형</span>
{getDisputeTypeBadge(selectedDispute.disputeType)}
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">접수일</span>
<span className="text-gray-900">{selectedDispute.reportDate}</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">처리기한</span>
<span className={`${
new Date(selectedDispute.deadline) < new Date() && selectedDispute.status !== 'completed'
? 'text-red-600 font-medium'
: 'text-gray-900'
}`}>
{selectedDispute.deadline}
</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">상태</span>
{getDisputeStatusBadge(selectedDispute.status)}
</div>
<div className="pt-2">
<span className="text-sm font-medium text-gray-600">분쟁 제목</span>
<p className="text-gray-900 mt-1 text-sm font-medium">{selectedDispute.title}</p>
</div>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle className="text-lg">관련 서비스 정보</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">서비스 ID</span>
<span className="font-mono text-sm text-blue-600">{selectedDispute.serviceId}</span>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">서비스 유형</span>
<Badge className="bg-teal-100 text-teal-800">{selectedDispute.serviceType}</Badge>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-600">서비스 일자</span>
<span className="text-gray-900">{selectedDispute.serviceDate}</span>
</div>
</div>
</CardContent>
</Card>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card>
<CardHeader>
<CardTitle className="text-lg">신고자 정보</CardTitle>
</CardHeader>
<CardContent>
<div className="flex items-center space-x-4">
<div className={`w-12 h-12 rounded-full flex items-center justify-center ${
selectedDispute.reporterType === '회원' ? 'bg-green-100' : 'bg-blue-100'
}`}>
<i className={`${
selectedDispute.reporterType === '회원' ? 'fas fa-user text-green-600' : 'fas fa-user-nurse text-blue-600'
} text-lg`}></i>
</div>
<div>
<h3 className="font-bold text-gray-900">{selectedDispute.reporterName}</h3>
<p className="text-sm text-gray-600">{selectedDispute.reporterType}</p>
</div>
</div>
<div className="mt-4">
<h4 className="text-sm font-medium text-gray-600 mb-2">신고 내용</h4>
<p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{selectedDispute.reportContent}</p>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle className="text-lg">대상자 정보</CardTitle>
</CardHeader>
<CardContent>
<div className="flex items-center space-x-4">
<div className={`w-12 h-12 rounded-full flex items-center justify-center ${
selectedDispute.reporterType === '회원' ? 'bg-blue-100' : 'bg-green-100'
}`}>
<i className={`${
selectedDispute.reporterType === '회원' ? 'fas fa-user-nurse text-blue-600' : 'fas fa-user text-green-600'
} text-lg`}></i>
</div>
<div>
<h3 className="font-bold text-gray-900">{selectedDispute.targetName}</h3>
<p className="text-sm text-gray-600">{selectedDispute.reporterType === '회원' ? '케어매니저' : '회원'}</p>
</div>
</div>
<div className="mt-4">
<h4 className="text-sm font-medium text-gray-600 mb-2">대상자 답변</h4>
<p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{selectedDispute.targetResponse}</p>
</div>
</CardContent>
</Card>
</div>
<Card>
<CardHeader>
<CardTitle className="text-lg">증빙 자료</CardTitle>
</CardHeader>
<CardContent>
<div className="flex flex-wrap gap-2">
{selectedDispute.evidence.map((item: string, index: number) => (
<Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-50">
<i className="fas fa-paperclip mr-2"></i>
{item}
</Badge>
))}
</div>
</CardContent>
</Card>
{selectedDispute.processHistory.length > 0 && (
<Card>
<CardHeader>
<CardTitle className="text-lg">처리 이력</CardTitle>
</CardHeader>
<CardContent>
<div className="space-y-4">
{selectedDispute.processHistory.map((history: any, index: number) => (
<div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
<i className="fas fa-clock text-blue-600 text-sm"></i>
</div>
<div className="flex-1">
<div className="flex items-center justify-between">
<h4 className="font-medium text-gray-900">{history.action}</h4>
<span className="text-sm text-gray-500">{history.date}</span>
</div>
<p className="text-sm text-gray-600 mt-1">{history.note}</p>
</div>
</div>
))}
</div>
</CardContent>
</Card>
)}
<div className="flex justify-end space-x-3">
{selectedDispute.status === 'received' && (
<Button
onClick={() => {
setIsDetailModalOpen(false);
handleStartProcess(selectedDispute);
}}
className="cursor-pointer !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
>
<i className="fas fa-play mr-2"></i>
처리 시작
</Button>
)}
{selectedDispute.status === 'processing' && (
<Button
onClick={() => handleResolveDispute(selectedDispute.id)}
className="cursor-pointer !rounded-button whitespace-nowrap bg-green-600 hover:bg-green-700"
>
<i className="fas fa-check mr-2"></i>
분쟁 해결
</Button>
)}
<Button
variant="outline"
onClick={() => setIsDetailModalOpen(false)}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
닫기
</Button>
</div>
</div>
)}
</DialogContent>
</Dialog>
<Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
<DialogContent className="max-w-2xl">
<DialogHeader>
<DialogTitle className="text-xl font-bold">분쟁 처리 시작</DialogTitle>
</DialogHeader>
{selectedDispute && (
<div className="space-y-6">
<div className="bg-blue-50 p-4 rounded-lg">
<h3 className="font-medium text-blue-900 mb-2">분쟁 정보</h3>
<p className="text-sm text-blue-800">
<strong>분쟁 ID:</strong> {selectedDispute.disputeId}
</p>
<p className="text-sm text-blue-800">
<strong>제목:</strong> {selectedDispute.title}
</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
처리 시작 메모
</label>
<Textarea
placeholder="중재 시작에 대한 메모를 입력하세요..."
value={processNote}
onChange={(e) => setProcessNote(e.target.value)}
rows={4}
className="w-full border border-gray-300"
/>
</div>
<div className="flex justify-end space-x-3">
<Button
variant="outline"
onClick={() => {
setIsProcessModalOpen(false);
setProcessNote('');
}}
className="cursor-pointer !rounded-button whitespace-nowrap"
>
취소
</Button>
<Button
onClick={handleProcessDispute}
className="cursor-pointer !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
>
<i className="fas fa-play mr-2"></i>
처리 시작
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