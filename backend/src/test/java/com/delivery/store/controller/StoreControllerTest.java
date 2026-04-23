package com.delivery.store.controller;

import com.delivery.common.exception.GlobalExceptionHandler;
import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.store.dto.StoreDto;
import com.delivery.store.service.StoreService;
import com.delivery.bid.service.BidService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = StoreController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
public class StoreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StoreService storeService;

    @MockBean
    private BidService bidService;

    @Test
    void createStore_returnsOk() throws Exception {
        StoreDto input = StoreDto.builder().name("Shop").password("pwd").role("STORE").build();
        StoreDto saved = StoreDto.builder().id(1L).name("Shop").password("pwd").role("STORE")
                .balance(BigDecimal.ZERO).reservedBalance(BigDecimal.ZERO).totalSpent(BigDecimal.ZERO).build();

        when(storeService.createStore(any(StoreDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/stores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Shop"));
    }

    @Test
    void getStore_found() throws Exception {
        StoreDto dto = StoreDto.builder().id(2L).name("Test").build();
        when(storeService.getStore(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/stores/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Test"));
    }

    @Test
    void getStore_notFound_returns404() throws Exception {
        when(storeService.getStore(100L)).thenThrow(new ResourceNotFoundException("Store not found: 100"));

        mockMvc.perform(get("/api/stores/100").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void listStores_returnsList() throws Exception {
        StoreDto a = StoreDto.builder().id(1L).name("A").build();
        StoreDto b = StoreDto.builder().id(2L).name("B").build();
        when(storeService.listStores()).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/stores").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void updateStore_returnsUpdated() throws Exception {
        StoreDto dto = StoreDto.builder().id(3L).name("Updated").build();
        when(storeService.updateStore(eq(3L), any(StoreDto.class))).thenReturn(dto);

        mockMvc.perform(put("/api/stores/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }

    @Test
    void deleteStore_returnsNoContent() throws Exception {
        doNothing().when(storeService).deleteStore(4L);

        mockMvc.perform(delete("/api/stores/4"))
                .andExpect(status().isNoContent());

        verify(storeService).deleteStore(4L);
    }
}
