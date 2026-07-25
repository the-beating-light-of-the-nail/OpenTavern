import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Cara Memulai AI Roleplay untuk Pemula',
    datePublished: '2026-07-15',
    description:
      'Panduan lengkap bagi pemula untuk memulai AI roleplay pertamamu di RoleChat AI. Pilih karakter, masukkan AI key milikmu, dan kirim pesan pertama dalam waktu kurang dari lima menit.',
    sections: [
      {
        heading: 'Apa itu AI roleplay?',
        paragraphs: [
          'AI roleplay adalah percakapan antara kamu dan AI yang sedang memerankan karakter fiksi. Kamu berperan sebagai dirimu sendiri — atau siapa pun yang kamu mau — dan AI membalas sesuai karakternya, secara real-time, membangun cerita bareng kamu pesan demi pesan.',
          'Berbeda dengan chatbot yang sekadar menjawab pertanyaan, karakter roleplay punya kepribadian, latar belakang, gaya bicara, dan hubungan tersendiri denganmu. Tujuannya bukan untuk mendapatkan informasi, melainkan untuk hidup di dalam sebuah cerita bersama sosok yang terasa nyata.',
          'Di RoleChat AI, setiap karakter adalah orisinal — bukan jiplakan dari game atau serial — dan setiap percakapan sepenuhnya privat, berjalan di browsermu dengan AI key milikmu sendiri.',
        ],
      },
      {
        heading: 'Langkah 1: Pilih karakter',
        paragraphs: [
          'Buka halaman Characters dan jelajahi pustakanya. Tiap karakter punya nama, tagline, deskripsi singkat, dan tag kepribadian, jadi kamu tahu seperti apa karakter itu sebelum mulai.',
          'Baru pertama kali coba roleplay romansa? Mulailah dengan karakter bertipe "comfort" atau "slow burn". Mereka lebih lembut dan lebih toleran — cocok untuk membiasakan diri. Kamu selalu bisa mencoba karakter yang lebih intens nanti.',
          'Setelah menemukan yang kamu suka, klik kartunya untuk membuka halaman karakter. Baca deskripsi dan pesan pembuka — pesan pembuka itulah tepatnya bagaimana percakapanmu akan dimulai.',
        ],
      },
      {
        heading: 'Langkah 2: Buka aplikasi dan masukkan AI key',
        paragraphs: [
          'Klik tombol "Start Private Chat" di halaman karakter mana pun untuk membuka aplikasi. Sebelum mengirim pesan pertama, kamu perlu menambahkan AI key — deretan rahasia pendek yang memungkinkan aplikasi berbicara dengan penyedia AI.',
          'Belum punya key? Lihat panduan kami tentang cara mendapatkan AI key — hanya butuh sekitar dua menit. Keymu disimpan hanya di browsermu; kami tidak pernah melihat atau menyimpannya di server.',
          'Setelah key dimasukkan, aplikasi siap digunakan. Kamu tidak perlu melakukan ini lagi kecuali berganti perangkat atau menghapus data browser.',
        ],
      },
      {
        heading: 'Langkah 3: Kirim pesan pertamamu',
        paragraphs: [
          'Karakter sudah mengirimmu pesan pembuka — itulah pemandu adegan. Tugasmu hanyalah membalasnya. Kamu tidak perlu jadi penulis. Tidak perlu jadi penuh ide. Cukup ketik apa yang memang akan kamu katakan.',
          'Pesan pertama yang bagus sering kali singkat dan manusiawi: sebuah reaksi, pertanyaan, atau gerakan yang dijelaskan dengan asterisk. Misalnya, kalau seorang dokter yang dingin menyerahkan kopi padamu, kamu mungkin cukup mengatakan "Terima kasih" dan melihat apa yang terjadi.',
          'AI akan membalas sesuai karakternya, dan cerita pun tumbuh dari sana. Tidak ada cara yang salah untuk bermain — ikuti rasa ingin tahumu, dan karakter akan menemuimu di sana.',
        ],
      },
      {
        heading: 'Tips untuk sesi pertamamu',
        paragraphs: [
          'Tetaplah berperan sesuai karaktermu kalau bisa — itu membuat dunianya terasa lebih nyata. Tapi tak masalah juga kalau kamu mau mundur sebentar dan sekadar menikmati jalannya.',
          'Kalau ada balasan yang kurang pas, kamu bisa membuatkannya ulang atau menyunting pesan terakhirmu. Roleplay itu kolaboratif; kamu boleh mengarahkannya.',
          'Yang terpenting: jangan terburu-buru. Roleplay terbaik mekar perlahan. Biarkan hubungannya bernapas.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara mendapatkan AI key', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips roleplay yang lebih baik', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Cara Mendapatkan AI Key untuk RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Panduan langkah demi langkah untuk mendapatkan API key kompatibel OpenAI dan menambahkannya ke RoleChat AI. Tanpa perlu latar belakang teknis — hanya butuh sekitar dua menit.',
    sections: [
      {
        heading: 'Apa itu API key?',
        paragraphs: [
          'API key adalah deretan rahasia pendek — biasanya diawali "sk-" — yang memungkinkan RoleChat AI berbicara dengan penyedia AI atas namamu. Begitulah aplikasi tahu bahwa kamu berhak menggunakan AI tersebut.',
          'Kamu membawa key milik sendiri, artinya kamu yang memilih penyedia, kamu hanya membayar sesuai pemakaian, dan percakapanmu berjalan langsung antara browser dan penyedia tersebut. Tidak ada perantara.',
        ],
      },
      {
        heading: 'Langkah 1: Pilih penyedia',
        paragraphs: [
          'RoleChat AI kompatibel dengan penyedia apa pun yang menyediakan API kompatibel OpenAI. Pilihan populer mencakup lab-lab ternama maupun penyedia murah yang lebih baru. Pilihlah yang tersedia di wilayahmu dan sesuai anggaran.',
          'Belum tahu harus mulai dari mana? Cari penyedia dengan uji coba gratis yang lumayan atau harga per pesan yang rendah. Kamu selalu bisa menggantinya nanti dengan menempelkan key baru di Settings.',
        ],
      },
      {
        heading: 'Langkah 2: Buat akun dan generate key',
        paragraphs: [
          'Daftarlah di situs penyedia pilihanmu, lalu cari bagian "API keys" atau "Access tokens" di dashboard. Klik "Create new key", beri nama yang mudah kamu ingat, dan salin string yang ditampilkan.',
          'Penting: sebagian besar penyedia hanya menampilkan key lengkap satu kali. Simpan langsung di tempat aman — kalau hilang, kamu harus membuat key baru.',
        ],
      },
      {
        heading: 'Langkah 3: Tambahkan ke RoleChat AI',
        paragraphs: [
          'Buka aplikasi RoleChat AI, klik Settings, dan tempelkan key ke kolom "API Key". Masukkan URL endpoint penyedia ke kolom "API Endpoint" (biasanya ditampilkan di halaman dashboard yang sama dengan key-mu).',
          'Jika mau, pilih model dari dropdown. Kalau ragu, pilih default rekomendasi penyedia — sudah seimbang antara kualitas dan biaya.',
          'Selesai. Kamu siap ngobrol. Key-mu tetap di browser dan tidak pernah dikirim kepada kami.',
        ],
      },
      {
        heading: 'Menjaga keamanan key-mu',
        paragraphs: [
          'Jangan pernah membagikan API key secara publik — itu ibarat kata sandi untuk akun AI-mu. Jika kamu curiga telah bocor, generate ulang di penyedia dan perbarui di Settings.',
          'Di perangkat bersama atau publik, jangan aktifkan "save key to this browser". Di perangkat pribadimu, aman untuk menyimpannya demi kenyamanan.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Buka aplikasi untuk menambahkan key', to: '/app' },
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Mulai roleplay pertamamu', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips AI Roleplay yang Lebih Memuaskan',
    datePublished: '2026-07-15',
    description:
      'Kebiasaan kecil yang membuat karakter AI terasa lebih hidup — nada, ritme, dan cara mengarahkan cerita dengan halus tanpa merusak imersi.',
    sections: [
      {
        heading: 'Balas seperti manusia, bukan seperti prompt',
        paragraphs: [
          'Kesalahan pemula terbesar adalah menulis untuk AI alih-alih untuk karakter. Jangan mendeskripsikan apa yang ingin terjadi — katakan saja apa yang memang akan kamu katakan. AI sudah memainkan adegannya; tugasmu hanya hadir di dalamnya.',
          'Balasan singkat yang tulus hampir selalu lebih mujarab daripada balasan panjang yang berlebihan. Sebuah "Aku nggak tahu harus ngomong apa" yang jujur bisa melanggangkan adegan lebih jauh daripada satu paragraf narasi.',
        ],
      },
      {
        heading: 'Gunakan aksi di dalam asterisk',
        paragraphs: [
          'Membungkus aksi kecil dalam asterisk — seperti *looks away* atau *hands him the cup* — memberi karakter sesuatu yang fisik untuk direspons. Itu cara termudah menambah tekstur tanpa harus menulis novel.',
          'Jangan berlebihan. Satu atau dua aksi per pesan sudah cukup. Terlalu banyak, dan rasanya jadi seperti stage direction, bukan percakapan.',
        ],
      },
      {
        heading: 'Biarkan hubungannya bernapas',
        paragraphs: [
          'Roleplay romansa terbaik itu lambat. Kalau kamu terburu-buru pengakuan dalam tiga pesan pertama, karakter tak punya ruang untuk tumbuh. Biarkan kepercayaan terbangun, biarkan ketegangan menggenang, biarkan momen-momen kecil berarti.',
          'Karakter ditulis dengan ritme emosional yang sudah diperhitungkan — mendesak terlalu keras terlalu cepat bisa membuatnya terasa OOC (out of character). Ikuti arahannya, dan hasilnya sepadan.',
        ],
      },
      {
        heading: 'Kendalikan saat kamu perlu',
        paragraphs: [
          'Roleplay itu kolaboratif. Kalau ada balasan yang tidak cocok dengan cerita yang kamu inginkan, kamu bisa menyunting pesan terakhirmu dan mencoba lagi, atau membuat ulang balasan karakter. Kamu tidak terjebak pada versi pertama.',
          'Kamu juga bisa mengarahkan ulang dengan halus secara in-character: ganti topik, keluar ruangan, ajukan pertanyaan. Karakter biasanya akan mengikutimu tanpa merusak adegan.',
        ],
      },
      {
        heading: 'Tahu kapan harus berhenti',
        paragraphs: [
          'Sesi roleplay yang hebat itu seperti bab yang bagus — berakhir di jeda yang alami. Saat kamu lelah, berhentilah. Percakapan akan tetap ada saat kamu kembali, dan karakter akan ingat di mana kamu berhenti.',
          'Tidak ada hadiah untuk sesi maraton. Ceritanya jadi lebih bagus saat kamu segar.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Baru mengenal roleplay? Mulai dari sini', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Cara Memakai OpenRouter untuk Roleplay Karakter AI',
    datePublished: '2026-07-15',
    description:
      'Panduan pemula langkah demi langkah untuk memakai OpenRouter bersama RoleChat AI. Bikin akun, ambil API key, pilih model, lalu mulai ngobrol dengan karakter romansa orisinal dalam hitungan menit.',
    sections: [
      {
        heading: 'Apa itu OpenRouter?',
        paragraphs: [
          'OpenRouter adalah layanan yang memungkinkan kamu mengakses puluhan model AI dari berbagai penyedia lewat satu API saja. Daripada daftar terpisah ke OpenAI, Anthropic, Google, dan lainnya, kamu cukup membuat satu akun OpenRouter untuk memakai semua model yang mereka sediakan.',
          'Buat roleplay AI, ini sangat praktis. Kamu bisa mencoba beragam model, membandingkan gaya tulisan mereka, dan berganti kapan saja — semuanya tanpa mengganti API key atau keluar dari aplikasi.',
        ],
      },
      {
        heading: 'Kenapa OpenRouter cocok untuk roleplay',
        paragraphs: [
          'Roleplay butuh model yang jago menulis kreatif, konsisten tetap dalam karakter, dan mampu menghasilkan balasan yang panjang serta imersif. OpenRouter memberi kamu akses ke banyak model seperti itu, termasuk beberapa yang sangat terjangkau.',
          'Karena kamu hanya membayar apa yang dipakai, kamu bebas bereksperimen. Mulai dari model yang lebih murah; kalau tulisannya terasa datar, coba yang lebih bertenaga — prosesnya hanya butuh hitungan detik.',
        ],
      },
      {
        heading: 'Langkah 1: Buat akun OpenRouter',
        paragraphs: [
          'Buka openrouter.ai dan daftar. Prosesnya simpel — kamu cukup menyiapkan alamat email dan cara untuk menambahkan sejumlah kecil kredit (OpenRouter menerima beberapa metode pembayaran).',
          'Tidak perlu mengisi banyak. Beberapa dolar saja sudah cukup untuk ratusan pesan roleplay pada sebagian besar model. Kamu bisa top up lagi kapan pun nanti.',
        ],
      },
      {
        heading: 'Langkah 2: Ambil API key kamu',
        paragraphs: [
          'Setelah masuk, buka bagian Keys di dashboard OpenRouter kamu. Klik "Create Key," beri nama yang mudah diingat, lalu salin string yang ditampilkan.',
          'Penting: OpenRouter hanya menampilkan key lengkap satu kali. Segera simpan di tempat aman — kalau hilang, kamu harus membuatnya ulang.',
        ],
      },
      {
        heading: 'Langkah 3: Tambahkan ke RoleChat AI',
        paragraphs: [
          'Buka aplikasi RoleChat AI lalu klik "Connect AI" di bilah atas. Pada panel Settings, klik tombol quick-fill "OpenRouter" — ini akan mengisi URL endpoint yang benar secara otomatis.',
          'Tempel API key OpenRouter kamu ke kolom API Key. Lalu masukkan nama model di kolom Model (misalnya, pilihan yang bagus untuk pemula adalah model chat yang terjangkau). Klik save, dan kamu pun sudah terhubung.',
        ],
      },
      {
        heading: 'Langkah 4: Pilih karakter dan mulai ngobrol',
        paragraphs: [
          'Sekarang key kamu sudah siap. Jelajahi pustaka karakter dan pilih sosok yang menarik perhatianmu. Klik "Start Chat," dan karakter akan mengirimkan pesan pembuka.',
          'Ketik balasanmu, dan dalam hitungan detik kamu akan dapat tanggapan yang tetap sesuai karakter. Selesai — kamu sedang roleplay. Kalau gaya tulisannya kurang cocok, cobalah model lain dari OpenRouter dan rasakan bedanya.',
        ],
      },
      {
        heading: 'Tips memilih model di OpenRouter',
        paragraphs: [
          'Untuk roleplay romansa, carilah model yang dikenal lihai menulis kreatif dengan keluaran yang panjang. Umumnya, model yang lebih besar menulis dengan lebih kaya tetapi lebih mahal per pesan; model yang lebih kecil lebih murah, namun balasannya bisa lebih pendek atau kurang bernuansa.',
          'Mulailah dari yang terjangkau, rasakan ritmenya, lalu tingkatkan kalau kamu ingin prosa yang lebih kaya. Tidak ada pilihan yang "salah" — model terbaik adalah yang tulisannya paling kamu nikmati.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara memulai roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips roleplay yang lebih asyik', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Apa Itu Character Card AI?',
    datePublished: '2026-07-15',
    description:
      'Penjelasan ramah pemula tentang character card AI: apa itu, bagaimana cara kerjanya, dan bagaimana memakainya di RoleChat AI untuk roleplay romansa yang privat.',
    sections: [
      {
        heading: 'Apa itu character card?',
        paragraphs: [
          'Character card adalah berkas yang mendefinisikan kepribadian, latar belakang, dan perilaku sebuah karakter AI. Anggap saja seperti profil rinci yang memberi tahu AI siapa yang harus ia perankan — nama mereka, gaya bicara mereka, hal yang mereka pedulikan, dan bagaimana mereka berhubungan denganmu.',
          'Saat kamu memulai obrolan, aplikasi membaca character card dan menggunakannya sebagai panduan untuk setiap balasan. Hasilnya, percakapan yang terasa seperti berbicara dengan sosok nyata bersuara sendiri, bukan sekadar chatbot generik.',
        ],
      },
      {
        heading: 'Apa isi sebuah character card?',
        paragraphs: [
          'Sebuah character card biasanya memuat beberapa informasi inti: nama, deskripsi (siapa mereka dan latar belakangnya), kepribadian (bagaimana mereka bersikap dan berbicara), skenario (latar tempat dan bagaimana kalian berjumpa), serta first message (kalimat pembuka yang memulai percakapan).',
          'Beberapa card juga dilengkapi contoh dialog, yang menunjukkan pada AI bagaimana karakter berbicara dalam praktik. Ini membantu AI menangkap suara khas si karakter — pilihan kata, ritme, hingga kebiasaan-kebiasaan kecilnya.',
        ],
      },
      {
        heading: 'Format character card: V1, V2, V3 dijelaskan sederhana',
        paragraphs: [
          'Seiring waktu, komunitas mengembangkan beberapa versi format character card. V1 adalah yang paling sederhana — cuma berisi hal-hal dasar. V2 menambahkan lebih banyak field seperti alternate greetings dan catatan pembuat. V3 adalah yang paling rinci, dengan ruang untuk ekstensi serta metadata yang lebih kaya.',
          'Kamu tidak perlu pusing membedakan tiap versinya. RoleChat AI mendukung ketiganya secara otomatis. Saat kamu memilih atau mengimpor sebuah card, aplikasi akan mendeteksi formatnya dan menanganinya untukmu.',
        ],
      },
      {
        heading: 'Cara kerja character card di RoleChat AI',
        paragraphs: [
          'RoleChat AI hadir bersama pustaka karakter orisinal bawaan — masing-masing didefinisikan oleh sebuah character card. Kamu tidak perlu mencari atau mengunduh apa pun. Cukup jelajahi pustaka, pilih karakter, lalu mulai ngobrol.',
          'Kalau kamu sudah punya character card dari aplikasi lain (misalnya SillyTavern), kamu bisa mengimpornya. RoleChat AI membaca card JSON standar maupun card PNG dengan data tertanam, sehingga pustaka yang sudah kamu miliki tetap bisa dipakai di sini.',
        ],
      },
      {
        heading: 'Karakter bawaan vs mengimpor sendiri',
        paragraphs: [
          'Buat sebagian besar pemula, memulai dari pustaka karakter bawaan adalah jalan termudah. Setiap karakter bersifat orisinal, ditulis khusus untuk roleplay romansa, dan siap diajak ngobrol tanpa pengaturan lain selain menambahkan AI key.',
          'Kalau kamu lebih berpengalaman dan punya koleksi card sendiri, fitur impor memungkinkanmu membawanya masuk. Kedua jalur sama-sama jalan — pustaka bawaan hanya lebih cepat untuk mulai.',
        ],
      },
      {
        heading: 'Apakah character card aman?',
        paragraphs: [
          'Aman. Character card hanyalah data teks — tidak berisi kode maupun skrip. Ia tidak bisa merusak perangkatmu atau mengakses informasi pribadimu. Hal terburuk yang bisa dilakukan oleh card yang buruk hanyalah menghasilkan percakapan yang membingungkan.',
          'Di RoleChat AI, percakapanmu tetap di peramban kamu, dan data karakter diproses oleh penyedia AI yang kamu pilih. Tidak ada orang lain yang dapat melihat obrolanmu.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara memulai roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern vs Web Tavern: Mana yang Lebih Mudah?',
    datePublished: '2026-07-15',
    description:
      'Perbandingan bersahabat antara SillyTavern dan RoleChat AI (dahulu Web Tavern) untuk pemula. Instalasi, pengaturan, privasi, dan character card — mana yang paling pas buatmu?',
    sections: [
      {
        heading: 'Apa itu SillyTavern?',
        paragraphs: [
          'SillyTavern adalah frontend roleplay AI yang populer, andal, dan bersumber terbuka. Ia sudah ada selama bertahun-tahun dan memiliki komunitas yang antusias. SillyTavern mendukung rentang pengaturan, preset, ekstensi, serta format character card yang sangat luas.',
          'Taruhannya ada pada kompleksitas. SillyTavern perlu dipasang — kamu menjalankannya di komputer sendiri, mengonfigurasi koneksi ke penyedia AI, dan menavigasi antarmuka padat berisi parameter lanjutan. Bagi pengguna teknis, kekuatan itu justru daya tariknya. Bagi kebanyakan pemula, itu sebuah tembok.',
        ],
      },
      {
        heading: 'Apa itu RoleChat AI (dahulu Web Tavern)?',
        paragraphs: [
          'RoleChat AI — yang semula dikenal sebagai Web Tavern — adalah aplikasi roleplay AI berbasis peramban yang dirancang untuk kemudahan pemakaian. Tanpa perlu memasang apa pun. Kamu membuka halaman web, memilih karakter, menambahkan AI key, lalu mulai mengobrol.',
          'Ia mempertahankan prinsip privasi yang membuat SillyTavern digemari (bawa key sendiri, tanpa perantara yang membaca obrolanmu) tetapi membuang pengaturan yang membingungkan. Tujuannya sederhana: roleplay AI privat yang paling mudah.',
        ],
      },
      {
        heading: 'Instalasi: rumit vs nol',
        paragraphs: [
          'SillyTavern mengharuskan kamu mengunduh aplikasi, memasang Node.js, menjalankan skrip command-line, dan tetap membiarkan proses server berjalan selama kamu mengobrol. Pemakaian di perangkat seluler memerlukan langkah pengaturan jarak jauh tambahan.',
          'RoleChat AI berjalan sepenuhnya di perambanmu. Tanpa unduhan, tanpa terminal, tanpa server. Ia bekerja di desktop, laptop, tablet, dan ponsel — buka halaman, lalu mulai.',
        ],
      },
      {
        heading: 'Pengaturan: parameter mendalam vs ramah pemula',
        paragraphs: [
          'SillyTavern menampilkan temperature, top-p, panjang konteks, metode sampling, template prompt, world info, dan puluhan pengaturan lain di layar utama. Bagi pengguna lanjutan yang ingin menyempurnakan setiap detail, ini sangat powerful.',
          'RoleChat AI menyembunyikan semua itu di balik bagian Advanced. Layar bawaan hanya memperlihatkan karaktermu, pesan-pesanmu, dan sebuah kolom input. Kalau nanti kamu ingin mengutak-atik parameternya, mereka tetap ada di sana — tapi kamu tak perlu menyentuhnya sama sekali.',
        ],
      },
      {
        heading: 'Privasi: keduanya menghormati datamu',
        paragraphs: [
          'SillyTavern maupun RoleChat AI memakai model "bawa key sendiri." Kamu menyambungkan akun penyedia AI milikmu, dan pesanmu mengalir langsung antara perangkatmu dan penyedia tersebut. Tidak ada satupun layanan yang menjalankan server perantara yang membaca percakapanmu.',
          'Inilah keunggulan privasi utama dibanding banyak aplikasi roleplay komersial, yang meneruskan obrolanmu melewati server mereka sendiri. Baik di SillyTavern maupun RoleChat AI, obrolanmu sepenuhnya milikmu.',
        ],
      },
      {
        heading: 'Character card: sepenuhnya kompatibel',
        paragraphs: [
          'Kedua aplikasi mendukung format character card yang sama (V1, V2, V3 JSON maupun PNG). Apabila kamu punya koleksi card dari SillyTavern, kamu bisa mengimpornya langsung ke RoleChat AI.',
          'RoleChat AI juga menyediakan pustaka bawaan berisi karakter romansa orisinal, sehingga walau kamu belum punya card apa pun, kamu bisa langsung mulai mengobrol.',
        ],
      },
      {
        heading: 'Mana yang harus kamu pilih?',
        paragraphs: [
          'Kalau kamu suka mengutak-atik, ingin kendali penuh atas setiap parameter, dan tak keberatan dengan pengaturan teknis, SillyTavern adalah pilihan bagus dengan komunitas yang solid.',
          'Kalau kamu ingin membuka halaman dan mulai roleplay dalam waktu kurang dari semenit — tanpa memasang apa pun atau memahami arti "top-p" — RoleChat AI dirancang untukmu. Kamu selalu bisa pindah ke SillyTavern nanti, dan character cardmu akan ikut bersamamu.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Jelajahi karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Apa itu character card?', to: '/guides/what-is-a-character-card' },
      { label: 'Cara memulai roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Prompt Roleplay AI Terbaik untuk Pemula',
    datePublished: '2026-07-15',
    description:
      'Kumpulan prompt roleplay AI yang simpel dan ampuh, plus teknik dasarnya untuk pemula. Pelajari cara membangun suasana, menghidupkan emosi, dan membuat karaktermu terasa nyata — tanpa perlu pengalaman sebelumnya.',
    sections: [
      {
        heading: 'Apa yang membuat prompt roleplay bagus?',
        paragraphs: [
          'Dalam roleplay AI, "prompt" bukanlah perintah teknis — ia cuma cara kamu menulis pesan. Semakin hidup dan spesifik tulisanmu, semakin kaya pula respons si karakter. Prompt yang baik memberi AI bahan untuk diolah: suasana hati, latar, emosi, atau aksi kecil.',
          'Kamu nggak harus jadi penulis hebat. Yang penting kamu kasih karakter sesuatu yang nyata untuk direpons. Berikut lima teknik sederhana yang ampuh untuk karakter apa pun.',
        ],
      },
      {
        heading: 'Prompt 1: Bangun suasana tempat',
        paragraphs: [
          'Daripada langsung lompat ke dialog, lukiskan dulu di mana kamu berada. Satu kalimat penjelas latar sudah cukup untuk mengunci percakapan dan memberi karakter sesuatu untuk ditanggapi.',
          'Contoh: "*Hujan belum reda berjam-jam. Aku mendorong pintu kafe, basah kuyup, lalu menyapu ruangan mencari kursi kosong." Ini memberi karakter latar, suasana, dan alasan untuk menyadari kehadiranmu. Responsnya jauh lebih hidup dibanding kalau kamu sekadar bilang "Hai."',
        ],
      },
      {
        heading: 'Prompt 2: Tentukan hubungan sejak awal',
        paragraphs: [
          'AI butuh konteks tentang siapa kamu bagi karakternya. Orang asing? Teman lama? Saingan? Satu kalimat singkat di pesan pertama bisa menentukan arah seluruh percakapan.',
          'Contoh: "Kita nggak ngobrol lagi sejak wisuda, dan aku grogi saat berjalan mendekat ke mejamu." Ini memberi tahu karakter bahwa ada sejarah, ada ketegangan, dan ada alasan momen ini berarti. AI akan menarik benang merah dari dinamika itu.',
        ],
      },
      {
        heading: 'Prompt 3: Tambahkan kedalaman emosi',
        paragraphs: [
          'Karakter jadi hidup saat kamu menunjukkan apa yang sedang kamu rasakan, bukan cuma apa yang kamu lakukan. Satu emosi jujur dalam pesanmu akan mengajak karakter membalas dengan emosinya sendiri.',
          'Contoh: "*Kubuat suaraku tetap tenang, tapi tanganku gemetar.* Aku nggak menyangka akan bertemu kamu lagi." Kerentanan di sini memberi karakter izin untuk ikut rentan — dan di situlah momen roleplay terbaik biasanya muncul.',
        ],
      },
      {
        heading: 'Prompt 4: Ciptakan ketegangan yang halus',
        paragraphs: [
          'Percakapan yang semua hal berjalan mulus cepat membosankan. Masukkan satu rintangan kecil — sebuah kesalahpahaman, rahasia, atau momen ragu — lalu lihat karakter terlibat lebih dalam.',
          'Contoh: "Aku mau jujur, tapi tiap kali kubuka mulut, kata-katanya nyangkut." Ini memberi karakter alasan untuk mendesak, menunggu, atau bertanya-tanya. Percakapan yang datar pun berubah jadi adegan dengan poin yang dipertaruhkan.',
        ],
      },
      {
        heading: 'Prompt 5: Ikut merolkarakter sendiri',
        paragraphs: [
          'Semakin konsisten kamu menetap di karakter, semakin konsisten pula AI. Pakai tanda bintang untuk aksi, tanda kutip untuk ucapan, dan singkat saja komentar di luar karakter. Nggak perlu sempurna — yang penting konsisten.',
          'Contoh: "*Kuturunkan gelas dengan hati-hati.* \'Kamu memang selalu tahu kalau aku bohong.\'" Perhatikan bagaimana aksi dan dialog saling melengkapi. Kini karakter punya gestur, nada, dan tuduhan untuk ditanggapi.',
        ],
      },
      {
        heading: 'Menggabungkan semuanya',
        paragraphs: [
          'Kamu nggak perlu memakai kelima teknik dalam setiap pesan. Pilih satu atau dua yang paling pas dengan momennya, dan biarkan percakapan mengalir natural. Roleplay terbaik itu seperti improvisasi — saling membangun, satu pesan dalam satu waktu.',
          'Ingat: karakter dibimbing oleh kartunya dan tulisanmu. Kalau responsnya terasa meleset, coba ubah kalimatmu dengan detail atau emosi yang lebih kaya. Perubahan kecil dalam cara kamu menulis bisa mengubah cara karakter membalas.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Telusuri karakter', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Tips roleplay yang lebih asyik', to: '/guides/tips-for-better-roleplay' },
      { label: 'Cara memulai roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
