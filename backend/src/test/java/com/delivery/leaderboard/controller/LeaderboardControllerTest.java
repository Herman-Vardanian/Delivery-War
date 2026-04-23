package com.delivery.leaderboard.controller;

import com.delivery.store.dto.StoreDto;
import com.delivery.store.service.StoreService;
import com.delivery.auth.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = LeaderboardController.class)
@AutoConfigureMockMvc(addFilters = false)
public class LeaderboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private StoreService storeService;

    @Test
    void getLeaderboard_returnsTop5Stores() throws Exception {
        StoreDto s1 = StoreDto.builder()
                .id(1L)
                .name("Store1")
                .totalSpent(new BigDecimal("100.00"))
                .build();

        StoreDto s2 = StoreDto.builder()
                .id(2L)
                .name("Store2")
                .totalSpent(new BigDecimal("80.00"))
                .build();

        StoreDto s3 = StoreDto.builder()
                .id(3L)
                .name("Store3")
                .totalSpent(new BigDecimal("50.00"))
                .build();

        StoreDto s4 = StoreDto.builder()
                .id(4L)
                .name("Store4")
                .totalSpent(new BigDecimal("30.00"))
                .build();

        StoreDto s5 = StoreDto.builder()
                .id(5L)
                .name("Store5")
                .totalSpent(new BigDecimal("10.00"))
                .build();

        when(storeService.getStoreLeaderboard()).thenReturn(Arrays.asList(s1, s2, s3, s4, s5));

        mockMvc.perform(get("/api/leaderboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Store1"))
                .andExpect(jsonPath("$[0].totalSpent").value(100.0))
                .andExpect(jsonPath("$[4].id").value(5))
                .andExpect(jsonPath("$[4].name").value("Store5"));
    }

    @Test
    void getLeaderboard_emptyList_returnsEmptyArray() throws Exception {
        when(storeService.getStoreLeaderboard()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/leaderboard").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}