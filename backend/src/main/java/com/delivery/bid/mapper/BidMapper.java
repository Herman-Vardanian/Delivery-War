package com.delivery.bid.mapper;

import com.delivery.bid.dto.BidDto;
import com.delivery.bid.entity.Bid;
import com.delivery.bid.entity.BidStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BidMapper {
    
    public BidDto toDto(Bid bid) {
        if (bid == null) {
            return null;
        }
        
        BidDto dto = new BidDto();
        dto.setId(bid.getId());
        dto.setAmount(bid.getAmount());
        dto.setTimestamp(bid.getTimestamp());
        dto.setStatus(bid.getStatus().name());
        
        if (bid.getStore() != null) {
            dto.setStoreId(bid.getStore().getId());
            dto.setStoreName(bid.getStore().getName());
        }
        
        if (bid.getAuction() != null) {
            dto.setAuctionId(bid.getAuction().getId());
        }
        
        return dto;
    }
    
    public Bid toEntity(BidDto dto) {
        if (dto == null) {
            return null;
        }
        
        Bid bid = new Bid();
        bid.setId(dto.getId());
        bid.setAmount(dto.getAmount());
        bid.setTimestamp(dto.getTimestamp());
        
        if (dto.getStatus() != null) {
            bid.setStatus(BidStatus.valueOf(dto.getStatus()));
        }
        
        return bid;
    }
    
    public List<BidDto> toDtoList(List<Bid> bids) {
        return bids.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public List<Bid> toEntityList(List<BidDto> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
