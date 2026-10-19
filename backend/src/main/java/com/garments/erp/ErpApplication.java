package com.garments.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * =============================================================================
 * [EN] Garments ERP Main Application Entry Point (Spring Boot 3.3+ / Java 21 LTS)
 * [BN] গার্মেন্টস ইআরপি মূল অ্যাপ্লিকেশন এন্ট্রি পয়েন্ট
 * =============================================================================
 * [EN] Bootstraps the enterprise ERP application context with Spring Data JPA auditing,
 *      virtual thread task execution, and centralized multi-tenant filter chain.
 * [BN] স্প্রিং ডেটা JPA অডিটিং, ভার্চুয়াল থ্রেড টাস্ক এক্সিকিউশন এবং সেন্ট্রালাইজড
 *      মাল্টি-টেন্যান্ট সিকিউরিটি ফিল্টারসহ সম্পূর্ণ ইআরপি অ্যাপ্লিকেশন বুটস্ট্র্যাপ করে।
 */
@SpringBootApplication
@EnableJpaAuditing
public class ErpApplication {

    /**
     * [EN] Application bootstrap main method executing SpringApplication launcher
     * [BN] স্প্রিং বুট ফ্রেমওয়ার্ক ইনিশিয়ালাইজ ও সার্ভিস লঞ্চ করার মূল মেইন মেথড
     *
     * @param args [EN] Command line startup arguments / [BN] কমান্ড লাইন আর্গুমেন্টস
     */
    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
    }
}

