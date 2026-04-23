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
        if (bid.getStatus() != null) {
            dto.setStatus(bid.getStatus().name());
        }
        
        if (bid.getStore() != null) {
            dto.setStoreId(bid.getStore().getId());
            dto.setStoreName(bid.getStore().getName());
        }
        
        // L'ID de l'auction est directement accessible via la relation
        // Pas besoin de charger l'entité complète pour éviter les problèmes de lazy loading
        try {
            if (bid.getAuction() != null) {
                dto.setAuctionId(bid.getAuction().getId());
            }
        } catch (Exception e) {
            // En cas de problème de lazy loading, on continue sans l'ID auction
            // L'ID sera accessible via la colonne auction_id directement
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
