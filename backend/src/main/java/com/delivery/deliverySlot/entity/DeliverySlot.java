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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "technical_id")
    private Long technicalId;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "val", column = @Column(name = "slot_id"))
    })
    private DeliverySlotId id;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "capacity")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DeliverySlotStatus status;
}
