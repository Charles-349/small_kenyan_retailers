export type DeliveryStatus = "OPEN" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";

export interface DeliveryRequest {
    id: string;
    retailerId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    itemDescription: string;
    status: DeliveryStatus;
    riderId: string | null;
    qrCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface Rider {
    id: string;
    name: string;
}
