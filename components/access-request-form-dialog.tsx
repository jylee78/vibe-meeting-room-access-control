'use client';

import { useState } from 'react';
import { Space, AccessRequest, SPACE_TYPE_LABELS, SpaceType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccessRequestFormDialogProps {
  spaces: Space[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: Partial<AccessRequest>) => void;
}

export function AccessRequestFormDialog({
  spaces,
  open,
  onOpenChange,
  onSubmit,
}: AccessRequestFormDialogProps) {
  const activeSpaces = spaces.filter((s) => s.isActive);

  const [formData, setFormData] = useState({
    spaceId: '',
    applicantName: '',
    applicantEmail: '',
    applicantDepartment: '',
    purpose: '',
    accessDate: '',
    startTime: '',
    endTime: '',
    attendees: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSpace = spaces.find((s) => s.id === formData.spaceId);
    onSubmit({
      ...formData,
      spaceName: selectedSpace?.name || '',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    onOpenChange(false);
    setFormData({
      spaceId: '',
      applicantName: '',
      applicantEmail: '',
      applicantDepartment: '',
      purpose: '',
      accessDate: '',
      startTime: '',
      endTime: '',
      attendees: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">출입 신청</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            장소 출입을 신청합니다. 승인 후 이용 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* 장소 선택 */}
          <div className="space-y-2">
            <Label htmlFor="space" className="text-foreground">장소 선택</Label>
            <Select
              value={formData.spaceId}
              onValueChange={(value) => setFormData({ ...formData, spaceId: value })}
              required
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="장소를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {activeSpaces.map((space) => (
                  <SelectItem key={space.id} value={space.id} className="text-foreground">
                    {space.name} ({SPACE_TYPE_LABELS[space.type as SpaceType]} · 수용 {space.capacity}명)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 신청자 정보 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="applicantName" className="text-foreground">신청자 이름</Label>
              <Input
                id="applicantName"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="홍길동"
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicantDepartment" className="text-foreground">부서</Label>
              <Input
                id="applicantDepartment"
                value={formData.applicantDepartment}
                onChange={(e) => setFormData({ ...formData, applicantDepartment: e.target.value })}
                placeholder="개발팀"
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicantEmail" className="text-foreground">이메일</Label>
            <Input
              id="applicantEmail"
              type="email"
              value={formData.applicantEmail}
              onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
              placeholder="name@company.com"
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          {/* 이용 정보 */}
          <div className="space-y-2">
            <Label htmlFor="accessDate" className="text-foreground">이용일</Label>
            <Input
              id="accessDate"
              type="date"
              value={formData.accessDate}
              onChange={(e) => setFormData({ ...formData, accessDate: e.target.value })}
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-foreground">시작 시간</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-foreground">종료 시간</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees" className="text-foreground">인원 수</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) })}
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-foreground">사용 목적</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="장소 사용 목적을 입력하세요"
              className="bg-input border-border text-foreground resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              취소
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              신청
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
