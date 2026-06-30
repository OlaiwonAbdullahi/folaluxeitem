const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// --- Types ---

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  altText: string;
  isMain: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: "bags" | "clothing" | "accessories";
  stock: number;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

// What the client submits when creating an order. The server enriches each
// item with the product snapshot (name, image, price) before storing it.
export interface CreateOrderItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "paystack" | "cash";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitialization {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: any[];
  topProducts: any[];
  revenueByDate: any[];
}

// --- API Client ---

class ApiClient {
  private getHeaders() {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  // --- Auth ---
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) {
    return this.request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request<User>("/auth/me");
  }

  async updateProfile(
    data: Partial<Pick<User, "firstName" | "lastName" | "phoneNumber">>,
  ) {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // --- Products ---
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating";
    featured?: boolean;
    newArrival?: boolean;
    bestseller?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<ProductsResponse>(
      `/products?${searchParams.toString()}`,
    );
  }

  async getProduct(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request<Product[]>("/products/featured");
  }

  async getNewArrivals() {
    return this.request<Product[]>("/products/new-arrivals");
  }

  async getBestsellers() {
    return this.request<Product[]>("/products/bestsellers");
  }

  // --- Orders ---
  async createOrder(orderData: {
    customerInfo: CustomerInfo;
    shippingAddress: ShippingAddress;
    items: CreateOrderItem[];
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request<Order>(`/orders/${orderId}`);
  }

  async initializePayment(orderId: string) {
    return this.request<PaymentInitialization>(
      `/orders/${orderId}/initialize-payment`,
      {
        method: "POST",
      },
    );
  }

  async verifyPayment(orderId: string, reference: string) {
    return this.request<Order>(`/orders/${orderId}/verify-payment`, {
      method: "POST",
      body: JSON.stringify({ reference }),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request<Order>(`/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  }

  // --- Admin ---
  async adminGetOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ orders: Order[]; pagination: PaginationInfo }>(
      `/admin/orders?${searchParams.toString()}`,
    );
  }

  async adminUpdateOrderStatus(
    orderId: string,
    data: {
      orderStatus: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
    },
  ) {
    return this.request<Order>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async adminGetUsers(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<{ users: User[]; pagination: PaginationInfo }>(
      `/admin/users?${searchParams.toString()}`,
    );
  }

  async adminUpdateUserRole(userId: string, role: "user" | "admin") {
    return this.request<User>(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async adminDeactivateUser(userId: string) {
    return this.request<User>(`/admin/users/${userId}/deactivate`, {
      method: "PUT",
    });
  }

  async adminGetAnalytics() {
    return this.request<AnalyticsData>("/admin/analytics");
  }

  async adminGetProductStats() {
    return this.request("/admin/products/stats");
  }

  async adminCreateProduct(formData: FormData) {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async adminUpdateProduct(id: string, formData: FormData) {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async adminDeleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();
