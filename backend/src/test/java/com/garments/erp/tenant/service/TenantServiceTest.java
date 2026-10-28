package com.garments.erp.tenant.service;

import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.dto.CreateTenantRequest;
import com.garments.erp.tenant.dto.TenantDto;
import com.garments.erp.tenant.service.TenantBootstrapService;
import com.garments.erp.tenant.entity.Tenant;
import com.garments.erp.tenant.repository.TenantRepository;
import com.garments.erp.user.repository.UserRepository;
import com.garments.erp.settings.service.SystemAuditLogService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * =============================================================================
 * [EN] Tenant Service Unit Tests (Rule 24 Auto-Code Generation)
 * [BN] টেন্যান্ট সার্ভিস ইউনিট টেস্ট (রুল ২৪ অটো-কোড জেনারেশন)
 * =============================================================================
 */
@ExtendWith(MockitoExtension.class)
class TenantServiceTest {

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TenantBootstrapService tenantBootstrapService;

    @Mock
    private SystemAuditLogService auditLogService;

    @InjectMocks
    private TenantService tenantService;

    private CreateTenantRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateTenantRequest();
        request.setTenantName("Ha-Meem Denim Mills Ltd.");
        request.setContactEmail("admin@hameem.com");
        request.setSubscriptionTier("ENTERPRISE");
    }

    @Test
    @DisplayName("[EN] Should auto-generate unique tenant code conforming to CLT-{SEQ:4} when omitted (Rule 24)")
    void testAutoGenerateTenantCodeWhenOmitted() {
        request.setTenantCode(null);

        when(tenantRepository.existsByTenantCode("CLT-0001")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(invocation -> {
            Tenant t = invocation.getArgument(0);
            return new Tenant(t.getTenantCode(), t.getTenantName(), t.getContactEmail());
        });

        TenantDto result = tenantService.createTenant(request);

        assertNotNull(result);
        assertEquals("CLT-0001", result.getTenantCode());
        assertEquals("Ha-Meem Denim Mills Ltd.", result.getTenantName());
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    @DisplayName("[EN] Should resolve collision by incrementing sequence to CLT-0002 (Rule 24)")
    void testAutoGenerateTenantCodeWithCollision() {
        request.setTenantCode(null);

        when(tenantRepository.existsByTenantCode("CLT-0001")).thenReturn(true);
        when(tenantRepository.existsByTenantCode("CLT-0002")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(invocation -> {
            Tenant t = invocation.getArgument(0);
            return new Tenant(t.getTenantCode(), t.getTenantName(), t.getContactEmail());
        });

        TenantDto result = tenantService.createTenant(request);

        assertNotNull(result);
        assertEquals("CLT-0002", result.getTenantCode());
    }

    @Test
    @DisplayName("[EN] Should atomically provision Client Admin user when admin credentials provided")
    void testCreateTenantWithClientAdminProvisioning() {
        request.setTenantCode("CLT-0005");
        request.setSubdomain("hameem");
        request.setCompanyType("GROUP_OF_COMPANIES");
        request.setAdminUsername("hameem.admin");
        request.setAdminPassword("Password@123");
        request.setAdminFullName("A. K. Azad");
        request.setAdminEmail("admin@hameem.com");

        when(tenantRepository.existsByTenantCode("CLT-0005")).thenReturn(false);
        when(tenantRepository.existsBySubdomainIgnoreCaseAndIsDeletedFalse("hameem")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPasswordHash");

        TenantDto result = tenantService.createTenant(request);

        assertNotNull(result);
        assertEquals("CLT-0005", result.getTenantCode());
        assertEquals("GROUP_OF_COMPANIES", result.getCompanyType());
        assertEquals("hameem", result.getSubdomain());
        verify(userRepository).save(any());
    }
}
