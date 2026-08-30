
// export type DeliveryStatus =
//   | "open"
//   | "assigned"
//   | "accepted"
//   | "picked_up"
//   | "in_transit"
//   | "delivered"
//   | "failed"
//   | "cancelled";
// export interface DeliveryRequest {
//   id: number;
//   retailerId: number;
//   customerName: string;
//   customerPhone: string;
//   deliveryAddress: string;
//   itemDescription: string;
//   specialInstructions?: string;
//   status: DeliveryStatus;
//   riderId: number | null;
//   qrCode?: string | null;
//   trackingToken?: string | null;
//   latitude?: number | null;
//   longitude?: number | null;
//   createdAt: string;
//   updatedAt: string;
// }
// export interface Rider {
//   id: number;
//   name: string;
//   status?: "available" | "busy" | "offline";
//   distanceKm?: number;
//   etaMinutes?: number;
//   latitude?: number | null;
//   longitude?: number | null;
// }



export type DeliveryStatus =
    | "open"
    | "assigned"
    | "accepted"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "failed"
    | "cancelled";

export interface DeliveryRequest {
    id: number;

    retailerId: number;

    customerName: string;

    customerPhone: string;

    deliveryAddress: string;

    itemDescription: string;

    specialInstructions?: string;

    status: DeliveryStatus;

    riderId: number | null;

    /**
     * Assignment ID returned by the backend when
     * the delivery has been assigned to a rider.
     */
    assignmentId?: number | null;

    qrCode?: string | null;

    trackingToken?: string | null;

    latitude?: number | null;

    longitude?: number | null;

    createdAt: string;

    updatedAt: string;
}

export interface Rider {
    id: number;

    name: string;

    status?: "available" | "busy" | "offline";

    distanceKm?: number;

    etaMinutes?: number;

    latitude?: number | null;

    longitude?: number | null;
}

