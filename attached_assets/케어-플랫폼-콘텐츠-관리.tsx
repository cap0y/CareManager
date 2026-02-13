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
  const [selectedMenu, setSelectedMenu] = useState('content');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    category: '',
    title: '',
    content: '',
    status: 'draft'
  });

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

  const contentData = [
    {
      id: 1,
      title: '케어플랫폼 서비스 이용약관',
      category: '이용약관',
      content: '제1조 (목적) 이 약관은 케어플랫폼이 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다...',
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      author: '관리자',
      views: 1250
    },
    {
      id: 2,
      title: '개인정보 처리방침 개정 안내',
      category: '개인정보처리방침',
      content: '케어플랫폼은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 개인정보 처리방침을 개정합니다...',
      status: 'published',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18',
      author: '관리자',
      views: 890
    },
    {
      id: 3,
      title: '2024년 설날 휴무 안내',
      category: '공지사항',
      content: '2024년 설날 연휴에 따른 고객센터 운영 시간 변경 및 서비스 이용 안내를 말씀드립니다...',
      status: 'published',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      author: '관리자',
      views: 2150
    },
    {
      id: 4,
      title: '케어매니저 등록 절차는 어떻게 되나요?',
      category: 'FAQ',
      content: '케어매니저로 등록하시려면 다음 절차를 따라주세요: 1. 회원가입 2. 자격증 업로드 3. 신원확인 4. 교육 이수...',
      status: 'published',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-16',
      author: '관리자',
      views: 1680
    },
    {
      id: 5,
      title: '서비스 예약 취소 정책 안내',
      category: 'FAQ',
      content: '서비스 예약 취소는 다음과 같은 정책에 따라 처리됩니다: 24시간 전 취소 시 100% 환불, 12시간 전 취소 시 50% 환불...',
      status: 'draft',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      author: '관리자',
      views: 0
    },
    {
      id: 6,
      title: '플랫폼 업데이트 예정 안내',
      category: '공지사항',
      content: '더 나은 서비스 제공을 위해 다음 주 화요일 오전 2시부터 6시까지 시스템 점검을 실시합니다...',
      status: 'scheduled',
      createdAt: '2024-01-23',
      updatedAt: '2024-01-23',
      author: '관리자',
      views: 0
    },
    {
      id: 7,
      title: '결제 오류 시 대처 방법',
      category: 'FAQ',
      content: '결제 과정에서 오류가 발생했을 때의 대처 방법을 안내해드립니다: 1. 결제 내역 확인 2. 고객센터 문의...',
      status: 'published',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
      author: '관리자',
      views: 945
    },
    {
      id: 8,
      title: '케어플랫폼 개인정보 처리방침',
      category: '개인정보처리방침',
      content: '케어플랫폼(이하 "회사")은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을 준수합니다...',
      status: 'published',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12',
      author: '관리자',
      views: 3200
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: '게시중', className: 'bg-green-100 text-green-800' },
      draft: { label: '임시저장', className: 'bg-gray-100 text-gray-800' },
      scheduled: { label: '예약게시', className: 'bg-blue-100 text-blue-800' },
      archived: { label: '보관', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      '공지사항': { className: 'bg-red-100 text-red-800' },
      'FAQ': { className: 'bg-blue-100 text-blue-800' },
      '이용약관': { className: 'bg-purple-100 text-purple-800' },
      '개인정보처리방침': { className: 'bg-orange-100 text-orange-800' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{category}</Badge>;
  };

  const filteredContent = contentData.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    let aValue, bValue;
    switch (sortField) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedContent.length / itemsPerPage);
  const paginatedContent = sortedContent.slice(
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
      setSelectedItems(paginatedContent.map(c => c.id));
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

  const handleViewDetails = (content: any) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setEditForm({
      category: content.category,
      title: content.title,
      content: content.content,
      status: content.status
    });
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedContent(null);
    setEditForm({
      category: '공지사항',
      title: '',
      content: '',
      status: 'draft'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveContent = () => {
    console.log('Saving content:', editForm);
    setIsEditModalOpen(false);
    setEditForm({
      category: '',
      title: '',
      content: '',
      status: 'draft'
    });
  };

  const handleDeleteContent = (contentId: number) => {
    console.log('Deleting content:', contentId);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for items:`, selectedItems);
  };

  const getTotalStats = () => {
    const published = filteredContent.filter(c => c.status === 'published');
    const draft = filteredContent.filter(c => c.status === 'draft');
    const scheduled = filteredContent.filter(c => c.status === 'scheduled');
    const recentUpdates = filteredContent.filter(c => {
      const updateDate = new Date(c.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return updateDate >= weekAgo;
    });

    return {
      totalContent: filteredContent.length,
      published: published.length,
      draft: draft.length,
      recentUpdates: recentUpdates.length
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
                href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/314fed1b-f164-47e5-a45d-dda66c8e2b21"
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
                <h2 className="text-2xl font-bold text-gray-900">콘텐츠 관리</h2>
                <p className="text-gray-600">공지사항, FAQ, 이용약관, 개인정보처리방침 등의 콘텐츠를 관리하세요</p>
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
                  setCategoryFilter('all');
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
                    <p className="text-sm font-medium text-gray-600">전체 콘텐츠</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-alt text-blue-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">게시 중</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-eye text-green-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">임시저장</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-edit text-yellow-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">최근 업데이트</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.recentUpdates}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clock text-purple-600 text-xl"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <CardTitle className="text-lg font-semibold">콘텐츠 목록</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <Input
                      placeholder="제목, 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-80 text-sm border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="공지사항">공지사항</SelectItem>
                        <SelectItem value="FAQ">FAQ</SelectItem>
                        <SelectItem value="이용약관">이용약관</SelectItem>
                        <SelectItem value="개인정보처리방침">개인정보처리방침</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="published">게시중</SelectItem>
                        <SelectItem value="draft">임시저장</SelectItem>
                        <SelectItem value="scheduled">예약게시</SelectItem>
                        <SelectItem value="archived">보관</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleCreateNew}
                      className="cursor-pointer !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      새 콘텐츠
                    </Button>
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
                        onClick={() => handleBulkAction('publish')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        일괄 게시
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('archive')}
                        className="cursor-pointer !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-archive mr-2"></i>
                        일괄 보관
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('delete')}
                        className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <i className="fas fa-trash mr-2"></i>
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
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === paginatedContent.length && paginatedContent.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">제목</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'title' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">카테고리</th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">작성일</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'createdAt' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('updatedAt')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">최종수정일</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'updatedAt' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('views')}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-700">조회수</span>
                          <i className={`fas fa-sort text-gray-400 text-xs ${
                            sortField === 'views' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContent.map((content) => (
                      <tr key={content.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(content.id)}
                            onChange={(e) => handleSelectItem(content.id, e.target.checked)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-blue-600">{content.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <h3 className="font-medium text-gray-900 truncate">{content.title}</h3>
                            <p className="text-sm text-gray-500 truncate mt-1">{content.content.substring(0, 50)}...</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getCategoryBadge(content.category)}</td>
                        <td className="py-3 px-4 text-gray-600">{content.createdAt}</td>
                        <td className="py-3 px-4">{getStatusBadge(content.status)}</td>
                        <td className="py-3 px-4 text-gray-600">{content.updatedAt}</td>
                        <td className="py-3 px-4 text-gray-600">{content.views.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(content)}
                              className="cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-eye text-xs"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditContent(content)}
                              className="cursor-pointer !rounded-button whitespace-nowrap text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteContent(content.id)}
                              className="cursor-pointer !rounded-button whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </Button>
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
                    총 {filteredContent.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredContent.length)}개 표시
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
            <DialogTitle className="text-xl font-bold">콘텐츠 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">ID</span>
                        <span className="font-mono text-sm text-blue-600">{selectedContent.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">카테고리</span>
                        {getCategoryBadge(selectedContent.category)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">작성일</span>
                        <span className="text-gray-900">{selectedContent.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">최종수정일</span>
                        <span className="text-gray-900">{selectedContent.updatedAt}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">상태</span>
                        {getStatusBadge(selectedContent.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">조회수</span>
                        <span className="text-gray-900">{selectedContent.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">작성자</span>
                        <span className="text-gray-900">{selectedContent.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">제목</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-bold text-gray-900">{selectedContent.title}</h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">내용</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContent.content}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEditContent(selectedContent);
                  }}
                  className="cursor-pointer !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                >
                  <i className="fas fa-edit mr-2"></i>
                  편집
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedContent ? '콘텐츠 편집' : '새 콘텐츠 작성'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="공지사항">공지사항</SelectItem>
                    <SelectItem value="FAQ">FAQ</SelectItem>
                    <SelectItem value="이용약관">이용약관</SelectItem>
                    <SelectItem value="개인정보처리방침">개인정보처리방침</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  게시 상태
                </label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="published">게시</SelectItem>
                    <SelectItem value="scheduled">예약게시</SelectItem>
                    <SelectItem value="archived">보관</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <Input
                placeholder="콘텐츠 제목을 입력하세요"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="w-full border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <Textarea
                placeholder="콘텐츠 내용을 입력하세요..."
                value={editForm.content}
                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                rows={15}
                className="w-full border border-gray-300"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditForm({
                    category: '',
                    title: '',
                    content: '',
                    status: 'draft'
                  });
                }}
                className="cursor-pointer !rounded-button whitespace-nowrap"
              >
                취소
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditForm({...editForm, status: 'draft'});
                  handleSaveContent();
                }}
                className="cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-save mr-2"></i>
                임시저장
              </Button>
              <Button
                onClick={handleSaveContent}
                className="cursor-pointer !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
              >
                <i className="fas fa-check mr-2"></i>
                {selectedContent ? '수정 완료' : '작성 완료'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
