package com.garments.erp.sequence.controller;

import com.garments.erp.core.response.ApiResponse;
import com.garments.erp.sequence.dto.CodeSequenceTemplateDto;
import com.garments.erp.sequence.entity.CodeSequenceTemplate;
import com.garments.erp.sequence.repository.CodeSequenceTemplateRepository;
import com.garments.erp.sequence.service.DynamicCodeGeneratorService;
import com.garments.erp.tenant.context.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * =============================================================================
 * [EN] Configurable Code Sequence Template REST API Controller (Rule 24)
 * [BN] কনফিগারেবল কোড সিকোয়েন্স টেমপ্লেট রেস্ট এপিআই কন্ট্রোলার (রুল ২৪)
 * =============================================================================
 * [EN] Enables factory administrators to inspect all auto-code patterns, preview
 *      formatting changes in real-time, and update sequence templates per tenant.
 * [BN] কারখানা অ্যাডমিনিস্ট্রেটরদের সকল অটো-কোড প্যাটার্ন পর্যালোচনা, রিয়েল-টাইমে
 *      লাইভ প্রিভিউ দেখা এবং টেন্যান্টভিত্তিক সিকোয়েন্স টেমপ্লেট হালনাগাদ করার সুবিধা দেয়।
 */
@RestController
@RequestMapping("/api/v1/sequence-templates")
public class CodeSequenceTemplateController {

    private final CodeSequenceTemplateRepository templateRepository;
    private final DynamicCodeGeneratorService codeGeneratorService;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param templateRepository   [EN] Sequence template repository / [BN] সিকোয়েন্স টেমপ্লেট রিপোজিটরি
     * @param codeGeneratorService [EN] Dynamic code generator service / [BN] কোড জেনারেটর সার্ভিস
     */
    public CodeSequenceTemplateController(
            CodeSequenceTemplateRepository templateRepository,
            DynamicCodeGeneratorService codeGeneratorService) {
        this.templateRepository = templateRepository;
        this.codeGeneratorService = codeGeneratorService;
    }

    /**
     * [EN] Retrieves all configured code templates for the current tenant with live previews
     * [BN] বর্তমান টেন্যান্টের সকল কনফিগারকৃত কোড টেমপ্লেট লাইভ প্রিভিউসহ ফেরত দেয়
     *
     * @return [EN] API response containing list of template DTOs / [BN] টেমপ্লেট তালিকার এপিআই রেসপন্স
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CodeSequenceTemplateDto>>> getAllTemplates() {
        UUID tenantId = TenantContext.getTenantId();
        List<CodeSequenceTemplate> templates = (tenantId != null)
                ? templateRepository.findAllByTenantIdOrderByEntityTypeAsc(tenantId)
                : List.of();

        List<CodeSequenceTemplateDto> dtos = templates.stream()
                .map(this::mapToDto)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(dtos, "Sequence templates retrieved successfully"));
    }

    /**
     * [EN] Live preview endpoint for pattern testing without saving to database
     * [BN] ডেটাবেজে সেভ না করেই প্যাটার্ন পরীক্ষার লাইভ প্রিভিউ এন্ডপয়েন্ট
     *
     * @param request [EN] Template request with candidate pattern / [BN] প্যাটার্ন রিকোয়েস্ট
     * @return [EN] Rendered sample preview string / [BN] রেন্ডারকৃত নমুনা কোড
     */
    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<String>> previewPattern(@RequestBody CodeSequenceTemplateDto request) {
        String preview = codeGeneratorService.previewPattern(
                request.getPattern(),
                request.getPrefix(),
                request.getPaddingLength(),
                "TEXTECH"
        );
        return ResponseEntity.ok(ApiResponse.success(preview, "Pattern preview rendered"));
    }

    /**
     * [EN] Updates an existing code sequence template configuration
     * [BN] একটি বিদ্যমান কোড সিকোয়েন্স টেমপ্লেটের কনফিগারেশন আপডেট করে
     *
     * @param id      [EN] Template UUID / [BN] টেমপ্লেট আইডি
     * @param request [EN] Updated template fields / [BN] পরিবর্তিত তথ্য
     * @return [EN] Updated template DTO / [BN] পরিবর্তিত টেমপ্লেট ডিটিও
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CodeSequenceTemplateDto>> updateTemplate(
            @PathVariable UUID id,
            @RequestBody CodeSequenceTemplateDto request) {

        return templateRepository.findById(Objects.requireNonNull(id, "Template ID cannot be null"))
                .map(existing -> {
                    existing.setPattern(request.getPattern());
                    existing.setPrefix(request.getPrefix());
                    existing.setPaddingLength(request.getPaddingLength());
                    if (request.getResetFrequency() != null) {
                        existing.setResetFrequency(request.getResetFrequency());
                    }
                    existing.setActive(request.isActive());
                    existing.setUpdatedAt(Instant.now());

                    CodeSequenceTemplate saved = templateRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.success(mapToDto(saved), "Template updated successfully"));
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(ApiResponse.error("Sequence template not found with ID: " + id)));
    }

    /**
     * [EN] Helper method mapping entity to DTO with dynamic sample preview
     * [BN] ডাইনামিক লাইভ প্রিভিউসহ এন্টিটিকে ডিটিওতে রূপান্তরের হেল্পার মেথড
     */
    private CodeSequenceTemplateDto mapToDto(CodeSequenceTemplate entity) {
        String preview = codeGeneratorService.previewPattern(
                entity.getPattern(),
                entity.getPrefix(),
                entity.getPaddingLength(),
                "TEXTECH"
        );

        return new CodeSequenceTemplateDto(
                entity.getId(),
                entity.getEntityType(),
                entity.getPattern(),
                entity.getPrefix(),
                entity.getPaddingLength(),
                entity.getResetFrequency(),
                entity.isActive(),
                preview
        );
    }
}
