import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Hoe je als beginner begint met AI-roleplay',
    datePublished: '2026-07-15',
    description:
      'Een complete beginnersgids om je eerste AI-roleplay op RoleChat AI te beginnen. Kies een personage, voeg je AI-key toe en stuur je eerste bericht binnen vijf minuten.',
    sections: [
      {
        heading: 'Wat is AI-roleplay?',
        paragraphs: [
          'AI-roleplay is een gesprek tussen jou en een AI die de rol aanneemt van een fictief personage. Je speelt jezelf — of wie je maar wilt zijn — en de AI reageert in karakter, in real-time, en bouwt samen met jou, bericht voor bericht, een verhaal op.',
          'Waar een chatbot vragen beantwoordt, heeft een roleplay-personage een persoonlijkheid, een achtergrondverhaal, een eigen manier van praten en een relatie met jou. Het doel is niet om informatie te krijgen. Het doel is om met iemand in een verhaal te leven dat echt aanvoelt.',
          'Op RoleChat AI is elk personage origineel — niet overgenomen uit een game of serie — en elk gesprek is volledig privé. Het draait in je eigen browser met je eigen AI-key.',
        ],
      },
      {
        heading: 'Stap 1: Kies een personage',
        paragraphs: [
          'Ga naar de pagina Personages en blader door de bibliotheek. Elk personage heeft een naam, een tagline, een korte beschrijving en persoonlijkheidstags, zodat je precies weet waar je aan begint.',
          'Nieuw met romantische roleplay? Begin met een \'comfort\'- of \'slow burn\'-personage. Die zijn zachter en wat coulanter — ideaal om de basis te vinden. Een intenser personage kun je later altijd nog proberen.',
          'Heb je er een gevonden die je bevalt? Klik op de kaart om de personagepagina te openen. Lees de beschrijving en het openingsbericht — dat openingsbericht is precies hoe jullie gesprek zal beginnen.',
        ],
      },
      {
        heading: 'Stap 2: Open de app en voeg je AI-key toe',
        paragraphs: [
          'Klik op de knop \'Start Private Chat\' op een personagepagina om de app te openen. Vóór je eerste bericht moet je een AI-key toevoegen — een korte geheime reeks tekens waarmee de app kan praten met een AI-provider.',
          'Nog geen key? Bekijk onze gids over hoe je aan een AI-key komt — dat kost zo\'n twee minuten. Je key wordt alleen in je browser opgeslagen; wij zien hem nooit en bewaren hem niet op een server.',
          'Zodra je key erin staat, is de app klaar voor gebruik. Dit hoef je niet opnieuw te doen, tenzij je van apparaat wisselt of je browsergegevens wist.',
        ],
      },
      {
        heading: 'Stap 3: Stuur je eerste bericht',
        paragraphs: [
          'Het personage heeft je al een openingsbericht gestuurd — dat is de scenemaker. Jouw taak is simpelweg reageren. Je hoeft geen schrijver te zijn. Je hoeft niet slim te zijn. Typ gewoon wat je ook echt zou zeggen.',
          'Een goed eerste bericht is vaak kort en menselijk: een reactie, een vraag, een gebaar tussen sterretjes. Als een kille dokter je bijvoorbeeld koffie aanreikt, kun je gewoon \'Dankjewel\' zeggen en kijken wat er gebeurt.',
          'De AI reageert in karakter, en vanuit daar groeit het verhaal. Er is geen foute manier om te spelen — volg je nieuwsgierigheid, en het personage komt je tegemoet.',
        ],
      },
      {
        heading: 'Tips voor je eerste sessie',
        paragraphs: [
          'Blijf zelf zoveel mogelijk in karakter — dan voelt de wereld echter. Maar het is ook prima om even een stap terug te doen en gewoon te genieten van de rit.',
          'Als een reactie niet goed voelt, kun je hem opnieuw genereren of je laatste bericht bewerken. Roleplay is samenwerking; je mag de leiding nemen.',
          'En bovenal: neem de tijd. De beste roleplay ontvouwt zich langzaam. Laat de relatie ademen.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'Open de app', to: '/app' },
      { label: 'Hoe kom je aan een AI-key', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips voor betere roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Hoe kom je aan een AI-key voor RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Een stap-voor-stap gids om een OpenAI-compatibele API-key te bemachtigen en toe te voegen aan RoleChat AI. Geen technische achtergrond nodig — zo gepiept in twee minuten.',
    sections: [
      {
        heading: 'Wat is een API-key?',
        paragraphs: [
          'Een API-key is een korte geheime reeks tekens — meestal beginnend met \'sk-\' — waarmee RoleChat AI namens jou met een AI-provider kan praten. Zo weet de provider dat jij toestemming hebt om de AI te gebruiken.',
          'Je gebruikt je eigen key, wat betekent dat jij de provider kiest, alleen betaalt voor wat je gebruikt en dat je gesprekken rechtstreeks tussen je browser en die provider verlopen. Er is geen tussenpersoon.',
        ],
      },
      {
        heading: 'Stap 1: Kies een provider',
        paragraphs: [
          'RoleChat AI werkt met elke provider die een OpenAI-compatibele API aanbiedt. Populaire keuzes zijn bekende labs en nieuwere, goedkopere providers. Kies er een die in jouw regio beschikbaar is en binnen je budget past.',
          'Geen idee waar je moet beginnen? Zoek een provider met een ruime gratis proefperiode of een lage prijs per bericht. Je kunt later altijd wisselen door een nieuwe key in Instellingen te plakken.',
        ],
      },
      {
        heading: 'Stap 2: Maak een account aan en genereer een key',
        paragraphs: [
          'Meld je aan op de website van je gekozen provider en zoek het gedeelte \'API keys\' of \'Access tokens\' in je dashboard. Klik op \'Create new key\', geef het een naam die je kunt onthouden en kopieer de reeks tekens die wordt getoond.',
          'Belangrijk: de meeste providers tonen de volledige key maar één keer. Sla hem meteen ergens veilig op — ben je hem kwijt, dan moet je een nieuwe aanmaken.',
        ],
      },
      {
        heading: 'Stap 3: Voeg hem toe aan RoleChat AI',
        paragraphs: [
          'Open de RoleChat AI-app, klik op Instellingen en plak je key in het veld \'API Key\'. Vul de endpoint-URL van de provider in het veld \'API Endpoint\' in (deze staat meestal op dezelfde dashboardpagina als je key).',
          'Kies desgewenst een model uit het keuzemenu. Twijfel je? Kies dan de aanbevolen standaardoptie van de provider — die is afgestemd op een goede balans tussen kwaliteit en kosten.',
          'Dat is alles. Je bent klaar om te chatten. Je key blijft in je browser en wordt nooit naar ons gestuurd.',
        ],
      },
      {
        heading: 'Je key veilig houden',
        paragraphs: [
          'Deel je API-key nooit publiekelijk — het is als een wachtwoord voor je AI-account. Denk je dat hij is gelekt? Genereer dan een nieuwe bij je provider en werk Instellingen bij.',
          'Op een gedeeld of openbaar apparaat: zet \'sleutel opslaan in deze browser\' niet aan. Op je eigen apparaat is het veilig om hem voor het gemak op te slaan.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Open de app om je key toe te voegen', to: '/app' },
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'Begin je eerste roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips voor betere AI-roleplay',
    datePublished: '2026-07-15',
    description:
      'Kleine gewoontes die AI-personages levendiger laten aanvoelen — toon, tempo en hoe je het verhaal zachtjes bijstuurt zonder de illusie te breken.',
    sections: [
      {
        heading: 'Reageer als een mens, niet als een prompt',
        paragraphs: [
          'De grootste beginnersfout is schrijven naar de AI in plaats van naar het personage. Beschrijf niet wat je wilt dat er gebeurt — zeg gewoon wat je ook echt zou zeggen. De AI speelt de scène al; jouw taak is om erin te zijn.',
          'Korte, oprechte reacties werken bijna altijd beter dan lange, over-uitgeschreven antwoorden. Een eerlijk \'Ik weet niet wat ik moet zeggen\' kan een scène verder brengen dan een hele alinea vertelling.',
        ],
      },
      {
        heading: 'Gebruik acties tussen sterretjes',
        paragraphs: [
          'Een kleine actie tussen sterretjes plaatsen — zoals *kijkt weg* of *geeft hem de beker* — geeft het personage iets tastbaars om op te reageren. Het is de makkelijkste manier om textuur toe te voegen zonder een hele roman te schrijven.',
          'Overdrijf het niet. Eén of twee acties per bericht is ruim voldoende. Te veel, en het gaat aanvoelen als regieaanwijzingen in plaats van een gesprek.',
        ],
      },
      {
        heading: 'Laat de relatie ademen',
        paragraphs: [
          'De beste romantische roleplay is langzaam. Als je in de eerste drie berichten al naar een liefdesverklaring stormt, heeft het personage geen ruimte om te groeien. Laat vertrouwen opbouwen, laat spanning sudderen, laat de kleine momenten ertoe doen.',
          'Personages zijn geschreven met oog voor emotionele opbouw — te hard en te snel duwen kan ze uit karakter laten voelen. Volg hun tempo, en de beloning is het waard.',
        ],
      },
      {
        heading: 'Stuur bij als het moet',
        paragraphs: [
          'Roleplay is samenwerking. Past een reactie niet bij het verhaal dat je wilt, dan kun je je laatste bericht bewerken en opnieuw proberen, of het antwoord van het personage opnieuw genereren. Je zit niet vast aan de eerste versie.',
          'Je kunt ook zachtjes bijsturen in karakter: verander van onderwerp, verlaat de kamer, stel een vraag. Het personage volgt je lead meestal zonder de scène te breken.',
        ],
      },
      {
        heading: 'Weet wanneer je moet stoppen',
        paragraphs: [
          'Een geweldige roleplay-sessie is als een goed hoofdstuk — hij eindigt bij een natuurlijk pauzemoment. Ben je moe? Stop dan. Het gesprek is er nog als je terugkomt, en het personage weet nog waar jullie gebleven waren.',
          'Er is geen prijs voor marathonsessies. Het verhaal wordt beter als je fris bent.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'Open de app', to: '/app' },
      { label: 'Nieuw met roleplay? Begin hier', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'OpenRouter gebruiken voor AI-rolplay met personages',
    datePublished: '2026-07-15',
    description:
      'Een duidelijke beginnersgids voor het gebruik van OpenRouter met RoleChat AI. Maak een account aan, haal je API-sleutel op, kies een model en begin binnen enkele minuten met chatten met originele romantische personages.',
    sections: [
      {
        heading: 'Wat is OpenRouter?',
        paragraphs: [
          'OpenRouter is een dienst die je via één enkele API toegang geeft tot tientallen AI-modellen van verschillende aanbieders. In plaats van je apart in te schrijven bij OpenAI, Anthropic, Google en anderen, maak je één OpenRouter-account aan en gebruik je elk model dat ze aanbieden.',
          'Voor AI-rolplay is dat ontzettend handig. Je kunt verschillende modellen uitproberen, hun schrijfstijl vergelijken en op elk moment wisselen — allemaal zonder je API-sleutel te veranderen of de app te verlaten.',
        ],
      },
      {
        heading: 'Waarom OpenRouter zo goed werkt voor rolplay',
        paragraphs: [
          'Rolplay heeft modellen nodig die goed zijn in creatief schrijven, in hun personage blijven en langere, meeslepende antwoorden geven. OpenRouter geeft je toegang tot veel van dat soort modellen, waaronder enkele die erg betaalbaar zijn.',
          'Omdat je alleen betaalt voor wat je gebruikt, kun je vrijuit experimenteren. Begin met een goedkoper model, en als het schrijven wat vlak aanvoelt, probeer dan een krachtiger model — het wisselen duurt slechts enkele seconden.',
        ],
      },
      {
        heading: 'Stap 1: Maak een OpenRouter-account aan',
        paragraphs: [
          'Ga naar openrouter.ai en schrijf je in. Het proces is eenvoudig — je hebt een e-mailadres nodig en een manier om een klein bedrag aan tegoed toe te voegen (OpenRouter accepteert verschillende betaalmethoden).',
          'Je hoeft niet veel toe te voegen. Een paar dollar is genoeg voor honderden rolplay-berichten bij de meeste modellen. Je kunt later altijd meer tegoed toevoegen.',
        ],
      },
      {
        heading: 'Stap 2: Haal je API-sleutel op',
        paragraphs: [
          'Ga, eenmaal ingelogd, naar het gedeelte Keys van je OpenRouter-dashboard. Klik op „Create Key", geef het een naam die je makkelijk kunt onthouden en kopieer de tekenreeks die wordt getoond.',
          'Belangrijk: OpenRouter toont de volledige sleutel maar één keer. Sla hem direct ergens veilig op — als je hem kwijtraakt, moet je een nieuwe aanmaken.',
        ],
      },
      {
        heading: 'Stap 3: Voeg hem toe aan RoleChat AI',
        paragraphs: [
          'Open de RoleChat AI-app en klik op „Connect AI" in de bovenste balk. Klik in het paneel Settings op de snelknop „OpenRouter" — hiermee wordt automatisch de juiste endpoint-URL ingevuld.',
          'Plak je OpenRouter-API-sleutel in het veld API Key. Vul daarna een modelnaam in bij het veld Model (een betaalbaar chatmodel is bijvoorbeeld een goed startpunt). Klik op opslaan en je bent verbonden.',
        ],
      },
      {
        heading: 'Stap 4: Kies een personage en begin met chatten',
        paragraphs: [
          'Nu je sleutel is ingesteld, kun je de personagebibliotheek doorbladeren en iemand kiezen die je aanspreekt. Klik op „Start Chat" en het personage stuurt jou zijn openingsbericht.',
          'Typ je antwoord en binnen enkele seconden ontvang je een reactie in karakter. Dat is alles — je bent aan het rolplayen. Als de schrijfstijl je niet bevalt, probeer dan een ander model van OpenRouter en zie hoe het verandert.',
        ],
      },
      {
        heading: 'Tips voor het kiezen van een model op OpenRouter',
        paragraphs: [
          'Kijk voor romantische rolplay naar modellen die bekendstaan om creatief schrijven en langere uitvoer. Over het algemeen schrijven grotere modellen rijker, maar kosten ze meer per bericht; kleinere modellen zijn goedkoper, maar leveren soms kortere of minder genuanceerde antwoorden.',
          'Begin met iets betaalbaars, voel de flow ervan en schakel over als je rijkere prosa wilt. Er is geen „verkeerde" keuze — het beste model is degene waar je het meest van geniet.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'App openen', to: '/app' },
      { label: 'Hoe begin je met AI-rolplay', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips voor betere rolplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Wat is een AI-personageskaart?',
    datePublished: '2026-07-15',
    description:
      'Een toegankelijke uitleg voor beginners van AI-personageskaarten: wat ze zijn, hoe ze werken en hoe je ze in RoleChat AI gebruikt voor privé-romantische rolplay.',
    sections: [
      {
        heading: 'Wat is een personageskaart?',
        paragraphs: [
          'Een personageskaart is een bestand dat de persoonlijkheid, achtergrond en het gedrag van een AI-personage vastlegt. Zie het als een gedetailleerd profiel dat de AI vertelt wie hij moet zijn — hun naam, hoe ze praten, wat hen uitmaakt en hoe ze zich tot jou verhouden.',
          'Wanneer je een chat start, leest de app de personageskaart en gebruikt die om elk antwoord te sturen. Het resultaat is een gesprek dat aanvoelt als een babbeltje met een echt persoon met een eigen stem, niet met een gewone chatbot.',
        ],
      },
      {
        heading: 'Wat zit er in een personageskaart?',
        paragraphs: [
          'Een typische personageskaart bevat enkele kerngegevens: een naam, een beschrijving (wie ze zijn en hun achtergrondverhaal), een persoonlijkheid (hoe ze zich gedragen en praten), een scenario (de setting en hoe jullie elkaar ontmoeten) en een eerste bericht (de openingszin die het gesprek op gang brengt).',
          'Sommige kaarten bevatten ook voorbeelddialogen, die aan de AI laten zien hoe het personage in de praktijk praat. Zo pakt de AI de unieke stem van het personage op — hun woordkeuze, hun ritme, hun kleine gewoontes.',
        ],
      },
      {
        heading: 'Formaten personageskaarten: V1, V2 en V3 simpel uitgelegd',
        paragraphs: [
          'In de loop der tijd heeft de gemeenschap verschillende versies van het personageskaartformaat ontwikkeld. V1 is de eenvoudigste — alleen de basis. V2 voegt meer velden toe, zoals alternieve begroetingen en notities van de maker. V3 is het meest gedetailleerd, met ruimte voor uitbreidingen en rijkere metadata.',
          'Je hoeft je niet druk te maken over welke versie wat is. RoleChat AI ondersteunt alle drie automatisch. Wanneer je een kaart kiest of importeert, herkent de app het formaat en regelt hij het verder voor je.',
        ],
      },
      {
        heading: 'Hoe personageskaarten werken in RoleChat AI',
        paragraphs: [
          'RoleChat AI wordt geleverd met een ingebouwde bibliotheek van originele personages — elk gedefinieerd door een personageskaart. Je hoeft niets te zoeken of te downloaden. Blader gewoon door de bibliotheek, kies een personage en begin met chatten.',
          'Als je al een personageskaart hebt van een ander hulpmiddel (zoals SillyTavern), kun je die importeren. RoleChat AI leest standaard JSON-kaarten en PNG-kaarten met ingebedde gegevens, dus je bestaande bibliotheek werkt hier ook.',
        ],
      },
      {
        heading: 'Ingebouwde personages versus je eigen kaarten importeren',
        paragraphs: [
          'Voor de meeste beginners is de ingebouwde personagebibliotheek het makkelijkste startpunt. Elk personage is origineel, speciaal geschreven voor romantische rolplay en klaar om mee te chatten zonder verdere installatie dan je AI-sleutel toevoegen.',
          'Als je ervarener bent en een verzameling kaarten hebt, kun je die met de importfunctie meenemen. Beide wegen werken — de ingebouwde bibliotheek is alleen sneller om mee te beginnen.',
        ],
      },
      {
        heading: 'Zijn personageskaarten veilig?',
        paragraphs: [
          'Ja. Een personageskaart is puur tekst — hij bevat geen code of scripts. Hij kan je apparaat geen schade toebrengen en niet bij je persoonlijke gegevens komen. Het ergste wat een slecht geschreven kaart kan doen, is een verwarrend gesprek opleveren.',
          'In RoleChat AI blijven je gesprekken in je browser en worden de personagesgegevens verwerkt door de AI-aanbieder die jij kiest. Niemand anders kan je chats zien.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'App openen', to: '/app' },
      { label: 'Hoe begin je met AI-rolplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern versus Web Tavern: welke is makkelijker?',
    datePublished: '2026-07-15',
    description:
      'Een vriendschappelijke vergelijking van SillyTavern en RoleChat AI (voorheen Web Tavern) voor beginners. Installatie, instellingen, privacy en personageskaarten — welke past bij jou?',
    sections: [
      {
        heading: 'Wat is SillyTavern?',
        paragraphs: [
          'SillyTavern is een populaire, krachtige open-source frontend voor AI-rolplay. Hij bestaat al jaren en heeft een gepassioneerde gemeenschap. SillyTavern ondersteunt een enorme hoeveelheid instellingen, presets, uitbreidingen en formaten personageskaarten.',
          'De keerzijde is de complexiteit. SillyTavern vereist installatie — je draait hem op je eigen computer, stelt verbindingen in met AI-aanbieders en navigeert door een drukke interface vol geavanceerde parameters. Voor technisch onderlegde gebruikers is die kracht een pluspunt. Voor de meeste beginners is het een drempel.',
        ],
      },
      {
        heading: 'Wat is RoleChat AI (voorheen Web Tavern)?',
        paragraphs: [
          'RoleChat AI — oorspronkelijk bekend als Web Tavern — is een browsergebaseerde AI-rolplay-app die is ontworpen voor gebruiksgemak. Er is niets om te installeren. Je opent een webpagina, kiest een personage, voegt je AI-sleutel toe en begint met chatten.',
          'Hij behoudt het privacyprincipe dat SillyTavern zo aantrekkelijk maakt (je eigen sleutel meenemen, geen tussenpersoon die je chats leest), maar laat de intimiderende installatie achterwege. Het doel is simpel: de makkelijkste privé-AI-rolplay.',
        ],
      },
      {
        heading: 'Installatie: complex versus nul',
        paragraphs: [
          'SillyTavern vereist het downloaden van de toepassing, het installeren van Node.js, het uitvoeren van commandoregel-scripts en het draaiend houden van het serverproces terwijl je chat. Mobiel gebruik vergt extra stappen voor externe installatie.',
          'RoleChat AI draait volledig in je browser. Geen downloads, geen terminal, geen server. Het werkt op desktop, laptop, tablet en telefoon — open gewoon de pagina en begin.',
        ],
      },
      {
        heading: 'Instellingen: diepgaande parameters versus beginnersvriendelijk',
        paragraphs: [
          'SillyTavern toont temperature, top-p, contextlengte, sampling-methodes, prompt-sjablonen, world info en tientallen andere instellingen direct op het hoofdscherm. Voor geavanceerde gebruikers die elk detail willen finetunen is dit krachtig.',
          'RoleChat AI verbergt dat allemaal achter een gedeelte Advanced. Het standaardscherm toont je personage, je berichten en een invoervak. Als je later in de parameters wilt duiken, staan ze klaar — maar je hoeft ze nooit aan te raken.',
        ],
      },
      {
        heading: 'Privacy: beide respecteren je gegevens',
        paragraphs: [
          'Zowel SillyTavern als RoleChat AI werkt met het model „je eigen sleutel meenemen". Je koppelt je eigen AI-aanbieder-account en je berichten gaan direct tussen jouw apparaat en die aanbieder. Geen van beide diensten draait een tussenliggende server die je gesprekken leest.',
          'Dat is het belangrijkste privacyvoordeel ten opzichte van veel commerciële rolplay-apps, die je chats via hun eigen servers leiden. Met zowel SillyTavern als RoleChat AI zijn je chats van jou.',
        ],
      },
      {
        heading: 'Personageskaarten: volledig compatibel',
        paragraphs: [
          'Beide hulpmiddelen ondersteunen dezelfde formaten personageskaarten (V1, V2, V3 JSON en PNG). Als je een kaartverzameling uit SillyTavern hebt, kun je die kaarten direct in RoleChat AI importeren.',
          'RoleChat AI biedt daarnaast een ingebouwde bibliotheek van originele romantische personages, zodat je ook zonder eigen kaarten meteen kunt beginnen met chatten.',
        ],
      },
      {
        heading: 'Welke moet je kiezen?',
        paragraphs: [
          'Hou je van prutsen, wil je maximale controle over elke parameter en vind je een technische installatie geen probleem, dan is SillyTavern een uitstekende keuze met een sterke gemeenschap.',
          'Wil je liever een pagina openen en binnen een minuut aan het rolplayen zijn — zonder iets te installeren of te leren wat „top-p" betekent — dan is RoleChat AI voor jou gebouwd. Je kunt later altijd nog doorschakelen naar SillyTavern, en je personageskaarten reizen met je mee.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'App openen', to: '/app' },
      { label: 'Wat is een personageskaart?', to: '/guides/what-is-a-character-card' },
      { label: 'Hoe begin je met AI-rolplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'De beste AI-roleplay-prompts voor beginners',
    datePublished: '2026-07-15',
    description:
      'Eenvoudige, doeltreffende AI-roleplay-prompts en technieken voor beginners. Ontdek hoe je de sfeer neerzet, emotie opbouwt en je personage tot leven wekt — geen ervaring nodig.',
    sections: [
      {
        heading: 'Wat maakt een goede roleplay-prompt?',
        paragraphs: [
          'Bij AI-roleplay is een \'prompt\' geen technische opdracht — het is gewoon de manier waarop je je berichten schrijft. Hoe levendiger en specifieker je input, hoe rijker het antwoord van het personage. Goede prompts geven de AI iets om mee te werken: een stemming, een setting, een emotie, een kleine handeling.',
          'Je hoeft geen geweldige schrijver te zijn. Je hoeft het personage alleen iets echts te geven om op te reageren. Hier zijn vijf eenvoudige technieken die voor elk personage werken.',
        ],
      },
      {
        heading: 'Prompt 1: Zet de scène',
        paragraphs: [
          'Begin niet meteen met dialoog, maar schilder waar je bent. Eén zin scène-setting verankert het gesprek en geeft het personage iets om op te reageren.',
          'Voorbeeld: \'*De regen is al uren niet meer gestopt. Ik duw de deur van het café open, druipnat, en speur de ruimte af naar een lege stoel.\' Dit geeft het personage een setting, een stemming en een reden om je op te merken. Het antwoord wordt veel levendiger dan wanneer je alleen \'Hoi\' zou zeggen.',
        ],
      },
      {
        heading: 'Prompt 2: Bepaal de relatie vroeg',
        paragraphs: [
          'De AI heeft context nodig over wie je voor het personage bent. Zijn jullie vreemdelingen voor elkaar? Oude vrienden? Rivalen? Eén kort regeltje in je eerste bericht kan het hele gesprek vormgeven.',
          'Voorbeeld: \'We hebben sinds onze afstudering niet meer gepraat, en ik ben zenuwachtig als ik naar je bureau toe loop.\' Hiermee weet het personage dat er geschiedenis is, dat er spanning is en dat dit moment ertoe doet. De AI speelt daarop in.',
        ],
      },
      {
        heading: 'Prompt 3: Voeg emotionele diepgang toe',
        paragraphs: [
          'Personages komen tot leven als je laat zien wat je voelt, niet alleen wat je doet. Een klein, eerlijk gevoel in je bericht nodigt het personage uit om met zijn eigen emotie te antwoorden.',
          'Voorbeeld: \'*Ik probeer mijn stem stabiel te houden, maar mijn handen trillen.* Ik had nooit gedacht dat ik je nog zou zien.\' De kwetsbaarheid hier geeft het personage toestemming om zelf ook kwetsbaar te zijn — en daar ontstaan de mooiste roleplay-momenten.',
        ],
      },
      {
        heading: 'Prompt 4: Creëer milde spanning',
        paragraphs: [
          'Een gesprek waarin alles van een leien dakje gaat, wordt snel saai. Bouw een klein obstakel in — een misverstand, een geheim, een moment van aarzeling — en kijk hoe het personage zich dieper engageert.',
          'Voorbeeld: \'Ik wil je de waarheid vertellen, maar elke keer dat ik mijn mond opendoe, komen de woorden niet.\' Hierdoor moet het personage aandringen, afwachten of gissen. Zo wordt een platte uitwisseling een scène met inzet.',
        ],
      },
      {
        heading: 'Prompt 5: Schrijf zelf in character',
        paragraphs: [
          'Hoe meer jij in character blijft, hoe meer de AI dat ook doet. Gebruik sterretjes voor handelingen, aanhalingstekens voor spraak en houd je out-of-character-opmerkingen kort. Je hoeft niet perfect te zijn — gewoon consistent.',
          'Voorbeeld: \'*Ik zet het kopje voorzichtig neer.* "Jij wist altijd al wanneer ik loog."\' Let op hoe handeling en dialoog samenwerken. Het personage heeft nu een gebaar, een toon en een beschuldiging om op te reageren.',
        ],
      },
      {
        heading: 'Alles bij elkaar brengen',
        paragraphs: [
          'Je hoeft niet in elk bericht alle vijf de technieken toe te passen. Kies er een of twee die bij het moment passen en laat het gesprek vanzelf stromen. De beste roleplay voelt als improvisatie — je bouwt op elkaar voort, bericht voor bericht.',
          'Onthoud: het personage wordt gestuurd door zijn kaart en jouw input. Als een antwoord niet klopt, herformuleer je bericht dan met meer detail of emotie. Kleine aanpassingen in je schrijfstijl kunnen volledig veranderen hoe het personage reageert.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Personages bekijken', to: '/characters' },
      { label: 'De app openen', to: '/app' },
      { label: 'Tips voor betere roleplay', to: '/guides/tips-for-better-roleplay' },
      { label: 'Hoe begin je met AI-roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
