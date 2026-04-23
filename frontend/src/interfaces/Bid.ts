export interface Bid {
    id: number;
    amount: number;
    timestamp?: string;
    status?: string;
    storeId: number;
    auctionId: number;
    storeName?: string;
}
