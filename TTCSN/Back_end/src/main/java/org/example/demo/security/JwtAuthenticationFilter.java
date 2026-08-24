package org.example.demo.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JwtAuthenticationFilter - Filter kiểm tra JWT token trong mỗi request
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getServletPath();
		String method = request.getMethod();

		// ✅ 1. Các API KHÔNG cần token
		if (isPublicEndpoint(path, method)) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			// 2. Lấy token từ header
			String jwt = getJwtFromRequest(request);

			// 3. Validate token
			if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {

				// 4. Lấy email từ token
				String email = jwtTokenProvider.getUsernameFromToken(jwt);

				// 5. Load user
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

				// 6. Tạo authentication
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// 7. Set vào SecurityContext
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

		} catch (Exception ex) {
			System.out.println("❌ JWT Error: " + ex.getMessage());
		}

		// 8. Continue filter
		filterChain.doFilter(request, response);
	}

	/**
	 * ✅ Xác định endpoint public (không cần token)
	 */
	private boolean isPublicEndpoint(String path, String method) {
		return
		// Swagger
		path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") ||

		// Auth
				path.startsWith("/api/auth") ||

				// VNPay
				path.startsWith("/api/payments/vnpay") ||

				// 👇 GET cơ sở y tế
				("GET".equalsIgnoreCase(method) && path.startsWith("/co-so-y-te"));
	}

	/**
	 * Lấy JWT từ header Authorization
	 */
	private String getJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");

		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}

		return null;
	}
}