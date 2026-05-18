'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  getAllUsers,
  getAllTables,
  getAllReservations,
  getAllOrders,
  getAllReviews,
  getAverageRating,
} from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UtensilsCrossed,
  CalendarDays,
  ShoppingCart,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTables: 0,
    availableTables: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [recentReservations, setRecentReservations] = useState<{ tableNumber: number; userName: string; date: string; time: string; status: string }[]>([]);
  const [recentOrders, setRecentOrders] = useState<{ id: string; userName: string; totalPrice: number; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const users = await getAllUsers();
    const tables = await getAllTables();
    const reservations = await getAllReservations();
    const orders = await getAllOrders();
    const reviews = await getAllReviews();
    const avgRating = await getAverageRating();
    setStats({
      totalUsers: users.length,
      totalTables: tables.length,
      availableTables: tables.filter((t) => t.status === 'available').length,
      totalReservations: reservations.length,
      pendingReservations: reservations.filter((r) => r.status === 'pending').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
      totalReviews: reviews.length,
      averageRating: await getAverageRating(),
    });

    setRecentReservations(
      reservations
        .slice(-5)
        .reverse()
        .map((r) => ({
          tableNumber: r.tableNumber,
          userName: r.userName,
          date: r.date,
          time: r.time,
          status: r.status,
        }))
    );

    setRecentOrders(
      orders
        .slice(-5)
        .reverse()
        .map((o) => ({
          id: o.id,
          userName: o.userName,
          totalPrice: o.totalPrice,
          status: o.status,
        }))
    );

    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      href: '/admin/users',
    },
    {
      title: 'Tables',
      value: `${stats.availableTables}/${stats.totalTables}`,
      subtitle: 'Available',
      icon: UtensilsCrossed,
      color: 'bg-success/20 text-success',
      href: '/admin/tables',
    },
    {
      title: 'Reservations',
      value: stats.totalReservations,
      subtitle: `${stats.pendingReservations} pending`,
      icon: CalendarDays,
      color: 'bg-warning/20 text-warning',
      href: '/admin/reservations',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'bg-accent/20 text-accent',
      href: '/admin/orders',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-success/20 text-success',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating || 'N/A',
      subtitle: `${stats.totalReviews} reviews`,
      icon: Star,
      color: 'bg-warning/20 text-warning',
      href: '/admin/reviews',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
      case 'ready':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      case 'preparing':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.name}! {"Here's"} {"what's"} happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
              {stat.href && (
                <Link
                  href={stat.href}
                  className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reservations</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/reservations">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentReservations.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No reservations yet
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentReservations.map((reservation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div>
                      <p className="font-medium">{reservation.userName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Table {reservation.tableNumber}</span>
                        <span>|</span>
                        <span>{reservation.date}</span>
                        <span>{reservation.time}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest food orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No orders yet
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-primary">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
