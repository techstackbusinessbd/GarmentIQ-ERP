package com.garments.erp.core.config;

import com.garments.erp.core.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
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

import java.util.List;

/**
 * =============================================================================
 * [EN] Stateless Security Filter Chain Configuration with JWT & Multi-Tenancy
 * [BN] জেডব্লিউটি ও মাল্টি-টেন্যান্সিসহ স্টেটলেস স্প্রিং সিকিউরিটি কনফিগারেশন
 * =============================================================================
 * [EN] Configures Spring Security 6 filter chain with disabled CSRF (safe for pure
 *      stateless JWT APIs), STATELESS session management, whitelisted endpoints,
 *      and intercepts requests via JwtAuthenticationFilter for tenant resolution.
 * [BN] স্প্রিং সিকিউরিটি ৬-এর ফিল্টার চেইন কনফিগার করে—যাতে স্টেটলেস JWT-এর জন্য CSRF
 *      নিষ্ক্রিয় রাখা হয়েছে, সেশন সম্পূর্ণ স্টেটলেস এবং JwtAuthenticationFilter
 *      দ্বারা টোকেন যাচাই ও টেন্যান্ট আইসোলেশন নিশ্চিত করা হয়েছে।
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param jwtAuthFilter [EN] JWT token validation and tenant filter / [BN] জেডব্লিউটি টোকেন যাচাই ও টেন্যান্ট ফিল্টার
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * [EN] Defines the primary HTTP security filter chain bean
     * [BN] মূল HTTP সিকিউরিটি ফিল্টার চেইন বিন সংজ্ঞায়িত করে
     *
     * @param http [EN] HttpSecurity configuration builder / [BN] HttpSecurity কনফিগারেশন অবজেক্ট
     * @return [EN] Built SecurityFilterChain / [BN] সিকিউরিটি ফিল্টার চেইন ইনস্ট্যান্স
     * @throws Exception [EN] On configuration syntax failure / [BN] কনফিগারেশন ব্যর্থ হলে এক্সেপশন
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // [EN] Enable CORS with defined configuration source
                // [BN] সংজ্ঞায়িত কনফিগারেশন উৎস সহ CORS সক্রিয়করণ
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // [EN] Disable CSRF because REST clients use stateless Bearer tokens
                // [BN] CSRF নিষ্ক্রিয় করা হলো কারণ REST ক্লায়েন্ট স্টেটলেস Bearer টোকেন ব্যবহার করে
                .csrf(csrf -> csrf.disable())

                // [EN] Enforce stateless session policy (No HTTP sessions created on server)
                // [BN] স্টেটলেস সেশন নীতি প্রয়োগ করা হলো (সার্ভারে কোনো HTTP সেশন তৈরি হবে না)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // [EN] Whitelist public documentation, health checks, and auth endpoints
                // [BN] পাবলিক ডকুমেন্টেশন, হেলথচেক এবং লগইন অ্যান্ডপয়েন্ট অনুমোদন করা হলো
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/actuator/**",
                                "/api/v1/auth/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // [EN] Attach JWT authentication and tenant-context filter before UsernamePasswordAuthenticationFilter
                // [BN] ইউজারনেম-পাসওয়ার্ড ফিল্টারের পূর্বে জেডব্লিউটি ও টেন্যান্ট কনটেক্সট ফিল্টার যুক্ত করা হলো
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * [EN] Exposes Spring AuthenticationManager bean for credentials verification
     * [BN] ক্রেডেনশিয়াল যাচাইয়ের জন্য স্প্রিং AuthenticationManager বিন এক্সপোজ করে
     *
     * @param authConfig [EN] Authentication configuration / [BN] অথেনটিকেশন কনফিগারেশন
     * @return [EN] AuthenticationManager instance / [BN] AuthenticationManager ইনস্ট্যান্স
     * @throws Exception [EN] On retrieval failure / [BN] ব্যর্থ হলে এক্সেপশন
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * [EN] Cryptographic password encoder bean utilizing BCrypt with standard 10 salt rounds
     * [BN] ক্রিপ্টোগ্রাফিক পাসওয়ার্ড এনকোডার বিন—স্ট্যান্ডার্ড ১০ সল্ট রাউন্ডের BCrypt অ্যালগরিদম ব্যবহার করে
     *
     * @return [EN] BCryptPasswordEncoder instance / [BN] BCryptPasswordEncoder ইনস্ট্যান্স
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * [EN] Production CORS configuration allowing enterprise browser clients
     * [BN] এন্টারপ্রাইজ ব্রাউজার ক্লায়েন্টদের জন্য প্রডাকশন CORS কনফিগারেশন
     *
     * @return [EN] Configured CorsConfigurationSource / [BN] কনফিগার করা CORS সোর্স
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://*.localhost:*",
                "http://127.0.0.1:*",
                "http://[::1]:*",
                "https://*.garmentiq.com",
                "https://garmentiq.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "X-Tenant-ID", "X-Tenant-Subdomain"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

