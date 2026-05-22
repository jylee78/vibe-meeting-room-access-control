'use client';

import { AccessRequest, STATUS_LABELS, RequestStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Users, Building2, Mail, User, FileText } from 'lucide-react';

interface RequestDetailDialogProps {
  request: AccessRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusStyles: Record<RequestStatus, string> = {
  pending: 'bg-[oklch(0.80_0.15_85/0.15)] text-[oklch(0.80_0.15_85)] border-[oklch(0.80_0.15_85/0.3)]',
  approved: 'bg-[oklch(0.70_0.18_155/0.15)] text-[oklch(0.70_0.18_155)] border-[oklch(0.70_0.18_155/0.3)]',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
};

export function RequestDetailDialog({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: RequestDetailDialogProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">출입 요청 상세</DialogTitle>
            <Badge
              variant="outline"
              className={cn('font-medium', statusStyles[request.status])}
            >
              {STATUS_LABELS[request.status]}
            </Badge>
          </div>
          <DialogDescription className="text-muted-foreground">
            신청일: {request.requestDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 신청자 정보 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">신청자 정보</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">이름:</span>
                <span className="text-foreground">{request.applicantName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">이메일:</span>
                <span className="text-foreground">{request.applicantEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">부서:</span>
                <span className="text-foreground">{request.applicantDepartment}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* 예약 정보 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">예약 정보</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">장소:</span>
                <span className="text-foreground">{request.spaceName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">이용일:</span>
                <span className="text-foreground">{request.accessDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">시간:</span>
                <span className="text-foreground">{request.startTime} - {request.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">인원:</span>
                <span className="text-foreground">{request.attendees}명</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* 사용 목적 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">사용 목적</h4>
            <div className="flex items-start gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-foreground">{request.purpose}</span>
            </div>
          </div>

          {/* 처리 결과 (승인/거절된 경우) */}
          {request.status !== 'pending' && request.reviewedBy && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">처리 정보</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">처리자:</span>
                    <span className="text-foreground">{request.reviewedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">처리일:</span>
                    <span className="text-foreground">{request.reviewedAt}</span>
                  </div>
                  {request.notes && (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground">비고:</span>
                      <span className="text-foreground">{request.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 액션 버튼 (대기 중인 경우) */}
        {request.status === 'pending' && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => onReject?.(request.id)}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              거절
            </Button>
            <Button
              onClick={() => onApprove?.(request.id)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              승인
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
