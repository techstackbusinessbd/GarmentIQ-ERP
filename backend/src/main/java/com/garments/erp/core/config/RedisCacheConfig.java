package com.garments.erp.core.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * =============================================================================
 * [EN] Distributed Redis Cache Infrastructure Configuration (RedisCacheConfig.java)
 * [BN] ডিস্ট্রিবিউটেড রেডিস ক্যাশ ইনফ্রাস্ট্রাকচার কনফিগারেশন (RedisCacheConfig.java)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (Sub-200ms latency), Rule 15 (Bilingual)
 * [BN] আরএমজি এন্টারপ্রাইজ সিস্টেমের সাব-১০ms আল্ট্রা-ফাস্ট ডেটা রিট্রিভাল,
 *      স্বয়ংক্রিয় JSON সিরিয়ালাইজেশন এবং ক্যাশ ইনভ্যালিডেশন পলিসি প্রদান করে।
 * =============================================================================
 */
@Configuration
@EnableCaching
public class RedisCacheConfig {

    public static final String CACHE_PERMISSIONS = "permissions";
    public static final String CACHE_ROLES = "roles";
    public static final String CACHE_SEQUENCE_TEMPLATES = "sequence_templates";
    public static final String CACHE_TENANTS = "tenants";
    public static final String CACHE_SECURITY_SETTINGS = "security_settings";

    /**
     * [EN] Configures ObjectMapper for Jackson JSON Redis serialization with type info
     * [BN] রেডিস ক্যাশের জন্য জাভা ২১ ও টাইমস্ট্যাম্প সাপোর্টেড অবজেক্ট ম্যাপার
     */
    private ObjectMapper createRedisObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        return mapper;
    }

    /**
     * [EN] RedisTemplate bean for direct Redis key-value and hash operations
     * [BN] সরাসরি রেডিস কী-ভ্যালু অপারেশনের জন্য RedisTemplate বিন
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        GenericJackson2JsonRedisSerializer jsonSerializer = 
                new GenericJackson2JsonRedisSerializer(createRedisObjectMapper());

        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setHashValueSerializer(jsonSerializer);
        template.afterPropertiesSet();

        return template;
    }

    /**
     * [EN] Configures RedisCacheManager with customized TTLs per domain cache region
     * [BN] ডোমেন অনুযায়ী কাস্টমাইজড মেয়াদের (TTL) সাথে RedisCacheManager কনফিগারেশন
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        GenericJackson2JsonRedisSerializer jsonSerializer = 
                new GenericJackson2JsonRedisSerializer(createRedisObjectMapper());

        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer))
                .prefixCacheNameWith("garments_erp::");

        // [EN] Domain-specific cache retention policies
        // [BN] ডোমেন-নির্দিষ্ট ক্যাশ ধারণ মেয়াদ (TTL) কনফিগারেশন
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 1. Permissions catalog: 10 minutes TTL
        cacheConfigurations.put(CACHE_PERMISSIONS, defaultCacheConfig.entryTtl(Duration.ofMinutes(10)));

        // 2. Roles catalog: 10 minutes TTL (Evicted on role modifications)
        cacheConfigurations.put(CACHE_ROLES, defaultCacheConfig.entryTtl(Duration.ofMinutes(10)));

        // 3. Auto-code sequence templates: 15 minutes TTL
        cacheConfigurations.put(CACHE_SEQUENCE_TEMPLATES, defaultCacheConfig.entryTtl(Duration.ofMinutes(15)));

        // 4. Tenant metadata: 15 minutes TTL
        cacheConfigurations.put(CACHE_TENANTS, defaultCacheConfig.entryTtl(Duration.ofMinutes(15)));

        // 5. Platform security settings: 30 minutes TTL
        cacheConfigurations.put(CACHE_SECURITY_SETTINGS, defaultCacheConfig.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultCacheConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
