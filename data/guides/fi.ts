import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Näin aloitat tekoälyroolipelin — opas aloittelijoille',
    datePublished: '2026-07-15',
    description:
      'Kattava opas aloittelijalle: näin käynnistät ensimmäisen tekoälyroolipelisi RoleChat AI:ssa. Valitse hahmo, lisää tekoälyavaimesi ja lähetä ensimmäinen viestisi alle viidessä minuutissa.',
    sections: [
      {
        heading: 'Mitä tekoälyroolipeli on?',
        paragraphs: [
          'Tekoälyroolipeli on keskustelu sinun ja tekoälyn välillä, jossa tekoäly esittää kuvitteellista hahmoa. Voit olla oma itsesi — tai kuka tahansa, joksi haluat itsesi mieltää — ja tekoäly vastaa roolissaan reaaliajassa, rakentaen tarinaa kanssasi viesti kerrallaan.',
          'Toisin kuin kysymyksiin vastaava keskustelubotti, roolipelihahmolla on persoonallisuus, taustatarina, oma puhetyylinsä ja suhde sinuun. Tarkoitus ei ole hakea tietoa, vaan elää tarinassa jonkun sellaisen kanssa, joka tuntuu aidolta.',
          'RoleChat AI:ssa jokainen hahmo on alkuperäinen — ei kopioitu pelistä tai sarjasta — ja jokainen keskustelu on täysin yksityinen: se pyörii selaimessasi omalla tekoälyavaimellasi.',
        ],
      },
      {
        heading: 'Vaihe 1: Valitse hahmo',
        paragraphs: [
          'Mene Hahmot-sivulle ja selaa kirjastoa. Jokaisella hahmolla on nimi, iskulause, lyhyt kuvaus ja persoonallisuustagit, joten tiedät, mihin ryhdyt, ennen kuin aloitat.',
          'Oletko uusi romanssiroolipeleissä? Aloita ”comfort”- tai ”slow burn” -hahmolla. Ne ovat lempeämpiä ja anteeksiantavampia — täydellisiä tasapainon löytämiseen. Voit aina kokeilla rajumpaa hahmoa myöhemmin.',
          'Kun löydät mieleisesi hahmon, avaa sen sivu klikkaamalla korttia. Lue kuvaus ja aloitusviesti — tuo aloitusviesti on juuri niin keskustelunne alkaa.',
        ],
      },
      {
        heading: 'Vaihe 2: Avaa sovellus ja lisää tekoälyavaimesi',
        paragraphs: [
          'Klikkaa ”Aloita yksityinen keskustelu” -painiketta millä tahansa hahmosivulla avataksesi sovelluksen. Ennen ensimmäistä viestiäsi sinun on lisättävä tekoälyavain — lyhyt salainen merkkijono, jonka avulla sovellus pystyy keskustelemaan tekoälytarjoajan kanssa.',
          'Eikö sinulla ole vielä avainta? Katso oppaamme tekoälyavaimen hankkimisesta — siinä menee noin kaksi minuuttia. Avaimesi tallentuu vain selaimeesi; emme näe sitä koskaan emmekä tallenna sitä palvelimelle.',
          'Kun avain on paikallaan, sovellus on valmis. Tätä ei tarvitse tehdä uudelleen, ellet vaihda laitetta tai tyhjennä selaindataasi.',
        ],
      },
      {
        heading: 'Vaihe 3: Lähetä ensimmäinen viestisi',
        paragraphs: [
          'Hahmo on jo lähettänyt sinulle aloitusviestin — se asettaa näyttämön. Sinun tehtäväsi on vain vastata. Sinun ei tarvitse olla kirjailija. Sinun ei tarvitse olla nokkela. Kirjoita vain se, mitä todella sanoisit.',
          'Loistava ensimmäinen viesti on usein lyhyt ja inhimillinen: reaktio, kysymys tai tähdillä kuvattu ele. Jos esimerkiksi viileä lääkäri ojentaa sinulle kahvin, voit vain sanoa ”Kiitos” ja katsoa, mitä tapahtuu.',
          'Tekoäly vastaa roolissaan, ja tarina kasvaa siitä eteenpäin. Väärää tapaa pelata ei ole — seuraa uteliaisuuttasi, niin hahmo tulee vastaan.',
        ],
      },
      {
        heading: 'Vinkkejä ensimmäiseen istuntoon',
        paragraphs: [
          'Pysy itse roolissa, jos voit — se saa maailman tuntumaan todellisemmalta. Mutta on ihan okei myös astua syrjään ja nauttia kyydistä.',
          'Jos vastaus ei tunnu oikealta, voit luoda sen uudelleen tai muokata edellistä viestiäsi. Roolipeli on yhteistyötä; saat ohjata.',
          'Ennen kaikkea: ei ole kiirettä. Parhaat roolipelit aukeavat hitaasti. Anna suhteen hengittää.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Miten saat tekoälyavaimen', to: '/guides/how-to-get-an-api-key' },
      { label: 'Vinkkejä parempaan roolipeliin', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Näin saat tekoälyavaimen RoleChat AI:hin',
    datePublished: '2026-07-15',
    description:
      'Vaiheittainen opas OpenAI-yhteensopivan API-avaimen hankkimiseen ja RoleChat AI:hin liittämiseen. Teknistä taustaa ei tarvita — siinä menee noin kaksi minuuttia.',
    sections: [
      {
        heading: 'Mitä API-avain on?',
        paragraphs: [
          'API-avain on lyhyt salainen merkkijono — se alkaa yleensä ”sk-” — jonka avulla RoleChat AI voi keskustella tekoälytarjoajan kanssa sinun puolestasi. Näin sovellus tietää, että sinulla on oikeus käyttää tekoälyä.',
          'Tuot oman avaimesi, mikä tarkoittaa, että valitset tarjoajan itse, maksat vain siitä mitä käytät, ja keskustelusi kulkevat suoraan selaimesi ja kyseisen tarjoajan välillä. Välikäsiä ei ole.',
        ],
      },
      {
        heading: 'Vaihe 1: Valitse tarjoaja',
        paragraphs: [
          'RoleChat AI toimii minkä tahansa tarjoajan kanssa, joka tarjoaa OpenAI-yhteensopivan rajapinnan. Suosittuja vaihtoehtoja ovat muun muassa tunnetut laboratoriot ja uudet edulliset tarjoajat. Valitse alueellasi saatavilla oleva ja budjettiisi sopiva.',
          'Etkö tiedä, mistä aloittaa? Etsi tarjoaja, joka tarjoaa anteliaan ilmaisen kokeilujakson tai pienen viestikohtaisen hinnan. Voit aina vaihtaa myöhemmin liittämällä uuden avaimen Asetukset-kohtaan.',
        ],
      },
      {
        heading: 'Vaihe 2: Luo tili ja luo avain',
        paragraphs: [
          'Rekisteröidy valitsemasi tarjoajan sivustolla ja etsi hallintapaneelistasi ”API keys”- tai ”Access tokens” -osio. Klikkaa ”Create new key”, anna sille nimi jonka muistat, ja kopioi näytetty merkkijono.',
          'Tärkeää: useimmat tarjoajat näyttävät koko avaimen vain kerran. Tallenna se heti turvalliseen paikkaan — jos menetät sen, sinun on luotava uusi.',
        ],
      },
      {
        heading: 'Vaihe 3: Lisää avain RoleChat AI:hin',
        paragraphs: [
          'Avaa RoleChat AI -sovellus, klikkaa Asetukset ja liitä avaimesi ”API Key” -kenttään. Lisää tarjoajan päätepisteen osoite ”API Endpoint” -kenttään (se näkyy yleensä samalla hallintapaneelin sivulla kuin avaimesi).',
          'Valinnaisesti voit valita mallin pudotusvalikosta. Jos olet epävarma, valitse tarjoajan suosittelema oletus — se on tasapainotettu laadun ja hinnan suhteen.',
          'Siinä kaikki. Olet valmis keskustelemaan. Avaimesi pysyy selaimessasi, eikä sitä lähetetä meille koskaan.',
        ],
      },
      {
        heading: 'Pidä avaimesi turvassa',
        paragraphs: [
          'Älä koskaan jaa API-avaintasi julkisesti — se on kuin salasana tekoälytilillesi. Jos epäät sen vuotaneen, luo uusi avain tarjoajallasi ja päivitä Asetukset.',
          'Jaetulla tai julkisella laitteella älä laita ”tallenna avain tähän selaimeen” -asetusta päälle. Omalla laitteellasi sen voi turvallisesti tallentaa helppokäyttöisyyden vuoksi.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Avaa sovellus ja lisää avaimesi', to: '/app' },
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Aloita ensimmäinen roolipelisi', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Vinkkejä parempaan tekoälyroolipeliin',
    datePublished: '2026-07-15',
    description:
      'Pieniä tapoja, joiden ansiosta tekoälyhahmot tuntuvat elävämmiltä — sävy, tahti ja miten ohjaat tarinaa lempeästi rikkomatta uppoutumista.',
    sections: [
      {
        heading: 'Vastaa ihmisenä, ei kehotteena',
        paragraphs: [
          'Suurin aloittelijan virhe on kirjoittaa tekoälylle hahmon sijaan. Älä kuvaa, mitä haluat tapahtuvan — sano vain se, mitä todella sanoisit. Tekoäly pelaa kohtausta jo valmiiksi; sinun tehtäväsi olla mukana siinä.',
          'Lyhyet, aitouden huokuvat vastaukset toimivat lähes aina paremmin kuin pitkät, ylikirjoitetut. Aito ”En tiedä, mitä sanoa” voi viedä kohtausta pidemmälle kuin kokonainen kappale kerrontaa.',
        ],
      },
      {
        heading: 'Käytä toimintoja tähdissä',
        paragraphs: [
          'Pienen toiminnon kääriminen tähtiin — kuten *katsoo muualle* tai *ojentaa hänelle kupin* — antaa hahmolle jotain fyysistä, johon reagoida. Se on helpoin tapa lisätä sävyä kirjoittamatta romaania.',
          'Älä liioittele. Yksi tai kaksi toimintoa viestissä riittää. Liian monesta alkaa tuntua näyttämöohjeilta keskustelun sijaan.',
        ],
      },
      {
        heading: 'Anna suhteen hengittää',
        paragraphs: [
          'Parhaat romanssiroolipelit ovat hitaita. Jos kiirehdit tunnustukseen ensimmäisten kolmen viestin aikana, hahmolla ei ole minne kasvaa. Anna luottamuksen rakentua, anna jännitteen hautua, anna pienten hetkien merkitä.',
          'Hahmot on kirjoitettu ottamalla huomioon tunnetahti — liian kova ja liian nopea painostus voi saada ne tuntumaan roolista poispäin. Seuraa niiden johtoa, niin palkinto on sen arvoinen.',
        ],
      },
      {
        heading: 'Ohjaa, kun on tarpeen',
        paragraphs: [
          'Roolipeli on yhteistyötä. Jos vastaus ei sovi haluamaasi tarinaan, voit muokata edellistä viestiäsi ja yrittää uudelleen tai luoda hahmon vastauksen uudelleen. Et ole juuttunut ensimmäiseen versioon.',
          'Voit myös ohjata lempeästi roolissa: vaihda aihetta, poistu huoneesta, kysy kysymys. Hahmo yleensä seuraa sinua rikkomatta kohtausta.',
        ],
      },
      {
        heading: 'Tiedä, milloin lopettaa',
        paragraphs: [
          'Loistava roolipeli-istunto on kuin hyvä luku — se päättyy luonnolliseen taukoon. Kun olet väsynyt, lopeta. Keskustelu on täällä, kun palaat, ja hahmo muistaa, mihin jäitte.',
          'Maratonistunnoista ei jaeta palkintoja. Tarina paranee, kun olet virkeä.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Uusi roolipeleissä? Aloita tästä', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'OpenRouterin käyttö tekoälyhahmojen roolileikissä',
    datePublished: '2026-07-15',
    description:
      'Aloittelijan askel-askeleelta -opas OpenRouterin käyttöön RoleChat AI:n kanssa. Luo tili, hae API-avaimesi, valitse malli ja keskustele omien romanssihahmojen kanssa muutamassa minuutissa.',
    sections: [
      {
        heading: 'Mitä OpenRouter on?',
        paragraphs: [
          'OpenRouter on palvelu, joka tarjoaa pääsyn kymmeniin eri tarjoajien tekoälymalleihin yhden APIn kautta. Sinun ei tarvitse rekisteröityä erikseen OpenAI:lle, Anthropicille, Googlelle ja muille — riittää, että luot yhden OpenRouter-tilin ja voit käyttää mitä tahansa sen tarjoamia malleja.',
          'Tekoälyroolipelaamiseen tämä on aivan ylivertainen kätevyys. Voit kokeilla eri malleja, vertailla niiden kirjoitustyyliä ja vaihtaa milloin tahdet — ilman, että sinun pitää vaihtaa API-avainta tai poistua sovelluksesta.',
        ],
      },
      {
        heading: 'Miksi OpenRouter sopii roolileikkiin',
        paragraphs: [
          'Roolileikki vaatii malleja, jotka ovat hyviä luovassa kirjoittamisessa, pysyvät hahmossa ja tuottavat pidempiä, uppoutuvia vastauksia. OpenRouter tarjoaa pääsyn useisiin tällaisiin malleihin, joukossaan todella edullisia.',
          'Koska maksat vain siitä, mitä käytät, voit kokeilla vapaasti. Aloita halvemmasta mallista, ja jos teksti tuntuu laimealta, kokeile tehoisampaa — vaihto hoituu sekunneissa.',
        ],
      },
      {
        heading: 'Vaihe 1: Luo OpenRouter-tili',
        paragraphs: [
          'Mene osoitteeseen openrouter.ai ja rekisteröidy. Prosessi on yksinkertainen — tarvitset sähköpostiosoitteen ja tavan ladata tilille pieni summa krediittiä (OpenRouter hyväksyy useita maksutapoja).',
          'Summan ei tarvitse olla suuri. Muutamalla dollarilla saat satoja roolileikkiviestejä useimpien mallien kanssa. Voit aina täydentää saldoa myöhemmin.',
        ],
      },
      {
        heading: 'Vaihe 2: Hae API-avaimesi',
        paragraphs: [
          'Kirjauduttuasi siirry OpenRouter-hallintapaneelin Keys-osaan. Klikkaa "Create Key", anna sille helposti muistettava nimi ja kopioi näytettävä merkkijono.',
          'Tärkeää: OpenRouter näyttää koko avaimen vain kerran. Tallenna se heti turvalliseen paikkaan — jos hukkaat sen, joudut luomaan uuden.',
        ],
      },
      {
        heading: 'Vaihe 3: Lisää se RoleChat AI:hin',
        paragraphs: [
          'Avaa RoleChat AI -sovellus ja klikkaa yläpalkista "Connect AI". Valitse Asetukset-paneelissa "OpenRouter"-pikatoimintopainike — se täyttää oikean endpoint-osoitteen automaattisesti.',
          'Liitä OpenRouterin API-avaimesi API Key -kenttään. Kirjoita sen jälkeen mallin nimi Model-kenttään (esimerkiksi hyvä lähtökohta on edullinen keskustelumalli). Klikkaa tallenna, niin yhteys on valmis.',
        ],
      },
      {
        heading: 'Vaihe 4: Valitse hahmo ja aloita keskustelu',
        paragraphs: [
          'Nyt kun avaimesi on kunnossa, selaa hahmokirjastoa ja valitse joku, joka kiinnostaa. Klikkaa "Start Chat", niin hahmo lähettää sinulle avausviestinsä.',
          'Kirjoita vastauksesi, niin saat hahmon roolissa sekunneissa vastauksen. Siinä se — olet roolileikissä. Jos kirjoitustyyli ei miellytä, kokeile toista mallia OpenRouterista ja katso, miten se muuttaa tunnelmaa.',
        ],
      },
      {
        heading: 'Vinkkejä mallin valintaan OpenRouterissa',
        paragraphs: [
          'Romanssiroolileikkiin kannattaa etsiä malleja, jotka ovat tunnettuja luovasta kirjoittamisesta ja pidemmistä vastauksista. Yleensä suuremmat mallit kirjoittavat rikkaammin mutta maksavat enemmän per viesti; pienemmät mallit ovat halvempia mutta saattavat tuottaa lyhyempiä ja vähemmän nyansoituja vastauksia.',
          'Aloita jostain edullisesta, tunne rytmi ja päivitä mallia, jos kaipaat runsaampaa proosaa. Väärää valintaa ei ole — paras malli on se, jonka kirjoitustyyliä nautit eniten.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Näin aloitat tekoälyroolileikin', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Vinkkejä parempaan roolileikkiin', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Mitä on tekoälyhahmon kortti?',
    datePublished: '2026-07-15',
    description:
      'Aloittelijaystävällinen selitys tekoälyhahmojen korteista: mitä ne ovat, miten ne toimivat ja miten käytät niitä RoleChat AI:ssa yksityisessä romanssiroolileikissä.',
    sections: [
      {
        heading: 'Mitä hahmokortti on?',
        paragraphs: [
          'Hahmokortti on tiedosto, joka määrittelee tekoälyhahmon persoonan, taustatarinan ja käytöksen. Ajattele sitä yksityiskohtaisena profiilina, joka kertoo tekoälylle, ketä sen tulee esittää — nimen, puhetyylin, asiat jotka ovat hahmolle tärkeitä ja suhteen sinuun.',
          'Kun aloitat keskustelun, sovellus lukee hahmokortin ja käyttää sitä ohjaamaan jokaista vastausta. Lopputulos on keskustelu, joka tuntuu aidolta henkilöltä jolla on oma äänensä — ei geneeriseltä chatabotalta.',
        ],
      },
      {
        heading: 'Mitä hahmokortti sisältää?',
        paragraphs: [
          'Tyypillinen hahmokortti sisältää useita keskeisiä tietoja: nimen, kuvauksen (kuka hahmo on ja mikä on hänen taustatarinansa), persoonan (miten hän käyttäytyy ja puhuu), skenaarion (miljöö ja miten tapaatte) sekä ensimmäisen viestin (aloituslause, joka käynnistää keskustelun).',
          'Jotkin kortit sisältävät myös esimerkkikeskusteluja, jotka näyttävät tekoälylle, miten hahmo oikeasti puhuu. Tämä auttaa tekoälyä omaksumaan hahmon ainutlaatuisen äänen — sanavalinnat, rytmin, pienet tavat.',
        ],
      },
      {
        heading: 'Hahmokortin muodot: V1, V2 ja V3 yksinkertaisesti',
        paragraphs: [
          'Ajan myötä yhteisö on kehittänyt useita versioita hahmokortin muodosta. V1 on yksinkertaisin — pelkät perusasiat. V2 lisää kenttiä kuten vaihtoehtoiset tervehdykset ja tekijän huomautukset. V3 on yksityiskohtaisin, ja siinä on tilaa laajennuksille ja runsaammalle metadatalle.',
          'Sinun ei tarvitse välittää siitä, mikä versio on kumpikin. RoleChat AI tukee kaikkia kolmea automaattisesti. Kun valitset tai tuot kortin, sovellus tunnistaa muodon ja hoitaa sen puolestasi.',
        ],
      },
      {
        heading: 'Miten hahmokortit toimivat RoleChat AI:ssa',
        paragraphs: [
          'RoleChat AI sisältää sisäänrakennetun kirjaston omia hahmoja — jokaista määrittelee oma hahmokorttinsa. Sinun ei tarvitse etsiä tai ladata mitään. Selaa vain kirjastoa, valitse hahmo ja aloita keskustelu.',
          'Jos sinulla on jo hahmokortti toisesta työkalusta (esimerkiksi SillyTavern), voit tuoda sen. RoleChat AI lukee vakio-JSON-kortit ja upotetun datan sisältävät PNG-kortit, joten nykyinen kirjastosi toimii myös täällä.',
        ],
      },
      {
        heading: 'Sisäänrakennetut hahmot vai omien tuonti',
        paragraphs: [
          'Useimmille aloittelijoille helpoin tie on lähteä liikkeelle sisäänrakennetusta hahmokirjastosta. Jokainen hahmo on alkuperäinen, kirjoitettu erityisesti romanssiroolileikkiin ja valmiina keskusteluun — ainoa vaatimus on tekoälyavaimen lisääminen.',
          'Jos olet kokeneempi ja sinulla on kokoelma kortteja, tuontiominaisuus tuo ne mukanasi. Molemmat tavat toimivat — sisäänrakennettu kirjasto on vain nopeampi tapa päästä alkuun.',
        ],
      },
      {
        heading: 'Ovatko hahmokortit turvallisia?',
        paragraphs: [
          'Kyllä. Hahmokortti on vain tekstidataa — se ei sisällä koodia tai skriptejä. Se ei voi vahingoittaa laitettasi tai päästä henkilökohtaisten tietojesi käsiksi. Pahinta, mitä huonosti kirjoitettu kortti voi tehdä, on sekaannusta herättävä keskustelu.',
          'RoleChat AI:ssa keskustelusi pysyvät selaimessasi, ja hahmodatan käsittelee valitsemasi tekoälytarjoaja. Kukaan muu ei näe keskustelujasi.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Näin aloitat tekoälyroolileikin', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern vai Web Tavern: kumpi on helpompi?',
    datePublished: '2026-07-15',
    description:
      'Ystävällinen vertailu SillyTavernista ja RoleChat AI:sta (ent. Web Tavern) aloittelijoille. Asennus, käyttöönotto, yksityisyys ja hahmokortit — kumpi sopii sinulle?',
    sections: [
      {
        heading: 'Mitä SillyTavern on?',
        paragraphs: [
          'SillyTavern on suosittu, tehokas ja avoimen lähdekoodin käyttöliittymä tekoälyroolileikille. Se on ollut markkinoilla vuosia ja sillä on innostunut yhteisö. Se tukee valtavaa määrää asetuksia, esiasetuksia, laajennuksia ja hahmokorttimuotoja.',
          'Hinta tästä on monimutkaisuus. SillyTavern vaatii asennuksen — ajat sitä omalla tietokoneellasi, määritä yhteydet tekoälytarjoajiin ja navigoi tiheässä käyttöliittymässä, joka on täynnä edistyneitä parametreja. Teknisesti orientoituneille käyttäjille tuo teho on ominaisuus. Useimmille aloittelijoille se on muuri.',
        ],
      },
      {
        heading: 'Mitä on RoleChat AI (ent. Web Tavern)?',
        paragraphs: [
          'RoleChat AI — alun perin Web Tavern — on selainpohjainen tekoälyroolipelaamisen sovellus, joka on suunniteltu helppokäyttöiseksi. Mitään ei tarvitse asentaa. Avaat verkkosivun, valitset hahmon, lisäät tekoälyavaimesi ja aloitat keskustelun.',
          'Se säilyttää yksityisyysperiaatteen, joka tekee SillyTavernista viehättävän (tuo oma avain, ei välikäsiä lukemassa keskustelujasi), mutta riisuu pelottavan käyttöönoton. Tavoite on yksinkertainen: helpoin yksityinen tekoälyroolileikki.',
        ],
      },
      {
        heading: 'Asennus: monimutkainen vai nolla',
        paragraphs: [
          'SillyTavern vaatii sovelluksen lataamisen, Node.js:n asentamisen, komentoriviskriptien ajamisen ja palvelinprosessin ylläpidon keskustelun ajan. Mobiilikäyttö vaatii lisäkaukoasetuksia.',
          'RoleChat AI toimii kokonaan selaimessasi. Ei latauksia, ei terminaalia, ei palvelinta. Se toimii pöytäkoneella, kannettavalla, tabletilla ja puhelimella — avaa vain sivu ja aloita.',
        ],
      },
      {
        heading: 'Käyttöönotto: syvät parametrit vai aloittelijaystävällisyys',
        paragraphs: [
          'SillyTavern tuo pääikkunaan temperaturen, top-p:n, kontekstin pituuden, otantamenetelmät, kehotemallit, world infon ja kymmeniä muita asetuksia. Edistyneille käyttäjille, jotka haluavat hienosäätää joka yksityiskohdan, se on tehokasta.',
          'RoleChat AI piilottaa kaiken sen Advanced-osion taakse. Oletusnäkymässä näet hahmosi, viestisi ja syöttökentän. Jos haluat myöhemmin sukeltaa parametreihin, ne ovat siellä — mutta sinun ei koskaan tarvitse koskea niihin.',
        ],
      },
      {
        heading: 'Yksityisyys: molemmat kunnioittavat dataasi',
        paragraphs: [
          'Sekä SillyTavern että RoleChat AI käyttävät "tuo oma avain" -mallia. Yhdistät oman tekoälytarjoajatilisi, ja viestisi kulkevat suoraan laitteesi ja kyseisen tarjoajan välillä. Kumpikaan palvelu ei ylläpidä välikäsipalvelinta, joka lukisi keskustelujasi.',
          'Tämä on keskeinen yksityisyysetu verrattuna moniin kaupallisiin roolileikkisovelluksiin, jotka reitittävät keskustelusi omien palvelimiensa kautta. Sekä SillyTavernin että RoleChat AI:n kanssa keskustelusi ovat omiasi.',
        ],
      },
      {
        heading: 'Hahmokortit: täysin yhteensopivat',
        paragraphs: [
          'Molemmat työkalut tukevat samoja hahmokorttimuotoja (V1-, V2- ja V3-JSON sekä PNG). Jos sinulla on korttikokoelma SillyTavernista, voit tuoda nämä kortit RoleChat AI:hin suoraan.',
          'RoleChat AI tarjoaa myös sisäänrakennetun kirjaston omia romanssihahmoja, joten vaikka sinulla ei olisi kortteja, voit aloittaa keskustelun heti.',
        ],
      },
      {
        heading: 'Minkä valitset?',
        paragraphs: [
          'Jos rakastat säätämistä, haluat maksimaalisen hallinnan jokaiseen parametriin ja tekninen käyttöönotto ei haittaa, SillyTavern on loistava valinta vahvalla yhteisöllä.',
          'Jos haluat avata sivun ja aloittaa roolileikin alle minuutissa — ilman asennusta tai sitä, että opit mitä "top-p" tarkoittaa — RoleChat AI on tehty sinulle. Voit aina siirtyä myöhemmin SillyTaverniin, ja hahmokorttisi tulevat mukanasi.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Mitä on hahmokortti?', to: '/guides/what-is-a-character-card' },
      { label: 'Näin aloitat tekoälyroolileikin', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Parhaat tekoälyroolipelin kehotteet aloittelijoille',
    datePublished: '2026-07-15',
    description:
      'Yksinkertaisia ja tehokkaita tekoälyroolipelin kehotteita ja tekniikoita aloittelijoille. Opi luomaan tilanne, rakentamaan tunnetta ja herättämään hahmosi eloon — kokemusta ei tarvita.',
    sections: [
      {
        heading: 'Mikä tekee hyvän roolipeli-kehotteen?',
        paragraphs: [
          'Tekoälyroolipelissä ”kehote” ei ole tekninen komento — se on yksinkertaisesti tapasi kirjoittaa viestejäsi. Mitä elävämmän ja yksityiskohtaisemman syötteen annat, sitä rikkaampi on hahmon vastaus. Hyvät kehotteet antavat tekoälylle materiaalia: tunnelman, ympäristön, tunteen, pienen teon.',
          'Sinun ei tarvitse olla mestarikirjailija. Riittää, että annat hahmolle jotain aitoa, mihin reagoita. Tässä on viisi yksinkertaista tekniikkaa, jotka toimivat minkä tahansa hahmon kanssa.',
        ],
      },
      {
        heading: 'Kehote 1: Aseta tilanne',
        paragraphs: [
          'Sen sijaan, että hyppäät suoraan vuoropuheluun, maalaa kuva siitä, missä olet. Yksi ainoa lause tilanteen kuvauksesta ankkuroi keskustelun ja antaa hahmolle jotain, mihin tarttua.',
          'Esimerkki: ”*Sade ei ole tauonnut tunteihin. Työnnän kahvilan oven auki, pursuen vettä, ja katselen ympärille tyhjän paikan toivossa.” Tämä antaa hahmolle ympäristön, tunnelman ja syyn huomata sinut. Vastaus tulee olemaan huomattavasti elävämpi kuin jos olisit vain sanonut ”Hei.”',
        ],
      },
      {
        heading: 'Kehote 2: Määritä suhde aikaisin',
        paragraphs: [
          'Tekoäly tarvitsee kontekstia siitä, kuka olet hahmolle. Oletteko ventovieraita? Vanhoja ystäviä? Kilpailijoita? Lyhyt lause ensimmäisessä viestissäsi voi muokata koko keskustelun suunnan.',
          'Esimerkki: ”Emme ole puhuneet valmistujaisista lähtien, ja olen hermostunut, kun kävelen pöytäsi luo.” Tämä kertoo hahmolle, että välillänne on historiaa, että tunnelma on kireä ja että tällä hetkellä on merkitystä. Tekoäly tarttuu tähän dynamiikkaan.',
        ],
      },
      {
        heading: 'Kehote 3: Lisää tunnesyvyys',
        paragraphs: [
          'Hahmot heräävät henkiin, kun näytät mitä tunnet — et ainoastaan mitä teet. Pieni rehellinen tunne viestissäsi houkuttelee hahmon vastaamaan omilla tunteillaan.',
          'Esimerkki: ”*Yritän pitää ääneni vakaana, mutta käteni tärisevät.* En uskonut koskaan näkeväni sinua uudelleen.” Haavoittuvuus tässä antaa hahmolle luvan olla itsekin haavoittuva — ja juuri siitä syntyvät parhaat roolipelihetket.',
        ],
      },
      {
        heading: 'Kehote 4: Luo kevyttä jännitettä',
        paragraphs: [
          'Keskustelu, jossa kaikki sujuu sutjakkaasti, tylsistyy nopeasti. Tuoda mukaan pieni este — väärinkäsitys, salaisuus, hetken epäröinti — ja katso, kuinka hahmo sitoutuu syvemmin.',
          'Esimerkki: ”Haluan kertoa sinulle totuuden, mutta joka kerta kun avaan suuni, sanat eivät tule.” Tämä antaa hahmolle syyn painostaa, odottaa, miettiä. Se muuttaa tasaisen vaihdon kohtaukseksi, jossa on panosta.',
        ],
      },
      {
        heading: 'Kehote 5: Pysy itse roolissa',
        paragraphs: [
          'Mitä enemmän pysyt roolissa, sitä enemmän tekoälykin pysyy. Käytä tähteitä toimintaan, lainausmerkkejä puheeseen ja pidä rool ulkopuoliset kommenttisi lyhyinä. Sinun ei tarvitse olla täydellinen — riittää, että olet johdonmukainen.',
          'Esimerkki: ”*Asetan kupin varovasti alas.* ’Sinä aina tiesit, kun minä valehtelin.’” Huomaa, kuinka toiminta ja vuoropuhelu tukevat toisiaan. Hahmolla on nyt ele, sävy ja syytös, joihin reagoida.',
        ],
      },
      {
        heading: 'Kaikki yhteen saattaen',
        paragraphs: [
          'Sinun ei tarvitse käyttää kaikkia viittä tekniikkaa jokaisessa viestissä. Valitse yksi tai kaksi hetkeen sopivaa ja anna keskustelun kulkea luonnollisesti. Paras roolipeli on kuin improvisaatiota — rakennatte toistenne päälle, yksi viesti kerrallaan.',
          'Muista: hahmoa ohjaa sen kortti ja sinun syötteesi. Jos vastaus tuntuu pieleen, yritä muotoilla viestisi uudelleen lisäämällä yksityiskohtia tai tunnetta. Pienet muutokset kirjoitustavassasi voivat muuttaa hahmon vastauksen täysin.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Selaa hahmoja', to: '/characters' },
      { label: 'Avaa sovellus', to: '/app' },
      { label: 'Vinkkejä parempaan roolipeliin', to: '/guides/tips-for-better-roleplay' },
      { label: 'Näin aloitat tekoälyroolipelin', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
