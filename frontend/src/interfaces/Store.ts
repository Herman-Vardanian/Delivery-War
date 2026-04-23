export enum StoreTypeEnum {
    STORE = 'STORE',
    ADMIN = 'ADMIN'
}

export interface Store {
    "id": number,
    "name": string,
    "password": string,
    "role": string,
    "email": string,
    "address": string,
    "balance": number,
    "reservedBalance": number,
    "totalSpent": number,
    "whalePass": boolean,
    "passId": string | null
}