import {Leaderboard} from "../interfaces/leaderboard"
import {Auction} from "../interfaces/Auction"
import {Bid} from "../interfaces/Bid"
import {Delivery} from "../interfaces/Delivery"
import {DeliverySlot} from "../interfaces/DeliverySlot"
import {Store} from "../interfaces/Store"
import {api} from "./utils"



export const leaderboard = {
    all: () => api.get<Leaderboard>('/leaderboard'),
};
export const auctions = {
    // Auctions
    all: () => api.get<Auction[]>('/auctions'),
    byId: (id: number) => api.get<Auction>(`/auctions/${id}`),
    create: (data: Auction) => api.post<Auction>('/auctions', data),
    update: (id: number, data: Auction) => api.put<Auction>(`/auctions/${id}`, data),

    // Bids par auction
    bids: (auctionId: number) => api.get<Bid[]>(`/auctions/${auctionId}/bids`),
    highestBid: (auctionId: number) => api.get<Bid | null>(`/auctions/${auctionId}/highest`),

    // Leaderboards
    auctionLeaderboard: (auctionId: number) => api.get<Bid[]>(`/auctions/${auctionId}/leaderboard`),

    globalLeaderboard: () => api.get<Bid[]>('/auctions/leaderboard'),
};

export const bids = {
    // Bids générales
    all: () => api.get<Bid[]>('/bids'),
    byId: (id: number) => api.get<Bid>(`/bids/${id}`),
    create: (data: Bid) => api.post<Bid>('/bids', data),

    // Par auction (doublon avec auctions, mais cohérent)
    byAuction: (auctionId: number) => api.get<Bid[]>(`/bids/auction/${auctionId}`),
    highestByAuction: (auctionId: number) => api.get<Bid>(`/bids/auction/${auctionId}/highest`),

    // Par store
    byStore: (storeId: number) => api.get<Bid[]>(`/bids/store/${storeId}`),
};

export const deliveries = {
    // Deliveries générales
    all: () => api.get<Delivery[]>('/deliveries'),
    byId: (id: number) => api.get<Delivery>(`/deliveries/${id}`),
    create: (data: Delivery) => api.post<Delivery>('/deliveries', data),

    // Par store
    byStore: (storeId: number) => api.get<Delivery[]>(`/deliveries/store/${storeId}`),

    // Par delivery slot
    byDeliverySlot: (deliverySlotId: number) => api.get<Delivery[]>(`/deliveries/delivery-slot/${deliverySlotId}`),
};

export const deliverySlots = {
    // DeliverySlots générales
    all: () => api.get<DeliverySlot[]>('/deliverySlots'),
    byId: (id: number) => api.get<DeliverySlot>(`/deliverySlots/${id}`),

    // Mutations
    create: (data: DeliverySlot) => api.post<DeliverySlot>('/deliverySlots', data),
    update: (id: number, data: DeliverySlot) => api.put<DeliverySlot>(`/deliverySlots/${id}`, data),
    delete: (id: number) => api.delete(`/deliverySlots/${id}`),
};

export const stores = {
    // Stores générales
    all: () => api.get<Store[]>('/stores'),
    byId: (id: number) => api.get<Store>(`/stores/${id}`),

    create: (data: Store) => api.post<Store>('/stores', data),

    // Mutations
    update: (id: number, data: Store) => api.put<Store>(`/stores/${id}`, data),
    delete: (id: number) => api.delete(`/stores/${id}`),

    // Bids du store
    bids: (storeId: number) => api.get<Bid[]>(`/stores/${storeId}/bid`),
};