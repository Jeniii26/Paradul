/**
 * paradu'l — Sample Seed Data for Local Prototype
 *
 * NOTE:
 * This dataset provides initial demonstration data for the local prototype phase.
 * It contains realistic fashion items across Top, Bottom, and Shoes categories,
 * pre-assembled outfits, calendar schedule entries, and confirmed wear history records.
 */

// Elegant fashion item SVG illustrations with transparent backgrounds
function createSvgDataUrl(svgString) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

const whiteShirtSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- White Oversized Cotton Tee -->
  <path d="M 65 35 L 85 45 C 95 48 105 48 115 45 L 135 35 L 175 68 L 152 96 L 136 82 L 136 172 L 64 172 L 64 82 L 48 96 L 25 68 Z" 
        fill="#fdfdfd" stroke="#e0e0e6" stroke-width="2.5" filter="url(#shadow)" stroke-linejoin="round"/>
  <!-- Collar line -->
  <path d="M 85 45 C 92 56 108 56 115 45" fill="none" stroke="#d5d5dc" stroke-width="2"/>
  <!-- Pocket detail -->
  <rect x="74" y="75" width="20" height="24" rx="2" fill="none" stroke="#e4e4eb" stroke-width="1.5"/>
</svg>`);

const blackShirtSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-dark" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Black Turtleneck Knit -->
  <path d="M 72 26 L 128 26 L 128 44 L 140 40 L 178 72 L 158 98 L 138 84 L 138 174 L 62 174 L 62 84 L 42 98 L 22 72 L 60 40 L 72 44 Z" 
        fill="#1e1e24" stroke="#121216" stroke-width="2.5" filter="url(#shadow-dark)" stroke-linejoin="round"/>
  <!-- Turtleneck ribbing lines -->
  <path d="M 75 34 L 125 34 M 75 42 L 125 42" fill="none" stroke="#2e2e38" stroke-width="1.5"/>
</svg>`);

const blueShirtSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-blue" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
  </defs>
  <!-- Oxford Blue Button-Down Shirt -->
  <path d="M 70 36 L 86 44 C 95 47 105 47 114 44 L 130 36 L 176 68 L 156 94 L 136 82 L 136 172 L 64 172 L 64 82 L 44 94 L 24 68 Z" 
        fill="#3b82f6" stroke="#2563eb" stroke-width="2.5" filter="url(#shadow-blue)" stroke-linejoin="round"/>
  <!-- Collar -->
  <polygon points="70,36 86,52 100,48 86,44" fill="#60a5fa" stroke="#1d4ed8" stroke-width="1.5"/>
  <polygon points="130,36 114,52 100,48 114,44" fill="#60a5fa" stroke="#1d4ed8" stroke-width="1.5"/>
  <!-- Placket button line -->
  <line x1="100" y1="48" x2="100" y2="172" stroke="#1d4ed8" stroke-width="2"/>
  <circle cx="100" cy="70" r="2.5" fill="#eff6ff"/>
  <circle cx="100" cy="98" r="2.5" fill="#eff6ff"/>
  <circle cx="100" cy="126" r="2.5" fill="#eff6ff"/>
  <circle cx="100" cy="154" r="2.5" fill="#eff6ff"/>
</svg>`);

const beigeTopSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-beige" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Beige Linen Camp Collar Shirt -->
  <path d="M 68 38 L 86 48 C 95 50 105 50 114 48 L 132 38 L 174 68 L 152 96 L 134 84 L 134 170 L 66 170 L 66 84 L 48 96 L 26 68 Z" 
        fill="#e6dfd3" stroke="#cfc5b4" stroke-width="2.5" filter="url(#shadow-beige)" stroke-linejoin="round"/>
  <polygon points="68,38 88,58 100,50 86,48" fill="#d8cfbe" stroke="#b8ad9a" stroke-width="1.5"/>
  <polygon points="132,38 112,58 100,50 114,48" fill="#d8cfbe" stroke="#b8ad9a" stroke-width="1.5"/>
  <line x1="100" y1="50" x2="100" y2="170" stroke="#b8ad9a" stroke-width="1.5" stroke-dasharray="6,4"/>
</svg>`);

const blueJeansSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-pants" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Vintage Blue Denim Jeans -->
  <path d="M 62 25 L 138 25 L 144 85 L 134 182 L 104 182 L 100 85 L 96 182 L 66 182 L 56 85 Z" 
        fill="#2b528a" stroke="#1d3860" stroke-width="2.5" filter="url(#shadow-pants)" stroke-linejoin="round"/>
  <!-- Waistband & belt loops -->
  <line x1="60" y1="36" x2="140" y2="36" stroke="#e0a96d" stroke-width="1.5"/>
  <!-- Fly stitch -->
  <path d="M 100 36 L 100 68 C 100 74 105 78 112 78" fill="none" stroke="#e0a96d" stroke-width="1.5"/>
  <!-- Pockets -->
  <path d="M 64 42 C 78 44 82 56 82 56" fill="none" stroke="#e0a96d" stroke-width="1.5"/>
  <path d="M 136 42 C 122 44 118 56 118 56" fill="none" stroke="#e0a96d" stroke-width="1.5"/>
</svg>`);

const blackPantsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-dark-pants" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Tailored Black Trousers -->
  <path d="M 64 24 L 136 24 L 140 82 L 132 184 L 106 184 L 100 78 L 94 184 L 68 184 L 60 82 Z" 
        fill="#1a1a20" stroke="#0f0f14" stroke-width="2.5" filter="url(#shadow-dark-pants)" stroke-linejoin="round"/>
  <!-- Front crease lines -->
  <line x1="82" y1="50" x2="82" y2="182" stroke="#2a2a35" stroke-width="1.5"/>
  <line x1="118" y1="50" x2="118" y2="182" stroke="#2a2a35" stroke-width="1.5"/>
</svg>`);

const beigePantsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-beige-pants" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Wide-Leg Beige Chinos -->
  <path d="M 60 25 L 140 25 L 146 80 L 140 182 L 106 182 L 100 80 L 94 182 L 60 182 L 54 80 Z" 
        fill="#dfd5c4" stroke="#c4b8a3" stroke-width="2.5" filter="url(#shadow-beige-pants)" stroke-linejoin="round"/>
  <!-- Waistband -->
  <line x1="58" y1="36" x2="142" y2="36" stroke="#b3a58e" stroke-width="1.5"/>
  <!-- Pleats -->
  <line x1="78" y1="36" x2="78" y2="70" stroke="#b3a58e" stroke-width="1.5"/>
  <line x1="122" y1="36" x2="122" y2="70" stroke="#b3a58e" stroke-width="1.5"/>
</svg>`);

const whiteSneakersSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-shoes" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Minimalist White Leather Sneakers -->
  <g filter="url(#shadow-shoes)">
    <!-- Sole -->
    <path d="M 22 142 C 50 144 140 144 176 138 C 182 137 184 148 180 152 C 140 158 50 158 20 152 C 16 148 18 142 22 142 Z" 
          fill="#ebebf0" stroke="#d5d5de" stroke-width="2"/>
    <!-- Shoe Upper -->
    <path d="M 28 142 C 28 126 44 116 68 116 C 88 116 102 96 126 96 C 144 96 166 112 176 138 Z" 
          fill="#fafafa" stroke="#e0e0e6" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Laces detail -->
    <line x1="94" y1="108" x2="108" y2="114" stroke="#c0c0cc" stroke-width="2"/>
    <line x1="104" y1="116" x2="118" y2="122" stroke="#c0c0cc" stroke-width="2"/>
    <line x1="114" y1="124" x2="128" y2="130" stroke="#c0c0cc" stroke-width="2"/>
  </g>
</svg>`);

const blackSneakersSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-dark-shoes" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
  </defs>
  <!-- Classic Black Streetwear Sneakers -->
  <g filter="url(#shadow-dark-shoes)">
    <path d="M 22 142 C 50 144 140 144 176 138 C 182 137 184 148 180 152 C 140 158 50 158 20 152 C 16 148 18 142 22 142 Z" 
          fill="#ffffff" stroke="#e0e0e0" stroke-width="2"/>
    <path d="M 28 142 C 28 126 44 116 68 116 C 88 116 102 94 126 94 C 144 94 166 112 176 138 Z" 
          fill="#1c1c22" stroke="#101014" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Contrast stripe -->
    <path d="M 60 134 Q 100 120 148 136" fill="none" stroke="#f4f4f5" stroke-width="3"/>
  </g>
</svg>`);

const brownShoesSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <filter id="shadow-brown-shoes" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
  </defs>
  <!-- Brown Leather Penny Loafers -->
  <g filter="url(#shadow-brown-shoes)">
    <!-- Heel and sole -->
    <path d="M 24 144 L 56 144 L 56 154 L 24 154 Z" fill="#3a1c0d" stroke="#251107" stroke-width="1.5"/>
    <path d="M 24 144 C 60 144 136 144 176 138 C 182 137 184 147 178 150 C 138 154 60 154 24 150 Z" 
          fill="#4a2612" stroke="#2c1508" stroke-width="2"/>
    <!-- Loafer body -->
    <path d="M 26 144 C 26 128 42 118 64 118 C 84 118 106 106 134 106 C 158 106 172 120 176 138 Z" 
          fill="#78350f" stroke="#522409" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Saddle strap and cutout -->
    <path d="M 96 112 L 126 112 L 122 136 L 92 136 Z" fill="#92400e" stroke="#522409" stroke-width="1.5"/>
    <ellipse cx="108" cy="124" rx="7" ry="2.5" fill="#451a03"/>
  </g>
</svg>`);

/**
 * Initial clothing inventory satisfying all prompt requirements:
 * - 4 Tops: White shirt, Black shirt, Blue shirt, Beige top
 * - 3 Bottoms: Blue jeans, Black pants, Beige pants
 * - 3 Shoes: White sneakers, Black sneakers, Brown shoes
 * - Varied colors, styles, prices in Philippine Pesos (₱), and laundry states
 */
export const SAMPLE_CLOTHING = [
  {
    id: 'item-top-1',
    name: 'White Oversized Cotton Tee',
    imageUrl: whiteShirtSvg,
    originalImageUrl: whiteShirtSvg,
    category: 'top',
    color: 'White',
    price: 799,
    style: 'Casual',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-10T08:00:00.000Z',
    updatedAt: '2026-09-10T08:00:00.000Z',
  },
  {
    id: 'item-top-2',
    name: 'Classic Black Turtleneck Knit',
    imageUrl: blackShirtSvg,
    originalImageUrl: blackShirtSvg,
    category: 'top',
    color: 'Black',
    price: 1250,
    style: 'Minimalist',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-11T09:00:00.000Z',
    updatedAt: '2026-09-11T09:00:00.000Z',
  },
  {
    id: 'item-top-3',
    name: 'Oxford Striped Blue Shirt',
    imageUrl: blueShirtSvg,
    originalImageUrl: blueShirtSvg,
    category: 'top',
    color: 'Blue',
    price: 1499,
    style: 'Smart Casual',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'item-top-4',
    name: 'Beige Linen Camp Collar Shirt',
    imageUrl: beigeTopSvg,
    originalImageUrl: beigeTopSvg,
    category: 'top',
    color: 'Beige',
    price: 899,
    style: 'Casual',
    laundryStatus: 'in_laundry',
    laundryUntil: '2026-10-02',
    createdAt: '2026-09-13T11:00:00.000Z',
    updatedAt: '2026-09-25T14:00:00.000Z',
  },
  {
    id: 'item-bot-1',
    name: 'Vintage Wash Blue Denim Jeans',
    imageUrl: blueJeansSvg,
    originalImageUrl: blueJeansSvg,
    category: 'bottom',
    color: 'Blue',
    price: 1899,
    style: 'Casual',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-10T08:30:00.000Z',
    updatedAt: '2026-09-10T08:30:00.000Z',
  },
  {
    id: 'item-bot-2',
    name: 'Tailored Slim Black Trousers',
    imageUrl: blackPantsSvg,
    originalImageUrl: blackPantsSvg,
    category: 'bottom',
    color: 'Black',
    price: 1650,
    style: 'Formal',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-11T09:30:00.000Z',
    updatedAt: '2026-09-11T09:30:00.000Z',
  },
  {
    id: 'item-bot-3',
    name: 'Wide-Leg Beige Pleated Chinos',
    imageUrl: beigePantsSvg,
    originalImageUrl: beigePantsSvg,
    category: 'bottom',
    color: 'Beige',
    price: 1350,
    style: 'Minimalist',
    laundryStatus: 'in_laundry',
    laundryUntil: '2026-10-02',
    createdAt: '2026-09-12T10:30:00.000Z',
    updatedAt: '2026-09-25T14:00:00.000Z',
  },
  {
    id: 'item-sho-1',
    name: 'Minimalist White Leather Sneakers',
    imageUrl: whiteSneakersSvg,
    originalImageUrl: whiteSneakersSvg,
    category: 'shoes',
    color: 'White',
    price: 2499,
    style: 'Casual',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T09:00:00.000Z',
  },
  {
    id: 'item-sho-2',
    name: 'Classic Black Streetwear Sneakers',
    imageUrl: blackSneakersSvg,
    originalImageUrl: blackSneakersSvg,
    category: 'shoes',
    color: 'Black',
    price: 3200,
    style: 'Streetwear',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-11T10:00:00.000Z',
    updatedAt: '2026-09-11T10:00:00.000Z',
  },
  {
    id: 'item-sho-3',
    name: 'Brown Leather Penny Loafers',
    imageUrl: brownShoesSvg,
    originalImageUrl: brownShoesSvg,
    category: 'shoes',
    color: 'Brown',
    price: 2850,
    style: 'Smart Casual',
    laundryStatus: 'available',
    laundryUntil: null,
    createdAt: '2026-09-12T11:00:00.000Z',
    updatedAt: '2026-09-12T11:00:00.000Z',
  },
];

/**
 * Initial outfits composed of EXACTLY 1 top, 1 bottom, and 1 shoes
 */
export const SAMPLE_OUTFITS = [
  {
    id: 'outfit-1',
    name: 'Minimalist Smart Casual',
    topId: 'item-top-1',
    bottomId: 'item-bot-2',
    shoesId: 'item-sho-1',
    style: 'Smart Casual',
    colorTheme: 'Monochrome & White',
    notes: 'Clean look for client meetings or studio work days.',
    createdAt: '2026-09-14T10:00:00.000Z',
    updatedAt: '2026-09-14T10:00:00.000Z',
  },
  {
    id: 'outfit-2',
    name: 'Monochrome Evening',
    topId: 'item-top-2',
    bottomId: 'item-bot-2',
    shoesId: 'item-sho-2',
    style: 'Formal',
    colorTheme: 'All Black',
    notes: 'Sharp evening dinner silhouette with turtleneck warmth.',
    createdAt: '2026-09-15T11:00:00.000Z',
    updatedAt: '2026-09-15T11:00:00.000Z',
  },
  {
    id: 'outfit-3',
    name: 'Weekend Coffee Run',
    topId: 'item-top-3',
    bottomId: 'item-bot-1',
    shoesId: 'item-sho-3',
    style: 'Casual',
    colorTheme: 'Blue & Earthy Brown',
    notes: 'Relaxed button-down with vintage wash denim.',
    createdAt: '2026-09-16T12:00:00.000Z',
    updatedAt: '2026-09-16T12:00:00.000Z',
  },
];

/**
 * Sample calendar schedule events showing both 'scheduled' (future)
 * and 'worn' (completed) states.
 */
export const SAMPLE_SCHEDULES = [
  {
    id: 'sched-1',
    outfitId: 'outfit-1',
    date: '2026-09-18',
    occasion: 'Design Critique',
    notes: 'Worn to project presentation.',
    status: 'worn',
    createdAt: '2026-09-17T09:00:00.000Z',
    updatedAt: '2026-09-18T18:00:00.000Z',
  },
  {
    id: 'sched-2',
    outfitId: 'outfit-1',
    date: '2026-09-21',
    occasion: 'Office Day',
    notes: 'Repeated favourite comfortable combo.',
    status: 'worn',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-21T19:00:00.000Z',
  },
  {
    id: 'sched-3',
    outfitId: 'outfit-2',
    date: '2026-09-23',
    occasion: 'Gallery Opening',
    notes: 'Sophisticated dark aesthetic.',
    status: 'worn',
    createdAt: '2026-09-22T14:00:00.000Z',
    updatedAt: '2026-09-23T22:00:00.000Z',
  },
  {
    id: 'sched-4',
    outfitId: 'outfit-3',
    date: '2026-09-25',
    occasion: 'Brunch with Friends',
    notes: 'Comfortable denim.',
    status: 'worn',
    createdAt: '2026-09-24T16:00:00.000Z',
    updatedAt: '2026-09-25T15:00:00.000Z',
  },
  {
    id: 'sched-5',
    outfitId: 'outfit-1',
    date: '2026-09-28',
    occasion: 'Sprint Planning',
    notes: 'Planned for Monday morning kick-off.',
    status: 'scheduled',
    createdAt: '2026-09-26T11:00:00.000Z',
    updatedAt: '2026-09-26T11:00:00.000Z',
  },
];

/**
 * Historical wear records corresponding to confirmed worn events.
 * Analytics strictly use these confirmed records.
 */
export const SAMPLE_WEAR_RECORDS = [
  { id: 'wear-1', outfitId: 'outfit-1', wornDate: '2026-09-18' },
  { id: 'wear-2', outfitId: 'outfit-1', wornDate: '2026-09-21' },
  { id: 'wear-3', outfitId: 'outfit-2', wornDate: '2026-09-23' },
  { id: 'wear-4', outfitId: 'outfit-3', wornDate: '2026-09-25' },
];
