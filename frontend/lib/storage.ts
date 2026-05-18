'use client';

/**
 * storage.ts — now backed by the Spring Boot REST API.
 *
 * All functions keep the same signatures they had before so the
 * rest of the codebase (pages, components) needs zero changes.
 *
 * sessionStorage is only used to remember the logged-in user
 * between page navigations (no sensitive data is persisted).
 */

import {
  apiLogin,
  apiRegister,
  apiGetAllUsers,
  apiGetUser,
  apiUpdateUser,
  apiDeleteUser,
  apiGetAllTables,
  apiGetAvailableTables,
  apiGetTable,
  apiAddTable,
  apiUpdateTable,
  apiDeleteTable,
  apiGetAllMenuItems,
  apiGetMenuGrouped,
  apiGetMenuItem,
  apiAddMenuItem,
  apiUpdateMenuItem,
  apiDeleteMenuItem,
  apiGetAllReservations,
  apiGetReservation,
  apiGetUserReservations,
  apiCheckAvailability,
  apiCreateReservation,
  apiUpdateReservation,
  apiCancelReservation,
  apiConfirmReservation,
  apiCompleteReservation,
  apiDeleteReservation,
  apiCreateOrder,
  apiGetAllOrders,
  apiGetOrder,
  apiGetUserOrders,
  apiUpdateOrderStatus,
  apiDeleteOrder,
  apiGetAllReviews,
  apiGetReview,
  apiGetUserReviews,
  apiGetAverageRating,
  apiCreateReview,
  apiUpdateReview,
  apiDeleteReview,
  type UserDTO,
  type TableDTO,
  type MenuItemDTO,
  type ReservationDTO,
  type OrderDTO,
  type ReviewDTO,
} from './api';

// ─── Session helpers ──────────────────────────────────────────────────────────

const SESSION_KEY = 'restaurant_current_user';

function saveSession(user: UserDTO): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): UserDTO | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserDTO) : null;
  } catch {
    return null;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: UserDTO }> {
  try {
    const res = await apiLogin(email, password);
    if (res.success && res.user) saveSession(res.user);
    return res;
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  isAdmin = false
): Promise<{ success: boolean; message: string; user?: UserDTO }> {
  try {
    const res = await apiRegister(name, email, password, isAdmin);
    return res;
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export function logoutUser(): void {
  clearSession();
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserDTO[]> {
  try { return await apiGetAllUsers(); } catch { return []; }
}

export async function getUserById(id: string): Promise<UserDTO | null> {
  try { return await apiGetUser(id); } catch { return null; }
}

export async function updateUser(
  id: string,
  updates: { name?: string; email?: string; password?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiUpdateUser(id, updates);
    const current = getCurrentUser();
    if (current && current.id === id && res.user) saveSession(res.user);
    return { success: true, message: 'User updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteUser(id);
    return { success: true, message: 'User deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export async function getAllTables(): Promise<TableDTO[]> {
  try { return await apiGetAllTables(); } catch { return []; }
}

export async function getAvailableTables(): Promise<TableDTO[]> {
  try { return await apiGetAvailableTables(); } catch { return []; }
}

export async function getTableById(id: string): Promise<TableDTO | null> {
  try { return await apiGetTable(id); } catch { return null; }
}

export async function addTable(
  tableNumber: number,
  capacity: number,
  location: string,
  isVip = false,
  amenities?: string[],
  minimumSpend?: number
): Promise<{ success: boolean; message: string; table?: TableDTO }> {
  try {
    const res = await apiAddTable({
      tableNumber, capacity, location, isVip,
      amenities: amenities?.join(', '),
      minimumSpend,
    });
    return { success: true, message: 'Table added successfully', table: res.table };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function updateTable(
  id: string,
  updates: { capacity?: number; location?: string; status?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    await apiUpdateTable(id, updates);
    return { success: true, message: 'Table updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function deleteTable(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteTable(id);
    return { success: true, message: 'Table deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export async function getAllMenuItems(): Promise<MenuItemDTO[]> {
  try { return await apiGetAllMenuItems(); } catch { return []; }
}

export async function getMenuItemById(id: string): Promise<MenuItemDTO | null> {
  try { return await apiGetMenuItem(id); } catch { return null; }
}

export async function getMenuByCategory(): Promise<Record<string, MenuItemDTO[]>> {
  try { return await apiGetMenuGrouped(); } catch { return {}; }
}

export async function addMenuItem(
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl = ''
): Promise<{ success: boolean; message: string; menuItem?: MenuItemDTO }> {
  try {
    const res = await apiAddMenuItem({ name, description, price, category, imageUrl });
    return { success: true, message: 'Menu item added successfully', menuItem: res.menuItem };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function updateMenuItem(
  id: string,
  updates: { name?: string; description?: string; price?: number; available?: boolean }
): Promise<{ success: boolean; message: string }> {
  try {
    await apiUpdateMenuItem(id, updates);
    return { success: true, message: 'Menu item updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteMenuItem(id);
    return { success: true, message: 'Menu item deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export async function getAllReservations(): Promise<ReservationDTO[]> {
  try { return await apiGetAllReservations(); } catch { return []; }
}

export async function getReservationById(id: string): Promise<ReservationDTO | null> {
  try { return await apiGetReservation(id); } catch { return null; }
}

export async function getUserReservations(userId: string): Promise<ReservationDTO[]> {
  try { return await apiGetUserReservations(userId); } catch { return []; }
}

export async function checkTableAvailability(tableId: string, date: string, time: string): Promise<boolean> {
  try {
    const res = await apiCheckAvailability(tableId, date, time);
    return res.available;
  } catch { return false; }
}

export async function createReservation(
  userId: string, userName: string, tableId: string, tableNumber: number,
  date: string, time: string, partySize: number, specialRequests = ''
): Promise<{ success: boolean; message: string; reservation?: ReservationDTO }> {
  try {
    const res = await apiCreateReservation({ userId, userName, tableId, tableNumber, date, time, partySize, specialRequests });
    return { success: true, message: 'Reservation created successfully', reservation: res.reservation };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function updateReservation(
  id: string,
  updates: { date?: string; time?: string; partySize?: number; specialRequests?: string; status?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    if (updates.status === 'cancelled') {
      await apiCancelReservation(id);
    } else if (updates.status === 'confirmed') {
      await apiConfirmReservation(id);
    } else if (updates.status === 'completed') {
      await apiCompleteReservation(id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status: _s, ...rest } = updates;
      if (Object.keys(rest).length) await apiUpdateReservation(id, rest);
    }
    return { success: true, message: 'Reservation updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function cancelReservation(id: string): Promise<{ success: boolean; message: string }> {
  return updateReservation(id, { status: 'cancelled' });
}

export async function deleteReservation(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteReservation(id);
    return { success: true, message: 'Reservation deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getAllOrders(): Promise<OrderDTO[]> {
  try { return await apiGetAllOrders(); } catch { return []; }
}

export async function getOrderById(id: string): Promise<OrderDTO | null> {
  try { return await apiGetOrder(id); } catch { return null; }
}

export async function getUserOrders(userId: string): Promise<OrderDTO[]> {
  try { return await apiGetUserOrders(userId); } catch { return []; }
}

export async function createOrder(
  userId: string,
  userName: string,
  items: { menuItemId: string; menuItemName: string; quantity: number; price: number }[],
  reservationId: string | null = null
): Promise<{ success: boolean; message: string; order?: OrderDTO }> {
  try {
    const res = await apiCreateOrder({ userId, userName, reservationId, items });
    return { success: true, message: 'Order created successfully', order: res.order };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiUpdateOrderStatus(id, status);
    return { success: true, message: 'Order status updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteOrder(id);
    return { success: true, message: 'Order deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getAllReviews(): Promise<ReviewDTO[]> {
  try { return await apiGetAllReviews(); } catch { return []; }
}

export async function getReviewById(id: string): Promise<ReviewDTO | null> {
  try { return await apiGetReview(id); } catch { return null; }
}

export async function getUserReviews(userId: string): Promise<ReviewDTO[]> {
  try { return await apiGetUserReviews(userId); } catch { return []; }
}

export async function createReview(
  userId: string, userName: string, rating: number, comment: string, reservationId: string | null = null
): Promise<{ success: boolean; message: string; review?: ReviewDTO }> {
  try {
    const res = await apiCreateReview({ userId, userName, rating, comment, reservationId });
    return { success: true, message: 'Review submitted successfully', review: res.review };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function updateReview(
  id: string, updates: { rating?: number; comment?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    await apiUpdateReview(id, updates);
    return { success: true, message: 'Review updated successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function deleteReview(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiDeleteReview(id);
    return { success: true, message: 'Review deleted successfully' };
  } catch (e: unknown) {
    return { success: false, message: (e as Error).message };
  }
}

export async function getAverageRating(): Promise<number> {
  try {
    const res = await apiGetAverageRating();
    return res.averageRating;
  } catch { return 0; }
}

// ─── No-op kept for backwards-compat ─────────────────────────────────────────

export function initializeData(): void {
  // The Spring Boot backend manages its own data — nothing to do here.
}
