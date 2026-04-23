package com.delivery.deliverySlot.dto;

import com.delivery.deliverySlot.entity.DeliverySlotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliverySlotDto {
    private Long id;
    private String startTime;
    private String endTime;
    private Integer capacity;
    private DeliverySlotStatus status;
}
