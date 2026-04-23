package com.delivery.store.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDto {
    private Long id;
    private String name;
    private String password;
    private String role;
    private BigDecimal balance;
    private BigDecimal reservedBalance;
    private BigDecimal totalSpent;
    private Boolean whalePass;
    private Long passId;
}
