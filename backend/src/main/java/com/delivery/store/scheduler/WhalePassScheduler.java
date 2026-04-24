package com.delivery.store.scheduler;

import com.delivery.store.entity.Store;
import com.delivery.store.repository.StoreRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WhalePassScheduler {

    private static final BigDecimal WHALE_PRICE = new BigDecimal("199");

    private final StoreRepository storeRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WhalePassScheduler(StoreRepository storeRepository, SimpMessagingTemplate messagingTemplate) {
        this.storeRepository = storeRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void renewOrCancelExpiredPasses() {
        LocalDateTime now = LocalDateTime.now();
        List<Store> expired = storeRepository.findByWhalePassTrueAndWhalePassExpiryLessThanEqual(now);

        for (Store store : expired) {
            if (store.getBalance() != null && store.getBalance().compareTo(WHALE_PRICE) >= 0) {
                store.setBalance(store.getBalance().subtract(WHALE_PRICE));
                store.setTotalSpent(store.getTotalSpent() != null ? store.getTotalSpent().add(WHALE_PRICE) : WHALE_PRICE);
                store.setWhalePassExpiry(now.plusMinutes(30));
            } else {
                store.setWhalePass(false);
                store.setWhalePassExpiry(null);
            }
            storeRepository.save(store);

            Map<String, Object> payload = new HashMap<>();
            payload.put("balance", store.getBalance());
            payload.put("reservedBalance", store.getReservedBalance());
            payload.put("whalePass", store.getWhalePass());
            payload.put("whalePassExpiry", store.getWhalePassExpiry() != null ? store.getWhalePassExpiry().toString() : null);
            messagingTemplate.convertAndSend("/queue/store/" + store.getId() + "/balance", payload);
        }
    }
}
