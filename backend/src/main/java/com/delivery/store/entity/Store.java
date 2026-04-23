package com.delivery.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "stores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(precision = 19, scale = 2)
    private BigDecimal reservedBalance;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalSpent;

    private Boolean whalePass;

    private Long passId;

}
