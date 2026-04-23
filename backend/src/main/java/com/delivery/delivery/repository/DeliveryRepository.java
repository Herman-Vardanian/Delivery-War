package com.delivery.delivery.repository;

import com.delivery.delivery.entity.Delivery;
import com.delivery.store.entity.Store;
import com.delivery.deliveryslot.entity.DeliverySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    List<Delivery> findByStore(Store store);
    
    List<Delivery> findByDeliverySlot(DeliverySlot deliverySlot);
}
