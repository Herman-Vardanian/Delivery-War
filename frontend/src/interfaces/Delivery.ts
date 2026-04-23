import {DeliverySlot} from "./DeliverySlot"
import {Store} from "./Store"

export interface Delivery {
    id: number;
    address: string;
    status: DeliveryStatus;
    deliveryCompany: string;
    store: Store
    deliverySlot?: DeliverySlot
}

export enum DeliveryStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}