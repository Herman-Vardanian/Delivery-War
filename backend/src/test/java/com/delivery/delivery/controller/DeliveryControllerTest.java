package com.delivery.delivery.controller;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.delivery.dto.DeliveryDto;
import com.delivery.delivery.service.DeliveryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = DeliveryController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DeliveryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DeliveryService deliveryService;

    @Test
    void createDelivery_returnsOk() throws Exception {
        DeliveryDto input = DeliveryDto.builder()
                .address("123 Test St")
                .deliveryCompany("UPS")
                .storeId(1L)
                .deliverySlotId(1L)
                .build();
        
        DeliveryDto saved = DeliveryDto.builder()
                .id(1L)
                .address("123 Test St")
                .status("PENDING")
                .deliveryCompany("UPS")
                .storeId(1L)
                .deliverySlotId(1L)
                .storeName("TestStore")
                .build();

        when(deliveryService.createDelivery(any(DeliveryDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/deliveries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.address").value("123 Test St"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.deliveryCompany").value("UPS"));
    }

    @Test
    void getDelivery_found() throws Exception {
        DeliveryDto dto = DeliveryDto.builder()
                .id(2L)
                .address("456 Delivery Ave")
                .status("IN_PROGRESS")
                .deliveryCompany("FedEx")
                .build();
        when(deliveryService.getDelivery(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/deliveries/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.address").value("456 Delivery Ave"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.deliveryCompany").value("FedEx"));
    }

    @Test
    void getDelivery_notFound_returns404() throws Exception {
        when(deliveryService.getDelivery(100L)).thenThrow(new ResourceNotFoundException("Delivery not found: 100"));

        mockMvc.perform(get("/api/deliveries/100").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void listDeliveries_returnsList() throws Exception {
        DeliveryDto a = DeliveryDto.builder().id(1L).address("Address A").build();
        DeliveryDto b = DeliveryDto.builder().id(2L).address("Address B").build();
        when(deliveryService.listDeliveries()).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/deliveries").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getDeliveriesByStore_returnsList() throws Exception {
        DeliveryDto a = DeliveryDto.builder().id(1L).address("Address A").storeId(1L).build();
        DeliveryDto b = DeliveryDto.builder().id(2L).address("Address B").storeId(1L).build();
        when(deliveryService.getDeliveriesByStore(1L)).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/deliveries/store/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getDeliveriesByDeliverySlot_returnsList() throws Exception {
        DeliveryDto a = DeliveryDto.builder().id(1L).address("Address A").deliverySlotId(1L).build();
        DeliveryDto b = DeliveryDto.builder().id(2L).address("Address B").deliverySlotId(1L).build();
        when(deliveryService.getDeliveriesByDeliverySlot(1L)).thenReturn(Arrays.asList(a, b));

        mockMvc.perform(get("/api/deliveries/delivery-slot/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
