package org.example.demo.repository;

import org.example.demo.entity.BaiViet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiVietRepository extends JpaRepository<BaiViet, Integer> {
    List<BaiViet> findByIsDeletedFalseOrderByCreatedAtDesc();
    List<BaiViet> findByPhanLoaiAndIsDeletedFalseOrderByCreatedAtDesc(String phanLoai);
}
