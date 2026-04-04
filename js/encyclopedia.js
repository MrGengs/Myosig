// Encyclopedia JavaScript
// Ensiklopedia Stroke - Bilingual (ID/EN) articles about stroke and rehabilitation

// ============================
// DATA ARTIKEL / ARTICLE DATA
// ============================
const ENCYCLOPEDIA_ARTICLES = [
    // ---- DASAR STROKE / STROKE BASICS ----
    {
        id: 'apa-itu-stroke',
        category: 'dasar',
        icon: 'bi-heart-pulse',
        categoryLabel: 'Dasar Stroke',
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
        `,
        en: {
            categoryLabel: 'Stroke Basics',
            title: 'What Is a Stroke? Understanding Brain Attacks',
            summary: 'A complete explanation of stroke, how it occurs, and its impact on the human body.',
            content: `
            <h2>Definition of Stroke</h2>
            <p>A stroke, medically known as a <strong>Cerebrovascular Accident (CVA)</strong>, is a medical emergency that occurs when blood supply to part of the brain is interrupted or severely reduced, depriving brain tissue of oxygen and nutrients. Within minutes, brain cells begin to die.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-exclamation-triangle"></i> Important Fact:</strong></p>
                <p>Every minute of delayed stroke treatment, approximately 1.9 million neurons (nerve cells) die. Rapid treatment is crucial to minimize brain damage.</p>
            </div>

            <h2>Types of Stroke</h2>
            <h3>1. Ischemic Stroke (87% of cases)</h3>
            <p>Occurs when a blood vessel supplying blood to the brain is blocked by a blood clot (thrombus or embolus). This is the most common type of stroke.</p>
            <ul>
                <li><strong>Thrombotic Stroke:</strong> A blood clot forms inside an artery that supplies blood to the brain</li>
                <li><strong>Embolic Stroke:</strong> A blood clot forms elsewhere in the body (usually the heart) and travels to the brain</li>
            </ul>

            <h3>2. Hemorrhagic Stroke (13% of cases)</h3>
            <p>Occurs when a blood vessel in the brain ruptures and causes bleeding. The leaked blood puts pressure on surrounding brain tissue.</p>
            <ul>
                <li><strong>Intracerebral Hemorrhage:</strong> A blood vessel inside the brain bursts</li>
                <li><strong>Subarachnoid Hemorrhage:</strong> A blood vessel on the brain's surface ruptures and blood fills the space between the brain and skull</li>
            </ul>

            <h3>3. Transient Ischemic Attack (TIA)</h3>
            <p>Known as a "mini stroke," TIA is a temporary disruption of blood flow to the brain that lasts briefly (usually less than 5 minutes). TIA is a serious warning that a more severe stroke may occur.</p>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Warning:</strong></p>
                <p>About 1 in 3 people who experience a TIA will have a stroke within one year if left untreated.</p>
            </div>

            <h2>Effects of Stroke on the Body</h2>
            <p>The impact of a stroke depends greatly on the area of the brain affected and the severity of damage:</p>
            <ul>
                <li><strong>Paralysis or weakness</strong> on one side of the body (hemiparesis/hemiplegia)</li>
                <li><strong>Speech and language disorders</strong> (aphasia)</li>
                <li><strong>Vision problems</strong></li>
                <li><strong>Memory and thinking difficulties</strong></li>
                <li><strong>Balance and coordination problems</strong></li>
                <li><strong>Emotional and behavioral changes</strong></li>
                <li><strong>Difficulty swallowing</strong> (dysphagia)</li>
                <li><strong>Pain and numbness</strong></li>
            </ul>

            <h2>Left Brain vs Right Brain</h2>
            <p>Strokes on different sides of the brain cause different symptoms:</p>
            <ul>
                <li><strong>Left brain stroke:</strong> Right-side body paralysis, speech difficulties, slow and cautious behavior</li>
                <li><strong>Right brain stroke:</strong> Left-side body paralysis, vision problems, quick and impulsive behavior, left-side neglect</li>
            </ul>
            `
        }
    },
    {
        id: 'gejala-stroke-fast',
        category: 'dasar',
        icon: 'bi-exclamation-triangle',
        categoryLabel: 'Dasar Stroke',
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
        `,
        en: {
            categoryLabel: 'Stroke Basics',
            title: 'Recognizing Stroke Symptoms: The FAST Method',
            summary: 'A quick and easy way to recognize stroke symptoms using the internationally recognized FAST method.',
            content: `
            <h2>The FAST Method</h2>
            <p>FAST is an acronym that helps recognize stroke symptoms quickly. The faster a stroke is identified and treated, the greater the chance of recovery.</p>

            <div class="info-box success">
                <p><strong>F - Face:</strong> Is one side of the face drooping or numb? Ask the person to smile - is the smile uneven?</p>
            </div>
            <div class="info-box success">
                <p><strong>A - Arms:</strong> Is one arm weak or numb? Ask the person to raise both arms - does one arm drift downward?</p>
            </div>
            <div class="info-box success">
                <p><strong>S - Speech:</strong> Is speech slurred or hard to understand? Ask the person to repeat a simple sentence.</p>
            </div>
            <div class="info-box warning">
                <p><strong>T - Time:</strong> If you see any of these signs, IMMEDIATELY call an ambulance or go to the nearest emergency room! Every minute counts.</p>
            </div>

            <h2>Additional Symptoms to Watch For</h2>
            <ul>
                <li>Sudden severe headache with no known cause</li>
                <li>Sudden vision problems in one or both eyes</li>
                <li>Difficulty walking, dizziness, or loss of balance</li>
                <li>Sudden confusion, difficulty understanding speech</li>
                <li>Sudden numbness or weakness in the face, arm, or leg</li>
            </ul>

            <h2>Golden Period</h2>
            <p>Treatment of ischemic stroke with clot-busting medication (tPA/alteplase) is most effective when given within <strong>3-4.5 hours</strong> of the first symptoms. This period is known as the "golden period" of stroke treatment.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-telephone"></i> Emergency Action:</strong></p>
                <p>Call emergency services (911 in the US, 119 in Indonesia) or go directly to an ER with stroke treatment facilities. Note the time when symptoms first appeared.</p>
            </div>
            `
        }
    },
    {
        id: 'faktor-risiko-stroke',
        category: 'dasar',
        icon: 'bi-clipboard2-pulse',
        categoryLabel: 'Dasar Stroke',
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
        `,
        en: {
            categoryLabel: 'Stroke Basics',
            title: 'Stroke Risk Factors You Must Know',
            summary: 'Learn about the factors that increase stroke risk, both modifiable and non-modifiable.',
            content: `
            <h2>Modifiable Risk Factors</h2>
            <p>The following factors can be controlled through lifestyle changes and medication:</p>

            <h3>1. Hypertension (High Blood Pressure)</h3>
            <p>The most significant risk factor. High blood pressure weakens and damages brain blood vessels, making them prone to rupture or blockage. Ideal blood pressure target: less than 130/80 mmHg.</p>

            <h3>2. Diabetes Mellitus</h3>
            <p>Chronically high blood sugar levels damage blood vessels and increase the risk of blood clot formation. Diabetics have a 2-4 times higher stroke risk.</p>

            <h3>3. Heart Disease</h3>
            <p>Atrial fibrillation (irregular heart rhythm), heart valve disease, and heart failure increase the risk of blood clot formation that can travel to the brain.</p>

            <h3>4. High Cholesterol</h3>
            <p>High LDL cholesterol causes plaque buildup in artery walls (atherosclerosis), narrowing blood flow to the brain.</p>

            <h3>5. Smoking</h3>
            <p>Smoking doubles stroke risk. Nicotine raises blood pressure, and carbon monoxide reduces oxygen levels in the blood. Quitting smoking can significantly reduce stroke risk within 2-5 years.</p>

            <h3>6. Obesity and Physical Inactivity</h3>
            <p>Being overweight increases the risk of hypertension, diabetes, and high cholesterol. Regular physical activity of at least 150 minutes per week can reduce stroke risk by 25-30%.</p>

            <h2>Non-Modifiable Risk Factors</h2>
            <ul>
                <li><strong>Age:</strong> Stroke risk increases after age 55, doubling each decade</li>
                <li><strong>Gender:</strong> Men have higher risk, but women are more likely to die from stroke</li>
                <li><strong>Family History:</strong> Having family members with stroke history increases risk</li>
                <li><strong>Race/Ethnicity:</strong> Southeast Asians have a relatively high stroke prevalence</li>
                <li><strong>Previous Stroke/TIA:</strong> High recurrence risk</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-check-circle"></i> Good News:</strong></p>
                <p>Up to 80% of strokes are preventable! Managing modifiable risk factors through a healthy lifestyle and proper treatment is highly effective in reducing stroke risk.</p>
            </div>
            `
        }
    },

    // ---- REHABILITASI / REHABILITATION ----
    {
        id: 'tahapan-rehabilitasi',
        category: 'rehabilitasi',
        icon: 'bi-bandaid',
        categoryLabel: 'Rehabilitasi',
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
        `,
        en: {
            categoryLabel: 'Rehabilitation',
            title: 'Stages of Stroke Rehabilitation: From Acute to Recovery',
            summary: 'A complete guide to stroke rehabilitation stages from acute phase, sub-acute, to long-term recovery.',
            content: `
            <h2>Why Is Rehabilitation Important?</h2>
            <p>Stroke rehabilitation is a process that helps stroke survivors regain abilities lost due to brain damage. The brain has an extraordinary ability called <strong>neuroplasticity</strong> - the ability to form new neural pathways and reorganize its functions.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-lightbulb"></i> Neuroplasticity:</strong></p>
                <p>The brain can "retrain" healthy areas to take over the functions of damaged areas. This process is facilitated through repetitive and consistent exercises.</p>
            </div>

            <h2>Phase 1: Acute Rehabilitation (0-2 Weeks)</h2>
            <p>Begins immediately after the patient's condition stabilizes in the hospital:</p>
            <ul>
                <li>Preventing complications (pneumonia, DVT, pressure sores)</li>
                <li>Proper bed positioning</li>
                <li>Passive movements by therapists to prevent joint stiffness</li>
                <li>Breathing exercises</li>
                <li>Swallowing ability evaluation (dysphagia)</li>
                <li>Early mobilization when possible</li>
            </ul>

            <h2>Phase 2: Sub-Acute Rehabilitation (2 Weeks - 3 Months)</h2>
            <p>Critical phase where the most significant recovery occurs:</p>
            <ul>
                <li>Active-assisted exercises</li>
                <li>Gradual muscle strengthening exercises</li>
                <li>Balance and coordination training</li>
                <li>Occupational therapy for daily activities</li>
                <li>Speech therapy if speech is impaired</li>
                <li>Beginning walking exercises with aids</li>
            </ul>

            <h2>Phase 3: Chronic Rehabilitation (3-6 Months)</h2>
            <ul>
                <li>Intensification of independent exercises</li>
                <li>Complex functional training</li>
                <li>Reintegration into daily life activities</li>
                <li>Home exercise programs</li>
                <li>Monitoring with wearable devices (such as Myosig)</li>
            </ul>

            <h2>Phase 4: Long-Term Recovery (6+ Months)</h2>
            <ul>
                <li>Ongoing maintenance and improvement exercises</li>
                <li>Adaptation and compensation for permanent deficits</li>
                <li>Psychological and social support</li>
                <li>Recurrent stroke prevention</li>
                <li>Progress monitoring through technology</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-up-arrow"></i> Ongoing Recovery:</strong></p>
                <p>Although the fastest recovery occurs in the first 3-6 months, improvements can continue for years after a stroke. Consistency in exercises is the main key.</p>
            </div>
            `
        }
    },
    {
        id: 'rehabilitasi-lengan',
        category: 'rehabilitasi',
        icon: 'bi-hand-index',
        categoryLabel: 'Rehabilitasi',
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
        `,
        en: {
            categoryLabel: 'Rehabilitation',
            title: 'Post-Stroke Arm Rehabilitation: Techniques and Exercises',
            summary: 'A practical guide to effective arm rehabilitation exercises for post-stroke motor function recovery.',
            content: `
            <h2>Importance of Arm Rehabilitation</h2>
            <p>Arm weakness or paralysis (hemiparesis/hemiplegia) is one of the most common and disruptive effects of stroke on daily activities. About <strong>80% of stroke survivors</strong> experience arm function impairment on the affected side.</p>

            <h2>Basic Exercises (Beginner Level)</h2>
            <h3>1. Passive Range of Motion Exercises</h3>
            <p>Performed when the patient cannot yet move the arm independently:</p>
            <ul>
                <li>Finger flexion and extension</li>
                <li>Wrist rotation</li>
                <li>Elbow flexion and extension</li>
                <li>Shoulder elevation and rotation</li>
            </ul>
            <p>Perform 10-15 repetitions per movement, 2-3 times daily.</p>

            <h3>2. Active-Assisted Exercises</h3>
            <p>Using the healthy hand to assist the weak hand:</p>
            <ul>
                <li>Clasp hands exercise: clasp both hands together, move up and down</li>
                <li>Table slide: slide the hand across the table in various directions</li>
                <li>Towel slide: pull a towel across the table with the healthy hand assisting</li>
            </ul>

            <h2>Intermediate Exercises</h2>
            <h3>3. Grip Strength Training</h3>
            <ul>
                <li>Squeezing a rubber ball or sponge</li>
                <li>Opening and closing fingers repeatedly</li>
                <li>Exercises with therapy putty</li>
            </ul>

            <h3>4. Coordination Exercises</h3>
            <ul>
                <li>Stacking blocks or coins</li>
                <li>Transferring small objects between containers</li>
                <li>Practicing buttoning clothes</li>
                <li>Writing or drawing</li>
            </ul>

            <h2>Advanced Exercises</h2>
            <h3>5. Constraint-Induced Movement Therapy (CIMT)</h3>
            <p>A proven technique where the healthy hand is "restrained" (using a glove or sling) forcing the patient to use the weak hand for daily activities. Performed 2-3 hours per day for 2 weeks.</p>

            <h3>6. Mirror Therapy</h3>
            <p>Uses a mirror to create a visual illusion that the weak arm is moving normally. The brain is "tricked" and this helps stimulate damaged motor neural pathways.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-cpu"></i> Role of Technology:</strong></p>
                <p>Wearable devices like Myosig with EMG sensors can monitor muscle activity in real-time, helping doctors and patients track arm rehabilitation progress objectively.</p>
            </div>

            <h2>Important Tips</h2>
            <ul>
                <li>Start with simple movements, increase gradually</li>
                <li>Consistency is more important than intensity</li>
                <li>Don't push through pain</li>
                <li>Exercise under therapist or doctor supervision</li>
                <li>Monitor progress with EMG sensors for objective feedback</li>
            </ul>
            `
        }
    },
    {
        id: 'emg-rehabilitasi',
        category: 'rehabilitasi',
        icon: 'bi-activity',
        categoryLabel: 'Rehabilitasi',
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
        `,
        en: {
            categoryLabel: 'Rehabilitation',
            title: 'The Role of EMG in Stroke Rehabilitation',
            summary: 'How Electromyography (EMG) technology helps monitor and improve stroke rehabilitation effectiveness.',
            content: `
            <h2>What Is EMG?</h2>
            <p><strong>Electromyography (EMG)</strong> is a technique that measures and records the electrical activity produced by skeletal muscles. When muscles contract, electrical impulses are generated and can be detected by EMG sensors.</p>

            <h2>EMG in Stroke Rehabilitation</h2>
            <p>In stroke patients, EMG provides valuable information about:</p>
            <ul>
                <li><strong>Muscle activation level:</strong> How strongly muscles contract</li>
                <li><strong>Muscle recruitment patterns:</strong> Which muscles are active and in what order</li>
                <li><strong>Muscle fatigue:</strong> When muscles begin to tire during exercise</li>
                <li><strong>Recovery progress:</strong> Improvement in muscle activity over time</li>
            </ul>

            <h2>EMG Activity Zones</h2>
            <p>EMG readings can be categorized into zones that help doctors assess muscle condition:</p>
            <ul>
                <li><strong>Rest Zone (0-10%):</strong> Minimal muscle activity, muscles are relaxed</li>
                <li><strong>Light Zone (10-25%):</strong> Light contraction, suitable for early rehabilitation</li>
                <li><strong>Moderate Zone (25-50%):</strong> Moderate contraction, target for daily exercises</li>
                <li><strong>High Zone (50-75%):</strong> Strong contraction, for intensive training</li>
                <li><strong>Maximum Zone (75-100%):</strong> Maximum contraction, must be closely monitored</li>
            </ul>

            <h2>EMG Biofeedback</h2>
            <p>EMG biofeedback is a technique where muscle activity data is displayed in real-time to the patient, allowing them to:</p>
            <ul>
                <li>See directly when their muscles contract</li>
                <li>Learn to consciously control muscle contractions</li>
                <li>Motivate themselves by seeing progress visually</li>
                <li>Optimize movement patterns</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-check-circle"></i> Scientific Evidence:</strong></p>
                <p>Research shows that EMG biofeedback improves upper limb motor recovery by 20-30% compared to conventional rehabilitation alone (Cochrane Review, 2023).</p>
            </div>

            <h2>Fatigue Monitoring with EMG</h2>
            <p>One of EMG's advantages is the ability to detect muscle fatigue before patients feel it subjectively. Signs of fatigue on EMG:</p>
            <ul>
                <li>Gradual decrease in signal amplitude</li>
                <li>Increased signal variability</li>
                <li>Median frequency shift</li>
            </ul>
            <p>Early fatigue detection prevents overexertion that can slow recovery.</p>
            `
        }
    },

    // ---- NUTRISI / NUTRITION ----
    {
        id: 'nutrisi-pasca-stroke',
        category: 'nutrisi',
        icon: 'bi-cup-hot',
        categoryLabel: 'Nutrisi',
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
        `,
        en: {
            categoryLabel: 'Nutrition',
            title: 'Nutrition Guide for Stroke Recovery',
            summary: 'Foods and dietary patterns that support brain recovery and prevent recurrent stroke.',
            content: `
            <h2>Nutrition and Brain Recovery</h2>
            <p>Proper nutrition plays a crucial role in post-stroke recovery. The brain needs specific nutrients to repair damaged tissue, form new neural connections, and reduce inflammation.</p>

            <h2>Recommended Dietary Patterns</h2>
            <h3>Mediterranean Diet</h3>
            <p>The dietary pattern with the most scientific evidence supporting brain and heart health:</p>
            <ul>
                <li>Vegetables and fruits (5+ servings per day)</li>
                <li>Fatty fish (salmon, tuna, sardines) - 2-3 times per week</li>
                <li>Whole grains (brown rice, whole wheat)</li>
                <li>Nuts and seeds</li>
                <li>Olive oil as the primary fat source</li>
                <li>Limit red meat and processed foods</li>
            </ul>

            <h2>Essential Nutrients for Recovery</h2>
            <h3>1. Omega-3 (DHA and EPA)</h3>
            <p>Essential fatty acids for nerve cell membrane repair. Sources: fatty fish, chia seeds, walnuts.</p>

            <h3>2. Antioxidants</h3>
            <p>Combat oxidative damage to brain cells. Sources: berries, dark leafy greens, dark chocolate, green tea.</p>

            <h3>3. B-Complex Vitamins</h3>
            <p>Important for nerve function and lowering homocysteine levels (a stroke risk factor). Sources: eggs, fish, green vegetables, legumes.</p>

            <h3>4. Vitamin D</h3>
            <p>Supports nerve recovery and muscle function. Sources: sunlight exposure, fatty fish, fortified milk.</p>

            <h3>5. Magnesium</h3>
            <p>Helps with muscle relaxation and nerve function. Sources: nuts, seeds, green vegetables, bananas.</p>

            <h2>Foods to Limit</h2>
            <ul>
                <li><strong>Salt:</strong> Limit to less than 5 grams per day to control blood pressure</li>
                <li><strong>Sugar:</strong> Reduce added sugars to control blood glucose</li>
                <li><strong>Saturated and trans fats:</strong> Avoid fried foods, fast food, margarine</li>
                <li><strong>Alcohol:</strong> Limit or avoid entirely</li>
                <li><strong>Processed foods:</strong> High in salt, sugar, and preservatives</li>
            </ul>

            <div class="info-box">
                <p><strong><i class="bi bi-droplet"></i> Hydration:</strong></p>
                <p>Drink at least 8 glasses of water per day. Dehydration can thicken blood and increase the risk of clot formation. If the patient has difficulty swallowing, consult a nutritionist about safe fluid consistency.</p>
            </div>
            `
        }
    },

    // ---- OLAHRAGA / EXERCISE ----
    {
        id: 'olahraga-pasca-stroke',
        category: 'olahraga',
        icon: 'bi-bicycle',
        categoryLabel: 'Olahraga',
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
        `,
        en: {
            categoryLabel: 'Exercise',
            title: 'Safe Post-Stroke Exercise Guide',
            summary: 'Types of safe and beneficial exercises for post-stroke patients along with guidelines.',
            content: `
            <h2>Benefits of Post-Stroke Exercise</h2>
            <p>Regular post-stroke exercise offers many benefits:</p>
            <ul>
                <li>Increases muscle strength and endurance</li>
                <li>Improves balance and coordination</li>
                <li>Reduces recurrent stroke risk by up to 25%</li>
                <li>Reduces depression and anxiety</li>
                <li>Improves overall quality of life</li>
                <li>Supports brain neuroplasticity</li>
            </ul>

            <h2>Recommended Types of Exercise</h2>
            <h3>1. Aerobic Exercise</h3>
            <p>Target: 150 minutes per week, moderate intensity</p>
            <ul>
                <li><strong>Walking:</strong> Start with 5-10 minutes, gradually increase</li>
                <li><strong>Stationary cycling:</strong> Safe for balance</li>
                <li><strong>Swimming/aquatic therapy:</strong> Water reduces joint stress</li>
                <li><strong>Seated exercises:</strong> For those who cannot stand for long</li>
            </ul>

            <h3>2. Strength Training</h3>
            <p>2-3 times per week, use light weights or elastic bands:</p>
            <ul>
                <li>Light weight lifting (0.5-2 kg)</li>
                <li>Resistance band exercises</li>
                <li>Movements against gravity (arm/leg raises)</li>
                <li>Wall push-ups</li>
            </ul>

            <h3>3. Balance Training</h3>
            <ul>
                <li>Single-leg standing (with support)</li>
                <li>Heel-to-toe walking</li>
                <li>Sit-to-stand exercise</li>
                <li>Tai Chi (highly recommended)</li>
            </ul>

            <h3>4. Flexibility Training</h3>
            <ul>
                <li>Static stretching: hold 15-30 seconds per muscle</li>
                <li>Range of motion exercises</li>
                <li>Modified yoga</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Signs to Stop:</strong></p>
                <p>Stop exercising immediately if you experience: chest pain, excessive shortness of breath, dizziness or nausea, new sudden weakness, very rapid or irregular heartbeat.</p>
            </div>

            <h2>General Guidelines</h2>
            <ul>
                <li>Always consult a doctor before starting an exercise program</li>
                <li>Start slowly and increase gradually (10% rule)</li>
                <li>Warm up and cool down every session</li>
                <li>Do not exercise when blood pressure is very high (&gt;180/110 mmHg)</li>
                <li>Monitor muscle activity with EMG sensors for objective feedback</li>
                <li>Consistent training is better than occasional intense sessions</li>
            </ul>
            `
        }
    },
    {
        id: 'latihan-tangan-rumah',
        category: 'olahraga',
        icon: 'bi-hand-thumbs-up',
        categoryLabel: 'Olahraga',
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
        `,
        en: {
            categoryLabel: 'Exercise',
            title: '10 Home Hand Exercises for Stroke Patients',
            summary: 'Simple exercises you can do at home to strengthen hand function after stroke.',
            content: `
            <h2>Preparation Before Exercising</h2>
            <ul>
                <li>Ensure a comfortable and stable sitting position</li>
                <li>Use a sturdy table with a smooth surface</li>
                <li>Prepare aids: small ball, coins, clothespins, towel</li>
                <li>Exercise after eating and drinking adequately</li>
            </ul>

            <h2>Exercise 1: Open-Close Hand</h2>
            <p>Open your hand as wide as possible, hold for 5 seconds, then make a fist. Repeat 10-15 times. A basic exercise to build grip strength.</p>

            <h2>Exercise 2: Ball Squeeze</h2>
            <p>Grip a small rubber ball or sponge, squeeze for 5 seconds, release. Repeat 10-15 times. Increase ball firmness as you progress.</p>

            <h2>Exercise 3: Finger Walking on Table</h2>
            <p>Place your hand on the table, "walk" your fingers forward as far as possible, then return. Repeat 10 times. Trains finger coordination.</p>

            <h2>Exercise 4: Pinch Exercise</h2>
            <p>Pinch small objects (coins, buttons) between your thumb and each finger alternately. Hold 5 seconds per finger. Trains fine motor skills.</p>

            <h2>Exercise 5: Towel Roll</h2>
            <p>Place a small towel on the table. Roll it up with your weak hand, then unroll it. Repeat 10 times.</p>

            <h2>Exercise 6: Wrist Rotation</h2>
            <p>Rotate your wrist clockwise 10 times, then counterclockwise 10 times. Use your healthy hand to assist if needed.</p>

            <h2>Exercise 7: Clothespin Exercise</h2>
            <p>Open and close clothespins using your weak hand. Target: 10 clothespins. A functional pinch strength exercise.</p>

            <h2>Exercise 8: Rubber Band Stretch</h2>
            <p>Place a rubber band around all fingertips, then spread your fingers against the resistance. Hold 5 seconds, repeat 10 times.</p>

            <h2>Exercise 9: Writing or Drawing</h2>
            <p>Start by drawing straight lines, circles, then letters. Perfection is not needed - consistency is what matters.</p>

            <h2>Exercise 10: Stacking Objects</h2>
            <p>Stack coins, cards, or small blocks. A fun hand-eye coordination exercise. Increase quantity and speed over time.</p>

            <div class="info-box success">
                <p><strong><i class="bi bi-calendar-check"></i> Suggested Schedule:</strong></p>
                <p>Exercise 2-3 times daily, 15-20 minutes each session. Consistency is more important than duration. Record your daily progress.</p>
            </div>
            `
        }
    },

    // ---- MENTAL / MENTAL HEALTH ----
    {
        id: 'depresi-pasca-stroke',
        category: 'mental',
        icon: 'bi-emoji-smile',
        categoryLabel: 'Kesehatan Mental',
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
        `,
        en: {
            categoryLabel: 'Mental Health',
            title: 'Coping with Post-Stroke Depression',
            summary: 'Recognize and manage post-stroke depression, which affects approximately 30-50% of stroke survivors.',
            content: `
            <h2>Post-Stroke Depression: More Than Just Feeling Sad</h2>
            <p><strong>Post-Stroke Depression (PSD)</strong> is a serious medical condition affecting approximately 30-50% of stroke survivors. It is not a character weakness or lack of motivation - rather it results from biochemical changes in the brain and the emotional impact of physical limitations.</p>

            <h2>Causes of Post-Stroke Depression</h2>
            <ul>
                <li><strong>Biological Factors:</strong> Damage to brain areas that regulate emotions, changes in neurotransmitters (serotonin, norepinephrine)</li>
                <li><strong>Psychological Factors:</strong> Loss of independence, role changes, fear of recurrent stroke</li>
                <li><strong>Social Factors:</strong> Social isolation, relationship changes, financial pressure</li>
            </ul>

            <h2>Symptoms to Watch For</h2>
            <ul>
                <li>Persistent feelings of sadness, emptiness, or hopelessness</li>
                <li>Loss of interest in previously enjoyed activities</li>
                <li>Sleep disturbances (too much or too little)</li>
                <li>Changes in appetite</li>
                <li>Fatigue and loss of energy</li>
                <li>Difficulty concentrating</li>
                <li>Feelings of worthlessness or guilt</li>
                <li>Refusing to participate in rehabilitation</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Important:</strong></p>
                <p>Untreated post-stroke depression can significantly hinder recovery, increase the risk of recurrent stroke, and reduce quality of life. Don't hesitate to seek professional help.</p>
            </div>

            <h2>Treatment Strategies</h2>
            <h3>1. Medical Treatment</h3>
            <p>Doctors may prescribe antidepressants (SSRIs like sertraline or fluoxetine) that have been proven safe and effective for PSD.</p>

            <h3>2. Psychotherapy</h3>
            <p>Cognitive Behavioral Therapy (CBT) helps change negative thought patterns and develop effective coping strategies.</p>

            <h3>3. Social Support</h3>
            <ul>
                <li>Join a stroke support group</li>
                <li>Maintain communication with family and friends</li>
                <li>Share experiences with fellow stroke survivors</li>
            </ul>

            <h3>4. Physical Activity</h3>
            <p>Regular exercise releases endorphins that naturally improve mood. Even light exercises like walking can help.</p>

            <h3>5. Mindfulness and Relaxation</h3>
            <ul>
                <li>Deep breathing exercises</li>
                <li>Guided meditation (available in apps)</li>
                <li>Progressive muscle relaxation</li>
            </ul>
            `
        }
    },
    {
        id: 'motivasi-rehabilitasi',
        category: 'mental',
        icon: 'bi-star',
        categoryLabel: 'Kesehatan Mental',
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
        `,
        en: {
            categoryLabel: 'Mental Health',
            title: 'Staying Motivated During Rehabilitation',
            summary: 'Tips and strategies to stay motivated through the long stroke rehabilitation process.',
            content: `
            <h2>Why Does Motivation Often Decline?</h2>
            <p>Stroke rehabilitation is a long, challenging journey. Motivation often declines because of:</p>
            <ul>
                <li>Progress that feels slow</li>
                <li>Frustration with limitations</li>
                <li>Monotonous exercise routines</li>
                <li>Physical and mental fatigue</li>
                <li>Comparing yourself to your pre-stroke condition</li>
            </ul>

            <h2>Strategies for Staying Motivated</h2>
            <h3>1. Set Realistic Goals</h3>
            <p>Create small, achievable targets. For example: "This week I will grip a ball for 10 seconds" instead of "I must be able to write normally."</p>

            <h3>2. Track and Celebrate Progress</h3>
            <p>Use apps like Myosig to monitor objective progress. Every improvement, no matter how small, deserves celebration.</p>

            <h3>3. Vary Your Exercises</h3>
            <p>Don't stick to the same exercises. Variety makes training more interesting and works muscles from different angles.</p>

            <h3>4. Involve Loved Ones</h3>
            <p>Invite family or friends to join your exercises. Social support greatly influences motivation.</p>

            <h3>5. Focus on the Process, Not the Outcome</h3>
            <p>Be proud that you exercised today, regardless of the results. Every session stimulates neuroplasticity.</p>

            <h3>6. Make Your Routine Enjoyable</h3>
            <p>Listen to your favorite music during exercises, practice in a pleasant place, or make exercises a family activity.</p>

            <div class="info-box success">
                <p><strong><i class="bi bi-quote"></i> Reminder:</strong></p>
                <p>"Stroke recovery is not a sprint, it's a marathon. What matters is not how fast, but how consistently you keep moving forward."</p>
            </div>
            `
        }
    },

    // ---- PENCEGAHAN / PREVENTION ----
    {
        id: 'pencegahan-stroke-berulang',
        category: 'pencegahan',
        icon: 'bi-shield-check',
        categoryLabel: 'Pencegahan',
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
        `,
        en: {
            categoryLabel: 'Prevention',
            title: 'Preventing Recurrent Stroke: 7 Important Steps',
            summary: 'Comprehensive strategies to reduce recurrent stroke risk, which occurs in 25% of stroke survivors.',
            content: `
            <h2>Recurrent Stroke Risk</h2>
            <p>People who have had a stroke have a 25-35% risk of having a second stroke within 5 years. Recurrent strokes are often more severe and potentially fatal. However, with proper preventive measures, this risk can be significantly reduced.</p>

            <h2>Step 1: Control Blood Pressure</h2>
            <p>Hypertension is the number one risk factor. Target: less than 130/80 mmHg.</p>
            <ul>
                <li>Take antihypertensive medications as prescribed - don't stop without consulting your doctor</li>
                <li>Reduce salt intake (&lt;5 grams/day)</li>
                <li>Check blood pressure regularly (at least once a week)</li>
            </ul>

            <h2>Step 2: Manage Diabetes</h2>
            <ul>
                <li>Strictly control blood sugar (HbA1c &lt;7%)</li>
                <li>Low sugar and refined carbohydrate diet</li>
                <li>Regular exercise helps insulin sensitivity</li>
            </ul>

            <h2>Step 3: Anticoagulant/Antiplatelet Therapy</h2>
            <p>Your doctor may prescribe blood thinners to prevent clot formation:</p>
            <ul>
                <li>Low-dose aspirin</li>
                <li>Clopidogrel</li>
                <li>Warfarin or newer anticoagulants (for atrial fibrillation)</li>
            </ul>

            <div class="info-box warning">
                <p><strong><i class="bi bi-exclamation-diamond"></i> Important:</strong></p>
                <p>NEVER stop or change medication dosage without consulting your doctor. Non-adherence to medication is a leading cause of recurrent stroke.</p>
            </div>

            <h2>Step 4: Healthy Eating</h2>
            <p>Follow a Mediterranean or DASH diet rich in vegetables, fruits, fish, and whole grains. Limit salt, sugar, and saturated fats.</p>

            <h2>Step 5: Regular Exercise</h2>
            <p>Target: 150 minutes of moderate-intensity aerobic activity per week. Walking, swimming, or stationary cycling.</p>

            <h2>Step 6: Quit Smoking and Limit Alcohol</h2>
            <p>Smoking doubles stroke risk. Quitting smoking reduces risk to near-normal levels within 5 years.</p>

            <h2>Step 7: Regular Medical Check-ups</h2>
            <ul>
                <li>Regular tests: blood pressure, cholesterol, blood sugar</li>
                <li>Heart function evaluation if atrial fibrillation is present</li>
                <li>Medication side effect monitoring</li>
                <li>Rehabilitation progress evaluation</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-down-arrow"></i> Evidence:</strong></p>
                <p>By consistently applying all seven steps above, the risk of recurrent stroke can be reduced by up to 80%.</p>
            </div>
            `
        }
    },
    {
        id: 'gaya-hidup-sehat',
        category: 'pencegahan',
        icon: 'bi-heart',
        categoryLabel: 'Pencegahan',
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
        `,
        en: {
            categoryLabel: 'Prevention',
            title: 'Healthy Lifestyle for Brain Health',
            summary: 'Daily habits that protect the brain and reduce the risk of neurovascular disease.',
            content: `
            <h2>A Healthy Brain, A Quality Life</h2>
            <p>Brain health is influenced by daily lifestyle choices. Here are habits proven to protect the brain:</p>

            <h2>1. Quality Sleep</h2>
            <p>Sleeping 7-9 hours per night allows the brain to clear toxic proteins and consolidate memories. Tips:</p>
            <ul>
                <li>Maintain a consistent sleep schedule</li>
                <li>Avoid screens 1 hour before bed</li>
                <li>Keep the bedroom cool, dark, and quiet</li>
                <li>Avoid caffeine after 2 PM</li>
            </ul>

            <h2>2. Cognitive Stimulation</h2>
            <p>An active brain builds "cognitive reserve" that protects against damage:</p>
            <ul>
                <li>Read books or newspapers regularly</li>
                <li>Play crosswords, sudoku, or strategy games</li>
                <li>Learn new things (languages, musical instruments, crafts)</li>
                <li>Maintain active social interactions</li>
            </ul>

            <h2>3. Manage Stress</h2>
            <p>Chronic stress increases blood pressure and inflammation, two stroke risk factors:</p>
            <ul>
                <li>Practice daily relaxation techniques (10-15 minutes)</li>
                <li>Make time for hobbies and enjoyable activities</li>
                <li>Maintain work-life balance</li>
                <li>Don't hesitate to seek professional help if needed</li>
            </ul>

            <h2>4. Maintain Ideal Body Weight</h2>
            <p>Ideal Body Mass Index (BMI): 18.5-24.9. Being overweight increases the risk of hypertension, diabetes, and high cholesterol.</p>

            <h2>5. Stay Hydrated</h2>
            <p>Dehydration can thicken blood and increase clot risk. Drink at least 8 glasses of water daily, more in hot weather or when exercising.</p>

            <div class="info-box">
                <p><strong><i class="bi bi-lightbulb"></i> Life's Essential 8 (American Heart Association):</strong></p>
                <p>Eight cardiovascular health metrics: diet, physical activity, nicotine exposure, sleep, BMI, cholesterol, blood sugar, and blood pressure. Optimizing all eight dramatically reduces the risk of heart disease and stroke.</p>
            </div>
            `
        }
    },
    {
        id: 'teknologi-wearable-stroke',
        category: 'rehabilitasi',
        icon: 'bi-smartwatch',
        categoryLabel: 'Rehabilitasi',
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
        `,
        en: {
            categoryLabel: 'Rehabilitation',
            title: 'Wearable Technology for Stroke Rehabilitation Monitoring',
            summary: 'How wearable devices and EMG sensors are revolutionizing stroke rehabilitation monitoring.',
            content: `
            <h2>A New Era of Stroke Rehabilitation</h2>
            <p>Wearable technology has opened a new chapter in stroke rehabilitation. Wearable devices enable continuous monitoring, objective data, and real-time feedback that were previously only available in hospitals.</p>

            <h2>Types of Sensors in Rehabilitation</h2>
            <h3>1. EMG Sensors (Electromyography)</h3>
            <p>Measure muscle electrical activity. Provide information about:</p>
            <ul>
                <li>Muscle contraction levels</li>
                <li>Muscle activation patterns</li>
                <li>Muscle fatigue</li>
                <li>Muscle strength progress over time</li>
            </ul>

            <h3>2. IMU Sensors (Inertial Measurement Unit)</h3>
            <p>Measure arm movement and orientation. Consist of:</p>
            <ul>
                <li><strong>Accelerometer:</strong> Measures acceleration and linear movement</li>
                <li><strong>Gyroscope:</strong> Measures rotation and orientation</li>
            </ul>

            <h2>Advantages of Wearable Monitoring</h2>
            <ul>
                <li><strong>Objective Data:</strong> Measures progress numerically, not subjectively</li>
                <li><strong>Continuous Monitoring:</strong> Monitors during home exercises, not just clinic visits</li>
                <li><strong>Real-time Feedback:</strong> Patients and doctors can see muscle activity directly</li>
                <li><strong>Early Detection:</strong> Detects fatigue and overexertion before injury</li>
                <li><strong>Telemedicine:</strong> Doctors can monitor patients remotely</li>
                <li><strong>Motivation:</strong> Data visualization increases exercise compliance</li>
            </ul>

            <h2>Myosig: Smart Wearable for Stroke Rehabilitation</h2>
            <p>Myosig is a wearable device designed specifically for stroke rehabilitation, equipped with:</p>
            <ul>
                <li>EMG sensors for arm muscle activity monitoring</li>
                <li>MPU sensors (accelerometer + gyroscope) for motion detection</li>
                <li>Real-time dashboard for doctors</li>
                <li>AI-powered recommendations</li>
                <li>EMG activity zone analysis</li>
                <li>Muscle fatigue monitoring</li>
                <li>Rehabilitation progress tracking</li>
            </ul>

            <div class="info-box success">
                <p><strong><i class="bi bi-graph-up-arrow"></i> The Future:</strong></p>
                <p>Research shows that wearable-based rehabilitation can increase exercise compliance by up to 40% and accelerate motor recovery. The combination of sensors, AI, and telemedicine is becoming the new standard for modern stroke rehabilitation.</p>
            </div>
            `
        }
    }
];

// ============================
// LANGUAGE-AWARE HELPERS
// ============================

/**
 * Get a field from an article in the current language.
 * Falls back to Indonesian (the default) if no English translation exists.
 */
function af(article, field) {
    const lang = typeof getLang === 'function' ? getLang() : 'id';
    if (lang === 'en' && article.en && article.en[field]) {
        return article.en[field];
    }
    return article[field];
}

// ============================
// APP STATE & LOGIC
// ============================

let currentCategory = 'semua';
let currentSearch = '';

function getInitialCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const cat = (params.get('cat') || '').toLowerCase().trim();
    const validCategories = ['semua', 'dasar', 'rehabilitasi', 'nutrisi', 'olahraga', 'mental', 'pencegahan'];
    return validCategories.includes(cat) ? cat : 'semua';
}

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    currentCategory = getInitialCategoryFromUrl();

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

    // Re-render articles when language changes
    const origSetLang = window.setLang;
    if (typeof origSetLang === 'function') {
        window.setLang = function(lang) {
            origSetLang(lang);
            renderArticles();
            // Re-render detail view if open
            const overlay = document.getElementById('articleDetail');
            if (overlay && overlay.classList.contains('active')) {
                const bodyEl = document.getElementById('articleDetailBody');
                if (bodyEl) {
                    const articleId = bodyEl.getAttribute('data-current-article');
                    if (articleId) openArticle(articleId);
                }
            }
        };
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
        if (!matchCategory) return false;
        if (!currentSearch) return true;
        // Search both languages for better results
        const searchTitle = (article.title + ' ' + (article.en ? article.en.title : '')).toLowerCase();
        const searchSummary = (article.summary + ' ' + (article.en ? article.en.summary : '')).toLowerCase();
        const searchCat = (article.categoryLabel + ' ' + (article.en ? article.en.categoryLabel : '')).toLowerCase();
        return searchTitle.includes(currentSearch) ||
            searchSummary.includes(currentSearch) ||
            searchCat.includes(currentSearch);
    });
}

// Render article cards
function renderArticles() {
    const grid = document.getElementById('articleGrid');
    const countEl = document.getElementById('articleCount');
    if (!grid) return;

    const lang = typeof getLang === 'function' ? getLang() : 'id';

    // Keep category pill state in sync (including deep-link via URL query).
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-cat') === currentCategory);
    });

    const filtered = getFilteredArticles();

    if (countEl) {
        const countText = lang === 'en'
            ? `Showing ${filtered.length} of ${ENCYCLOPEDIA_ARTICLES.length} articles`
            : `Menampilkan ${filtered.length} dari ${ENCYCLOPEDIA_ARTICLES.length} artikel`;
        countEl.textContent = countText;
    }

    if (filtered.length === 0) {
        const emptyTitle = lang === 'en' ? 'No articles found' : 'Tidak ada artikel ditemukan';
        const emptyDesc = lang === 'en' ? 'Try different keywords or select a different category' : 'Coba kata kunci lain atau pilih kategori berbeda';
        grid.innerHTML = `
            <div class="empty-search" style="grid-column: 1 / -1;">
                <i class="bi bi-search"></i>
                <p style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem;">${emptyTitle}</p>
                <p style="font-size: 0.9rem;">${emptyDesc}</p>
            </div>
        `;
        return;
    }

    const readTimeLabel = lang === 'en' ? 'min read' : 'menit baca';
    const readLabel = lang === 'en' ? 'Read' : 'Baca';

    grid.innerHTML = filtered.map(article => `
        <div class="article-card" data-cat="${article.category}" onclick="openArticle('${article.id}')">
            <div class="article-meta">
                <div class="article-icon">
                    <i class="bi ${article.icon}"></i>
                </div>
                <div>
                    <span class="article-category-tag">${af(article, 'categoryLabel')}</span>
                </div>
            </div>
            <div class="article-title">${af(article, 'title')}</div>
            <div class="article-summary">${af(article, 'summary')}</div>
            <div class="article-footer">
                <span class="article-read-time">
                    <i class="bi bi-clock"></i> ${article.readTime} ${readTimeLabel}
                </span>
                <span class="article-read-btn">
                    ${readLabel} <i class="bi bi-arrow-right"></i>
                </span>
            </div>
        </div>
    `).join('');
}

// Open article detail
function openArticle(articleId) {
    const article = ENCYCLOPEDIA_ARTICLES.find(a => a.id === articleId);
    if (!article) return;

    const lang = typeof getLang === 'function' ? getLang() : 'id';
    const overlay = document.getElementById('articleDetail');
    const body = document.getElementById('articleDetailBody');
    const headerTitle = document.getElementById('detailHeaderTitle');

    if (!overlay || !body) return;

    headerTitle.textContent = af(article, 'categoryLabel');

    const readTimeLabel = lang === 'en' ? 'min read' : 'menit baca';

    body.setAttribute('data-current-article', articleId);
    body.innerHTML = `
        <h1>${af(article, 'title')}</h1>
        <div class="detail-meta">
            <span><i class="bi bi-tag"></i> ${af(article, 'categoryLabel')}</span>
            <span><i class="bi bi-clock"></i> ${article.readTime} ${readTimeLabel}</span>
        </div>
        <div class="article-content">
            ${af(article, 'content')}
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
