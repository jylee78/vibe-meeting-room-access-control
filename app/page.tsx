'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { StatCard } from '@/components/stat-card';
import { RequestTable } from '@/components/request-table';
import { RequestDetailDialog } from '@/components/request-detail-dialog';
import { AccessRequestFormDialog } from '@/components/access-request-form-dialog';
import { sampleSpaces, sampleRequests, calculateStats } from '@/lib/data';
import { AccessRequest, Space } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Clock,
  CheckCircle,
  Building2,
  Plus,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [requests, setRequests] = useState<AccessRequest[]>(sampleRequests);
  const [spaces] = useState<Space[]>(sampleSpaces);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  const stats = useMemo(() => calculateStats(requests, spaces), [requests, spaces]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending'),
    [requests]
  );

  const recentRequests = useMemo(
    () => [...requests].sort((a, b) => b.requestDate.localeCompare(a.requestDate)).slice(0, 5),
    [requests]
  );

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved' as const,
              reviewedBy: '관리자',
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
    setIsDetailOpen(false);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected' as const,
              reviewedBy: '관리자',
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
    setIsDetailOpen(false);
  };

  const handleViewDetails = (request: AccessRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleNewRequest = (request: Partial<AccessRequest>) => {
    const newRequest: AccessRequest = {
      id: Date.now().toString(),
      spaceId: request.spaceId || '',
      spaceName: request.spaceName || '',
      applicantName: request.applicantName || '',
      applicantEmail: request.applicantEmail || '',
      applicantDepartment: request.applicantDepartment || '',
      purpose: request.purpose || '',
      requestDate: request.requestDate || new Date().toISOString().split('T')[0],
      accessDate: request.accessDate || '',
      startTime: request.startTime || '',
      endTime: request.endTime || '',
      attendees: request.attendees || 1,
      status: 'pending',
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-semibold text-foreground">대시보드</h1>
              <p className="text-sm text-muted-foreground">출입 관리 현황을 확인하세요</p>
            </div>
            <Button
              onClick={() => setIsRequestFormOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              출입 신청
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="전체 신청"
              value={stats.totalRequests}
              icon={FileText}
              description="총 출입 신청 건수"
            />
            <StatCard
              title="승인 대기"
              value={stats.pendingRequests}
              icon={Clock}
              variant="warning"
              description="처리 필요"
            />
            <StatCard
              title="승인 완료"
              value={stats.approvedRequests}
              icon={CheckCircle}
              variant="success"
              description="이번 달"
            />
            <StatCard
              title="관리 장소"
              value={`${stats.activeSpaces}/${stats.totalSpaces}`}
              icon={Building2}
              variant="primary"
              description="활성/전체"
            />
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pending Requests */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">승인 대기 요청</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pendingRequests.length}건의 요청이 대기 중입니다
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-border" asChild>
                  <a href="/pending">전체 보기</a>
                </Button>
              </CardHeader>
              <CardContent>
                <RequestTable
                  requests={pendingRequests.slice(0, 5)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[oklch(0.70_0.18_155)]" />
                      <span className="text-sm text-muted-foreground">승인됨</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {stats.approvedRequests}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[oklch(0.80_0.15_85)]" />
                      <span className="text-sm text-muted-foreground">대기중</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {stats.pendingRequests}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-sm text-muted-foreground">거절됨</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {stats.rejectedRequests}건
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">인기 장소</h4>
                  <div className="space-y-2">
                    {spaces.slice(0, 3).map((space) => (
                      <div
                        key={space.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{space.name}</span>
                        <span className="text-foreground font-medium">
                          {requests.filter((r) => r.spaceId === space.id).length}건
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">최근 신청 내역</CardTitle>
              <p className="text-sm text-muted-foreground">
                최근 접수된 출입 신청 목록입니다
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="bg-secondary border-border mb-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background">
                    전체
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-background">
                    대기중
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-background">
                    승인됨
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <RequestTable
                    requests={recentRequests}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                  />
                </TabsContent>
                <TabsContent value="pending">
                  <RequestTable
                    requests={recentRequests.filter((r) => r.status === 'pending')}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                  />
                </TabsContent>
                <TabsContent value="approved">
                  <RequestTable
                    requests={recentRequests.filter((r) => r.status === 'approved')}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <RequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AccessRequestFormDialog
        spaces={spaces}
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        onSubmit={handleNewRequest}
      />
    </div>
  );
}
