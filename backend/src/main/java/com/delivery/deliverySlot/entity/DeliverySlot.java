package com.delivery.deliverySlot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliverySlot {

    @EmbeddedId
    private DeliverySlotId id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private DeliverySlotStatus status;
}
