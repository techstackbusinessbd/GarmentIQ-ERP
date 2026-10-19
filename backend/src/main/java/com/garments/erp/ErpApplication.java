package com.garments.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * [EN] Main Entry Point for Garments ERP Enterprise Backend Application.
 * Configured with Java 21, Spring Boot 3.3+, and Modular Monolith Architecture.
 *
 * [BN] গার্মেন্টস ইআরপি এন্টারপ্রাইজ ব্যাকএন্ড অ্যাপ্লিকেশনের মূল এন্ট্রি পয়েন্ট।
 * জাভা ২১, স্প্রিং বুট ৩.৩+ এবং মডুলার মনোলিথ আর্কিটেকচারে কনফিগার করা হয়েছে।
 */
@SpringBootApplication
public class ErpApplication {

    /**
     * [EN] Main method to bootstrap the Spring Boot ERP application.
     * [BN] স্প্রিং বুট ইআরপি অ্যাপ্লিকেশন চালু করার প্রধান মেথড।
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
    }
}
