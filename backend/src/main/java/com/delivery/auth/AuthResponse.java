package com.delivery.auth;

import com.delivery.store.dto.StoreDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private final String token;
    private final StoreDto store;
}
