'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { RequestTable } from '@/components/request-table';
import { RequestDetailDialog } from '@/components/request-detail-dialog';
import { sampleRequests } from '@/lib/data';
import { AccessRequest } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle, XCircle } from 'lucide-react';

export default function ApprovedPage() {
  const [requests] = useState<AccessRequest[]>(sampleRequests);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const approvedRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === 'approved')
      .filter((request) => {
        const matchesSearch =
          request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
  }, [requests, searchTerm]);

  const rejectedRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === 'rejected')
      .filter((request) => {
        const matchesSearch =
          request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
  }, [requests, searchTerm]);

  const handleViewDetails = (request: AccessRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-semibold text-foreground">승인 완료</h1>
              <p className="text-sm text-muted-foreground">
                처리된 출입 신청 내역을 확인하세요
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-[oklch(0.70_0.18_155/0.15)] text-[oklch(0.70_0.18_155)] border-[oklch(0.70_0.18_155/0.3)]"
              >
                승인 {approvedRequests.length}
              </Badge>
              <Badge
                variant="outline"
                className="bg-destructive/15 text-destructive border-destructive/30"
              >
                거절 {rejectedRequests.length}
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
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

          {/* Tabs */}
          <Tabs defaultValue="approved" className="space-y-6">
            <TabsList className="bg-secondary border-border">
              <TabsTrigger
                value="approved"
                className="data-[state=active]:bg-background flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                승인됨
                <Badge variant="secondary" className="ml-1 bg-muted text-muted-foreground">
                  {approvedRequests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:bg-background flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                거절됨
                <Badge variant="secondary" className="ml-1 bg-muted text-muted-foreground">
                  {rejectedRequests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approved">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[oklch(0.70_0.18_155)]" />
                    <CardTitle className="text-foreground">승인된 요청</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    승인이 완료된 출입 신청 목록입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RequestTable
                    requests={approvedRequests}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-foreground">거절된 요청</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    거절된 출입 신청 목록입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RequestTable
                    requests={rejectedRequests}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Detail Dialog */}
      <RequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
