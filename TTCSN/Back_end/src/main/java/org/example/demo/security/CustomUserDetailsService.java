package org.example.demo.security;

import org.example.demo.entity.NguoiDung;
import org.example.demo.repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * CustomUserDetailsService - Load user từ database
 * Spring Security gọi service này để tìm user khi authenticate
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    /**
     * Load user by username (ở đây username = email)
     * Spring Security tự động gọi method này khi user login
     * 
     * Validation:
     * - Check user có tồn tại không
     * - Check tài khoản có bị xóa không (isDeleted = true)
     * - Check tài khoản có bị khóa không (trangThai = false)
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Không tìm thấy người dùng với email: " + email
                ));
        
        // Check tài khoản có bị xóa không
        if (nguoiDung.getIsDeleted() != null && nguoiDung.getIsDeleted()) {
            throw new DisabledException("Tài khoản đã bị xóa. Vui lòng liên hệ admin để biết thêm chi tiết.");
        }
        
        // Check tài khoản có bị khóa không
        if (nguoiDung.getTrangThai() != null && !nguoiDung.getTrangThai()) {
            throw new DisabledException("Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ admin để biết thêm chi tiết.");
        }
        
        // ✅ CHECK: VaiTro (Role) có tồn tại không
        if (nguoiDung.getVaiTro() == null) {
            System.err.println("❌ CRITICAL ERROR: User " + email + " có VaiTro = NULL");
            System.err.println("   Có thể nguyên nhân:");
            System.err.println("   - VaiTro trong DB không match Enum (BenhNhan, BacSi, Admin)");
            System.err.println("   - Hoặc VaiTro field chưa được set khi tạo account");
            throw new UsernameNotFoundException(
                "Dữ liệu vai trò của người dùng không hợp lệ. Vui lòng liên hệ admin."
            );
        }

        return new CustomUserDetails(nguoiDung);
    }
}

