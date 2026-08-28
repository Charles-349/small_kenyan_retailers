import { DeliveryRequest, Rider } from "./types";

// Point this at your deployed/running backend URL.
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Request failed: ${res.status}`);
    }
    return res.json();
}

export const createDeliveryRequest = (data: {
    retailerId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    itemDescription: string;
}) => request<DeliveryRequest>("/requests", { method: "POST", body: JSON.stringify(data) });

export const fetchRequestsByStatus = (status: string) =>
    request<DeliveryRequest[]>(`/requests?status=${status}`);

export const fetchRiders = () => request<Rider[]>("/riders");

export const assignRider = (requestId: string, riderId: string) =>
    request<DeliveryRequest>(`/requests/${requestId}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ riderId }),
    });

export const fetchRiderDeliveries = (riderId: string) =>
    request<DeliveryRequest[]>(`/riders/${riderId}/requests`);

export const updateDeliveryStatus = (
    requestId: string,
    status: "PICKED_UP" | "DELIVERED",
    scannedQrCode?: string
) =>
    request<DeliveryRequest>(`/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, scannedQrCode }),
    });
