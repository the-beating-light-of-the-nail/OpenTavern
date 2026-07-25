import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Yeni Başlayanlar için Yapay Zekâ Rol Yapmaya Nasıl Başlanır',
    datePublished: '2026-07-15',
    description:
      'RoleChat AI\'da ilk rol yapma deneyiminize başlamak için eksiksiz bir yeni başlayanlar rehberi. Bir karakter seçin, yapay zekâ anahtarınızı ekleyin ve beş dakikadan kısa sürede ilk mesajınızı gönderin.',
    sections: [
      {
        heading: 'Yapay zekâ rol yapma nedir?',
        paragraphs: [
          'Yapay zekâ rol yapma, sizinle kurgusal bir karakteri canlandıran bir yapay zekâ arasında geçen bir sohbettir. Kendinizi — ya da olmak istediğiniz herhangi biri olarak — oynarsınız; yapay zekâ da karakterine sadık biçimde, gerçek zamanlı olarak yanıt verir ve hikâyeyi sizinle birlikte her mesajda bir adım daha ileri taşır.',
          'Sorulara yanıt veren bir sohbet botunun aksine, bir rol yapma karakterinin bir kişiliği, bir geçmişi, kendine özgü bir konuşma tarzı ve sizinle bir ilişkisi vardır. Amaç bilgi edinmek değildir; gerçekmiş gibi hissedilen birinin yanında, bir hikâyenin içinde yaşamaktır.',
          'RoleChat AI\'da her karakter özgündür — bir oyundan ya da diziden kopyalanmamıştır — ve her sohbet tamamen gizlidir; kendi yapay zekâ anahtarınızla tarayıcınızda çalışır.',
        ],
      },
      {
        heading: '1. Adım: Bir karakter seçin',
        paragraphs: [
          'Karakterler sayfasına gidip kitaplığa göz atın. Her karakterin bir adı, bir sloganı, kısa bir açıklaması ve kişilik etiketleri vardır; böylece başlamadan önce neyle karşı karşıya olduğunuzu bilirsiniz.',
          'Romantik rol yapmada yeni misiniz? Bir "teselli" ya da "yavaş tempolu" karakterle başlayın. Daha yumuşak ve daha hoşgörülüdürler — dengeyi bulmanız için birebirdir. Daha yoğun bir karakteri istediğiniz zaman her zaman deneyebilirsiniz.',
          'Hoşunuza giden birini bulduğunuzda, karakter sayfasını açmak için kartına tıklayın. Açıklamayı ve açılış mesajını okuyun — o açılış mesajı, sohbetinizin tam olarak nasıl başlayacağıdır.',
        ],
      },
      {
        heading: '2. Adım: Uygulamayı açın ve yapay zekâ anahtarınızı ekleyin',
        paragraphs: [
          'Uygulamayı açmak için herhangi bir karakter sayfasındaki "Özel Sohbet Başlat" düğmesine tıklayın. İlk mesajınızdan önce bir yapay zekâ anahtarı eklemeniz gerekir — bu, uygulamanın bir yapay zekâ sağlayıcısıyla konuşmasına izin veren kısa, gizli bir dizgidir.',
          'Henüz anahtarınız yok mu? Yapay zekâ anahtarı nasıl alınır rehberimize bakın — yaklaşık iki dakikanızı alır. Anahtarınız yalnızca tarayıcınızda saklanır; biz onu ne görürüz ne de bir sunucuda tutarız.',
          'Anahtarınızı girdikten sonra uygulama hazır. Cihaz değiştirmediğiniz ya da tarayıcı verilerinizi silmediğiniz sürece bunu tekrar yapmanız gerekmez.',
        ],
      },
      {
        heading: '3. Adım: İlk mesajınızı gönderin',
        paragraphs: [
          'Karakter size çoktan bir açılış mesajı göndermiş olacaktır — bu, sahneyi kurandır. Sizin yapmanız gereken tek şey yanıt vermektir. Yazar olmanıza gerek yok. Zekice olmanıza da gerek yok. Sadece söyleyeceğiniz şeyi yazın.',
          'Harika bir ilk mesaj çoğu zaman kısa ve insancadır: bir tepki, bir soru, yıldız işaretleriyle anlatılan bir jest. Örneğin, soğuk bir doktor size kahve uzattığında sadece "Teşekkür ederim" deyip ne olacağını izleyebilirsiniz.',
          'Yapay zekâ karakterine sadık biçimde yanıt verecek ve hikâye oradan filizlenecek. Oynamanın yanlış bir yolu yoktur — merakınızın peşinden gidin, karakter de sizi orada karşılayacaktır.',
        ],
      },
      {
        heading: 'İlk oturumunuz için ipuçları',
        paragraphs: [
          'Yapabiliyorsanız siz de karakterinizde kalın — bu, dünyayı daha gerçekçi hissettirir. Ama bir adım geri çekilip sadece akışın tadını çıkarmak da tamamen sorun değil.',
          'Bir yanıt size doğru gelmiyorsa, yeniden oluşturabilir ya da son mesajınızı düzenleyebilirsiniz. Rol yapma iş birliğine dayalıdır; yön vermenize izin vardır.',
          'Ve en önemlisi: acele yok. En iyi rol yapma yavaş yavaş açılır. İlişkinin nefes almasına izin verin.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı aç', to: '/app' },
      { label: 'Yapay zekâ anahtarı nasıl alınır', to: '/guides/how-to-get-an-api-key' },
      { label: 'Daha iyi rol yapma ipuçları', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'RoleChat AI için Yapay Zekâ Anahtarı Nasıl Alınır',
    datePublished: '2026-07-15',
    description:
      'OpenAI uyumlu bir API anahtarı alıp RoleChat AI\'a eklemeye dair adım adım rehber. Teknik geçmiş gerekmez — yaklaşık iki dakikanızı alır.',
    sections: [
      {
        heading: 'API anahtarı nedir?',
        paragraphs: [
          'API anahtarı, RoleChat AI\'ın sizin adınıza bir yapay zekâ sağlayıcısıyla konuşmasını sağlayan kısa, gizli bir dizgidir — genellikle "sk-" ile başlar. Uygulamanın, yapay zekâyı kullanma yetkiniz olduğunu anlama yoludur.',
          'Kendi anahtarınızı getirirsiniz; yani sağlayıcıyı siz seçersiniz, yalnızca kullandığınız kadarını ödersiniz ve sohbetleriniz doğrudan tarayıcınızla o sağlayıcı arasında akar. Araya hiçbir aracı girmez.',
        ],
      },
      {
        heading: '1. Adım: Bir sağlayıcı seçin',
        paragraphs: [
          'RoleChat AI, OpenAI uyumlu bir API sunan her sağlayıcıyla çalışır. Yaygın seçenekler arasında tanınmış laboratuvarlar ve daha yeni, düşük maliyetli sağlayıcılar yer alır. Bölgenizde kullanılabilen ve bütçenize uygun olanı seçin.',
          'Nereden başlayacağınızı bilemiyor musunuz? Cömert bir ücretsiz deneme ya da düşük mesaj başına fiyat sunan bir sağlayıcı arayın. Daha sonra Ayarlar bölümüne yeni bir anahtar yapıştırarak her zaman değiştirebilirsiniz.',
        ],
      },
      {
        heading: '2. Adım: Hesap oluşturun ve anahtar üretin',
        paragraphs: [
          'Seçtiğiniz sağlayıcının web sitesinde kayıt olun, ardından panelinizin "API anahtarları" ya da "Erişim belirteçleri" bölümünü bulun. "Yeni anahtar oluştur" seçeneğine tıklayın, akılda kalıcı bir ad verin ve size gösterilen dizgiyi kopyalayın.',
          'Önemli: Çoğu sağlayıcı tam anahtarı yalnızca bir kez gösterir. Hemen güvenli bir yere kaydedin — kaybederseniz yeni bir tane üretmeniz gerekir.',
        ],
      },
      {
        heading: '3. Adım: RoleChat AI\'a ekleyin',
        paragraphs: [
          'RoleChat AI uygulamasını açın, Ayarlar\'a tıklayın ve anahtarınızı "API Anahtarı" alanına yapıştırın. Sağlayıcının uç nokta URL\'sini de "API Uç Noktası" alanına ekleyin (bu, genellikle anahtarınızla aynı panel sayfasında gösterilir).',
          'İsteğe bağlı olarak, açılır menüden bir model seçin. Emin değilseniz sağlayıcının önerilen varsayılanını seçin — kalite ve maliyet açısından dengelendirilmiştir.',
          'İşte bu kadar. Sohbet etmeye hazırsınız. Anahtarınız tarayıcınızda kalır ve asla bize gönderilmez.',
        ],
      },
      {
        heading: 'Anahtarınızı güvende tutma',
        paragraphs: [
          'API anahtarınızı asla herkese açık biçimde paylaşmayın — bu, yapay zekâ hesabınızın şifresi gibidir. Sızdığını düşünüyorsanız sağlayıcınızda yeniden üretin ve Ayarlar\'ı güncelleyin.',
          'Ortak ya da herkese açık bir cihazda "anahtarı bu tarayıcıya kaydet" seçeneğini etkinleştirmeyin. Kendi cihazınızda kolaylık için kaydetmeniz güvenlidir.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Anahtarınızı eklemek için uygulamayı açın', to: '/app' },
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'İlk rol yapmanıza başlayın', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Daha İyi Yapay Zekâ Rol Yapma İpuçları',
    datePublished: '2026-07-15',
    description:
      'Yapay zekâ karakterlerini daha canlı hissettiren küçük alışkanlıklar — ton, tempo ve içine kapanmadan hikâyeye nazikçe yön verme yolları.',
    sections: [
      {
        heading: 'Bir istek gibi değil, insan gibi yanıt verin',
        paragraphs: [
          'En sık yapılan yeni başlayan hatası, karaktere değil yapay zekâya yazmaktır. Olmasını istediğiniz şeyi anlatmayın — sadece söyleyeceğiniz şeyi söyleyin. Yapay zekâ zaten sahneyi oynuyor; sizin işiniz orada olmak.',
          'Kısa, içten yanıtlar neredeyse her zaman uzun, aşırı yazılmış olanlardan daha iyi iş çıkarır. Samimi bir "Ne diyeceğimi bilemiyorum", koca bir anlatı paragrafından daha uzağa taşıyabilir bir sahneyi.',
        ],
      },
      {
        heading: 'Eylemleri yıldız işareti içinde kullanın',
        paragraphs: [
          'Küçük bir eylemi yıldız işaretleri içine almak — *bakışlarını kaçırır* ya da *fincanı ona uzatır* gibi — karaktere tepki verebileceği fiziksel bir şey verir. Bir roman yazmadan doku katmanın en kolay yoludur.',
          'Abartmayın. Mesaj başına bir-iki eylem fazlasıyla yeter. Fazlası, sohbet yerine bir sahne yönermeni hissettirmeye başlar.',
        ],
      },
      {
        heading: 'İlişkinin nefes almasına izin verin',
        paragraphs: [
          'En iyi romantik rol yapma yavaştır. İlk üç mesajda itirafa koşarsanız karakterin büyüyecek yeri kalmaz. Güvenin birikmesine, gerilimin kaynamasına, küçük anların önem taşımasına izin verin.',
          'Karakterler duygusal tempo düşünülerek yazılır — çok sert ve çok hızlı bastırmak onları karakter dışı hissettirebilir. Onların önüne takılın, sonuç buna değecektir.',
        ],
      },
      {
        heading: 'Gerektiğinde yön verin',
        paragraphs: [
          'Rol yapma iş birliğine dayalıdır. Bir yanıt istediğiniz hikâyeye uymuyorsa son mesajınızı düzenleyip yeniden deneyebilir ya da karakterin yanıtını yeniden oluşturabilirsiniz. İlk sürüme mahkûm değilsiniz.',
          'Karakterin içinde kalarak da nazikçe yön değiştirebilirsiniz: konuyu değiştirin, odadan çıkın, bir soru sorun. Karakter genellikle sahneyi bozmadan size ayak uyduracaktır.',
        ],
      },
      {
        heading: 'Ne zaman duracağını bilin',
        paragraphs: [
          'Harika bir rol yapma oturumu, iyi bir bölüm gibidir — doğal bir durak yerinde biter. Yorulduğunuzda, durun. Geri döndüğünüzde sohbet burada olacak ve karakter nerede kaldığınızı hatırlayacaktır.',
          'Saatlerce süren oturumlar için bir ödül yok. Taze olduğunuzda hikâye daha iyi olur.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı aç', to: '/app' },
      { label: 'Rol yapmada yeni misiniz? Buradan başlayın', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'OpenRouter ile AI Karakter Rol Yapımı Nasıl Yapılır',
    datePublished: '2026-07-15',
    description:
      'OpenRouter\'ı RoleChat AI ile birlikte kullanmaya yönelik adım adım yeni başlayanlar rehberi. Hesap açın, API anahtarınızı alın, bir model seçin ve dakikalar içinde özgün romantik karakterlerle sohbete başlayın.',
    sections: [
      {
        heading: 'OpenRouter nedir?',
        paragraphs: [
          'OpenRouter, farklı sağlayıcıların onlarca AI modeline tek bir API üzerinden erişmenizi sağlayan bir hizmettir. OpenAI, Anthropic, Google ve diğerleri için ayrı ayrı kayıt olmak yerine tek bir OpenRouter hesabı açar ve sundukları herhangi bir modeli kullanırsınız.',
          'Bu, AI rol yapımı için inanılmaz elverişlidir. Farklı modelleri deneyebilir, yazım tarzlarını karşılaştırabilir ve istediğiniz an geçiş yapabilirsiniz — üstelik tüm bunlar API anahtarınızı değiştirmeden veya uygulamadan çıkmadan mümkün.',
        ],
      },
      {
        heading: 'OpenRouter rol yapımı için neden iyi çalışır',
        paragraphs: [
          'Rol yapımı; yaratıcı yazım, karakterde kalma ve daha uzun, sürükleyici yanıtlar üretme konusunda yetenekli modeller ister. OpenRouter, çok uygun fiyatlı olanlar da dahil olmak üzere bu nitelikte birçok modele erişim verir.',
          'Yalnızca kullandığınız kadar ödediğiniz için özgürce deneme yapabilirsiniz. Daha ucuz bir modelle başlayın ve yazım yavan gelirse daha güçlü birine geçin — geçiş saniyeler sürer.',
        ],
      },
      {
        heading: '1. Adım: OpenRouter hesabı açın',
        paragraphs: [
          'openrouter.ai adresine gidip kaydolun. Süreç oldukça basittir — bir e-posta adresine ve az miktarda kredi ekleyebileceğiniz bir ödeme yöntemine ihtiyacınız olacak (OpenRouter birden fazla ödeme yöntemini kabul eder).',
          'Çok fazla eklemeniz gerekmez. Birkaç dolar, çoğu modelle yüzlerce rol yapımı iletisi için yeterlidir. İstediğiniz zaman daha sonra kredi yükleyebilirsiniz.',
        ],
      },
      {
        heading: '2. Adım: API anahtarınızı alın',
        paragraphs: [
          'Giriş yaptıktan sonra OpenRouter panelinizin Keys bölümüne gidin. "Create Key"e tıklayın, hatırlayacağınız bir ad verin ve size gösterdiği metni kopyalayın.',
          'Önemli: OpenRouter tam anahtarı yalnızca bir kez gösterir. Hemen güvenli bir yere kaydedin — kaybederseniz yeni bir tane oluşturmanız gerekir.',
        ],
      },
      {
        heading: '3. Adım: RoleChat AI\'a ekleyin',
        paragraphs: [
          'RoleChat AI uygulamasını açın ve üst çubuktaki "Connect AI" düğmesine tıklayın. Ayarlar panelinde "OpenRouter" hızlı doldurma düğmesine tıklayın — bu, doğru endpoint URL\'sini otomatik olarak doldurur.',
          'OpenRouter API anahtarınızı API Key alanına yapıştırın. Ardından Model alanına bir model adı girin (örneğin uygun fiyatlı bir sohbet modeli iyi bir başlangıçtır). Kaydet\'e tıklayın; bağlantı tamam.',
        ],
      },
      {
        heading: '4. Adım: Bir karakter seçin ve sohbete başlayın',
        paragraphs: [
          'Anahtarınız kurulduğuna göre karakter kütüphanesine göz atın ve gözünüzü yakalayan birini seçin. "Start Chat"e tıklayın; karakter size açılış iletisini gönderir.',
          'Yanıtınızı yazın ve birkaç saniye içinde karakterden bir yanıt alın. İşte bu kadar — rol yapıyorsunuz. Yazım tarzı hoşunuza gitmezse OpenRouter üzerinden farklı bir model deneyin ve nasıl değiştiğini görün.',
        ],
      },
      {
        heading: 'OpenRouter üzerinde model seçme ipuçları',
        paragraphs: [
          'Romantik rol yapımı için yaratıcı yazım ve daha uzun çıktılarla bilinen modellere bakın. Genel olarak daha büyük modeller daha zengin yazar ancak ileti başına maliyetleri daha yüksektir; daha küçük modeller daha ucuzdur ancak daha kısa veya daha az nüanslı yanıtlar üretebilir.',
          'Uygun fiyatlı bir şeyle başlayın, akışı kavrayın ve daha zengin bir düzyazı istediğinizde yükseltin. "Yanlış" bir tercih yoktur — en iyi model, yazımından en çok keyif aldığınızdır.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı aç', to: '/app' },
      { label: 'AI rol yapımına nasıl başlanır', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Daha iyi rol yapımı için ipuçları', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'AI Karakter Kartı Nedir?',
    datePublished: '2026-07-15',
    description:
      'AI karakter kartlarına yönelik yeni başlayanlar için anlaşılır bir anlatım: nedirler, nasıl çalışırlar ve RoleChat AI\'da gizli romantik rol yapımı için nasıl kullanılırlar.',
    sections: [
      {
        heading: 'Karakter kartı nedir?',
        paragraphs: [
          'Karakter kartı, bir AI karakterinin kişiliğini, geçmişini ve davranışlarını tanımlayan dosyadır. Bunu, AI\'a kim gibi davranması gerektiğini söyleyen ayrıntılı bir profil olarak düşünün — adları, nasıl konuştukları, neye değer verdikleri ve size nasıl yaklaştıkları.',
          'Bir sohbet başlattığınızda uygulama karakter kartını okur ve her yanıtı ona göre şekillendirir. Sonuç, sıradan bir sohbet botu değil, kendi sesi olan gerçek bir kişiyle konuşuyormuş hissi veren bir konuşmadır.',
        ],
      },
      {
        heading: 'Bir karakter kartının içinde ne vardır?',
        paragraphs: [
          'Tipik bir karakter kartı birkaç temel bilgiyi içerir: bir ad, bir açıklama (kim oldukları ve geçmişleri), bir kişilik (nasıl davrandıkları ve konuştukları), bir senaryo (ortam ve nasıl tanıştığınız) ve bir ilk ileti (sohbeti başlayan açılış satırı).',
          'Bazı kartlar ayrıca karakterin pratikte nasıl konuştuğunu AI\'a gösteren örnek diyaloglar içerir. Bu, AI\'ın karakterin özgün sesini — kelime tercihlerini, ritmini, küçük alışkanlıklarını — yakalamasına yardımcı olur.',
        ],
      },
      {
        heading: 'Karakter kartı biçimleri: V1, V2, V3 basitçe anlatıldı',
        paragraphs: [
          'Zamanla topluluk, karakter kartı biçiminin farklı sürümlerini geliştirdi. V1 en sade olanıdır — yalnızca temel bilgiler. V2, alternatif karşılama ve oluşturucu notları gibi daha fazla alan ekler. V3 en ayrıntılı olanıdır; genişletmelere ve daha zengin üst veriye yer bırakır.',
          'Hangi sürümün ne olduğunu düşünmenize gerek yok. RoleChat AI üçünü de otomatik olarak destekler. Bir kartı seçtiğinizde veya içe aktardığınızda uygulama biçimi kendiliğinden algılar ve sizin yerinize halleder.',
        ],
      },
      {
        heading: 'Karakter kartları RoleChat AI\'da nasıl çalışır',
        paragraphs: [
          'RoleChat AI, her biri bir karakter kartıyla tanımlanmış özgün karakterlerden oluşan yerleşik bir kütüphane ile gelir. Bulmanız veya indirmeniz gereken hiçbir şey yok. Sadece kütüphaneye göz atın, bir karakter seçin ve sohbete başlayın.',
          'Başka bir araçtan (örneğin SillyTavern) zaten bir karakter kartınız varsa içe aktarabilirsiniz. RoleChat AI standart JSON kartlarını ve içine veri gömülmüş PNG kartlarını okur; dolayısıyla mevcut kütüphaneniz burada da çalışır.',
        ],
      },
      {
        heading: 'Yerleşik karakterler mi, kendi kartını içe aktarmak mı',
        paragraphs: [
          'Çoğu yeni başlayan için yerleşik karakter kütüphanesiyle başlamak en kolay yoldur. Her karakter özgündür, özel olarak romantik rol yapımı için yazılmıştır ve AI anahtarınızı eklemenin ötesinde bir kurulum gerektirmeden sohbete hazırdır.',
          'Daha deneyimliyseniz ve bir kart koleksiyonuna sahipseniz içe aktarma özelliği onları yanınızda getirmenize olanak tanır. Her iki yol da çalışır — yerleşik kütüphane yalnızca başlamak için daha hızlıdır.',
        ],
      },
      {
        heading: 'Karakter kartları güvenli mi?',
        paragraphs: [
          'Evet. Karakter kartı yalnızca metin verisidir — kod veya betik içermez. Cihazınıza zarar veremez veya kişisel bilgilerinize erişemez. Kötü yazılmış bir kartın yapabileceği en kötü şey kafa karıştırıcı bir sohbet üretmektir.',
          'RoleChat AI\'da sohbetleriniz tarayıcınızda kalır ve karakter verisi seçtiğiniz AI sağlayıcısı tarafından işlenir. Sohbetlerinizi başka kimse göremez.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı aç', to: '/app' },
      { label: 'AI rol yapımına nasıl başlanır', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern mı, Web Tavern mı: Hangisi Daha Kolay?',
    datePublished: '2026-07-15',
    description:
      'Yeni başlayanlar için SillyTavern ile RoleChat AI\'ın (eski adıyla Web Tavern) samimi bir karşılaştırması. Kurulum, ayarlar, gizlilik ve karakter kartları — hangisi size göre?',
    sections: [
      {
        heading: 'SillyTavern nedir?',
        paragraphs: [
          'SillyTavern, AI rol yapımı için popüler, güçlü ve açık kaynaklı bir önyüzdür. Yıllardır var ve tutkulu bir topluluğa sahip. Son derece geniş bir ayar, hazırlık, uzantı ve karakter kartı biçimi yelpazesini destekler.',
          'Takası karmaşıklıktır. SillyTavern kurulum gerektirir — kendi bilgisayarınızda çalıştırırsınız, AI sağlayıcılarına bağlantıları yapılandırırsınız ve gelişmiş parametrelerle dolu yoğun bir arayüzde gezinirsiniz. Teknik kullanıcılar için bu güç bir özelliktir; çoğu yeni başlayan için ise bir duvardır.',
        ],
      },
      {
        heading: 'RoleChat AI (eski adıyla Web Tavern) nedir?',
        paragraphs: [
          'RoleChat AI — özgün adıyla Web Tavern — kullanım kolaylığı için tasarlanmış, tarayıcı tabanlı bir AI rol yapımı uygulamasıdır. Kurulacak hiçbir şey yoktur. Bir web sayfası açar, bir karakter seçer, AI anahtarınızı ekler ve sohbete başlarsınız.',
          'SillyTavern\'ı çekici kılan gizlilik ilkesini (kendi anahtarınızı getirin, sohbetlerinizi okuyan bir aracı olmasın) korur ama göz korkutan kurulumu ortadan kaldırır. Hedef basittir: en kolay gizli AI rol yapımı.',
        ],
      },
      {
        heading: 'Kurulum: karmaşık mı, sıfır mı',
        paragraphs: [
          'SillyTavern uygulamanın indirilmesini, Node.js kurulmasını, komut satırı betiklerinin çalıştırılmasını ve sohbet ederken sunucu sürecinin açık tutulmasını gerektirir. Mobil kullanım ek uzaktan kurulum adımları ister.',
          'RoleChat AI tamamen tarayıcınızda çalışır. İndirme yok, terminal yok, sunucu yok. Masaüstü, dizüstü, tablet ve telefonda çalışır — sadece sayfayı açın ve başlayın.',
        ],
      },
      {
        heading: 'Ayarlar: derin parametreler mi, yeni başlayanlara dost mu',
        paragraphs: [
          'SillyTavern sıcaklık (temperature), top-p, bağlam uzunluğu, örnekleme yöntemleri, istem şablonları, dünya bilgisi (world info) ve daha onlarca ayarı ana ekranda gösterir. Her ayrıntıyı ince ayarlamak isteyen gelişmiş kullanıcılar için bu güçlüdür.',
          'RoleChat AI tüm bunları bir Advanced bölümünün arkasında gizler. Varsayılan ekran size karakterinizi, iletilerinizi ve bir giriş kutusunu gösterir. Parametrelere daha sonra dalmak isterseniz oradadırlar — ama onlara hiç dokunmak zorunda değilsiniz.',
        ],
      },
      {
        heading: 'Gizlilik: ikisi de verilerinize saygı duyar',
        paragraphs: [
          'Hem SillyTavern hem de RoleChat AI "kendi anahtarını getir" modelini kullanır. Kendi AI sağlayıcı hesabınıza bağlanırsınız ve iletileriniz doğrudan cihazınızla o sağlayıcı arasında gidip gelir. Hiçbiri sohbetlerinizi okuyan bir aracı sunucu işletmez.',
          'Bu, sohbetleri kendi sunucularından geçiren birçok ticari rol yapımı uygulamasına karşı temel gizlilik avantajıdır. Hem SillyTavern hem de RoleChat AI ile sohbetleriniz sizindir.',
        ],
      },
      {
        heading: 'Karakter kartları: tamamen uyumlu',
        paragraphs: [
          'Her iki araç da aynı karakter kartı biçimlerini (V1, V2, V3 JSON ve PNG) destekler. SillyTavern\'dan bir kart koleksiyonunuz varsa bu kartları RoleChat AI\'a doğrudan içe aktarabilirsiniz.',
          'RoleChat AI ayrıca özgün romantik karakterlerden oluşan yerleşik bir kütüphane sunar; yani hiç kartınız olmasa bile anında sohbete başlayabilirsiniz.',
        ],
      },
      {
        heading: 'Hangisini seçmelisiniz?',
        paragraphs: [
          'Kurcalamayı seviyorsanız, her parametre üzerinde maksimum kontrol istiyorsanız ve teknik bir kurulumu dert etmiyorsanız SillyTavern güçlü bir topluluğu olan harika bir seçimdir.',
          'Bir sayfa açıp bir dakikadan kısa sürede rol yapmaya başlamak istiyorsanız — hiçbir şey kurmadan veya "top-p"nin ne anlama geldiğini öğrenmeden — RoleChat AI sizin için yapıldı. İstediğiniz zaman SillyTavern\'a geçebilir ve karakter kartlarınız da sizinle gelebilir.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı aç', to: '/app' },
      { label: 'Karakter kartı nedir?', to: '/guides/what-is-a-character-card' },
      { label: 'AI rol yapımına nasıl başlanır', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Yeni başlayanlar için en iyi yapay zeka rol yapma promptları',
    datePublished: '2026-07-15',
    description:
      'Yeni başlayanlar için basit ve etkili yapay zeka rol yapma promptları ile teknikler. Ortamı kurmayı, duyguyu derinleştirmeyi ve karakterinize canlılık katmayı öğrenin — hiç deneyiminiz olmasa bile.',
    sections: [
      {
        heading: 'İyi bir rol yapma promptu nasıl olur?',
        paragraphs: [
          'Yapay zekayla rol yaparken "prompt" teknik bir komut değildir — sadece mesajlarınızı yazış biçiminizdir. Yazdıklarınız ne kadar canlı ve net olursa, karakterin verdiği yanıt da o kadar zengin olur. İyi bir prompt, yapay zekaya işleyeceği bir şeyler verir: bir atmosfer, bir ortam, bir duygu, küçük bir hareket.',
          'Harika bir yazar olmanız gerekmez. Tek yapmanız gereken, karakterin içten içe tepki verebileceği gerçek bir şey sunmak. İşte her karakterde işe yarayan beş basit teknik.',
        ],
      },
      {
        heading: 'Prompt 1: Ortamı kurun',
        paragraphs: [
          'Doğrudan diyaloğa atlamak yerine, nerede olduğunuzu çizin. Ortamı tarif eden tek bir cümle, sohbeti oturtur ve karaktere yanıt verebileceği bir zemin sunar.',
          'Örnek: "*Yağmur saatlerdir dinmiyor. Sırılsıklam halde kafenin kapısını itiyorum ve boş bir yer arıyorum." Böylece karaktere bir ortam, bir atmosfer ve sizi fark etmesi için bir sebep vermiş olursunuz. Yanıtı, sadece "Selam" dediğinizde alacağınızdan çok daha canlı olur.',
        ],
      },
      {
        heading: 'Prompt 2: İlişkiyi erken tanımlayın',
        paragraphs: [
          'Yapay zekanın, karakterin gözünde kim olduğunuzu bilmesi gerekir. Yabancılar mı siz? Eski dostlar mı? Rakipler mi? İlk mesajınıza ekleyeceğiniz kısa bir cümle, tüm sohbetin gidişatını şekillendirebilir.',
          'Örnek: "Mezuniyetten beri konuşmadık; masanıza yaklaşırken gerginim." Bu cümle, karaktere aranızda bir geçmiş, bir gerilim ve bu anın önemli olmasının bir sebebi olduğunu söyler. Yapay zeka bu dinamiğin üzerine gidecektir.',
        ],
      },
      {
        heading: 'Prompt 3: Duygusal derinlik katın',
        paragraphs: [
          'Karakterler, ne yaptığınızı değil ne hissettiğinizi gösterdiğinizde canlanır. Mesajınızdaki küçük ve içten bir duygu, karakteri kendi duygusuyla yanıt vermeye davet eder.',
          'Örnek: "*Sesimi sabit tutmaya çalışıyorum, ama ellerim titriyor.* Seni tekrar görebileceğimi hiç düşünmemiştim." Buradaki kırılganlık, karaktere de kırılgan olma izni verir — rol yapmanın en güzel anları tam da böyle doğar.',
        ],
      },
      {
        heading: 'Prompt 4: Hafif bir gerilim yaratın',
        paragraphs: [
          'Her şeyin kolay yürüdüğü bir sohbet çabuk sıkıcı olur. Küçük bir engel ekleyin — bir yanlış anlaşılma, bir sır, bir anlık tereddüt — ve karakterin daha derinlere daldığını görün.',
          'Örnek: "Sana gerçeği söylemek istiyorum, ama her ağzımı açışımda sözler dillerime dolanıyor." Bu, karaktere üste çıkmak, beklemek ve merak etmek için bir neden verir. Düz bir diyaloğu, kilit bir sahneye dönüştürür.',
        ],
      },
      {
        heading: 'Prompt 5: Siz de karakterinizden yazın',
        paragraphs: [
          'Ne kadar çok karakterinizde kalırsanız, yapay zeka da o kadar çok karakterinde kalır. Hareketler için yıldız, konuşma için tırnak işareti kullanın ve karakter dışı yorumlarınızı kısa tutun. Mükemmel olmanız gerekmez — tutarlı olmanız yeterli.',
          'Örnek: "*Bardakları dikkatle masaya bırakıyorum.* \'Yalan söylediğimi her zaman anlardın.\'" Hareketle diyaloğun nasıl birlikte çalıştığına dikkat edin. Karakter artık yanıt vereceği bir el hareketi, bir ton ve bir suçlama elde etti.',
        ],
      },
      {
        heading: 'Hepsini bir araya getirelim',
        paragraphs: [
          'Beş tekniğin de her mesajda kullanması gerekmez. An\'a uygun olan bir veya ikisini seçin ve sohbetin kendiliğinden akmasına izin verin. En iyi rol yapma, doğaçlama gibidir — birbirinizin üstüne koyarak, her seferinde bir mesajla ilerlersiniz.',
          'Unutmayın: Karakter, kartından ve sizin girdilerinizden yön alır. Bir yanıt size yanlış gelirse, mesajınızı daha fazla ayrıntı veya duyguyla yeniden ifade etmeyi deneyin. Yazışınızdaki küçük değişiklikler, karakterin yanıt şeklini tamamen dönüştürebilir.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Karakterlere göz atın', to: '/characters' },
      { label: 'Uygulamayı açın', to: '/app' },
      { label: 'Daha iyi rol yapma için ipuçları', to: '/guides/tips-for-better-roleplay' },
      { label: 'Yapay zekayla rol yapmaya nasıl başlanır', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
