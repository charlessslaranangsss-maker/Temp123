# Temporary123 Google Drive Asset Inventory

**Audit date:** 2026-09-15  
**Scope:** Asset inventory and classification only. No website source, public assets, routes, components, deployment, or production behavior were changed.

## Method and classification

Every directly accessible item in the 20 supplied Google Drive references was enumerated. Each accessible image was downloaded for visual inspection, checked for dimensions and orientation, classified, and assigned a deterministic recommended sequence. The recommended sequence places the strongest usable interior first and the strongest usable exterior second whenever both exist. Missing views are explicitly marked rather than inferred from another model.

Classifications used: `interior`, `exterior`, `detail`, `diagram`, `duplicate`, and `unusable`. “Best” means best among the supplied assets, not confirmation that the photograph meets every commercial-background requirement.

## Coverage summary

- 20 supplied Drive folder references enumerated.
- 133 direct items found across those supplied references: 112 images, 20 nested folders inside the supplied “20ft Laundry Container” parent, and one `.DS_Store` file.
- The actual nested 20ft Laundry Container folder contributed 3 additional images.
- **115 unique accessible images were visually inspected across 20 equipment groups.**
- No image remained inaccessible after retrying the initial connector errors.
- One unusable non-image was found: `.DS_Store` in the 22–26ft Low Temp Dish Trailer folder.

## Final service-area publishing reconciliation — 2026-09-16

The two later-supplied folders added five images for the 20ft Shower Trailer with Handwashing Sink and three images for the Handwashing Sink Trailer. This brings the reviewed source set to **123 image files across 22 linked equipment folders**.

- **108 unique, usable, exact-category images are published** in the verified service-area carousel registry. Responsive 480px and 960px WebP derivatives were generated for each published source image.
- **15 source images are intentionally withheld**, not lost: two exact duplicates, one unsuitable 28ft Mobile Kitchen exterior, one ambiguous 40ft Mobile Combo image, two residential-setting 30ft Conveyor Dishwashing photos, eight residential or ambiguous Luxury Shower-Restroom Combination photos, and one near-duplicate refrigerated-trailer image. The separate `.DS_Store` system file is excluded because it is not an image.
- Equipment rows without a supplied Drive folder are not assigned borrowed imagery. This prevents a photograph from being represented as a different trailer, container, or facility.
- The generic nationwide/state map modal uses a verified multi-service equipment mix. State, region, and city detail pages select the matching equipment-family carousel from their page headline and content.
- Within each exact equipment set, usable interior images are ordered first, exterior images next, then detail and diagram images. When a folder does not contain an interior or exterior, the missing view is not fabricated.

### Published image counts by exact equipment folder

| Equipment folder | Published | Withheld | Publishing note |
| --- | ---: | ---: | --- |
| 24ft Mobile Kitchen | 5 | 0 | Exact-category set |
| 28ft Mobile Kitchen | 7 | 2 | Duplicate and unsuitable exterior withheld |
| 38ft Mobile Kitchen | 2 | 0 | No exterior supplied |
| 40ft Mobile Kitchen | 10 | 0 | Photos precede diagrams |
| 40ft Mobile Combo Kitchen | 9 | 1 | One source excluded from the safe set |
| 40ft Bulk Kitchen | 14 | 0 | Photos precede diagrams |
| 40ft Bulk Combo Kitchen | 6 | 1 | Exact duplicate withheld |
| 22–26ft Low Temp Dish Trailer | 8 | 0 | Separate `.DS_Store` excluded; shared-size identity disclosed |
| 30ft Conveyor Dishwashing Trailer | 0 | 2 | Residential-setting images withheld |
| 38ft Low Temp Dish Trailer | 4 | 0 | Exact-category set |
| 38ft High Temp Conveyor Dishwashing Trailer | 10 | 0 | Exact-category set |
| 20ft Refrigerated Trailer | 4 | 1 | Near-duplicate withheld |
| 30ft Laundry Trailer | 1 | 0 | Single supplied image |
| 26–27ft Laundry Trailer | 1 | 0 | Single supplied image |
| 20ft Laundry Container | 3 | 0 | Resolved through the correct nested folder |
| 13ft Luxury Shower-Restroom Combination | 2 | 5 | Ambiguous/non-commercial images withheld |
| 22ft Luxury Shower-Restroom Combination | 5 | 2 | Ambiguous/non-commercial images withheld |
| 30ft Luxury Shower-Restroom Combination | 0 | 1 | Ambiguous/non-commercial image withheld |
| 20ft Shower Container | 4 | 0 | Exact-category set |
| 20ft Shower Trailer with Handwashing Sink | 5 | 0 | Exact-category set |
| Handwashing Sink Trailer | 3 | 0 | Exact-category set |
| Water Tank | 5 | 0 | Exterior/detail-only equipment |
| **Total** | **108** | **15** | **All 123 source images accounted for** |

## Critical findings before implementation

1. The supplied “20ft Laundry Container” link is a parent library, not that equipment folder. The correct nested folder is [20ft Laundry Container](https://drive.google.com/drive/folders/1UdLkPChLAKZFzBGvhBAoed5ZYXxal_RG).
2. Only seven equipment groups contain both an interior and an exterior: 24ft Mobile Kitchen, 28ft Mobile Kitchen, 40ft Mobile Combo Kitchen, 22–26ft Low Temp Dish Trailer, 20ft Refrigerated Trailer, 13ft Luxury Combination, and 22ft Luxury Combination.
3. No exterior was supplied for 38ft Mobile Kitchen, 40ft Mobile Kitchen, 40ft Bulk Kitchen, 40ft Bulk Combo Kitchen, 38ft Low Temp Dish, 38ft High Temp Conveyor Dishwashing, 30ft Laundry, 26–27ft Laundry, 20ft Laundry Container, or 20ft Shower Container.
4. No interior was supplied for 30ft Conveyor Dishwashing or 30ft Luxury Shower-Restroom Combination. Water Tank has no applicable interior.
5. Exact duplicate pairs were found in 28ft Mobile Kitchen (#4/#8) and 40ft Bulk Combo Kitchen (#1/#2). The refrigerated interior #1/#5 is a visual near-duplicate. Laundry folder identity is ambiguous because the single 30ft and 26–27ft images are visually near-identical.
6. Exterior backgrounds needing replacement or owner acceptance: 28ft Mobile Kitchen #7; both 30ft Conveyor Dishwashing photos; several 13ft Luxury Combination exteriors; 30ft Luxury Combination #1. They show residential, driveway, wooded, small-business, or otherwise non-commercial/ambiguous settings.
7. The shared 22–26ft Low Temp Dish folder does not prove which image belongs to the 22ft, 24ft, or 26ft route. Do not make per-model claims without owner confirmation.

## Folder-level placement summary

| Equipment folder | Supplied images | Position 1: best interior | Position 2: best exterior | Main gap or warning |
| --- | ---: | --- | --- | --- |
| [24ft Mobile Kitchen](https://drive.google.com/drive/folders/1OunVHARHYsXf8RxLP02Kb0xsWSUMt2fm) | 5 | #4 — `portable-commercial-kitchen-trailer-interior.png` (`1s1gafYUfg4Ik_2mgs2egSL1GNrqU17NJ`) | #1 — `mobile-kitchen-trailer-exterior-service-window.png` (`187PF6SOGJL_2mb-qXJ0jaDlg30utSR9F`) | Complete interior/exterior set. |
| [28ft Mobile Kitchen](https://drive.google.com/drive/folders/1AB_bA26IZS2pycK5qY0IBtReI0fDwkHz) | 9 | #5 — `commercial-mobile-kitchen-cooking-line.png` (`1f9zmkts82kXeE0csOpPpFIsz_9AXI-_7`) | #7 — `temporary-commercial-kitchen-trailer-exterior.png` (`1nfL9Kylpa1xaGNBE_3OvKVx40HMRGw_l`) | Use image 7 only if no commercial-setting exterior becomes available. |
| [38ft Mobile Kitchen](https://drive.google.com/drive/folders/1iJYe8zt5y5My9fqPkmMc6FkIxaRVkG5Z) | 2 | #2 — `commercial-kitchen-trailer-refrigeration-wash-station.png` (`1vvInKeHG7XlXqbQER1ZQgpsAZs4JsEPm`) | Not available | No exterior image supplied. |
| [40ft Mobile Kitchen](https://drive.google.com/drive/folders/1VDAuF9qooK4rG2BYCt4lA8slnjtf694i) | 10 | #5 — `temporary-commercial-kitchen-trailer-cooking-prep-area.png` (`1ePVcY8R2d-Dskpwu3ut3J8V24sTbacSb`) | Not available | No exterior image supplied. Put diagrams after photographs. |
| [40ft Mobile Combo Kitchen](https://drive.google.com/drive/folders/1yLoiVis9AZJmY0s1Y6npK9OY-S8lroZK) | 10 | #9 — `commercial-kitchen-trailer-cooking-line-ventilation.png` (`1N5Nl_qL2otlAA-rtGiaV_xRnLK_wVias`) | #1 — `mobile-commercial-kitchen-trailer-exterior-entrance.png` (`194MZuL9hne6CKyPv-H2wn19sQtPHtNGy`) | Prefer image 1 over image 3 for the exterior. |
| [40ft Bulk Kitchen](https://drive.google.com/drive/folders/1iuO6hU_jQNl-ShmN0c4X1sXEatj7IqsH) | 14 | #14 — `portable-kitchen-trailer-range-convection-ovens-cooking-line.png` (`1YJT5WPS9eLLRnaGRdllRaPhMvRHugJlS`) | Not available | No exterior image supplied. Photos should precede diagrams. |
| [40ft Bulk Combo Kitchen](https://drive.google.com/drive/folders/10J-NgwiQIjN8l6dNICitMuuYCe6RHVMF) | 7 | #6 — `mobile-commercial-kitchen-trailer-ovens-wash-station-prep-area.png` (`1WFCv79qiWBOMm_b-xNsdYDCssdl19u2N`) | Not available | No exterior image supplied. |
| [22-26ft Low Temp Dish Trailer](https://drive.google.com/drive/folders/1d5t5BT61At03TpjOz3RZ0sYCTaYA8LcV) | 8 | #8 — `commercial-dish-trailer-stainless-workstation.png` (`1Vm5hE3OMA7epFawry10D4VJ9Vt0okP66`) | #4 — `dish-trailer-rental-exterior.png` (`1Ck6j_BYLTgA9UKSzL_AeXQqKohD82dSB`) | One shared folder covers 22, 24, and 26 ft rows; exact model-by-image mapping still requires owner confirmation. |
| [30ft Conveyor Dishwashing Trailer](https://drive.google.com/drive/folders/1vuLiQGv4kZglb45w4YEGTHIlW2Eh-lHV) | 2 | Not available | #2 — `commercial-conveyor-trailer-rental.png` (`1ngUyXVtt-4NFqAivFn8XM3cUE7vRCdi8`) | No interior supplied; neither exterior meets the requested commercial-site background standard. |
| [38ft Low Temp Dish Trailer](https://drive.google.com/drive/folders/14Hypf5WESWUWZm9gugr5nHRTqInQgIX9) | 4 | #1 — `dish-trailer-commercial-storage-shelving.png` (`15EzWkG8lt4ylvJYaET6Qzwur6UCHMSmw`) | Not available | No exterior image supplied. |
| [38ft High Temp Conveyor Dishwashing Trailer](https://drive.google.com/drive/folders/1OC1mihPOFZoPGSekCneR_bDPqELywMTY) | 10 | #10 — `dishwashing-trailer-wash-rinse-sanitize-station.png` (`1ZdbBJR8C52wCTKWF12KUj2nQzeBiXklr`) | Not available | No exterior image supplied. |
| [20ft Refrigerated Trailer](https://drive.google.com/drive/folders/11G3nczi2n2feLv5PX-rLegZAYXl3JsGu) | 5 | #1 — `refrigerated-trailer-interior-cooling-system.png` (`10hjCOlxP65729BATQw_ejxRr2XHUk96v`) | #2 — `portable-refrigeration-trailer-exterior.png` (`1KpTzRD3I5lTYx-ooTZDTu8PrFTvYkyFM`) | Image 4 has an acceptable commercial-building background. |
| [30ft Laundry Trailer](https://drive.google.com/drive/folders/1ZW_Rt-N95G51786zEzPp5hmGKMVQeygx) | 1 | #1 — `mobile-laundry-trailer-commercial-washers-dryers.png` (`1BDMKRLZayj55ZR-ut5hFqgGRIWHASZmz`) | Not available | No exterior image supplied; model identity needs owner confirmation. |
| [26-27ft Laundry Trailer](https://drive.google.com/drive/folders/1MjW3a3k5tHbVBFco4GX7E_UPaqtAFp8r) | 1 | #1 — `mobile-laundry-trailer-washer-dryer-interior.png` (`1aT5VuiZVnU9sJO8Xs10Z11qOSFBoD7UW`) | Not available | No exterior image supplied; model identity needs owner confirmation. |
| [20ft Laundry Container (nested child)](https://drive.google.com/drive/folders/1UdLkPChLAKZFzBGvhBAoed5ZYXxal_RG) | 3 | #3 — `Laundry Container 7 units 1.png` (`1QRcFal5YpCxkGomR2-5pWJ4CIX0xtAVG`) | Not available | The supplied URL was a parent containing 20 equipment folders. The actual nested 20 ft Laundry Container folder was followed. No exterior supplied. |
| [13ft Luxury Shower-Restroom Combination](https://drive.google.com/drive/folders/1nNO_JMxe_juH8SOVSw9F-nzhXnZaBSsD) | 7 | #7 — `Codex Image Sep 15, 2026, 02_08_46 AM.png` (`1ZFYVE1kJZwU3sgJy7vJIrKPCpJuthGnP`) | #5 — `Codex Image Sep 15, 2026, 02_09_04 AM.png` (`1yFQCL4FEDCedtZfQMo1ReGLVj7WnHMz0`) | Exterior set does not meet the requested commercial/industrial-setting preference. |
| [22ft Luxury Shower-Restroom Combination](https://drive.google.com/drive/folders/16UWOiaYctvfe3ozuLKmVcE6_gQHNC8WW) | 7 | #1 — `Codex Image Sep 15, 2026, 03_44_11 AM.png` (`1CiYRSUZKGue6cpIUsZtVbRq7sZI-Aqhf`) | #6 — `Codex Image Sep 15, 2026, 03_43_37 AM.png` (`1tscOQOzMnD-xJ3BMr4NL9QL5boPhYRad`) | Images 6 and 7 have the strongest commercial warehouse context. |
| [30ft Luxury Shower-Restroom Combination](https://drive.google.com/drive/folders/1OEk_GG66gYVgBH6ZS-u30-Kb4V0Gy4RG) | 1 | Not available | #1 — `si1pYmMIdkb6gmMRGxcT__Codex Image Sep 15, 2026, 02_17_46 AM.png` (`1dxx_gXQNXQ`) | No interior image supplied. |
| [20ft Shower Container](https://drive.google.com/drive/folders/1-VGExIftnJBBWPzROjPsTKJYrwTsG04A) | 4 | #4 — `portable-shower-container-multiple-stalls.png` (`1tOIsoqu0GQ4ENDa8H6lavSSzHyynKLu7`) | Not available | No exterior image supplied. |
| [Water Tank](https://drive.google.com/drive/folders/1i8LIu0PYWFmSEsOzzuvXx163aXmAK4mG) | 5 | Not available | #2 — `portable-water-tanks-with-pump-and-hoses.png` (`1mQoDd1SrEglbOiWCm7tRj7Ii6CPkqw8A`) | Interior is not applicable. Commercial parking-lot setting is acceptable. |

## Detailed image register

### 24ft Mobile Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1OunVHARHYsXf8RxLP02Kb0xsWSUMt2fm)  
Recommended sequence: 1=#4, 2=#1, 3=#5, 4=#3, 5=#2.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | exterior | portrait; 1086×1448 | `mobile-kitchen-trailer-exterior-service-window.png` | `187PF6SOGJL_2mb-qXJ0jaDlg30utSR9F` | Best supplied exterior. |
| 5 | 2 | detail | portrait; 1086×1448 | `commercial-six-burner-gas-range.png` | `1OcIB4NszHR8RSbnTuTOya_hiBegejAM-` | — |
| 4 | 3 | detail | portrait; 1086×1448 | `mobile-kitchen-trailer-prep-counter.png` | `1olj8MmcVthDQpoWzrxB7_ezEqRjijDID` | — |
| 1 | 4 | interior | portrait; 1086×1448 | `portable-commercial-kitchen-trailer-interior.png` | `1s1gafYUfg4Ik_2mgs2egSL1GNrqU17NJ` | Best supplied interior. |
| 3 | 5 | interior | portrait; 1086×1448 | `mobile-commercial-kitchen-entry-view.png` | `1SfBYSaldDAqg_-3X5V23YGf1d7OWtkCV` | — |

**Folder note:** Complete interior/exterior set.

### 28ft Mobile Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1AB_bA26IZS2pycK5qY0IBtReI0fDwkHz)  
Recommended sequence: 1=#5, 2=#7, 3=#2, 4=#6, 5=#4, 6=#1, 7=#3, 8=#9. Exclude: #8.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 6 | 1 | interior | portrait; 1086×1448 | `temporary-kitchen-trailer-prep-and-wash-area.png` | `18LR57Zb75hJ5FO1g9jqWreny0lj4exY0` | — |
| 3 | 2 | interior | portrait; 1086×1448 | `mobile-kitchen-trailer-full-equipment-interior.png` | `1agVNDaCPMlmKB-nRdtfgBXxMnnxKs99S` | — |
| 7 | 3 | detail | portrait; 1086×1448 | `mobile-kitchen-trailer-commercial-sink-station.png` | `1AvisHePT7SJ7_7JOCO_GEeNPu1yfn5z5` | — |
| 5 | 4 | detail | portrait; 1086×1448 | `commercial-kitchen-trailer-range-oven-hood.png` | `1CyiyKwNzy9ZEntFE9z-vsPtkZWCSimvj` | — |
| 1 | 5 | interior | landscape; 1672×941 | `commercial-mobile-kitchen-cooking-line.png` | `1f9zmkts82kXeE0csOpPpFIsz_9AXI-_7` | Best supplied interior. |
| 4 | 6 | interior | portrait; 1086×1448 | `portable-commercial-kitchen-interior-layout.png` | `1gVHAQVJBfvdSi5vlTks05ePwabtx-JnQ` | — |
| 2 | 7 | exterior | landscape; 1448×1086 | `temporary-commercial-kitchen-trailer-exterior.png` | `1nfL9Kylpa1xaGNBE_3OvKVx40HMRGw_l` | Best supplied exterior. Residential or small-business background: a house is visible. |
| Exclude | 8 | duplicate | portrait; 1086×1448 | `mobile-kitchen-trailer-cooking-equipment.png` | `1OOpQfZagqwIQw_Z53N7E-8ZBj1KpM6MO` | Exact duplicate of image 4; exclude. |
| 8 | 9 | detail | portrait; 1093×1438 | `mobile-kitchen-trailer-prep-area-service-window.png` | `1SOF7WkSKCVLPN1hybEzfMr3xIQA6rgmw` | — |

**Folder note:** Use image 7 only if no commercial-setting exterior becomes available.

### 38ft Mobile Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1iJYe8zt5y5My9fqPkmMc6FkIxaRVkG5Z)  
Recommended sequence: 1=#2, 2=#1.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | detail | portrait; 1113×1414 | `mobile-kitchen-trailer-range-griddle-fryer.png` | `1kT9KgUe07k1K2OEIz5Vux6pe_IVU7DRG` | — |
| 1 | 2 | interior | portrait; 975×1613 | `commercial-kitchen-trailer-refrigeration-wash-station.png` | `1vvInKeHG7XlXqbQER1ZQgpsAZs4JsEPm` | Best supplied interior. |

**Folder note:** No exterior image supplied.

### 40ft Mobile Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1VDAuF9qooK4rG2BYCt4lA8slnjtf694i)  
Recommended sequence: 1=#5, 2=#3, 3=#4, 4=#6, 5=#7, 6=#8, 7=#9, 8=#10, 9=#1, 10=#2.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 9 | 1 | diagram | landscape; 697×459 | `Layout1.jpg` | `12YLtxJ5ydN9n4UKOQJx0Uum7TE-0Qc7O` | Low-resolution diagram; supporting use only. |
| 10 | 2 | diagram | landscape; 693×456 | `Layout2 (1).jpg` | `16Mdd-Su7wYXj2e_UrDyARKkwOK53B5tN` | Low-resolution diagram; supporting use only. |
| 2 | 3 | detail | portrait; 1092×1440 | `mobile-commercial-kitchen-trailer-refrigeration-units.png` | `185rnnBHmUwa1uB8TAwUupPtwLFSorkwA` | — |
| 3 | 4 | detail | portrait; 1074×1464 | `mobile-kitchen-trailer-stacked-commercial-convection-ovens.png` | `1_zLxyoYDVZW8eBUYKg9puPTdPf8I3uyN` | — |
| 1 | 5 | interior | portrait; 947×1661 | `temporary-commercial-kitchen-trailer-cooking-prep-area.png` | `1ePVcY8R2d-Dskpwu3ut3J8V24sTbacSb` | Best supplied interior. |
| 4 | 6 | detail | portrait; 1089×1445 | `commercial-kitchen-trailer-flat-top-griddle-range.png` | `1FAthp0KocT3pO-lLtguRyT4opQjRPVmu` | — |
| 5 | 7 | detail | portrait; 933×1686 | `commercial-kitchen-trailer-three-compartment-wash-sink.png` | `1H4NeV5C72odXvYDKM78rsO0nk7O-No3i` | — |
| 6 | 8 | detail | portrait; 1084×1451 | `portable-kitchen-trailer-stainless-steel-prep-table.png` | `1R9JEvAfMbulaP320MZ3uNnxnefL5sfY2` | — |
| 7 | 9 | detail | portrait; 948×1659 | `commercial-kitchen-trailer-griddle-range-deep-fryer.png` | `1W5DAGEz3dTdsNXCoQ5UOgcB5zfcgs8g6` | — |
| 8 | 10 | detail | portrait; 960×1638 | `mobile-kitchen-trailer-hand-wash-sink-sanitation-station.png` | `1y77ASXfTb9ilSGxSqr754ea56_XgXMMj` | — |

**Folder note:** No exterior image supplied. Put diagrams after photographs.

### 40ft Mobile Combo Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1yLoiVis9AZJmY0s1Y6npK9OY-S8lroZK)  
Recommended sequence: 1=#9, 2=#1, 3=#2, 4=#5, 5=#3, 6=#4, 7=#6, 8=#7, 9=#8, 10=#10.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | exterior | landscape; 1448×1086 | `mobile-commercial-kitchen-trailer-exterior-entrance.png` | `194MZuL9hne6CKyPv-H2wn19sQtPHtNGy` | Best supplied exterior. |
| 3 | 2 | interior | portrait; 939×1675 | `mobile-commercial-kitchen-trailer-cooking-wash-area.png` | `1A3uFQy37PSEgFm7lIMjc6FPZ05zhjFlh` | — |
| 5 | 3 | exterior | landscape; 1448×1086 | `mobile-commercial-kitchen-trailer-exterior-hvac.png` | `1a5B7sxon2jh773an_bR2bpfCJLsq-zTu` | Wooded or residential-like background; not clearly commercial. |
| 6 | 4 | detail | portrait; 1086×1448 | `portable-kitchen-trailer-stainless-prep-table-shelving.png` | `1bmA3gXxFhumg8amk-xFvjP-aECAGc_-8` | — |
| 4 | 5 | interior | portrait; 1086×1448 | `mobile-kitchen-trailer-stainless-steel-prep-area.png` | `1cOfpx89aoXzpQAKANxd5dL0AqBwBeUfN` | — |
| 7 | 6 | detail | portrait; 1086×1448 | `temporary-kitchen-trailer-range-griddle-work-table.png` | `1kmhZ9L4NDcvpBnI8Nkj3FdhvWFlH_DEk` | — |
| 8 | 7 | detail | portrait; 1086×1448 | `portable-commercial-kitchen-trailer-three-compartment-sink.png` | `1kuOcPMD8JaBLStXkuEuPG5_JntduscVA` | — |
| 9 | 8 | detail | portrait; 1086×1448 | `mobile-kitchen-trailer-stacked-convection-ovens.png` | `1mXnmI5T_pyscyK_8Tra_Ieeg-vKSpOsL` | — |
| 1 | 9 | interior | portrait; 1086×1448 | `commercial-kitchen-trailer-cooking-line-ventilation.png` | `1N5Nl_qL2otlAA-rtGiaV_xRnLK_wVias` | Best supplied interior. |
| 10 | 10 | detail | portrait; 1086×1448 | `commercial-kitchen-trailer-range-griddle-exhaust-hood.png` | `1sqMKBTs0Q49skcaY2waeMKEusRkfMJNi` | — |

**Folder note:** Prefer image 1 over image 3 for the exterior.

### 40ft Bulk Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1iuO6hU_jQNl-ShmN0c4X1sXEatj7IqsH)  
Recommended sequence: 1=#14, 2=#5, 3=#3, 4=#12, 5=#8, 6=#13, 7=#6, 8=#9, 9=#11, 10=#10, 11=#2, 12=#1, 13=#7, 14=#4.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 12 | 1 | diagram | landscape; 842×555 | `Layout2 (1).jpg` | `1_UomMkMD5mB_e-7KeiVqB0FOdLAyhWGH` | Lower-resolution diagram; supporting use only. |
| 11 | 2 | diagram | landscape; 849×555 | `Layout2.jpg` | `1AgT8Z9iq_ChRL98Qrt4xchpqJGkhShRi` | Lower-resolution diagram; supporting use only. |
| 3 | 3 | interior | landscape; 1476×1066 | `temporary-kitchen-trailer-refrigeration-and-wash-station.png` | `1aScjebfadA_iUaTxNKdZaDNzL9i0KcU6` | — |
| 14 | 4 | diagram | landscape; 844×560 | `Layout3 (1).jpg` | `1dsDfrDDyLnmdIHY6xDVotWZqrKONQuRd` | Lower-resolution diagram; supporting use only. |
| 2 | 5 | interior | landscape; 1448×1086 | `temporary-commercial-kitchen-trailer-tilting-skillets-prep-area.png` | `1FJQo5r_uJRIpJopNr4HtXLBbaTkJOec2` | — |
| 7 | 6 | detail | landscape; 1472×1069 | `mobile-commercial-kitchen-steam-jacketed-kettle-tilting-skillet.png` | `1gel0f7tnvBgRXBA4kss-eNj7qPa1yUmm` | — |
| 13 | 7 | diagram | landscape; 844×554 | `Layout3.jpg` | `1hCI6i6A5Bp9JHNkEvjoUxHI_J29RdDD7` | Lower-resolution diagram; supporting use only. |
| 5 | 8 | detail | landscape; 1448×1086 | `portable-commercial-kitchen-range-griddle-fryer-cooking-line.png` | `1HVEbhnM13zKoxlXIuaLmgDqqFpMx9tYh` | — |
| 8 | 9 | detail | portrait; 1086×1448 | `mobile-kitchen-trailer-stainless-steel-pot-wash-sink.png` | `1jM8KpkbuXRiBnkpX6mvSGTbSYtIJ6oKT` | — |
| 10 | 10 | diagram | landscape; 834×554 | `Layout1 (1).jpg` | `1JnWkQJRmsSuokxUWoGXROdqqEd_a8F18` | Lower-resolution diagram; supporting use only. |
| 9 | 11 | diagram | landscape; 848×555 | `Layout1.jpg` | `1mHOFy254mej18QrN9a19MwyDJv8tXywk` | Lower-resolution diagram; supporting use only. |
| 4 | 12 | interior | portrait; 1086×1448 | `mobile-commercial-kitchen-trailer-wash-sinks-convection-ovens.png` | `1tGTOO7F7UKcH2yemALMLyhE_C2HeJeGA` | — |
| 6 | 13 | detail | landscape; 1466×1073 | `commercial-kitchen-trailer-deep-fryer-gas-range-double-ovens.png` | `1wnCamKnNlYB5jZtFBqnftwQTM8ATTkDe` | — |
| 1 | 14 | interior | landscape; 1477×1065 | `portable-kitchen-trailer-range-convection-ovens-cooking-line.png` | `1YJT5WPS9eLLRnaGRdllRaPhMvRHugJlS` | Best supplied interior. |

**Folder note:** No exterior image supplied. Photos should precede diagrams.

### 40ft Bulk Combo Kitchen

Folder: [open in Google Drive](https://drive.google.com/drive/folders/10J-NgwiQIjN8l6dNICitMuuYCe6RHVMF)  
Recommended sequence: 1=#6, 2=#3, 3=#5, 4=#1, 5=#4, 6=#7. Exclude: #2.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 4 | 1 | interior | portrait; 1086×1448 | `portable-commercial-kitchen-trailer-sinks-stacked-ovens.png` | `15yCJyqyWjhErcp-x7ZZwIidJ_65qsJLJ` | — |
| Exclude | 2 | duplicate | portrait; 1086×1448 | `mobile-commercial-kitchen-steam-kettle-stainless-prep-table.png` | `1bhqDy0kXvQztwpT6fNnEz4Qe4BEdXIuD` | Exact duplicate of image 1; exclude. |
| 2 | 3 | interior | portrait; 1086×1448 | `temporary-kitchen-trailer-stainless-steel-cooking-facility.png` | `1bpL_8GJffR9vzxCIj1O9b1tX-6lFmm5Z` | — |
| 5 | 4 | detail | landscape; 1448×1086 | `portable-kitchen-trailer-stacked-commercial-convection-ovens.png` | `1BvAY6r9Ws6F5q4mFOcY2OtdM27plCUS1` | — |
| 3 | 5 | interior | landscape; 1448×1086 | `temporary-commercial-kitchen-trailer-sinks-convection-ovens.png` | `1m1fHH-X0P1RP9Cexawx2HZ-XLwJucxT1` | — |
| 1 | 6 | interior | landscape; 1448×1086 | `mobile-commercial-kitchen-trailer-ovens-wash-station-prep-area.png` | `1WFCv79qiWBOMm_b-xNsdYDCssdl19u2N` | Best supplied interior. |
| 6 | 7 | detail | landscape; 1448×1086 | `temporary-kitchen-trailer-deep-fryer-tilting-skillet.png` | `1Xtsip6d5eWD6egEu2rsbavdzBAlUsXOk` | — |

**Folder note:** No exterior image supplied.

### 22-26ft Low Temp Dish Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1d5t5BT61At03TpjOz3RZ0sYCTaYA8LcV)  
Recommended sequence: 1=#8, 2=#4, 3=#1, 4=#3, 5=#6, 6=#5, 7=#2, 8=#7.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 3 | 1 | interior | landscape; 1448×1086 | `mobile-dish-trailer-interior.png` | `1-zL2k3va48Gzz0v-WAAWazaA0gVa7wGV` | — |
| 7 | 2 | detail | landscape; 1411×1115 | `dish-trailer-three-compartment-sink.png` | `13CSiA_ytr1hqUAKKea5ioyhJ3G5s8Y-j` | — |
| 4 | 3 | interior | landscape; 1448×1086 | `dish-trailer-handwashing-station.png` | `16fPlrL2rfV0VNpcZ3SLTAVPNbkdL9n48` | — |
| 2 | 4 | exterior | landscape; 1448×1086 | `dish-trailer-rental-exterior.png` | `1Ck6j_BYLTgA9UKSzL_AeXQqKohD82dSB` | Best supplied exterior. |
| 6 | 5 | detail | landscape; 1448×1086 | `dishwashing-trailer-wash-rinse-sanitize-sink.png` | `1HfOTOytRAXKYquUF603i90-ZGSl8gN9O` | — |
| 5 | 6 | detail | landscape; 1448×1086 | `dish-trailer-commercial-dishwasher.png` | `1Q2T_yPBUyZq9vyXfS25YIffdyjFLbMj0` | — |
| 8 | 7 | detail | landscape; 1448×1086 | `dish-trailer-utility-sink-storage-racks.png` | `1qHz2e_TF93nQQAzxJxK45HdgNqlhhziI` | — |
| 1 | 8 | interior | landscape; 1448×1086 | `commercial-dish-trailer-stainless-workstation.png` | `1Vm5hE3OMA7epFawry10D4VJ9Vt0okP66` | Best supplied interior. |
| Exclude | — | unusable | — | `.DS_Store` | — | Non-image macOS metadata file. |

**Folder note:** One shared folder covers 22, 24, and 26 ft rows; exact model-by-image mapping still requires owner confirmation.

### 30ft Conveyor Dishwashing Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1vuLiQGv4kZglb45w4YEGTHIlW2Eh-lHV)  
Recommended sequence: 1=#2, 2=#1.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | exterior | landscape; 1268×1241 | `mobile-conveyor-trailer-rental.png` | `1f31qc56ilgISckJp6z6obclZNJlLzuey` | Residential/small-business driveway setting. |
| 1 | 2 | exterior | landscape; 1323×1189 | `commercial-conveyor-trailer-rental.png` | `1ngUyXVtt-4NFqAivFn8XM3cUE7vRCdi8` | Best supplied exterior. Residential/small-business setting; roof or house visible. |

**Folder note:** No interior supplied; neither exterior meets the requested commercial-site background standard.

### 38ft Low Temp Dish Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/14Hypf5WESWUWZm9gugr5nHRTqInQgIX9)  
Recommended sequence: 1=#1, 2=#4, 3=#2, 4=#3.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | interior | portrait; 1183×1329 | `dish-trailer-commercial-storage-shelving.png` | `15EzWkG8lt4ylvJYaET6Qzwur6UCHMSmw` | Best supplied interior. |
| 3 | 2 | detail | portrait; 980×1605 | `dish-trailer-sink-and-pre-rinse-station.png` | `1aMl-mnxpstVzP40KHMWCsRCD1NdfCSMf` | — |
| 4 | 3 | detail | portrait; 951×1654 | `dish-trailer-stainless-steel-work-table.png` | `1RTn6iDjBtCD3Ie2iZGCU9zZK1tmWFp-y` | — |
| 2 | 4 | interior | portrait; 958×1642 | `commercial-dish-trailer-interior.png` | `1XhRxiIemdKd2wWOrkzo3nGxxXuhqVDRd` | — |

**Folder note:** No exterior image supplied.

### 38ft High Temp Conveyor Dishwashing Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1OC1mihPOFZoPGSekCneR_bDPqELywMTY)  
Recommended sequence: 1=#10, 2=#9, 3=#8, 4=#7, 5=#3, 6=#1, 7=#2, 8=#4, 9=#5, 10=#6.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 6 | 1 | interior | portrait; 1157×1360 | `commercial-dish-trailer-dishwasher-loading-station.png` | `1dnBfXnqsyCeBt5QaJYz676kfwhR2RQjC` | — |
| 7 | 2 | detail | landscape; 1448×1086 | `dish-trailer-commercial-dishwashing-machine.png` | `1Fa8Lojk03kqsIoZXccMQGLIX2AGOHGsW` | — |
| 5 | 3 | interior | landscape; 1378×1141 | `dish-trailer-stainless-work-tables-and-sink.png` | `1hYDINQZL0ijEQBlJEjXH-OSTzZKwMy_1` | — |
| 8 | 4 | detail | landscape; 1444×1089 | `dish-trailer-commercial-utility-sink.png` | `1m4jrVq2OahBxMSrfDFfaAk4d-YaqbB4l` | — |
| 9 | 5 | detail | landscape; 1448×1086 | `dish-trailer-sink-and-stainless-work-tables.png` | `1mVk6LhFkkhjBRVkfQ4eM0gtcs57Ir0_8` | — |
| 10 | 6 | detail | landscape; 1448×1086 | `mobile-dish-trailer-sink-prep-station.png` | `1Oqeq1ZqieCokf7uYamF6sglkbS8kIfCR` | — |
| 4 | 7 | interior | landscape; 1448×1086 | `mobile-dishwashing-trailer-dishwasher-work-area.png` | `1puglOuJjFS2gBL3vsSS9IIts5taCb7EK` | — |
| 3 | 8 | interior | landscape; 1448×1086 | `commercial-dish-trailer-three-compartment-sink.png` | `1R_k9ksXO5wT_U4JJEgElrNzUrRd92elS` | — |
| 2 | 9 | interior | landscape; 1448×1086 | `dish-trailer-rental-complete-interior.png` | `1sFHgk7K-Ozh2OysCLlcxAUHq0xcCkPHn` | — |
| 1 | 10 | interior | landscape; 1448×1086 | `dishwashing-trailer-wash-rinse-sanitize-station.png` | `1ZdbBJR8C52wCTKWF12KUj2nQzeBiXklr` | Best supplied interior. |

**Folder note:** No exterior image supplied.

### 20ft Refrigerated Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/11G3nczi2n2feLv5PX-rLegZAYXl3JsGu)  
Recommended sequence: 1=#1, 2=#2, 3=#4, 4=#3. Exclude: #5.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | interior | portrait; 1086×1448 | `refrigerated-trailer-interior-cooling-system.png` | `10hjCOlxP65729BATQw_ejxRr2XHUk96v` | Best supplied interior. |
| 2 | 2 | exterior | landscape; 1434×1097 | `portable-refrigeration-trailer-exterior.png` | `1KpTzRD3I5lTYx-ooTZDTu8PrFTvYkyFM` | Best supplied exterior. |
| 4 | 3 | exterior | landscape; 1434×1097 | `refrigeration-trailer-rental-exterior.png` | `1P5JMJsvJlUP6AfLYVNfYcDS39VH6cgdU` | Promotional text and mixed fleet view; supporting use only. |
| 3 | 4 | exterior | landscape; 1448×1086 | `refrigeration-trailer-rental-fleet.png` | `1TVc3g0TYH0wNOft7KSUmVMii43SJXTP6` | — |
| Exclude | 5 | duplicate | portrait; 1086×1448 | `refrigeration-trailer-stainless-steel-interior.png` | `1ymNbRLAgwZiU-0RZA4o_VUPyDZG-zPfr` | Near-duplicate crop of image 1; exclude from carousel. |

**Folder note:** Image 4 has an acceptable commercial-building background.

### 30ft Laundry Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1ZW_Rt-N95G51786zEzPp5hmGKMVQeygx)  
Recommended sequence: 1=#1.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | interior | portrait; 939×1675 | `mobile-laundry-trailer-commercial-washers-dryers.png` | `1BDMKRLZayj55ZR-ut5hFqgGRIWHASZmz` | Best supplied interior. Visually near-identical to the only 26–27 ft Laundry image; exact model cannot be verified visually. |

**Folder note:** No exterior image supplied; model identity needs owner confirmation.

### 26-27ft Laundry Trailer

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1MjW3a3k5tHbVBFco4GX7E_UPaqtAFp8r)  
Recommended sequence: 1=#1.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | interior | portrait; 939×1675 | `mobile-laundry-trailer-washer-dryer-interior.png` | `1aT5VuiZVnU9sJO8Xs10Z11qOSFBoD7UW` | Best supplied interior. Visually near-identical to the only 30 ft Laundry image; exact model cannot be verified visually. |

**Folder note:** No exterior image supplied; model identity needs owner confirmation.

### 20ft Laundry Container (nested child)

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1UdLkPChLAKZFzBGvhBAoed5ZYXxal_RG)  
Supplied parent: [open parent](https://drive.google.com/drive/folders/1vQ4YVHz5H619Y1UqtX18vL0MQBiUHR73)  
Recommended sequence: 1=#3, 2=#1, 3=#2.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | interior | portrait; 665×889 | `Laundry Container 7 units 2.png` | `1FxOirtU523G9HGNcviLURKRiousfx4qn` | Portrait and relatively low resolution for full-width use. |
| 3 | 2 | interior | portrait; 666×884 | `_Laundry Container 7units.png` | `1hlbjOSBwOG27REyvKimdz_2RRMpcxyC` | Portrait, dim, and relatively low resolution. |
| 1 | 3 | interior | portrait; 669×887 | `Laundry Container 7 units 1.png` | `1QRcFal5YpCxkGomR2-5pWJ4CIX0xtAVG` | Best supplied interior. Portrait and relatively low resolution for full-width use. |

**Folder note:** The supplied URL was a parent containing 20 equipment folders. The actual nested 20 ft Laundry Container folder was followed. No exterior supplied.

### 13ft Luxury Shower-Restroom Combination

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1nNO_JMxe_juH8SOVSw9F-nzhXnZaBSsD)  
Recommended sequence: 1=#7, 2=#5, 3=#1, 4=#6, 5=#4, 6=#2, 7=#3.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 3 | 1 | interior | portrait; 1089×1444 | `Codex Image Sep 15, 2026, 02_08_13 AM.png` | `19fFPnxAjTLmopkxkG_z_nu_NtwiMuf8w` | — |
| 6 | 2 | exterior | portrait; 1086×1448 | `Codex Image Sep 15, 2026, 02_09_22 AM.png` | `1deV-BOVIY1Ynfqs_ldDUfSEnuA-Kr3tj` | Residential/small-business driveway background. |
| 7 | 3 | exterior | portrait; 1054×1492 | `trIb2t0R__Codex Image Sep 15, 2026, 02_09_15 AM.png` | `1JLRkk0ppJuBB1YfFOlq4Uz` | Residential/small-business driveway background. |
| 5 | 4 | exterior | portrait; 1086×1448 | `Codex Image Sep 15, 2026, 02_08_55 AM.png` | `1QOlMnUXmyFUQW8SCOTEG0Q4hf8J38KtX` | Background is not clearly commercial. |
| 2 | 5 | exterior | landscape; 1382×1138 | `Codex Image Sep 15, 2026, 02_09_04 AM.png` | `1yFQCL4FEDCedtZfQMo1ReGLVj7WnHMz0` | Best supplied exterior. Best available exterior, but site is not clearly commercial. |
| 4 | 6 | interior | portrait; 1011×1556 | `Codex Image Sep 15, 2026, 02_08_35 AM.png` | `1ZeZ4SJ0xOdoUbXUWFnAPRyQXd_-JyTsX` | Doorway view with a residential/small-business setting visible. |
| 1 | 7 | interior | portrait; 1086×1448 | `Codex Image Sep 15, 2026, 02_08_46 AM.png` | `1ZFYVE1kJZwU3sgJy7vJIrKPCpJuthGnP` | Best supplied interior. |

**Folder note:** Exterior set does not meet the requested commercial/industrial-setting preference.

### 22ft Luxury Shower-Restroom Combination

Folder: [open in Google Drive](https://drive.google.com/drive/folders/16UWOiaYctvfe3ozuLKmVcE6_gQHNC8WW)  
Recommended sequence: 1=#1, 2=#6, 3=#7, 4=#5, 5=#4, 6=#2, 7=#3.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | interior | portrait; 937×1678 | `Codex Image Sep 15, 2026, 03_44_11 AM.png` | `1CiYRSUZKGue6cpIUsZtVbRq7sZI-Aqhf` | Best supplied interior. |
| 6 | 2 | exterior | portrait; 928×1694 | `Codex Image Sep 15, 2026, 03_43_56 AM.png` | `1D_vOb7GHVVuLMJXH5_NXXxcRLNCM9XLa` | Outdoor lot background is ambiguous. |
| 7 | 3 | exterior | portrait; 939×1675 | `Codex Image Sep 15, 2026, 03_44_18 AM.png` | `1iekNo18xWjysKX_3vsqTCFqBqg6kjRWW` | Outdoor lot background is ambiguous. |
| 5 | 4 | exterior | portrait; 941×1672 | `Codex Image Sep 15, 2026, 03_43_06 AM.png` | `1kLB2nAQi0c9_N77vrpDFM2HvcyFSIX7L` | — |
| 4 | 5 | detail | portrait; 942×1669 | `Codex Image Sep 15, 2026, 03_44_02 AM.png` | `1mMWJJ66ePBfCeJgm9dS09b9A6S0G5dH5` | — |
| 2 | 6 | exterior | portrait; 941×1672 | `Codex Image Sep 15, 2026, 03_43_37 AM.png` | `1tscOQOzMnD-xJ3BMr4NL9QL5boPhYRad` | Best supplied exterior. |
| 3 | 7 | exterior | portrait; 941×1672 | `Codex Image Sep 15, 2026, 03_43_47 AM.png` | `1tWbp0f6_X5TTpsZnaiu1GGCEhWndueTD` | — |

**Folder note:** Images 6 and 7 have the strongest commercial warehouse context.

### 30ft Luxury Shower-Restroom Combination

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1OEk_GG66gYVgBH6ZS-u30-Kb4V0Gy4RG)  
Recommended sequence: 1=#1.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 1 | 1 | exterior | portrait; 1086×1448 | `si1pYmMIdkb6gmMRGxcT__Codex Image Sep 15, 2026, 02_17_46 AM.png` | `1dxx_gXQNXQ` | Best supplied exterior. Outdoor lot background is not clearly commercial or industrial. |

**Folder note:** No interior image supplied.

### 20ft Shower Container

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1-VGExIftnJBBWPzROjPsTKJYrwTsG04A)  
Recommended sequence: 1=#4, 2=#2, 3=#1, 4=#3.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 3 | 1 | interior | portrait; 1086×1448 | `shower-container-private-shower-stall.png` | `10McBqjrJHMFEAUGHTVYau6vDk77jF1oH` | — |
| 2 | 2 | interior | portrait; 1086×1448 | `shower-container-rental-private-stalls.png` | `1DHSkmYMTlOgxz9QlFpfIWa6ClUHcayUH` | — |
| 4 | 3 | interior | portrait; 1086×1448 | `mobile-shower-container-interior.png` | `1IVPyg8yqu2Rlw8JEVcBmoUqZpLfa3OD-` | — |
| 1 | 4 | interior | portrait; 1086×1448 | `portable-shower-container-multiple-stalls.png` | `1tOIsoqu0GQ4ENDa8H6lavSSzHyynKLu7` | Best supplied interior. |

**Folder note:** No exterior image supplied.

### Water Tank

Folder: [open in Google Drive](https://drive.google.com/drive/folders/1i8LIu0PYWFmSEsOzzuvXx163aXmAK4mG)  
Recommended sequence: 1=#2, 2=#1, 3=#3, 4=#4, 5=#5.

| Recommended position | Visual # | Classification | Orientation / pixels | Filename | Drive file ID | Flags |
| ---: | ---: | --- | --- | --- | --- | --- |
| 2 | 1 | exterior | landscape; 1434×1097 | `temporary-water-storage-tanks-mobile-water-trailer.png` | `1HyiIxCzkW2Ej9nZvHBqEVIqo7EFFtA5r` | Mixed-equipment composition; adjacent trailer competes with the tank. |
| 1 | 2 | exterior | landscape; 1434×1097 | `portable-water-tanks-with-pump-and-hoses.png` | `1mQoDd1SrEglbOiWCm7tRj7Ii6CPkqw8A` | Best supplied exterior. Mixed-equipment composition; crop carefully. |
| 3 | 3 | exterior | landscape; 1434×1097 | `temporary-water-storage-tanks-rental-system.png` | `1w3QnLQQ8w1NyYtnb16wm5QSdUcc6AvXA` | Mixed-equipment composition; crop carefully. |
| 4 | 4 | exterior | landscape; 1434×1097 | `mobile-water-trailer-with-portable-water-tanks.png` | `1y13IqJHOTPKf1xt1rqO53X94l5iIm8T8` | Mixed-equipment composition; crop carefully. |
| 5 | 5 | exterior | landscape; 1434×1097 | `mobile-water-storage-tank-trailer-setup.png` | `1ZAqybgSh2kOpF7UGHAcLyvNq25o_s_pg` | Mixed-equipment composition; crop carefully. |

**Folder note:** Interior is not applicable. Commercial parking-lot setting is acceptable.

## Current equipment rows without an exact supplied folder

The following rows exist in the current service navigation but do not have an exact-model folder in the supplied 20-folder set. Future mapping must not borrow a similar-looking model unless the owner confirms it.

| Current equipment row | Current route | Why not mapped |
| --- | --- | --- |
| 26ft Bulk Mobile Kitchen | /services/mobile-kitchen-trailers/26ft-bulk/ | Only a 40ft Bulk Kitchen folder was supplied. |
| 12ft Refrigeration Trailer | /equipment-rental-refrigeration-12ft-refrigerated-trailer/ | Only a 20ft Refrigerated Trailer folder was supplied. |
| 40ft Refrigerated Container | /equipment-rental/refrigerated-containers/ | No matching container folder was supplied. |
| 22 ft Shower Trailer, 10 Stalls | /services/shower-trailers/22ft-10-stall/ | The supplied 22ft folder is a shower-restroom combination, not shower-only. |
| Luxury Combination Trailer, 3 Stalls + 1 ADA | /services/shower-restroom-combination-trailers/3-stall-1-ada/ | No ADA folder was supplied. |
| Luxury Combination Trailer, 8 Stalls + 1 ADA | /services/shower-restroom-combination-trailers/8-stall-1-ada/ | No ADA folder was supplied. |
| 20ft Shared Sleeper Trailer | /services/mobile-sleeper-trailers/20ft-shared/ | No sleeper folder was supplied. |
| 20ft Contractor Sleeper Trailer | /services/mobile-sleeper-trailers/20ft-contractor/ | No sleeper folder was supplied. |
| 20ft VIP Sleeper Trailer | /services/mobile-sleeper-trailers/20ft-vip/ | No sleeper folder was supplied. |
| Containerized Sleeper Units | /remote-containerized-military-berthing-solution-for-rent/ | No sleeper folder was supplied. |
| 24ft Mobile Laundry Trailer | /services/laundry-trailers/24ft/ | Only 26–27ft, 30ft, and 20ft container laundry folders were supplied. |
| Portable Handwashing Stations | /equipment-rental/handwashing-stations/ | No handwashing folder was supplied. |
| Hands-Free Handwashing Stations | /services/handwashing-trailers/hands-free/ | No handwashing folder was supplied. |

Additional folder-to-route mismatches that need an owner decision:

- The supplied 30ft Conveyor Dishwashing folder has no exact 30ft dishwashing route in the current service navigation.
- The supplied 40ft Bulk Kitchen folder does not match the current 26ft Bulk Mobile Kitchen row.
- The supplied 20ft Laundry Container folder has no exact current service-navigation row.
- Two different 38ft dish folders exist (Low Temp and High Temp Conveyor), while the current navigation exposes one 38ft Conveyor route. Use the High Temp Conveyor set only if the equipment identity is confirmed.

## Safe handoff rules for the future implementation task

- Use the exact folder/model mapping only; never fill a missing view with a visually similar trailer from another folder.
- Keep the recommended sequence deterministic. Do not randomize images at runtime.
- Put photographs before diagrams and exclude the duplicate/unusable rows identified above.
- Do not claim that an image depicts a prison, hospital, military site, hotel, man camp, or industrial facility unless that setting is visibly verifiable.
- Write truthful alt text from the visible equipment and setting. Avoid adding a city, model, stall count, or facility type that the photo does not establish.
- Preserve responsive aspect ratios and create properly sized derivatives for each placement; do not distort dimensions just to create visual variety.
- Obtain replacement commercial-setting exteriors for the flagged folders before treating the carousel as fully compliant with the boss’s image-background direction.
