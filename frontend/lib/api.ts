// API client for the Spring Boot backend (http://localhost:8080)

const BASE_URL = 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth / Users ─────────────────────────────────────────────────────────────

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  display: string;
  createdAt: string;
};

export type AuthResponse = { success: boolean; message: string; user?: UserDTO };

export const apiLogin = (email: string, password: string) =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const apiRegister = (name: string, email: string, password: string, isAdmin = false) =>
  request<AuthResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, isAdmin: String(isAdmin) }),
  });

export const apiGetAllUsers = () => request<UserDTO[]>('/users');

export const apiGetUser = (id: string) => request<UserDTO>(`/users/${id}`);

export const apiUpdateUser = (id: string, data: { name?: string; email?: string; password?: string }) =>
  request<{ success: boolean; user: UserDTO }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDeleteUser = (id: string) =>
  request<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' });

// ─── Tables ───────────────────────────────────────────────────────────────────

export type TableDTO = {
  id: string;
  tableNumber: number;
  capacity: number;
  status: string;
  location: string;
  type: string;
  displayName: string;
  amenities?: string;
  minimumSpend?: number;
};

export const apiGetAllTables = () => request<TableDTO[]>('/tables');

export const apiGetAvailableTables = () => request<TableDTO[]>('/tables/available');

export const apiGetTable = (id: string) => request<TableDTO>(`/tables/${id}`);

export const apiAddTable = (data: {
  tableNumber: number;
  capacity: number;
  location: string;
  isVip?: boolean;
  amenities?: string;
  minimumSpend?: number;
}) =>
  request<{ success: boolean; table: TableDTO }>('/tables', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpdateTable = (id: string, data: { capacity?: number; location?: string; status?: string }) =>
  request<{ success: boolean; table: TableDTO }>(`/tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDeleteTable = (id: string) =>
  request<{ success: boolean }>(`/tables/${id}`, { method: 'DELETE' });

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type MenuItemDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
};

export const apiGetAllMenuItems = () => request<MenuItemDTO[]>('/menu');

export const apiGetMenuGrouped = () => request<Record<string, MenuItemDTO[]>>('/menu/grouped');

export const apiGetMenuItem = (id: string) => request<MenuItemDTO>(`/menu/${id}`);

export const apiAddMenuItem = (data: {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}) =>
  request<{ success: boolean; menuItem: MenuItemDTO }>('/menu', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpdateMenuItem = (id: string, data: { name?: string; description?: string; price?: number; available?: boolean }) =>
  request<{ success: boolean; menuItem: MenuItemDTO }>(`/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDeleteMenuItem = (id: string) =>
  request<{ success: boolean }>(`/menu/${id}`, { method: 'DELETE' });

// ─── Reservations ─────────────────────────────────────────────────────────────

export type ReservationDTO = {
  id: string;
  userId: string;
  userName: string;
  tableId: string;
  tableNumber: number;
  date: string;
  time: string;
  partySize: number;
  status: string;
  specialRequests: string;
};

export const apiGetAllReservations = () => request<ReservationDTO[]>('/reservations');

export const apiGetReservation = (id: string) => request<ReservationDTO>(`/reservations/${id}`);

export const apiGetUserReservations = (userId: string) =>
  request<ReservationDTO[]>(`/reservations/user/${userId}`);

export const apiCheckAvailability = (tableId: string, date: string, time: string) =>
  request<{ available: boolean }>(
    `/reservations/available?tableId=${encodeURIComponent(tableId)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`
  );

export const apiCreateReservation = (data: {
  userId: string;
  userName: string;
  tableId: string;
  tableNumber: number;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}) =>
  request<{ success: boolean; reservation: ReservationDTO }>('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpdateReservation = (id: string, data: { date?: string; time?: string; partySize?: number; specialRequests?: string }) =>
  request<{ success: boolean; reservation: ReservationDTO }>(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiConfirmReservation = (id: string) =>
  request<ReservationDTO>(`/reservations/${id}/confirm`, { method: 'PUT' });

export const apiCancelReservation = (id: string) =>
  request<ReservationDTO>(`/reservations/${id}/cancel`, { method: 'PUT' });

export const apiCompleteReservation = (id: string) =>
  request<ReservationDTO>(`/reservations/${id}/complete`, { method: 'PUT' });

export const apiDeleteReservation = (id: string) =>
  request<{ success: boolean }>(`/reservations/${id}`, { method: 'DELETE' });

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderDTO = {
  id: string;
  userId: string;
  userName: string;
  reservationId: string;
  orderType: string;
  itemsSummary: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export const apiGetAllOrders = () => request<OrderDTO[]>('/orders');

export const apiGetOrder = (id: string) => request<OrderDTO>(`/orders/${id}`);

export const apiGetUserOrders = (userId: string) => request<OrderDTO[]>(`/orders/user/${userId}`);

export const apiCreateOrder = (data: {
  userId: string;
  userName: string;
  reservationId?: string | null;
  orderType?: string;
  items: { menuItemId: string; menuItemName: string; quantity: number; price: number }[];
}) =>
  request<{ success: boolean; order: OrderDTO }>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpdateOrderStatus = (id: string, status: string) =>
  request<{ success: boolean; order: OrderDTO }>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const apiDeleteOrder = (id: string) =>
  request<{ success: boolean }>(`/orders/${id}`, { method: 'DELETE' });

// ─── Reviews ──────────────────────────────────────────────────────────────────

export type ReviewDTO = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  reservationId: string;
  reviewType: string;
  displayFormat: string;
  createdAt: string;
};

export const apiGetAllReviews = () => request<ReviewDTO[]>('/reviews');

export const apiGetReview = (id: string) => request<ReviewDTO>(`/reviews/${id}`);

export const apiGetUserReviews = (userId: string) => request<ReviewDTO[]>(`/reviews/user/${userId}`);

export const apiGetAverageRating = () => request<{ averageRating: number }>('/reviews/average-rating');

export const apiCreateReview = (data: {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  reservationId?: string | null;
}) =>
  request<{ success: boolean; review: ReviewDTO }>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpdateReview = (id: string, data: { rating?: number; comment?: string }) =>
  request<{ success: boolean; review: ReviewDTO }>(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDeleteReview = (id: string) =>
  request<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' });