'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { RequestTable } from '@/components/request-table';
import { RequestDetailDialog } from '@/components/request-detail-dialog';
import { AccessRequestFormDialog } from '@/components/access-request-form-dialog';
import { sampleSpaces, sampleRequests } from '@/lib/data';
import { AccessRequest, Space, STATUS_LABELS, RequestStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>(sampleRequests);
  const [spaces] = useState<Space[]>(sampleSpaces);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [spaceFilter, setSpaceFilter] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesSpace = spaceFilter === 'all' || request.spaceId === spaceFilter;
      return matchesSearch && matchesStatus && matchesSpace;
    });
  }, [requests, searchTerm, statusFilter, spaceFilter]);

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
              <h1 className="text-xl font-semibold text-foreground">출입 신청</h1>
              <p className="text-sm text-muted-foreground">
                모든 출입 신청 내역을 조회하고 관리하세요
              </p>
            </div>
            <Button
              onClick={() => setIsRequestFormOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 신청
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Filters */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" />
                필터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="신청자, 장소명, 목적으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-foreground">
                      전체 상태
                    </SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-foreground">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="장소 필터" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-foreground">
                      전체 장소
                    </SelectItem>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id} className="text-foreground">
                        {space.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>전체 {requests.length}건</span>
            <span>•</span>
            <span>검색 결과 {filteredRequests.length}건</span>
          </div>

          {/* Requests Table */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <RequestTable
                requests={filteredRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
              />
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
