package com.delivery.auction.mapper;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.deliverySlot.entity.DeliverySlot;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AuctionMapper {

    public AuctionDto toDto(Auction a) {
        if (a == null) {
            return null;
        }

        DeliverySlot slot = a.getDeliverySlot();
        return AuctionDto.builder()
                .id(a.getId())
                .startPrice(a.getStartPrice())
                .startTime(a.getStartTime() != null ? a.getStartTime().toString() : null)
                .endTime(a.getEndTime() != null ? a.getEndTime().toString() : null)
                .status(a.getStatus())
                .deliverySlotId(slot != null ? slot.getId() : null)
                .slotStartTime(slot != null && slot.getStartTime() != null ? slot.getStartTime().toString() : null)
                .slotEndTime(slot != null && slot.getEndTime() != null ? slot.getEndTime().toString() : null)
                .whaleOnly(a.getWhaleOnly() != null ? a.getWhaleOnly() : false)
                .region(a.getRegion())
                .build();
    }

    public Auction toEntity(AuctionDto d, DeliverySlot slot) {
        if (d == null) {
            return null;
        }

        return Auction.builder()
                .id(d.getId())
                .startPrice(d.getStartPrice())
                .startTime(LocalDateTime.parse(d.getStartTime()))
                .endTime(LocalDateTime.parse(d.getEndTime()))
                .status(d.getStatus())
                .deliverySlot(slot)
                .whaleOnly(d.getWhaleOnly() != null ? d.getWhaleOnly() : false)
                .region(d.getRegion())
                .build();
    }
}
