'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { SpaceCard } from '@/components/space-card';
import { SpaceFormDialog } from '@/components/space-form-dialog';
import { sampleSpaces } from '@/lib/data';
import { Space, SPACE_TYPE_LABELS, SpaceType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search } from 'lucide-react';

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>(sampleSpaces);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || space.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSave = (spaceData: Partial<Space>) => {
    if (editingSpace) {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === editingSpace.id ? { ...s, ...spaceData } : s
        )
      );
    } else {
      const newSpace: Space = {
        id: Date.now().toString(),
        name: spaceData.name || '',
        type: spaceData.type || 'meeting_room',
        location: spaceData.location || '',
        capacity: spaceData.capacity || 10,
        description: spaceData.description,
        requiresApproval: spaceData.requiresApproval ?? true,
        isActive: spaceData.isActive ?? true,
      };
      setSpaces((prev) => [newSpace, ...prev]);
    }
    setEditingSpace(null);
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setSpaces((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-semibold text-foreground">장소 관리</h1>
              <p className="text-sm text-muted-foreground">
                출입 관리 대상 장소를 관리하세요
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingSpace(null);
                setIsFormOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              장소 추가
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="장소명 또는 위치로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="유형 필터" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all" className="text-foreground">
                  전체 유형
                </SelectItem>
                {Object.entries(SPACE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-foreground">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>전체 {spaces.length}개</span>
            <span>•</span>
            <span>활성 {spaces.filter((s) => s.isActive).length}개</span>
            <span>•</span>
            <span>검색 결과 {filteredSpaces.length}개</span>
          </div>

          {/* Spaces Grid */}
          {filteredSpaces.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all'
                  ? '검색 결과가 없습니다'
                  : '등록된 장소가 없습니다'}
              </p>
              <Button
                variant="outline"
                className="mt-4 border-border"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Form Dialog */}
      <SpaceFormDialog
        space={editingSpace}
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingSpace(null);
        }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">장소 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              이 장소를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
