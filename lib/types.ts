// 출입 관리 시스템 타입 정의

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type SpaceType = 'meeting_room' | 'exhibition' | 'conference' | 'seminar' | 'other';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  location: string;
  capacity: number;
  description?: string;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface AccessRequest {
  id: string;
  spaceId: string;
  spaceName: string;
  applicantName: string;
  applicantEmail: string;
  applicantDepartment: string;
  purpose: string;
  requestDate: string;
  accessDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalSpaces: number;
  activeSpaces: number;
}

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  meeting_room: '회의실',
  exhibition: '전시장',
  conference: '컨퍼런스홀',
  seminar: '세미나실',
  other: '기타',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: '대기중',
  approved: '승인됨',
  rejected: '거절됨',
};
