package com.delivery.deliverySlot.mapper;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import org.springframework.stereotype.Component;

@Component
public class DeliverySlotMapper {

    public DeliverySlotDto toDto(DeliverySlot entity) {
        if (entity == null) {
            return null;
        }
        return DeliverySlotDto.builder()
                .id(Long.valueOf(entity.getId().getValue()))
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .capacity(entity.getCapacity())
                .status(entity.getStatus())
                .build();
    }

    public DeliverySlot toEntity(DeliverySlotDto dto) {
        if (dto == null) {
            return null;
        }
        return DeliverySlot.builder()
                .id(dto.getId())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .capacity(dto.getCapacity())
                .status(dto.getStatus())
                .build();
    }
}
