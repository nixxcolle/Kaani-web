export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation: string;
  fun_fact?: string;
  image_url: string | null;
}

export interface LearningModule {
  id: string;
  title: string;
  category: "Fisheries & Marine" | "Sustainable Crops" | "Agri-Tech" | "Policy & Law";
  description: string;
  readTimeMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objectives: string[];
  contentSections: {
    heading: string;
    body: string;
    keyTakeaway?: string;
  }[];
  file_name: string;
  file_data: string | null;
}

export interface LeaderboardRecord {
  user_id: string;
  user_name: string;
  total_xp: number;
  best_score: number;
  quiz_count: number;
  avatar_seed?: string;
  badge?: string;
  rank?: number;
}

// Comprehensive Bank of Curated Agriculture & Fisheries Questions
export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    category: "Aquaculture & Marine Life",
    difficulty: "Easy",
    question: "What is the primary ecological benefit of cultivating mangrove forests along coastal aquaculture zones?",
    choice_a: "They increase water salinity to toxic levels",
    choice_b: "They serve as critical marine fish nurseries and natural storm surge barriers",
    choice_c: "They eliminate the need for any water circulation in fish ponds",
    choice_d: "They attract commercial deep-sea trawlers to nearshore waters",
    correct_answer: "B",
    explanation: "Mangroves provide vital breeding, nursery, and feeding grounds for up to 75% of commercial tropical fish species, while acting as physical barriers that attenuate storm surge waves by up to 66%.",
    fun_fact: "A single hectare of healthy mangrove forest can produce over 1,000 kg of marine life harvest annually.",
    image_url: null,
  },
  {
    id: "q-2",
    category: "Sustainable Agriculture",
    difficulty: "Easy",
    question: "Which of the following organic soil amendments replenishes vital nitrogen while boosting microbial diversity?",
    choice_a: "Untreated plastic mulch",
    choice_b: "Vermicompost (worm castings) and legume cover crops",
    choice_c: "Concentrated synthetic sulfuric acid",
    choice_d: "Unleached high-salinity seawater",
    correct_answer: "B",
    explanation: "Vermicompost is rich in beneficial microbes, humic acids, and bioavailable nitrogen, phosphorus, and potassium, while nitrogen-fixing legumes draw atmospheric nitrogen into root nodules.",
    fun_fact: "Earthworms can process their own body weight in organic waste every 24 hours!",
    image_url: null,
  },
  {
    id: "q-3",
    category: "Agri & Fisheries Laws",
    difficulty: "Medium",
    question: "Under the Philippine Fisheries Code of 1998 (RA 8550 as amended by RA 10654), municipal waters generally extend up to how many kilometers from the coastline?",
    choice_a: "5 kilometers",
    choice_b: "10 kilometers",
    choice_c: "15 kilometers",
    choice_d: "25 kilometers",
    correct_answer: "C",
    explanation: "Under RA 8550/10654, municipal waters include marine waters up to 15 kilometers (approx. 8.1 nautical miles) from the coastline, reserved primarily for small-scale municipal fisherfolk.",
    fun_fact: "Delineating municipal waters protects artisanal fishers from large commercial vessels encroaching on sensitive breeding bays.",
    image_url: null,
  },
  {
    id: "q-4",
    category: "Agri-Tech & Innovations",
    difficulty: "Medium",
    question: "What is the main operating principle of a closed Recirculating Aquaculture System (RAS)?",
    choice_a: "Constantly discharging dirty water directly into open rivers",
    choice_b: "Filtering, oxygenating, and recycling 90-99% of culture water in a closed loop",
    choice_c: "Feeding fish exclusively on synthetic microplastics",
    choice_d: "Relying purely on unpredictable monsoon floodwaters",
    correct_answer: "B",
    explanation: "RAS uses mechanical and biological filtration (nitrification via biofilters) to remove solids and toxic ammonia, recycling virtually all water while maintaining sterile, optimal growing conditions.",
    fun_fact: "RAS facilities can produce up to 50 times more fish biomass per square meter compared to conventional earthen ponds.",
    image_url: null,
  },
  {
    id: "q-5",
    category: "Sustainable Agriculture",
    difficulty: "Medium",
    question: "Why is drip irrigation significantly more water-efficient than traditional flood furrow irrigation?",
    choice_a: "It delivers low-pressure water directly to the plant root zone, minimizing evaporation",
    choice_b: "It floods the entire field with standing water for weeks",
    choice_c: "It only operates during heavy downpours",
    choice_d: "It forces plants to grow without any moisture",
    correct_answer: "A",
    explanation: "Drip irrigation achieves 90-95% water application efficiency by applying slow drips directly to crop roots, virtually eliminating surface runoff and deep percolation losses.",
    fun_fact: "Switching from flood to drip irrigation can reduce farm water consumption by up to 60% while increasing crop yield by 20-90%.",
    image_url: null,
  },
  {
    id: "q-6",
    category: "Agri & Fisheries Laws",
    difficulty: "Hard",
    question: "What does the Environmental Compliance Certificate (ECC) issued by DENR-EMB signify for an agribusiness or aquaculture project?",
    choice_a: "A certificate granting exemption from all Philippine labor standards",
    choice_b: "Official recognition that the project has planned mitigation measures for environmental impacts",
    choice_c: "Automatic ownership of any public foreshore land",
    choice_d: "A guarantee that the farm will never experience pest infestations",
    correct_answer: "B",
    explanation: "An ECC certifies that the proponent has complied with the requirements of the Environmental Impact Statement (EIS) System and committed to mitigating adverse environmental hazards.",
    fun_fact: "Operating an environmentally critical venture without an ECC in the Philippines can incur cease-and-desist orders and substantial daily fines.",
    image_url: null,
  },
  {
    id: "q-7",
    category: "Aquaculture & Marine Life",
    difficulty: "Medium",
    question: "What destructive fishing practice is strictly prohibited worldwide and in the Philippines due to its total destruction of coral reefs?",
    choice_a: "Handline fishing (Kawil)",
    choice_b: "Blast (dynamite) fishing and cyanide poisoning",
    choice_c: "Crab pots with biodegradable escape rings",
    choice_d: "Hook and line bottom fishing",
    correct_answer: "B",
    explanation: "Blast and chemical fishing shatter coral skeletons that take decades or centuries to rebuild, killing non-target juvenile fish and permanently degrading marine ecosystems.",
    fun_fact: "It can take over 50 years for a blasted coral reef to recover even a fraction of its former biodiversity.",
    image_url: null,
  },
  {
    id: "q-8",
    category: "Agri-Tech & Innovations",
    difficulty: "Easy",
    question: "In hydroponic and aquaponic farming, what serves as the nutrient delivery medium instead of traditional soil?",
    choice_a: "Dry crushed cement",
    choice_b: "Oxygenated water enriched with dissolved organic mineral nutrients or fish effluents",
    choice_c: "Pure petroleum jelly",
    choice_d: "Unprocessed saltwater brine",
    correct_answer: "B",
    explanation: "Hydroponics uses mineral water solutions, while aquaponics combines aquaculture with hydroponics: beneficial bacteria convert fish waste (ammonia) into nitrates that feed the crops.",
    fun_fact: "Aquaponics consumes up to 90% less water than traditional soil farming because water is continuously recirculated.",
    image_url: null,
  },
  {
    id: "q-9",
    category: "Sustainable Agriculture",
    difficulty: "Hard",
    question: "What is Integrated Pest Management (IPM)?",
    choice_a: "Spraying chemical pesticides on a rigid daily schedule regardless of pest presence",
    choice_b: "An ecosystem-based strategy combining biological controls, crop rotation, and targeted interventions",
    choice_c: "Introducing invasive species without quarantine evaluation",
    choice_d: "Burning fields after every single weekly harvest",
    correct_answer: "B",
    explanation: "IPM emphasizes natural predators, pest-resistant crop varieties, cultural sanitation, and economic injury thresholds, reserving chemical sprays only as an educated last resort.",
    fun_fact: "IPM dramatically protects pollinator populations like bees, which are responsible for 1 out of every 3 bites of food we eat.",
    image_url: null,
  },
  {
    id: "q-10",
    category: "Aquaculture & Marine Life",
    difficulty: "Hard",
    question: "What critical water parameter must be constantly monitored in Tilapia and Milkfish (Bangus) pond culture at dawn?",
    choice_a: "Water color temperature in Kelvin",
    choice_b: "Dissolved Oxygen (DO) levels, which drop lowest right before sunrise",
    choice_c: "Atmospheric lunar gravitational pull",
    choice_d: "Presence of decorative floating blossoms",
    correct_answer: "B",
    explanation: "At night, both fish and pond phytoplankton consume dissolved oxygen through respiration without photosynthesis occurring. DO drops to its lowest critical levels right before dawn.",
    fun_fact: "Maintaining DO above 4.0 mg/L prevents fish stress, boosts feed conversion efficiency, and prevents sudden catastrophic mass fish mortality.",
    image_url: null,
  },
  {
    id: "q-11",
    category: "Agri & Fisheries Laws",
    difficulty: "Easy",
    question: "Which government agency in the Philippines is primarily responsible for the development, conservation, and regulation of fisheries and aquatic resources?",
    choice_a: "BFAR (Bureau of Fisheries and Aquatic Resources)",
    choice_b: "DPWH (Department of Public Works and Highways)",
    choice_c: "DICT (Department of Information and Communications Technology)",
    choice_d: "BIR (Bureau of Internal Revenue)",
    correct_answer: "A",
    explanation: "BFAR, an attached agency under the Department of Agriculture, oversees national fisheries policies, aquaculture development, fishing vessel licensing, and coastal resource conservation.",
    fun_fact: "BFAR operates monitoring, control, and surveillance (MCS) vessels to protect Philippine seas from illegal, unreported, and unregulated (IUU) fishing.",
    image_url: null,
  },
  {
    id: "q-12",
    category: "Agri-Tech & Innovations",
    difficulty: "Medium",
    question: "How do agricultural drones help farmers practice precision farming?",
    choice_a: "By playing music to crops to speed up cell division",
    choice_b: "By utilizing multispectral sensors (NDVI) to detect crop stress, nitrogen deficiency, and targeted spraying",
    choice_c: "By replacing the need for sunlight during photosynthesis",
    choice_d: "By harvesting underground root crops automatically",
    correct_answer: "B",
    explanation: "Multispectral drone imaging measures normalized difference vegetation index (NDVI), detecting pest spots, nutrient stress, or moisture shortages days before they are visible to the naked human eye.",
    fun_fact: "Drone targeted spraying can cut pesticide and fertilizer usage by 30-50% by treating only affected crop zones.",
    image_url: null,
  }
];

// Rich Curated Learning Modules
export const DEFAULT_LEARNING_MODULES: LearningModule[] = [
  {
    id: "mod-1",
    title: "Sustainable Aquaculture & RAS Systems",
    category: "Fisheries & Marine",
    description: "Master modern eco-friendly fish farming, water filtration techniques, and closed-loop recirculating systems.",
    readTimeMinutes: 8,
    difficulty: "Beginner",
    objectives: [
      "Understand the mechanics of mechanical and bio-filtration",
      "Learn water quality monitoring: DO, pH, Ammonia, and Nitrite",
      "Adopt best practices to minimize effluent pollution in coastal waters"
    ],
    contentSections: [
      {
        heading: "1. The Aquaculture Revolution",
        body: "With global wild-catch fisheries reaching biological ceilings, sustainable aquaculture now supplies more than 50% of the world's seafood. However, traditional pond culture often faces challenges with water discharge and disease transmission. Modern methods prioritize biosecure, resource-efficient setups.",
        keyTakeaway: "Recirculating Aquaculture Systems (RAS) recycle over 90% of culture water, drastically reducing environmental footprint."
      },
      {
        heading: "2. The Biofilter & Nitrogen Cycle",
        body: "Fish excrete ammonia through their gills and waste. In a closed system, beneficial nitrifying bacteria (Nitrosomonas and Nitrobacter) convert toxic ammonia into nitrite, and then into harmless nitrate, creating clean, oxygen-rich environments for stock.",
        keyTakeaway: "A healthy biofilter requires continuous aeration, steady temperature, and a balanced carbon-to-nitrogen ratio."
      },
      {
        heading: "3. Practical Pond Management in the Tropics",
        body: "For pond farmers growing Milkfish (Bangus) or Tilapia, regular paddlewheel aeration before dawn prevents oxygen crashes. Implementing mangrove buffers around coastal ponds also absorbs excess nutrients and stabilizes dikes against monsoon storms."
      }
    ],
    file_name: "Sustainable_Aquaculture_Guide.pdf",
    file_data: null
  },
  {
    id: "mod-2",
    title: "Organic Soil Regeneration & Vermicomposting",
    category: "Sustainable Crops",
    description: "Transform crop residues and animal manures into rich organic compost to restore degraded agricultural soil.",
    readTimeMinutes: 10,
    difficulty: "Beginner",
    objectives: [
      "Identify the difference between chemical fertilization and soil biology",
      "Build and maintain a high-yield African Nightcrawler vermicompost bed",
      "Formulate organic foliar fertilizers and bio-pesticides"
    ],
    contentSections: [
      {
        heading: "1. Understanding Living Soil",
        body: "Healthy soil is not inert dirt; it is a thriving ecosystem composed of mycorrhizal fungi, bacteria, protozoa, and earthworms. Decades of heavy synthetic chemical use deplete organic matter, leading to soil compaction and acidic pH levels.",
        keyTakeaway: "Increasing soil organic matter by just 1% enables an acre of farmland to hold an extra 20,000 gallons of water."
      },
      {
        heading: "2. Setting Up a Vermicompost Bed",
        body: "African Nightcrawlers (Eudrilus eugeniae) are ideal for tropical conditions. Layer decomposed banana pseudostems, dried cow manure, and carbon-rich rice straw. Keep moisture at 60-70% in a shaded shed protected from direct sun and heavy rainfall.",
        keyTakeaway: "Harvest worm castings every 30 to 45 days. The castings contain 5x more available nitrogen and 7x more potash than typical topsoil."
      }
    ],
    file_name: "Soil_Regeneration_Handbook.pdf",
    file_data: null
  },
  {
    id: "mod-3",
    title: "Philippine Fisheries Code & Coastal Resource Rights",
    category: "Policy & Law",
    description: "Navigate RA 8550 as amended by RA 10654, municipal waters regulations, licensing, and conservation policies.",
    readTimeMinutes: 12,
    difficulty: "Intermediate",
    objectives: [
      "Understand municipal water boundaries (15 km) and exclusive fisherfolk rights",
      "Know the statutory penalties for blast, cyanide, and fine-mesh net fishing",
      "Learn the legal steps for registering municipal fishing vessels (under 3 GT)"
    ],
    contentSections: [
      {
        heading: "1. Core Mandates of RA 8550 & RA 10654",
        body: "The Philippine Fisheries Code was enacted to achieve food security while limiting resource exploitation to sustainable maximum yields. It empowers coastal local government units (LGUs) to manage municipal waters collaboratively with FARMCs (Fisheries and Aquatic Resources Management Councils).",
        keyTakeaway: "Municipal waters belong exclusively to municipal fisherfolk, prioritizing local artisanal livelihoods."
      },
      {
        heading: "2. Prohibited Acts and Stiff Penalties",
        body: "Amendments under RA 10654 significantly increased administrative fines and criminal liabilities for commercial intrusion into municipal waters, blast fishing, and fishing during seasonal closed periods. Preserving breeding grounds ensures multi-generational harvests."
      }
    ],
    file_name: "Fisheries_Law_Compliance_Brief.pdf",
    file_data: null
  },
  {
    id: "mod-4",
    title: "Solar-Powered Precision Drip Irrigation",
    category: "Agri-Tech",
    description: "Design low-cost, off-grid solar pumping systems that optimize water usage and slash diesel generator costs.",
    readTimeMinutes: 7,
    difficulty: "Intermediate",
    objectives: [
      "Size solar PV panels and DC submersible water pumps for farm scale",
      "Calculate emitter flow rates and crop water requirements (evapotranspiration)",
      "Set up automatic timer valves and inline disc filtration"
    ],
    contentSections: [
      {
        heading: "1. Why Off-Grid Solar Pumping Makes Economic Sense",
        body: "Rural farmers often spend up to 40% of their operational budget on diesel fuel to run water pumps. Solar photovoltaic pumping replaces recurring fuel expenses with clean, zero-emission energy paid off within 18-24 months of installation.",
        keyTakeaway: "Combining solar power with drip irrigation avoids battery degradation by pumping directly into elevated storage tanks during daylight."
      }
    ],
    file_name: "Solar_Drip_Irrigation_Blueprints.pdf",
    file_data: null
  }
];

// Seed Community Leaderboard with realistic scores
export const DEFAULT_LEADERBOARD: LeaderboardRecord[] = [
  {
    user_id: "user-top-1",
    user_name: "Maria Santos (Agri-Scholar)",
    total_xp: 980,
    best_score: 100,
    quiz_count: 10,
    badge: "Master Harvester",
    rank: 1
  },
  {
    user_id: "user-top-2",
    user_name: "Mang Juan Dela Cruz",
    total_xp: 850,
    best_score: 95,
    quiz_count: 9,
    badge: "Coastal Guardian",
    rank: 2
  },
  {
    user_id: "user-top-3",
    user_name: "Elena Ramos (SSU Fisheries)",
    total_xp: 740,
    best_score: 90,
    quiz_count: 8,
    badge: "Eco-Innovator",
    rank: 3
  },
  {
    user_id: "user-top-4",
    user_name: "Captain Ricardo Tan",
    total_xp: 620,
    best_score: 85,
    quiz_count: 7,
    badge: "Aquaculture Scout",
    rank: 4
  },
  {
    user_id: "user-top-5",
    user_name: "Aira Mae Gomez",
    total_xp: 510,
    best_score: 80,
    quiz_count: 6,
    badge: "Green Sprout",
    rank: 5
  }
];

// Helper functions for local state persistence
export const LOCAL_STORAGE_KEYS = {
  SCORES: "kaani_quiz_scores",
  QUESTIONS: "kaani_custom_questions",
  USER: "user",
  AUTH: "isAuthenticated",
  LEADERBOARD: "kaani_local_leaderboard"
};

export function getLocalLeaderboard(): LeaderboardRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.LEADERBOARD);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LEADERBOARD, JSON.stringify(DEFAULT_LEADERBOARD));
      return DEFAULT_LEADERBOARD;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LEADERBOARD;
  }
}

export function saveScoreToLocalLeaderboard(userName: string, scorePercent: number, totalQuestions: number): LeaderboardRecord[] {
  const current = getLocalLeaderboard();
  const xpEarned = Math.round(scorePercent * (totalQuestions / 10) * 10);
  
  const existingIndex = current.findIndex(e => e.user_name.toLowerCase() === userName.toLowerCase());
  
  if (existingIndex >= 0) {
    current[existingIndex].total_xp += xpEarned;
    current[existingIndex].best_score = Math.max(current[existingIndex].best_score, scorePercent);
    current[existingIndex].quiz_count += 1;
  } else {
    current.push({
      user_id: "user-" + Date.now(),
      user_name: userName,
      total_xp: xpEarned,
      best_score: scorePercent,
      quiz_count: 1,
      badge: scorePercent >= 90 ? "Master Harvester" : scorePercent >= 70 ? "Eco-Innovator" : "Green Sprout",
    });
  }

  // Sort descending by total XP
  current.sort((a, b) => b.total_xp - a.total_xp);
  
  // Reassign ranks
  const ranked = current.map((item, idx) => ({ ...item, rank: idx + 1 }));
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LEADERBOARD, JSON.stringify(ranked));
  } catch (err) {
    console.warn("Failed saving leaderboard to localStorage", err);
  }

  return ranked;
}
