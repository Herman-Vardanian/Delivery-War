package com.delivery.deliverySlot.service;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.mapper.DeliverySlotMapper;
import com.delivery.deliverySlot.repository.DeliverySlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliverySlotService {

    private final DeliverySlotRepository repository;
    private final DeliverySlotMapper mapper;

    public List<DeliverySlotDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public DeliverySlotDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElse(null);
    }

    public DeliverySlotDto save(DeliverySlotDto dto) {
        DeliverySlot entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
