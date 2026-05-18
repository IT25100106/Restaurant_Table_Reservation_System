// Base User class demonstrating encapsulation
export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdAt: Date;

  constructor(name: string, email: string, password: string, id?: string) {
    this._id = id || crypto.randomUUID();
    this._name = name;
    this._email = email;
    this._password = password;
    this._createdAt = new Date();
  }

  // Getters (encapsulation)
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get password(): string { return this._password; }
  get createdAt(): Date { return this._createdAt; }

  // Setters
  set name(value: string) { this._name = value; }
  set email(value: string) { this._email = value; }
  set password(value: string) { this._password = value; }

  // Polymorphism - method to be overridden
  getRole(): string {
    return 'user';
  }

  // Display method - polymorphism
  display(): string {
    return `${this._name} (${this._email})`;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      role: this.getRole(),
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: UserData): User {
    const user = new User(data.name, data.email, data.password, data.id);
    return user;
  }
}

// Admin class extending User (inheritance)
export class Admin extends User {
  private _permissions: string[];

  constructor(name: string, email: string, password: string, id?: string, permissions?: string[]) {
    super(name, email, password, id);
    this._permissions = permissions || ['manage_users', 'manage_tables', 'manage_reservations', 'manage_orders', 'manage_reviews'];
  }

  get permissions(): string[] { return this._permissions; }

  // Override - polymorphism
  getRole(): string {
    return 'admin';
  }

  // Override display - polymorphism
  display(): string {
    return `Admin: ${this.name} (${this.email})`;
  }

  hasPermission(permission: string): boolean {
    return this._permissions.includes(permission);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      permissions: this._permissions
    };
  }

  static fromJSON(data: AdminData): Admin {
    return new Admin(data.name, data.email, data.password, data.id, data.permissions);
  }
}

// Base Table class
export class Table {
  protected _id: string;
  protected _tableNumber: number;
  protected _capacity: number;
  protected _status: 'available' | 'reserved' | 'occupied';
  protected _location: string;

  constructor(tableNumber: number, capacity: number, location: string, id?: string) {
    this._id = id || crypto.randomUUID();
    this._tableNumber = tableNumber;
    this._capacity = capacity;
    this._status = 'available';
    this._location = location;
  }

  get id(): string { return this._id; }
  get tableNumber(): number { return this._tableNumber; }
  get capacity(): number { return this._capacity; }
  get status(): 'available' | 'reserved' | 'occupied' { return this._status; }
  get location(): string { return this._location; }

  set status(value: 'available' | 'reserved' | 'occupied') { this._status = value; }
  set capacity(value: number) { this._capacity = value; }
  set location(value: string) { this._location = value; }

  // Polymorphism
  getType(): string {
    return 'regular';
  }

  getDisplayName(): string {
    return `Table ${this._tableNumber}`;
  }

  toJSON() {
    return {
      id: this._id,
      tableNumber: this._tableNumber,
      capacity: this._capacity,
      status: this._status,
      location: this._location,
      type: this.getType()
    };
  }

  static fromJSON(data: TableData): Table {
    const table = new Table(data.tableNumber, data.capacity, data.location, data.id);
    table._status = data.status;
    return table;
  }
}

// VIPTable extending Table (inheritance)
export class VIPTable extends Table {
  private _amenities: string[];
  private _minimumSpend: number;

  constructor(tableNumber: number, capacity: number, location: string, amenities: string[], minimumSpend: number, id?: string) {
    super(tableNumber, capacity, location, id);
    this._amenities = amenities;
    this._minimumSpend = minimumSpend;
  }

  get amenities(): string[] { return this._amenities; }
  get minimumSpend(): number { return this._minimumSpend; }

  // Override - polymorphism
  getType(): string {
    return 'vip';
  }

  getDisplayName(): string {
    return `VIP Table ${this._tableNumber}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      amenities: this._amenities,
      minimumSpend: this._minimumSpend
    };
  }

  static fromJSON(data: VIPTableData): VIPTable {
    const table = new VIPTable(
      data.tableNumber,
      data.capacity,
      data.location,
      data.amenities,
      data.minimumSpend,
      data.id
    );
    table._status = data.status;
    return table;
  }
}

// Reservation class
export class Reservation {
  private _id: string;
  private _userId: string;
  private _userName: string;
  private _tableId: string;
  private _tableNumber: number;
  private _date: string;
  private _time: string;
  private _partySize: number;
  private _status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  private _specialRequests: string;
  private _createdAt: Date;

  constructor(
    userId: string,
    userName: string,
    tableId: string,
    tableNumber: number,
    date: string,
    time: string,
    partySize: number,
    specialRequests: string = '',
    id?: string
  ) {
    this._id = id || crypto.randomUUID();
    this._userId = userId;
    this._userName = userName;
    this._tableId = tableId;
    this._tableNumber = tableNumber;
    this._date = date;
    this._time = time;
    this._partySize = partySize;
    this._status = 'pending';
    this._specialRequests = specialRequests;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get userName(): string { return this._userName; }
  get tableId(): string { return this._tableId; }
  get tableNumber(): number { return this._tableNumber; }
  get date(): string { return this._date; }
  get time(): string { return this._time; }
  get partySize(): number { return this._partySize; }
  get status(): 'pending' | 'confirmed' | 'cancelled' | 'completed' { return this._status; }
  get specialRequests(): string { return this._specialRequests; }
  get createdAt(): Date { return this._createdAt; }

  set date(value: string) { this._date = value; }
  set time(value: string) { this._time = value; }
  set partySize(value: number) { this._partySize = value; }
  set status(value: 'pending' | 'confirmed' | 'cancelled' | 'completed') { this._status = value; }
  set specialRequests(value: string) { this._specialRequests = value; }

  confirm(): void {
    this._status = 'confirmed';
  }

  cancel(): void {
    this._status = 'cancelled';
  }

  complete(): void {
    this._status = 'completed';
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      userName: this._userName,
      tableId: this._tableId,
      tableNumber: this._tableNumber,
      date: this._date,
      time: this._time,
      partySize: this._partySize,
      status: this._status,
      specialRequests: this._specialRequests,
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: ReservationData): Reservation {
    const reservation = new Reservation(
      data.userId,
      data.userName,
      data.tableId,
      data.tableNumber,
      data.date,
      data.time,
      data.partySize,
      data.specialRequests,
      data.id
    );
    reservation._status = data.status;
    return reservation;
  }
}

// MenuItem class
export class MenuItem {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _category: string;
  private _image: string;
  private _available: boolean;

  constructor(
    name: string,
    description: string,
    price: number,
    category: string,
    image: string = '',
    id?: string
  ) {
    this._id = id || crypto.randomUUID();
    this._name = name;
    this._description = description;
    this._price = price;
    this._category = category;
    this._image = image;
    this._available = true;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get price(): number { return this._price; }
  get category(): string { return this._category; }
  get image(): string { return this._image; }
  get available(): boolean { return this._available; }

  set name(value: string) { this._name = value; }
  set description(value: string) { this._description = value; }
  set price(value: number) { this._price = value; }
  set available(value: boolean) { this._available = value; }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      category: this._category,
      image: this._image,
      available: this._available
    };
  }

  static fromJSON(data: MenuItemData): MenuItem {
    const item = new MenuItem(
      data.name,
      data.description,
      data.price,
      data.category,
      data.image,
      data.id
    );
    item._available = data.available;
    return item;
  }
}

// OrderItem class
export class OrderItem {
  private _menuItemId: string;
  private _menuItemName: string;
  private _quantity: number;
  private _price: number;

  constructor(menuItemId: string, menuItemName: string, quantity: number, price: number) {
    this._menuItemId = menuItemId;
    this._menuItemName = menuItemName;
    this._quantity = quantity;
    this._price = price;
  }

  get menuItemId(): string { return this._menuItemId; }
  get menuItemName(): string { return this._menuItemName; }
  get quantity(): number { return this._quantity; }
  get price(): number { return this._price; }
  get total(): number { return this._quantity * this._price; }

  set quantity(value: number) { this._quantity = value; }

  toJSON() {
    return {
      menuItemId: this._menuItemId,
      menuItemName: this._menuItemName,
      quantity: this._quantity,
      price: this._price
    };
  }
}

// Order class
export class Order {
  private _id: string;
  private _userId: string;
  private _userName: string;
  private _reservationId: string | null;
  private _items: OrderItem[];
  private _status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  private _createdAt: Date;

  constructor(
    userId: string,
    userName: string,
    items: OrderItem[],
    reservationId: string | null = null,
    id?: string
  ) {
    this._id = id || crypto.randomUUID();
    this._userId = userId;
    this._userName = userName;
    this._reservationId = reservationId;
    this._items = items;
    this._status = 'pending';
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get userName(): string { return this._userName; }
  get reservationId(): string | null { return this._reservationId; }
  get items(): OrderItem[] { return this._items; }
  get status(): 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  
  get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + item.total, 0);
  }

  set status(value: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled') { 
    this._status = value; 
  }

  addItem(item: OrderItem): void {
    this._items.push(item);
  }

  removeItem(menuItemId: string): void {
    this._items = this._items.filter(item => item.menuItemId !== menuItemId);
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      userName: this._userName,
      reservationId: this._reservationId,
      items: this._items.map(item => item.toJSON()),
      status: this._status,
      totalPrice: this.totalPrice,
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: OrderData): Order {
    const items = data.items.map(item => 
      new OrderItem(item.menuItemId, item.menuItemName, item.quantity, item.price)
    );
    const order = new Order(data.userId, data.userName, items, data.reservationId, data.id);
    order._status = data.status;
    return order;
  }
}

// Review class
export class Review {
  private _id: string;
  private _userId: string;
  private _userName: string;
  private _rating: number;
  private _comment: string;
  private _reservationId: string | null;
  private _createdAt: Date;

  constructor(
    userId: string,
    userName: string,
    rating: number,
    comment: string,
    reservationId: string | null = null,
    id?: string
  ) {
    this._id = id || crypto.randomUUID();
    this._userId = userId;
    this._userName = userName;
    this._rating = Math.min(5, Math.max(1, rating));
    this._comment = comment;
    this._reservationId = reservationId;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get userName(): string { return this._userName; }
  get rating(): number { return this._rating; }
  get comment(): string { return this._comment; }
  get reservationId(): string | null { return this._reservationId; }
  get createdAt(): Date { return this._createdAt; }

  set rating(value: number) { this._rating = Math.min(5, Math.max(1, value)); }
  set comment(value: string) { this._comment = value; }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      userName: this._userName,
      rating: this._rating,
      comment: this._comment,
      reservationId: this._reservationId,
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: ReviewData): Review {
    return new Review(
      data.userId,
      data.userName,
      data.rating,
      data.comment,
      data.reservationId,
      data.id
    );
  }
}

// Type definitions for JSON data
export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface AdminData extends UserData {
  permissions: string[];
}

export interface TableData {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
  location: string;
  type: string;
}

export interface VIPTableData extends TableData {
  amenities: string[];
  minimumSpend: number;
}

export interface ReservationData {
  id: string;
  userId: string;
  userName: string;
  tableId: string;
  tableNumber: number;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests: string;
  createdAt: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface OrderItemData {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  id: string;
  userId: string;
  userName: string;
  reservationId: string | null;
  items: OrderItemData[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  reservationId: string | null;
  createdAt: string;
}
