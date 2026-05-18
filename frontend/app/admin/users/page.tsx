'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-notification';
import { apiGetAllUsers, apiDeleteUser, apiRegister, apiUpdateUser, type UserDTO } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Trash2, Shield, UserIcon, Search, Pencil } from 'lucide-react';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filtered, setFiltered] = useState<UserDTO[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserDTO | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    setFiltered(search ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users);
  }, [search, users]);

  const load = async () => { setLoading(true); setUsers(await apiGetAllUsers()); setLoading(false); };

  const openCreate = () => { setEditing(null); setName(''); setEmail(''); setPassword(''); setIsAdmin(false); setOpen(true); };
  const openEdit = (u: UserDTO) => { setEditing(u); setName(u.name); setEmail(u.email); setPassword(''); setIsAdmin(u.role === 'admin'); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  const handleSubmit = async () => {
    if (!name || !email) { showToast('Name and email required', 'error'); return; }
    if (!editing && password.length < 6) { showToast('Password min 6 characters', 'error'); return; }
    setSubmitting(true);
    try {
      if (editing) {
        const upd: any = {};
        if (name !== editing.name) upd.name = name;
        if (email !== editing.email) upd.email = email;
        if (password) upd.password = password;
        const r = await apiUpdateUser(editing.id, upd);
        if (r.success) { showToast('User updated!', 'success'); close(); load(); }
        else showToast(r.message ?? 'Failed', 'error');
      } else {
        const r = await apiRegister(name, email, password, isAdmin);
        if (r.success) { showToast('User created!', 'success'); close(); load(); }
        else showToast(r.message ?? 'Failed', 'error');
      }
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, n: string) => {
    if (!confirm(`Delete "${n}"?`)) return;
    const r = await apiDeleteUser(id);
    if (r.success) { showToast('Deleted', 'success'); load(); }
    else showToast(r.message ?? 'Failed', 'error');
  };

  if (loading) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Users</h1><p className="mt-1 text-muted-foreground">Manage user accounts</p></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add User</Button>
      </div>

      <Dialog open={open} onOpenChange={o => { if (!o) close(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>{editing ? 'Update details. Leave password blank to keep current.' : 'Add a new account.'}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2"><Label>Full Name</Label><Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Email</Label><Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>{editing ? 'New Password (optional)' : 'Password'}</Label><Input type="password" placeholder={editing ? 'Leave blank to keep' : 'Min 6 characters'} value={password} onChange={e => setPassword(e.target.value)} /></div>
            {!editing && <div className="flex items-center gap-2"><Checkbox checked={isAdmin} onCheckedChange={c => setIsAdmin(c as boolean)} /><Label>Create as Administrator</Label></div>}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={close}>Cancel</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>{submitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mb-6"><CardContent className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div></CardContent></Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />All Users ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? <div className="flex flex-col items-center py-8"><Users className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No users found</p></div> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id}>
                      <TableCell><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">{u.role === 'admin' ? <Shield className="h-5 w-5 text-primary" /> : <UserIcon className="h-5 w-5 text-primary" />}</div><span className="font-medium">{u.name}</span></div></TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge></TableCell>
                      <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id, u.name)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
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
