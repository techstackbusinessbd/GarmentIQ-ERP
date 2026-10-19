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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * =============================================================================
 * [EN] Unit Test Suite for Global Master Data Service
 * [BN] গ্লোবাল মাস্টার ডেটা সার্ভিসের ইউনিট টেস্ট স্যুট
 * =============================================================================
 * [EN] Tests retrieval of measurement units, ordered garment sizes, and quality
 *      defect codes with category filtering and DTO mapping.
 * [BN] পরিমাপের একক, ক্রমানুসারে সাজানো সাইজ এবং কোয়ালিটি ডিফেক্ট কোড ক্যাটাগরি
 *      ফিল্টারিং ও ডিটিও রূপান্তর নিখুঁতভাবে পরীক্ষা করে।
 */
@ExtendWith(MockitoExtension.class)
class MasterDataServiceTest {

    @Mock
    private MasterUnitRepository unitRepository;

    @Mock
    private MasterSizeRepository sizeRepository;

    @Mock
    private MasterDefectCodeRepository defectCodeRepository;

    @InjectMocks
    private MasterDataService masterDataService;

    /**
     * [EN] Tests retrieving measurement units with and without category filter
     * [BN] ক্যাটাগরি ফিল্টারসহ ও ফিল্টার ছাড়া পরিমাপের একক পাওয়ার পরীক্ষা
     */
    @Test
    @DisplayName("Should retrieve units with and without category filtering")
    void testGetUnits() {
        MasterUnit u1 = new MasterUnit("PCS", "Pieces", "GARMENT");
        MasterUnit u2 = new MasterUnit("YDS", "Yards", "FABRIC");

        when(unitRepository.findAllByOrderByUnitCodeAsc()).thenReturn(List.of(u1, u2));
        when(unitRepository.findAllByUnitCategoryOrderByUnitCodeAsc("FABRIC")).thenReturn(List.of(u2));

        List<MasterUnitDto> allUnits = masterDataService.getUnits(null);
        assertEquals(2, allUnits.size(), "Should return all units when category is null");

        List<MasterUnitDto> fabricUnits = masterDataService.getUnits("fabric");
        assertEquals(1, fabricUnits.size(), "Should return filtered fabric units");
        assertEquals("YDS", fabricUnits.get(0).getUnitCode());
    }

    /**
     * [EN] Tests retrieving standard garment sizes ordered by display order
     * [BN] ডিসপ্লে অর্ডার অনুযায়ী ক্রমানুসারে সাজানো সাইজ তালিকা পাওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should retrieve garment sizes strictly sorted by displayOrder")
    void testGetSizes() {
        MasterSize s1 = new MasterSize("S", 2);
        MasterSize s2 = new MasterSize("M", 3);

        when(sizeRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(List.of(s1, s2));

        List<MasterSizeDto> sizes = masterDataService.getSizes();

        assertEquals(2, sizes.size(), "Should return 2 sizes");
        assertEquals("S", sizes.get(0).getSizeCode());
        assertEquals("M", sizes.get(1).getSizeCode());
        verify(sizeRepository).findAllByOrderByDisplayOrderAsc();
    }

    /**
     * [EN] Tests retrieving quality defect codes by process category
     * [BN] প্রসেস ক্যাটাগরি অনুযায়ী ডিফেক্ট কোড পাওয়া পরীক্ষা
     */
    @Test
    @DisplayName("Should retrieve defect codes filtered by inspection category")
    void testGetDefectCodes() {
        MasterDefectCode d1 = new MasterDefectCode("DEF-SEW-01", "Broken Stitch", "SEWING");

        when(defectCodeRepository.findAllByDefectCategoryOrderByDefectCodeAsc("SEWING"))
                .thenReturn(List.of(d1));

        List<MasterDefectCodeDto> sewingDefects = masterDataService.getDefectCodes("sewing");

        assertEquals(1, sewingDefects.size(), "Should return 1 sewing defect");
        assertEquals("DEF-SEW-01", sewingDefects.get(0).getDefectCode());
    }
}
