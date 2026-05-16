'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast-notification';
import { getUserOrders, deleteOrder } from '@/lib/storage';
import type { OrderDTO } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      loadOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    if (user) {
      const userOrders = await getUserOrders(user.id);
      setOrders(userOrders);
    }
    setIsLoading(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await deleteOrder(orderId);
    if (result.success) {
      showToast('Order deleted', 'success');
      loadOrders();
    } else {
      showToast(result.message, 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':   return 'bg-warning text-warning-foreground';
      case 'preparing': return 'bg-primary text-primary-foreground';
      case 'ready':     return 'bg-success text-success-foreground';
      case 'delivered': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return '';
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="mt-2 text-muted-foreground">View and manage your food orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">No Orders Yet</h2>
            <p className="mt-2 text-muted-foreground">{"You haven't placed any orders yet."}</p>
            <Button className="mt-4" onClick={() => router.push('/menu')}>Browse Menu</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{order.id.slice(0, 8)}
                      <Badge className={cn(getStatusColor(order.status))}>{order.status}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    {order.status === 'pending' && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium text-foreground">Order Items</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {order.itemsSummary || '—'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
