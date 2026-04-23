export interface DeliverySlot {
    technicalId: number;
    id: number;
    startTime: Date,
    endTime: Date,
    capacity: number,
    status: DeliverySlotStatus
}

export enum DeliverySlotStatus {
    OPEN= "OPEN",
    PENDING = "PENDING",
    CLOSE = "CLOSE"
}