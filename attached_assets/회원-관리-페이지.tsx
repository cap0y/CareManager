// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('members');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('basic');

  const menuItems = [
    { id: 'dashboard', name: '대시보드', icon: 'fas fa-tachometer-alt' },
    { id: 'members', name: '회원 관리', icon: 'fas fa-users' },
    { id: 'caregivers', name: '케어매니저 관리', icon: 'fas fa-user-nurse' },
    { id: 'services', name: '서비스/결제 관리', icon: 'fas fa-credit-card' },
    { id: 'settlement', name: '정산 관리', icon: 'fas fa-calculator' },
    { id: 'disputes', name: '분쟁 조정', icon: 'fas fa-gavel' },
    { id: 'content', name: '콘텐츠 관리', icon: 'fas fa-edit' }
  ];

  const membersData = [
    {
      id: 1,
      name: '김영희',
      phone: '010-1234-5678',
      email: 'younghee@email.com',
      joinDate: '2024-01-15',
      status: 'active',
      serviceCount: 24,
      lastService: '2024-07-10',
      address: '서울시 강남구 테헤란로 123',
      birthDate: '1965-03-20',
      emergencyContact: '010-9876-5432',
      notes: '정기적으로 병원 동행 서비스 이용',
      totalPayment: 1200000,
      services: [
        { date: '2024-07-10', type: '병원 동행', amount: 50000, status: '완료' },
        { date: '2024-07-05', type: '장보기', amount: 30000, status: '완료' },
        { date: '2024-06-28', type: '가사 도움', amount: 80000, status: '완료' }
      ]
    },
    {
      id: 2,
      name: '박철수',
      phone: '010-2345-6789',
      email: 'chulsoo@email.com',
      joinDate: '2024-02-20',
      status: 'active',
      serviceCount: 18,
      lastService: '2024-07-12',
      address: '서울시 서초구 서초대로 456',
      birthDate: '1958-11-15',
      emergencyContact: '010-8765-4321',
      notes: '주로 주말에 서비스 이용',
      totalPayment: 900000,
      services: [
        { date: '2024-07-12', type: '말벗', amount: 40000, status: '완료' },
        { date: '2024-07-08', type: '병원 동행', amount: 50000, status: '완료' }
      ]
    },
    {
      id: 3,
      name: '이미영',
      phone: '010-3456-7890',
      email: 'miyoung@email.com',
      joinDate: '2024-03-10',
      status: 'inactive',
      serviceCount: 12,
      lastService: '2024-06-15',
      address: '서울시 마포구 홍대입구로 789',
      birthDate: '1970-07-08',
      emergencyContact: '010-7654-3210',
      notes: '최근 서비스 이용 중단',
      totalPayment: 600000,
      services: [
        { date: '2024-06-15', type: '가사 도움', amount: 80000, status: '완료' }
      ]
    },
    {
      id: 4,
      name: '정수진',
      phone: '010-4567-8901',
      email: 'sujin@email.com',
      joinDate: '2024-01-05',
      status: 'pending',
      serviceCount: 0,
      lastService: null,
      address: '서울시 송파구 잠실로 321',
      birthDate: '1972-12-25',
      emergencyContact: '010-6543-2109',
      notes: '신규 가입 승인 대기중',
      totalPayment: 0,
      services: []
    },
    {
      id: 5,
      name: '최민호',
      phone: '010-5678-9012',
      email: 'minho@email.com',
      joinDate: '2024-04-18',
      status: 'active',
      serviceCount: 31,
      lastService: '2024-07-14',
      address: '서울시 용산구 이태원로 654',
      birthDate: '1963-09-12',
      emergencyContact: '010-5432-1098',
      notes: 'VIP 고객, 다양한 서비스 이용',
      totalPayment: 1550000,
      services: [
        { date: '2024-07-14', type: '병원 동행', amount: 50000, status: '완료' },
        { date: '2024-07-11', type: '장보기', amount: 30000, status: '완료' },
        { date: '2024-07-09', type: '말벗', amount: 40000, status: '완료' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">비활성</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">승인대기</Badge>;
      default:
        return <Badge>상태</Badge>;
    }
  };

  const filteredMembers = membersData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
    setActiveTab('basic');
  };

  const handleStatusChange = (memberId: number, newStatus: string) => {
    console.log(`회원 ${memberId}의 상태를 ${newStatus}로 변경`);
  };

  const handleSaveMember = () => {
    console.log('회원 정보 저장');
    setIsEditMode(false);
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
                  href={item.id === 'dashboard' ? 'https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/7c0a070a-5939-49c0-b90b-645c57d6dcc0' : '#'}
                  data-readdy={item.id === 'dashboard' ? 'true' : undefined}
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
                <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
                <p className="text-sm text-gray-500">회원 정보를 조회하고 관리할 수 있습니다</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="!rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-download mr-2"></i>
                회원 목록 내보내기
              </Button>
              <Button className="!rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-user-plus mr-2"></i>
                신규 회원 등록
              </Button>
            </div>
          </div>
        </header>

        {/* 회원 관리 메인 컨텐츠 */}
        <main className="p-6 space-y-6">
          {/* 검색 및 필터 섹션 */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <Input
                      placeholder="회원명, 연락처, 이메일로 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm border border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer"
                    >
                      <option value="all">전체 상태</option>
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="pending">승인대기</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <Button variant="outline" className="w-full !rounded-button cursor-pointer whitespace-nowrap">
                    <i className="fas fa-redo mr-2"></i>
                    필터 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 회원 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>회원 목록 ({filteredMembers.length}명)</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>페이지당 {itemsPerPage}개</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">회원명</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">연락처</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">가입일</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">서비스 이용 횟수</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMemberClick(member)}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{member.phone}</td>
                        <td className="py-4 px-4 text-gray-700">{member.joinDate}</td>
                        <td className="py-4 px-4">{getStatusBadge(member.status)}</td>
                        <td className="py-4 px-4 text-gray-700">{member.serviceCount}회</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="!rounded-button cursor-pointer whitespace-nowrap"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMemberClick(member);
                              }}
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="!rounded-button cursor-pointer whitespace-nowrap"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(member.id, member.status === 'active' ? 'inactive' : 'active');
                              }}
                            >
                              <i className={`fas ${member.status === 'active' ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredMembers.length)} / {filteredMembers.length}개 표시
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-users text-blue-600 text-lg"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">{membersData.filter(m => m.status === 'active').length}</p>
                <p className="text-sm text-gray-500">활성 회원</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-clock text-yellow-600 text-lg"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">{membersData.filter(m => m.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">승인 대기</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-pause text-gray-600 text-lg"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">{membersData.filter(m => m.status === 'inactive').length}</p>
                <p className="text-sm text-gray-500">비활성 회원</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-chart-line text-green-600 text-lg"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">{membersData.reduce((sum, m) => sum + m.serviceCount, 0)}</p>
                <p className="text-sm text-gray-500">총 서비스 이용</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* 회원 상세 정보 모달 */}
      {isDetailModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">회원 상세 정보</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  <i className="fas fa-edit mr-2"></i>
                  {isEditMode ? '편집 취소' : '정보 수정'}
                </Button>
                <Button
                  variant="ghost"
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </div>

            <div className="flex border-b">
              <button
                className={`px-6 py-3 text-sm font-medium cursor-pointer ${
                  activeTab === 'basic' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                기본 정보
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium cursor-pointer ${
                  activeTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('services')}
              >
                서비스 이용 내역
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium cursor-pointer ${
                  activeTab === 'payments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('payments')}
              >
                결제 내역
              </button>
            </div>

            <ScrollArea className="max-h-[60vh] p-6">
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회원명</label>
                      <Input
                        value={selectedMember.name}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                      <Input
                        value={selectedMember.phone}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                      <Input
                        value={selectedMember.email}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                      <Input
                        value={selectedMember.birthDate}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                      <Input
                        value={selectedMember.address}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">비상연락처</label>
                      <Input
                        value={selectedMember.emergencyContact}
                        disabled={!isEditMode}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회원 상태</label>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(selectedMember.status)}
                        {isEditMode && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="!rounded-button cursor-pointer whitespace-nowrap">활성화</Button>
                            <Button variant="outline" size="sm" className="!rounded-button cursor-pointer whitespace-nowrap">비활성화</Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                      <Textarea
                        value={selectedMember.notes}
                        disabled={!isEditMode}
                        className="text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedMember.serviceCount}</p>
                        <p className="text-sm text-gray-500">총 이용 횟수</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">₩{selectedMember.totalPayment.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">총 결제 금액</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedMember.lastService || 'N/A'}</p>
                        <p className="text-sm text-gray-500">최근 이용일</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    {selectedMember.services.map((service: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{service.type}</p>
                          <p className="text-sm text-gray-500">{service.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₩{service.amount.toLocaleString()}</p>
                          <Badge className="bg-green-100 text-green-800">{service.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <i className="fas fa-credit-card text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">결제 내역 정보를 준비중입니다.</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {isEditMode && (
              <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
                <Button
                  variant="outline"
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                  onClick={() => setIsEditMode(false)}
                >
                  취소
                </Button>
                <Button
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                  onClick={handleSaveMember}
                >
                  저장
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
