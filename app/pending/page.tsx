'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { RequestTable } from '@/components/request-table';
import { RequestDetailDialog } from '@/components/request-detail-dialog';
import { sampleRequests } from '@/lib/data';
import { AccessRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, AlertTriangle } from 'lucide-react';

export default function PendingPage() {
  const [requests, setRequests] = useState<AccessRequest[]>(sampleRequests);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const pendingRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === 'pending')
      .filter((request) => {
        const matchesSearch =
          request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
  }, [requests, searchTerm]);

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

  const handleApproveAll = () => {
    const pendingIds = pendingRequests.map((r) => r.id);
    setRequests((prev) =>
      prev.map((r) =>
        pendingIds.includes(r.id)
          ? {
              ...r,
              status: 'approved' as const,
              reviewedBy: '관리자',
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                승인 대기
                <Badge
                  variant="outline"
                  className="bg-[oklch(0.80_0.15_85/0.15)] text-[oklch(0.80_0.15_85)] border-[oklch(0.80_0.15_85/0.3)]"
                >
                  {pendingRequests.length}
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                승인이 필요한 출입 신청을 처리하세요
              </p>
            </div>
            {pendingRequests.length > 0 && (
              <Button
                onClick={handleApproveAll}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                전체 승인
              </Button>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Alert Banner */}
          {pendingRequests.length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.80_0.15_85/0.1)] border border-[oklch(0.80_0.15_85/0.2)]">
              <AlertTriangle className="h-5 w-5 text-[oklch(0.80_0.15_85)]" />
              <p className="text-sm text-foreground">
                <span className="font-medium">{pendingRequests.length}건</span>의 출입 신청이
                승인 대기 중입니다.
              </p>
            </div>
          )}

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="신청자, 장소명, 목적으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>

          {/* Pending Requests */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[oklch(0.80_0.15_85)]" />
                <CardTitle className="text-foreground">대기 중인 요청</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                요청을 클릭하여 상세 정보를 확인하고 승인/거절할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestTable
                requests={pendingRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Detail Dialog */}
      <RequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
