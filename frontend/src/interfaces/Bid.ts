import {Store} from "./Store"
import {Auction} from "./Auction"

export enum BidStatus {
    WON = 'WON',
    OUTBID = 'OUTBID',
}

export interface Bid {
    id: number;
    amount: number;
    timestamp: string;
    status: BidStatus;
    store: Store;
    auction: Auction;
}