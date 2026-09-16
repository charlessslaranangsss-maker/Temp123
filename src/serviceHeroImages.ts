export type ServiceHeroImageView = "interior" | "exterior" | "plan" | "detail";

export type ServiceHeroImage = {
  id: string;
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  view: ServiceHeroImageView;
  sortOrder: number;
  sourceUrl: string;
};

type LocalImageRow = readonly [
  view: ServiceHeroImageView,
  src: string,
  width: number,
  height: number,
  alt: string,
];

function localSet(
  slug: string,
  rows: readonly LocalImageRow[],
): readonly ServiceHeroImage[] {
  return rows.map(([view, src, width, height, alt], index) => ({
    id: `${slug}-${String(index + 1).padStart(2, "0")}`,
    src,
    srcSet: src,
    sizes: responsiveSizes,
    width,
    height,
    alt,
    view,
    sortOrder: index + 1,
    sourceUrl: src,
  }));
}

type VerifiedImageRow = readonly [
  view: ServiceHeroImageView,
  width: number,
  height: number,
  driveFileId: string,
  alt?: string,
];

const responsiveSizes =
  "(max-width: 700px) calc(100vw - 36px), (max-width: 1100px) 48vw, 620px";

function verifiedSet(
  slug: string,
  label: string,
  rows: readonly VerifiedImageRow[],
): readonly ServiceHeroImage[] {
  const viewTotals: Partial<Record<ServiceHeroImageView, number>> = {};
  return rows.map(([view, width, height, driveFileId, verifiedAlt], index) => {
    const position = String(index + 1).padStart(2, "0");
    const root = `/images/service-heroes/${slug}/${position}`;
    viewTotals[view] = (viewTotals[view] ?? 0) + 1;
    return {
      id: `${slug}-${position}`,
      src: `${root}-960.webp`,
      srcSet: `${root}-480.webp 480w, ${root}-960.webp 960w`,
      sizes: responsiveSizes,
      width,
      height,
      alt:
        verifiedAlt ??
        `${label} ${
          view === "detail" ? "interior equipment detail" : `${view} view`
        } ${viewTotals[view]}`,
      view,
      sortOrder: index + 1,
      sourceUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
    };
  });
}

/**
 * Exact route-to-asset registry derived from DRIVE_ASSET_INVENTORY.md.
 * Flagged residential/ambiguous backgrounds, wrong models and duplicates are
 * intentionally absent. Array order is the approved deterministic order.
 */
export const serviceHeroImages: Readonly<
  Record<string, readonly ServiceHeroImage[]>
> = {
  "/services/mobile-kitchen-trailers/24ft/": verifiedSet(
    "24ft-mobile-kitchen",
    "24 ft mobile kitchen trailer",
    [
      ["interior", 960, 1280, "1s1gafYUfg4Ik_2mgs2egSL1GNrqU17NJ"],
      ["exterior", 960, 1280, "187PF6SOGJL_2mb-qXJ0jaDlg30utSR9F"],
      ["interior", 960, 1280, "1SfBYSaldDAqg_-3X5V23YGf1d7OWtkCV"],
      ["detail", 960, 1280, "1olj8MmcVthDQpoWzrxB7_ezEqRjijDID"],
      ["detail", 960, 1280, "1OcIB4NszHR8RSbnTuTOya_hiBegejAM-"],
    ],
  ),
  "/services/mobile-kitchen-trailers/28ft/": verifiedSet(
    "28ft-mobile-kitchen",
    "28 ft mobile kitchen trailer",
    [
      ["interior", 960, 540, "1f9zmkts82kXeE0csOpPpFIsz_9AXI-_7"],
      ["interior", 960, 1280, "1agVNDaCPMlmKB-nRdtfgBXxMnnxKs99S"],
      ["interior", 960, 1280, "1gVHAQVJBfvdSi5vlTks05ePwabtx-JnQ"],
      ["detail", 960, 1280, "1CyiyKwNzy9ZEntFE9z-vsPtkZWCSimvj"],
      ["interior", 960, 1280, "18LR57Zb75hJ5FO1g9jqWreny0lj4exY0"],
      ["detail", 960, 1280, "1AvisHePT7SJ7_7JOCO_GEeNPu1yfn5z5"],
      ["detail", 960, 1263, "1SOF7WkSKCVLPN1hybEzfMr3xIQA6rgmw"],
    ],
  ),
  "/services/mobile-kitchen-trailers/38ft/": verifiedSet(
    "38ft-mobile-kitchen",
    "38 ft mobile kitchen trailer",
    [
      ["interior", 960, 1588, "1vvInKeHG7XlXqbQER1ZQgpsAZs4JsEPm"],
      ["detail", 960, 1220, "1kT9KgUe07k1K2OEIz5Vux6pe_IVU7DRG"],
    ],
  ),
  "/services/mobile-kitchen-trailers/40ft/": verifiedSet(
    "40ft-mobile-kitchen",
    "40 ft mobile kitchen trailer",
    [
      ["interior", 947, 1661, "1ePVcY8R2d-Dskpwu3ut3J8V24sTbacSb"],
      ["detail", 960, 1266, "185rnnBHmUwa1uB8TAwUupPtwLFSorkwA"],
      ["detail", 960, 1309, "1_zLxyoYDVZW8eBUYKg9puPTdPf8I3uyN"],
      ["detail", 960, 1274, "1FAthp0KocT3pO-lLtguRyT4opQjRPVmu"],
      ["detail", 933, 1686, "1H4NeV5C72odXvYDKM78rsO0nk7O-No3i"],
      ["detail", 960, 1285, "1R9JEvAfMbulaP320MZ3uNnxnefL5sfY2"],
      ["detail", 948, 1659, "1W5DAGEz3dTdsNXCoQ5UOgcB5zfcgs8g6"],
      ["detail", 960, 1638, "1y77ASXfTb9ilSGxSqr754ea56_XgXMMj"],
      ["plan", 697, 459, "12YLtxJ5ydN9n4UKOQJx0Uum7TE-0Qc7O"],
      ["plan", 693, 456, "16Mdd-Su7wYXj2e_UrDyARKkwOK53B5tN"],
    ],
  ),
  "/services/mobile-kitchen-trailers/40ft-combination/": verifiedSet(
    "40ft-combination-kitchen",
    "40 ft combination kitchen trailer",
    [
      ["interior", 960, 1280, "1N5Nl_qL2otlAA-rtGiaV_xRnLK_wVias"],
      ["exterior", 960, 720, "194MZuL9hne6CKyPv-H2wn19sQtPHtNGy"],
      ["interior", 939, 1675, "1A3uFQy37PSEgFm7lIMjc6FPZ05zhjFlh"],
      ["interior", 960, 1280, "1cOfpx89aoXzpQAKANxd5dL0AqBwBeUfN"],
      ["detail", 960, 1280, "1bmA3gXxFhumg8amk-xFvjP-aECAGc_-8"],
      ["detail", 960, 1280, "1kmhZ9L4NDcvpBnI8Nkj3FdhvWFlH_DEk"],
      ["detail", 960, 1280, "1kuOcPMD8JaBLStXkuEuPG5_JntduscVA"],
      ["detail", 960, 1280, "1mXnmI5T_pyscyK_8Tra_Ieeg-vKSpOsL"],
      ["detail", 960, 1280, "1sqMKBTs0Q49skcaY2waeMKEusRkfMJNi"],
    ],
  ),
  "/services/mobile-kitchen-trailers/40ft-bulk-combination/": verifiedSet(
    "40ft-bulk-combination-kitchen",
    "40 ft bulk combination kitchen trailer",
    [
      ["interior", 960, 720, "1WFCv79qiWBOMm_b-xNsdYDCssdl19u2N"],
      ["interior", 960, 1280, "1bpL_8GJffR9vzxCIj1O9b1tX-6lFmm5Z"],
      ["interior", 960, 720, "1m1fHH-X0P1RP9Cexawx2HZ-XLwJucxT1"],
      ["interior", 960, 1280, "15yCJyqyWjhErcp-x7ZZwIidJ_65qsJLJ"],
      ["detail", 960, 720, "1BvAY6r9Ws6F5q4mFOcY2OtdM27plCUS1"],
      ["detail", 960, 720, "1Xtsip6d5eWD6egEu2rsbavdzBAlUsXOk"],
    ],
  ),
  "/media-library/40ft-bulk-kitchen/": verifiedSet(
    "40ft-bulk-kitchen",
    "40 ft bulk kitchen trailer",
    [
      ["interior", 960, 692, "1YJT5WPS9eLLRnaGRdllRaPhMvRHugJlS"],
      ["interior", 960, 720, "1FJQo5r_uJRIpJopNr4HtXLBbaTkJOec2"],
      ["interior", 960, 693, "1aScjebfadA_iUaTxNKdZaDNzL9i0KcU6"],
      ["interior", 720, 960, "1tGTOO7F7UKcH2yemALMLyhE_C2HeJeGA"],
      ["detail", 960, 720, "1HVEbhnM13zKoxlXIuaLmgDqqFpMx9tYh"],
      ["detail", 960, 703, "1wnCamKnNlYB5jZtFBqnftwQTM8ATTkDe"],
      ["detail", 960, 697, "1gel0f7tnvBgRXBA4kss-eNj7qPa1yUmm"],
      ["detail", 720, 960, "1jM8KpkbuXRiBnkpX6mvSGTbSYtIJ6oKT"],
      ["plan", 960, 628, "1mHOFy254mej18QrN9a19MwyDJv8tXywk"],
      ["plan", 960, 638, "1JnWkQJRmsSuokxUWoGXROdqqEd_a8F18"],
      ["plan", 960, 628, "1AgT8Z9iq_ChRL98Qrt4xchpqJGkhShRi"],
      ["plan", 960, 633, "1_UomMkMD5mB_e-7KeiVqB0FOdLAyhWGH"],
      ["plan", 960, 630, "1hCI6i6A5Bp9JHNkEvjoUxHI_J29RdDD7"],
      ["plan", 960, 637, "1dsDfrDDyLnmdIHY6xDVotWZqrKONQuRd"],
    ],
  ),
  "/media-library/22-26ft-low-temp-dish/": verifiedSet(
    "22-26ft-low-temp-dish",
    "22 to 26 ft low-temperature dishwashing trailer",
    [
      ["interior", 960, 720, "1Vm5hE3OMA7epFawry10D4VJ9Vt0okP66"],
      ["interior", 960, 720, "1-zL2k3va48Gzz0v-WAAWazaA0gVa7wGV"],
      ["interior", 960, 720, "16fPlrL2rfV0VNpcZ3SLTAVPNbkdL9n48"],
      ["detail", 960, 720, "1Q2T_yPBUyZq9vyXfS25YIffdyjFLbMj0"],
      ["detail", 960, 720, "1HfOTOytRAXKYquUF603i90-ZGSl8gN9O"],
      ["detail", 960, 759, "13CSiA_ytr1hqUAKKea5ioyhJ3G5s8Y-j"],
      ["detail", 960, 720, "1qHz2e_TF93nQQAzxJxK45HdgNqlhhziI"],
      ["exterior", 960, 720, "1Ck6j_BYLTgA9UKSzL_AeXQqKohD82dSB"],
    ],
  ),
  "/media-library/38ft-low-temp-dish/": verifiedSet(
    "38ft-low-temp-dish",
    "38 ft low-temperature dishwashing trailer",
    [
      ["interior", 855, 960, "15EzWkG8lt4ylvJYaET6Qzwur6UCHMSmw"],
      ["interior", 560, 960, "1XhRxiIemdKd2wWOrkzo3nGxxXuhqVDRd"],
      ["detail", 586, 960, "1aMl-mnxpstVzP40KHMWCsRCD1NdfCSMf"],
      ["detail", 552, 960, "1RTn6iDjBtCD3Ie2iZGCU9zZK1tmWFp-y"],
    ],
  ),
  "/services/dishwashing-trailers/38ft-conveyor/": verifiedSet(
    "38ft-high-temp-dish",
    "38 ft high-temperature conveyor dishwashing trailer",
    [
      ["interior", 960, 720, "1ZdbBJR8C52wCTKWF12KUj2nQzeBiXklr"],
      ["interior", 960, 720, "1sFHgk7K-Ozh2OysCLlcxAUHq0xcCkPHn"],
      ["interior", 960, 720, "1R_k9ksXO5wT_U4JJEgElrNzUrRd92elS"],
      ["interior", 960, 720, "1puglOuJjFS2gBL3vsSS9IIts5taCb7EK"],
      ["interior", 960, 795, "1hYDINQZL0ijEQBlJEjXH-OSTzZKwMy_1"],
      ["interior", 817, 960, "1dnBfXnqsyCeBt5QaJYz676kfwhR2RQjC"],
      ["detail", 960, 720, "1Fa8Lojk03kqsIoZXccMQGLIX2AGOHGsW"],
      ["detail", 960, 724, "1m4jrVq2OahBxMSrfDFfaAk4d-YaqbB4l"],
      ["detail", 960, 720, "1mVk6LhFkkhjBRVkfQ4eM0gtcs57Ir0_8"],
      ["detail", 960, 720, "1Oqeq1ZqieCokf7uYamF6sglkbS8kIfCR"],
    ],
  ),
  "/20ft-refrigeration-trailers/": verifiedSet(
    "20ft-refrigerated-trailer",
    "20 ft refrigerated trailer",
    [
      ["interior", 960, 1280, "10hjCOlxP65729BATQw_ejxRr2XHUk96v"],
      ["exterior", 960, 734, "1KpTzRD3I5lTYx-ooTZDTu8PrFTvYkyFM"],
      [
        "exterior",
        960,
        720,
        "1TVc3g0TYH0wNOft7KSUmVMii43SJXTP6",
        "20 ft refrigerated trailer outside a commercial building",
      ],
      ["exterior", 960, 734, "1P5JMJsvJlUP6AfLYVNfYcDS39VH6cgdU"],
    ],
  ),
  "/services/shower-restroom-combination-trailers/13ft-3-stall/": verifiedSet(
    "13ft-shower-restroom-combination",
    "13 ft three-stall shower and restroom combination trailer",
    [
      ["interior", 960, 1280, "1ZFYVE1kJZwU3sgJy7vJIrKPCpJuthGnP"],
      ["interior", 960, 1273, "19fFPnxAjTLmopkxkG_z_nu_NtwiMuf8w"],
    ],
  ),
  "/services/shower-restroom-combination-trailers/22ft-6-stall/": verifiedSet(
    "22ft-shower-restroom-combination",
    "22 ft six-stall shower and restroom combination trailer",
    [
      ["interior", 937, 1678, "1CiYRSUZKGue6cpIUsZtVbRq7sZI-Aqhf"],
      [
        "exterior",
        941,
        1672,
        "1tscOQOzMnD-xJ3BMr4NL9QL5boPhYRad",
        "22 ft six-stall shower and restroom combination trailer with multiple private entrances inside a commercial warehouse",
      ],
      [
        "exterior",
        941,
        1672,
        "1tWbp0f6_X5TTpsZnaiu1GGCEhWndueTD",
        "Opposite-side view of a 22 ft six-stall shower and restroom combination trailer inside a commercial warehouse",
      ],
      ["detail", 942, 1669, "1mMWJJ66ePBfCeJgm9dS09b9A6S0G5dH5"],
      ["exterior", 941, 1672, "1kLB2nAQi0c9_N77vrpDFM2HvcyFSIX7L"],
    ],
  ),
  "/services/shower-restroom-combination-trailers/30ft-8-stall/": verifiedSet(
    "30ft-shower-restroom-combination",
    "30 ft eight-stall shower and restroom combination trailer",
    [
      [
        "exterior",
        960,
        1280,
        "1dxx_gXQNXQ",
        "30 ft eight-stall shower and restroom combination trailer with multiple private exterior entrances",
      ],
    ],
  ),
  "/services/shower-containers/20ft-5-stall/": verifiedSet(
    "20ft-shower-container",
    "20 ft five-stall shower container",
    [
      ["interior", 960, 1280, "1tOIsoqu0GQ4ENDa8H6lavSSzHyynKLu7"],
      ["interior", 960, 1280, "1DHSkmYMTlOgxz9QlFpfIWa6ClUHcayUH"],
      ["interior", 960, 1280, "10McBqjrJHMFEAUGHTVYau6vDk77jF1oH"],
      ["interior", 960, 1280, "1IVPyg8yqu2Rlw8JEVcBmoUqZpLfa3OD-"],
    ],
  ),
  "/services/mobile-sleeper-trailers/20ft-shared/": localSet(
    "20ft-shared-sleeper",
    [
      ["interior", "/media/4b67ae2ec507c379fdf9a7e3.png", 850, 650, "Communal bunk-bed sleeping area inside a 20 ft shared mobile sleeper trailer"],
      ["interior", "/media/599283a9ef6bf5d260ca0648.png", 850, 650, "Four-bunk shared sleeping area inside a mobile sleeper trailer"],
      ["exterior", "/media/1ac07501887589e4f0c3060e.png", 850, 650, "Exterior of a four-room mobile sleeper bunk-bed trailer"],
    ],
  ),
  "/services/mobile-sleeper-trailers/20ft-contractor/": localSet(
    "20ft-contractor-sleeper",
    [
      ["interior", "/media/16e1edca80af2743a382280b.png", 850, 650, "Two-bunk contractor sleeping room inside a mobile sleeper trailer"],
      ["interior", "/media/d4284cb63385949087e03ee9.png", 850, 650, "Compact contractor bunk-bed accommodation inside a mobile sleeper trailer"],
    ],
  ),
  "/services/mobile-sleeper-trailers/20ft-vip/": localSet(
    "20ft-vip-sleeper",
    [
      ["interior", "/media/92093075ae986ac89edb2378.png", 850, 650, "Private bed and lounge area inside a 20 ft VIP mobile sleeper trailer"],
    ],
  ),
  "/remote-containerized-military-berthing-solution-for-rent/": localSet(
    "containerized-sleeper",
    [
      ["interior", "/media/4b67ae2ec507c379fdf9a7e3.png", 850, 650, "Communal bunk-bed sleeping area for temporary containerized crew berthing"],
      ["interior", "/media/599283a9ef6bf5d260ca0648.png", 850, 650, "Four-bunk sleeping area for temporary containerized crew berthing"],
      ["interior", "/media/16e1edca80af2743a382280b.png", 850, 650, "Two-bunk room inside a modular temporary berthing unit"],
      ["interior", "/media/d4284cb63385949087e03ee9.png", 850, 650, "Compact bunk room inside a modular temporary berthing unit"],
      ["exterior", "/media/9b8c1d6a8e92cd55cd909891.png", 850, 650, "Row of modular sleeping units for temporary crew berthing"],
      ["exterior", "/media/6ec88e391d22b5c6ce13ebb3.png", 850, 650, "Exterior view of modular sleeping units in a temporary crew camp"],
    ],
  ),
  "/media-library/30ft-laundry-trailer/": verifiedSet(
    "30ft-laundry-trailer",
    "30 ft commercial laundry trailer",
    [["interior", 939, 1675, "1BDMKRLZayj55ZR-ut5hFqgGRIWHASZmz"]],
  ),
  "/media-library/26-27ft-laundry-trailer/": verifiedSet(
    "26-27ft-laundry-trailer",
    "26 to 27 ft commercial laundry trailer",
    [["interior", 939, 1675, "1aT5VuiZVnU9sJO8Xs10Z11qOSFBoD7UW"]],
  ),
  "/media-library/20ft-laundry-container/": verifiedSet(
    "20ft-laundry-container",
    "20 ft commercial laundry container",
    [
      ["interior", 669, 887, "1QRcFal5YpCxkGomR2-5pWJ4CIX0xtAVG"],
      ["interior", 665, 889, "1FxOirtU523G9HGNcviLURKRiousfx4qn"],
      ["interior", 666, 884, "1hlbjOSBwOG27REyvKimdz_2RRMpcxyC"],
    ],
  ),
  "/media-library/20ft-shower-trailer-sink/": verifiedSet(
    "20ft-shower-trailer-sink",
    "20 ft five-stall shower trailer with handwashing sinks",
    [
      ["interior", 960, 1280, "1ZSLojSpLoJEV92yLEv9NayqUlipOeetu"],
      ["detail", 960, 1280, "1roGL7xG7Z17OexW0hy2MHbMR8tNXXA2Z", "Three handwashing sinks and mirrors in a 20 ft shower trailer"],
      ["exterior", 960, 1280, "11oNTsbQSHlZAzkL8InhiidCttgBmR1Ba", "20 ft multi-door shower trailer inside a commercial facility"],
      ["exterior", 960, 738, "1aPclhaNoLuCP8h7U8mzRngIhveigA113", "Side view of a 20 ft multi-door shower trailer inside a commercial facility"],
      ["exterior", 960, 1217, "1yrIfrp5t5s5wuL68SLz5L2YM-_uQn3wg", "Rear view of a 20 ft shower trailer"],
    ],
  ),
  "/equipment-rental/handwashing-stations/": verifiedSet(
    "handwashing-sink-trailer",
    "commercial handwashing sink trailer",
    [
      ["detail", 960, 734, "1rImzuG71XXGALTGed9faoJ8dX5069wSV", "Two banks of sinks under awnings on a commercial handwashing trailer"],
      ["exterior", 960, 734, "1pS_NNVjF11EaD4BvbAkeNmK0kvORa83R", "Six-sink commercial handwashing trailer in an industrial lot"],
      ["exterior", 960, 734, "1kXodyplA7NjFtiHz1JE_WGtPKFkM4G5n", "Commercial handwashing trailer with deployed sinks and awning"],
    ],
  ),
  "/media-library/water-tank/": verifiedSet(
    "water-tank",
    "mobile commercial water tank system",
    [
      ["exterior", 960, 734, "1mQoDd1SrEglbOiWCm7tRj7Ii6CPkqw8A"],
      ["exterior", 960, 734, "1HyiIxCzkW2Ej9nZvHBqEVIqo7EFFtA5r"],
      ["exterior", 960, 734, "1w3QnLQQ8w1NyYtnb16wm5QSdUcc6AvXA"],
      ["exterior", 960, 734, "1y13IqJHOTPKf1xt1rqO53X94l5iIm8T8"],
      ["exterior", 960, 734, "1ZAqybgSh2kOpF7UGHAcLyvNq25o_s_pg"],
    ],
  ),
};

export function orderedServiceHeroImages(
  images: readonly ServiceHeroImage[],
): ServiceHeroImage[] {
  // Keep the customer journey consistent on every equipment page: show the
  // usable interior and its equipment details first, then exterior views, and
  // leave floor plans until last. The original order is retained within each
  // group so the approved Drive sequence is still deterministic.
  const viewPriority: Record<ServiceHeroImageView, number> = {
    interior: 0,
    detail: 1,
    exterior: 2,
    plan: 3,
  };

  return [...images].sort(
    (a, b) =>
      viewPriority[a.view] - viewPriority[b.view] || a.sortOrder - b.sortOrder,
  );
}

export function imagesForServicePath(
  path: string,
): readonly ServiceHeroImage[] | undefined {
  const images = serviceHeroImages[path];
  return images?.length ? orderedServiceHeroImages(images) : undefined;
}
