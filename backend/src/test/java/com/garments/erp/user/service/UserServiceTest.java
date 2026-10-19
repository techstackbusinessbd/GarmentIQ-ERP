package com.garments.erp.user.service;

import com.garments.erp.auth.entity.Role;
import com.garments.erp.auth.repository.RoleRepository;
import com.garments.erp.tenant.context.TenantContext;
import com.garments.erp.user.dto.CreateUserRequest;
import com.garments.erp.user.dto.UserDto;
import com.garments.erp.user.entity.User;
import com.garments.erp.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Multi-Tenant User Management Service
 * [BN] মাল্টি-টেন্যান্ট ইউজার ম্যানেজমেন্ট সার্ভিসের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Tests user provisioning, duplicate username prevention, role mapping,
 *      profile updates, and safe soft-deletion within tenant boundaries.
 * [BN] ইউজার নিবন্ধন, ডুপ্লিকেট ইউজারনেম প্রতিরোধ, রোল ম্যাপিং, প্রোফাইল হালনাগাদ
 *      এবং নিরাপদ সফট-ডিলিটের কার্যকারিতা পরীক্ষা করে।
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UUID tenantId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        userId = UUID.randomUUID();
        TenantContext.setTenantId(tenantId);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    /**
     * [EN] Tests retrieving all users for current tenant
     * [BN] বর্তমান টেন্যান্টের সকল সক্রিয় ইউজার তালিকা পাওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should retrieve all active users belonging to current tenant")
    void testGetAllUsers() {
        User user1 = new User(tenantId, "tanvir", "t@tex.com", "hash", "Tanvir Ahmed");
        User user2 = new User(tenantId, "ariful", "a@tex.com", "hash", "Ariful Islam");

        when(userRepository.findAllByTenantIdAndIsDeletedFalseOrderByFullNameAsc(tenantId))
                .thenReturn(List.of(user1, user2));

        List<UserDto> result = userService.getAllUsers();

        assertEquals(2, result.size(), "Result size should match returned user list");
        assertEquals("tanvir", result.get(0).getUsername());
        assertEquals("ariful", result.get(1).getUsername());
    }

    /**
     * [EN] Tests user provisioning with password hashing and role assignments
     * [BN] পাসওয়ার্ড হ্যাশ ও রোল অ্যাসাইনমেন্টসহ সফল ইউজার তৈরি পরীক্ষা
     */
    @Test
    @DisplayName("Should create user, hash password, and assign roles")
    void testCreateUserSuccess() {
        CreateUserRequest request = new CreateUserRequest(
                "sadia.ui", "sadia@tex.com", "PlainPassword123!", "Sadia Jahan",
                "IT", "Frontend Lead", "01700000000"
        );
        request.setRoles(Set.of("ROLE_ADMIN"));

        when(userRepository.existsByTenantIdAndUsernameAndIsDeletedFalse(tenantId, "sadia.ui"))
                .thenReturn(false);
        when(userRepository.existsByTenantIdAndEmailAndIsDeletedFalse(tenantId, "sadia@tex.com"))
                .thenReturn(false);
        when(passwordEncoder.encode("PlainPassword123!")).thenReturn("hashedPassword123");

        Role adminRole = new Role(tenantId, "ROLE_ADMIN", "Administrator");
        when(roleRepository.findByTenantIdAndRoleCodeAndIsDeletedFalse(tenantId, "ROLE_ADMIN"))
                .thenReturn(Optional.of(adminRole));

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto created = userService.createUser(request);

        assertNotNull(created, "Created user DTO must not be null");
        assertEquals("sadia.ui", created.getUsername());
        assertEquals("Sadia Jahan", created.getFullName());
        assertTrue(created.getRoles().contains("ROLE_ADMIN"));
        verify(passwordEncoder, times(1)).encode("PlainPassword123!");
    }

    /**
     * [EN] Tests that duplicate username throws IllegalArgumentException
     * [BN] ডুপ্লিকেট ইউজারনেম ব্যবহারে IllegalArgumentException নিক্ষিপ্ত হওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should throw IllegalArgumentException when username is already in use")
    void testCreateUserDuplicateUsernameThrowsException() {
        CreateUserRequest request = new CreateUserRequest(
                "existing.user", "email@tex.com", "pass12345", "Name", "IT", "Dev", "017"
        );

        when(userRepository.existsByTenantIdAndUsernameAndIsDeletedFalse(tenantId, "existing.user"))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(request),
                "Must reject creation if username is already registered");
    }

    /**
     * [EN] Tests soft deletion of user preserving historical database records
     * [BN] ইউজারের সফট-ডিলিট কার্যকারিতা পরীক্ষা
     */
    @Test
    @DisplayName("Should soft-delete user by setting isDeleted to true")
    void testDeleteUser() {
        User user = new User(tenantId, "target.user", "target@tex.com", "hash", "Target");
        user.setId(userId);
        assertFalse(user.isDeleted(), "User should initially not be deleted");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.deleteUser(userId);

        assertTrue(user.isDeleted(), "User isDeleted flag must be set to true");
        verify(userRepository, times(1)).save(user);
    }
}
