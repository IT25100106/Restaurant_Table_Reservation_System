'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-notification';
import { apiGetAllMenuItems, apiAddMenuItem, apiUpdateMenuItem, apiDeleteMenuItem, type ApiMenuItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UtensilsCrossed, Plus, Trash2, Pencil, Search, Filter, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';

const CATS = ['Starters','Mains','Sides','Desserts','Drinks','Specials'];

export default function AdminMenuPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ApiMenuItem[]>([]);
  const [filtered, setFiltered] = useState<ApiMenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiMenuItem | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [cat, setCat] = useState(CATS[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    let f = [...items];
    if (search) f = f.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'all') f = f.filter(i => i.category === catFilter);
    setFiltered(f);
  }, [search, catFilter, items]);

  const load = async () => { setLoading(true); const d = await apiGetAllMenuItems(); setItems(d); setFiltered(d); setLoading(false); };
  const reset = () => { setEditing(null); setName(''); setDesc(''); setPrice(''); setCat(CATS[0]); setImageUrl(''); setAvailable(true); };

  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (i: ApiMenuItem) => { setEditing(i); setName(i.name); setDesc(i.description); setPrice(i.price.toString()); setCat(i.category); setImageUrl(i.imageUrl ?? ''); setAvailable(i.available); setOpen(true); };

  const handleSubmit = async () => {
    if (!name.trim()) { showToast('Name required', 'error'); return; }
    if (!price || isNaN(parseFloat(price))) { showToast('Valid price required', 'error'); return; }
    setSubmitting(true);
    try {
      if (editing) {
        const r = await apiUpdateMenuItem(editing.id, { name, description: desc, price: parseFloat(price), available });
        if (r.success) { showToast('Updated!', 'success'); setOpen(false); reset(); load(); }
        else showToast(r.message ?? 'Failed', 'error');
      } else {
        const r = await apiAddMenuItem({ name, description: desc, price: parseFloat(price), category: cat, imageUrl: imageUrl || undefined });
        if (r.success) { showToast('Added!', 'success'); setOpen(false); reset(); load(); }
        else showToast(r.message ?? 'Failed', 'error');
      }
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, n: string) => {
    if (!confirm(`Delete "${n}"?`)) return;
    const r = await apiDeleteMenuItem(id);
    if (r.success) { showToast('Deleted', 'success'); load(); }
    else showToast(r.message ?? 'Failed', 'error');
  };

  const toggleAvail = async (i: ApiMenuItem) => {
    const r = await apiUpdateMenuItem(i.id, { available: !i.available });
    if (r.success) { showToast(i.available ? 'Marked unavailable' : 'Marked available', 'success'); load(); }
    else showToast(r.message ?? 'Failed', 'error');
  };

  const allCats = Array.from(new Set([...CATS, ...items.map(i => i.category)]));

  if (loading) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Menu</h1><p className="mt-1 text-muted-foreground">Manage restaurant menu items</p></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
      </div>

      <Dialog open={open} onOpenChange={o => { if (!o) { setOpen(false); reset(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Item' : 'Add Menu Item'}</DialogTitle><DialogDescription>{editing ? 'Update item details' : 'Add a new menu item'}</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2"><Label>Name *</Label><Input placeholder="e.g. Grilled Salmon" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Description</Label><Input placeholder="Brief description" value={desc} onChange={e => setDesc(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2"><Label>Price ($) *</Label><Input type="number" min="0" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} /></div>
              <div className="flex flex-col gap-2"><Label>Category *</Label><Select value={cat} onValueChange={setCat} disabled={!!editing}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{allCats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="flex flex-col gap-2"><Label>Image URL (optional)</Label><Input placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
            {editing && <div className="flex items-center gap-2"><Checkbox checked={available} onCheckedChange={c => setAvailable(c as boolean)} /><Label>Available for ordering</Label></div>}
            <div className="flex gap-2 pt-2"><Button variant="outline" className="flex-1" onClick={() => { setOpen(false); reset(); }}>Cancel</Button><Button className="flex-1" onClick={handleSubmit} disabled={submitting}>{submitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : editing ? 'Update' : 'Add'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><UtensilsCrossed className="h-6 w-6 text-primary" /><div><p className="text-sm text-muted-foreground">Total Items</p><p className="text-xl font-bold">{items.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><ToggleRight className="h-6 w-6 text-success" /><div><p className="text-sm text-muted-foreground">Available</p><p className="text-xl font-bold">{items.filter(i => i.available).length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><DollarSign className="h-6 w-6 text-warning" /><div><p className="text-sm text-muted-foreground">Avg Price</p><p className="text-xl font-bold">{items.length > 0 ? `$${(items.reduce((s,i) => s+i.price,0)/items.length).toFixed(2)}` : '$0.00'}</p></div></CardContent></Card>
      </div>

      <Card className="mb-6"><CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><Select value={catFilter} onValueChange={setCatFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{allCats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
      </CardContent></Card>

      <Card>
        <CardHeader><CardTitle><UtensilsCrossed className="mr-2 inline h-5 w-5" />Menu Items ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? <div className="flex flex-col items-center py-8"><UtensilsCrossed className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No items found</p><Button className="mt-4" onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add First Item</Button></div> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map(i => (
                    <TableRow key={i.id}>
                      <TableCell><div><p className="font-medium">{i.name}</p>{i.description && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{i.description}</p>}</div></TableCell>
                      <TableCell><Badge variant="secondary">{i.category}</Badge></TableCell>
                      <TableCell className="font-medium text-primary">${i.price.toFixed(2)}</TableCell>
                      <TableCell><Badge className={i.available ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>{i.available ? 'Available' : 'Unavailable'}</Badge></TableCell>
                      <TableCell className="text-right"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleAvail(i)}>{i.available ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}</Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(i)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(i.id, i.name)}><Trash2 className="h-4 w-4" /></Button>
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
