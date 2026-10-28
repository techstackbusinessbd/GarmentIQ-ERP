package com.garments.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Enterprise System Audit Log Entity (SystemAuditLog.java)
 * [BN] এন্টারপ্রাইজ সিস্টেম অডিট লগ এনটিটি (SystemAuditLog.java)
 * =============================================================================
 * [EN] Reference: Rule 05 (Database Ground Truth), Rule 07 (<300 lines), Rule 15 (Bilingual)
 * [BN] প্ল্যাটফর্ম নিরাপত্তা, সেটিংস পরিবর্তন ও অ্যাক্সেস ইভেন্টের অপরিবর্তনীয় অডিট ট্রেইল।
 */
@Entity
@Table(name = "system_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private OffsetDateTime timestamp;

    @Column(name = "actor", nullable = false, length = 100)
    private String actor;

    @Column(name = "actor_role", nullable = false, length = 50)
    private String actorRole;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "target_resource", length = 100)
    private String targetResource;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "severity", nullable = false, length = 20)
    @Builder.Default
    private String severity = "INFO";

    @Column(name = "ip_address", length = 50)
    private String ipAddress;
}
