package com.delivery.deliverySlot.controller;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.service.DeliverySlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliverySlots")
public class DeliverySlotController {

    private final DeliverySlotService deliverySlotService;

    public DeliverySlotController(DeliverySlotService deliverySlotService) {
        this.deliverySlotService = deliverySlotService;
    }

    @PostMapping
    public ResponseEntity<DeliverySlotDto> createDeliverySlot(@Validated @RequestBody DeliverySlotDto dto) {
        DeliverySlotDto created = deliverySlotService.save(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliverySlotDto> getDeliverySlot(@PathVariable Long id) {
        return ResponseEntity.ok(deliverySlotService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<DeliverySlotDto>> listDeliverySlots() {
        return ResponseEntity.ok(deliverySlotService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliverySlotDto> updateDeliverySlot(@PathVariable Long id, @RequestBody DeliverySlotDto dto) {
        return ResponseEntity.ok(deliverySlotService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliverySlot(@PathVariable Long id) {
        deliverySlotService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
