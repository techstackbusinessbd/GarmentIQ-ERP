package com.garments.erp.master.service;

import com.garments.erp.master.dto.MasterDefectCodeDto;
import com.garments.erp.master.dto.MasterSizeDto;
import com.garments.erp.master.dto.MasterUnitDto;
import com.garments.erp.master.entity.MasterDefectCode;
import com.garments.erp.master.entity.MasterSize;
import com.garments.erp.master.entity.MasterUnit;
import com.garments.erp.master.repository.MasterDefectCodeRepository;
import com.garments.erp.master.repository.MasterSizeRepository;
import com.garments.erp.master.repository.MasterUnitRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * [EN] Global Master Reference Data Lookup Service
 * [BN] গ্লোবাল মাস্টার রেফারেন্স ডেটা অনুসন্ধান সার্ভিস
 * =============================================================================
 * [EN] Provides optimized lookup operations for standard measurement units,
 *      garment size grids, and quality defect codes used across RMG workflows.
 * [BN] তৈরি পোশাক কারখানার জন্য প্রমিত পরিমাপের একক, সাইজ গ্রিড এবং কোয়ালিটি
 *      ডিফেক্ট কোড দ্রুত অনুসন্ধানের ব্যবসায়িক সার্ভিস পরিচালনা করে।
 */
@Slf4j
@Service
public class MasterDataService {

    private final MasterUnitRepository unitRepository;
    private final MasterSizeRepository sizeRepository;
    private final MasterDefectCodeRepository defectCodeRepository;

    /**
     * [EN] Explicit constructor for dependency injection.
     * [BN] ডিপেন্ডেন্সি ইনজেকশনের জন্য সুস্পষ্ট কনস্ট্রাক্টর।
     *
     * @param unitRepository       [EN] Measurement units data repository / [BN] পরিমাপের একক রিপোজিটরি
     * @param sizeRepository       [EN] Size breakdown data repository / [BN] সাইজ রিপোজিটরি
     * @param defectCodeRepository [EN] QC defect codes data repository / [BN] কোয়ালিটি ডিফেক্ট রিপোজিটরি
     */
    public MasterDataService(
            MasterUnitRepository unitRepository,
            MasterSizeRepository sizeRepository,
            MasterDefectCodeRepository defectCodeRepository) {
        this.unitRepository = unitRepository;
        this.sizeRepository = sizeRepository;
        this.defectCodeRepository = defectCodeRepository;
    }

    /**
     * [EN] Retrieves measurement units optionally filtered by material category
     * [BN] পরিমাপের একক তালিকা প্রদান করে (ঐচ্ছিক ক্যাটাগরি ফিল্টারসহ)
     *
     * @param category [EN] Optional category filter (e.g. FABRIC, GARMENT) / [BN] ক্যাটাগরি ফিল্টার
     * @return [EN] List of matching unit DTOs / [BN] এককের তালিকা
     */
    @Transactional(readOnly = true)
    public List<MasterUnitDto> getUnits(String category) {
        List<MasterUnit> units;

        if (StringUtils.hasText(category)) {
            units = unitRepository.findAllByUnitCategoryOrderByUnitCodeAsc(category.trim().toUpperCase());
        } else {
            units = unitRepository.findAllByOrderByUnitCodeAsc();
        }

        return units.stream()
                .map(this::mapToUnitDto)
                .collect(Collectors.toList());
    }

    /**
     * [EN] Retrieves all standard garment sizes strictly ordered by display weight
     * [BN] ডিসপ্লে অর্ডার অনুযায়ী ক্রমানুসারে সাজানো পোশাকের সাইজ গ্রিড প্রদান করে
     *
     * @return [EN] Sorted list of size DTOs / [BN] ক্রমানুসারে সাজানো সাইজের তালিকা
     */
    @Transactional(readOnly = true)
    public List<MasterSizeDto> getSizes() {
        return sizeRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToSizeDto)
                .collect(Collectors.toList());
    }

    /**
     * [EN] Retrieves quality defect codes optionally filtered by inspection stage
     * [BN] কোয়ালিটি ত্রুটি কোড তালিকা প্রদান করে (ঐচ্ছিক প্রসেস ক্যাটাগরি ফিল্টারসহ)
     *
     * @param category [EN] Optional category filter (FABRIC, SEWING, FINISHING) / [BN] ক্যাটাগরি ফিল্টার
     * @return [EN] List of matching defect DTOs / [BN] ত্রুটি কোডের তালিকা
     */
    @Transactional(readOnly = true)
    public List<MasterDefectCodeDto> getDefectCodes(String category) {
        List<MasterDefectCode> defects;

        if (StringUtils.hasText(category)) {
            defects = defectCodeRepository.findAllByDefectCategoryOrderByDefectCodeAsc(category.trim().toUpperCase());
        } else {
            defects = defectCodeRepository.findAllByOrderByDefectCodeAsc();
        }

        return defects.stream()
                .map(this::mapToDefectDto)
                .collect(Collectors.toList());
    }

    private MasterUnitDto mapToUnitDto(MasterUnit unit) {
        return new MasterUnitDto(unit.getId(), unit.getUnitCode(), unit.getUnitName(), unit.getUnitCategory());
    }

    private MasterSizeDto mapToSizeDto(MasterSize size) {
        return new MasterSizeDto(size.getId(), size.getSizeCode(), size.getDisplayOrder());
    }

    private MasterDefectCodeDto mapToDefectDto(MasterDefectCode defect) {
        return new MasterDefectCodeDto(defect.getId(), defect.getDefectCode(), defect.getDefectName(), defect.getDefectCategory());
    }
}
