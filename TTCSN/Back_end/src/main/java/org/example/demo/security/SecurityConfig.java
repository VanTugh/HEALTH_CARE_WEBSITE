package org.example.demo.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * SecurityConfig - Cấu hình bảo mật cho toàn bộ ứng dụng
 *
 * Chức năng: 1. Cấu hình password encoder (BCrypt) 2. Cấu hình authentication
 * manager 3. Cấu hình authorization (ai được truy cập API nào) 4. Cấu hình JWT
 * filter 5. Disable CSRF (vì dùng JWT, không cần CSRF token) 6. Stateless
 * session (không lưu session trên server) 7. Bật CORS để frontend có thể gọi
 * API
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable @PreAuthorize annotation
public class SecurityConfig {

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	/**
	 * Password Encoder Bean Dùng BCrypt để hash password (strength = 12)
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}

	/**
	 * Authentication Provider Kết nối UserDetailsService và PasswordEncoder
	 */
	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(customUserDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	/**
	 * Authentication Manager Bean Dùng để authenticate user trong AuthService
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	/**
	 * Cấu hình CORS để frontend có thể gọi API
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(List.of("http://localhost:5173",
				"https://jurally-sprightful-booker.ngrok-free.dev", "https://ttcsn-one.vercel.app/"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration
				.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "ngrok-skip-browser-warning"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	/**
	 * Security Filter Chain Cấu hình authorization và filters
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				// Bật CORS
				.cors().and()
				// Disable CSRF (không cần vì dùng JWT)
				.csrf(csrf -> csrf.disable())

				// Configure exception handling
				.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

				// Stateless session (không lưu session)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// Configure authorization
				.authorizeHttpRequests(auth -> auth

						// ✅ VNPay
						.requestMatchers("/api/payments/vnpay/return", "/api/payments/vnpay/ipn").permitAll()

				// ✅ Auth + Swagger + Test Endpoints
				.requestMatchers("/api/auth/**", "/api/info", "/swagger-ui/**", "/v3/api-docs/**",
						"/swagger-ui.html", "/api/bookings/test/**")
				.permitAll()

						// ✅ Public GET endpoints
						.requestMatchers(org.springframework.http.HttpMethod.GET, "/api/specialties/**",
								"/api/degrees/**", "/api/doctors/**",

								// 👇 QUAN TRỌNG: mở GET cho cơ sở y tế
								"/co-so-y-te/**")
						.permitAll()

						// ❗ Các method khác (POST, PUT, DELETE) vẫn cần login
						.anyRequest().authenticated());

		// Add JWT authentication filter
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}