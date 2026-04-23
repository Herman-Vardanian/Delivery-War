package com.delivery.auction.controller;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.service.AuctionService;
import com.delivery.common.exception.ResourceNotFoundException;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuctionController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuctionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuctionService auctionService;

    @Test
    void createAuction_returnsCreated() throws Exception {
        AuctionDto input = AuctionDto.builder()
                .startPrice(10.0f)
                .startTime(LocalDateTime.of(2026, 4, 23, 10, 0))
                .endTime(LocalDateTime.of(2026, 4, 23, 11, 0))
                .build();

        AuctionDto saved = AuctionDto.builder()
                .id(1L)
                .startPrice(10.0f)
                .startTime(input.getStartTime())
                .endTime(input.getEndTime())
                .build();

        when(auctionService.createAuction(any(AuctionDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/auctions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.startPrice").value(10.0));
    }

    @Test
    void getAuction_found() throws Exception {
        AuctionDto dto = AuctionDto.builder()
                .id(2L)
                .startPrice(15.5f)
                .build();

        when(auctionService.getAuction(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/auctions/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.startPrice").value(15.5));
    }

    @Test
    void getAuction_notFound_returns404() throws Exception {
        when(auctionService.getAuction(100L))
                .thenThrow(new ResourceNotFoundException("Auction not found with id: 100"));

        mockMvc.perform(get("/api/auctions/100").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void listAuctions_returnsList() throws Exception {
        AuctionDto a = AuctionDto.builder().id(1L).startPrice(10.0f).build();
        AuctionDto b = AuctionDto.builder().id(2L).startPrice(20.0f).build();

        when(auctionService.listAuctions()).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/auctions").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void updateAuction_returnsUpdated() throws Exception {
        AuctionDto dto = AuctionDto.builder()
                .id(3L)
                .startPrice(99.9f)
                .build();

        when(auctionService.updateAuction(eq(3L), any(AuctionDto.class))).thenReturn(dto);

        mockMvc.perform(put("/api/auctions/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.startPrice").value(99.9));
    }
}