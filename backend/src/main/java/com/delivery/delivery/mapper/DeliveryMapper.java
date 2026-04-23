package com.delivery.delivery.mapper;

import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.entity.Delivery;
import com.delivery.delivery.entity.DeliveryStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DeliveryMapper {

    public DeliveryDto toDto(Delivery delivery) {
        if (delivery == null) {
            return null;
        }

        DeliveryDto dto = new DeliveryDto();
        dto.setId(delivery.getId());
        dto.setAddress(delivery.getAddress());
        if (delivery.getStatus() != null) {
            dto.setStatus(delivery.getStatus().name());
        }
        dto.setDeliveryCompany(delivery.getDeliveryCompany());

        if (delivery.getStore() != null) {
            dto.setStoreId(delivery.getStore().getId());
            dto.setStoreName(delivery.getStore().getName());
        }

        if (delivery.getDeliverySlot() != null) {
            dto.setDeliverySlotId(Long.valueOf(delivery.getDeliverySlot().getId().getVal()));
        }

        return dto;
    }

    public Delivery toEntity(DeliveryDto dto) {
        if (dto == null) {
            return null;
        }

        Delivery delivery = new Delivery();
        delivery.setId(dto.getId());
        delivery.setAddress(dto.getAddress());
        delivery.setDeliveryCompany(dto.getDeliveryCompany());

        if (dto.getStatus() != null) {
            delivery.setStatus(DeliveryStatus.valueOf(dto.getStatus()));
        }

        return delivery;
    }

    public List<DeliveryDto> toDtoList(List<Delivery> deliveries) {
        return deliveries.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Delivery> toEntityList(List<DeliveryDto> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
