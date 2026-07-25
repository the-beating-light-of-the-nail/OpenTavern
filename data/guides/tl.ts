import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Paano Magsimula ng AI Roleplay kung Baguhan ka',
    datePublished: '2026-07-15',
    description:
      'Kumpletong gabay para sa mga baguhan sa pagsisimula ng unang AI roleplay sa RoleChat AI. Pumili ng character, ilagay ang AI key mo, at ipadala ang unang mensahe mo sa loob ng limang minuto.',
    sections: [
      {
        heading: 'Ano ang AI roleplay?',
        paragraphs: [
          'Ang AI roleplay ay isang pag-uusap mo at ng AI na kumikilos bilang isang kathang-isip na character. Ginagampanan mo ang sarili mo — o sino mang gusto mong maging — at tumutugon ang AI nang nakapapel, sa real time, habang kayo\'y sabay gumagawa ng kwento nang isang mensahe sa isang pagkakataon.',
          'Hindi tulad ng chatbot na sumasagot lamang sa tanong, may personality ang isang roleplay character, may backstory, may sariling paraan ng pagsasalita, at may relasyon sa iyo. Ang layunin ay hindi kumuha ng impormasyon. Kundi mabuhay sa loob ng isang kwento kasama ang isang taong parang totoo.',
          'Sa RoleChat AI, orihinal ang bawat character — hindi kinopya mula sa laro o palabas — at ganap na pribado ang bawat pag-uusap, tumatakbo sa browser mo gamit ang sarili mong AI key.',
        ],
      },
      {
        heading: 'Hakbang 1: Pumili ng character',
        paragraphs: [
          'Pumunta sa pahina ng Characters at tignan ang library. May pangalan, tagline, maikling paglalarawan, at personality tags ang bawat character para alam mo ang papasukin mo bago ka pa magsimula.',
          'Bago pa sa romance roleplay? Magsimula sa isang "comfort" o "slow burn" na character. Mas malambot at matiyaga sila — perpekto para makapag-umpisa nang tiyak. Pwede mo namang subukan ang mas matinding character mamaya.',
          'Kapag nakahanap ka na ng gusto mo, i-click ang card nila para buksan ang character page. Basahin ang paglalarawan at ang pansimulang mensahe — iyon mismong mensahe ang simula ng pag-uusap niyo.',
        ],
      },
      {
        heading: 'Hakbang 2: Buksan ang app at ilagay ang AI key mo',
        paragraphs: [
          'I-click ang button na "Start Private Chat" sa kahit anong character page para buksan ang app. Bago ang unang mensahe mo, kailangan mong maglagay ng AI key — isang maikling lihim na string na nagpapahintulot sa app na makipag-usap sa isang AI provider.',
          'Wala ka pang key? Tingnan ang gabay namin kung paano kumuha ng AI key — aabutin ng halos dalawang minuto. Ang key mo ay naka-store lamang sa browser mo; hindi namin ito nakikita o itinatabi sa anumang server.',
          'Kapag naka-in na ang key, handa na ang app. Hindi mo na kailangang gawin itong muli maliban kung magpalit ka ng device o mag-clear ng browser data mo.',
        ],
      },
      {
        heading: 'Hakbang 3: Ipadala ang unang mensahe mo',
        paragraphs: [
          'Nagpadala na sa iyo ang character ng pansimulang mensahe — iyon ang tagapagtatag ng eksena. Ang tungkulin mo ay tumugon lamang. Hindi kailangang maging manunulat ka. Hindi kailangang maging matalino. I-type lang ang sasabihin mo talaga.',
          'Magandang unang mensahe ay kadalasang maikli at makatao: isang reaksyon, isang tanong, isang galaw na nasa asterisk. Halimbawa, kung ang isang malamig na doktor ay mag-abot sa iyo ng kape, maaari mo na lang sabihing "Salamat" at tignan ang magiging epekto.',
          'Tatugon ang AI nang nakapapel, at mula roon ay matatayo ang kwento. Walang maling paraan ng paglalaro — sundin ang curiosity mo, at sasalubungin ka ng character roon.',
        ],
      },
      {
        heading: 'Mga tips para sa unang session mo',
        paragraphs: [
          'Manatili sa karakter kung kaya mo — mas nagiging totoo ang pakiramdam ng mundo. Pero okay lang din na umatras at tamasahin lang ang biyahe.',
          'Kapag may sagot na hindi tama, pwede mo itong i-regenerate o i-edit ang huling mensahe mo. Collaborative ang roleplay; pwede kang mag-direkta.',
          'Higit sa lahat: huwag magmadali. Dahan-dahang sumasalimuot ang pinakamagandang roleplay. Hayaang huminga ang relasyon.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tignan ang mga character', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Paano kumuha ng AI key', to: '/guides/how-to-get-an-api-key' },
      { label: 'Mga tips para sa mas magandang roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Paano Kumuha ng AI Key para sa RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Hakbang-hakbang na gabay sa pagkuha ng OpenAI-compatible na API key at pagdaragdag nito sa RoleChat AI. Walang kailangang teknikal na background — aabutin ng halos dalawang minuto.',
    sections: [
      {
        heading: 'Ano ang API key?',
        paragraphs: [
          'Ang API key ay isang maikling lihim na string — karaniwan ay nagsisimula sa "sk-" — na nagpapahintulot sa RoleChat AI na makipag-usap sa isang AI provider para sa iyo. Ito ang paraan ng app para malamang pwede kang gumamit ng AI.',
          'Dala mo ang sarili mong key, ibig sabihin ikaw ang pipili ng provider, ikaw lang ang nagbabayad sa ginagamit mo, at ang mga pag-uusap mo ay diretso sa pagitan ng browser mo at ng provider na iyon. Walang middleman.',
        ],
      },
      {
        heading: 'Hakbang 1: Pumili ng provider',
        paragraphs: [
          'Gumagana ang RoleChat AI sa anumang provider na nag-aalok ng OpenAI-compatible na API. Kabilang sa sikat na pagpilian ang mga kilalang labs at mga bagong low-cost na provider. Pumili ng available sa region mo at akma sa budget mo.',
          'Hindi sigurado saan magsisimula? Maghanap ng provider na may maluwag na free trial o murang per-message na presyo. Pwede ka namang magpalit mamaya sa pamamagitan ng pag-paste ng bagong key sa Settings.',
        ],
      },
      {
        heading: 'Hakbang 2: Gumawa ng account at bumuo ng key',
        paragraphs: [
          'Mag-sign up sa website ng napiling provider, tapos hanapin ang bahaging "API keys" o "Access tokens" sa dashboard mo. I-click ang "Create new key," bigyan ng pangalang maalala mo, at kopyahin ang string na ipapakita niya.',
          'Mahalaga: karamihan sa provider ay ipinapakita ang buong key nang isang beses lang. I-save ito agad sa ligtas na lugar — kapag nawala, kailangan mong bumuo ng bago.',
        ],
      },
      {
        heading: 'Hakbang 3: Ilagay ito sa RoleChat AI',
        paragraphs: [
          'Buksan ang RoleChat AI app, i-click ang Settings, at i-paste ang key mo sa field na "API Key". Ilagay ang endpoint URL ng provider sa field na "API Endpoint" (karaniwang nakikita sa parehong dashboard page ng key mo).',
          'Opsyonal, pumili ng model mula sa dropdown. Kung hindi ka sigurado, piliin ang inirerekomendang default ng provider — balanse ito para sa kalidad at gastos.',
          'Yun na. Handa ka nang mag-chat. Mananatili ang key mo sa browser at hindi kailanman ipinapadala sa amin.',
        ],
      },
      {
        heading: 'Pagpapanatiling ligtas ng key mo',
        paragraphs: [
          'Huwag ipakita sa publiko ang API key mo — parang password ito ng AI account mo. Kapag inaakala mong nakompromiso ito, i-regenerate sa provider mo at i-update ang Settings.',
          'Sa shared o pampublikong device, huwag i-enable ang "save key to this browser." Sa sarili mong device, ligtas itong i-save para sa convenience.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Buksan ang app para ilagay ang key mo', to: '/app' },
      { label: 'Tignan ang mga character', to: '/characters' },
      { label: 'Magsimula ng unang roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Mga Tips para sa Mas Magandang AI Roleplay',
    datePublished: '2026-07-15',
    description:
      'Maliit na gawi na nagpapasigla sa mga AI character — tono, pacing, at kung paano dahan-dahang iderekta ang kwento nang hindi sumisira sa immersion.',
    sections: [
      {
        heading: 'Tumugon na parang tao, hindi parang prompt',
        paragraphs: [
          'Ang pinakamalaking pagkakamali ng baguhan ay pagsusulat sa AI sa halip na sa character. Huwag ilahad ang gusto mong mangyari — sabihin mo lang ang sasabihin mo talaga. Naglalaro na ng eksena ang AI; ang tungkulin mo ay maging bahagi nito.',
          'Maikli at tapat na sagot ay halos laging mas epektibo kaysa mahaba at sobrang-sulat. Isang tunay na "Hindi ko alam ang sasabihin ko" ay mas malayo maidadala ang eksena kaysa isang talata ng paglalarawan.',
        ],
      },
      {
        heading: 'Gumamit ng aksyon sa asterisk',
        paragraphs: [
          'Ang pagbalot ng maliit na aksyon sa asterisk — tulad ng *looks away* o *hands him the cup* — ay nagbibigay sa character ng pisikal na mareact-an. Ito ang pinakamadaling paraan para magdagdag ng tekstura nang hindi sumulat ng nobela.',
          'Huwag sobrahan. Isa o dalawang aksyon kada mensahe ay sapat na. Kapag masyadong marami, magmumukhang stage directions na hindi pag-uusap.',
        ],
      },
      {
        heading: 'Hayaang huminga ang relasyon',
        paragraphs: [
          'Ang pinakamagandang romance roleplay ay mabagal. Kapag nagmadali ka sa confession sa unang tatlong mensahe, wala nang matutunguhan ang character. Hayaang tumibay ang tiwala, hayaang kumulo ang tension, hayaang maging mahalaga ang maliliit na sandali.',
          'Ang mga character ay isinulat nang isinasaalang-alang ang emotional pacing — kung itulak nang masyadong mabilis, maaaring maging out of character sila. Sundin ang kanilang pamuno, at sulit ang resulta.',
        ],
      },
      {
        heading: 'Mag-direkta kapag kailangan',
        paragraphs: [
          'Collaborative ang roleplay. Kapag hindi bagay sa kwentong gusto mo ang isang sagot, pwede mong i-edit ang huling mensahe mo at subukang muli, o i-regenerate ang sagot ng character. Hindi ka nakakulong sa unang bersyon.',
          'Pwede ka ring dahan-dahang mag-redirect nang in-character: magpalit ng usapan, umalis sa silid, magtanong. Karaniwan, susundin ka ng character nang hindi sumisira sa eksena.',
        ],
      },
      {
        heading: 'Alamin kung kailan titigil',
        paragraphs: [
          'Isang magandang roleplay session ay parang magandang kabanata — nagtatapos sa natural na paghinto. Kapag pagod ka na, huminto. Nandito ang pag-uusap kapag nagbalik ka, at aalalahanin ng character kung saan kayo tumigil.',
          'Walang premyo sa marathon na session. Mas gumaganda ang kwento kapag sariwa ka.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tignan ang mga character', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Bago sa roleplay? Magsimula dito', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Paano Gamitin ang OpenRouter para sa AI Character Roleplay',
    datePublished: '2026-07-15',
    description:
      'Isang step-by-step na gabay para sa mga bagong simula sa paggamit ng OpenRouter kasama ang RoleChat AI. Gumawa ng account, kunin ang iyong API key, pumili ng model, at magsimulang makipag-chat sa mga original na romance character sa loob ng ilang minuto.',
    sections: [
      {
        heading: 'Ano ang OpenRouter?',
        paragraphs: [
          'Ang OpenRouter ay isang serbisyo na nagbibigay-daan upang ma-access ang dose-dosenang AI model mula sa iba\'t ibang provider sa pamamagitan ng iisang API. Sa halip na mag-sign up nang hiwalay sa OpenAI, Anthropic, Google, at iba pa, gumawa ka lang ng isang OpenRouter account at magagamit mo na anumang model na nais nilang i-offer.',
          'Para sa AI roleplay, napakapraktikal nito. Maaari mong subukan ang iba\'t ibang model, ihambing ang kanilang estilo ng pagsusulat, at lumipat kung kailan mo gusto — lahat ng ito nang hindi pinapalitan ang iyong API key o umaalis sa app.',
        ],
      },
      {
        heading: 'Bakit maganda ang OpenRouter para sa roleplay',
        paragraphs: [
          'Ang roleplay ay nangangailangan ng mga model na magaling sa creative writing, manatili sa character, at makapagbigay ng mas mahahaba at malalim na tugon. Binibigyan ka ng OpenRouter ng access sa maraming ganyang model, kabilang ang ilang napakamura.',
          'Dahil binabayaran mo lang ang iyong nagagamit, malayang-malaya kang mag-eksperimento. Magsimula sa isang mas murang model, at kung mukhang pilit ang pagsusulat, subukan ang isang mas makapangyarihan — ang paglipat ay tumatagal lang ng ilang segundo.',
        ],
      },
      {
        heading: 'Hakbang 1: Gumawa ng OpenRouter account',
        paragraphs: [
          'Pumunta sa openrouter.ai at mag-sign up. Prangkahan ang proseso — kailangan mo lang ng email address at paraan upang magdagdag ng konting credits (tumatanggap ang OpenRouter ng ilang paraan ng pagbabayad).',
          'Hindi mo kailangang magdagdag ng napakalaki. Ilang dolyar ay sapat na para sa daan-daang roleplay message sa karamihan ng mga model. Maaari ka namang mag-top up mamaya.',
        ],
      },
      {
        heading: 'Hakbang 2: Kunin ang iyong API key',
        paragraphs: [
          'Kapag naka-login na, pumunta sa Keys section ng iyong OpenRouter dashboard. I-click ang "Create Key," bigyan ito ng pangalang madaling matandaan, at kopyahin ang string na ipapakita niya.',
          'Mahalaga: Ipapakita lamang ng OpenRouter ang buong key nang isang beses. I-save ito agad sa ligtas na lugar — kapag nawala ito, kailangan mong gumawa ng bago.',
        ],
      },
      {
        heading: 'Hakbang 3: Idagdag ito sa RoleChat AI',
        paragraphs: [
          'Buksan ang RoleChat AI app at i-click ang "Connect AI" sa itaas na bar. Sa Settings panel, i-click ang "OpenRouter" quick-fill button — awtomatik nitong pupunan ang tamang endpoint URL.',
          'I-paste ang iyong OpenRouter API key sa API Key field. Pagkatapos, ilagay ang pangalan ng model sa Model field (halimbawa, magandang simulan sa isang abot-kayang chat model). I-click ang save, at nakakonekta ka na.',
        ],
      },
      {
        heading: 'Hakbang 4: Pumili ng character at magsimulang mag-chat',
        paragraphs: [
          'Ngayong naitakda na ang iyong key, tumingin-tingin sa character library at pumili ng mga taong nakakaakit ng iyong pansin. I-click ang "Start Chat," at ipadadala sa iyo ng character ang kanyang pambungad na mensahe.',
          'I-type ang iyong sagot, at sa loob ng ilang segundo ay makakatanggap ka ng tugon na nasa character. Iyon na — nagro-roleplay ka na. Kung hindi bagay sa iyo ang estilo ng pagsusulat, subukan ang ibang model mula sa OpenRouter at makita kung paano ito magbabago.',
        ],
      },
      {
        heading: 'Mga tip sa pagpili ng model sa OpenRouter',
        paragraphs: [
          'Para sa romance roleplay, maghanap ng mga model na kilala sa creative writing at mas mahahabang output. Sa pangkalahatan, mas malalaking model ay sumusulat nang mas mayaman ngunit mas malaki ang gastos kada mensahe; mas maliliit na model ay mas mura ngunit maaaring makapagbigay ng mas maikli o hindi gaanong nuanced na tugon.',
          'Magsimula sa isang abot-kaya, maramdaman ang daloy, at mag-upgrade kung gusto mo ng mas mayamang panitikan. Walang "maling" pagpili — ang pinakamagandang model ay yaong kung kanino ka nasisiyahan sa pagsulat.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tingnan ang mga character', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Paano magsimula ng AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Mga tip para sa mas magandang roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Ano ang AI Character Card?',
    datePublished: '2026-07-15',
    description:
      'Isang paliwanag na pang-beginner tungkol sa mga AI character card: ano ito, paano ito gumagana, at paano ito gamitin sa RoleChat AI para sa pribadong romance roleplay.',
    sections: [
      {
        heading: 'Ano ang character card?',
        paragraphs: [
          'Ang character card ay isang file na nagtatakda ng personalidad, backstory, at pag-uugali ng isang AI character. Isipin mo itong isang detalyadong profile na nagsasabi sa AI kung sino ang dapat nitong gayahin — ang kanilang pangalan, kung paano sila magsalita, kung ano ang mahalaga sa kanila, at kung paano sila kaugnay sa iyo.',
          'Kapag nagsimula ka ng chat, binabasa ng app ang character card at ginagamit ito patnubay sa bawat tugon. Ang resulta ay isang pag-uusap na parang kausap mo ang isang totoong tao na may sariling boses, hindi isang generic na chatbot.',
        ],
      },
      {
        heading: 'Ano ang laman ng isang character card?',
        paragraphs: [
          'Ang isang karaniwang character card ay naglalaman ng ilang mahahalagang impormasyon: isang pangalan, isang deskripsiyon (sino sila at ang kanilang backstory), isang personalidad (paano sila kumikilos at nagsasalita), isang senaryo (ang setting at kung paano kayo nagkikita), at isang unang mensahe (ang pambungad na linya na magsisimula ng pag-uusap).',
          'Ang ilang card ay may kasamang halimbawang dayalogo, na nagpapakita sa AI kung paano tumatawid ang character sa aktwal na usapan. Nakakatulong ito para masakuhan ng AI ang natatanging boses ng character — ang kanilang mga piniling salita, ang kanilang ritmo, ang kanilang maliliit na gawi.',
        ],
      },
      {
        heading: 'Mga format ng character card: V1, V2, V3 na ipinaliwanag nang simple',
        paragraphs: [
          'Sa paglipas ng panahon, nilikha ng komunidad ang iba\'t ibang bersyon ng format ng character card. Ang V1 ang pinakasimple — mga batayan lang. Nagdaragdag ang V2 ng higit pang field tulad ng alternate greetings at creator notes. Ang V3 ang pinakadetalyado, may puwang para sa mga extension at mas mayamang metadata.',
          'Hindi mo kailangang mag-alala kung aling bersyon ang alin. Sinusuportahan ng RoleChat AI ang tatlong lahat nang awtomatiko. Kapag pumili ka o nag-import ng card, hahanapin ng app ang format at pangangasiwaan ito para sa iyo.',
        ],
      },
      {
        heading: 'Paano gumagana ang mga character card sa RoleChat AI',
        paragraphs: [
          'Kasama sa RoleChat AI ang naka-built-in na library ng mga orihinal na character — bawat isa ay tinukoy ng isang character card. Hindi mo kailangang maghanap o mag-download ng anuman. Tumingin-tingin lang sa library, pumili ng character, at magsimulang mag-chat.',
          'Kung mayroon ka nang character card mula sa ibang tool (SillyTavern, halimbawa), maaari mo itong i-import. Bumabasa ang RoleChat AI ng standard na JSON card at PNG card na may embedded data, kaya gumagana rito ang iyong umiiral na library.',
        ],
      },
      {
        heading: 'Naka-built-in na character laban sa pag-import ng sarili mo',
        paragraphs: [
          'Para sa karamihan ng mga bagong simula, ang pag-umpisa sa naka-built-in na character library ang pinakamadaling landas. Bawat character ay orihinal, isinulat para sa romance roleplay, at handa nang makipag-chat nang walang setup bukod sa pagdaragdag ng iyong AI key.',
          'Kung mas sanay ka at may koleksyon ka ng mga card, pinapayagan ka ng import feature na dalhin ang mga ito. Gumagana ang parehong landas — ang naka-built-in na library ay mas mabilis lang talaga para magsimula.',
        ],
      },
      {
        heading: 'Ligtas ba ang mga character card?',
        paragraphs: [
          'Oo. Ang character card ay text data lamang — walang laman na code o script. Hindi ito makasisira sa iyong device o makaka-access ng iyong personal na impormasyon. Ang pinakamasama na magagawa ng isang masamang isinulat na card ay makapagbigay ng nakakalitong pag-uusap.',
          'Sa RoleChat AI, nananatili sa iyong browser ang iyong mga pag-uusap, at ang data ng character ay pinoproseso ng AI provider na iyong pipiliin. Walang ibang tao ang makakakita sa iyong mga chat.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tingnan ang mga character', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Paano magsimula ng AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern laban sa Web Tavern: Alin ang Mas Madali?',
    datePublished: '2026-07-15',
    description:
      'Isang palakaibigang paghahambing ng SillyTavern at RoleChat AI (dating Web Tavern) para sa mga bagong simula. Installation, setup, privacy, at character card — alin ang tama para sa iyo?',
    sections: [
      {
        heading: 'Ano ang SillyTavern?',
        paragraphs: [
          'Ang SillyTavern ay isang sikat, makapangyarihan, at open-source na frontend para sa AI roleplay. Mga taon na itong umiikot at may masugid na komunidad. Sinusuportahan nito ang napakalawak na hanay ng mga setting, preset, extension, at format ng character card.',
          'Ang kapalit nito ay ang pagiging komplikado. Kailangan ng installation ang SillyTavern — pinapatakbo mo ito sa sarili mong kompyuter, kino-configure ang mga koneksyon sa AI provider, at tinatawid ang isang siksik na interface na puno ng mga advanced na parameter. Para sa mga teknikal na user, itong kapangyarihan ay isang feature. Para sa karamihan ng mga bagong simula, ito ay isang pader.',
        ],
      },
      {
        heading: 'Ano ang RoleChat AI (dating Web Tavern)?',
        paragraphs: [
          'Ang RoleChat AI — orihinal na kilala bilang Web Tavern — ay isang browser-based na AI roleplay app na idinisenyo para sa kadalian ng paggamit. Walang kailangang i-install. Nagbubukas ka lang ng webpage, pumipili ng character, nagdaragdag ng iyong AI key, at magsisimulang mag-chat.',
          'Pinapanatili nito ang prinsipyo ng pagkapribado na nagpapabagay sa SillyTavern (magdala ng sarili mong key, walang middleman na nagbabasa ng iyong mga chat) ngunit inaalis ang nakakaintimidang setup. Simple ang layunin: ang pinakamadaling pribadong AI roleplay.',
        ],
      },
      {
        heading: 'Installation: komplikado laban sa wala',
        paragraphs: [
          'Kailangan ng SillyTavern na i-download ang application, mag-install ng Node.js, magpatakbo ng command-line script, at panatilihing tumatakbo ang server process habang nagcha-chat ka. Nangangailangan ng karagdagang hakbang sa remote setup ang paggamit sa mobile.',
          'Tumatakbo ang RoleChat AI nang buo sa iyong browser. Walang download, walang terminal, walang server. Gumagana ito sa desktop, laptop, tablet, at telepono — buksan mo lang ang page at magsimula.',
        ],
      },
      {
        heading: 'Setup: malalalim na parameter laban sa pang-beginner',
        paragraphs: [
          'Ibinubunyag ng SillyTavern ang temperature, top-p, context length, sampling method, prompt template, world info, at dose-dosenang iba pang setting sa pangunahing screen. Para sa mga advanced na user na gusto niyang i-fine-tune ang bawat detalye, ito ay makapangyarihan.',
          'Itinatago ng RoleChat AI ang lahat ng iyon sa likod ng isang Advanced section. Ipapakita ng default screen ang iyong character, ang iyong mga mensahe, at isang input box. Kung gusto mong salantain ang mga parameter mamaya, nandoon sila — ngunit hindi mo kailangang hipuin kailanman.',
        ],
      },
      {
        heading: 'Privacy: gumagalang kapwa sa iyong data',
        paragraphs: [
          'Gumagamit ang SillyTavern at RoleChat AI ng "bring your own key" na modelo. Kinekonekta mo ang sarili mong AI provider account, at dumadaan nang direkta ang iyong mga mensahe sa pagitan ng iyong device at ng provider na iyon. Hindi gumagana ang alinman sa dalawang serbisyo ng middleman server na nagbabasa ng iyong mga pag-uusap.',
          'Ito ang pangunahing bentahe sa privacy kaysa sa maraming komersyal na roleplay app, na idinadaan ang iyong mga chat sa sarili nilang server. Sa SillyTavern at RoleChat AI, sa iyo ang iyong mga chat.',
        ],
      },
      {
        heading: 'Mga character card: ganap na compatible',
        paragraphs: [
          'Sinusuportahan ng parehong tool ang parehong format ng character card (V1, V2, V3 JSON at PNG). Kung may koleksyon ka ng card mula sa SillyTavern, maaari mong i-import ang mga card na iyon nang direkta sa RoleChat AI.',
          'Nag-aalok din ang RoleChat AI ng naka-built-in na library ng mga orihinal na romance character, kaya kahit wala kang card, maaari ka agad na magsimulang mag-chat.',
        ],
      },
      {
        heading: 'Ano ang dapat piliin?',
        paragraphs: [
          'Kung mahilig ka mag-eksperimento, gusto mo ng pinakamalaking kontrol sa bawat parameter, at hindi ka nag-aalala sa teknikal na setup, ang SillyTavern ay isang magandang pilia na may malakas na komunidad.',
          'Kung gusto mong magbukas ng page at magsimulang mag-roleplay sa loob ng isang minuto — nang walang ini-install o natututo kung ano ang ibig sabihin ng "top-p" — ang RoleChat AI ay ginawa para sa iyo. Maaari ka namang lumipat sa SillyTavern mamaya, at sasamahan ka ng iyong mga character card.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tingnan ang mga character', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Ano ang character card?', to: '/guides/what-is-a-character-card' },
      { label: 'Paano magsimula ng AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Mga Pinakamagandang AI Roleplay Prompt para sa mga Baguhan',
    datePublished: '2026-07-15',
    description:
      'Mga simple at epektibong AI roleplay prompt at teknik para sa mga baguhan. Matuto kung paano itakda ang eksena, palalimin ang emosyon, at pakiramdaman na buhay ang iyong karakter — walang kailangang karanasan.',
    sections: [
      {
        heading: 'Ano ang bumubuo sa magandang roleplay prompt?',
        paragraphs: [
          'Sa AI roleplay, ang "prompt" ay hindi teknikal na utos — ito\'y simpleng paraan ng pagsulat ng iyong mga mensahe. Kapag mas buhay at tiyak ang iyong input, mas mayaman ang sagot ng karakter. Magandang prompt ay nagbibigay sa AI ng materyales na pagtatrabahuhan: isang mood, isang tagpo, isang emosyon, isang maliit na galaw.',
          'Hindi kailangang maging magaling kang manunulat. Kailangan mo lang bigyan ang karakter ng totoong maaaring tandaan. Narito ang limang simpleng teknik na gumagana sa anumang karakter.',
        ],
      },
      {
        heading: 'Prompt 1: Itakda ang eksena',
        paragraphs: [
          'Sa halip na dagling lumundag sa dayalogo, ilarawan muna kung nasaan ka. Isang pangungusap lamang na nagtatakda ng eksena ay nagpapamatibay sa usapan at nagbibigay sa karakter ng matutugunan.',
          'Halimbawa: "*Hindi tumitigil ang ulan nakaraang ilang oras na. Itinulak ko ang pintuan ng kapehan, basang-basa, at sinuri ko ang kwarto para sa bakanteng upuan." Ibinibigay nito sa karakter ang isang tagpo, isang mood, at isang dahilan upang pansinin ka. Magiging mas buhay ang kanilang tugon kaysa sa kung nagmula ka lang sa "Hi."',
        ],
      },
      {
        heading: 'Prompt 2: Itakda agad ang relasyon',
        paragraphs: [
          'Kailangan ng AI ng konteksto tungkol sa kung sino ka sa karakter. Mga hindi kilala? Matagal nang magkaibigan? Magkalaban? Isang maikling linya sa iyong unang mensahe ay maaaring hubugin ang buong usapan.',
          'Halimbawa: "Hindi na tayo nag-uusap mula noong pagtatapos, at kinakabahan ako habang lumalapit sa iyong lamesa." Sinasabi nito sa karakter na may kasaysayan, may tensyon, at may dahilan kung bakit mahalaga ang sandaling ito. Papasok ang AI sa ganitong dinamika.',
        ],
      },
      {
        heading: 'Prompt 3: Magdagdag ng lalim ng emosyon',
        paragraphs: [
          'Buhay na buhay ang mga karakter kapag ipinapakita mo ang nararamdaman mo, hindi lang ang ginagawa mo. Isang maliit na tapat na emosyon sa iyong mensahe ay nag-aanyaya sa karakter na tumugon ng sarili nila.',
          'Halimbawa: "*Sinusubukan kong panatiling hindi pabagu-bago ang aking boses, pero nanginginig ang aking mga kamay.* Hindi ko inakala na makikita ka pa ulit." Ang pagiging marupok dito ay nagbibigay sa karakter ng pahintulot na maging marupok din pabalik — at doon nagaganap ang pinakamagagandang sandali ng roleplay.',
        ],
      },
      {
        heading: 'Prompt 4: Lumikha ng banayad na tensyon',
        paragraphs: [
          'Ang usapang puro madali ay mabilis maging nakakabagot. Magpasok ng isang maliit na hadlang — isang maling intindi, isang lihim, isang sandali ng pagdadalawang-isip — at panoorin ang karakter na mas malalim na makisali.',
          'Halimbawa: "Gusto kong sabihin sa iyo ang totoo, pero tuwing bubukas ang aking bibig, ayaw lumabas ng mga salita." Ibinibigay nito sa karakter ang dahilan para itulak, maghintay, o magtaka. Ginagawa nitong isang eksena may puhunan ang isang patag na palitan.',
        ],
      },
      {
        heading: 'Prompt 5: Sumulat nang nasa karakter ka rin',
        paragraphs: [
          'Kapag mas nanatili ka sa karakter, mas ganoon din ang AI. Gamitin ang asterisk para sa mga galaw, panipi para sa pananalita, at panatiling maikli ang iyong mga komento sa labas ng karakter. Hindi kailangang perpekto — dapat lang pare-pareho.',
          'Halimbawa: "*Maingat ko inilagay ang tasa.* \'Lagi namang alam mo kapag nagsisinungaling ako.\'" Pansinin kung paano nagkakasama ang galaw at dayalogo. Mayroon na ngayong galaw, tono, at paratang na tutugunan ang karakter.',
        ],
      },
      {
        heading: 'Pag-iisa-isa ang lahat',
        paragraphs: [
          'Hindi kailangang gamitin ang limang teknik sa bawat mensahe. Pumili ng isa o dalawang angkop sa sandali, at hayaang natural na umagos ang usapan. Ang pinakamagandang roleplay ay parang improv — nagtatayo kayo sa isa\'t isa, isang mensahe sa isang pagkakataon.',
          'Tandaan: ang karakter ay gabay ng kanilang kard at ng iyong input. Kapag mukhang hindi tama ang tugon, subukang muling ibalik ang iyong mensahe nang may mas maraming detalye o emosyon. Ang maliliit na pagbabago sa iyong pagsulat ay maaaring baguhin kung paano tumutugon ang karakter.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Tignan ang mga karakter', to: '/characters' },
      { label: 'Buksan ang app', to: '/app' },
      { label: 'Mga tip para sa mas magandang roleplay', to: '/guides/tips-for-better-roleplay' },
      { label: 'Paano magsimula ng AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
