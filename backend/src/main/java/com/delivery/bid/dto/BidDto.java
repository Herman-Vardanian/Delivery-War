package com.delivery.bid.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidDto {
    private Long id;
    private Double amount;
    private LocalDateTime timestamp;
    private String status;
    private Long storeId;
    private Long auctionId;
    private String storeName;
}
