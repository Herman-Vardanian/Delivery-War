package com.delivery.deliverySlot.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliverySlotId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "slot_id")
    private String val;
}
