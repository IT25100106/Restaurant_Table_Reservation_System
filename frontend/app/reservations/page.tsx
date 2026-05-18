'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast-notification';
import {
  getAllTables,
  checkTableAvailability,
  createReservation,
  getUserReservations,
  cancelReservation,
  updateReservation,
} from '@/lib/storage';
import type { TableDTO, ReservationDTO } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Award,
  Plus,
  X,
  Edit,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

export default function ReservationsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [tables, setTables] = useState<TableDTO[]>([]);
  const [userReservations, setUserReservations] = useState<ReservationDTO[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableDTO | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState<ReservationDTO | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const allTables = await getAllTables();
    setTables(allTables);

    if (user) {
      const reservations = await getUserReservations(user.id);
      setUserReservations(reservations);
    }

    setIsLoading(false);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isTableAvailable = (tableId: string) => {
    if (!date || !time) return true;
    return true; // availability checked on submit
  };

  const handleSelectTable = (table: TableDTO) => {
    if (!user) {
      showToast('Please login to make a reservation', 'error');
      router.push('/login');
      return;
    }
    setSelectedTable(table);
    setIsDialogOpen(true);
  };

  const handleSubmitReservation = async () => {
    if (!user || !selectedTable) return;

    if (!date) {
      showToast('Please select a date', 'error');
      return;
    }

    if (!time) {
      showToast('Please select a time', 'error');
      return;
    }

    if (partySize < 1 || partySize > selectedTable.capacity) {
      showToast(`Party size must be between 1 and ${selectedTable.capacity}`, 'error');
      return;
    }

    const available = await checkTableAvailability(selectedTable.id, date, time);
    if (!available) {
      showToast('This table is not available at the selected time', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReservation(
        user.id,
        user.name,
        selectedTable.id,
        selectedTable.tableNumber,
        date,
        time,
        partySize,
        specialRequests
      );

      if (result.success) {
        showToast('Reservation created successfully!', 'success');
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        showToast(result.message, 'error');
      }
    } catch {
      showToast('Failed to create reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const result = await cancelReservation(reservationId);
    if (result.success) {
      showToast('Reservation cancelled', 'success');
      loadData();
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleUpdateReservation = async () => {
    if (!editingReservation) return;

    if (!date || !time) {
      showToast('Please select date and time', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateReservation(editingReservation.id, {
        date,
        time,
        partySize,
        specialRequests,
      });

      if (result.success) {
        showToast('Reservation updated successfully!', 'success');
        setEditingReservation(null);
        resetForm();
        loadData();
      } else {
        showToast(result.message, 'error');
      }
    } catch {
      showToast('Failed to update reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setDate(reservation.date);
    setTime(reservation.time);
    setPartySize(reservation.partySize);
    setSpecialRequests(reservation.specialRequests);
  };

  const resetForm = () => {
    setSelectedTable(null);
    setDate('');
    setTime('');
    setPartySize(2);
    setSpecialRequests('');
    setEditingReservation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
        <p className="mt-2 text-muted-foreground">
          Book your perfect table for an unforgettable dining experience
        </p>
      </div>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="book">Book a Table</TabsTrigger>
          {user && <TabsTrigger value="my-reservations">My Reservations</TabsTrigger>}
        </TabsList>

        <TabsContent value="book">
          {/* Date & Time Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                Choose when you would like to dine with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getMinDate()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="partySize">Party Size</Label>
                  <Select
                    value={partySize.toString()}
                    onValueChange={(v) => setPartySize(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Tables */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Available Tables</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-vip" />
                <span>VIP</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              const isVip = table.type === 'vip';
              const available = isTableAvailable(table.id);
              const fitsParty = table.capacity >= partySize;

              return (
                <Card
                  key={table.id}
                  className={cn(
                    'relative overflow-hidden transition-all',
                    isVip && 'border-vip/50',
                    !available && 'opacity-60'
                  )}
                >
                  {isVip && (
                    <div className="absolute right-0 top-0">
                      <Badge className="rounded-none rounded-bl-lg bg-vip text-vip-foreground">
                        <Award className="mr-1 h-3 w-3" />
                        VIP
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {table.displayName}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Seats up to {table.capacity} guests
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {table.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isVip && table.type === 'vip' && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          Amenities:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(table.amenities ? table.amenities.split(', ') : []).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Minimum spend: ${table.minimumSpend}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={cn(
                          available
                            ? 'bg-success text-success-foreground'
                            : 'bg-destructive text-destructive-foreground'
                        )}
                      >
                        {available ? 'Available' : 'Reserved'}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleSelectTable(table)}
                        disabled={!available || !fitsParty}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Book
                      </Button>
                    </div>
                    {!fitsParty && partySize > 0 && (
                      <p className="mt-2 text-sm text-destructive">
                        Table too small for your party
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {user && (
          <TabsContent value="my-reservations">
            {userReservations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CalendarDays className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h2 className="text-xl font-semibold text-foreground">No Reservations</h2>
                  <p className="mt-2 text-muted-foreground">
                    {"You haven't made any reservations yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {userReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            Table {reservation.tableNumber}
                          </h3>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(reservation.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {reservation.partySize} guests
                          </span>
                        </div>
                        {reservation.specialRequests && (
                          <p className="text-sm text-muted-foreground">
                            Note: {reservation.specialRequests}
                          </p>
                        )}
                      </div>

                      {reservation.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditReservation(reservation)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Book {selectedTable?.displayName}
            </DialogTitle>
            <DialogDescription>
              Complete your reservation details
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{date ? new Date(date).toLocaleDateString() : 'Select date'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{time || 'Select time'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{partySize} guests</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedTable?.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                placeholder="Any dietary requirements or special occasions?"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmitReservation} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Reservation
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={!!editingReservation} onOpenChange={() => setEditingReservation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              Update your reservation details
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="editDate">Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={getMinDate()}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="editTime">Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editPartySize">Party Size</Label>
              <Select
                value={partySize.toString()}
                onValueChange={(v) => setPartySize(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} {size === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editSpecialRequests">Special Requests</Label>
              <Textarea
                id="editSpecialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingReservation(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdateReservation}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
