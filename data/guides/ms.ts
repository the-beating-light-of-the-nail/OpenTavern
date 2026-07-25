import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Cara Memulakan Roleplay AI untuk Pemula',
    datePublished: '2026-07-15',
    description:
      'Panduan lengkap untuk pemula memulakan roleplay AI pertama anda di RoleChat AI. Pilih watak, masukkan kunci AI anda, dan hantar mesej pertama dalam masa kurang daripada lima minit.',
    sections: [
      {
        heading: 'Apa itu roleplay AI?',
        paragraphs: [
          'Roleplay AI ialah perbualan antara anda dan AI yang melakonkan watak cereka. Anda boleh menjadi diri sendiri — atau sesiapa sahaja yang anda mahu — dan AI membalas dalam watak, secara langsung, membina cerita bersama anda satu mesej pada satu masa.',
          'Tidak seperti chatbot yang sekadar menjawab soalan, watak roleplay mempunyai personaliti, latar belakang, gaya percakapan, serta hubungan dengan anda. Matlamatnya bukan untuk mendapatkan maklumat, tetapi untuk hidup di dalam sesebuah cerita bersama seseorang yang terasa nyata.',
          'Di RoleChat AI, setiap watak adalah hasil karya asli — bukan disalin dari mana-mana permainan atau rancangan — dan setiap perbualan adalah sepenuhnya peribadi, berjalan dalam pelayar anda dengan kunci AI anda sendiri.',
        ],
      },
      {
        heading: 'Langkah 1: Pilih watak',
        paragraphs: [
          'Pergi ke halaman Watak dan layari pustaka. Setiap watak mempunyai nama, tajuk, penerangan ringkas, serta teg personaliti supaya anda tahu apa yang bakal anda hadapi sebelum mula.',
          'Baru dengan roleplay romantis? Mulakan dengan watak "selesa" atau "berkembang perlahan". Mereka lebih lembut dan memaafkan — sesuai untuk anda mencari tapak. Anda sentiasa boleh mencuba watak yang lebih mendalam kemudian.',
          'Sebaik sahaja jumpa yang anda suka, klik kad mereka untuk membuka halaman watak. Baca penerangan dan mesej pembuka — mesej pembuka itu adalah cara persis perbualan anda akan bermula.',
        ],
      },
      {
        heading: 'Langkah 2: Buka aplikasi dan masukkan kunci AI anda',
        paragraphs: [
          'Klik butang "Mula Sembang Peribadi" pada mana-mana halaman watak untuk membuka aplikasi. Sebelum mesej pertama, anda perlu menambah kunci AI — satu rentetan rahsia ringkas yang membolehkan aplikasi berhubung dengan penyedia AI.',
          'Belum ada kunci lagi? Rujuk panduan kami tentang cara mendapatkan kunci AI — ia hanya ambil lebih kurang dua minit. Kunci anda disimpan hanya dalam pelayar anda; kami tidak pernah melihat atau menyimpannya di pelayan.',
          'Sebaik sahaja kunci dimasukkan, aplikasi sedia digunakan. Anda tidak perlu melakukan langkah ini lagi melainkan anda bertukar peranti atau memadam data pelayar.',
        ],
      },
      {
        heading: 'Langkah 3: Hantar mesej pertama anda',
        paragraphs: [
          'Watak itu sebenarnya sudah menghantar mesej pembuka kepada anda — itulah yang membuka babak. Tugas anda hanyalah membalas. Anda tidak perlu menjadi penulis. Anda tidak perlu pandai berkata-kata. Taip sahaja apa yang anda akan katakan sebenarnya.',
          'Mesej pertama yang hebat selalunya pendek dan manusiawi: satu reaksi, satu soalan, satu gerak isyarat yang diperikan dalam tanda bintang. Sebagai contoh, jika seorang doktor yang dingin menghulurkan kopi, anda mungkin cukup membalas "Terima kasih" dan lihat apa yang berlaku.',
          'AI akan membalas dalam watak, dan cerita terbina dari situ. Tiada cara yang salah untuk bermain — ikut rasa ingin tahu anda, dan watak akan menemui anda di situ.',
        ],
      },
      {
        heading: 'Tip untuk sesi pertama anda',
        paragraphs: [
          'Kekal dalam watak anda sendiri jika boleh — ia menjadikan dunia itu lebih nyata. Tetapi tidak mengapa juga untuk undur sedikit dan nikmati sahaja perjalanannya.',
          'Jika sesuatu balasan terasa pelik, anda boleh jana semula atau edit mesej terakhir anda. Roleplay adalah kolaboratif; anda dibenarkan untuk mengarahkannya.',
          'Yang paling utama: jangan tergesa-gesa. Roleplay yang terbaik berkembang perlahan-lahan. Biar hubungan itu bernafas.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Layari watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara mendapatkan kunci AI', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tip untuk roleplay yang lebih baik', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Cara Mendapatkan Kunci AI untuk RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Panduan langkah demi langkah untuk mendapatkan kunci API serasi OpenAI dan menambahkannya ke RoleChat AI. Tiada latar belakang teknikal diperlukan — hanya ambil lebih kurang dua minit.',
    sections: [
      {
        heading: 'Apa itu kunci API?',
        paragraphs: [
          'Kunci API ialah satu rentetan rahsia ringkas — biasanya bermula dengan "sk-" — yang membolehkan RoleChat AI berhubung dengan penyedia AI bagi pihak anda. Itulah cara aplikasi tahu anda dibenarkan menggunakan AI tersebut.',
          'Anda membawa kunci sendiri, bermaksud anda memilih penyedianya, anda hanya membayar untuk apa yang anda gunakan, dan perbualan anda berjalan terus antara pelayar dan penyedia berkenaan. Tiada orang tengah.',
        ],
      },
      {
        heading: 'Langkah 1: Pilih penyedia',
        paragraphs: [
          'RoleChat AI berfungsi dengan mana-mana penyedia yang menawarkan API serasi OpenAI. Pilihan popular termasuk makmal-makmal ternama serta penyedia baharu yang kosnya rendah. Pilih yang tersedia di rantau anda dan sesuai dengan belanjawan.',
          'Tidak pasti nak mula dari mana? Cari penyedia dengan percubaan percuma yang murah hati atau harga sekadar setiap mesej yang rendah. Anda sentiasa boleh bertukar kemudian dengan menampal kunci baharu dalam Tetapan.',
        ],
      },
      {
        heading: 'Langkah 2: Daftar akaun dan jana kunci',
        paragraphs: [
          'Daftar di laman sesawang penyedia pilihan anda, kemudian cari bahagian "Kunci API" atau "Token akses" dalam papan pemuka anda. Klik "Cipta kunci baharu", berikan nama yang mudah diingati, dan salin rentetan yang dipaparkan.',
          'Penting: kebanyakan penyedia hanya memaparkan kunci penuh sekali sahaja. Simpan ia di tempat selamat dengan segera — jika hilang, anda perlu menjananya semula.',
        ],
      },
      {
        heading: 'Langkah 3: Tambahkan ke RoleChat AI',
        paragraphs: [
          'Buka aplikasi RoleChat AI, klik Tetapan, dan tampal kunci anda ke dalam medan "Kunci API". Masukkan URL titik akhir penyedia ke dalam medan "Titik Akhir API" (biasanya dipaparkan pada halaman papan pemuka yang sama dengan kunci anda).',
          'Secara pilihan, pilih model dari menu juntai bawah. Jika tidak pasti, pilih lalai yang disyorkan penyedia — ia seimbang dari segi kualiti dan kos.',
          'Itu sahaja. Anda sedia untuk berbual. Kunci anda kekal dalam pelayar dan tidak pernah dihantar kepada kami.',
        ],
      },
      {
        heading: 'Menjaga keselamatan kunci anda',
        paragraphs: [
          'Jangan sesekali kongsikan kunci API secara umum — ia umpama kata laluan akaun AI anda. Jika anda mengesyaki ia telah terbocor, jana semula di penyedia anda dan kemas kini Tetapan.',
          'Pada peranti kongsi atau awam, jangan aktifkan "simpan kunci dalam pelayar ini". Pada peranti sendiri, selamat untuk menyimpannya demi kemudahan.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Buka aplikasi untuk menambah kunci anda', to: '/app' },
      { label: 'Layari watak', to: '/characters' },
      { label: 'Mulakan roleplay pertama anda', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tip untuk Roleplay AI yang Lebih Baik',
    datePublished: '2026-07-15',
    description:
      'Tabiat kecil yang menjadikan watak AI lebih hidup — nada, rentak, dan cara mengarahkan cerita dengan lembut tanpa menjejaskan keasyikan.',
    sections: [
      {
        heading: 'Balaslah seperti manusia, bukan seperti gesaan',
        paragraphs: [
          'Kesilapan pemula paling besar ialah menulis untuk AI dan bukannya untuk watak itu. Jangan huraikan apa yang anda mahu berlaku — katakan sahaja apa yang anda akan katakan sebenarnya. AI sudah pun melakonkan babak itu; tugas anda hadir di dalamnya.',
          'Balasan yang pendek dan tulus hampir selalu lebih mujarab daripada yang panjang dan berlebihan. Satu "saya tak tahu nak cakap apa" yang jujur boleh menggerakkan babak lebih jauh daripada satu perengkat penceritaan.',
        ],
      },
      {
        heading: 'Gunakan aksi dalam tanda bintang',
        paragraphs: [
          'Membungkus satu tindakan kecil dalam tanda bintang — seperti *looks away* atau *hands him the cup* — memberi watak sesuatu yang fizikal untuk dilayan. Ia cara paling mudah untuk menambah tekstur tanpa menulis satu novel.',
          'Jangan berlebihan. Satu atau dua aksi setiap mesej sudah memadai. Terlalu banyak dan ia mula terasa seperti arahan pentas dan bukannya perbualan.',
        ],
      },
      {
        heading: 'Biar hubungan bernafas',
        paragraphs: [
          'Roleplay romantis yang terbaik adalah perlahan. Jika anda tergesa-gesa ke pengakuan dalam tiga mesej pertama, watak tiada ruang untuk berkembang. Biar kepercayaan terbina, biar ketegangan mendidih perlahan, biar detik kecil itu bermakna.',
          'Watak ditulis dengan mengambil kira rentak emosi — mendesak terlalu kuat terlalu cepat boleh membuatkan mereka terkeluar dari watak. Ikut rentak mereka, dan hasilnya pasti berbaloi.',
        ],
      },
      {
        heading: 'Arahkan bila perlu',
        paragraphs: [
          'Roleplay adalah kolaboratif. Jika sesuatu balasan tidak sesuai dengan cerita yang anda inginkan, anda boleh edit mesej terakhir anda dan cuba lagi, atau jana semula balasan watak. Anda tidak terikat dengan versi pertama.',
          'Anda juga boleh menukar halus secara dalam watak: tukar topik, tinggalkan bilik, ajukan soalan. Watak biasanya akan ikut rentak anda tanpa merosakkan babak.',
        ],
      },
      {
        heading: 'Tahu bila untuk berhenti',
        paragraphs: [
          'Sesi roleplay yang hebat ibarat bab yang baik — ia berakhir pada jeda yang semula jadi. Bila anda penat, berhentilah. Perbualan akan menanti anda kembali, dan watak akan ingat di mana anda tinggalkan.',
          'Tiada hadiah untuk sesi maraton. Cerita menjadi lebih baik apabila anda segar.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Layari watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Baru dengan roleplay? Mula di sini', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Cara Menggunakan OpenRouter untuk Roleplay Watak AI',
    datePublished: '2026-07-15',
    description:
      'Panduan permulaan langkah demi langkah untuk menggunakan OpenRouter bersama RoleChat AI. Daftar akaun, dapatkan kekunci API anda, pilih satu model, dan mula berbual dengan watak romantis original dalam beberapa minit.',
    sections: [
      {
        heading: 'Apakah itu OpenRouter?',
        paragraphs: [
          'OpenRouter ialah perkhidmatan yang membolehkan anda mencapai puluhan model AI daripada pelbagai penyedia melalui satu API sahaja. Daripada mendaftar secara berasingan dengan OpenAI, Anthropic, Google dan lain-lain, anda hanya perlu membuat satu akaun OpenRouter untuk menggunakan mana-mana model yang ditawarkan.',
          'Untuk roleplay AI, ini sangat memudahkan urusan. Anda boleh mencuba pelbagai model, membandingkan gaya penulisan mereka, dan bertukar kapan sahaja anda mahu — semuanya tanpa perlu menukar kekunci API atau keluar dari aplikasi.',
        ],
      },
      {
        heading: 'Kenapa OpenRouter sesuai untuk roleplay',
        paragraphs: [
          'Roleplay memerlukan model yang handal dalam penulisan kreatif, mampu kekal dalam watak, serta menghasilkan respons yang lebih panjang dan mendalam. OpenRouter memberikan anda akses kepada banyak model sedemikian, termasuklah beberapa yang sangat berpatutan harganya.',
          'Memandangkan anda hanya membayar untuk apa yang anda gunakan, anda bebas meneroka. Mulakan dengan model yang lebih murah, dan jika penulisannya terasa hambar, cuba yang lebih berkuasa — proses bertukar hanya mengambil masa beberapa saat.',
        ],
      },
      {
        heading: 'Langkah 1: Cipta akaun OpenRouter',
        paragraphs: [
          'Pergi ke openrouter.ai dan daftar. Prosesnya mudah — anda memerlukan satu alamat e-mel dan cara untuk menambah sedikit kredit (OpenRouter menerima beberapa kaedah pembayaran).',
          'Anda tidak perlu menambah terlalu banyak. Beberapa dolar sahaja sudah cukup untuk ratusan mesej roleplay pada kebanyakan model. Anda sentiasa boleh menambah kemudian.',
        ],
      },
      {
        heading: 'Langkah 2: Dapatkan kekunci API anda',
        paragraphs: [
          'Setelah log masuk, pergi ke bahagian Keys pada papan pemuka OpenRouter anda. Klik "Create Key", berikan nama yang mudah anda ingati, dan salin rentetan yang dipaparkan.',
          'Penting: OpenRouter hanya memaparkan kekunci penuh sekali sahaja. Simpan ia di tempat yang selamat dengan segera — jika hilang, anda perlu menjana yang baharu.',
        ],
      },
      {
        heading: 'Langkah 3: Tambah ke RoleChat AI',
        paragraphs: [
          'Buka aplikasi RoleChat AI dan klik "Connect AI" pada bar atas. Pada panel Settings, klik butang auto-isi "OpenRouter" — ini akan mengisi URL endpoint yang betul secara automatik.',
          'Tampal kekunci API OpenRouter anda ke dalam medan API Key. Kemudian masukkan nama model dalam medan Model (sebagai contoh, model chat yang berpatutan adalah titik mula yang baik). Klik simpan, dan sambungan anda pun siap.',
        ],
      },
      {
        heading: 'Langkah 4: Pilih watak dan mula berbual',
        paragraphs: [
          'Setelah kekunci anda disediakan, layari pustaka watak dan pilih sesiapa yang menarik perhatian anda. Klik "Start Chat", dan watak tersebut akan menghantar mesej pembukaan kepada anda.',
          'Taip balasan anda, dan dalam beberapa saat anda akan menerima respons dalam watak. Itu sahaja — anda sedang bermain roleplay. Jika gaya penulisannya tidak memuaskan anda, cuba model lain dari OpenRouter dan lihat perubahannya.',
        ],
      },
      {
        heading: 'Tip memilih model di OpenRouter',
        paragraphs: [
          'Untuk roleplay romantis, carilah model yang terkenal dengan penulisan kreatif dan output yang lebih panjang. Secara amnya, model yang lebih besar menulis dengan lebih kaya tetapi lebih mahal setiap mesej; model yang lebih kecil lebih murah namun mungkin menghasilkan balasan yang lebih pendek atau kurang bernuansa.',
          'Mulakan dengan sesuatu yang berpatutan, rasakan alirannya, dan naik taraf jika anda mahukan prosa yang lebih kaya. Tiada pilihan yang "salah" — model terbaik ialah model yang penulisannya paling anda nikmati.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Layari watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara memulakan roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tip untuk roleplay yang lebih baik', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Apakah Itu Kad Watak AI?',
    datePublished: '2026-07-15',
    description:
      'Penjelasan mesra pemula tentang kad watak AI: apakah ia, bagaimana ia berfungsi, dan cara menggunakannya dalam RoleChat AI untuk roleplay romantis yang peribadi.',
    sections: [
      {
        heading: 'Apakah itu kad watak?',
        paragraphs: [
          'Kad watak ialah fail yang mentakrifkan personaliti, sejarah latar, dan tingkah laku sesuatu watak AI. Anggaplah ia seperti satu profil terperinci yang memberitahu AI siapa yang perlu dilakonkannya — nama mereka, cara mereka bercakap, apa yang penting bagi mereka, dan bagaimana mereka berhubung dengan anda.',
          'Apabila anda memulakan sesuatu sembang, aplikasi akan membaca kad watak tersebut dan menggunakannya sebagai panduan untuk setiap respons. Hasilnya ialah perbualan yang terasa seperti bercakap dengan insan sebenar yang ada suaranya tersendiri, bukan sekadar chatbot generik.',
        ],
      },
      {
        heading: 'Apakah kandungan dalam kad watak?',
        paragraphs: [
          'Sesuatu kad watak biasanya mengandungi beberapa maklumat utama: nama, perihalan (siapa mereka dan sejarah latar mereka), personaliti (cara mereka berkelakuan dan bercakap), senario (latar tempat dan cara anda bertemu), serta mesej pertama (ayat pembuka yang memulakan perbualan).',
          'Sesetengah kad juga menyertakan dialog contoh, yang menunjukkan kepada AI bagaimana watak tersebut bercakap dalam amalan. Ini membantu AI menyerap suara unik watak tersebut — pilihan katanya, iramanya, tabiat kecilnya.',
        ],
      },
      {
        heading: 'Format kad watak: V1, V2, V3 diterangkan secara ringkas',
        paragraphs: [
          'Lama kelamaan, komuniti telah membangunkan pelbagai versi format kad watak. V1 adalah yang paling ringkas — hanya asas sahaja. V2 menambah lebih banyak medan seperti ucapan alternatif dan nota pencipta. V3 paling terperinci, dengan ruang untuk sambungan dan metadata yang lebih kaya.',
          'Anda tidak perlu risau tentang versi mana yang mana. RoleChat AI menyokong ketiga-tiganya secara automatik. Apabila anda memilih atau mengimport sesuatu kad, aplikasi akan mengenal pasti format dan menguruskannya untuk anda.',
        ],
      },
      {
        heading: 'Cara kad watak berfungsi dalam RoleChat AI',
        paragraphs: [
          'RoleChat AI dilengkapi pustaka watak original yang terbina dalam — setiap satunya ditakrifkan oleh satu kad watak. Anda tidak perlu mencari atau memuat turun apa-apa. Cukup layari pustaka, pilih watak, dan mula berbual.',
          'Jika anda sudah mempunyai kad watak daripada alat lain (SillyTavern, sebagai contoh), anda boleh mengimportnya. RoleChat AI membaca kad JSON standard serta kad PNG dengan data terbenam, jadi pustaka sedia ada anda juga berfungsi di sini.',
        ],
      },
      {
        heading: 'Watak terbina dalam berbanding mengimport sendiri',
        paragraphs: [
          'Bagi kebanyakan pemula, bermula dengan pustaka watak terbina dalam adalah jalan paling mudah. Setiap watak adalah original, ditulis khusus untuk roleplay romantis, dan sedia untuk diajak berbual tanpa sebarang persediaan selain menambah kekunci AI anda.',
          'Jika anda lebih berpengalaman dan mempunyai koleksi kad, ciri import membolehkan anda membawa bersama kedua-duanya. Kedua-dua jalan berfungsi — pustaka terbina dalam hanyalah yang lebih pantas untuk bermula.',
        ],
      },
      {
        heading: 'Adakah kad watak selamat?',
        paragraphs: [
          'Ya. Kad watak hanyalah data teks — ia tidak mengandungi kod atau skrip. Ia tidak boleh membahayakan peranti anda atau mengakses maklumat peribadi anda. Perkara paling buruk yang boleh dilakukan oleh kad yang ditulis dengan teruk hanyalah menghasilkan perbualan yang mengelirukan.',
          'Di RoleChat AI, perbualan anda kekal dalam pelayar anda, dan data watak diproses oleh penyedia AI yang anda pilih. Tiada sesiapa pun yang dapat melihat sembang anda.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Layari watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Cara memulakan roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern berbanding Web Tavern: Mana Satu Lebih Mudah?',
    datePublished: '2026-07-15',
    description:
      'Perbandingan mesra antara SillyTavern dan RoleChat AI (sebelum ini Web Tavern) untuk pemula. Pemasangan, persediaan, privasi, dan kad watak — mana satu sesuai untuk anda?',
    sections: [
      {
        heading: 'Apakah itu SillyTavern?',
        paragraphs: [
          'SillyTavern ialah frontend sumber terbuka yang popular dan berkuasa untuk roleplay AI. Ia telah lama wujud dan mempunyai komuniti yang bersemangat. Ia menyokong julat tetapan, pratetap, sambungan, dan format kad watak yang sangat luas.',
          'Pertukarannya ialah kerumitan. SillyTavern memerlukan pemasangan — anda menjalankannya pada komputer sendiri, mengkonfigurasi sambungan ke penyedia AI, dan menavigasi antara muka yang padat dengan parameter lanjutan. Bagi pengguna yang cenderung teknikal, kuasa itu satu kelebihan. Bagi kebanyakan pemula, ia satu tembok.',
        ],
      },
      {
        heading: 'Apakah itu RoleChat AI (sebelum ini Web Tavern)?',
        paragraphs: [
          'RoleChat AI — asalnya dikenali sebagai Web Tavern — ialah aplikasi roleplay AI berasaskan pelayar yang direka supaya mudah digunakan. Tiada apa yang perlu dipasang. Anda membuka satu laman web, memilih watak, menambah kekunci AI anda, dan mula berbual.',
          'Ia mengekalkan prinsip privasi yang menjadikan SillyTavern menarik (bawa kekunci sendiri, tiada orang tengah yang membaca sembang anda) tetapi membuang persediaan yang menakutkan. Matlamatnya mudah: roleplay AI peribadi yang paling mudah.',
        ],
      },
      {
        heading: 'Pemasangan: rumit berbanding sifar',
        paragraphs: [
          'SillyTavern memerlukan muat turun aplikasi, pemasangan Node.js, pelaksanaan skrip baris arahan, dan mengekalkan proses pelayan berjalan semasa anda berbual. Penggunaan pada peranti mudah alih memerlukan langkah persediaan jauh tambahan.',
          'RoleChat AI berjalan sepenuhnya dalam pelayar anda. Tiada muat turun, tiada terminal, tiada pelayan. Ia berfungsi pada komputer desktop, komputer riba, tablet, dan telefon — hanya buka laman dan mula.',
        ],
      },
      {
        heading: 'Persediaan: parameter mendalam berbanding mesra pemula',
        paragraphs: [
          'SillyTavern memaparkan temperature, top-p, panjang konteks, kaedah persampelan, templat prompt, world info, dan puluhan lagi tetapan pada skrin utama. Bagi pengguna lanjutan yang ingin menala setiap butiran, ini sangat berkuasa.',
          'RoleChat AI menyembunyikan semua itu di sebalik bahagian Advanced. Skrin lalai memaparkan watak anda, mesej anda, dan satu kotak input. Jika anda ingin mendalami parameter kemudian, ia tetap ada di sana — tetapi anda tidak semestinya perlu menyentuhnya.',
        ],
      },
      {
        heading: 'Privasi: kedua-duanya menghormati data anda',
        paragraphs: [
          'SillyTavern mahupun RoleChat AI menggunakan model "bawa kekunci sendiri". Anda menyambungkan akaun penyedia AI anda sendiri, dan mesej anda bergerak terus antara peranti anda dan penyedia tersebut. Mana-mana perkhidmatan tidak menjalankan pelayan orang tengah yang membaca perbualan anda.',
          'Inilah kelebihan privasi utama berbanding banyak aplikasi roleplay komersial, yang menghalakan sembang anda melalui pelayan mereka sendiri. Dengan SillyTavern mahupun RoleChat AI, sembang anda adalah milik anda.',
        ],
      },
      {
        heading: 'Kad watak: serasi sepenuhnya',
        paragraphs: [
          'Kedua-dua alat menyokong format kad watak yang sama (V1, V2, V3 JSON dan PNG). Jika anda mempunyai koleksi kad dari SillyTavern, anda boleh mengimport kad-kad tersebut terus ke RoleChat AI.',
          'RoleChat AI juga menawarkan pustaka terbina dalam watak romantis original, jadi walaupun anda tiada sebarang kad, anda boleh mula berbual dengan serta-merta.',
        ],
      },
      {
        heading: 'Mana satu patut anda pilih?',
        paragraphs: [
          'Jika anda suka mencuba-cuba, mahukan kawalan penuh ke atas setiap parameter, dan tidak kisah dengan persediaan teknikal, SillyTavern adalah pilihan hebat dengan komuniti yang kukuh.',
          'Jika anda mahukan satu laman yang dibuka serta merta dan boleh roleplay dalam masa kurang seminit — tanpa memasang apa-apa atau mempelajari maksud "top-p" — RoleChat AI dibina untuk anda. Anda sentiasa boleh beralih ke SillyTavern kelak, dan kad watak anda akan ikut bersama.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Layari watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Apakah itu kad watak?', to: '/guides/what-is-a-character-card' },
      { label: 'Cara memulakan roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Prompts Roleplay AI Terbaik untuk Pemula',
    datePublished: '2026-07-15',
    description:
      'Prompt dan teknik roleplay AI yang ringkas serta berkesan untuk pemula. Pelajari cara menyusun suasana, membina emosi, dan menjadikan watak anda terasa hidup — tanpa perlu sebarang pengalaman.',
    sections: [
      {
        heading: 'Apa yang menjadikan prompt roleplay yang bagus?',
        paragraphs: [
          'Dalam roleplay AI, "prompt" bukanlah arahan teknikal — ia cuma cara anda menulis mesej anda. Semakin hidup dan terperinci input anda, semakin kaya respons watak tersebut. Prompt yang bagus memberi AI sesuatu untuk digarap: satu suasana hati, satu latar, satu emosi, satu tindakan kecil.',
          'Anda tidak perlu menjadi penulis yang hebat. Anda cuma perlu memberi watak sesuatu yang benar untuk direaksi. Berikut adalah lima teknik mudah yang berkesan untuk apa jua watak.',
        ],
      },
      {
        heading: 'Prompt 1: Susun suasana',
        paragraphs: [
          'Daripada terus melompat ke dialog, gambarkan di mana anda berada. Satu ayat yang membina latar akan merapatkan perbualan dan memberi watak sesuatu untuk direspons.',
          'Contoh: "*Hujan tak berhenti sudah berjam-jam. Aku menolak pintu kafe, basah lencun, dan menyiaru ruangan mencari kerusi kosong." Ini memberi watak satu latar, satu suasana, dan satu sebab untuk perhatikan anda. Responsnya akan jauh lebih hidup berbanding jika anda hanya berkata "Hai."',
        ],
      },
      {
        heading: 'Prompt 2: Tetapkan hubungan sejak awal',
        paragraphs: [
          'AI memerlukan konteks tentang siapa anda kepada watak tersebut. Adakah anda orang asing? Kawan lama? Saingan? Satu baris pendek dalam mesej pertama anda sudah cukup untuk membentuk keseluruhan perbualan.',
          'Contoh: "Kita tak bercakap sejak graduasi, dan aku gementar saat menghampiri meja awak." Ini memberitahu watak bahawa ada sejarah, ada ketegangan, dan ada sebab detik ini bermakna. AI akan menyelami dinamik tersebut.',
        ],
      },
      {
        heading: 'Prompt 3: Tambah kedalaman emosi',
        paragraphs: [
          'Watak akan hidup apabila anda tunjukkan apa yang anda rasa, bukan sekadar apa yang anda lakukan. Satu emosi jujur yang kecil dalam mesej anda akan menjemput watak membalas dengan emosinya sendiri.',
          'Contoh: "*Aku cuba kekalkan suara yang tenang, tapi tanganku menggigil.* Aku tak sangka akan jumpa awak lagi." Kerentanan di sini memberi watak kebenaran untuk turut rentan — dan di situlah detik roleplay terbaik berlaku.',
        ],
      },
      {
        heading: 'Prompt 4: Cipta ketegangan yang lembut',
        paragraphs: [
          'Perbualan yang serba mudah akan menjadi membosankan dengan cepat. Masukkan satu halangan kecil — salah faham, rahsia, momen ragu-ragu — dan perhatikan watak terlibat dengan lebih mendalam.',
          'Contoh: "Aku nak beritahu awak yang sebenarnya, tapi setiap kali aku buka mulut, perkataan tak kunjung datang." Ini memberi watak satu sebab untuk mendesak, untuk menunggu, untuk tertanya-tanya. Ia mengubah pertukaran yang rata menjadi satu adegan yang ada taruhannya.',
        ],
      },
      {
        heading: 'Prompt 5: Tulis sendiri dalam watak',
        paragraphs: [
          'Semakin anda kekal dalam watak, semakin begitu juga AI. Gunakan asterisk untuk tindakan, tanda petik untuk pertuturan, dan jadikan komen di luar watak anda se-ringkas mungkin. Anda tidak perlu sempurna — cuma konsisten.',
          'Contoh: "*Aku meletakkan cawan itu dengan hati-hati.* \'Awak memang selalu tahu bila aku berbohong.\'" Perhatikan bagaimana tindakan dan dialog bekerja serentak. Kini watak mempunyai satu gerak isyarat, satu nada, dan satu tuduhan untuk dibalas.',
        ],
      },
      {
        heading: 'Menyatukan kesemuanya',
        paragraphs: [
          'Anda tidak perlu menggunakan kelima-lima teknik dalam setiap mesej. Pilih satu atau dua yang sesuai dengan detik tersebut, dan biarkan perbualan mengalir secara semula jadi. Roleplay yang terbaik terasa seperti improv — anda saling membina antara satu sama lain, satu mesej pada satu masa.',
          'Ingat: watak dipandu oleh kadnya dan input anda. Jika sesuatu respons terasa pelik, cuba ubah frasa mesej anda dengan lebih banyak perincian atau emosi. Perubahan kecil dalam cara anda menulis boleh mengubah cara watak membalas.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Imbas watak', to: '/characters' },
      { label: 'Buka aplikasi', to: '/app' },
      { label: 'Tip untuk roleplay yang lebih baik', to: '/guides/tips-for-better-roleplay' },
      { label: 'Cara mula roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
