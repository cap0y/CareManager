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
  const [selectedMenu, setSelectedMenu] = useState('services');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('serviceId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const serviceRequests = [
    {
      id: 1,
      serviceId: 'SV-2024-001',
      memberName: '김영수',
      careManagerName: '김영희',
      serviceType: '병원 동행',
      amount: 45000,
      paymentStatus: 'completed',
      paymentDate: '2024-01-15',
      serviceDate: '2024-01-16',
      duration: '3시간',
      location: '서울 강남구',
      description: '정기 검진을 위한 병원 동행 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'completed'
    },
    {
      id: 2,
      serviceId: 'SV-2024-002',
      memberName: '박민정',
      careManagerName: '박민수',
      serviceType: '가사 도움',
      amount: 35000,
      paymentStatus: 'pending',
      paymentDate: null,
      serviceDate: '2024-01-17',
      duration: '2시간',
      location: '서울 서초구',
      description: '청소 및 정리 정돈 서비스',
      paymentMethod: '계좌이체',
      refundAmount: 0,
      settlementStatus: 'pending'
    },
    {
      id: 3,
      serviceId: 'SV-2024-003',
      memberName: '이수진',
      careManagerName: '이수진',
      serviceType: '말벗',
      amount: 25000,
      paymentStatus: 'failed',
      paymentDate: '2024-01-14',
      serviceDate: '2024-01-15',
      duration: '1시간 30분',
      location: '경기 성남시',
      description: '대화 및 정서적 지원 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'failed'
    },
    {
      id: 4,
      serviceId: 'SV-2024-004',
      memberName: '최정호',
      careManagerName: '최정호',
      serviceType: '장보기',
      amount: 30000,
      paymentStatus: 'completed',
      paymentDate: '2024-01-13',
      serviceDate: '2024-01-14',
      duration: '2시간',
      location: '인천 남동구',
      description: '생필품 구매 대행 서비스',
      paymentMethod: '카드',
      refundAmount: 10000,
      settlementStatus: 'refunded'
    },
    {
      id: 5,
      serviceId: 'SV-2024-005',
      memberName: '정미영',
      careManagerName: '정미영',
      serviceType: '병원 동행',
      amount: 50000,
      paymentStatus: 'completed',
      paymentDate: '2024-01-12',
      serviceDate: '2024-01-13',
      duration: '4시간',
      location: '서울 마포구',
      description: '수술 동행 및 간병 서비스',
      paymentMethod: '계좌이체',
      refundAmount: 0,
      settlementStatus: 'completed'
    },
    {
      id: 6,
      serviceId: 'SV-2024-006',
      memberName: '강동원',
      careManagerName: '강동원',
      serviceType: '가사 도움',
      amount: 40000,
      paymentStatus: 'pending',
      paymentDate: null,
      serviceDate: '2024-01-18',
      duration: '3시간',
      location: '부산 해운대구',
      description: '요리 및 식사 준비 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'pending'
    },
    {
      id: 7,
      serviceId: 'SV-2024-007',
      memberName: '송혜교',
      careManagerName: '송혜교',
      serviceType: '말벗',
      amount: 28000,
      paymentStatus: 'completed',
      paymentDate: '2024-01-11',
      serviceDate: '2024-01-12',
      duration: '2시간',
      location: '대구 수성구',
      description: '산책 동행 및 대화 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'completed'
    },
    {
      id: 8,
      serviceId: 'SV-2024-008',
      memberName: '김태희',
      careManagerName: '김태희',
      serviceType: '장보기',
      amount: 32000,
      paymentStatus: 'failed',
      paymentDate: '2024-01-10',
      serviceDate: '2024-01-11',
      duration: '2시간 30분',
      location: '광주 서구',
      description: '마트 동행 및 장보기 서비스',
      paymentMethod: '계좌이체',
      refundAmount: 0,
      settlementStatus: 'failed'
    },
    {
      id: 9,
      serviceId: 'SV-2024-009',
      memberName: '유재석',
      careManagerName: '김영희',
      serviceType: '병원 동행',
      amount: 55000,
      paymentStatus: 'completed',
      paymentDate: '2024-01-09',
      serviceDate: '2024-01-10',
      duration: '5시간',
      location: '서울 강남구',
      description: '종합 검진 동행 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'completed'
    },
    {
      id: 10,
      serviceId: 'SV-2024-010',
      memberName: '박나래',
      careManagerName: '박민수',
      serviceType: '가사 도움',
      amount: 38000,
      paymentStatus: 'pending',
      paymentDate: null,
      serviceDate: '2024-01-19',
      duration: '3시간',
      location: '서울 서초구',
      description: '빨래 및 정리 정돈 서비스',
      paymentMethod: '카드',
      refundAmount: 0,
      settlementStatus: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: '완료', className: 'bg-green-100 text-green-800' },
      pending: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: '실패', className: 'bg-red-100 text-red-800' },
      refunded: { label: '환불', className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getServiceTypeIcon = (serviceType: string) => {
    const iconMap = {
      '병원 동행': 'fas fa-hospital',
      '가사 도움': 'fas fa-home',
      '말벗': 'fas fa-comments',
      '장보기': 'fas fa-shopping-cart'
    };
    return iconMap[serviceType as keyof typeof iconMap] || 'fas fa-concierge-bell';
  };

  const filteredServices = serviceRequests.filter(service => {
    const matchesSearch = service.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.careManagerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.paymentStatus === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || service.serviceType === serviceTypeFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const today = new Date();
      const serviceDate = new Date(service.serviceDate);
      const diffTime = Math.abs(today.getTime() - serviceDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case '7days':
          matchesDate = diffDays <= 7;
          break;
        case '30days':
          matchesDate = diffDays <= 30;
          break;
        case '90days':
          matchesDate = diffDays <= 90;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesServiceType && matchesDate;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'serviceId':
        aValue = a.serviceId;
        bValue = b.serviceId;
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'paymentDate':
        aValue = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
        bValue = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
        break;
      case 'serviceDate':
        aValue = new Date(a.serviceDate).getTime();
        bValue = new Date(b.serviceDate).getTime();
        break;
      default:
        aValue = a.serviceId;
        bValue = b.serviceId;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice(
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
      setSelectedItems(paginatedServices.map(s => s.id));
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

  const handleStatusChange = (serviceId: number, newStatus: string) => {
    console.log(`Status change for service ${serviceId}: ${newStatus}`);
  };

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleRefund = (serviceId: number, amount: number) => {
    console.log(`Refund request for service ${serviceId}: ${amount}원`);
  };

  const getTotalStats = () => {
    const totalAmount = filteredServices.reduce((sum, service) => sum + service.amount, 0);
    const completedAmount = filteredServices
      .filter(service => service.paymentStatus === 'completed')
      .reduce((sum, service) => sum + service.amount, 0);
    const refundAmount = filteredServices.reduce((sum, service) => sum + service.refundAmount, 0);
    
    return { totalAmount, completedAmount, refundAmount };
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
                href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/15e7a580-5e32-484d-a718-b17f91fa9029" 
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
                <h2 className="text-2xl font-bold text-gray-900">서비스/결제 관리</h2>
                <p className="text-gray-600">서비스 요청 및 결제 내역을 조회하고 관리하세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-download mr-2"></i>
                데이터 다운로드
              </Button>
              <Button size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-sync-alt mr-2"></i>
                새로고침
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 거래액</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAmount.toLocaleString()}원</p>
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
                    <p className="text-sm font-medium text-gray-600">완료 거래액</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedAmount.toLocaleString()}원</p>
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
                    <p className="text-sm font-medium text-gray-600">환불 금액</p>
                    <p className="text-2xl font-bold text-red-600">{stats.refundAmount.toLocaleString()}원</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-undo text-red-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 서비스</p>
                    <p className="text-2xl font-bold text-purple-600">{filteredServices.length}건</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-concierge-bell text-purple-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <CardTitle className="text-lg font-semibold">서비스/결제 목록</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <Input
                      placeholder="서비스 ID, 회원명, 케어매니저명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-80 text-sm border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="결제상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                        <SelectItem value="pending">대기</SelectItem>
                        <SelectItem value="failed">실패</SelectItem>
                        <SelectItem value="refunded">환불</SelectItem>
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
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="기간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="7days">7일</SelectItem>
                        <SelectItem value="30days">30일</SelectItem>
                        <SelectItem value="90days">90일</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        onClick={() => handleBulkAction('refund')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-undo mr-2"></i>
                        일괄 환불
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('settlement')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-calculator mr-2"></i>
                        일괄 정산
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
                          checked={selectedItems.length === paginatedServices.length && paginatedServices.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="cursor-pointer"
                        />
                      </th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('serviceId')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">서비스 ID</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'serviceId' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">회원명</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">케어매니저</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">서비스 유형</th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">결제 금액</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'amount' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">결제 상태</th>
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('serviceDate')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">서비스일</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'serviceDate' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedServices.map((service) => (
                      <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(service.id)}
                            onChange={(e) => handleSelectItem(service.id, e.target.checked)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-blue-600">{service.serviceId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-user text-gray-600 text-xs"></i>
                            </div>
                            <span className="font-medium text-gray-900">{service.memberName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{service.careManagerName}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <i className={`${getServiceTypeIcon(service.serviceType)} text-gray-500 text-sm`}></i>
                            <span className="text-gray-700">{service.serviceType}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">{service.amount.toLocaleString()}원</span>
                          {service.refundAmount > 0 && (
                            <div className="text-xs text-red-600">환불: {service.refundAmount.toLocaleString()}원</div>
                          )}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(service.paymentStatus)}</td>
                        <td className="py-3 px-4 text-gray-600">{service.serviceDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(service)}
                              className="cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-eye text-xs"></i>
                            </Button>
                            {service.paymentStatus === 'completed' && service.refundAmount === 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRefund(service.id, service.amount)}
                                className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <i className="fas fa-undo text-xs"></i>
                              </Button>
                            )}
                            {service.paymentStatus === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(service.id, 'completed')}
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
                    총 {sortedServices.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedServices.length)}개 표시
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
            <DialogTitle className="text-xl font-bold">서비스/결제 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">서비스 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className={`${getServiceTypeIcon(selectedService.serviceType)} text-blue-600 text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedService.serviceType}</h3>
                        <span className="font-mono text-sm text-blue-600">{selectedService.serviceId}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-user text-gray-400 w-4"></i>
                        <span className="text-gray-600">회원: {selectedService.memberName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-user-nurse text-gray-400 w-4"></i>
                        <span className="text-gray-600">케어매니저: {selectedService.careManagerName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-map-marker-alt text-gray-400 w-4"></i>
                        <span className="text-gray-600">서비스 지역: {selectedService.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-clock text-gray-400 w-4"></i>
                        <span className="text-gray-600">서비스 시간: {selectedService.duration}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-calendar text-gray-400 w-4"></i>
                        <span className="text-gray-600">서비스일: {selectedService.serviceDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">결제 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 상태</span>
                      {getStatusBadge(selectedService.paymentStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 금액</span>
                      <span className="font-bold text-lg text-gray-900">{selectedService.amount.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 방법</span>
                      <span className="text-gray-900">{selectedService.paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제일</span>
                      <span className="text-gray-900">{selectedService.paymentDate || '미결제'}</span>
                    </div>
                    {selectedService.refundAmount > 0 && (
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-red-600">환불 금액</span>
                        <span className="font-bold text-red-600">{selectedService.refundAmount.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-gray-600">정산 상태</span>
                      {getStatusBadge(selectedService.settlementStatus)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">서비스 상세 내용</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedService.description}
                    readOnly
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-3">
                {selectedService.paymentStatus === 'completed' && selectedService.refundAmount === 0 && (
                  <Button
                    variant="outline"
                    onClick={() => handleRefund(selectedService.id, selectedService.amount)}
                    className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    환불 처리
                  </Button>
                )}
                {selectedService.paymentStatus === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedService.id, 'completed')}
                    className="cursor-pointer !rounded-button whitespace-nowrap text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <i className="fas fa-check mr-2"></i>
                    결제 승인
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <i className="fas fa-print mr-2"></i>
                  영수증 출력
                </Button>
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
