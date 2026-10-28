export type ScentCategory = "woody" | "floral" | "spicy" | "fresh";

export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductOffer {
  label: string;
  active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  notes: ScentNotes;
  price: number;
  costPrice?: number;
  category: ScentCategory;
  legend: string;
  accent: string;
  images: ProductImage[];
  offer?: ProductOffer;
  stock: number;
  tags?: string[];
  originalPrice?: number;
  discountPercent?: number;
  variants?: { id: string; name: string; price: number; stock: number }[];
}

const flame = (accent: string) => ({
  id: "flame",
  url: `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='1' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%238FB3A0'/%3E%3Cstop offset='100%25' stop-color='%23B85C38'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M 100 160 L 100 100 Q 115 70 100 40 Q 85 70 100 100 L 100 160' fill='none' stroke='${accent}' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M 86 122 Q 100 94 114 122' fill='none' stroke='${accent}' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`,
  alt: "Аромат",
});

export const products: Product[] = [
  {
    id: "lunar-jade",
    name: "Лунный нефрид",
    description: "Прохладный зелёный чай и бамбук, обнятые белым мускусом.",
    fullDescription:
      "Луна отразилась в нефритовой чаше — и так родился этот прохладный, почти тихий аромат. Зелёный чай открывает композицию свежестью утренней росы, бамбук придаёт легкость, а белый мускус обволакивает кожу нежным шлейфом. Идеальна для медитации в полночь и моментов одиночества под луной.",
    notes: {
      top: ["зелёный чай"],
      middle: ["бамбук"],
      base: ["белый мускус"],
    },
    price: 4200,
    category: "fresh",
    legend:
      "Луна отразилась в нефритовой чаше — и так родился этот прохладный, почти тихий аромат. Для медитации в полночь.",
    accent: "#556B2F",
    images: [flame("#556B2F")],
    stock: 12,
    offer: { label: "Новинка", active: true },
  },
  {
    id: "phoenix-dance",
    name: "Танец феникса",
    description: "Красный апельсин, шафран и дымное дерево в одном'éclat.",
    fullDescription:
      "Феникс взмыл из пепла, оставив за собой шлейф апельсиновой корки и шафрана. Красный апельсин дарит искристый верх, шафран добавляет золотистой пряности, а дымное дерево закрепляет аромат тёплым, дымным base. Аромат возрождения и огня, для тех, кто готов начать заново.",
    notes: {
      top: ["красный апельсин"],
      middle: ["шафран"],
      base: ["дымное дерево"],
    },
    price: 4800,
    category: "spicy",
    legend:
      "Феникс взмыл из пепла, оставив за собой шлейф апельсиновой корки и шафрана. Аромат возрождения и огня.",
    accent: "#C41E3A",
    images: [flame("#C41E3A")],
    stock: 8,
    offer: { label: "Хит сезона", active: true },
  },
  {
    id: "pagoda-silence",
    name: "Тишина пагоды",
    description: "Сандал, ладан, кедр и щепотка перца — рассвет в старом храме.",
    fullDescription:
      "Старый храм на горном перевале. Утренний ладан, тёплый сандал и тишина, которую можно потрогать. Сандал и кедр образуют древесную основу, ладан добавляет 얻어注意的是 Spiritual ноты, а щепотка перца бодрит как первый рассвет.",
    notes: {
      top: ["щепотка перца"],
      middle: ["ладан"],
      base: ["сандал", "кедр"],
    },
    price: 4600,
    category: "woody",
    legend:
      "Старый храм на горном перевале. Утренний ладан, тёплый сандал и тишина, которую можно потрогать.",
    accent: "#B89B5E",
    images: [flame("#B89B5E")],
    stock: 15,
  },
  {
    id: "silk-wind",
    name: "Шёлковый ветер",
    description: "Жасмин, ирис и лёгкая пудра, как шёлк между пальцами.",
    fullDescription:
      "Проводник перетянул шёлковую ленту между бамбуковыми рощами — и ветер принёс запах цветущего жасмина. Ирис добавляет пудровой нежности, а лёгкая пудра завершает композицию мягким аккордом. Аромат для легкости и грации.",
    notes: {
      top: ["жасмин"],
      middle: ["ирис", "лёгкая пудра"],
      base: [],
    },
    price: 4400,
    category: "floral",
    legend:
      "Проводник перетянул шёлковую ленту между бамбуковыми рощами — и ветер принёс запах цветущего жасмина.",
    accent: "#2E5C8A",
    images: [flame("#2E5C8A")],
    stock: 10,
    offer: { label: "Новинка", active: false },
  },
  {
    id: "burned-scroll",
    name: "Опалённая рукопись",
    description: "Кожа, табак, амбра и дым — тёмная мистическая атмосфера.",
    fullDescription:
      "Рукопись, оставленная под луной. Запах старой кожи, табачного листа и тлеющей амбра. Дым застывает на страницах, как воспоминания о забытых ритуалах. Аромат для тёмной, мистической атмосферы в духе древних храмов и запечатанных свитков.",
    notes: {
      top: ["дым"],
      middle: ["табак"],
      base: ["кожа", "амбра"],
    },
    price: 5100,
    category: "woody",
    legend:
      "Рукопись, оставленная под луной. Запах старой кожи, табачного листа и тлеющей амбра.",
    accent: "#556B2F",
    images: [flame("#556B2F")],
    stock: 6,
  },
  {
    id: "lotus-dew",
    name: "Роса на лотосе",
    description: "Лотос, зелёный чай, водяная лилия и белый мускус. Свежий и медитативный.",
    fullDescription:
      "Ранним утром лотос открывает лепестки, а роса блестит как мелкие жемчужины на поверхности пруда. Лотос и водяная лилия создают цветочное сердце, зелёный чай добавляет свежести, а белый мускус обволакивает чистым шлейфом. Медитативный и очищающий.",
    notes: {
      top: ["водяная лилия"],
      middle: ["лотос", "зелёный чай"],
      base: ["белый мускус"],
    },
    price: 4300,
    category: "fresh",
    legend:
      "Ранним утром лотос открывает лепестки, а роса блестит как мелкие жемчужины на поверхности пруда.",
    accent: "#2E5C8A",
    images: [flame("#2E5C8A")],
    stock: 14,
  },
  {
    id: "red-thread",
    name: "Красная нить",
    description: "Роза, уд, пачули и красный перец — символ связи и судьбы.",
    fullDescription:
      "Красная нить судьбы соединяет сердца ещё до первой встречи. Роза открывает композицию цветочным аккордом, уд и пачули добавляют глубины и восточной таинственности, а красный перец зажигает страстью. Аромат привязанности и судьбы.",
    notes: {
      top: ["красный перец"],
      middle: ["роза"],
      base: ["уд", "пачули"],
    },
    price: 4900,
    category: "spicy",
    legend:
      "Красная нить судьбы соединяет сердца ещё до первой встречи. Аромат привязанности и страсти.",
    accent: "#C41E3A",
    images: [flame("#C41E3A")],
    stock: 9,
    offer: { label: "Хит сезона", active: false },
  },
  {
    id: "heavenly-peach",
    name: "Небесный персик",
    description: "Персик, османтус, ваниль и сандал. Тёплый и уютный.",
    fullDescription:
      "Персиковый сад на небесах. Спелый персик дарит фруктовую сладость, османтус добавляет абрикосовой нежности, ваниль обволакивает теплом, а сандал grounding-нотой завершает композицию. Уютный, как вечер в саду под луной.",
    notes: {
      top: ["персик"],
      middle: ["османтус"],
      base: ["ваниль", "сандал"],
    },
    price: 4500,
    category: "floral",
    legend:
      "Персиковый сад на небесах. Османтус, ваниль и сандал — сладость без суеты.",
    accent: "#B89B5E",
    images: [flame("#B89B5E")],
    stock: 11,
  },
];

export const categories: { id: ScentCategory; label: string }[] = [
  { id: "fresh", label: "Свежие" },
  { id: "floral", label: "Цветочные" },
  { id: "woody", label: "Древесные" },
  { id: "spicy", label: "Пряные" },
];

export interface PromoCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  label: string;
  expiresAt?: string;
}

export const promoCodes: PromoCode[] = [
  {
    code: "PODNEBESNAYA10",
    type: "percent",
    value: 10,
    maxUses: 100,
    usedCount: 0,
    active: true,
    label: "Скидка 10% на первый заказ",
  },
  {
    code: "FIREANDMIST",
    type: "fixed",
    value: 500,
    maxUses: 50,
    usedCount: 0,
    active: true,
    label: "−500 ₽ к заказу от 4000 ₽",
  },
  {
    code: "SILKWIND",
    type: "percent",
    value: 15,
    maxUses: 30,
    usedCount: 0,
    active: true,
    label: "Скидка 15% на цветочные ароматы",
  },
];
