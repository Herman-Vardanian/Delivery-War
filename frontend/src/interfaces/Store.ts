export enum StoreTypeEnum {
    STORE,
    ADMIN
}

export interface Store {
    "id": number,
    "name": string,
    "password": string,
    "role": StoreTypeEnum,
    "email": string,
    "address": string,
    "balance": number,
    "reservedBalance": number,
    "totalSpent": number,
    "whalePass": boolean,
    "passId": string | null
}