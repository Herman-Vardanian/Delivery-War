package com.delivery.delivery.entity;

import com.delivery.store.entity.Store;
import com.delivery.deliveryslot.entity.DeliverySlot;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status;

    @Column(nullable = false)
    private String deliveryCompany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_slot_id", nullable = false)
    private DeliverySlot deliverySlot;
}
