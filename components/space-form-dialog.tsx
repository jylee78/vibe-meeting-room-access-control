'use client';

import { useState } from 'react';
import { Space, SpaceType, SPACE_TYPE_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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

interface SpaceFormDialogProps {
  space?: Space | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (space: Partial<Space>) => void;
}

export function SpaceFormDialog({
  space,
  open,
  onOpenChange,
  onSave,
}: SpaceFormDialogProps) {
  const isEditing = !!space;

  const [formData, setFormData] = useState<Partial<Space>>(
    space || {
      name: '',
      type: 'meeting_room',
      location: '',
      capacity: 10,
      description: '',
      requiresApproval: true,
      isActive: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? '장소 수정' : '새 장소 추가'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing ? '장소 정보를 수정합니다.' : '새로운 장소를 등록합니다.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">장소명</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 대회의실 A"
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">장소 유형</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as SpaceType })}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.entries(SPACE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-foreground">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">위치</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="예: 본관 3층"
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-foreground">수용 인원</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">설명 (선택)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="장소에 대한 설명을 입력하세요"
              className="bg-input border-border text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-foreground">승인 필요</Label>
              <p className="text-xs text-muted-foreground">출입 시 승인이 필요합니다</p>
            </div>
            <Switch
              checked={formData.requiresApproval}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requiresApproval: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-foreground">활성 상태</Label>
              <p className="text-xs text-muted-foreground">비활성 시 예약 불가</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
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
              {isEditing ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
