package com.delivery.deliverySlot.mapper;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.entity.DeliverySlotId;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

@Component
public class DeliverySlotMapper {

    public DeliverySlotDto toDto(DeliverySlot entity) {
        if (entity == null) {
            return null;
        }
        return DeliverySlotDto.builder()
                .id(Long.parseLong(entity.getId().getVal()))
                .startTime(entity.getStartTime().toString())
                .endTime(entity.getEndTime().toString())
                .capacity(entity.getCapacity())
                .status(entity.getStatus())
                .build();
    }

    public DeliverySlot toEntity(DeliverySlotDto dto) {
        if (dto == null) {
            return null;
        }
        return DeliverySlot.builder()
                .id(DeliverySlotId.builder().val(String.valueOf(dto.getId())).build())
                .startTime(LocalDateTime.parse(dto.getStartTime()))
                .endTime(LocalDateTime.parse(dto.getEndTime()))
                .capacity(dto.getCapacity())
                .status(dto.getStatus())
                .build();
    }
}
