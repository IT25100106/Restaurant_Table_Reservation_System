'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-notification';
import { getAllTables, addTable, updateTable, deleteTable } from '@/lib/storage';
import type { TableDTO } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UtensilsCrossed, Plus, Trash2, Edit, MapPin, Users, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminTablesPage() {
  const { showToast } = useToast();
  const [tables, setTables] = useState<TableDTO[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableDTO | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'available' | 'reserved' | 'occupied'>('available');
  const [isVip, setIsVip] = useState(false);
  const [amenities, setAmenities] = useState('');
  const [minimumSpend, setMinimumSpend] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const allTables = await getAllTables();
    setTables(allTables);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!tableNumber || !location) {
      showToast('Table number and location are required', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingTable) {
        const result = await updateTable(editingTable.id, {
          capacity: parseInt(capacity),
          location,
          status,
        });

        if (result.success) {
          showToast('Table updated successfully!', 'success');
          setIsDialogOpen(false);
          resetForm();
          loadTables();
        } else {
          showToast(result.message, 'error');
        }
      } else {
        const result = await addTable(
          parseInt(tableNumber),
          parseInt(capacity),
          location,
          isVip,
          isVip ? amenities.split(',').map((a) => a.trim()).filter(Boolean) : undefined,
          isVip ? parseInt(minimumSpend) : undefined
        );

        if (result.success) {
          showToast('Table added successfully!', 'success');
          setIsDialogOpen(false);
          resetForm();
          loadTables();
        } else {
          showToast(result.message, 'error');
        }
      }
    } catch {
      showToast('Failed to save table', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tableId: string, tableNum: number) => {
    if (window.confirm(`Are you sure you want to delete Table ${tableNum}?`)) {
      const result = await deleteTable(tableId);
      if (result.success) {
        showToast('Table deleted', 'success');
        loadTables();
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  const startEdit = (table: TableDTO) => {
    setEditingTable(table);
    setTableNumber(table.tableNumber.toString());
    setCapacity(table.capacity.toString());
    setLocation(table.location);
    setStatus(table.status);
    setIsVip(table.type === 'vip');
    if (table.type === 'vip') {
      setAmenities(table.amenities || '');
      setMinimumSpend(table.minimumSpend.toString());
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTable(null);
    setTableNumber('');
    setCapacity('2');
    setLocation('');
    setStatus('available');
    setIsVip(false);
    setAmenities('');
    setMinimumSpend('0');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'reserved':
        return 'bg-warning text-warning-foreground';
      case 'occupied':
        return 'bg-destructive text-destructive-foreground';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Table Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage restaurant tables and their availability
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
              <DialogDescription>
                {editingTable ? 'Update table details' : 'Create a new table for reservations'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {!editingTable && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input
                    id="tableNumber"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 4, 6, 8, 10, 12].map((c) => (
                      <SelectItem key={c} value={c.toString()}>
                        {c} guests
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Window, Patio, Private Room"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              {editingTable && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!editingTable && (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isVip"
                      checked={isVip}
                      onCheckedChange={(checked) => setIsVip(checked as boolean)}
                    />
                    <Label htmlFor="isVip" className="cursor-pointer">
                      VIP Table
                    </Label>
                  </div>
                  {isVip && (
                    <>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input
                          id="amenities"
                          placeholder="Premium Service, Champagne, City View"
                          value={amenities}
                          onChange={(e) => setAmenities(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="minimumSpend">Minimum Spend ($)</Label>
                        <Input
                          id="minimumSpend"
                          type="number"
                          min="0"
                          placeholder="200"
                          value={minimumSpend}
                          onChange={(e) => setMinimumSpend(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : editingTable ? (
                  'Update Table'
                ) : (
                  'Add Table'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => {
          const isVipTable = table.type === 'vip';
          return (
            <Card
              key={table.id}
              className={cn(
                'relative overflow-hidden',
                isVipTable && 'border-vip/50'
              )}
            >
              {isVipTable && (
                <div className="absolute right-0 top-0">
                  <Badge className="rounded-none rounded-bl-lg bg-vip text-vip-foreground">
                    <Award className="mr-1 h-3 w-3" />
                    VIP
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{table.displayName}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Seats {table.capacity} guests
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {table.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isVipTable && table.type === 'vip' && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(table.amenities ? table.amenities.split(', ') : []).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Min. spend: ${table.minimumSpend}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(table)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(table.id, table.tableNumber)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tables.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UtensilsCrossed className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">No Tables</h2>
            <p className="mt-2 text-muted-foreground">
              Add your first table to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
