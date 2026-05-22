'use client';

import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { StatCard } from '@/components/stat-card';
import { RequestDetailDialog } from '@/components/request-detail-dialog';
import { sampleRequests } from '@/lib/data';
import { AccessRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CalendarCheck2,
  Clock3,
  LogIn,
  LogOut,
  Search,
  Users,
} from 'lucide-react';

type EntryStatus = 'waiting' | 'entered' | 'completed';

interface EntryRecord extends AccessRequest {
  entryStatus: EntryStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
}

const entryStatusLabel: Record<EntryStatus, string> = {
  waiting: '입장 전',
  entered: '입장 중',
  completed: '퇴장 완료',
};

const entryStatusBadge: Record<EntryStatus, string> = {
  waiting: 'bg-[oklch(0.80_0.15_85/0.15)] text-[oklch(0.80_0.15_85)] border-[oklch(0.80_0.15_85/0.3)]',
  entered: 'bg-[oklch(0.70_0.18_155/0.15)] text-[oklch(0.70_0.18_155)] border-[oklch(0.70_0.18_155/0.3)]',
  completed: 'bg-secondary text-secondary-foreground border-border',
};

const today = new Date().toISOString().split('T')[0];

function getInitialEntryStatus(request: AccessRequest): EntryStatus {
  if (request.accessDate < today) {
    return 'completed';
  }

  return 'waiting';
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function EntryPage() {
  const [entries, setEntries] = useState<EntryRecord[]>(() =>
    sampleRequests
      .filter((request) => request.status === 'approved')
      .map((request) => ({
        ...request,
        entryStatus: getInitialEntryStatus(request),
        checkedInAt: request.accessDate < today ? request.startTime : undefined,
        checkedOutAt: request.accessDate < today ? request.endTime : undefined,
      }))
  );
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.applicantDepartment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || entry.entryStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [entries, searchTerm, statusFilter]);

  const waitingCount = entries.filter((entry) => entry.entryStatus === 'waiting').length;
  const enteredCount = entries.filter((entry) => entry.entryStatus === 'entered').length;
  const completedCount = entries.filter((entry) => entry.entryStatus === 'completed').length;
  const totalAttendees = filteredEntries.reduce((sum, entry) => sum + entry.attendees, 0);

  const handleViewDetails = (request: AccessRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleCheckIn = (id: string) => {
    const checkedInAt = getCurrentTimeLabel();

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              entryStatus: 'entered',
              checkedInAt,
              checkedOutAt: undefined,
            }
          : entry
      )
    );
  };

  const handleCheckOut = (id: string) => {
    const checkedOutAt = getCurrentTimeLabel();

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              entryStatus: 'completed',
              checkedOutAt,
            }
          : entry
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-semibold text-foreground">입장관리</h1>
              <p className="text-sm text-muted-foreground">
                승인 완료된 신청자의 실제 입장 현황을 확인하고 처리하세요
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
            >
              승인 완료 {entries.length}건
            </Badge>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="입장 전"
              value={waitingCount}
              icon={Clock3}
              variant="warning"
              description="현장 입장을 기다리는 인원"
            />
            <StatCard
              title="입장 중"
              value={enteredCount}
              icon={LogIn}
              variant="success"
              description="현재 장소에 머무는 인원"
            />
            <StatCard
              title="퇴장 완료"
              value={completedCount}
              icon={LogOut}
              description="일정을 마치고 퇴장 완료"
            />
            <StatCard
              title="대상 인원"
              value={`${totalAttendees}명`}
              icon={Users}
              variant="primary"
              description="현재 목록 기준 총 입장 대상"
            />
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-foreground">입장 현황 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative lg:col-span-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="신청자, 부서, 장소명으로 검색..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="입장 상태" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-foreground">
                      전체 상태
                    </SelectItem>
                    <SelectItem value="waiting" className="text-foreground">
                      입장 전
                    </SelectItem>
                    <SelectItem value="entered" className="text-foreground">
                      입장 중
                    </SelectItem>
                    <SelectItem value="completed" className="text-foreground">
                      퇴장 완료
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">입장 대상 목록</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  승인 완료된 출입 신청의 입장 상태를 현장에서 관리합니다
                </p>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">
                검색 결과 {filteredEntries.length}건
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-border bg-background/40 p-5 transition-colors hover:bg-secondary/20"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {entry.applicantName}
                            </h3>
                            <Badge
                              variant="outline"
                              className={entryStatusBadge[entry.entryStatus]}
                            >
                              {entryStatusLabel[entry.entryStatus]}
                            </Badge>
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {entry.applicantDepartment}
                            </Badge>
                          </div>

                          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                            <div className="flex items-center gap-2">
                              <CalendarCheck2 className="h-4 w-4" />
                              <span>{entry.accessDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4" />
                              <span>
                                {entry.startTime} - {entry.endTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-foreground">장소</span>
                              <span className="ml-2">{entry.spaceName}</span>
                            </div>
                            <div>
                              <span className="text-foreground">입장 대상</span>
                              <span className="ml-2">{entry.attendees}명</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">입장 시각</span>
                              <span className="ml-2 text-foreground">
                                {entry.checkedInAt || '-'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">퇴장 시각</span>
                              <span className="ml-2 text-foreground">
                                {entry.checkedOutAt || '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:min-w-40">
                          <Button
                            variant="outline"
                            className="border-border"
                            onClick={() => handleViewDetails(entry)}
                          >
                            상세보기
                          </Button>
                          {entry.entryStatus === 'waiting' && (
                            <Button
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleCheckIn(entry.id)}
                            >
                              입장 처리
                            </Button>
                          )}
                          {entry.entryStatus === 'entered' && (
                            <Button
                              className="bg-[oklch(0.70_0.18_155)] text-[oklch(0.12_0.01_250)] hover:bg-[oklch(0.70_0.18_155/0.9)]"
                              onClick={() => handleCheckOut(entry.id)}
                            >
                              퇴장 처리
                            </Button>
                          )}
                          {entry.entryStatus === 'completed' && (
                            <Button variant="outline" className="border-border" disabled>
                              처리 완료
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <span className="text-2xl">🚪</span>
                    </div>
                    <p className="text-muted-foreground">조건에 맞는 입장 대상이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}