'use client';

import { AccessRequest, STATUS_LABELS, RequestStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, Eye } from 'lucide-react';

interface RequestTableProps {
  requests: AccessRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (request: AccessRequest) => void;
  showActions?: boolean;
}

const statusStyles: Record<RequestStatus, string> = {
  pending: 'bg-[oklch(0.80_0.15_85/0.15)] text-[oklch(0.80_0.15_85)] border-[oklch(0.80_0.15_85/0.3)]',
  approved: 'bg-[oklch(0.70_0.18_155/0.15)] text-[oklch(0.70_0.18_155)] border-[oklch(0.70_0.18_155/0.3)]',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
};

export function RequestTable({
  requests,
  onApprove,
  onReject,
  onViewDetails,
  showActions = true,
}: RequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-muted-foreground">출입 요청이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">신청자</TableHead>
            <TableHead className="text-muted-foreground">장소</TableHead>
            <TableHead className="text-muted-foreground">이용일</TableHead>
            <TableHead className="text-muted-foreground">시간</TableHead>
            <TableHead className="text-muted-foreground">인원</TableHead>
            <TableHead className="text-muted-foreground">상태</TableHead>
            {showActions && <TableHead className="text-muted-foreground text-right">작업</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className="border-border hover:bg-secondary/30 cursor-pointer"
              onClick={() => onViewDetails?.(request)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{request.applicantName}</p>
                  <p className="text-xs text-muted-foreground">{request.applicantDepartment}</p>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{request.spaceName}</TableCell>
              <TableCell className="text-foreground">{request.accessDate}</TableCell>
              <TableCell className="text-muted-foreground">
                {request.startTime} - {request.endTime}
              </TableCell>
              <TableCell className="text-muted-foreground">{request.attendees}명</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn('font-medium', statusStyles[request.status])}
                >
                  {STATUS_LABELS[request.status]}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails?.(request);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        상세보기
                      </DropdownMenuItem>
                      {request.status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove?.(request.id);
                            }}
                            className="cursor-pointer text-[oklch(0.70_0.18_155)]"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            승인
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject?.(request.id);
                            }}
                            className="cursor-pointer text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            거절
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
