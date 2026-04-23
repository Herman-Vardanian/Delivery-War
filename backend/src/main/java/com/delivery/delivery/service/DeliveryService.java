package com.delivery.delivery.service;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.entity.Delivery;
import com.delivery.delivery.entity.DeliveryStatus;
import com.delivery.delivery.mapper.DeliveryMapper;
import com.delivery.delivery.repository.DeliveryRepository;
import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.repository.DeliverySlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeliveryService {

    private final DeliveryRepository repository;
    private final StoreRepository storeRepository;
    private final DeliverySlotRepository deliverySlotRepository;
    private final DeliveryMapper mapper;

    public DeliveryService(DeliveryRepository repository, StoreRepository storeRepository,
                          DeliverySlotRepository deliverySlotRepository, DeliveryMapper mapper) {
        this.repository = repository;
        this.storeRepository = storeRepository;
        this.deliverySlotRepository = deliverySlotRepository;
        this.mapper = mapper;
    }

    public DeliveryDto createDelivery(DeliveryDto dto) {
        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + dto.getStoreId()));

        Delivery delivery = mapper.toEntity(dto);
        delivery.setStore(store);
        
        // DeliverySlot is optional for now
        if (dto.getDeliverySlotId() != null) {
            DeliverySlot deliverySlot = deliverySlotRepository.findById(dto.getDeliverySlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("DeliverySlot not found: " + dto.getDeliverySlotId()));
            delivery.setDeliverySlot(deliverySlot);
        }
        
        delivery.setStatus(DeliveryStatus.PENDING);

        Delivery saved = repository.save(delivery);
        return mapper.toDto(saved);
    }

    public DeliveryDto getDelivery(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found: " + id));
    }

    public List<DeliveryDto> listDeliveries() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<DeliveryDto> getDeliveriesByStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + storeId));

        List<Delivery> deliveries = repository.findByStore(store);
        return mapper.toDtoList(deliveries);
    }

    public List<DeliveryDto> getDeliveriesByDeliverySlot(Long deliverySlotId) {
        DeliverySlot deliverySlot = deliverySlotRepository.findById(deliverySlotId)
                .orElseThrow(() -> new ResourceNotFoundException("DeliverySlot not found: " + deliverySlotId));

        List<Delivery> deliveries = repository.findByDeliverySlot(deliverySlot);
        return mapper.toDtoList(deliveries);
    }
}
