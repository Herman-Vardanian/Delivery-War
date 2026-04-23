package com.delivery.auction.dto;

import com.delivery.auction.entity.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionDto {
    private Long id;
    private Float startPrice;
    private String startTime;
    private String endTime;
    private AuctionStatus status;
    private Long deliverySlotId;
    private String slotStartTime;
    private String slotEndTime;
}
