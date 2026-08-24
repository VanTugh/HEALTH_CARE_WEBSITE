package org.example.demo.repository;

import org.example.demo.entity.NguoiThan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NguoiThanRepository extends JpaRepository<NguoiThan, Integer> {
    List<NguoiThan> findByNguoiDung_NguoiDungIDAndIsDeletedFalse(Integer nguoiDungID);
}
