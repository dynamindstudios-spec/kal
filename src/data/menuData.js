export const TABLE_SECURITY_CODES = {
  1: "B1k8X",
  2: "A9m2P",
  3: "K7v4Q",
  4: "X3r9L",
  5: "J5n1W",
  6: "Z8t3E",
  7: "H2y6M",
  8: "C4p8V",
  9: "F6s3N",
  10: "R1w9T",
  11: "G5k7D",
  12: "L3x2B",
  13: "V8m4Y",
  14: "P9q1H",
  15: "T2z6S"
};

export const RESTAURANT_DATA = {
  name: "KAL DISCOBAR",
  logo: "/logo.png",
  slogan: {
    es: "Armenia, Quindío — Rumba VIP, Licores & Cócteles de Autor",
    en: "Armenia, Quindío — VIP Nightlife, Liquors & Cocktails"
  },
  description: {
    es: "La experiencia nocturna más exclusiva del Quindío. Disfruta de la mejor carta digital de licores, coctelería y shows en vivo.",
    en: "Quindío's most exclusive nightlife experience with digital liquor menu and live shows."
  },
  contact: {
    address: "Zona Rosa / Sector Discotecas",
    city: "Armenia, Quindío",
    phone: "3135248660"
  }
};

export const BUILD_YOUR_OWN_DATA = {
  bottles: [
    { id: "b1", name: { es: "Aguardiente Antioqueño (Tapa Roja / Azul / Verde)" }, priceCOP: 110000, desc: "750ml — Tradicional o Sin Azúcar", image: "/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_750ml_Botella.png" },
    { id: "b2", name: { es: "Aguardiente Amarillo de Manzanares" }, priceCOP: 120000, desc: "750ml — Receta Artesanal Cítrica", image: "/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png" },
    { id: "b3", name: { es: "Ron Viejo de Caldas 3 Años" }, priceCOP: 125000, desc: "750ml — Añejado en Roble Blanco", image: "/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_750ml_Botella.png" },
    { id: "b4", name: { es: "Whisky Old Parr 12 Años" }, priceCOP: 220000, desc: "750ml — Blended Scotch Clásico", image: "/licores_sin_fondo/Whisky_Old_Parr_12_Anos_750ml_Botella.png" },
    { id: "b5", name: { es: "Whisky Buchanan's 12 Años" }, priceCOP: 240000, desc: "750ml — Miel, Manzana y Roble", image: "/licores_sin_fondo/Whisky_Buchanans_12_Anos_750ml_Botella.png" },
    { id: "b6", name: { es: "Tequila Don Julio Reposado" }, priceCOP: 320000, desc: "750ml — 100% Agave Azul de Jalisco", image: "/licores_sin_fondo/Tequila_Don_Julio_Reposado_750ml.png" }
  ],
  mixers: [
    { id: "m1", name: { es: "4 Red Bull Energy Drink (250ml)" }, priceCOP: 48000, desc: "Energizante frío en lata" },
    { id: "m2", name: { es: "4 Sodas / Tónicas Canada Dry" }, priceCOP: 28000, desc: "Refrescos burbujeantes" },
    { id: "m3", name: { es: "4 Gatorade Electrolitos (500ml)" }, priceCOP: 28000, desc: "Hidratante de frutas" },
    { id: "m4", name: { es: "Jarra de Zumo de Naranja Natural (1L)" }, priceCOP: 22000, desc: "Jugo natural recién exprimido" }
  ],
  snacks: [
    { id: "s1", name: { es: "2 Paquetes de Chocolates Ferrero / M&M's" }, priceCOP: 20000, desc: "Dulce importado para la rumba" },
    { id: "s2", name: { es: "Balde de Pasabocas Mixtos Salados" }, priceCOP: 18000, desc: "Maní salado, papas y snacks" },
    { id: "s3", name: { es: "Paquete de Chicles Trident + Halls" }, priceCOP: 8000, desc: "Frescura mentolada instantánea" }
  ],
  extras: [
    { id: "e1", name: { es: "Balde con Hielo de Roca Infinito" }, priceCOP: 10000, desc: "Cubos de hielo cristalino" },
    { id: "e2", name: { es: "Servicio de Escarchado Sal y Limón" }, priceCOP: 8000, desc: "Gajos de limón y sal marina" },
    { id: "e3", name: { es: "Copas / Vasos de Cristal VIP Extra" }, priceCOP: 12000, desc: "Cristalería fina para la mesa" }
  ]
};

export const LANGUAGES = {
  es: { code: 'es', name: 'Español', flag: '🇨🇴' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  it: { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  pt: { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' }
};

export const CURRENCIES = {
  COP: { symbol: "$", rate: 1.0, label: "COP ($)", code: "COP", flag: "🇨🇴" },
  USD: { symbol: "$", rate: 0.00025, label: "USD ($)", code: "USD", flag: "🇺🇸" },
  EUR: { symbol: "€", rate: 0.00023, label: "EUR (€)", code: "EUR", flag: "🇪🇺" },
  MXN: { symbol: "$", rate: 0.0046, label: "MXN ($)", code: "MXN", flag: "🇲🇽" },
  GBP: { symbol: "£", rate: 0.00019, label: "GBP (£)", code: "GBP", flag: "🇬🇧" },
  BRL: { symbol: "R$", rate: 0.0014, label: "BRL (R$)", code: "BRL", flag: "🇧🇷" },
  ARS: { symbol: "$", rate: 0.28, label: "ARS ($)", code: "ARS", flag: "🇦🇷" },
  CLP: { symbol: "$", rate: 0.24, label: "CLP ($)", code: "CLP", flag: "🇨🇱" },
  CAD: { symbol: "$", rate: 0.00034, label: "CAD ($)", code: "CAD", flag: "🇨🇦" },
  CHF: { symbol: "CHF", rate: 0.00022, label: "CHF (Fr)", code: "CHF", flag: "🇨🇭" }
};

export const UI_TEXT = {
  es: {
    welcome: "Bienvenido a KAL DISCOBAR",
    subtitle: "Armenia, Quindío — Menú Digital VIP & Rumba nocturna",
    searchPlaceholder: "Buscar licor, cóctel o marca...",
    filterDietaryTitle: "Intensidad de Alcohol",
    filterAllergensTitle: "Perfil de Sabor (Dulce, Amargo, Seco)",
    cartTitle: "Tu Canasta de Rumba",
    yourOrder: "Tu Canasta de Rumba",
    cartEmpty: "No has añadido licores ni productos aún",
    emptyCart: "Tu canasta de rumba está vacía",
    checkoutBtn: "Confirmar Pedido por WhatsApp",
    checkout: "Confirmar Pedido por WhatsApp",
    subtotal: "Subtotal",
    total: "Total Estimado",
    totalPrice: "Total a Pagar",
    settingsTitle: "Configuración VIP & Estilo",
    cardsMode: "Tarjetas Modernas",
    cardsModeDesc: "Vista visual con efectos 3D y detalles VIP",
    compactMode: "Modo Compacto",
    compactModeDesc: "Cuadrícula ágil optimizada para celular",
    basicMode: "Lista Básica VIP",
    basicModeDesc: "Diseño minimalista rápido y elegante",
    viewModeTitle: "Modo de Vista de la Carta",
    allDishes: "Carta VIP Completa",
    mainsDrinks: "Licores & Cervezas",
    beverages: "Cócteles & Mezcladores",
    desserts: "Snacks & Confitería",
    customCreations: "Kits VIP Personalizados",
    deliveryType: "Modalidad de Pedido",
    atTable: "Servicio a la Mesa",
    counter: "Retirar en Barra",
    atBar: "Retirar en Barra",
    pickupTimeTitle: "¿Cuándo pasas por la barra?",
    asap: "⚡ Inmediato (5-10 min)",
    in30: "⏱️ En 15-20 min",
    in45: "⏳ En 30 min",
    in60: "🕒 En 45+ min",
    fullName: "Nombre completo o apodo",
    notesPlaceholder: "Instrucciones o notas especiales...",
    orderNum: "Orden #",
    orderTaken: "¡Pedido Confirmado para Mesa!",
    orderRegistered: "¡Pedido Registrado en Barra!",
    successTableMsg: "Tu orden ha sido enviada al personal para la Mesa",
    successPickupMsg: "Tus bebidas estarán listas en {min} minutos en la barra",
    thankYou: "¡Gracias por disfrutar en KAL DISCOBAR Armenia!",
    tableService: "Servicio a la Mesa",
    codeAccepted: "¡Clave de Mesa Correcta!",
    tableValidated: "Validada y lista para recibir el pedido",
    selectTable: "Selecciona tu Mesa",
    tableCodePlaceholder: "Clave de 5 caracteres",
    wrongCode: "Código de Mesa Incorrecto",
    wrongCodeDesc: "El código ingresado no coincide con la Mesa",
    checkKeysFile: "Revisa el hablador o tarjeta en tu mesa.",
    validateTable: "Validar Clave de Mesa"
  },
  en: {
    welcome: "Welcome to KAL DISCOBAR",
    subtitle: "Armenia, Quindío — Digital VIP Menu & Nightlife",
    searchPlaceholder: "Search liquor, cocktail or brand...",
    filterDietaryTitle: "Alcohol Strength",
    filterAllergensTitle: "Flavor Profile (Sweet, Bitter, Dry)",
    cartTitle: "Your Party Cart",
    yourOrder: "Your Party Cart",
    cartEmpty: "You haven't added drinks yet",
    emptyCart: "Your party cart is empty",
    checkoutBtn: "Confirm Order via WhatsApp",
    checkout: "Confirm Order via WhatsApp",
    subtotal: "Subtotal",
    total: "Estimated Total",
    totalPrice: "Total to Pay",
    settingsTitle: "VIP Settings & Theme",
    cardsMode: "Modern Cards",
    cardsModeDesc: "Visual 3D card layout with VIP info",
    compactMode: "Compact Grid",
    compactModeDesc: "Fast grid optimized for mobile",
    basicMode: "Basic VIP List",
    basicModeDesc: "Minimalist layout with fast view",
    viewModeTitle: "Menu View Mode",
    allDishes: "Full VIP Menu",
    mainsDrinks: "Liquors & Beers",
    beverages: "Cocktails & Mixers",
    desserts: "Snacks & Munchies",
    customCreations: "Custom VIP Kits",
    deliveryType: "Order Fulfillment Mode",
    atTable: "Table Service",
    counter: "Pick Up at Bar",
    atBar: "Pick Up at Bar",
    pickupTimeTitle: "When will you pick up at the bar?",
    asap: "⚡ Immediate (5-10 min)",
    in30: "⏱️ In 15-20 min",
    in45: "⏳ In 30 min",
    in60: "🕒 In 45+ min",
    fullName: "Full name or nickname",
    notesPlaceholder: "Special instructions or notes...",
    orderNum: "Order #",
    orderTaken: "Order Confirmed for Table!",
    orderRegistered: "Order Registered at Bar!",
    successTableMsg: "Your order is being prepared for Table",
    successPickupMsg: "Your drinks will be ready in {min} minutes at the bar",
    thankYou: "Thanks for partying with KAL DISCOBAR Armenia!",
    tableService: "Table Service",
    codeAccepted: "Table Code Verified!",
    tableValidated: "Validated and ready to receive your order",
    selectTable: "Select Your Table",
    tableCodePlaceholder: "5-character table code",
    wrongCode: "Incorrect Table Code",
    wrongCodeDesc: "The code entered does not match Table",
    checkKeysFile: "Check the stand or card on your table.",
    validateTable: "Validate Table Code"
  }
};

export const MENU_CATEGORIES = [
  { id: "all", name: { es: "Carta VIP Completa", en: "Full VIP Menu" } },
  { id: "licores", name: { es: "Licores & Botellas", en: "Liquors & Bottles" } },
  { id: "cervezas", name: { es: "Cervezas & Frías", en: "Beers & Ice Cold" } },
  { id: "cocteles", name: { es: "Cócteles Clásicos & Autor", en: "Cocktails & Signature" } },
  { id: "mezcladores", name: { es: "Bebidas & Mezcladores", en: "Mixers & Drinks" } },
  { id: "snacks", name: { es: "Confitería & Snacks", en: "Snacks & Munchies" } },
  { id: "build-your-own", name: { es: "Arma tu Balde / Kit VIP", en: "Build Your VIP Bucket" } }
];

export const ALCOHOL_INTENSITY_FILTERS = [
  { id: "sin-alcohol", icon: "🥤", label: { es: "Sin Alcohol (0%)", en: "Non-Alcoholic" } },
  { id: "suave", icon: "🍺", label: { es: "Suave / Cerveza", en: "Smooth / Beer" } },
  { id: "medio", icon: "🍸", label: { es: "Medio / Cócteles", en: "Medium / Cocktails" } },
  { id: "fuerte", icon: "🥃", label: { es: "Fuerte / Licor (30%+)", en: "Strong / Spirits" } },
  { id: "premium", icon: "👑", label: { es: "Edición VIP / Premium", en: "VIP Premium" } }
];

// Alcohol Taste Profile Filters (Dulce, Amargo, Seco)
export const DRINK_TASTE_FILTERS = [
  { id: "dulce", icon: "🍬", label: { es: "Dulce / Frutal", en: "Sweet / Fruity" } },
  { id: "amargo", icon: "🌿", label: { es: "Amargo / Herbal", en: "Bitter / Herbal" } },
  { id: "seco", icon: "🥃", label: { es: "Seco / Intenso", en: "Dry / Intense" } }
];
export const DRINK_STYLE_FILTERS = DRINK_TASTE_FILTERS;

export const DISHES = [
  // LICORES NACIONALES E INTERNACIONALES (Imágenes Transparentes PNG HD)
  {
    id: "aguardiente-antioqueno",
    category: "licores",
    name: { es: "Aguardiente Antioqueño (Tapa Roja / Azul / Verde)", en: "Aguardiente Antioqueño (Red, Blue, Green)" },
    description: { es: "Tradición paisa icónica. Tapa Roja tradicional, Tapa Azul sin azúcar y Tapa Verde con sabor suave.", en: "Classic Colombian anise liquor in Traditional Red, Sugar-free Blue, and Smooth Green caps." },
    priceCOP: 110000,
    tags: ["fuerte"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Aguardiente_Antioqueno_Tapa_Azul_750ml_Botella.png"
  },
  {
    id: "aguardiente-amarillo",
    category: "licores",
    name: { es: "Aguardiente Amarillo de Manzanares", en: "Yellow Aguardiente Manzanares" },
    description: { es: "El aguardiente del momento, aroma cítrico y suave trago artesanal con receta histórica de 1885.", en: "Trendsetting yellow anise spirit with smooth citrus herbal notes and historic recipe." },
    priceCOP: 120000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Aguardiente_Amarillo_Manzanares_750ml_Botella.png"
  },
  {
    id: "aguardiente-nectar",
    category: "licores",
    name: { es: "Aguardiente Néctar Tradicional Rojo", en: "Aguardiente Nectar Red" },
    description: { es: "Sabor clásico cundinamarqués, perfecto para brindar en grupo helado con sal y limón.", en: "Classic Colombian spirit, served ice cold with lime and salt." },
    priceCOP: 105000,
    tags: ["fuerte"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Aguardiente_Nectar_Rojo_750ml_Botella.png"
  },
  {
    id: "aguardiente-nectar-verde",
    category: "licores",
    name: { es: "Aguardiente Néctar Verde (Sin Azúcar)", en: "Aguardiente Nectar Green Sugar-Free" },
    description: { es: "Pureza destilada sin azúcar con aroma fresco a anís estrellado.", en: "Sugar-free Colombian anise liquor with smooth, balanced herbal notes." },
    priceCOP: 110000,
    tags: ["fuerte"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Aguardiente_Nectar_Verde_Sin_Azucar_750ml.png"
  },
  {
    id: "ron-caldas-3-anos",
    category: "licores",
    name: { es: "Ron Viejo de Caldas 3 Años (Tradicional)", en: "Ron Viejo de Caldas 3 Years" },
    description: { es: "Añejado en barriles de roble blanco a más de 2.200 metros de altura. Notas de vainilla y madera.", en: "Colombian rum aged in white oak barrels at high altitude with notes of caramel and oak." },
    priceCOP: 125000,
    tags: ["fuerte"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Viejo_de_Caldas_3_Anos_750ml_Botella.png"
  },
  {
    id: "ron-caldas-5-anos",
    category: "licores",
    name: { es: "Ron Viejo de Caldas 5 Años (Juan de la Cruz)", en: "Ron Viejo de Caldas 5 Years" },
    description: { es: "Maduración extendida con tonos ámbar profundo, notas de caramelo tostado y especias.", en: "5-year aged Colombian rum with deep amber color, toffee and toasted oak finish." },
    priceCOP: 145000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Viejo_de_Caldas_5_Anos_750ml_Botella.png"
  },
  {
    id: "ron-caldas-8-anos",
    category: "licores",
    name: { es: "Ron Viejo de Caldas 8 Años (Carta de Oro)", en: "Ron Viejo de Caldas 8 Years Carta de Oro" },
    description: { es: "Gran reserva con 8 años en roble colombiano. Textura sedosa y bouquet de frutos secos.", en: "Aged for 8 years in high-altitude Colombian oak for supreme silkiness." },
    priceCOP: 175000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Viejo_de_Caldas_8_Anos_750ml_Botella.png"
  },
  {
    id: "ron-caldas-leon-dormido",
    category: "licores",
    name: { es: "Ron Viejo de Caldas León Dormido (Reserva Especial)", en: "Ron Caldas León Dormido Special Reserve" },
    description: { es: "Edición especial ultra premium de la Licorera de Caldas. Sabor refinado para paladares exigentes.", en: "Ultra premium special reserve rum with deep complexity, cocoa and vanilla finish." },
    priceCOP: 280000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Viejo_de_Caldas_Leon_Dormido_750ml.png"
  },
  {
    id: "ron-medellin",
    category: "licores",
    name: { es: "Ron Medellín Añejo 3 Años", en: "Ron Medellin Aged Rum 3 Years" },
    description: { es: "Añejado naturalmente sin azúcares añadidos. Sabor intenso con carácter y dulzor ahumado.", en: "Naturally aged Colombian rum with dark amber hue, smooth oak and honey balance." },
    priceCOP: 115000,
    tags: ["fuerte"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Medellin_Anejo_3_Anos_750ml_Botella.png"
  },
  {
    id: "ron-zacapa",
    category: "licores",
    name: { es: "Ron Zacapa Centenario 23 Solera", en: "Zacapa Centenario 23 Rum" },
    description: { es: "Guatemalteco legendario añejado en las alturas por sistema Solera. Complejidad sublime.", en: "Ultra-premium Guatemalan rum aged above the clouds with notes of dried fruit and spiced oak." },
    priceCOP: 390000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Ron_Zacapa_Centenario_23_Solera_750ml.png"
  },
  {
    id: "whisky-old-parr-12",
    category: "licores",
    name: { es: "Whisky Old Parr 12 Años", en: "Old Parr 12 Years Whisky" },
    description: { es: "El whisky icónico de las parrandas. Mezcla escocesa madura, suave, especiada y elegante.", en: "Iconic blended Scotch whisky with a smooth, velvety malt and peat harmony." },
    priceCOP: 220000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Whisky_Old_Parr_12_Anos_750ml_Botella.png"
  },
  {
    id: "whisky-buchanans-12",
    category: "licores",
    name: { es: "Whisky Buchanan's De Luxe 12 Años", en: "Buchanan's 12 Years De Luxe" },
    description: { es: "Referente mundial de distinción. Notas de manzana verde, miel y naranja tostada.", en: "World renowned Scotch whisky offering subtle sweetness, fresh orange, and grain purity." },
    priceCOP: 240000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Whisky_Buchanans_12_Anos_750ml_Botella.png"
  },
  {
    id: "whisky-buchanans-master",
    category: "licores",
    name: { es: "Whisky Buchanan's Master", en: "Buchanan's Master Whisky" },
    description: { es: "Mezcla selecta creada por el Master Blender, final cremoso con notas herbáceas y cítricas.", en: "Exclusive blend with creamy sweet profile, orange zest and walnut finish." },
    priceCOP: 270000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Whisky_Buchanans_Master_750ml.png"
  },
  {
    id: "whisky-buchanans-18",
    category: "licores",
    name: { es: "Whisky Buchanan's Special Reserve 18 Años", en: "Buchanan's 18 Years Special Reserve" },
    description: { es: "Añejado durante 18 años en barricas de jerez. Riqueza de chocolate negro, ciruela y roble.", en: "18-year aged Scotch finished in sherry casks for luscious dark chocolate depth." },
    priceCOP: 390000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Whisky_Buchanans_18_Anos_750ml.png"
  },
  {
    id: "whisky-johnnie-black",
    category: "licores",
    name: { es: "Johnnie Walker Black Label 12 Años", en: "Johnnie Walker Black Label" },
    description: { es: "El escocés más galardonado. Notas ahumadas de turba, frutas del bosque y vainilla cremosa.", en: "The iconic 12-year blended Scotch offering rich smoke, sweet vanilla and dark fruit." },
    priceCOP: 230000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Johnnie_Walker_Black_Label_750ml_Botella.png"
  },
  {
    id: "whisky-johnnie-double-black",
    category: "licores",
    name: { es: "Johnnie Walker Double Black", en: "Johnnie Walker Double Black" },
    description: { es: "Intensidad y ahumado superior añejado en barricas de roble profundamente carbonizadas.", en: "Heavily peated and intensely smoky Scotch with brooding spice and dried fruits." },
    priceCOP: 260000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Johnnie_Walker_Double_Black_750ml_Botella.png"
  },
  {
    id: "whisky-johnnie-red",
    category: "licores",
    name: { es: "Johnnie Walker Red Label", en: "Johnnie Walker Red Label" },
    description: { es: "Vibrante, picante y fresco. El blend perfecto para mezclar con sodas o energizante.", en: "Dynamic and fiery Scotch whisky with crackling spices and crisp freshness." },
    priceCOP: 180000,
    tags: ["fuerte"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Johnnie_Walker_Red_Label_750ml_Botella.png"
  },
  {
    id: "whisky-jack-daniels",
    category: "licores",
    name: { es: "Jack Daniel's Old No. 7 Tennessee Whiskey", en: "Jack Daniel's Old No. 7" },
    description: { es: "Tennessee Whiskey filtrado gota a gota por 3 metros de carbón de arce dulce.", en: "Charcoal mellowed drop by drop for classic caramel and vanilla sweetness." },
    priceCOP: 210000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Jack_Daniels_Old_No_7_750ml_Botella.png"
  },
  {
    id: "whisky-jack-honey",
    category: "licores",
    name: { es: "Jack Daniel's Tennessee Honey", en: "Jack Daniel's Tennessee Honey" },
    description: { es: "Fusión irresistible de Jack Old No. 7 con licor de miel pura de abeja artesanal.", en: "Smooth blend of Tennessee Whiskey and natural honey liqueur." },
    priceCOP: 220000,
    tags: ["fuerte", "premium"],
    styles: ["dulce"],
    image: "/licores_sin_fondo/Jack_Daniels_Tennessee_Honey_750ml_Botella.png"
  },
  {
    id: "tequila-don-julio-reposado",
    category: "licores",
    name: { es: "Tequila Don Julio Reposado", en: "Don Julio Reposado Tequila" },
    description: { es: "100% Agave Azul añejado 8 meses en barricas de roble blanco americano.", en: "Golden amber 100% Blue Agave rested for 8 months with hints of dark chocolate and cinnamon." },
    priceCOP: 320000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Don_Julio_Reposado_750ml.png"
  },
  {
    id: "tequila-don-julio-blanco",
    category: "licores",
    name: { es: "Tequila Don Julio Blanco", en: "Don Julio Blanco Tequila" },
    description: { es: "El sabor más puro del agave azul recién destilado con notas cítricas de lima y toronja.", en: "Crisp, clean unaged tequila bursting with fresh agave and citrus brightness." },
    priceCOP: 290000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Don_Julio_Blanco_750ml.png"
  },
  {
    id: "tequila-don-julio-70",
    category: "licores",
    name: { es: "Tequila Don Julio 70 Añejo Cristalino", en: "Don Julio 70 Cristalino Tequila" },
    description: { es: "El primer añejo cristalino del mundo. Complejidad añejada con la frescura brillante del blanco.", en: "The world's first clear Anejo, filtered to restore crispness with deep vanilla notes." },
    priceCOP: 420000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Don_Julio_70_750ml.png"
  },
  {
    id: "tequila-don-julio-1942",
    category: "licores",
    name: { es: "Tequila Don Julio 1942 (Icono Ultra VIP)", en: "Don Julio 1942 Luxury Tequila" },
    description: { es: "La máxima expresión del tequila de lujo a nivel mundial. Añejado mínimo dos años y medio.", en: "Celebrated in exclusive clubs worldwide. Rich caramel, warm oak, and roasted agave finish." },
    priceCOP: 1200000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Don_Julio_1942_750ml.png"
  },
  {
    id: "tequila-patron-silver",
    category: "licores",
    name: { es: "Tequila Patrón Silver", en: "Patron Silver Tequila" },
    description: { es: "Elaborado artesanalmente en pequeñas tandas de cobre. Agave puro, suave y cristalino.", en: "Ultra-premium handmade silver tequila with crystal clear aroma of fruits and citrus." },
    priceCOP: 310000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Patron_Silver_750ml.png"
  },
  {
    id: "tequila-patron-reposado",
    category: "licores",
    name: { es: "Tequila Patrón Reposado", en: "Patron Reposado Tequila" },
    description: { es: "Añejado en barricas de roble durante al menos dos meses para un toque suave de madera y miel.", en: "Rested in oak barrels for over two months, delivering a balance of fresh agave and oak." },
    priceCOP: 330000,
    tags: ["fuerte", "premium"],
    styles: ["seco"],
    image: "/licores_sin_fondo/Tequila_Patron_Reposado_750ml.png"
  },
  {
    id: "vodka-absolut",
    category: "licores",
    name: { es: "Vodka Absolut Original (Suecia)", en: "Absolut Vodka Original" },
    description: { es: "Destilado exclusivamente con trigo de invierno del sur de Suecia y agua de pozo profundo.", en: "Swedish pure winter wheat vodka crafted with continuous distillation." },
    priceCOP: 180000,
    tags: ["fuerte", "premium"],
    styles: ["amargo"],
    image: "/licores_sin_fondo/Vodka_Absolut_Original_750ml_Botella.png"
  },
  {
    id: "vodka-smirnoff",
    category: "licores",
    name: { es: "Vodka Smirnoff Red No. 21", en: "Smirnoff Red No. 21 Vodka" },
    description: { es: "Triple destilado y filtrado 10 veces a través de carbón vegetal para una pureza inigualable.", en: "Triple distilled and 10 times charcoal filtered for supreme smoothness." },
    priceCOP: 160000,
    tags: ["fuerte"],
    styles: ["amargo"],
    image: "/licores_sin_fondo/Vodka_Smirnoff_Red_No_21_750ml_Botella.png"
  },
  {
    id: "ginebra-tanqueray",
    category: "licores",
    name: { es: "Ginebra Tanqueray London Dry", en: "Tanqueray London Dry Gin" },
    description: { es: "Destilación clásica de 4 botánicos selectos: enebro toscano, cilantro, angélica y regaliz.", en: "London Dry Gin crafted with 4 timeless botanicals for quintessential G&T cocktails." },
    priceCOP: 210000,
    tags: ["fuerte", "premium"],
    styles: ["amargo"],
    image: "/licores_sin_fondo/Ginebra_Tanqueray_London_Dry_750ml.png"
  },
  {
    id: "ginebra-hendricks",
    category: "licores",
    name: { es: "Ginebra Hendrick's (Escocia)", en: "Hendrick's Gin" },
    description: { es: "Infusionada de manera inusual con esencia de pepino fresco y delicados pétalos de rosa damascena.", en: "Iconic Scottish gin infused with Bulgarian Rosa Damascena and crisp cucumber." },
    priceCOP: 260000,
    tags: ["fuerte", "premium"],
    styles: ["amargo"],
    image: "/licores_sin_fondo/Ginebra_Hendricks_750ml.png"
  },

  // CERVEZAS & FRÍAS
  {
    id: "cerveza-club-colombia",
    category: "cervezas",
    name: { es: "Club Colombia (Dorada / Roja / Negra)", en: "Club Colombia (Gold, Red, Black)" },
    description: { es: "La cerveza de maestría cervecera colombiana. Malta fina, cuerpo equilibrado y amargor elegante.", en: "Colombia's premium lager in Golden Pilsner, Amber Red, and Dark Porter varieties." },
    priceCOP: 12000,
    tags: ["suave"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cerveza-corona",
    category: "cervezas",
    name: { es: "Corona Extra (con Limón)", en: "Corona Extra (with Lime)" },
    description: { es: "La clásica cerveza mexicana serveza helada con su característico gajo de limón fresco.", en: "Iconic Mexican pale lager served ice cold with a slice of fresh lime." },
    priceCOP: 14000,
    tags: ["suave"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cerveza-heineken",
    category: "cervezas",
    name: { es: "Heineken Premium Beer", en: "Heineken Premium Beer" },
    description: { es: "Lager holandesa de fermentación pura con levadura A-Yeast y notas refrescantes.", en: "World renowned Dutch pale lager brewed with 100% natural ingredients." },
    priceCOP: 14000,
    tags: ["suave"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cerveza-stella-artois",
    category: "cervezas",
    name: { es: "Stella Artois (Bélgica)", en: "Stella Artois Belgian Lager" },
    description: { es: "Tradición cervecera belga desde 1366. Sabor limpio, aroma a lúpulo Saaz y final suave.", en: "Classic European pilsner lager with crisp bitterness and floral hop finish." },
    priceCOP: 15000,
    tags: ["suave"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cerveza-aguila",
    category: "cervezas",
    name: { es: "Águila Original / Águila Light", en: "Aguila Original / Light" },
    description: { es: "La cerveza que une a Colombia. Refrescante, ligera y bien fría para la rumba.", en: "Traditional Colombian refreshing lager, perfect for party celebrations." },
    priceCOP: 10000,
    tags: ["suave"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1571658734974-6014e4c2741d?auto=format&fit=crop&w=800&q=80"
  },

  // CÓCTELLES CLÁSICOS & AUTOR
  {
    id: "coctel-veneno-cobra",
    category: "cocteles",
    name: { es: "Veneno de Cobra (Signature Kal)", en: "Cobra Poison (Kal Signature)" },
    description: { es: "Cóctel insignia de Kal Discobar. Tequila Don Julio, licor de mora exótica, zumo de maracuyá y toque de ají neón ahumado.", en: "Exotic Kal signature cocktail blending tequila, passionfruit, blackberry liquor, and smoked chili glow." },
    priceCOP: 38000,
    tags: ["medio", "premium"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-margarita",
    category: "cocteles",
    name: { es: "Margarita (Clásica / Fresa / Maracuyá)", en: "Margarita (Classic, Strawberry, Passionfruit)" },
    description: { es: "Tequila reposado, Triple Sec y zumo de lima recién exprimido en copa escarchada con sal marina.", en: "Hand-shaken Tequila cocktail served in salt-rimmed glass with fresh fruit flavor choices." },
    priceCOP: 32000,
    tags: ["medio"],
    styles: ["seco"],
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-mojito",
    category: "cocteles",
    name: { es: "Mojito Cubano Místico", en: "Mystic Cuban Mojito" },
    description: { es: "Ron blanco, menta fresca macerada, azúcar morena, zumo de limón y soda con hielo frappé.", en: "Classic rum refresher with muddled mint leaves, lime juice, cane sugar, and sparkling soda." },
    priceCOP: 30000,
    tags: ["medio"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-gin-tonic",
    category: "cocteles",
    name: { es: "Gin & Tonic Botánico", en: "Botanical Gin & Tonic" },
    description: { es: "Ginebra Tanqueray o Hendrick's con agua tónica premium, rodaja de pepino fresco y bayas de enebro.", en: "Craft botanical gin with premium tonic water, cucumber ribbon, and juniper berries." },
    priceCOP: 35000,
    tags: ["medio", "premium"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-tequila-sunrise",
    category: "cocteles",
    name: { es: "Tequila Sunrise Neón", en: "Neon Tequila Sunrise" },
    description: { es: "Tequila reposado, zumo de naranja natural y jarabe de granadina formando capas de sol naciente.", en: "Vibrant layered cocktail of Tequila, fresh orange juice, and sweet grenadine drop." },
    priceCOP: 30000,
    tags: ["medio"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-negroni",
    category: "cocteles",
    name: { es: "Negroni Especial", en: "Special Negroni" },
    description: { es: "Ginebra Tanqueray, Campari amargo italiano y Vermouth tinto dulce en vaso corto con piel de naranja ahumada.", en: "Equal parts Gin, Campari, and Sweet Vermouth served over crystal ice with orange twist." },
    priceCOP: 36000,
    tags: ["fuerte", "premium"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coctel-pina-colada",
    category: "cocteles",
    name: { es: "Piña Colada Caribeña", en: "Caribbean Piña Colada" },
    description: { es: "Ron blanco añejo, crema de coco natural y jugo de piña tropical en copa alta cremosa.", en: "Creamy blend of aged white rum, coconut cream, and sweet tropical pineapple juice." },
    priceCOP: 32000,
    tags: ["suave"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
  },

  // MEZCLADORES & SIN ALCOHOL
  {
    id: "mezclador-red-bull",
    category: "mezcladores",
    name: { es: "Red Bull Energy Drink (Regular / Sugarfree)", en: "Red Bull Energy Drink" },
    description: { es: "Energizante oficial para mantener la rumba activa toda la noche. Servido bien frío.", en: "Vitalizes body and mind during late night party sessions." },
    priceCOP: 16000,
    tags: ["sin-alcohol"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mezclador-soda-tonica",
    category: "mezcladores",
    name: { es: "Agua Tónica Canada Dry / Hatsu Tea", en: "Tonic Water / Hatsu Tea" },
    description: { es: "El mezclador perfecto para ginebra y vodka, o té frío Hatsu de frutas exóticas.", en: "Crisp tonic mixers or refreshing bottled iced tea infusions." },
    priceCOP: 9000,
    tags: ["sin-alcohol"],
    styles: ["amargo"],
    image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mezclador-gatorade",
    category: "mezcladores",
    name: { es: "Gatorade / Hidratante Electrolítico", en: "Gatorade Electrolytes" },
    description: { es: "Hidratante deportivo ideal para la noche de baile intenso.", en: "Electrolyte rehydration beverage to keep energy high." },
    priceCOP: 9000,
    tags: ["sin-alcohol"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80"
  },

  // CONFITERÍA & SNACKS
  {
    id: "snack-chocolates",
    category: "snacks",
    name: { es: "Chocolates Premium (Ferrero / M&M's / Hershey's)", en: "Premium Chocolates" },
    description: { es: "Variedad de chocolates importados para endulzar el trago en la mesa.", en: "Assorted fine chocolates and crunchy peanut candies." },
    priceCOP: 12000,
    tags: ["sin-alcohol"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "snack-pasabocas",
    category: "snacks",
    name: { es: "Mix de Pasabocas Salados (Maní Crack / Papas Margarita)", en: "Salty Snack Mix" },
    description: { es: "Maní con sal, papas crocantes y pasabocas mixtos ideal para compartir.", en: "Crunchy salted peanuts and potato chips party bowl." },
    priceCOP: 10000,
    tags: ["sin-alcohol"],
    styles: ["seco"],
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "snack-vapes-cigarrillos",
    category: "snacks",
    name: { es: "Vapes Desechables 5000 Puffs / Cigarrillos Marlboro", en: "Vape Disposable & Smokes" },
    description: { es: "Vapes con sabores frutales neón de 5000 vapeadas o cajetilla de cigarrillos.", en: "Neon fruity disposable vapes or classic cigarette packs." },
    priceCOP: 55000,
    tags: ["sin-alcohol"],
    styles: ["seco"],
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "snack-chicles-halls",
    category: "snacks",
    name: { es: "Chicles Trident / Pastillas Halls Mentol", en: "Trident Gum / Halls Mints" },
    description: { es: "Frescura mentolada instantánea en paquete.", en: "Instant minty breath refreshers for party hours." },
    priceCOP: 5000,
    tags: ["sin-alcohol"],
    styles: ["dulce"],
    image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80"
  }
];
