package com.delivery.deliverySlot.controller;

import com.delivery.deliverySlot.dto.DeliverySlotDto;
import com.delivery.deliverySlot.entity.DeliverySlotStatus;
import com.delivery.deliverySlot.service.DeliverySlotService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import com.delivery.auth.JwtUtil;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = DeliverySlotController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DeliverySlotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private DeliverySlotService deliverySlotService;

    private static final String START = "2024-06-01T09:00:00";
    private static final String END   = "2024-06-01T11:00:00";

    // ------------------------------------------------------------------ POST /api/deliverySlots

    @Test
    void createDeliverySlot_returnsOk() throws Exception {
        DeliverySlotDto input = DeliverySlotDto.builder()
                .startTime(START)
                .endTime(END)
                .capacity(10)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlotDto saved = DeliverySlotDto.builder()
                .id(1L)
                .startTime(START)
                .endTime(END)
                .capacity(10)
                .status(DeliverySlotStatus.OPEN)
                .build();

        when(deliverySlotService.save(any(DeliverySlotDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/deliverySlots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.capacity").value(10))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    // ------------------------------------------------------------------ GET /api/deliverySlots/{id}

    @Test
    void getDeliverySlot_found_returnsOk() throws Exception {
        DeliverySlotDto dto = DeliverySlotDto.builder()
                .id(2L)
                .startTime(START)
                .endTime(END)
                .capacity(5)
                .status(DeliverySlotStatus.PENDING)
                .build();

        when(deliverySlotService.findById(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/deliverySlots/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.capacity").value(5))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getDeliverySlot_notFound_returnsOk_withNullBody() throws Exception {
        when(deliverySlotService.findById(99L)).thenReturn(null);

        // Le service renvoie null → le controller fait ResponseEntity.ok(null)
        mockMvc.perform(get("/api/deliverySlots/99").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ------------------------------------------------------------------ GET /api/deliverySlots

    @Test
    void listDeliverySlots_returnsList() throws Exception {
        DeliverySlotDto slot1 = DeliverySlotDto.builder()
                .id(1L).startTime(START).endTime(END).capacity(10).status(DeliverySlotStatus.OPEN).build();
        DeliverySlotDto slot2 = DeliverySlotDto.builder()
                .id(2L).startTime(START).endTime(END).capacity(5).status(DeliverySlotStatus.CLOSED).build();

        when(deliverySlotService.findAll()).thenReturn(Arrays.asList(slot1, slot2));

        mockMvc.perform(get("/api/deliverySlots").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void listDeliverySlots_emptyList() throws Exception {
        when(deliverySlotService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/deliverySlots").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // ------------------------------------------------------------------ PUT /api/deliverySlots/{id}

    @Test
    void updateDeliverySlot_returnsOk() throws Exception {
        DeliverySlotDto input = DeliverySlotDto.builder()
                .id(3L)
                .startTime(START)
                .endTime(END)
                .capacity(12)
                .status(DeliverySlotStatus.OPEN)
                .build();

        DeliverySlotDto updated = DeliverySlotDto.builder()
                .id(3L)
                .startTime(START)
                .endTime(END)
                .capacity(12)
                .status(DeliverySlotStatus.OPEN)
                .build();

        when(deliverySlotService.save(any(DeliverySlotDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/deliverySlots/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.capacity").value(12));
    }

    // ------------------------------------------------------------------ DELETE /api/deliverySlots/{id}

    @Test
    void deleteDeliverySlot_returnsOk() throws Exception {
        doNothing().when(deliverySlotService).deleteById(1L);

        mockMvc.perform(delete("/api/deliverySlots/1"))
                .andExpect(status().isOk());

        verify(deliverySlotService).deleteById(1L);
    }
}
