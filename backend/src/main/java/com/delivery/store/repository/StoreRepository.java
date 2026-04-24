package com.delivery.store.repository;

import com.delivery.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByName(String name);
    List<Store> findTop5ByOrderByTotalSpentDesc();
    List<Store> findByWhalePassTrueAndWhalePassExpiryLessThanEqual(LocalDateTime now);
}
