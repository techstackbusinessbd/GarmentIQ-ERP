package com.garments.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Factory Production Line Shift Entity (FactoryShift.java)
 * [BN] কারখানা প্রোডাকশন লাইন শিফট এনটিটি (FactoryShift.java)
 * =============================================================================
 * [EN] Reference: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] কাটিং ও সুইং লাইনের শিফট সময়সূচি ও কর্মঘণ্টার তথ্য সংরক্ষণ।
 */
@Entity
@Table(name = "factory_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactoryShift {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime;

    @Column(name = "break_minutes", nullable = false)
    @Builder.Default
    private Integer breakMinutes = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "shift_type", nullable = false, length = 20)
    @Builder.Default
    private String shiftType = "REGULAR";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
