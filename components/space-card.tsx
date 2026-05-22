'use client';

import { Space, SPACE_TYPE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, MapPin, Edit, Trash2 } from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onEdit?: (space: Space) => void;
  onDelete?: (id: string) => void;
}

export function SpaceCard({ space, onEdit, onDelete }: SpaceCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">{space.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{SPACE_TYPE_LABELS[space.type]}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium',
              space.isActive
                ? 'bg-[oklch(0.70_0.18_155/0.15)] text-[oklch(0.70_0.18_155)] border-[oklch(0.70_0.18_155/0.3)]'
                : 'bg-secondary text-muted-foreground border-border'
            )}
          >
            {space.isActive ? '활성' : '비활성'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{space.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>수용 인원: {space.capacity}명</span>
          </div>
        </div>

        {space.description && (
          <p className="text-sm text-muted-foreground">{space.description}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {space.requiresApproval ? '승인 필요' : '자유 이용'}
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit?.(space)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete?.(space.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
