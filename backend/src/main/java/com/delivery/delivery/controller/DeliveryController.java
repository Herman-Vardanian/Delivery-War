package com.delivery.delivery.controller;

import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping
    public ResponseEntity<DeliveryDto> createDelivery(@Validated @RequestBody DeliveryDto dto) {
        DeliveryDto created = deliveryService.createDelivery(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDto> getDelivery(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDelivery(id));
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDto>> listDeliveries() {
        return ResponseEntity.ok(deliveryService.listDeliveries());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<DeliveryDto>> getDeliveriesByStore(@PathVariable Long storeId) {
        List<DeliveryDto> deliveries = deliveryService.getDeliveriesByStore(storeId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/delivery-slot/{deliverySlotId}")
    public ResponseEntity<List<DeliveryDto>> getDeliveriesByDeliverySlot(@PathVariable Long deliverySlotId) {
        List<DeliveryDto> deliveries = deliveryService.getDeliveriesByDeliverySlot(deliverySlotId);
        return ResponseEntity.ok(deliveries);
    }
}
