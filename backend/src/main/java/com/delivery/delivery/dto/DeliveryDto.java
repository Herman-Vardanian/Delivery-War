package com.delivery.delivery.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDto {
    private Long id;
    private String address;
    private String status;
    private String deliveryCompany;
    private Long storeId;
    private Long deliverySlotId;
    private String storeName;
}
