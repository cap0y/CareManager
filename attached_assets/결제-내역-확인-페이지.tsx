// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const App: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const paymentHistory = [
    {
      id: 1,
      serviceName: '병원 동행 서비스',
      careManager: '김미영',
      amount: 75000,
      date: '2025-07-18',
      time: '14:30',
      method: '카드결제',
      status: '결제완료',
      receiptId: 'RCP-2025071801'
    },
    {
      id: 2,
      serviceName: '가사 도움 서비스',
      careManager: '박정수',
      amount: 69000,
      date: '2025-07-15',
      time: '10:00',
      method: '계좌이체',
      status: '결제완료',
      receiptId: 'RCP-2025071502'
    },
    {
      id: 3,
      serviceName: '장보기 서비스',
      careManager: '이순희',
      amount: 48000,
      date: '2025-07-12',
      time: '16:20',
      method: '카드결제',
      status: '결제완료',
      receiptId: 'RCP-2025071203'
    },
    {
      id: 4,
      serviceName: '말벗 서비스',
      careManager: '김미영',
      amount: 60000,
      date: '2025-07-08',
      time: '11:45',
      method: '카드결제',
      status: '결제완료',
      receiptId: 'RCP-2025070804'
    },
    {
      id: 5,
      serviceName: '병원 동행 서비스',
      careManager: '박정수',
      amount: 90000,
      date: '2025-07-05',
      time: '09:30',
      method: '계좌이체',
      status: '결제완료',
      receiptId: 'RCP-2025070505'
    },
    {
      id: 6,
      serviceName: '가사 도움 서비스',
      careManager: '이순희',
      amount: 72000,
      date: '2025-06-28',
      time: '13:15',
      method: '카드결제',
      status: '결제완료',
      receiptId: 'RCP-2025062806'
    }
  ];

  const monthlyStats = [
    { month: '2025-07', count: 4, amount: 252000 },
    { month: '2025-06', count: 2, amount: 144000 },
    { month: '2025-05', count: 3, amount: 189000 },
    { month: '2025-04', count: 1, amount: 75000 }
  ];

  const filteredPayments = paymentHistory.filter(payment => {
    if (selectedPeriod === 'all') return true;
    if (selectedPeriod === 'month') {
      if (selectedMonth === 'all') return payment.date.startsWith(selectedYear);
      return payment.date.startsWith(`${selectedYear}-${selectedMonth.padStart(2, '0')}`);
    }
    if (selectedPeriod === 'year') {
      return payment.date.startsWith(selectedYear);
    }
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCount = filteredPayments.length;

  const handleDownloadReceipt = (receiptId: string) => {
    console.log(`영수증 다운로드: ${receiptId}`);
    // 실제로는 PDF 다운로드 로직이 들어갈 부분
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white relative min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <a 
            href="https://readdy.ai/home/41a154d5-ad95-4f12-be39-65bb6d1c0008/6f6a7a0f-f4b0-4a3b-a5be-67bd89315372" 
            data-readdy="true"
            className="cursor-pointer"
          >
            <i className="fas fa-arrow-left text-xl text-gray-600"></i>
          </a>
          <h1 className="text-xl font-bold text-gray-800">결제 내역</h1>
        </div>
        <Button variant="ghost" size="sm" className="p-2 !rounded-button cursor-pointer">
          <i className="fas fa-filter text-gray-600"></i>
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white px-6 py-4 border-b space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">기간 선택</label>
            <div className="flex space-x-2">
              <Button
                variant={selectedPeriod === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('all')}
                className="!rounded-button whitespace-nowrap cursor-pointer"
              >
                전체
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
                className="!rounded-button whitespace-nowrap cursor-pointer"
              >
                월별
              </Button>
              <Button
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('year')}
                className="!rounded-button whitespace-nowrap cursor-pointer"
              >
                연도별
              </Button>
            </div>
          </div>
        </div>

        {selectedPeriod !== 'all' && (
          <div className="flex space-x-2">
            <div className="flex-1">
              <Button variant="outline" className="w-full justify-between !rounded-button cursor-pointer">
                <span>{selectedYear}년</span>
                <i className="fas fa-chevron-down"></i>
              </Button>
            </div>
            {selectedPeriod === 'month' && (
              <div className="flex-1">
                <Button variant="outline" className="w-full justify-between !rounded-button cursor-pointer">
                  <span>{selectedMonth === 'all' ? '전체 월' : `${selectedMonth}월`}</span>
                  <i className="fas fa-chevron-down"></i>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">총 결제 건수</p>
              <p className="text-lg font-bold text-blue-600">{totalCount}건</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">총 결제 금액</p>
              <p className="text-lg font-bold text-blue-600">{totalAmount.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History List */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">결제 내역</h2>
          <span className="text-sm text-gray-500">{totalCount}건</span>
        </div>

        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="border-[0.5px] hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{payment.serviceName}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          payment.status === '결제완료' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <i className="fas fa-user-nurse w-4"></i>
                      <span>{payment.careManager} 케어 매니저</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {payment.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-calendar w-4"></i>
                    <span>{payment.date} {payment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-credit-card w-4"></i>
                    <span>{payment.method}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">영수증 번호: {payment.receiptId}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(payment.receiptId)}
                      className="!rounded-button whitespace-nowrap cursor-pointer"
                    >
                      <i className="fas fa-download mr-1"></i>
                      영수증
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!rounded-button cursor-pointer"
                    >
                      <i className="fas fa-chevron-right text-gray-400"></i>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Statistics Chart */}
      <div className="px-6 py-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 결제 현황</h3>
        <Card className="border-[0.5px]">
          <CardContent className="p-4">
            <div className="space-y-4">
              {monthlyStats.map((stat) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {stat.month.replace('-', '년 ')}월
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">
                      {stat.amount.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500">{stat.count}건</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">이용 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-[0.5px]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {paymentHistory.length}
              </div>
              <div className="text-sm text-gray-600">총 결제 건수</div>
            </CardContent>
          </Card>
          <Card className="border-[0.5px]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(paymentHistory.reduce((sum, p) => sum + p.amount, 0) / 1000)}K
              </div>
              <div className="text-sm text-gray-600">총 결제 금액</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Usage by Type */}
      <div className="px-6 py-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">서비스별 이용 현황</h3>
        <div className="space-y-3">
          {[
            { name: '병원 동행', count: 2, amount: 165000, color: 'bg-blue-500' },
            { name: '가사 도움', count: 2, amount: 141000, color: 'bg-green-500' },
            { name: '장보기', count: 1, amount: 48000, color: 'bg-purple-500' },
            { name: '말벗', count: 1, amount: 60000, color: 'bg-orange-500' }
          ].map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${service.color} rounded-full`}></div>
                <div>
                  <div className="font-medium text-gray-800">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.count}회 이용</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {service.amount.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-6"></div>
    </div>
  );
};

export default App;
