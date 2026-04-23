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
}


export type CreateAuction = {
    startPrice: string,
    startTime: string, // ISO FORMAT
    "endTime":string, // ISO FORMAT
    "status": AuctionStatus,
    "deliverySlotId": number
}