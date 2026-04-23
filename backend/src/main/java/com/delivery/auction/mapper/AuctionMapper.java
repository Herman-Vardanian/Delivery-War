package com.delivery.auction.mapper;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;

import com.delivery.deliverySlot.entity.DeliverySlotId;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
public class AuctionMapper {

    public AuctionDto toDto(Auction a) {
        if (a == null) {
            return null;
        }

        return AuctionDto.builder()
                .id(a.getId())
                .startPrice(a.getStartPrice())
                .startTime(a.getStartTime().toString())
                .endTime(a.getEndTime().toString())
                .status(a.getStatus())
                .deliverySlotId(a.getDeliverySlotId() != null ? a.getDeliverySlotId().toString() : null)
                .build();
    }

    public Auction toEntity(AuctionDto d) {
        if (d == null) {
            return null;
        }

        return Auction.builder()
                .id(d.getId())
                .startPrice(d.getStartPrice())
                .startTime(LocalDateTime.parse(d.getStartTime()))
                .endTime(LocalDateTime.parse(d.getEndTime()))
                .status(d.getStatus())
                .deliverySlotId(DeliverySlotId.builder().val(String.valueOf(d.getId())).build())
                .build();
    }
}
