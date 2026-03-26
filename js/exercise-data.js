// Exercise Data - Mapping exercises from Self Rehabilitation Booklet to page images
// Each exercise has keywords (in English & Indonesian) for AI recommendation matching

const EXERCISE_DATABASE = [
    // === UPPER LIMB - ARM: Stretching Exercises ===
    {
        id: 'arm-placed-front',
        name: 'Arm Placed in Front',
        nameId: 'Lengan Ditempatkan di Depan',
        category: 'upper_limb',
        type: 'stretching',
        page: 11,
        image: 'assets/exercises/page-11.png',
        keywords: ['arm placed in front', 'lengan depan', 'stretching lengan', 'peregangan lengan', 'elbow forearm stretch', 'siku', 'forearm']
    },
    {
        id: 'arm-placed-side',
        name: 'Arm Placed on Its Side',
        nameId: 'Lengan Ditempatkan di Samping',
        category: 'upper_limb',
        type: 'stretching',
        page: 12,
        image: 'assets/exercises/page-12.png',
        keywords: ['arm placed side', 'lengan samping', 'stretching samping', 'peregangan samping', 'shoulder stretch']
    },
    {
        id: 'lifting-arms',
        name: 'Lifting the Arms',
        nameId: 'Mengangkat Lengan',
        category: 'upper_limb',
        type: 'stretching',
        page: 13,
        image: 'assets/exercises/page-13.png',
        keywords: ['lifting arms', 'angkat lengan', 'mengangkat lengan', 'arm raise', 'raise arm', 'angkat tangan']
    },
    {
        id: 'extending-elbow-1',
        name: 'Extending the Elbow /1',
        nameId: 'Meluruskan Siku /1',
        category: 'upper_limb',
        type: 'stretching',
        page: 14,
        image: 'assets/exercises/page-14.png',
        keywords: ['extending elbow', 'meluruskan siku', 'ekstensi siku', 'elbow extension', 'elbow stretch', 'peregangan siku']
    },
    {
        id: 'extending-elbow-2',
        name: 'Extending the Elbow /2',
        nameId: 'Meluruskan Siku /2',
        category: 'upper_limb',
        type: 'stretching',
        page: 15,
        image: 'assets/exercises/page-15.png',
        keywords: ['extending elbow', 'meluruskan siku', 'ekstensi siku', 'elbow extension']
    },
    {
        id: 'turning-forearm',
        name: 'Turning the Forearm',
        nameId: 'Memutar Lengan Bawah',
        category: 'upper_limb',
        type: 'stretching',
        page: 16,
        image: 'assets/exercises/page-16.png',
        keywords: ['turning forearm', 'memutar lengan bawah', 'pronasi', 'supinasi', 'forearm rotation', 'rotasi lengan']
    },
    {
        id: 'extending-wrist',
        name: 'Extending the Wrist',
        nameId: 'Meluruskan Pergelangan Tangan',
        category: 'upper_limb',
        type: 'stretching',
        page: 17,
        image: 'assets/exercises/page-17.png',
        keywords: ['extending wrist', 'meluruskan pergelangan', 'ekstensi pergelangan', 'wrist extension', 'wrist stretch', 'peregangan pergelangan']
    },
    {
        id: 'extending-fingers',
        name: 'Extending the Fingers',
        nameId: 'Meluruskan Jari-jari',
        category: 'upper_limb',
        type: 'stretching',
        page: 18,
        image: 'assets/exercises/page-18.png',
        keywords: ['extending fingers', 'meluruskan jari', 'ekstensi jari', 'finger extension', 'finger stretch', 'peregangan jari', 'buka jari']
    },
    {
        id: 'extending-thumb',
        name: 'Extending the Thumb',
        nameId: 'Meluruskan Jempol',
        category: 'upper_limb',
        type: 'stretching',
        page: 19,
        image: 'assets/exercises/page-19.png',
        keywords: ['extending thumb', 'meluruskan jempol', 'ekstensi jempol', 'thumb extension', 'thumb stretch', 'peregangan jempol', 'ibu jari']
    },

    // === UPPER LIMB - ARM: Muscular Strengthening ===
    {
        id: 'lifting-object',
        name: 'Lifting an Object',
        nameId: 'Mengangkat Benda',
        category: 'upper_limb',
        type: 'strengthening',
        page: 20,
        image: 'assets/exercises/page-20.png',
        keywords: ['lifting object', 'mengangkat benda', 'angkat botol', 'angkat objek', 'lift bottle', 'penguatan lengan', 'arm strengthening']
    },
    {
        id: 'extending-elbow-strength',
        name: 'Extending the Elbow (Strengthening)',
        nameId: 'Meluruskan Siku (Penguatan)',
        category: 'upper_limb',
        type: 'strengthening',
        page: 21,
        image: 'assets/exercises/page-21.png',
        keywords: ['extending elbow strength', 'penguatan siku', 'elbow strengthening', 'meluruskan siku']
    },
    {
        id: 'lifting-wrist',
        name: 'Lifting the Wrist',
        nameId: 'Mengangkat Pergelangan Tangan',
        category: 'upper_limb',
        type: 'strengthening',
        page: 22,
        image: 'assets/exercises/page-22.png',
        keywords: ['lifting wrist', 'mengangkat pergelangan', 'wrist lift', 'penguatan pergelangan', 'wrist strengthening']
    },
    {
        id: 'opening-hand',
        name: 'Opening the Hand',
        nameId: 'Membuka Tangan',
        category: 'upper_limb',
        type: 'strengthening',
        page: 23,
        image: 'assets/exercises/page-23.png',
        keywords: ['opening hand', 'membuka tangan', 'buka tangan', 'hand opening', 'grip', 'genggaman', 'penguatan tangan']
    },

    // === UPPER LIMB - ARM: Functional Exercises ===
    {
        id: 'drawing-line',
        name: 'Drawing a Line',
        nameId: 'Menggambar Garis',
        category: 'upper_limb',
        type: 'functional',
        page: 24,
        image: 'assets/exercises/page-24.png',
        keywords: ['drawing line', 'menggambar garis', 'menarik garis', 'draw', 'gambar', 'koordinasi tangan', 'hand coordination']
    },
    {
        id: 'moving-bottle-1',
        name: 'Moving a Bottle /1',
        nameId: 'Memindahkan Botol /1',
        category: 'upper_limb',
        type: 'functional',
        page: 25,
        image: 'assets/exercises/page-25.png',
        keywords: ['moving bottle', 'memindahkan botol', 'pindah botol', 'move bottle', 'menggerakkan botol']
    },
    {
        id: 'moving-bottle-2',
        name: 'Moving a Bottle /2',
        nameId: 'Memindahkan Botol /2',
        category: 'upper_limb',
        type: 'functional',
        page: 26,
        image: 'assets/exercises/page-26.png',
        keywords: ['moving bottle', 'memindahkan botol', 'pindah botol', 'move bottle']
    },
    {
        id: 'turning-bottle',
        name: 'Turning a Bottle',
        nameId: 'Memutar Botol',
        category: 'upper_limb',
        type: 'functional',
        page: 27,
        image: 'assets/exercises/page-27.png',
        keywords: ['turning bottle', 'memutar botol', 'putar botol', 'turn bottle', 'rotasi botol']
    },
    {
        id: 'using-spoon',
        name: 'Using a Spoon',
        nameId: 'Menggunakan Sendok',
        category: 'upper_limb',
        type: 'functional',
        page: 28,
        image: 'assets/exercises/page-28.png',
        keywords: ['using spoon', 'menggunakan sendok', 'pakai sendok', 'makan sendok', 'spoon', 'sendok', 'makan']
    },
    {
        id: 'hair-brushing',
        name: 'Hair Brushing',
        nameId: 'Menyisir Rambut',
        category: 'upper_limb',
        type: 'functional',
        page: 29,
        image: 'assets/exercises/page-29.png',
        keywords: ['hair brushing', 'menyisir rambut', 'sisir rambut', 'brush hair', 'sisir', 'rambut']
    },
    {
        id: 'holding-bottle',
        name: 'Holding a Bottle',
        nameId: 'Memegang Botol',
        category: 'upper_limb',
        type: 'functional',
        page: 30,
        image: 'assets/exercises/page-30.png',
        keywords: ['holding bottle', 'memegang botol', 'pegang botol', 'hold bottle', 'grip bottle', 'genggam botol']
    },
    {
        id: 'opening-bottle',
        name: 'Opening a Bottle',
        nameId: 'Membuka Botol',
        category: 'upper_limb',
        type: 'functional',
        page: 31,
        image: 'assets/exercises/page-31.png',
        keywords: ['opening bottle', 'membuka botol', 'buka botol', 'open bottle', 'tutup botol']
    },
    {
        id: 'holding-cup',
        name: 'Holding a Cup',
        nameId: 'Memegang Gelas',
        category: 'upper_limb',
        type: 'functional',
        page: 32,
        image: 'assets/exercises/page-32.png',
        keywords: ['holding cup', 'memegang gelas', 'pegang gelas', 'hold cup', 'gelas', 'cangkir', 'minum']
    },
    {
        id: 'turning-tap',
        name: 'Turning on a Tap',
        nameId: 'Membuka Keran',
        category: 'upper_limb',
        type: 'functional',
        page: 33,
        image: 'assets/exercises/page-33.png',
        keywords: ['turning tap', 'membuka keran', 'buka keran', 'turn tap', 'keran air', 'faucet']
    },
    {
        id: 'writing',
        name: 'Writing',
        nameId: 'Menulis',
        category: 'upper_limb',
        type: 'functional',
        page: 34,
        image: 'assets/exercises/page-34.png',
        keywords: ['writing', 'menulis', 'tulis', 'write', 'pen', 'pulpen', 'pensil']
    },
    {
        id: 'turning-pages',
        name: 'Turning Pages',
        nameId: 'Membalik Halaman',
        category: 'upper_limb',
        type: 'functional',
        page: 35,
        image: 'assets/exercises/page-35.png',
        keywords: ['turning pages', 'membalik halaman', 'balik halaman', 'turn page', 'buku', 'majalah']
    },
    {
        id: 'throwing-ball',
        name: 'Throwing a Ball',
        nameId: 'Melempar Bola',
        category: 'upper_limb',
        type: 'functional',
        page: 36,
        image: 'assets/exercises/page-36.png',
        keywords: ['throwing ball', 'melempar bola', 'lempar bola', 'throw ball', 'bola']
    },
    {
        id: 'throwing-ball-someone',
        name: 'Throwing a Ball to Someone',
        nameId: 'Melempar Bola ke Seseorang',
        category: 'upper_limb',
        type: 'functional',
        page: 37,
        image: 'assets/exercises/page-37.png',
        keywords: ['throwing ball someone', 'melempar bola ke orang', 'lempar tangkap', 'throw catch']
    },

    // === LOWER LIMB - LEG: Stretching Exercises ===
    {
        id: 'sitting-heels',
        name: 'Sitting on Your Heels',
        nameId: 'Duduk di Tumit',
        category: 'lower_limb',
        type: 'stretching',
        page: 39,
        image: 'assets/exercises/page-39.png',
        keywords: ['sitting heels', 'duduk tumit', 'duduk di tumit', 'sit heels', 'peregangan kaki', 'leg stretch']
    },
    {
        id: 'extending-leg',
        name: 'Extending Your Leg',
        nameId: 'Meluruskan Kaki',
        category: 'lower_limb',
        type: 'stretching',
        page: 40,
        image: 'assets/exercises/page-40.png',
        keywords: ['extending leg', 'meluruskan kaki', 'ekstensi kaki', 'leg extension', 'luruskan kaki', 'peregangan kaki']
    },
    {
        id: 'stretching-calf-1',
        name: 'Stretching Your Calf /1',
        nameId: 'Peregangan Betis /1',
        category: 'lower_limb',
        type: 'stretching',
        page: 41,
        image: 'assets/exercises/page-41.png',
        keywords: ['stretching calf', 'peregangan betis', 'betis', 'calf stretch', 'calf', 'betis tangga', 'stairs calf']
    },
    {
        id: 'stretching-calf-2',
        name: 'Stretching Your Calf /2',
        nameId: 'Peregangan Betis /2',
        category: 'lower_limb',
        type: 'stretching',
        page: 42,
        image: 'assets/exercises/page-42.png',
        keywords: ['stretching calf', 'peregangan betis', 'betis', 'calf stretch']
    },

    // === LOWER LIMB - LEG: Muscular Strengthening ===
    {
        id: 'extending-leg-outwards',
        name: 'Extending Your Leg Outwards',
        nameId: 'Meluruskan Kaki ke Samping',
        category: 'lower_limb',
        type: 'strengthening',
        page: 43,
        image: 'assets/exercises/page-43.png',
        keywords: ['extending leg outwards', 'kaki ke samping', 'leg outward', 'abduksi kaki', 'penguatan kaki']
    },
    {
        id: 'extending-leg-backwards',
        name: 'Extending Your Leg Backwards',
        nameId: 'Meluruskan Kaki ke Belakang',
        category: 'lower_limb',
        type: 'strengthening',
        page: 44,
        image: 'assets/exercises/page-44.png',
        keywords: ['extending leg backwards', 'kaki ke belakang', 'leg backward', 'ekstensi pinggul', 'penguatan kaki']
    },
    {
        id: 'lifting-knee',
        name: 'Lifting Your Knee',
        nameId: 'Mengangkat Lutut',
        category: 'lower_limb',
        type: 'strengthening',
        page: 45,
        image: 'assets/exercises/page-45.png',
        keywords: ['lifting knee', 'mengangkat lutut', 'angkat lutut', 'knee lift', 'knee raise']
    },
    {
        id: 'extending-knee',
        name: 'Extending Your Knee',
        nameId: 'Meluruskan Lutut',
        category: 'lower_limb',
        type: 'strengthening',
        page: 46,
        image: 'assets/exercises/page-46.png',
        keywords: ['extending knee', 'meluruskan lutut', 'ekstensi lutut', 'knee extension', 'luruskan lutut']
    },
    {
        id: 'bending-knee',
        name: 'Bending Your Knee',
        nameId: 'Menekuk Lutut',
        category: 'lower_limb',
        type: 'strengthening',
        page: 47,
        image: 'assets/exercises/page-47.png',
        keywords: ['bending knee', 'menekuk lutut', 'tekuk lutut', 'knee bend', 'fleksi lutut']
    },
    {
        id: 'standing-tiptoes',
        name: 'Standing on Tiptoes',
        nameId: 'Berdiri Jinjit',
        category: 'lower_limb',
        type: 'strengthening',
        page: 48,
        image: 'assets/exercises/page-48.png',
        keywords: ['standing tiptoes', 'berdiri jinjit', 'jinjit', 'tiptoe', 'calf raise', 'angkat tumit']
    },
    {
        id: 'lifting-toes',
        name: 'Lifting Your Toes',
        nameId: 'Mengangkat Jari Kaki',
        category: 'lower_limb',
        type: 'strengthening',
        page: 49,
        image: 'assets/exercises/page-49.png',
        keywords: ['lifting toes', 'mengangkat jari kaki', 'angkat jari kaki', 'toe lift', 'toe raise', 'jari kaki']
    },

    // === LOWER LIMB - LEG: Functional Exercises ===
    {
        id: 'getting-up-sitting',
        name: 'Getting Up / Sitting Down',
        nameId: 'Berdiri / Duduk',
        category: 'lower_limb',
        type: 'functional',
        page: 50,
        image: 'assets/exercises/page-50.png',
        keywords: ['getting up', 'sitting down', 'berdiri duduk', 'bangun duduk', 'sit stand', 'berdiri dari kursi', 'duduk berdiri']
    },
    {
        id: 'standing-one-leg-1',
        name: 'Standing on One Leg /1',
        nameId: 'Berdiri Satu Kaki /1',
        category: 'lower_limb',
        type: 'functional',
        page: 51,
        image: 'assets/exercises/page-51.png',
        keywords: ['standing one leg', 'berdiri satu kaki', 'keseimbangan', 'balance', 'single leg stand']
    },
    {
        id: 'standing-one-leg-2',
        name: 'Standing on One Leg /2',
        nameId: 'Berdiri Satu Kaki /2',
        category: 'lower_limb',
        type: 'functional',
        page: 52,
        image: 'assets/exercises/page-52.png',
        keywords: ['standing one leg', 'berdiri satu kaki', 'keseimbangan', 'balance']
    },
    {
        id: 'standing-one-leg-3',
        name: 'Standing on One Leg /3',
        nameId: 'Berdiri Satu Kaki /3',
        category: 'lower_limb',
        type: 'functional',
        page: 53,
        image: 'assets/exercises/page-53.png',
        keywords: ['standing one leg', 'berdiri satu kaki', 'keseimbangan', 'balance']
    },
    {
        id: 'stepping-obstacles-1',
        name: 'Stepping Over Obstacles /1',
        nameId: 'Melangkahi Rintangan /1',
        category: 'lower_limb',
        type: 'functional',
        page: 54,
        image: 'assets/exercises/page-54.png',
        keywords: ['stepping obstacles', 'melangkahi rintangan', 'langkahi', 'step over', 'obstacle', 'rintangan']
    },
    {
        id: 'stepping-obstacles-2',
        name: 'Stepping Over Obstacles /2',
        nameId: 'Melangkahi Rintangan /2',
        category: 'lower_limb',
        type: 'functional',
        page: 55,
        image: 'assets/exercises/page-55.png',
        keywords: ['stepping obstacles', 'melangkahi rintangan', 'langkahi', 'step over']
    },
    {
        id: 'walking-zigzag',
        name: 'Walking in a Zigzag',
        nameId: 'Berjalan Zigzag',
        category: 'lower_limb',
        type: 'functional',
        page: 56,
        image: 'assets/exercises/page-56.png',
        keywords: ['walking zigzag', 'berjalan zigzag', 'jalan zigzag', 'zigzag walk', 'zigzag']
    },
    {
        id: 'stairs-1',
        name: 'Stairs /1',
        nameId: 'Tangga /1',
        category: 'lower_limb',
        type: 'functional',
        page: 57,
        image: 'assets/exercises/page-57.png',
        keywords: ['stairs', 'tangga', 'naik tangga', 'turun tangga', 'climb stairs', 'stair']
    },
    {
        id: 'stairs-2',
        name: 'Stairs /2',
        nameId: 'Tangga /2',
        category: 'lower_limb',
        type: 'functional',
        page: 58,
        image: 'assets/exercises/page-58.png',
        keywords: ['stairs', 'tangga', 'naik tangga', 'turun tangga']
    },
    {
        id: 'stairs-3',
        name: 'Stairs /3',
        nameId: 'Tangga /3',
        category: 'lower_limb',
        type: 'functional',
        page: 59,
        image: 'assets/exercises/page-59.png',
        keywords: ['stairs', 'tangga', 'naik tangga', 'turun tangga']
    },
    {
        id: 'picking-objects-floor',
        name: 'Picking Up Objects from the Floor',
        nameId: 'Mengambil Benda dari Lantai',
        category: 'lower_limb',
        type: 'functional',
        page: 60,
        image: 'assets/exercises/page-60.png',
        keywords: ['picking objects', 'mengambil benda', 'ambil dari lantai', 'pick up floor', 'lantai', 'membungkuk']
    },
    {
        id: 'kicking-ball',
        name: 'Kicking a Ball',
        nameId: 'Menendang Bola',
        category: 'lower_limb',
        type: 'functional',
        page: 61,
        image: 'assets/exercises/page-61.png',
        keywords: ['kicking ball', 'menendang bola', 'tendang bola', 'kick ball', 'sepak bola']
    },
    {
        id: 'kicking-ball-someone',
        name: 'Kicking a Ball to Someone',
        nameId: 'Menendang Bola ke Seseorang',
        category: 'lower_limb',
        type: 'functional',
        page: 62,
        image: 'assets/exercises/page-62.png',
        keywords: ['kicking ball someone', 'menendang bola ke orang', 'tendang tangkap', 'kick pass']
    },

    // === GETTING UP FROM THE FLOOR ===
    {
        id: 'floor-with-chair-1',
        name: 'Getting Up from the Floor with a Chair /1',
        nameId: 'Bangun dari Lantai dengan Kursi /1',
        category: 'floor',
        type: 'functional',
        page: 64,
        image: 'assets/exercises/page-64.png',
        keywords: ['getting up floor chair', 'bangun dari lantai', 'bangun lantai kursi', 'floor chair', 'jatuh', 'lantai']
    },
    {
        id: 'floor-with-chair-2',
        name: 'Getting Up from the Floor with a Chair /2',
        nameId: 'Bangun dari Lantai dengan Kursi /2',
        category: 'floor',
        type: 'functional',
        page: 65,
        image: 'assets/exercises/page-65.png',
        keywords: ['getting up floor chair', 'bangun dari lantai', 'bangun lantai kursi']
    },
    {
        id: 'floor-without-chair-1',
        name: 'Getting Up from the Floor without a Chair /1',
        nameId: 'Bangun dari Lantai tanpa Kursi /1',
        category: 'floor',
        type: 'functional',
        page: 66,
        image: 'assets/exercises/page-66.png',
        keywords: ['getting up floor without chair', 'bangun lantai tanpa kursi', 'bangun dari lantai sendiri']
    },
    {
        id: 'floor-without-chair-2',
        name: 'Getting Up from the Floor without a Chair /2',
        nameId: 'Bangun dari Lantai tanpa Kursi /2',
        category: 'floor',
        type: 'functional',
        page: 67,
        image: 'assets/exercises/page-67.png',
        keywords: ['getting up floor without chair', 'bangun lantai tanpa kursi']
    },
    {
        id: 'floor-without-chair-3',
        name: 'Getting Up from the Floor without a Chair /3',
        nameId: 'Bangun dari Lantai tanpa Kursi /3',
        category: 'floor',
        type: 'functional',
        page: 68,
        image: 'assets/exercises/page-68.png',
        keywords: ['getting up floor without chair', 'bangun lantai tanpa kursi']
    },
    {
        id: 'floor-without-chair-4',
        name: 'Getting Up from the Floor without a Chair /4',
        nameId: 'Bangun dari Lantai tanpa Kursi /4',
        category: 'floor',
        type: 'functional',
        page: 69,
        image: 'assets/exercises/page-69.png',
        keywords: ['getting up floor without chair', 'bangun lantai tanpa kursi']
    }
];

// Match AI recommendation text to relevant exercises
function matchExercisesFromRecommendation(recommendationText) {
    if (!recommendationText) return [];

    const text = recommendationText.toLowerCase();
    const matched = [];
    const matchedIds = new Set();

    // Score each exercise based on keyword matches
    for (const exercise of EXERCISE_DATABASE) {
        let score = 0;
        for (const keyword of exercise.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                score += keyword.split(' ').length; // longer keyword = higher score
            }
        }
        // Also check exercise name
        if (text.includes(exercise.name.toLowerCase())) score += 3;
        if (text.includes(exercise.nameId.toLowerCase())) score += 3;

        if (score > 0 && !matchedIds.has(exercise.id)) {
            matched.push({ ...exercise, score });
            matchedIds.add(exercise.id);
        }
    }

    // Sort by score descending
    matched.sort((a, b) => b.score - a.score);

    return matched;
}

// Get exercises by category
function getExercisesByCategory(category) {
    return EXERCISE_DATABASE.filter(e => e.category === category);
}

// Get exercises by type
function getExercisesByType(type) {
    return EXERCISE_DATABASE.filter(e => e.type === type);
}

// Get category label in Indonesian
function getCategoryLabel(category) {
    const labels = {
        'upper_limb': 'Anggota Gerak Atas (Lengan)',
        'lower_limb': 'Anggota Gerak Bawah (Kaki)',
        'floor': 'Bangun dari Lantai'
    };
    return labels[category] || category;
}

// Get type label in Indonesian
function getTypeLabel(type) {
    const labels = {
        'stretching': 'Peregangan',
        'strengthening': 'Penguatan Otot',
        'functional': 'Latihan Fungsional'
    };
    return labels[type] || type;
}
