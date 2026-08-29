import { DeliveryRequest, Rider } from "./types";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message ?? body.error ?? `Request failed: ${res.status}`);
    return (body?.data ?? body) as T;
}
export const createDeliveryRequest = (data: { retailerId:string; customerName:string; customerPhone:string; address:string; itemDescription:string; }) => request<DeliveryRequest>("/requests", {method:"POST",body:JSON.stringify(data)});
export const fetchRequestsByStatus = (status:string) => request<DeliveryRequest[]>(`/requests?status=${encodeURIComponent(status)}`);
export const fetchRiders = () => request<Rider[]>("/riders");
export const assignRider = (requestId:string,riderId:string) => request<DeliveryRequest>(`/requests/${requestId}/assign`,{method:"PATCH",body:JSON.stringify({riderId})});
export const fetchRiderDeliveries = (riderId:string) => request<DeliveryRequest[]>(`/riders/${riderId}/requests`);
export const updateDeliveryStatus = (requestId:string,status:"PICKED_UP"|"IN_TRANSIT"|"ARRIVED"|"DELIVERED",scannedQrCode?:string) => request<DeliveryRequest>(`/requests/${requestId}/status`,{method:"PATCH",body:JSON.stringify({status,scannedQrCode})});
