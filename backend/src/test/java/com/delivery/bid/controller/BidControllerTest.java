package com.delivery.bid.controller;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.bid.dto.BidDto;
import com.delivery.bid.service.BidService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BidController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BidService bidService;

    @Test
    void createBid_returnsOk() throws Exception {
        BidDto input = BidDto.builder()
                .amount(100.0)
                .storeId(1L)
                .auctionId(1L)
                .build();

        BidDto saved = BidDto.builder()
                .id(1L)
                .amount(100.0)
                .timestamp(LocalDateTime.now())
                .status("OUTBID")
                .storeId(1L)
                .auctionId(1L)
                .storeName("TestStore")
                .build();

        when(bidService.createBid(any(BidDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/bids")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(100.0))
                .andExpect(jsonPath("$.status").value("OUTBID"));
    }

    @Test
    void getBid_found() throws Exception {
        BidDto dto = BidDto.builder()
                .id(2L)
                .amount(150.0)
                .status("WON")
                .build();
        when(bidService.getBid(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/bids/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.amount").value(150.0))
                .andExpect(jsonPath("$.status").value("WON"));
    }

    @Test
    void getBid_notFound_returns404() throws Exception {
        when(bidService.getBid(100L)).thenThrow(new ResourceNotFoundException("Bid not found: 100"));

        mockMvc.perform(get("/api/bids/100").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void listBids_returnsList() throws Exception {
        BidDto a = BidDto.builder().id(1L).amount(100.0).build();
        BidDto b = BidDto.builder().id(2L).amount(200.0).build();
        when(bidService.listBids()).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/bids").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getBidsByAuction_returnsList() throws Exception {
        BidDto a = BidDto.builder().id(1L).amount(100.0).auctionId(1L).build();
        BidDto b = BidDto.builder().id(2L).amount(200.0).auctionId(1L).build();
        when(bidService.getBidsByAuction(1L)).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/bids/auction/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getBidsByStore_returnsList() throws Exception {
        BidDto a = BidDto.builder().id(1L).amount(100.0).storeId(1L).build();
        BidDto b = BidDto.builder().id(2L).amount(200.0).storeId(1L).build();
        when(bidService.getBidsByStore(1L)).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/bids/store/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getHighestBid_found() throws Exception {
        BidDto highest = BidDto.builder()
                .id(3L)
                .amount(500.0)
                .status("WON")
                .auctionId(1L)
                .build();
        when(bidService.getHighestBid(1L)).thenReturn(Optional.of(highest));

        mockMvc.perform(get("/api/bids/auction/1/highest").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.amount").value(500.0));
    }

    @Test
    void getHighestBid_notFound_returns404() throws Exception {
        when(bidService.getHighestBid(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/bids/auction/1/highest").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
