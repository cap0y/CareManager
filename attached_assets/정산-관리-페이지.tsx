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
  const [selectedMenu, setSelectedMenu] = useState('settlement');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('settlementDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

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

  const settlementData = [
    {
      id: 1,
      serviceId: 'SRV-2024-001',
      careManagerName: '김영희',
      serviceType: '병원 동행',
      serviceAmount: 45000,
      commissionRate: 15,
      commissionAmount: 6750,
      settlementStatus: 'pending',
      settlementDate: '2024-01-15',
      memberName: '김철수',
      serviceDuration: '3시간',
      location: '서울 강남구',
      description: '정기 검진 병원 동행 서비스',
      requestDate: '2024-01-14',
      completedDate: '2024-01-15'
    },
    {
      id: 2,
      serviceId: 'SRV-2024-002',
      careManagerName: '이수진',
      serviceType: '가사 도움',
      serviceAmount: 35000,
      commissionRate: 15,
      commissionAmount: 5250,
      settlementStatus: 'completed',
      settlementDate: '2024-01-16',
      memberName: '박영수',
      serviceDuration: '2시간',
      location: '경기 성남시',
      description: '청소 및 정리 정돈 서비스',
      requestDate: '2024-01-15',
      completedDate: '2024-01-16'
    },
    {
      id: 3,
      serviceId: 'SRV-2024-003',
      careManagerName: '정미영',
      serviceType: '말벗',
      serviceAmount: 25000,
      commissionRate: 15,
      commissionAmount: 3750,
      settlementStatus: 'rejected',
      settlementDate: '2024-01-17',
      memberName: '최민정',
      serviceDuration: '2시간',
      location: '서울 마포구',
      description: '대화 및 정서적 지원 서비스',
      requestDate: '2024-01-16',
      completedDate: '2024-01-17'
    },
    {
      id: 4,
      serviceId: 'SRV-2024-004',
      careManagerName: '송혜교',
      serviceType: '장보기',
      serviceAmount: 30000,
      commissionRate: 15,
      commissionAmount: 4500,
      settlementStatus: 'completed',
      settlementDate: '2024-01-18',
      memberName: '이영호',
      serviceDuration: '1.5시간',
      location: '대구 수성구',
      description: '생필품 구매 대행 서비스',
      requestDate: '2024-01-17',
      completedDate: '2024-01-18'
    },
    {
      id: 5,
      serviceId: 'SRV-2024-005',
      careManagerName: '강동원',
      serviceType: '병원 동행',
      serviceAmount: 50000,
      commissionRate: 15,
      commissionAmount: 7500,
      settlementStatus: 'pending',
      settlementDate: '2024-01-19',
      memberName: '김미경',
      serviceDuration: '4시간',
      location: '부산 해운대구',
      description: '수술 동행 서비스',
      requestDate: '2024-01-18',
      completedDate: '2024-01-19'
    },
    {
      id: 6,
      serviceId: 'SRV-2024-006',
      careManagerName: '김태희',
      serviceType: '가사 도움',
      serviceAmount: 40000,
      commissionRate: 15,
      commissionAmount: 6000,
      settlementStatus: 'completed',
      settlementDate: '2024-01-20',
      memberName: '박준호',
      serviceDuration: '3시간',
      location: '광주 서구',
      description: '요리 및 식사 준비 서비스',
      requestDate: '2024-01-19',
      completedDate: '2024-01-20'
    },
    {
      id: 7,
      serviceId: 'SRV-2024-007',
      careManagerName: '박민수',
      serviceType: '말벗',
      serviceAmount: 20000,
      commissionRate: 15,
      commissionAmount: 3000,
      settlementStatus: 'pending',
      settlementDate: '2024-01-21',
      memberName: '정수현',
      serviceDuration: '1시간',
      location: '서울 서초구',
      description: '산책 동행 및 대화 서비스',
      requestDate: '2024-01-20',
      completedDate: '2024-01-21'
    },
    {
      id: 8,
      serviceId: 'SRV-2024-008',
      careManagerName: '최정호',
      serviceType: '장보기',
      serviceAmount: 28000,
      commissionRate: 15,
      commissionAmount: 4200,
      settlementStatus: 'completed',
      settlementDate: '2024-01-22',
      memberName: '한지민',
      serviceDuration: '2시간',
      location: '인천 남동구',
      description: '마트 동행 및 장보기 서비스',
      requestDate: '2024-01-21',
      completedDate: '2024-01-22'
    },
    {
      id: 9,
      serviceId: 'SRV-2024-009',
      careManagerName: '이민호',
      serviceType: '병원 동행',
      serviceAmount: 55000,
      commissionRate: 15,
      commissionAmount: 8250,
      settlementStatus: 'pending',
      settlementDate: '2024-01-23',
      memberName: '윤서연',
      serviceDuration: '5시간',
      location: '서울 종로구',
      description: '종합 검진 병원 동행 서비스',
      requestDate: '2024-01-22',
      completedDate: '2024-01-23'
    },
    {
      id: 10,
      serviceId: 'SRV-2024-010',
      careManagerName: '박소영',
      serviceType: '가사 도움',
      serviceAmount: 32000,
      commissionRate: 15,
      commissionAmount: 4800,
      settlementStatus: 'rejected',
      settlementDate: '2024-01-24',
      memberName: '김도현',
      serviceDuration: '2.5시간',
      location: '경기 고양시',
      description: '집안 정리 및 청소 서비스',
      requestDate: '2024-01-23',
      completedDate: '2024-01-24'
    }
  ];

  const getSettlementStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: '완료', className: 'bg-green-100 text-green-800' },
      pending: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
      rejected: { label: '반려', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getServiceTypeBadge = (type: string) => {
    const typeConfig = {
      '병원 동행': { className: 'bg-blue-100 text-blue-800' },
      '가사 도움': { className: 'bg-orange-100 text-orange-800' },
      '말벗': { className: 'bg-pink-100 text-pink-800' },
      '장보기': { className: 'bg-teal-100 text-teal-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{type}</Badge>;
  };

  const filteredSettlements = settlementData.filter(settlement => {
    const matchesSearch = settlement.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.careManagerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServiceType = serviceTypeFilter === 'all' || settlement.serviceType === serviceTypeFilter;
    const matchesStatus = statusFilter === 'all' || settlement.settlementStatus === statusFilter;
    const matchesDateRange = (!dateRange.start || settlement.settlementDate >= dateRange.start) &&
                            (!dateRange.end || settlement.settlementDate <= dateRange.end);

    return matchesSearch && matchesServiceType && matchesStatus && matchesDateRange;
  });

  const sortedSettlements = [...filteredSettlements].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'settlementDate':
        aValue = new Date(a.settlementDate).getTime();
        bValue = new Date(b.settlementDate).getTime();
        break;
      case 'commissionAmount':
        aValue = a.commissionAmount;
        bValue = b.commissionAmount;
        break;
      case 'careManagerName':
        aValue = a.careManagerName;
        bValue = b.careManagerName;
        break;
      default:
        aValue = new Date(a.settlementDate).getTime();
        bValue = new Date(b.settlementDate).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedSettlements.length / itemsPerPage);
  const paginatedSettlements = sortedSettlements.slice(
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
      setSelectedItems(paginatedSettlements.map(s => s.id));
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

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for items:`, selectedItems);
    setSelectedItems([]);
  };

  const handleViewDetails = (settlement: any) => {
    setSelectedSettlement(settlement);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (settlementId: number) => {
    console.log(`Approving settlement: ${settlementId}`);
  };

  const handleReject = (settlementId: number) => {
    console.log(`Rejecting settlement: ${settlementId}`);
  };

  const handleDownloadStatement = (settlementId: number) => {
    console.log(`Downloading statement for settlement: ${settlementId}`);
  };

  const getTotalStats = () => {
    const completed = filteredSettlements.filter(s => s.settlementStatus === 'completed');
    const pending = filteredSettlements.filter(s => s.settlementStatus === 'pending');
    const rejected = filteredSettlements.filter(s => s.settlementStatus === 'rejected');
    
    const totalCommission = filteredSettlements.reduce((sum, s) => sum + s.commissionAmount, 0);
    const completedCommission = completed.reduce((sum, s) => sum + s.commissionAmount, 0);

    return {
      totalSettlements: filteredSettlements.length,
      completed: completed.length,
      pending: pending.length,
      rejected: rejected.length,
      totalCommission,
      completedCommission
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
            ))}
            <div className="pt-4 border-t border-gray-200">
              <a 
                href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/f46b3b22-c11d-4bc7-8c05-edefb8646273" 
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
                <h2 className="text-2xl font-bold text-gray-900">정산 관리</h2>
                <p className="text-gray-600">케어매니저 수수료 및 정산 내역을 관리하세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-download mr-2"></i>
                정산서 다운로드
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
                    <p className="text-sm font-medium text-gray-600">총 정산 건수</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSettlements}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calculator text-blue-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">정산 완료</p>
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
                    <p className="text-sm font-medium text-gray-600">총 정산 금액</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalCommission.toLocaleString()}원</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-won-sign text-blue-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 수수료</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.completedCommission.toLocaleString()}원</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-percentage text-purple-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <CardTitle className="text-lg font-semibold">정산 목록</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <Input
                      placeholder="케어매니저명, 서비스 ID로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-80 text-sm border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="정산 상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pending">대기</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                        <SelectItem value="rejected">반려</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="서비스 유형" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="병원 동행">병원 동행</SelectItem>
                        <SelectItem value="가사 도움">가사 도움</SelectItem>
                        <SelectItem value="말벗">말벗</SelectItem>
                        <SelectItem value="장보기">장보기</SelectItem>
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
                        onClick={() => handleBulkAction('approve')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-check mr-2"></i>
                        일괄 승인
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('reject')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-times mr-2"></i>
                        일괄 반려
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('download')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-download mr-2"></i>
                        정산서 다운로드
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
                          checked={selectedItems.length === paginatedSettlements.length && paginatedSettlements.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">서비스 ID</th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('careManagerName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">케어매니저</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'careManagerName' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">서비스 유형</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">서비스 금액</th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('commissionAmount')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">수수료</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'commissionAmount' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">정산 상태</th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('settlementDate')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">정산 일자</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'settlementDate' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSettlements.map((settlement) => (
                      <tr key={settlement.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(settlement.id)}
                            onChange={(e) => handleSelectItem(settlement.id, e.target.checked)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-blue-600">{settlement.serviceId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-user-nurse text-blue-600 text-sm"></i>
                            </div>
                            <span className="font-medium text-gray-900">{settlement.careManagerName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getServiceTypeBadge(settlement.serviceType)}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{settlement.serviceAmount.toLocaleString()}원</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{settlement.commissionAmount.toLocaleString()}원</span>
                            <span className="text-xs text-gray-500">({settlement.commissionRate}%)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getSettlementStatusBadge(settlement.settlementStatus)}</td>
                        <td className="py-3 px-4 text-gray-600">{settlement.settlementDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(settlement)}
                              className="cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-eye text-xs"></i>
                            </Button>
                            {settlement.settlementStatus === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(settlement.id)}
                                  className="cursor-pointer !rounded-button whitespace-nowrap text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <i className="fas fa-check text-xs"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(settlement.id)}
                                  className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <i className="fas fa-times text-xs"></i>
                                </Button>
                              </>
                            )}
                            {settlement.settlementStatus === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadStatement(settlement.id)}
                                className="cursor-pointer !rounded-button whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <i className="fas fa-download text-xs"></i>
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
                    총 {filteredSettlements.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredSettlements.length)}개 표시
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">정산 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">서비스 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 ID</span>
                        <span className="font-mono text-sm text-blue-600">{selectedSettlement.serviceId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 유형</span>
                        {getServiceTypeBadge(selectedSettlement.serviceType)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 일시</span>
                        <span className="text-gray-900">{selectedSettlement.completedDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 시간</span>
                        <span className="text-gray-900">{selectedSettlement.serviceDuration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 지역</span>
                        <span className="text-gray-900">{selectedSettlement.location}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm font-medium text-gray-600">서비스 설명</span>
                        <p className="text-gray-900 mt-1 text-sm">{selectedSettlement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">정산 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">서비스 금액</span>
                        <span className="text-xl font-bold text-gray-900">{selectedSettlement.serviceAmount.toLocaleString()}원</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">수수료율</span>
                        <span className="text-gray-900">{selectedSettlement.commissionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">수수료 금액</span>
                        <span className="text-xl font-bold text-blue-600">{selectedSettlement.commissionAmount.toLocaleString()}원</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">정산 상태</span>
                        {getSettlementStatusBadge(selectedSettlement.settlementStatus)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">정산 일자</span>
                        <span className="text-gray-900">{selectedSettlement.settlementDate}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">케어매니저 정산액</span>
                          <span className="text-xl font-bold text-green-600">
                            {(selectedSettlement.serviceAmount - selectedSettlement.commissionAmount).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">회원 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-green-600 text-lg"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedSettlement.memberName}</h3>
                        <p className="text-sm text-gray-600">서비스 이용 회원</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">케어매니저 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user-nurse text-blue-600 text-lg"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedSettlement.careManagerName}</h3>
                        <p className="text-sm text-gray-600">서비스 제공자</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-3">
                {selectedSettlement.settlementStatus === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedSettlement.id)}
                      className="cursor-pointer !rounded-button whitespace-nowrap bg-green-600 hover:bg-green-700"
                    >
                      <i className="fas fa-check mr-2"></i>
                      승인
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedSettlement.id)}
                      className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <i className="fas fa-times mr-2"></i>
                      반려
                    </Button>
                  </>
                )}
                {selectedSettlement.settlementStatus === 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadStatement(selectedSettlement.id)}
                    className="cursor-pointer !rounded-button whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <i className="fas fa-download mr-2"></i>
                    정산서 다운로드
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
    </div>
  );
};

export default App;
