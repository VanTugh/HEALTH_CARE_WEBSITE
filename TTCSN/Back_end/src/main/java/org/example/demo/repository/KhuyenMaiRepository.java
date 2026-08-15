package org.example.demo.repository;

import org.example.demo.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Integer> {
    Optional<KhuyenMai> findByMaVoucherAndIsDeletedFalse(String maVoucher);
}
