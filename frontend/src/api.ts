// import { DeliveryRequest, Rider } from "./types";
// const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// async function request<T>(path: string, options?: RequestInit): Promise<T> {
//     const res = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
//     const body = await res.json().catch(() => ({}));
//     if (!res.ok) throw new Error(body.message ?? body.error ?? `Request failed: ${res.status}`);
//     return (body?.data ?? body) as T;
// }
// export const createDeliveryRequest = (data: { retailerId:string; customerName:string; customerPhone:string; address:string; itemDescription:string; }) => request<DeliveryRequest>("/requests", {method:"POST",body:JSON.stringify(data)});
// export const fetchRequestsByStatus = (status:string) => request<DeliveryRequest[]>(`/requests?status=${encodeURIComponent(status)}`);
// export const fetchRiders = () => request<Rider[]>("/riders");
// export const assignRider = (requestId:string,riderId:string) => request<DeliveryRequest>(`/requests/${requestId}/assign`,{method:"PATCH",body:JSON.stringify({riderId})});
// export const fetchRiderDeliveries = (riderId:string) => request<DeliveryRequest[]>(`/riders/${riderId}/requests`);
// export const updateDeliveryStatus = (requestId:string,status:"PICKED_UP"|"IN_TRANSIT"|"ARRIVED"|"DELIVERED",scannedQrCode?:string) => request<DeliveryRequest>(`/requests/${requestId}/status`,{method:"PATCH",body:JSON.stringify({status,scannedQrCode})});

import { DeliveryRequest } from "./types";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
/** * Get the JWT token saved after login. */ function getToken():
  | string
  | null {
  return localStorage.getItem("token");
}
/** * Common API request helper. */ async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body.message ??
        body.error ??
        `Request failed with status ${response.status}`,
    );
  }
  return (body?.data ?? body) as T;
}

/* ========================================================= AUTHENTICATION ========================================================= */ export interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "retailer" | "dispatcher" | "rider";
}

export const registerUser = (data: RegisterData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });


export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const result = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", result.token);
  return result;
};
export const getCurrentUser = () => request("/auth/me");
export function logoutUser() {
  localStorage.removeItem("token");
}

/* RETAILER  */ /** * Create a delivery request. * * IMPORTANT: * The backend gets the retailer ID from the * authenticated user. We therefore do NOT send retailerId. */ export interface CreateDeliveryData {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  itemDescription: string;
  specialInstructions?: string;
  latitude?: number;
  longitude?: number;
}
export const createDeliveryRequest = (data: CreateDeliveryData) =>
  request<DeliveryRequest>("/delivery", {
    method: "POST",
    body: JSON.stringify(data),
  });
/** * Get all deliveries belonging to the logged-in retailer. */ export const fetchRetailerDeliveries =
  () => request<DeliveryRequest[]>("/retailer-deliveries/deliveries");
/** * Get retailer deliveries filtered by status. */ export const fetchRetailerDeliveriesByStatus =
  (status: string) =>
    request<DeliveryRequest[]>(
      `/retailer-deliveries/deliveries/status/${encodeURIComponent(status)}`,
    );

/* DISPATCHER */

/** Get deliveries waiting for assignment. */
export const fetchOpenDeliveries =
  () => request<DeliveryRequest[]>("/dispatcher-deliveries/open");

/** Get deliveries that have already been assigned. */
export const fetchAssignedDeliveries =
  () => request<DeliveryRequest[]>("/dispatcher-deliveries/assigned");

/**
 * Assign a specific rider to a delivery.
 *
 * Backend route:
 * POST /api/assignments/deliveries/:id/assign
 */
export const assignRider = (
  deliveryRequestId: number,
  riderId: number
) =>
  request(
    `/assignments/deliveries/${deliveryRequestId}/assign`,
    {
      method: "POST",
      body: JSON.stringify({
        riderId,
      }),
    }
  );

/**
 * Auto-assign nearest available rider.
 *
 * Backend route:
 * POST /api/assignments/deliveries/:id/auto-assign
 */
export const autoAssignRider = (
  deliveryRequestId: number
) =>
  request(
    `/assignments/deliveries/${deliveryRequestId}/auto-assign`,
    {
      method: "POST",
    }
  );

/* RIDER  */ /** * Get deliveries assigned to the logged-in rider. * * The backend gets the rider ID from the JWT, * so we do NOT send riderId. */ export const fetchRiderDeliveries =
  () => request<DeliveryRequest[]>("/rider-deliveries/my-deliveries");
/** * Accept a rider assignment. */ export const acceptAssignment = (
  assignmentId: number,
) => request(`/rider-assignments/${assignmentId}/accept`, { method: "PATCH" });
/** * Reject a rider assignment. */ export const rejectAssignment = (
  assignmentId: number,
) => request(`/rider-assignments/${assignmentId}/reject`, { method: "PATCH" });
/** * Mark a delivery as picked up. */ export const markPickedUp = (
  deliveryId: number,
) =>
  request<DeliveryRequest>(`/delivery-status/${deliveryId}/pick-up`, {
    method: "PATCH",
  });
/** * Mark a delivery as in transit. */ export const markInTransit = (
  deliveryId: number,
) =>
  request<DeliveryRequest>(`/delivery-status/${deliveryId}/in-transit`, {
    method: "PATCH",
  });
/** * Verify the delivery using the customer's QR code. */ export const verifyDelivery =
  (deliveryId: number, qrCode: string, recipientName?: string) =>
    request<DeliveryRequest>(`/qr-verification/${deliveryId}/verify-delivery`, {
      method: "POST",
      body: JSON.stringify({ qrCode, recipientName }),
    });

/*RIDER LOCATION  */
 export interface RiderLocationData {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}
/** * Update the logged-in rider's location. */ export const updateRiderLocation =
  (data: RiderLocationData) =>
    request("/rider-locations/location", {
      method: "PATCH",
      body: JSON.stringify(data),
    });


/* TRACKING  */ /** * Public tracking endpoint. * * NOTE: * This endpoint does NOT require authentication. */ export const fetchTrackingInfo =
  (trackingToken: string) =>
    request(`/tracking/${encodeURIComponent(trackingToken)}`);
/* ========================================================= PROOF OF DELIVERY ========================================================= */ /** * Get proof-of-delivery information. */ export const fetchProofOfDelivery =
  (deliveryId: number) => request(`/proof-of-delivery/${deliveryId}/proof`);
/* ========================================================= ANALYTICS ========================================================= */ export const fetchLogisticsAnalytics =
  () => request("/analytics/logistics");
export const fetchRiderPerformance = (riderId: number) =>
  request(`/analytics/riders/${riderId}`);
