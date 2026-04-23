package com.delivery.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDto {
    private Long id;
    private String name;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role;
    private String email;
    private String address;
    private BigDecimal balance;
    private BigDecimal reservedBalance;
    private BigDecimal totalSpent;
    private Boolean whalePass;
    private Long passId;
}
