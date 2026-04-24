export enum AuctionStatus {
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    CLOSED = 'CLOSED',
}

export interface Auction {
    id: number;
    startPrice?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    status: AuctionStatus;
    deliverySlotId?: number | null;
    slotStartTime?: string | null;
    slotEndTime?: string | null;
    whaleOnly?: boolean;
}


export type CreateAuction = {
    startPrice: string,
    startTime: string, // ISO FORMAT
    "endTime":string, // ISO FORMAT
    "status": AuctionStatus,
    "deliverySlotId": number,
    "whaleOnly"?: boolean
}