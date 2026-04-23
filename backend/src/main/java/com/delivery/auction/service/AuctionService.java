package com.delivery.auction.service;

import com.delivery.auction.dto.AuctionDto;
import com.delivery.auction.entity.Auction;
import com.delivery.auction.entity.AuctionStatus;
import com.delivery.auction.mapper.AuctionMapper;
import com.delivery.auction.repository.AuctionRepository;
import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.deliverySlot.entity.DeliverySlot;
import com.delivery.deliverySlot.repository.DeliverySlotRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuctionService {

    private final AuctionRepository repository;
    private final AuctionMapper mapper;
    private final DeliverySlotRepository deliverySlotRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AuctionService(AuctionRepository repository,
            AuctionMapper mapper,
            DeliverySlotRepository deliverySlotRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.mapper = mapper;
        this.deliverySlotRepository = deliverySlotRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public AuctionDto createAuction(AuctionDto dto) {
        validateAuctionTimes(dto.getStartTime(), dto.getEndTime());

        DeliverySlot slot = deliverySlotRepository.findById(dto.getDeliverySlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found"));

        Auction auction = mapper.toEntity(dto, slot);
        auction.setId(null);

        if (auction.getStatus() == null) {
            auction.setStatus(AuctionStatus.OPEN);
        }

        Auction saved = repository.save(auction);

        // Broadcast updated list to all connected clients
        List<AuctionDto> allAuctions = repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
        messagingTemplate.convertAndSend("/topic/auctions", allAuctions);

        return mapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public AuctionDto getAuction(Long id) {
        Auction auction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + id));
        return mapper.toDto(auction);
    }

    @Transactional(readOnly = true)
    public List<AuctionDto> listAuctions() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public AuctionDto updateAuction(Long id, AuctionDto dto) {
        validateAuctionTimes(dto.getStartTime(), dto.getEndTime());

        Auction auction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with id: " + id));

        DeliverySlot slot = null;
        if (dto.getDeliverySlotId() != null) {
            slot = deliverySlotRepository.findById(dto.getDeliverySlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found"));
        }

        auction.setStartPrice(dto.getStartPrice());
        auction.setStartTime(LocalDateTime.parse(dto.getStartTime()));
        auction.setEndTime(LocalDateTime.parse(dto.getEndTime()));
        auction.setStatus(dto.getStatus());

        if (slot != null) {
            auction.setDeliverySlot(slot);
        }

        Auction saved = repository.save(auction);
        return mapper.toDto(saved);
    }

    private void validateAuctionTimes(String startTimeStr, String endTimeStr) {
        if (startTimeStr == null || endTimeStr == null) {
            throw new IllegalArgumentException("startTime and endTime must not be null");
        }

        LocalDateTime start = LocalDateTime.parse(startTimeStr);
        LocalDateTime end = LocalDateTime.parse(endTimeStr);

        if (!start.isBefore(end)) {
            throw new IllegalArgumentException("Auction startTime must be before endTime");
        }
    }
}
