'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-notification';
import { apiGetAllReservations, apiUpdateReservation, apiCancelReservation, apiConfirmReservation, apiCompleteReservation, apiDeleteReservation, type ApiReservation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Clock, Users, Search, Check, X, Filter, Trash2, Pencil } from 'lucide-react';

export default function AdminReservationsPage() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [filtered, setFiltered] = useState<ApiReservation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiReservation | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editParty, setEditParty] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    let f = [...reservations];
    if (search) f = f.filter(r => r.userName.toLowerCase().includes(search.toLowerCase()) || r.tableNumber.toString().includes(search));
    if (statusFilter !== 'all') f = f.filter(r => r.status === statusFilter);
    setFiltered(f);
  }, [search, statusFilter, reservations]);

  const load = async () => { setLoading(true); const d = await apiGetAllReservations(); setReservations(d); setFiltered(d); setLoading(false); };

  const openEdit = (r: ApiReservation) => { setEditing(r); setEditDate(r.date); setEditTime(r.time); setEditParty(r.partySize.toString()); setEditNotes(r.specialRequests ?? ''); };

  const handleEdit = async () => {
    if (!editing) return;
    setSubmitting(true);
    try {
      const r = await apiUpdateReservation(editing.id, { date: editDate, time: editTime, partySize: parseInt(editParty), specialRequests: editNotes });
      if (r.success) { showToast('Updated!', 'success'); setEditing(null); load(); }
      else showToast(r.message ?? 'Failed', 'error');
    } finally { setSubmitting(false); }
  };

  const confirm = async (id: string) => { const r = await apiConfirmReservation(id); if (r.success) { showToast('Confirmed', 'success'); load(); } else showToast(r.message ?? 'Failed', 'error'); };
  const complete = async (id: string) => { const r = await apiCompleteReservation(id); if (r.success) { showToast('Completed', 'success'); load(); } else showToast(r.message ?? 'Failed', 'error'); };
  const cancel = async (id: string) => { if (!window.confirm('Cancel this reservation?')) return; const r = await apiCancelReservation(id); if (r.success) { showToast('Cancelled', 'success'); load(); } else showToast(r.message ?? 'Failed', 'error'); };
  const del = async (id: string) => { if (!window.confirm('Delete permanently?')) return; const r = await apiDeleteReservation(id); if (r.success) { showToast('Deleted', 'success'); load(); } else showToast(r.message ?? 'Failed', 'error'); };

  const statusColor = (s: string) => s === 'confirmed' ? 'bg-success text-success-foreground' : s === 'pending' ? 'bg-warning text-warning-foreground' : s === 'cancelled' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground';

  if (loading) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-3xl font-bold">Reservations</h1><p className="mt-1 text-muted-foreground">Manage all table reservations</p></div>

      <Dialog open={!!editing} onOpenChange={o => { if (!o) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Reservation</DialogTitle><DialogDescription>Update for {editing?.userName}</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Time</Label><Input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Party Size</Label><Input type="number" min="1" value={editParty} onChange={e => setEditParty(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Special Requests</Label><Input placeholder="Any requests..." value={editNotes} onChange={e => setEditNotes(e.target.value)} /></div>
            <div className="flex gap-2 pt-2"><Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button><Button className="flex-1" onClick={handleEdit} disabled={submitting}>{submitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : 'Update'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mb-6"><CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by name or table..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div>
      </CardContent></Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Reservations ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? <div className="flex flex-col items-center py-8"><CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No reservations found</p></div> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Table</TableHead><TableHead>Date & Time</TableHead><TableHead>Party</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.userName}</TableCell>
                      <TableCell>Table {r.tableNumber}</TableCell>
                      <TableCell><div className="flex flex-col"><span className="flex items-center gap-1 text-sm"><CalendarDays className="h-3 w-3" />{r.date}</span><span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3 w-3" />{r.time}</span></div></TableCell>
                      <TableCell><span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.partySize}</span></TableCell>
                      <TableCell><Badge className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                      <TableCell className="max-w-[120px] truncate text-sm text-muted-foreground">{r.specialRequests || '-'}</TableCell>
                      <TableCell className="text-right"><div className="flex justify-end gap-1 flex-wrap">
                        {r.status === 'pending' && <><Button variant="ghost" size="sm" className="text-success hover:bg-success/10" onClick={() => confirm(r.id)}><Check className="mr-1 h-3 w-3" />Confirm</Button><Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => cancel(r.id)}><X className="mr-1 h-3 w-3" />Cancel</Button></>}
                        {r.status === 'confirmed' && <Button variant="ghost" size="sm" onClick={() => complete(r.id)}><Check className="mr-1 h-3 w-3" />Complete</Button>}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
