package com.delivery.bid.mapper;

import com.delivery.bid.dto.BidDto;
import com.delivery.bid.entity.Bid;
import com.delivery.bid.entity.BidStatus;
import com.delivery.store.entity.Store;
import com.delivery.auction.entity.Auction;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class BidMapperTest {

    private final BidMapper mapper = new BidMapper();

    @Test
    void toDtoAndToEntity_roundtrip() {
        Store store = Store.builder()
                .id(1L)
                .name("TestStore")
                .build();

        Auction auction = Auction.builder()
                .id(1L)
                .build();

        Bid bid = Bid.builder()
                .id(1L)
                .amount(100.0)
                .timestamp(LocalDateTime.now())
                .status(BidStatus.WON)
                .store(store)
                .auction(auction)
                .build();

        BidDto dto = mapper.toDto(bid);
        assertNotNull(dto);
        assertEquals(bid.getId(), dto.getId());
        assertEquals(bid.getAmount(), dto.getAmount());
        assertEquals(bid.getStatus().name(), dto.getStatus());
        assertEquals(bid.getStore().getId(), dto.getStoreId());
        assertEquals(bid.getStore().getName(), dto.getStoreName());
        assertEquals(bid.getAuction().getId(), dto.getAuctionId());

        Bid converted = mapper.toEntity(dto);
        assertNotNull(converted);
        assertEquals(dto.getId(), converted.getId());
        assertEquals(dto.getAmount(), converted.getAmount());
        assertEquals(BidStatus.WON, converted.getStatus());
    }

    @Test
    void toEntity_nullStatusProducesNullStatus() {
        BidDto dto = BidDto.builder()
                .id(2L)
                .amount(150.0)
                .status(null)
                .build();

        Bid entity = mapper.toEntity(dto);
        assertNotNull(entity);
        assertNull(entity.getStatus());
    }

    @Test
    void toDto_nullEntityReturnsNull() {
        BidDto dto = mapper.toDto(null);
        assertNull(dto);
    }

    @Test
    void toEntity_nullDtoReturnsNull() {
        Bid entity = mapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    void toEntity_nullStoreAndAuction() {
        BidDto dto = BidDto.builder()
                .id(3L)
                .amount(200.0)
                .status("OUTBID")
                .storeId(null)
                .auctionId(null)
                .build();

        Bid entity = mapper.toEntity(dto);
        assertNotNull(entity);
        assertNull(entity.getStore());
        assertNull(entity.getAuction());
        assertEquals(BidStatus.OUTBID, entity.getStatus());
    }

    @Test
    void toDtoList_convertsAll() {
        Store store = Store.builder().id(1L).name("Store1").build();
        Auction auction = Auction.builder().id(1L).build();

        Bid bid1 = Bid.builder().id(1L).amount(100.0).store(store).auction(auction).build();
        Bid bid2 = Bid.builder().id(2L).amount(200.0).store(store).auction(auction).build();

        var dtos = mapper.toDtoList(java.util.Arrays.asList(bid1, bid2));
        assertEquals(2, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals(2L, dtos.get(1).getId());
    }

    @Test
    void toEntityList_convertsAll() {
        BidDto dto1 = BidDto.builder().id(1L).amount(100.0).status("WON").build();
        BidDto dto2 = BidDto.builder().id(2L).amount(200.0).status("OUTBID").build();

        var entities = mapper.toEntityList(java.util.Arrays.asList(dto1, dto2));
        assertEquals(2, entities.size());
        assertEquals(1L, entities.get(0).getId());
        assertEquals(2L, entities.get(1).getId());
        assertEquals(BidStatus.WON, entities.get(0).getStatus());
        assertEquals(BidStatus.OUTBID, entities.get(1).getStatus());
    }
}
