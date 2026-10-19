package com.garments.erp.auth.service;

import com.garments.erp.auth.dto.LoginRequest;
import com.garments.erp.auth.dto.LoginResponse;
import com.garments.erp.auth.dto.RefreshTokenRequest;
import com.garments.erp.core.security.CustomUserDetailsService;
import com.garments.erp.core.security.CustomUserPrincipal;
import com.garments.erp.core.security.JwtProperties;
import com.garments.erp.core.security.JwtTokenProvider;
import com.garments.erp.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Authentication Service
 * [BN] অথেনটিকেশন সার্ভিসের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Validates credential verification flow, signed token pair issuance,
 *      bad credentials handling, and silent token refreshing mechanics.
 * [BN] ক্রেডেনশিয়াল যাচাই প্রবাহ, সাইনড টোকেন পেয়ার প্রদান, ভুল পাসওয়ার্ড
 *      প্রতিরোধ এবং রিফ্রেশ টোকেন নবায়ন কার্যপদ্ধতি নিখুঁতভাবে পরীক্ষা করে।
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private CustomUserPrincipal samplePrincipal;
    private UUID sampleUserId;
    private UUID sampleTenantId;

    @BeforeEach
    void setUp() {
        sampleUserId = UUID.randomUUID();
        sampleTenantId = UUID.randomUUID();

        samplePrincipal = new CustomUserPrincipal(
                sampleUserId,
                sampleTenantId,
                "tanvir.pm",
                "encodedHash",
                "tanvir@textech.com",
                "Tanvir Ahmed",
                List.of(new SimpleGrantedAuthority("ROLE_MERCHANDISER")),
                true
        );
    }

    /**
     * [EN] Tests successful login issuing valid access token and refresh token
     * [BN] সঠিক ইউজারনেম ও পাসওয়ার্ডে সফল লগইন ও টোকেন প্রদান পরীক্ষা
     */
    @Test
    @DisplayName("Should successfully authenticate and return token pair on valid credentials")
    void testSuccessfulLogin() {
        LoginRequest request = new LoginRequest("tanvir.pm", "ValidPassword123!");

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(samplePrincipal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        when(jwtProperties.getExpirationMs()).thenReturn(28_800_000L);
        when(tokenProvider.generateAccessToken(eq(sampleUserId), eq(sampleTenantId), eq("tanvir.pm"),
                eq("tanvir@textech.com"), any(), any()))
                .thenReturn("mocked.access.jwt");
        when(tokenProvider.generateRefreshToken(eq(sampleUserId), eq("tanvir.pm")))
                .thenReturn("mocked.refresh.jwt");

        LoginResponse response = authService.login(request);

        assertNotNull(response, "LoginResponse must not be null");
        assertEquals("mocked.access.jwt", response.getAccessToken());
        assertEquals("mocked.refresh.jwt", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("tanvir.pm", response.getUser().getUsername());
        assertTrue(response.getUser().getRoles().contains("ROLE_MERCHANDISER"));
    }

    /**
     * [EN] Tests that bad credentials throw BadCredentialsException
     * [BN] ভুল পাসওয়ার্ডে BadCredentialsException নিক্ষিপ্ত হওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should throw BadCredentialsException when authentication fails")
    void testFailedLoginBadCredentials() {
        LoginRequest request = new LoginRequest("tanvir.pm", "WrongPassword!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request),
                "Must throw BadCredentialsException on authentication failure");
    }

    /**
     * [EN] Tests silent token refreshing with valid refresh token
     * [BN] বৈধ রিফ্রেশ টোকেন দিয়ে নতুন এক্সেস টোকেন পাওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should issue new token pair when valid refresh token is supplied")
    void testRefreshTokenSuccess() {
        RefreshTokenRequest request = new RefreshTokenRequest("valid.refresh.token");

        when(tokenProvider.validateToken("valid.refresh.token")).thenReturn(true);
        when(tokenProvider.getUsernameFromToken("valid.refresh.token")).thenReturn("tanvir.pm");
        when(userDetailsService.loadUserByUsername("tanvir.pm")).thenReturn(samplePrincipal);

        when(jwtProperties.getExpirationMs()).thenReturn(28_800_000L);
        when(tokenProvider.generateAccessToken(eq(sampleUserId), eq(sampleTenantId), eq("tanvir.pm"),
                eq("tanvir@textech.com"), any(), any()))
                .thenReturn("new.mocked.access.jwt");
        when(tokenProvider.generateRefreshToken(eq(sampleUserId), eq("tanvir.pm")))
                .thenReturn("new.mocked.refresh.jwt");

        LoginResponse response = authService.refreshToken(request);

        assertNotNull(response, "Refreshed LoginResponse must not be null");
        assertEquals("new.mocked.access.jwt", response.getAccessToken());
        assertEquals("new.mocked.refresh.jwt", response.getRefreshToken());
    }
}
