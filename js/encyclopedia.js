// Encyclopedia JavaScript
// Ensiklopedia Stroke - Artikel medis seputar stroke dan rehabilitasi

// ============================
// DATA ARTIKEL
// ============================
const ENCYCLOPEDIA_ARTICLES = [
    // ---- DASAR STROKE ----
    {
        id: 'apa-itu-stroke',
        category: 'dasar',
        categoryLabel: 'Dasar Stroke',
        icon: 'bi-heart-pulse',
        title: 'Apa Itu Stroke? Memahami Serangan Otak',
        summary: 'Penjelasan lengkap tentang stroke, bagaimana terjadi, dan dampaknya terhadap tubuh manusia.',
        readTime: 8,
        content: `
            <h2>Definisi Stroke</h2>
            <p>Stroke, atau yang dalam istilah medis disebut <strong>Cerebrovascular Accident (CVA)</strong>, adalah kondisi medis darurat yang terjadi ketika suplai darah ke bagian otak terganggu atau berkurang secara drastis, sehingga jaringan otak tidak mendapatkan oksigen dan nutrisi yang dibutuhkan. Dalam hitungan menit, sel-sel otak mulai mati.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-exclamation-triangle"></i> Fakta Penting:</strong></p>
                <p>Setiap menit keterlambatan penanganan stroke, sekitar 1,9 juta neuron (sel saraf) mati. Penanganan cepat sangat krusial untuk meminimalkan kerusakan otak.</p>
            </div>

            <h2>Jenis-Jenis Stroke</h2>
            <h3>1. Stroke Iskemik (87% kasus)</h3>
            <p>Terjadi ketika pembuluh darah yang memasok darah ke otak tersumbat oleh bekuan darah (trombus atau embolus). Ini adalah jenis stroke yang paling umum.</p>
            <ul>
                <li><strong>Stroke Trombotik:</strong> Bekuan darah terbentuk di dalam arteri yang memasok darah ke otak</li>
                <li><strong>Stroke Embolik:</strong> Bekuan darah terbentuk di tempat lain dalam tubuh (biasanya jantung) lalu berpindah ke otak</li>
            </ul>

            <h3>2. Stroke Hemoragik (13% kasus)</h3>
            <p>Terjadi ketika pembuluh darah di otak pecah dan menyebabkan perdarahan. Darah yang keluar menekan jaringan otak di sekitarnya.</p>
            <ul>
                <li><strong>Perdarahan Intraserebral:</strong> Pembuluh darah di dalam otak pecah</li>
                <li><strong>Perdarahan Subaraknoid:</strong> Pembuluh darah di permukaan otak pecah dan darah mengisi ruang antara otak dan tengkorak</li>
            </ul>

            <h3>3. Transient Ischemic Attack (TIA)</h3>
            <p>Dikenal sebagai "mini stroke", TIA adalah gangguan sementara aliran darah ke otak yang berlangsung singkat (biasanya kurang dari 5 menit). TIA adalah peringatan serius bahwa stroke yang lebih berat mungkin akan terjadi.</p>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Peringatan:</strong></p>
                <p>Sekitar 1 dari 3 orang yang mengalami TIA akan mengalami stroke dalam waktu satu tahun jika tidak ditangani.</p>
            </div>

            <h2>Dampak Stroke pada Tubuh</h2>
            <p>Dampak stroke sangat bergantung pada area otak yang terkena dan tingkat keparahan kerusakan:</p>
            <ul>
                <li><strong>Kelumpuhan atau kelemahan</strong> pada satu sisi tubuh (hemiparesis/hemiplegia)</li>
                <li><strong>Gangguan bicara dan bahasa</strong> (afasia)</li>
                <li><strong>Gangguan penglihatan</strong></li>
                <li><strong>Gangguan memori dan berpikir</strong></li>
                <li><strong>Gangguan keseimbangan dan koordinasi</strong></li>
                <li><strong>Perubahan emosi dan perilaku</strong></li>
                <li><strong>Kesulitan menelan</strong> (disfagia)</li>
                <li><strong>Nyeri dan mati rasa</strong></li>
            </ul>

            <h2>Otak Kiri vs Otak Kanan</h2>
            <p>Stroke pada sisi otak yang berbeda menyebabkan gejala yang berbeda pula:</p>
            <ul>
                <li><strong>Stroke otak kiri:</strong> Kelumpuhan sisi kanan tubuh, gangguan bicara, perilaku lambat dan hati-hati</li>
                <li><strong>Stroke otak kanan:</strong> Kelumpuhan sisi kiri tubuh, masalah penglihatan, perilaku cepat dan impulsif, pengabaian sisi kiri (neglect)</li>
            </ul>
        `
    },
    {
        id: 'gejala-stroke-fast',
        category: 'dasar',
        categoryLabel: 'Dasar Stroke',
        icon: 'bi-exclamation-triangle',
        title: 'Mengenali Gejala Stroke: Metode FAST',
        summary: 'Cara cepat dan mudah mengenali gejala stroke menggunakan metode FAST yang diakui secara internasional.',
        readTime: 5,
        content: `
            <h2>Metode FAST</h2>
            <p>FAST adalah akronim yang membantu mengenali gejala stroke dengan cepat. Semakin cepat stroke dikenali dan ditangani, semakin besar peluang pemulihan.</p>

            <div class="info-box success">
                <p><strong>F - Face (Wajah):</strong> Apakah satu sisi wajah turun atau mati rasa? Minta orang tersebut tersenyum - apakah senyumnya tidak merata?</p>
            </div>
            <div class="info-box success">
                <p><strong>A - Arms (Lengan):</strong> Apakah satu lengan lemah atau mati rasa? Minta orang tersebut mengangkat kedua lengan - apakah satu lengan turun ke bawah?</p>
            </div>
            <div class="info-box success">
                <p><strong>S - Speech (Bicara):</strong> Apakah bicara menjadi tidak jelas atau sulit dipahami? Minta orang tersebut mengulang kalimat sederhana.</p>
            </div>
            <div class="info-box warning">
                <p><strong>T - Time (Waktu):</strong> Jika Anda melihat salah satu tanda di atas, SEGERA hubungi ambulans atau bawa ke IGD rumah sakit terdekat! Setiap menit sangat berharga.</p>
            </div>

            <h2>Gejala Tambahan yang Perlu Diwaspadai</h2>
            <ul>
                <li>Sakit kepala hebat secara tiba-tiba tanpa penyebab yang jelas</li>
                <li>Gangguan penglihatan mendadak pada satu atau kedua mata</li>
                <li>Kesulitan berjalan, pusing, atau kehilangan keseimbangan</li>
                <li>Kebingungan mendadak, kesulitan memahami pembicaraan</li>
                <li>Mati rasa atau kelemahan mendadak pada wajah, lengan, atau kaki</li>
            </ul>

            <h2>Golden Period</h2>
            <p>Penanganan stroke iskemik dengan obat penghancur bekuan darah (tPA/alteplase) paling efektif jika diberikan dalam waktu <strong>3-4,5 jam</strong> sejak gejala pertama muncul. Periode ini disebut sebagai "golden period" atau "jendela emas" penanganan stroke.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-telephone"></i> Tindakan Darurat:</strong></p>
                <p>Hubungi nomor darurat 119 (Indonesia) atau bawa langsung ke IGD rumah sakit yang memiliki fasilitas penanganan stroke. Catat waktu pertama kali gejala muncul.</p>
            </div>
        `
    },
    {
        id: 'faktor-risiko-stroke',
        category: 'dasar',
        categoryLabel: 'Dasar Stroke',
        icon: 'bi-clipboard2-pulse',
        title: 'Faktor Risiko Stroke yang Wajib Diketahui',
        summary: 'Kenali faktor-faktor yang meningkatkan risiko stroke, baik yang dapat diubah maupun yang tidak.',
        readTime: 7,
        content: `
            <h2>Faktor Risiko yang Dapat Dimodifikasi</h2>
            <p>Faktor-faktor berikut dapat dikendalikan melalui perubahan gaya hidup dan pengobatan:</p>

            <h3>1. Hipertensi (Tekanan Darah Tinggi)</h3>
            <p>Faktor risiko paling signifikan. Tekanan darah tinggi melemahkan dan merusak pembuluh darah otak, membuatnya rentan pecah atau tersumbat. Target tekanan darah ideal: kurang dari 130/80 mmHg.</p>

            <h3>2. Diabetes Melitus</h3>
            <p>Kadar gula darah yang tinggi secara kronis merusak pembuluh darah dan meningkatkan risiko pembentukan bekuan darah. Penderita diabetes memiliki risiko stroke 2-4 kali lebih tinggi.</p>

            <h3>3. Penyakit Jantung</h3>
            <p>Fibrilasi atrium (irama jantung tidak teratur), penyakit katup jantung, dan gagal jantung meningkatkan risiko pembentukan bekuan darah yang dapat berpindah ke otak.</p>

            <h3>4. Kolesterol Tinggi</h3>
            <p>Kolesterol LDL yang tinggi menyebabkan penumpukan plak di dinding arteri (aterosklerosis), menyempitkan aliran darah ke otak.</p>

            <h3>5. Merokok</h3>
            <p>Merokok menggandakan risiko stroke. Nikotin meningkatkan tekanan darah, dan karbon monoksida mengurangi kadar oksigen dalam darah. Berhenti merokok dapat menurunkan risiko stroke secara signifikan dalam 2-5 tahun.</p>

            <h3>6. Obesitas dan Kurang Aktivitas Fisik</h3>
            <p>Kelebihan berat badan meningkatkan risiko hipertensi, diabetes, dan kolesterol tinggi. Aktivitas fisik teratur minimal 150 menit per minggu dapat menurunkan risiko stroke hingga 25-30%.</p>

            <h2>Faktor Risiko yang Tidak Dapat Dimodifikasi</h2>
            <ul>
                <li><strong>Usia:</strong> Risiko stroke meningkat setelah usia 55 tahun, berlipat ganda setiap dekade</li>
                <li><strong>Jenis Kelamin:</strong> Pria memiliki risiko lebih tinggi, tetapi wanita lebih sering meninggal akibat stroke</li>
                <li><strong>Riwayat Keluarga:</strong> Memiliki keluarga dengan riwayat stroke meningkatkan risiko</li>
                <li><strong>Ras/Etnis:</strong> Orang Asia Tenggara memiliki prevalensi stroke yang relatif tinggi</li>
                <li><strong>Riwayat Stroke/TIA Sebelumnya:</strong> Risiko kekambuhan tinggi</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-check-circle"></i> Kabar Baik:</strong></p>
                <p>Hingga 80% stroke dapat dicegah! Mengelola faktor risiko yang dapat dimodifikasi melalui gaya hidup sehat dan pengobatan yang tepat sangat efektif dalam menurunkan risiko stroke.</p>
            </div>
        `
    },

    // ---- REHABILITASI ----
    {
        id: 'tahapan-rehabilitasi',
        category: 'rehabilitasi',
        categoryLabel: 'Rehabilitasi',
        icon: 'bi-bandaid',
        title: 'Tahapan Rehabilitasi Stroke: Dari Akut Hingga Pemulihan',
        summary: 'Panduan lengkap tahapan rehabilitasi stroke mulai dari fase akut, sub-akut, hingga pemulihan jangka panjang.',
        readTime: 10,
        content: `
            <h2>Mengapa Rehabilitasi Penting?</h2>
            <p>Rehabilitasi stroke adalah proses yang membantu penderita stroke mendapatkan kembali kemampuan yang hilang akibat kerusakan otak. Otak memiliki kemampuan luar biasa yang disebut <strong>neuroplastisitas</strong> - kemampuan untuk membentuk jalur saraf baru dan mengorganisasi ulang fungsinya.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-lightbulb"></i> Neuroplastisitas:</strong></p>
                <p>Otak dapat "melatih ulang" area yang sehat untuk mengambil alih fungsi area yang rusak. Proses ini difasilitasi melalui latihan berulang dan konsisten.</p>
            </div>

            <h2>Fase 1: Rehabilitasi Akut (0-2 Minggu)</h2>
            <p>Dimulai segera setelah kondisi pasien stabil di rumah sakit:</p>
            <ul>
                <li>Mencegah komplikasi (pneumonia, DVT, luka tekan)</li>
                <li>Positioning yang benar di tempat tidur</li>
                <li>Gerakan pasif oleh terapis untuk mencegah kekakuan sendi</li>
                <li>Latihan pernapasan</li>
                <li>Evaluasi kemampuan menelan (disfagia)</li>
                <li>Mobilisasi dini jika memungkinkan</li>
            </ul>

            <h2>Fase 2: Rehabilitasi Sub-Akut (2 Minggu - 3 Bulan)</h2>
            <p>Fase kritis dimana pemulihan paling signifikan terjadi:</p>
            <ul>
                <li>Latihan aktif dengan bantuan (active-assisted exercises)</li>
                <li>Latihan kekuatan otot secara bertahap</li>
                <li>Latihan keseimbangan dan koordinasi</li>
                <li>Terapi okupasi untuk aktivitas sehari-hari</li>
                <li>Terapi wicara jika ada gangguan bicara</li>
                <li>Mulai latihan berjalan dengan alat bantu</li>
            </ul>

            <h2>Fase 3: Rehabilitasi Kronis (3-6 Bulan)</h2>
            <ul>
                <li>Intensifikasi latihan mandiri</li>
                <li>Latihan fungsional kompleks</li>
                <li>Reintegrasi ke aktivitas kehidupan sehari-hari</li>
                <li>Program latihan di rumah</li>
                <li>Pemantauan dengan perangkat wearable (seperti Myosig)</li>
            </ul>

            <h2>Fase 4: Pemulihan Jangka Panjang (6+ Bulan)</h2>
            <ul>
                <li>Latihan pemeliharaan dan peningkatan berkelanjutan</li>
                <li>Adaptasi dan kompensasi untuk defisit permanen</li>
                <li>Dukungan psikologis dan sosial</li>
                <li>Pencegahan stroke berulang</li>
                <li>Monitoring progress melalui teknologi</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-up-arrow"></i> Pemulihan Berkelanjutan:</strong></p>
                <p>Meskipun pemulihan tercepat terjadi dalam 3-6 bulan pertama, perbaikan dapat terus berlanjut bertahun-tahun setelah stroke. Konsistensi latihan adalah kunci utama.</p>
            </div>
        `
    },
    {
        id: 'rehabilitasi-lengan',
        category: 'rehabilitasi',
        categoryLabel: 'Rehabilitasi',
        icon: 'bi-hand-index',
        title: 'Rehabilitasi Lengan Pasca Stroke: Teknik dan Latihan',
        summary: 'Panduan praktis latihan rehabilitasi lengan yang efektif untuk pemulihan fungsi motorik pasca stroke.',
        readTime: 9,
        content: `
            <h2>Pentingnya Rehabilitasi Lengan</h2>
            <p>Kelemahan atau kelumpuhan lengan (hemiparesis/hemiplegia) adalah salah satu dampak stroke yang paling umum dan paling mengganggu aktivitas sehari-hari. Sekitar <strong>80% penderita stroke</strong> mengalami gangguan fungsi lengan pada sisi yang terkena.</p>

            <h2>Latihan Dasar (Level Awal)</h2>
            <h3>1. Latihan Gerak Pasif</h3>
            <p>Dilakukan ketika pasien belum mampu menggerakkan lengan sendiri:</p>
            <ul>
                <li>Fleksi dan ekstensi jari tangan</li>
                <li>Rotasi pergelangan tangan</li>
                <li>Fleksi dan ekstensi siku</li>
                <li>Elevasi dan rotasi bahu</li>
            </ul>
            <p>Lakukan 10-15 repetisi per gerakan, 2-3 kali sehari.</p>

            <h3>2. Latihan Gerak Aktif dengan Bantuan</h3>
            <p>Menggunakan tangan yang sehat untuk membantu tangan yang lemah:</p>
            <ul>
                <li>Clasp hands exercise: kedua tangan saling menggenggam, gerakkan ke atas dan ke bawah</li>
                <li>Table slide: geser tangan di atas meja ke berbagai arah</li>
                <li>Towel slide: tarik handuk di atas meja dengan bantuan tangan sehat</li>
            </ul>

            <h2>Latihan Menengah</h2>
            <h3>3. Latihan Kekuatan Genggaman</h3>
            <ul>
                <li>Meremas bola karet atau spons</li>
                <li>Membuka dan menutup jari secara berulang</li>
                <li>Latihan dengan putty terapi</li>
            </ul>

            <h3>4. Latihan Koordinasi</h3>
            <ul>
                <li>Menyusun balok atau koin</li>
                <li>Memindahkan benda kecil antar wadah</li>
                <li>Latihan mengancingkan baju</li>
                <li>Menulis atau menggambar</li>
            </ul>

            <h2>Latihan Lanjutan</h2>
            <h3>5. Constraint-Induced Movement Therapy (CIMT)</h3>
            <p>Teknik terbukti efektif dimana tangan yang sehat "dibatasi" (menggunakan sarung tangan atau sling) sehingga pasien dipaksa menggunakan tangan yang lemah untuk aktivitas sehari-hari. Dilakukan 2-3 jam per hari selama 2 minggu.</p>

            <h3>6. Mirror Therapy</h3>
            <p>Menggunakan cermin untuk menciptakan ilusi visual bahwa lengan yang lemah bergerak normal. Otak "tertipu" dan ini membantu merangsang jalur saraf motorik yang rusak.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-cpu"></i> Peran Teknologi:</strong></p>
                <p>Perangkat wearable seperti Myosig dengan sensor EMG dapat memantau aktivitas otot secara real-time, membantu dokter dan pasien melacak kemajuan rehabilitasi lengan secara objektif.</p>
            </div>

            <h2>Tips Penting</h2>
            <ul>
                <li>Mulai dari gerakan sederhana, tingkatkan secara bertahap</li>
                <li>Konsistensi lebih penting daripada intensitas</li>
                <li>Jangan memaksakan jika terasa nyeri</li>
                <li>Lakukan di bawah pengawasan terapis atau dokter</li>
                <li>Pantau progress dengan sensor EMG untuk feedback objektif</li>
            </ul>
        `
    },
    {
        id: 'emg-rehabilitasi',
        category: 'rehabilitasi',
        categoryLabel: 'Rehabilitasi',
        icon: 'bi-activity',
        title: 'Peran EMG dalam Rehabilitasi Stroke',
        summary: 'Bagaimana teknologi Electromyography (EMG) membantu memantau dan meningkatkan efektivitas rehabilitasi stroke.',
        readTime: 7,
        content: `
            <h2>Apa Itu EMG?</h2>
            <p><strong>Electromyography (EMG)</strong> adalah teknik yang mengukur dan merekam aktivitas listrik yang dihasilkan oleh otot rangka. Ketika otot berkontraksi, impuls listrik dihasilkan dan dapat dideteksi oleh sensor EMG.</p>

            <h2>EMG dalam Konteks Rehabilitasi Stroke</h2>
            <p>Pada pasien stroke, EMG memberikan informasi berharga tentang:</p>
            <ul>
                <li><strong>Tingkat aktivasi otot:</strong> Seberapa kuat otot berkontraksi</li>
                <li><strong>Pola rekrutmen otot:</strong> Otot mana yang aktif dan urutannya</li>
                <li><strong>Kelelahan otot:</strong> Kapan otot mulai lelah selama latihan</li>
                <li><strong>Progress pemulihan:</strong> Peningkatan aktivitas otot dari waktu ke waktu</li>
            </ul>

            <h2>Zona Aktivitas EMG</h2>
            <p>Pembacaan EMG dapat dikategorikan ke dalam zona-zona yang membantu dokter menilai kondisi otot:</p>
            <ul>
                <li><strong>Zona Istirahat (0-10%):</strong> Aktivitas otot minimal, otot dalam keadaan rileks</li>
                <li><strong>Zona Ringan (10-25%):</strong> Kontraksi ringan, cocok untuk fase awal rehabilitasi</li>
                <li><strong>Zona Sedang (25-50%):</strong> Kontraksi moderat, target untuk latihan harian</li>
                <li><strong>Zona Tinggi (50-75%):</strong> Kontraksi kuat, untuk latihan intensif</li>
                <li><strong>Zona Maksimal (75-100%):</strong> Kontraksi maksimal, harus dimonitor ketat</li>
            </ul>

            <h2>Biofeedback EMG</h2>
            <p>Biofeedback EMG adalah teknik dimana data aktivitas otot ditampilkan secara real-time kepada pasien, memungkinkan mereka untuk:</p>
            <ul>
                <li>Melihat secara langsung kapan otot mereka berkontraksi</li>
                <li>Belajar mengontrol kontraksi otot secara sadar</li>
                <li>Memotivasi diri dengan melihat progress secara visual</li>
                <li>Mengoptimalkan pola gerakan</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-check-circle"></i> Bukti Ilmiah:</strong></p>
                <p>Penelitian menunjukkan bahwa biofeedback EMG meningkatkan pemulihan motorik lengan atas sebesar 20-30% dibandingkan rehabilitasi konvensional saja (Cochrane Review, 2023).</p>
            </div>

            <h2>Pemantauan Kelelahan dengan EMG</h2>
            <p>Salah satu keunggulan EMG adalah kemampuan mendeteksi kelelahan otot sebelum pasien merasakannya secara subjektif. Tanda-tanda kelelahan pada EMG:</p>
            <ul>
                <li>Penurunan amplitudo sinyal secara bertahap</li>
                <li>Peningkatan variabilitas sinyal</li>
                <li>Perubahan frekuensi median (median frequency shift)</li>
            </ul>
            <p>Deteksi dini kelelahan mencegah overexertion yang dapat memperlambat pemulihan.</p>
        `
    },

    // ---- NUTRISI ----
    {
        id: 'nutrisi-pasca-stroke',
        category: 'nutrisi',
        categoryLabel: 'Nutrisi',
        icon: 'bi-cup-hot',
        title: 'Panduan Nutrisi untuk Pemulihan Stroke',
        summary: 'Makanan dan pola makan yang mendukung pemulihan otak dan mencegah stroke berulang.',
        readTime: 8,
        content: `
            <h2>Nutrisi dan Pemulihan Otak</h2>
            <p>Nutrisi yang tepat memainkan peran penting dalam pemulihan pasca stroke. Otak membutuhkan nutrisi spesifik untuk memperbaiki jaringan yang rusak, membentuk koneksi saraf baru, dan mengurangi peradangan.</p>

            <h2>Pola Makan yang Direkomendasikan</h2>
            <h3>Diet Mediterania</h3>
            <p>Pola makan yang paling banyak didukung bukti ilmiah untuk kesehatan otak dan jantung:</p>
            <ul>
                <li>Sayuran dan buah-buahan (5+ porsi per hari)</li>
                <li>Ikan berlemak (salmon, tuna, sarden) - 2-3 kali per minggu</li>
                <li>Biji-bijian utuh (beras merah, gandum utuh)</li>
                <li>Kacang-kacangan dan biji-bijian</li>
                <li>Minyak zaitun sebagai sumber lemak utama</li>
                <li>Batasi daging merah dan makanan olahan</li>
            </ul>

            <h2>Nutrisi Penting untuk Pemulihan</h2>
            <h3>1. Omega-3 (DHA dan EPA)</h3>
            <p>Asam lemak esensial untuk perbaikan membran sel saraf. Sumber: ikan berlemak, biji chia, kenari.</p>

            <h3>2. Antioksidan</h3>
            <p>Melawan kerusakan oksidatif pada sel otak. Sumber: buah beri, sayuran hijau gelap, cokelat hitam, teh hijau.</p>

            <h3>3. Vitamin B Kompleks</h3>
            <p>Penting untuk fungsi saraf dan menurunkan kadar homosistein (faktor risiko stroke). Sumber: telur, ikan, sayuran hijau, kacang-kacangan.</p>

            <h3>4. Vitamin D</h3>
            <p>Mendukung pemulihan saraf dan fungsi otot. Sumber: paparan sinar matahari, ikan berlemak, susu fortifikasi.</p>

            <h3>5. Magnesium</h3>
            <p>Membantu relaksasi otot dan fungsi saraf. Sumber: kacang-kacangan, biji-bijian, sayuran hijau, pisang.</p>

            <h2>Makanan yang Perlu Dibatasi</h2>
            <ul>
                <li><strong>Garam:</strong> Batasi kurang dari 5 gram per hari untuk mengontrol tekanan darah</li>
                <li><strong>Gula:</strong> Kurangi gula tambahan untuk mengontrol gula darah</li>
                <li><strong>Lemak jenuh dan trans:</strong> Hindari gorengan, makanan cepat saji, margarin</li>
                <li><strong>Alkohol:</strong> Batasi atau hindari sepenuhnya</li>
                <li><strong>Makanan olahan:</strong> Tinggi garam, gula, dan pengawet</li>
            </ul>

            <div class="info-box">
                <p><strong><i class="bi bi-droplet"></i> Hidrasi:</strong></p>
                <p>Minum minimal 8 gelas air per hari. Dehidrasi dapat mempertebal darah dan meningkatkan risiko pembentukan bekuan. Jika pasien mengalami kesulitan menelan, konsultasikan dengan ahli gizi tentang konsistensi cairan yang aman.</p>
            </div>
        `
    },

    // ---- OLAHRAGA ----
    {
        id: 'olahraga-pasca-stroke',
        category: 'olahraga',
        categoryLabel: 'Olahraga',
        icon: 'bi-bicycle',
        title: 'Panduan Olahraga Aman Pasca Stroke',
        summary: 'Jenis olahraga yang aman dan bermanfaat untuk penderita pasca stroke beserta panduannya.',
        readTime: 8,
        content: `
            <h2>Manfaat Olahraga Pasca Stroke</h2>
            <p>Olahraga teratur pasca stroke memiliki berbagai manfaat:</p>
            <ul>
                <li>Meningkatkan kekuatan otot dan daya tahan</li>
                <li>Memperbaiki keseimbangan dan koordinasi</li>
                <li>Menurunkan risiko stroke berulang hingga 25%</li>
                <li>Mengurangi depresi dan kecemasan</li>
                <li>Meningkatkan kualitas hidup secara keseluruhan</li>
                <li>Mendukung neuroplastisitas otak</li>
            </ul>

            <h2>Jenis Olahraga yang Direkomendasikan</h2>
            <h3>1. Latihan Aerobik</h3>
            <p>Target: 150 menit per minggu, intensitas sedang</p>
            <ul>
                <li><strong>Jalan kaki:</strong> Mulai dari 5-10 menit, tingkatkan bertahap</li>
                <li><strong>Bersepeda statis:</strong> Aman untuk keseimbangan</li>
                <li><strong>Berenang/aquatic therapy:</strong> Air mengurangi beban sendi</li>
                <li><strong>Senam duduk:</strong> Untuk yang belum mampu berdiri lama</li>
            </ul>

            <h3>2. Latihan Kekuatan</h3>
            <p>2-3 kali per minggu, gunakan beban ringan atau elastis:</p>
            <ul>
                <li>Angkat beban ringan (0.5-2 kg)</li>
                <li>Latihan dengan resistance band</li>
                <li>Gerakan melawan gravitasi (angkat lengan/kaki)</li>
                <li>Wall push-up (push-up dinding)</li>
            </ul>

            <h3>3. Latihan Keseimbangan</h3>
            <ul>
                <li>Berdiri satu kaki (dengan pegangan)</li>
                <li>Heel-to-toe walking</li>
                <li>Sit-to-stand exercise</li>
                <li>Tai Chi (sangat direkomendasikan)</li>
            </ul>

            <h3>4. Latihan Fleksibilitas</h3>
            <ul>
                <li>Peregangan statis: tahan 15-30 detik per otot</li>
                <li>Range of motion exercises</li>
                <li>Yoga modifikasi</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Tanda Harus Berhenti:</strong></p>
                <p>Segera hentikan olahraga jika mengalami: nyeri dada, sesak napas berlebihan, pusing atau mual, kelemahan mendadak yang baru, detak jantung sangat cepat atau tidak teratur.</p>
            </div>

            <h2>Panduan Umum</h2>
            <ul>
                <li>Selalu konsultasikan dengan dokter sebelum memulai program olahraga</li>
                <li>Mulai perlahan dan tingkatkan secara bertahap (prinsip 10%)</li>
                <li>Lakukan pemanasan dan pendinginan setiap sesi</li>
                <li>Jangan berolahraga saat tekanan darah sangat tinggi (&gt;180/110 mmHg)</li>
                <li>Pantau aktivitas otot dengan sensor EMG untuk feedback objektif</li>
                <li>Latihan konsisten lebih baik daripada sesekali intensif</li>
            </ul>
        `
    },
    {
        id: 'latihan-tangan-rumah',
        category: 'olahraga',
        categoryLabel: 'Olahraga',
        icon: 'bi-hand-thumbs-up',
        title: '10 Latihan Tangan di Rumah untuk Pasien Stroke',
        summary: 'Latihan sederhana yang bisa dilakukan sendiri di rumah untuk memperkuat fungsi tangan pasca stroke.',
        readTime: 7,
        content: `
            <h2>Persiapan Sebelum Latihan</h2>
            <ul>
                <li>Pastikan posisi duduk nyaman dan stabil</li>
                <li>Lakukan di meja yang kokoh dengan permukaan halus</li>
                <li>Siapkan alat bantu: bola kecil, koin, jepitan baju, handuk</li>
                <li>Lakukan setelah makan dan minum yang cukup</li>
            </ul>

            <h2>Latihan 1: Buka-Tutup Tangan</h2>
            <p>Buka tangan selebar mungkin, tahan 5 detik, lalu kepalkan. Ulangi 10-15 kali. Latihan dasar untuk membangun kekuatan genggaman.</p>

            <h2>Latihan 2: Pencet Bola</h2>
            <p>Genggam bola karet kecil atau spons, pencet selama 5 detik, lepaskan. Ulangi 10-15 kali. Tingkatkan kekerasan bola seiring kemajuan.</p>

            <h2>Latihan 3: Jari Berjalan di Meja</h2>
            <p>Letakkan tangan di meja, "jalankan" jari-jari ke depan sejauh mungkin, lalu kembali. Ulangi 10 kali. Latih koordinasi jari.</p>

            <h2>Latihan 4: Pinch Exercise</h2>
            <p>Jepit benda kecil (koin, kancing) antara ibu jari dan jari lainnya secara bergantian. Tahan 5 detik per jari. Latih motorik halus.</p>

            <h2>Latihan 5: Handuk Roll</h2>
            <p>Letakkan handuk kecil di meja. Gulung dengan tangan yang lemah, lalu buka kembali. Ulangi 10 kali.</p>

            <h2>Latihan 6: Putar Pergelangan</h2>
            <p>Putar pergelangan tangan searah jarum jam 10 kali, lalu berlawanan 10 kali. Gunakan tangan sehat untuk membantu jika perlu.</p>

            <h2>Latihan 7: Latihan Jepitan Baju</h2>
            <p>Buka dan tutup jepitan baju menggunakan tangan yang lemah. Target: 10 jepitan. Latihan kekuatan pinch yang fungsional.</p>

            <h2>Latihan 8: Rubber Band Stretch</h2>
            <p>Pasang karet gelang di ujung semua jari, lalu lebarkan jari melawan tahanan karet. Tahan 5 detik, ulangi 10 kali.</p>

            <h2>Latihan 9: Menulis atau Menggambar</h2>
            <p>Mulai dari menggambar garis lurus, lingkaran, lalu huruf. Tidak perlu sempurna - yang penting konsistensi latihan.</p>

            <h2>Latihan 10: Menyusun Benda</h2>
            <p>Susun koin, kartu, atau balok kecil. Latihan koordinasi tangan-mata yang menyenangkan. Tingkatkan jumlah dan kecepatan seiring waktu.</p>

            <div class="info-box success">
                <p><strong><i class="bi bi-calendar-check"></i> Jadwal yang Disarankan:</strong></p>
                <p>Lakukan latihan 2-3 kali sehari, masing-masing 15-20 menit. Konsistensi lebih penting daripada durasi. Catat progress harian Anda.</p>
            </div>
        `
    },

    // ---- MENTAL ----
    {
        id: 'depresi-pasca-stroke',
        category: 'mental',
        categoryLabel: 'Kesehatan Mental',
        icon: 'bi-emoji-smile',
        title: 'Mengatasi Depresi Pasca Stroke',
        summary: 'Kenali dan tangani depresi pasca stroke yang dialami sekitar 30-50% penderita stroke.',
        readTime: 8,
        content: `
            <h2>Depresi Pasca Stroke: Lebih dari Sekadar Sedih</h2>
            <p><strong>Post-Stroke Depression (PSD)</strong> adalah kondisi medis serius yang mempengaruhi sekitar 30-50% penderita stroke. Ini bukan kelemahan karakter atau kurangnya motivasi - melainkan akibat perubahan biokimia di otak dan dampak emosional dari keterbatasan fisik.</p>

            <h2>Penyebab Depresi Pasca Stroke</h2>
            <ul>
                <li><strong>Faktor Biologis:</strong> Kerusakan pada area otak yang mengatur emosi, perubahan neurotransmiter (serotonin, norepinefrin)</li>
                <li><strong>Faktor Psikologis:</strong> Kehilangan kemandirian, perubahan peran, ketakutan akan stroke berulang</li>
                <li><strong>Faktor Sosial:</strong> Isolasi sosial, perubahan hubungan, tekanan finansial</li>
            </ul>

            <h2>Gejala yang Perlu Diwaspadai</h2>
            <ul>
                <li>Perasaan sedih, hampa, atau putus asa yang berkelanjutan</li>
                <li>Kehilangan minat pada aktivitas yang dulu disukai</li>
                <li>Gangguan tidur (terlalu banyak atau terlalu sedikit)</li>
                <li>Perubahan nafsu makan</li>
                <li>Kelelahan dan kehilangan energi</li>
                <li>Kesulitan berkonsentrasi</li>
                <li>Perasaan tidak berharga atau bersalah</li>
                <li>Menolak berpartisipasi dalam rehabilitasi</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Penting:</strong></p>
                <p>Depresi pasca stroke yang tidak ditangani dapat menghambat pemulihan secara signifikan, meningkatkan risiko stroke berulang, dan menurunkan kualitas hidup. Jangan ragu untuk mencari bantuan profesional.</p>
            </div>

            <h2>Strategi Penanganan</h2>
            <h3>1. Pengobatan Medis</h3>
            <p>Dokter dapat meresepkan antidepresan (SSRI seperti sertraline atau fluoxetine) yang telah terbukti aman dan efektif untuk PSD.</p>

            <h3>2. Psikoterapi</h3>
            <p>Cognitive Behavioral Therapy (CBT) membantu mengubah pola pikir negatif dan mengembangkan strategi koping yang efektif.</p>

            <h3>3. Dukungan Sosial</h3>
            <ul>
                <li>Bergabung dengan kelompok dukungan stroke</li>
                <li>Menjaga komunikasi dengan keluarga dan teman</li>
                <li>Berbagi pengalaman dengan sesama penderita stroke</li>
            </ul>

            <h3>4. Aktivitas Fisik</h3>
            <p>Olahraga teratur melepaskan endorfin yang secara alami meningkatkan suasana hati. Bahkan latihan ringan seperti jalan kaki dapat membantu.</p>

            <h3>5. Mindfulness dan Relaksasi</h3>
            <ul>
                <li>Latihan pernapasan dalam</li>
                <li>Meditasi guided (tersedia dalam aplikasi)</li>
                <li>Progressive muscle relaxation</li>
            </ul>
        `
    },
    {
        id: 'motivasi-rehabilitasi',
        category: 'mental',
        categoryLabel: 'Kesehatan Mental',
        icon: 'bi-star',
        title: 'Menjaga Motivasi Selama Rehabilitasi',
        summary: 'Tips dan strategi untuk tetap termotivasi menjalani proses rehabilitasi stroke yang panjang.',
        readTime: 6,
        content: `
            <h2>Mengapa Motivasi Sering Menurun?</h2>
            <p>Rehabilitasi stroke adalah perjalanan panjang yang penuh tantangan. Motivasi sering menurun karena:</p>
            <ul>
                <li>Progress yang terasa lambat</li>
                <li>Rasa frustrasi dengan keterbatasan</li>
                <li>Rutinitas latihan yang monoton</li>
                <li>Kelelahan fisik dan mental</li>
                <li>Membandingkan diri dengan kondisi sebelum stroke</li>
            </ul>

            <h2>Strategi Menjaga Motivasi</h2>
            <h3>1. Tetapkan Target yang Realistis</h3>
            <p>Buat target kecil yang dapat dicapai. Misalnya: "Minggu ini saya akan menggenggam bola selama 10 detik" daripada "Saya harus bisa menulis normal."</p>

            <h3>2. Catat dan Rayakan Kemajuan</h3>
            <p>Gunakan aplikasi seperti Myosig untuk memantau progress objektif. Setiap peningkatan, sekecil apapun, layak dirayakan.</p>

            <h3>3. Variasikan Latihan</h3>
            <p>Jangan terpaku pada latihan yang sama. Variasi membuat latihan lebih menarik dan melatih otot dari berbagai sudut.</p>

            <h3>4. Libatkan Orang Terdekat</h3>
            <p>Ajak keluarga atau teman untuk menemani latihan. Dukungan sosial sangat berpengaruh pada motivasi.</p>

            <h3>5. Fokus pada Proses, Bukan Hasil</h3>
            <p>Banggalah bahwa Anda melakukan latihan hari ini, terlepas dari hasilnya. Setiap sesi latihan merangsang neuroplastisitas.</p>

            <h3>6. Buat Rutinitas yang Menyenangkan</h3>
            <p>Dengarkan musik favorit saat latihan, lakukan di tempat yang menyenangkan, atau jadikan latihan sebagai aktivitas bersama keluarga.</p>

            <div class="info-box success">
                <p><strong><i class="bi bi-quote"></i> Pengingat:</strong></p>
                <p>"Pemulihan stroke bukan sprint, melainkan maraton. Yang penting bukan seberapa cepat, tapi seberapa konsisten Anda terus melangkah."</p>
            </div>
        `
    },

    // ---- PENCEGAHAN ----
    {
        id: 'pencegahan-stroke-berulang',
        category: 'pencegahan',
        categoryLabel: 'Pencegahan',
        icon: 'bi-shield-check',
        title: 'Mencegah Stroke Berulang: 7 Langkah Penting',
        summary: 'Strategi komprehensif untuk menurunkan risiko stroke berulang yang terjadi pada 25% penderita.',
        readTime: 8,
        content: `
            <h2>Risiko Stroke Berulang</h2>
            <p>Penderita yang pernah mengalami stroke memiliki risiko 25-35% untuk mengalami stroke kedua dalam 5 tahun. Stroke berulang seringkali lebih berat dan berpotensi fatal. Namun, dengan langkah pencegahan yang tepat, risiko ini dapat diturunkan secara signifikan.</p>

            <h2>Langkah 1: Kontrol Tekanan Darah</h2>
            <p>Hipertensi adalah faktor risiko nomor satu. Target: kurang dari 130/80 mmHg.</p>
            <ul>
                <li>Minum obat antihipertensi sesuai resep dokter - jangan berhenti tanpa konsultasi</li>
                <li>Kurangi asupan garam (&lt;5 gram/hari)</li>
                <li>Periksa tekanan darah secara rutin (minimal seminggu sekali)</li>
            </ul>

            <h2>Langkah 2: Kelola Diabetes</h2>
            <ul>
                <li>Kontrol gula darah secara ketat (HbA1c &lt;7%)</li>
                <li>Diet rendah gula dan karbohidrat olahan</li>
                <li>Olahraga teratur membantu sensitivitas insulin</li>
            </ul>

            <h2>Langkah 3: Terapi Antikoagulan/Antiplatelet</h2>
            <p>Dokter mungkin meresepkan obat pengencer darah untuk mencegah pembentukan bekuan:</p>
            <ul>
                <li>Aspirin dosis rendah</li>
                <li>Clopidogrel</li>
                <li>Warfarin atau antikoagulan baru (untuk fibrilasi atrium)</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Penting:</strong></p>
                <p>JANGAN pernah menghentikan atau mengubah dosis obat tanpa berkonsultasi dengan dokter. Ketidakpatuhan minum obat adalah penyebab utama stroke berulang.</p>
            </div>

            <h2>Langkah 4: Pola Makan Sehat</h2>
            <p>Ikuti pola makan Mediterania atau DASH diet yang kaya sayuran, buah, ikan, dan biji-bijian utuh. Batasi garam, gula, dan lemak jenuh.</p>

            <h2>Langkah 5: Olahraga Teratur</h2>
            <p>Target: 150 menit aktivitas aerobik intensitas sedang per minggu. Jalan kaki, berenang, atau bersepeda statis.</p>

            <h2>Langkah 6: Berhenti Merokok dan Batasi Alkohol</h2>
            <p>Merokok menggandakan risiko stroke. Berhenti merokok menurunkan risiko hampir ke tingkat normal dalam 5 tahun.</p>

            <h2>Langkah 7: Kontrol Rutin ke Dokter</h2>
            <ul>
                <li>Pemeriksaan berkala: tekanan darah, kolesterol, gula darah</li>
                <li>Evaluasi fungsi jantung jika ada fibrilasi atrium</li>
                <li>Monitoring efek samping obat</li>
                <li>Evaluasi progress rehabilitasi</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-down-arrow"></i> Bukti:</strong></p>
                <p>Dengan menerapkan ketujuh langkah di atas secara konsisten, risiko stroke berulang dapat diturunkan hingga 80%.</p>
            </div>
        `
    },
    {
        id: 'gaya-hidup-sehat',
        category: 'pencegahan',
        categoryLabel: 'Pencegahan',
        icon: 'bi-heart',
        title: 'Gaya Hidup Sehat untuk Kesehatan Otak',
        summary: 'Kebiasaan sehari-hari yang melindungi otak dan menurunkan risiko penyakit neurovaskular.',
        readTime: 6,
        content: `
            <h2>Otak yang Sehat, Hidup yang Berkualitas</h2>
            <p>Kesehatan otak dipengaruhi oleh pilihan gaya hidup sehari-hari. Berikut kebiasaan yang terbukti melindungi otak:</p>

            <h2>1. Tidur yang Berkualitas</h2>
            <p>Tidur 7-9 jam per malam memungkinkan otak membersihkan protein toksik dan mengkonsolidasi memori. Tips:</p>
            <ul>
                <li>Jaga jadwal tidur yang konsisten</li>
                <li>Hindari layar gadget 1 jam sebelum tidur</li>
                <li>Buat kamar tidur sejuk, gelap, dan tenang</li>
                <li>Hindari kafein setelah jam 2 siang</li>
            </ul>

            <h2>2. Stimulasi Kognitif</h2>
            <p>Otak yang aktif membangun "cadangan kognitif" yang melindungi dari kerusakan:</p>
            <ul>
                <li>Baca buku atau koran secara rutin</li>
                <li>Main teka-teki silang, sudoku, atau permainan strategi</li>
                <li>Pelajari hal baru (bahasa, alat musik, kerajinan)</li>
                <li>Pertahankan interaksi sosial aktif</li>
            </ul>

            <h2>3. Kelola Stres</h2>
            <p>Stres kronis meningkatkan tekanan darah dan peradangan, dua faktor risiko stroke:</p>
            <ul>
                <li>Praktikkan teknik relaksasi harian (10-15 menit)</li>
                <li>Luangkan waktu untuk hobi dan aktivitas menyenangkan</li>
                <li>Jaga keseimbangan kerja dan istirahat</li>
                <li>Jangan ragu meminta bantuan profesional jika diperlukan</li>
            </ul>

            <h2>4. Jaga Berat Badan Ideal</h2>
            <p>Indeks Massa Tubuh (BMI) ideal: 18.5-24.9. Kelebihan berat badan meningkatkan risiko hipertensi, diabetes, dan kolesterol tinggi.</p>

            <h2>5. Hidrasi Cukup</h2>
            <p>Dehidrasi dapat mempertebal darah dan meningkatkan risiko bekuan. Minum minimal 8 gelas air per hari, lebih banyak saat cuaca panas atau berolahraga.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-lightbulb"></i> Life's Essential 8 (American Heart Association):</strong></p>
                <p>Delapan metrik kesehatan kardiovaskular: pola makan, aktivitas fisik, paparan nikotin, tidur, BMI, kolesterol, gula darah, dan tekanan darah. Mengoptimalkan kedelapannya menurunkan risiko penyakit jantung dan stroke secara dramatis.</p>
            </div>
        `
    },
    {
        id: 'teknologi-wearable-stroke',
        category: 'rehabilitasi',
        categoryLabel: 'Rehabilitasi',
        icon: 'bi-smartwatch',
        title: 'Teknologi Wearable untuk Monitoring Rehabilitasi Stroke',
        summary: 'Bagaimana perangkat wearable dan sensor EMG merevolusi pemantauan rehabilitasi stroke.',
        readTime: 7,
        content: `
            <h2>Era Baru Rehabilitasi Stroke</h2>
            <p>Teknologi wearable telah membuka babak baru dalam rehabilitasi stroke. Perangkat yang dapat dipakai memungkinkan pemantauan kontinu, data objektif, dan feedback real-time yang sebelumnya hanya tersedia di rumah sakit.</p>

            <h2>Jenis Sensor dalam Rehabilitasi</h2>
            <h3>1. Sensor EMG (Electromyography)</h3>
            <p>Mengukur aktivitas listrik otot. Memberikan informasi tentang:</p>
            <ul>
                <li>Tingkat kontraksi otot</li>
                <li>Pola aktivasi otot</li>
                <li>Kelelahan otot</li>
                <li>Kemajuan kekuatan otot dari waktu ke waktu</li>
            </ul>

            <h3>2. Sensor IMU (Inertial Measurement Unit)</h3>
            <p>Mengukur gerakan dan orientasi lengan. Terdiri dari:</p>
            <ul>
                <li><strong>Accelerometer:</strong> Mengukur percepatan dan gerakan linear</li>
                <li><strong>Gyroscope:</strong> Mengukur rotasi dan orientasi</li>
            </ul>

            <h2>Keunggulan Monitoring Wearable</h2>
            <ul>
                <li><strong>Data Objektif:</strong> Mengukur progress secara numerik, bukan subjektif</li>
                <li><strong>Monitoring Kontinu:</strong> Memantau selama latihan di rumah, bukan hanya saat kunjungan klinik</li>
                <li><strong>Feedback Real-time:</strong> Pasien dan dokter dapat melihat aktivitas otot secara langsung</li>
                <li><strong>Deteksi Dini:</strong> Mendeteksi kelelahan dan overexertion sebelum cedera</li>
                <li><strong>Telemedicine:</strong> Dokter dapat memantau pasien dari jarak jauh</li>
                <li><strong>Motivasi:</strong> Visualisasi data meningkatkan kepatuhan latihan</li>
            </ul>

            <h2>Myosig: Smart Wearable untuk Rehabilitasi Stroke</h2>
            <p>Myosig adalah contoh perangkat wearable yang dirancang khusus untuk rehabilitasi stroke, dilengkapi dengan:</p>
            <ul>
                <li>Sensor EMG untuk pemantauan aktivitas otot lengan</li>
                <li>Sensor MPU (accelerometer + gyroscope) untuk deteksi gerakan</li>
                <li>Dashboard real-time untuk dokter</li>
                <li>AI-powered recommendations</li>
                <li>Analisis zona aktivitas EMG</li>
                <li>Monitoring kelelahan otot</li>
                <li>Tracking progress rehabilitasi</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-up-arrow"></i> Masa Depan:</strong></p>
                <p>Penelitian menunjukkan bahwa rehabilitasi berbasis teknologi wearable dapat meningkatkan kepatuhan latihan hingga 40% dan mempercepat pemulihan motorik. Kombinasi sensor, AI, dan telemedicine menjadi standar baru rehabilitasi stroke modern.</p>
            </div>
        `
    }
];

// ============================
// APP STATE & LOGIC
// ============================

let currentCategory = 'semua';
let currentSearch = '';

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    // Check auth
    if (typeof firebase !== 'undefined' && typeof initializeFirebase !== 'undefined') {
        initializeFirebase();
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'auth.html';
                return;
            }
            renderArticles();
        });
    } else {
        renderArticles();
    }
});

// Set category filter
function setCategory(cat) {
    currentCategory = cat;

    // Update pill active states
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-cat') === cat);
    });

    renderArticles();
}

// Filter articles based on search and category
function filterArticles() {
    currentSearch = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    renderArticles();
}

// Get filtered articles
function getFilteredArticles() {
    return ENCYCLOPEDIA_ARTICLES.filter(article => {
        const matchCategory = currentCategory === 'semua' || article.category === currentCategory;
        const matchSearch = !currentSearch ||
            article.title.toLowerCase().includes(currentSearch) ||
            article.summary.toLowerCase().includes(currentSearch) ||
            article.categoryLabel.toLowerCase().includes(currentSearch);
        return matchCategory && matchSearch;
    });
}

// Render article cards
function renderArticles() {
    const grid = document.getElementById('articleGrid');
    const countEl = document.getElementById('articleCount');
    if (!grid) return;

    const filtered = getFilteredArticles();

    if (countEl) {
        countEl.textContent = `Menampilkan ${filtered.length} dari ${ENCYCLOPEDIA_ARTICLES.length} artikel`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-search" style="grid-column: 1 / -1;">
                <i class="bi bi-search"></i>
                <p style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem;">Tidak ada artikel ditemukan</p>
                <p style="font-size: 0.9rem;">Coba kata kunci lain atau pilih kategori berbeda</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(article => `
        <div class="article-card" data-cat="${article.category}" onclick="openArticle('${article.id}')">
            <div class="article-meta">
                <div class="article-icon">
                    <i class="bi ${article.icon}"></i>
                </div>
                <div>
                    <span class="article-category-tag">${article.categoryLabel}</span>
                </div>
            </div>
            <div class="article-title">${article.title}</div>
            <div class="article-summary">${article.summary}</div>
            <div class="article-footer">
                <span class="article-read-time">
                    <i class="bi bi-clock"></i> ${article.readTime} menit baca
                </span>
                <span class="article-read-btn">
                    Baca <i class="bi bi-arrow-right"></i>
                </span>
            </div>
        </div>
    `).join('');
}

// Open article detail
function openArticle(articleId) {
    const article = ENCYCLOPEDIA_ARTICLES.find(a => a.id === articleId);
    if (!article) return;

    const overlay = document.getElementById('articleDetail');
    const body = document.getElementById('articleDetailBody');
    const headerTitle = document.getElementById('detailHeaderTitle');

    if (!overlay || !body) return;

    headerTitle.textContent = article.categoryLabel;

    body.innerHTML = `
        <h1>${article.title}</h1>
        <div class="detail-meta">
            <span><i class="bi bi-tag"></i> ${article.categoryLabel}</span>
            <span><i class="bi bi-clock"></i> ${article.readTime} menit baca</span>
        </div>
        <div class="article-content">
            ${article.content}
        </div>
    `;

    overlay.classList.add('active');
    overlay.scrollTop = 0;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close article detail
function closeArticle() {
    const overlay = document.getElementById('articleDetail');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeArticle();
});

// Handle back button for article detail
window.addEventListener('popstate', function() {
    const overlay = document.getElementById('articleDetail');
    if (overlay && overlay.classList.contains('active')) {
        closeArticle();
    }
});
