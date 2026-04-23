package com.delivery.auction.mapper;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;

import org.springframework.stereotype.Component;


@Component
public class AuctionMapper {

    public AuctionDto toDto(Auction s) {
        if (s == null) {
            return null;
        }

        return AuctionDto.builder()
                .id(s.getId())
                .startPrice(s.getStartPrice())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .status(s.getStatus())
                .build();
    }

    public Auction toEntity(AuctionDto d) {
        if (d == null) {
            return null;
        }

        return Auction.builder()
                .id(d.getId())
                .startPrice(d.getStartPrice())
                .startTime(d.getStartTime())
                .endTime(d.getEndTime())
                .status(d.getStatus())
                .build();
    }
}
