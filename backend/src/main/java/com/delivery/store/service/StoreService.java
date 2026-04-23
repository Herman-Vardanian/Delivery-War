package com.delivery.store.service;

import com.delivery.common.exception.ResourceNotFoundException;
import com.delivery.store.dto.StoreDto;
import com.delivery.store.entity.Store;
import com.delivery.store.mapper.StoreMapper;
import com.delivery.store.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoreService {

    private final StoreRepository repository;
    private final StoreMapper mapper;

    public StoreService(StoreRepository repository, StoreMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public StoreDto createStore(StoreDto dto) {
        Store s = mapper.toEntity(dto);
        // Forcer les valeurs par défaut à la création
        s.setRole(com.delivery.store.entity.Role.STORE);
        s.setBalance(BigDecimal.ZERO);
        s.setReservedBalance(BigDecimal.ZERO);
        s.setTotalSpent(BigDecimal.ZERO);
        if (s.getWhalePass() == null) {
            s.setWhalePass(Boolean.FALSE);
        }
        Store saved = repository.save(s);
        return mapper.toDto(saved);
    }

    public StoreDto getStore(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + id));
    }

    public List<StoreDto> getStoreLeaderboard(){
        List<Store> topStores = repository.findTop5ByOrderByTotalSpentDesc();
        return topStores.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StoreDto> listStores() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public StoreDto updateStore(Long id, StoreDto dto) {
        Store existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + id));
        if (dto.getName() != null)
            existing.setName(dto.getName());
        if (dto.getPassword() != null)
            existing.setPassword(dto.getPassword());
        if (dto.getRole() != null) {
            try {
                existing.setRole(com.delivery.store.entity.Role.valueOf(dto.getRole()));
            } catch (IllegalArgumentException ex) {
                // ignore invalid role
            }
        }
        if (dto.getEmail() != null)
            existing.setEmail(dto.getEmail());
        if (dto.getAddress() != null)
            existing.setAddress(dto.getAddress());
        if (dto.getBalance() != null)
            existing.setBalance(dto.getBalance());
        if (dto.getReservedBalance() != null)
            existing.setReservedBalance(dto.getReservedBalance());
        if (dto.getTotalSpent() != null)
            existing.setTotalSpent(dto.getTotalSpent());
        if (dto.getWhalePass() != null)
            existing.setWhalePass(dto.getWhalePass());
        if (dto.getPassId() != null)
            existing.setPassId(dto.getPassId());
        Store saved = repository.save(existing);
        return mapper.toDto(saved);
    }

    public void deleteStore(Long id) {
        Store existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + id));
        if (existing.getReservedBalance() != null && existing.getReservedBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Impossible de supprimer un store avec des fonds réservés.");
        }
        if (existing.getBalance() != null && existing.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalArgumentException("Impossible de supprimer un store avec un solde non nul.");
        }
        repository.delete(existing);
    }
}
