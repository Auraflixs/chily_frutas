// =============================================
// CHILY FRUTAS - BASE DE DATOS SIMULADA
// =============================================

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'Administrador' | 'Cajero';
  email: string;
  phone: string;
  status: 'Activo' | 'Inactivo';
  lastLogin: string;
  avatar: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  cost: number;
  category: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  description: string;
  ingredients: { ingredientId: number; quantity: number }[];
  image: string;
  status: 'Disponible' | 'Agotado' | 'Stock Bajo';
  dateAdded: string;
  unitsSold: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
  registeredDate: string;
}

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  invoiceNumber: string;
  date: string;
  time: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  amountReceived: number;
  change: number;
  cashierName: string;
  clientId?: number;
  clientName?: string;
  status: 'Completada' | 'Cancelada';
}

export interface AppConfig {
  theme: 'light' | 'dark';
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  taxRate: number;
  notifications: boolean;
  lowStockAlert: boolean;
  printReceipt: boolean;
  logo: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

// =============================================
// DATOS INICIALES
// =============================================

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Carlos Mendoza',
    role: 'Administrador',
    email: 'carlos@chilyfrutas.com',
    phone: '8888-1234',
    status: 'Activo',
    lastLogin: '2025-01-15 08:30:00',
    avatar: 'CM',
  },
  {
    id: 2,
    username: 'cajero1',
    password: 'cajero123',
    name: 'María González',
    role: 'Cajero',
    email: 'maria@chilyfrutas.com',
    phone: '8888-5678',
    status: 'Activo',
    lastLogin: '2025-01-15 07:45:00',
    avatar: 'MG',
  },
  {
    id: 3,
    username: 'cajero2',
    password: 'cajero456',
    name: 'Luis Herrera',
    role: 'Cajero',
    email: 'luis@chilyfrutas.com',
    phone: '8888-9012',
    status: 'Activo',
    lastLogin: '2025-01-14 16:20:00',
    avatar: 'LH',
  },
  {
    id: 4,
    username: 'ana.lopez',
    password: 'ana2025',
    name: 'Ana López',
    role: 'Cajero',
    email: 'ana@chilyfrutas.com',
    phone: '8877-3344',
    status: 'Inactivo',
    lastLogin: '2025-01-10 10:00:00',
    avatar: 'AL',
  },
];

export const initialIngredients: Ingredient[] = [
  { id: 1, name: 'Fresa', unit: 'lb', stock: 15, minStock: 5, cost: 45, category: 'Frutas' },
  { id: 2, name: 'Mango', unit: 'unidad', stock: 30, minStock: 10, cost: 12, category: 'Frutas' },
  { id: 3, name: 'Piña', unit: 'unidad', stock: 12, minStock: 4, cost: 35, category: 'Frutas' },
  { id: 4, name: 'Papaya', unit: 'lb', stock: 8, minStock: 3, cost: 20, category: 'Frutas' },
  { id: 5, name: 'Sandía', unit: 'lb', stock: 20, minStock: 5, cost: 15, category: 'Frutas' },
  { id: 6, name: 'Melón', unit: 'unidad', stock: 10, minStock: 3, cost: 40, category: 'Frutas' },
  { id: 7, name: 'Banano', unit: 'racimo', stock: 7, minStock: 3, cost: 25, category: 'Frutas' },
  { id: 8, name: 'Naranja', unit: 'lb', stock: 18, minStock: 5, cost: 18, category: 'Frutas' },
  { id: 9, name: 'Leche', unit: 'litro', stock: 10, minStock: 3, cost: 30, category: 'Lácteos' },
  { id: 10, name: 'Leche Condensada', unit: 'lata', stock: 6, minStock: 2, cost: 55, category: 'Lácteos' },
  { id: 11, name: 'Crema', unit: 'litro', stock: 4, minStock: 2, cost: 65, category: 'Lácteos' },
  { id: 12, name: 'Azúcar', unit: 'lb', stock: 25, minStock: 8, cost: 12, category: 'Endulzantes' },
  { id: 13, name: 'Miel', unit: 'litro', stock: 3, minStock: 1, cost: 120, category: 'Endulzantes' },
  { id: 14, name: 'Hielo', unit: 'bolsa', stock: 20, minStock: 5, cost: 15, category: 'Otros' },
  { id: 15, name: 'Granola', unit: 'lb', stock: 5, minStock: 2, cost: 60, category: 'Otros' },
  { id: 16, name: 'Coco Rallado', unit: 'lb', stock: 4, minStock: 1, cost: 40, category: 'Otros' },
  { id: 17, name: 'Chile en Polvo', unit: 'oz', stock: 8, minStock: 2, cost: 25, category: 'Condimentos' },
  { id: 18, name: 'Sal', unit: 'lb', stock: 3, minStock: 1, cost: 8, category: 'Condimentos' },
  { id: 19, name: 'Limón', unit: 'unidad', stock: 40, minStock: 10, cost: 3, category: 'Frutas' },
  { id: 20, name: 'Yogurt Natural', unit: 'litro', stock: 5, minStock: 2, cost: 55, category: 'Lácteos' },
];

export const initialProducts: Product[] = [
  {
    id: 1,
    code: 'CF-001',
    name: 'Batido de Fresa',
    category: 'Batidos',
    price: 80,
    cost: 35,
    stock: 50,
    minStock: 10,
    description: 'Delicioso batido cremoso de fresas frescas con leche y azúcar. Una combinación perfecta para refrescarte.',
    ingredients: [
      { ingredientId: 1, quantity: 0.25 },
      { ingredientId: 9, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.05 },
      { ingredientId: 14, quantity: 0.1 },
    ],
    image: '🍓',
    status: 'Disponible',
    dateAdded: '2024-01-10',
    unitsSold: 245,
  },
  {
    id: 2,
    code: 'CF-002',
    name: 'Batido de Mango',
    category: 'Batidos',
    price: 75,
    cost: 30,
    stock: 45,
    minStock: 10,
    description: 'Suave batido tropical de mango maduro con leche. Sabor exótico y refrescante.',
    ingredients: [
      { ingredientId: 2, quantity: 1 },
      { ingredientId: 9, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.05 },
      { ingredientId: 14, quantity: 0.1 },
    ],
    image: '🥭',
    status: 'Disponible',
    dateAdded: '2024-01-10',
    unitsSold: 198,
  },
  {
    id: 3,
    code: 'CF-003',
    name: 'Fruta con Chile',
    category: 'Frutas Preparadas',
    price: 50,
    cost: 18,
    stock: 60,
    minStock: 15,
    description: 'Mix de frutas frescas de temporada con chile en polvo, sal y limón. ¡El clásico irresistible!',
    ingredients: [
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 0.25 },
      { ingredientId: 5, quantity: 0.3 },
      { ingredientId: 17, quantity: 0.02 },
      { ingredientId: 18, quantity: 0.01 },
      { ingredientId: 19, quantity: 1 },
    ],
    image: '🌶️',
    status: 'Disponible',
    dateAdded: '2024-01-10',
    unitsSold: 312,
  },
  {
    id: 4,
    code: 'CF-004',
    name: 'Ensalada de Frutas',
    category: 'Ensaladas',
    price: 65,
    cost: 25,
    stock: 40,
    minStock: 10,
    description: 'Fresca ensalada con variedad de frutas tropicales, miel y granola. Nutritiva y deliciosa.',
    ingredients: [
      { ingredientId: 1, quantity: 0.1 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 0.2 },
      { ingredientId: 4, quantity: 0.2 },
      { ingredientId: 7, quantity: 0.5 },
      { ingredientId: 13, quantity: 0.02 },
      { ingredientId: 15, quantity: 0.05 },
    ],
    image: '🥗',
    status: 'Disponible',
    dateAdded: '2024-01-10',
    unitsSold: 178,
  },
  {
    id: 5,
    code: 'CF-005',
    name: 'Fresco de Sandía',
    category: 'Frescos',
    price: 45,
    cost: 15,
    stock: 35,
    minStock: 8,
    description: 'Refrescante fresco natural de sandía con hielo y un toque de limón. Ideal para el calor.',
    ingredients: [
      { ingredientId: 5, quantity: 0.5 },
      { ingredientId: 14, quantity: 0.2 },
      { ingredientId: 19, quantity: 1 },
      { ingredientId: 12, quantity: 0.03 },
    ],
    image: '🍉',
    status: 'Disponible',
    dateAdded: '2024-01-15',
    unitsSold: 156,
  },
  {
    id: 6,
    code: 'CF-006',
    name: 'Fresco de Naranja',
    category: 'Frescos',
    price: 40,
    cost: 14,
    stock: 30,
    minStock: 8,
    description: 'Jugo natural de naranja recién exprimida. 100% natural, sin conservantes.',
    ingredients: [
      { ingredientId: 8, quantity: 0.5 },
      { ingredientId: 14, quantity: 0.2 },
      { ingredientId: 12, quantity: 0.02 },
    ],
    image: '🍊',
    status: 'Disponible',
    dateAdded: '2024-01-15',
    unitsSold: 134,
  },
  {
    id: 7,
    code: 'CF-007',
    name: 'Bowl Tropical',
    category: 'Bowls',
    price: 95,
    cost: 42,
    stock: 25,
    minStock: 8,
    description: 'Bowl premium con base de yogurt, frutas tropicales variadas, granola y coco rallado.',
    ingredients: [
      { ingredientId: 20, quantity: 0.2 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 1, quantity: 0.1 },
      { ingredientId: 3, quantity: 0.2 },
      { ingredientId: 15, quantity: 0.05 },
      { ingredientId: 16, quantity: 0.03 },
      { ingredientId: 13, quantity: 0.02 },
    ],
    image: '🫙',
    status: 'Disponible',
    dateAdded: '2024-02-01',
    unitsSold: 89,
  },
  {
    id: 8,
    code: 'CF-008',
    name: 'Batido de Papaya',
    category: 'Batidos',
    price: 70,
    cost: 28,
    stock: 3,
    minStock: 8,
    description: 'Batido suave y nutritivo de papaya con leche y leche condensada. Sabor dulce natural.',
    ingredients: [
      { ingredientId: 4, quantity: 0.3 },
      { ingredientId: 9, quantity: 0.25 },
      { ingredientId: 10, quantity: 0.1 },
      { ingredientId: 14, quantity: 0.1 },
    ],
    image: '🧡',
    status: 'Stock Bajo',
    dateAdded: '2024-02-01',
    unitsSold: 112,
  },
  {
    id: 9,
    code: 'CF-009',
    name: 'Piña con Tajadas',
    category: 'Frutas Preparadas',
    price: 55,
    cost: 20,
    stock: 0,
    minStock: 10,
    description: 'Tajadas frescas de piña natural con chile, sal y limón. Perfecta para calmar el antojo.',
    ingredients: [
      { ingredientId: 3, quantity: 0.5 },
      { ingredientId: 17, quantity: 0.02 },
      { ingredientId: 18, quantity: 0.01 },
      { ingredientId: 19, quantity: 1 },
    ],
    image: '🍍',
    status: 'Agotado',
    dateAdded: '2024-02-10',
    unitsSold: 98,
  },
  {
    id: 10,
    code: 'CF-010',
    name: 'Fresco de Melón',
    category: 'Frescos',
    price: 45,
    cost: 16,
    stock: 20,
    minStock: 8,
    description: 'Refrescante fresco de melón maduro con hielo. Dulce y natural.',
    ingredients: [
      { ingredientId: 6, quantity: 0.5 },
      { ingredientId: 14, quantity: 0.2 },
      { ingredientId: 12, quantity: 0.02 },
    ],
    image: '🍈',
    status: 'Disponible',
    dateAdded: '2024-02-15',
    unitsSold: 76,
  },
  {
    id: 11,
    code: 'CF-011',
    name: 'Batido Tres Leches',
    category: 'Batidos',
    price: 90,
    cost: 40,
    stock: 15,
    minStock: 5,
    description: 'Exclusivo batido cremoso con banano, tres tipos de leche y un toque de vainilla.',
    ingredients: [
      { ingredientId: 7, quantity: 0.5 },
      { ingredientId: 9, quantity: 0.2 },
      { ingredientId: 10, quantity: 0.1 },
      { ingredientId: 11, quantity: 0.05 },
      { ingredientId: 14, quantity: 0.1 },
    ],
    image: '🥛',
    status: 'Disponible',
    dateAdded: '2024-03-01',
    unitsSold: 65,
  },
  {
    id: 12,
    code: 'CF-012',
    name: 'Mix de Frutas Premium',
    category: 'Ensaladas',
    price: 85,
    cost: 35,
    stock: 2,
    minStock: 8,
    description: 'Selección premium de las mejores frutas de temporada con crema y leche condensada.',
    ingredients: [
      { ingredientId: 1, quantity: 0.15 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 0.2 },
      { ingredientId: 5, quantity: 0.25 },
      { ingredientId: 11, quantity: 0.05 },
      { ingredientId: 10, quantity: 0.05 },
    ],
    image: '🍱',
    status: 'Stock Bajo',
    dateAdded: '2024-03-05',
    unitsSold: 54,
  },
];

export const initialClients: Client[] = [
  {
    id: 1,
    name: 'Roberto Castillo',
    phone: '8899-1122',
    email: 'roberto@gmail.com',
    totalPurchases: 28,
    totalSpent: 2240,
    lastPurchase: '2025-01-15',
    registeredDate: '2024-03-10',
  },
  {
    id: 2,
    name: 'Sofía Martínez',
    phone: '8833-4455',
    email: 'sofia.martinez@outlook.com',
    totalPurchases: 45,
    totalSpent: 3600,
    lastPurchase: '2025-01-15',
    registeredDate: '2024-02-15',
  },
  {
    id: 3,
    name: 'Diego Ramos',
    phone: '8811-6677',
    email: 'diego.ramos@gmail.com',
    totalPurchases: 15,
    totalSpent: 975,
    lastPurchase: '2025-01-14',
    registeredDate: '2024-06-20',
  },
  {
    id: 4,
    name: 'Laura Vásquez',
    phone: '8877-8899',
    email: 'laura.v@yahoo.com',
    totalPurchases: 32,
    totalSpent: 2560,
    lastPurchase: '2025-01-13',
    registeredDate: '2024-01-05',
  },
  {
    id: 5,
    name: 'Pablo Jiménez',
    phone: '8822-0011',
    email: 'pablo.j@gmail.com',
    totalPurchases: 8,
    totalSpent: 520,
    lastPurchase: '2025-01-12',
    registeredDate: '2024-11-01',
  },
  {
    id: 6,
    name: 'Valeria Morales',
    phone: '8800-2233',
    email: 'valeria.m@hotmail.com',
    totalPurchases: 52,
    totalSpent: 4160,
    lastPurchase: '2025-01-15',
    registeredDate: '2024-01-15',
  },
  {
    id: 7,
    name: 'Andrés López',
    phone: '8844-5566',
    email: 'andres.l@gmail.com',
    totalPurchases: 19,
    totalSpent: 1520,
    lastPurchase: '2025-01-11',
    registeredDate: '2024-07-22',
  },
];

export const initialSales: Sale[] = [
  {
    id: 1,
    invoiceNumber: 'FAC-0001',
    date: '2025-01-15',
    time: '08:15:00',
    items: [
      { productId: 3, productName: 'Fruta con Chile', quantity: 2, unitPrice: 50, subtotal: 100 },
      { productId: 5, productName: 'Fresco de Sandía', quantity: 1, unitPrice: 45, subtotal: 45 },
    ],
    subtotal: 145,
    total: 145,
    paymentMethod: 'Efectivo',
    amountReceived: 200,
    change: 55,
    cashierName: 'María González',
    clientName: 'Cliente General',
    status: 'Completada',
  },
  {
    id: 2,
    invoiceNumber: 'FAC-0002',
    date: '2025-01-15',
    time: '09:30:00',
    items: [
      { productId: 1, productName: 'Batido de Fresa', quantity: 1, unitPrice: 80, subtotal: 80 },
      { productId: 4, productName: 'Ensalada de Frutas', quantity: 1, unitPrice: 65, subtotal: 65 },
    ],
    subtotal: 145,
    total: 145,
    paymentMethod: 'Tarjeta',
    amountReceived: 145,
    change: 0,
    cashierName: 'María González',
    clientId: 2,
    clientName: 'Sofía Martínez',
    status: 'Completada',
  },
  {
    id: 3,
    invoiceNumber: 'FAC-0003',
    date: '2025-01-15',
    time: '10:45:00',
    items: [
      { productId: 7, productName: 'Bowl Tropical', quantity: 2, unitPrice: 95, subtotal: 190 },
      { productId: 6, productName: 'Fresco de Naranja', quantity: 2, unitPrice: 40, subtotal: 80 },
    ],
    subtotal: 270,
    total: 270,
    paymentMethod: 'Efectivo',
    amountReceived: 300,
    change: 30,
    cashierName: 'Carlos Mendoza',
    clientId: 6,
    clientName: 'Valeria Morales',
    status: 'Completada',
  },
  {
    id: 4,
    invoiceNumber: 'FAC-0004',
    date: '2025-01-15',
    time: '11:20:00',
    items: [
      { productId: 3, productName: 'Fruta con Chile', quantity: 3, unitPrice: 50, subtotal: 150 },
    ],
    subtotal: 150,
    total: 150,
    paymentMethod: 'Efectivo',
    amountReceived: 150,
    change: 0,
    cashierName: 'María González',
    clientName: 'Cliente General',
    status: 'Completada',
  },
  {
    id: 5,
    invoiceNumber: 'FAC-0005',
    date: '2025-01-15',
    time: '12:05:00',
    items: [
      { productId: 2, productName: 'Batido de Mango', quantity: 1, unitPrice: 75, subtotal: 75 },
      { productId: 11, productName: 'Batido Tres Leches', quantity: 1, unitPrice: 90, subtotal: 90 },
      { productId: 5, productName: 'Fresco de Sandía', quantity: 1, unitPrice: 45, subtotal: 45 },
    ],
    subtotal: 210,
    total: 210,
    paymentMethod: 'Transferencia',
    amountReceived: 210,
    change: 0,
    cashierName: 'Carlos Mendoza',
    clientId: 1,
    clientName: 'Roberto Castillo',
    status: 'Completada',
  },
  {
    id: 6,
    invoiceNumber: 'FAC-0006',
    date: '2025-01-14',
    time: '08:45:00',
    items: [
      { productId: 4, productName: 'Ensalada de Frutas', quantity: 2, unitPrice: 65, subtotal: 130 },
      { productId: 6, productName: 'Fresco de Naranja', quantity: 2, unitPrice: 40, subtotal: 80 },
    ],
    subtotal: 210,
    total: 210,
    paymentMethod: 'Efectivo',
    amountReceived: 250,
    change: 40,
    cashierName: 'Luis Herrera',
    clientId: 4,
    clientName: 'Laura Vásquez',
    status: 'Completada',
  },
  {
    id: 7,
    invoiceNumber: 'FAC-0007',
    date: '2025-01-14',
    time: '14:30:00',
    items: [
      { productId: 1, productName: 'Batido de Fresa', quantity: 3, unitPrice: 80, subtotal: 240 },
    ],
    subtotal: 240,
    total: 240,
    paymentMethod: 'Efectivo',
    amountReceived: 300,
    change: 60,
    cashierName: 'María González',
    clientName: 'Cliente General',
    status: 'Completada',
  },
  {
    id: 8,
    invoiceNumber: 'FAC-0008',
    date: '2025-01-13',
    time: '09:15:00',
    items: [
      { productId: 3, productName: 'Fruta con Chile', quantity: 4, unitPrice: 50, subtotal: 200 },
      { productId: 5, productName: 'Fresco de Sandía', quantity: 2, unitPrice: 45, subtotal: 90 },
      { productId: 10, productName: 'Fresco de Melón', quantity: 1, unitPrice: 45, subtotal: 45 },
    ],
    subtotal: 335,
    total: 335,
    paymentMethod: 'Efectivo',
    amountReceived: 400,
    change: 65,
    cashierName: 'Luis Herrera',
    clientId: 3,
    clientName: 'Diego Ramos',
    status: 'Completada',
  },
];

export const initialActivityLogs: ActivityLog[] = [
  { id: 1, userId: 1, userName: 'Carlos Mendoza', action: 'Inicio de sesión', module: 'Sistema', timestamp: '2025-01-15 08:30:00', details: 'Acceso exitoso desde escritorio' },
  { id: 2, userId: 2, userName: 'María González', action: 'Venta registrada', module: 'Ventas', timestamp: '2025-01-15 08:15:00', details: 'FAC-0001 por C$145' },
  { id: 3, userId: 2, userName: 'María González', action: 'Venta registrada', module: 'Ventas', timestamp: '2025-01-15 09:30:00', details: 'FAC-0002 por C$145' },
  { id: 4, userId: 1, userName: 'Carlos Mendoza', action: 'Producto editado', module: 'Inventario', timestamp: '2025-01-15 10:00:00', details: 'Actualización de stock Batido de Papaya' },
  { id: 5, userId: 1, userName: 'Carlos Mendoza', action: 'Venta registrada', module: 'Ventas', timestamp: '2025-01-15 10:45:00', details: 'FAC-0003 por C$270' },
  { id: 6, userId: 2, userName: 'María González', action: 'Venta registrada', module: 'Ventas', timestamp: '2025-01-15 11:20:00', details: 'FAC-0004 por C$150' },
  { id: 7, userId: 1, userName: 'Carlos Mendoza', action: 'Venta registrada', module: 'Ventas', timestamp: '2025-01-15 12:05:00', details: 'FAC-0005 por C$210' },
  { id: 8, userId: 3, userName: 'Luis Herrera', action: 'Inicio de sesión', module: 'Sistema', timestamp: '2025-01-14 08:00:00', details: 'Acceso exitoso desde escritorio' },
];

// =============================================
// APP STATE STORE
// =============================================

class AppStore {
  users: User[] = [...initialUsers];
  ingredients: Ingredient[] = [...initialIngredients];
  products: Product[] = [...initialProducts];
  clients: Client[] = [...initialClients];
  sales: Sale[] = [...initialSales];
  activityLogs: ActivityLog[] = [...initialActivityLogs];
  config: AppConfig = {
    theme: 'light',
    businessName: 'Chily Frutas',
    businessPhone: '8888-0000',
    businessAddress: 'Managua, Nicaragua',
    currency: 'C$',
    taxRate: 0,
    notifications: true,
    lowStockAlert: true,
    printReceipt: true,
    logo: '🍓',
  };
  currentUser: User | null = null;
  nextInvoiceNumber: number = 9;

  getNextInvoiceNumber(): string {
    const num = this.nextInvoiceNumber;
    this.nextInvoiceNumber++;
    return `FAC-${String(num).padStart(4, '0')}`;
  }

  getTodaySales(): Sale[] {
    const today = new Date().toISOString().split('T')[0];
    return this.sales.filter(s => s.date === today && s.status === 'Completada');
  }

  getTodayTotal(): number {
    return this.getTodaySales().reduce((sum, s) => sum + s.total, 0);
  }

  getWeekSales(): Sale[] {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return this.sales.filter(s => {
      const d = new Date(s.date);
      return d >= weekAgo && d <= now && s.status === 'Completada';
    });
  }

  getWeekTotal(): number {
    return this.getWeekSales().reduce((sum, s) => sum + s.total, 0);
  }

  getMonthSales(): Sale[] {
    const now = new Date();
    return this.sales.filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && s.status === 'Completada';
    });
  }

  getMonthTotal(): number {
    return this.getMonthSales().reduce((sum, s) => sum + s.total, 0);
  }

  getLowStockProducts(): Product[] {
    return this.products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  }

  getOutOfStockProducts(): Product[] {
    return this.products.filter(p => p.stock === 0);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addSale(sale: Sale): void {
    this.sales.unshift(sale);
    // Update product units sold and deduct ingredients
    sale.items.forEach(item => {
      const product = this.products.find(p => p.id === item.productId);
      if (product) {
        product.unitsSold += item.quantity;
        // Deduct ingredients
        product.ingredients.forEach(ing => {
          const ingredient = this.ingredients.find(i => i.id === ing.ingredientId);
          if (ingredient) {
            ingredient.stock = Math.max(0, ingredient.stock - ing.quantity * item.quantity);
          }
        });
        // Update product status
        if (product.stock === 0) product.status = 'Agotado';
        else if (product.stock <= product.minStock) product.status = 'Stock Bajo';
      }
    });
    // Log activity
    if (this.currentUser) {
      this.activityLogs.unshift({
        id: this.activityLogs.length + 1,
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        action: 'Venta registrada',
        module: 'Ventas',
        timestamp: `${sale.date} ${sale.time}`,
        details: `${sale.invoiceNumber} por C$${sale.total}`,
      });
    }
  }
}

export const store = new AppStore();
