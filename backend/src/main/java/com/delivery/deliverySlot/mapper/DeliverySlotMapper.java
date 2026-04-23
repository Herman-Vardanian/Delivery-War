package com.delivery.deliverySlot.mapper;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.entity.DeliverySlotId;
import org.springframework.stereotype.Component;

@Component
public class DeliverySlotMapper {

    public DeliverySlotDto toDto(DeliverySlot entity) {
        if (entity == null) {
            return null;
        }
        return DeliverySlotDto.builder()
                .id(Long.parseLong(entity.getId().getValue()))
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
                .id(DeliverySlotId.builder().value(String.valueOf(dto.getId())).build())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .capacity(dto.getCapacity())
                .status(dto.getStatus())
                .build();
    }
}
