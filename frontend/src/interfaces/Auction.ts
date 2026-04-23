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
