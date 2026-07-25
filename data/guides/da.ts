import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Kom i gang med AI-rollespil som nybegynder',
    datePublished: '2026-07-15',
    description:
      'En komplet nybegynderguide til at starte dit første AI-rollespil på RoleChat AI. Vælg en karakter, tilføj din AI-nøgle, og send din første besked på under fem minutter.',
    sections: [
      {
        heading: 'Hvad er AI-rollespil?',
        paragraphs: [
          'AI-rollespil er en samtale mellem dig og en AI, der agerer en fiktiv karakter. Du spiller dig selv – eller hvem du nu har lyst til at være – og AI\'en svarer i karakter, i realtid, og bygger en historie op sammen med dig én besked ad gangen.',
          'I modsætning til en chatbot, der bare svarer på spørgsmål, har en rollespilskarakter en personlighed, en baggrundshistorie, en måde at tale på og et forhold til dig. Målet er ikke at fremskaffe information. Det er at leve inde i en historie sammen med en, der føles ægte.',
          'På RoleChat AI er hver karakter original – ikke kopieret fra et spil eller en serie – og hver samtale er helt privat og kører i din browser med din egen AI-nøgle.',
        ],
      },
      {
        heading: 'Trin 1: Vælg en karakter',
        paragraphs: [
          'Gå til Characters-siden og gennemse biblioteket. Hver karakter har et navn, en tagline, en kort beskrivelse og personlighedstags, så du ved, hvad du går ind til, før du begynder.',
          'Ny til romantisk rollespil? Start med en "comfort"- eller "slow burn"-karakter. De er blidere og mere tilgivende – perfekte til at finde benene. Du kan altid prøve en mere intens karakter senere.',
          'Når du har fundet en, du kan lide, klikker du på kortet for at åbne karakterens side. Læs beskrivelsen og åbningsbeskeden – den åbningsbesked er præcis sådan, din samtale vil begynde.',
        ],
      },
      {
        heading: 'Trin 2: Åbn appen og tilføj din AI-nøgle',
        paragraphs: [
          'Klik på knappen "Start Private Chat" på en hvilken som helst karakter-side for at åbne appen. Før din første besked skal du tilføje en AI-nøgle – en kort, hemmelig streng, der lader appen tale med en AI-udbyder.',
          'Har du ikke en nøgle endnu? Se vores guide til, hvordan du skaffer en AI-nøgle – det tager omkring to minutter. Din nøgle gemmes kun i din browser; vi ser den aldrig og gemmer den ikke på en server.',
          'Når din nøgle er på plads, er appen klar. Det behøver du kun at gøre én gang – medmindre du skifter enhed eller rydder dine browserdata.',
        ],
      },
      {
        heading: 'Trin 3: Send din første besked',
        paragraphs: [
          'Karakteren har allerede sendt dig en åbningsbesked – den sætter scenen. Din opgave er blot at svare. Du behøver ikke være forfatter. Du behøver ikke være kvik. Skriv bare det, du rent faktisk ville sige.',
          'En god første besked er ofte kort og menneskelig: en reaktion, et spørgsmål, en gestus beskrevet i asterisker. Hvis for eksempel en kold læge rækker dig en kop kaffe, kan du bare sige "Mange tak" og se, hvad der sker.',
          'AI\'en svarer i karakter, og derfra vokser historien. Der er ingen forkert måde at spille på – følg din nysgerrighed, så møder karakteren dig der.',
        ],
      },
      {
        heading: 'Tips til din første session',
        paragraphs: [
          'Bliv i karakteren selv, hvis du kan – det får verdenen til at føles mere virkelig. Men det er også helt okay at træde et skridt tilbage og bare nyde turen.',
          'Hvis et svar ikke føles rigtigt, kan du generere det igen eller redigere din seneste besked. Rollespil er samarbejde; du må gerne styre.',
          'Og vigtigst af alt: der er ingen grund til at skynde sig. Det bedste rollespil udfolder sig langsomt. Lad forholdet trække vejret.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Gennemse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Sådan skaffer du en AI-nøgle', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips til bedre rollespil', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Sådan skaffer du en AI-nøgle til RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'En trin-for-trin guide til at skaffe en OpenAI-kompatibel API-nøgle og tilføje den til RoleChat AI. Ingen teknisk baggrund kræves – det tager omkring to minutter.',
    sections: [
      {
        heading: 'Hvad er en API-nøgle?',
        paragraphs: [
          'En API-nøgle er en kort, hemmelig streng – som regel starter den med "sk-" – der lader RoleChat AI tale med en AI-udbyder på dine vegne. Det er sådan, appen ved, at du har lov til at bruge AI\'en.',
          'Du medbringer din egen nøgle, hvilket betyder, at du selv vælger udbyderen, kun betaler for det, du bruger, og at dine samtaler går direkte mellem din browser og den udbyder. Der er ingen mellemmand.',
        ],
      },
      {
        heading: 'Trin 1: Vælg en udbyder',
        paragraphs: [
          'RoleChat AI fungerer med alle udbydere, der tilbyder en OpenAI-kompatibel API. Populære valg omfatter velkendte laboratorier og nyere lavprisudbydere. Vælg en, der er tilgængelig i din region og passer til dit budget.',
          'I tvivl om, hvor du skal starte? Kig efter en udbyder med en generøs gratis prøveperiode eller lav pris pr. besked. Du kan altid skifte senere ved at indsætte en ny nøgle i Indstillinger.',
        ],
      },
      {
        heading: 'Trin 2: Opret en konto og generer en nøgle',
        paragraphs: [
          'Tilmeld dig hos din valgte udbyders hjemmeside, og find derefter sektionen "API keys" eller "Access tokens" i dit dashboard. Klik på "Create new key", giv den et navn, du kan huske, og kopiér den streng, den viser dig.',
          'Vigtigt: de fleste udbydere viser kun den fulde nøgle én gang. Gem den et sikkert sted med det samme – hvis du mister den, skal du generere en ny.',
        ],
      },
      {
        heading: 'Trin 3: Tilføj den til RoleChat AI',
        paragraphs: [
          'Åbn RoleChat AI-appen, klik på Settings, og indsæt din nøgle i feltet "API Key". Tilføj udbyderens endpoint-URL i feltet "API Endpoint" (den står som regel på samme dashboard-side som din nøgle).',
          'Eventuelt kan du vælge en model fra rullemenuen. Hvis du er usikker, så vælg udbyderens anbefalede standard – den er afbalanceret i forhold til kvalitet og pris.',
          'Det var det hele. Du er klar til at chatte. Din nøgle bliver i din browser og bliver aldrig sendt til os.',
        ],
      },
      {
        heading: 'Hold din nøgle sikker',
        paragraphs: [
          'Del aldrig din API-nøgle offentligt – den fungerer som adgangskode til din AI-konto. Hvis du mistænker, at den er blevet kompromitteret, skal du generere en ny hos din udbyder og opdatere Indstillinger.',
          'På en delt eller offentlig enhed skal du ikke aktivere "save key to this browser". På din egen enhed er det trygt at gemme den for nemheds skyld.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Åbn appen for at tilføje din nøgle', to: '/app' },
      { label: 'Gennemse karakterer', to: '/characters' },
      { label: 'Start dit første rollespil', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips til bedre AI-rollespil',
    datePublished: '2026-07-15',
    description:
      'Små vaner, der får AI-karakterer til at føles mere levende – tone, tempo og hvordan du forsigtigt styrer historien uden at bryde fordybelsen.',
    sections: [
      {
        heading: 'Svar som et menneske, ikke som en prompt',
        paragraphs: [
          'Den største nybegynderfejl er at skrive til AI\'en i stedet for til karakteren. Undlad at beskrive, hvad der skal ske – skriv kun det, du rent faktisk ville sige. AI\'en spiller allerede scenen; din opgave er at være med i den.',
          'Korte, ægte svar fungerer næsten altid bedre end lange, overbelækkede. Et oprigtigt "Jeg ved ikke, hvad jeg skal sige" kan rykke en scene længere end et helt afsnit fortælling.',
        ],
      },
      {
        heading: 'Brug handlinger i asterisker',
        paragraphs: [
          'At pakke en lille handling ind i asterisker – som *kigger væk* eller *rækker ham koppen* – giver karakteren noget fysisk at reagere på. Det er den nemmeste måde at tilføje struktur uden at skrive en hel roman.',
          'Lad være med at overdrive. Én eller to handlinger pr. besked er rigeligt. Bliver det for mange, begynder det at føles som sceneanvisninger i stedet for en samtale.',
        ],
      },
      {
        heading: 'Lad forholdet trække vejret',
        paragraphs: [
          'Det bedste romantiske rollespil er langsomt. Hvis du skynder dig frem til en kærlighedserklæring i de første tre beskeder, har karakteren ingen steder at vokse hen. Lad tilliden bygge sig op, lad spændingen simre, lad de små øjeblikke betyde noget.',
          'Karakterer er skrevet med følelsesmæssigt tempo for øje – presser du for hårdt og for hurtigt, kan de føles ude af karakter. Følg deres rytme, så er belønningen det hele værd.',
        ],
      },
      {
        heading: 'Styr, når du har brug for det',
        paragraphs: [
          'Rollespil er samarbejde. Hvis et svar ikke passer til den historie, du ønsker, kan du redigere din seneste besked og prøve igen eller lade karakterens svar generere på ny. Du sidder ikke fast med den første version.',
          'Du kan også forsigtigt skifte retning i karakter: skift emne, forlad rummet, stil et spørgsmål. Karakteren følger som regel dit initiativ uden at bryde scenen.',
        ],
      },
      {
        heading: 'Ved, hvornår du skal stoppe',
        paragraphs: [
          'En god rollespilssession er som et godt kapitel – den slutter ved et naturligt pusterum. Når du er træt, så stop. Samtalen ligger her, når du kommer tilbage, og karakteren husker, hvor du slap.',
          'Der er ingen præmie for maratonsessioner. Historien bliver bedre, når du er udhvilet.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Gennemse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Ny til rollespil? Start her', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Sådan bruger du OpenRouter til AI-rollespil med karakterer',
    datePublished: '2026-07-15',
    description:
      'En trin-for-trin-guide for begyndere til at bruge OpenRouter sammen med RoleChat AI. Opret en konto, hent din API-nøgle, vælg en model, og begynd at chatte med originale romancel karakterer på få minutter.',
    sections: [
      {
        heading: 'Hvad er OpenRouter?',
        paragraphs: [
          'OpenRouter er en tjeneste, der giver dig adgang til snesevis af AI-modeller fra forskellige udbydere via ét enkelt API. I stedet for at oprette konti hver for sig hos OpenAI, Anthropic, Google og flere, opretter du blot én OpenRouter-konto og kan bruge alle de modeller, de tilbyder.',
          'Til AI-rollespil er det utroligt praktisk. Du kan afprøve forskellige modeller, sammenligne deres skrivestil og skifte, lige når du har lyst — alt sammen uden at skifte API-nøgle eller forlade appen.',
        ],
      },
      {
        heading: 'Hvorfor OpenRouter fungerer godt til rollespil',
        paragraphs: [
          'Rollespil kræver modeller, der er stærke til kreativ skrivning, fastholder karakteren og leverer længere, opslukkende svar. OpenRouter giver dig adgang til mange sådanne modeller, herunder nogle, der er meget overkommelige i pris.',
          'Fordi du kun betaler for det, du bruger, kan du eksperimentere frit. Start med en billigere model, og hvis skrivningen føles flad, så prøv en mere kraftfuld en — skiftet tager kun få sekunder.',
        ],
      },
      {
        heading: 'Trin 1: Opret en OpenRouter-konto',
        paragraphs: [
          'Gå til openrouter.ai, og tilmeld dig. Det er helt ligetil — du skal bruge en e-mailadresse og en måde at tilføje et lille beløb i kredit på (OpenRouter accepterer flere betalingsmetoder).',
          'Du behøver ikke tilføje meget. Et par dollars er nok til hundredvis af rollespilsbeskeder med de fleste modeller. Du kan altid fylde mere på senere.',
        ],
      },
      {
        heading: 'Trin 2: Hent din API-nøgle',
        paragraphs: [
          'Når du er logget ind, går du til afsnittet Keys på din OpenRouter-dashboard. Klik på "Create Key", giv den et navn, du kan huske, og kopier den streng, den viser dig.',
          'Vigtigt: OpenRouter viser kun den fulde nøgle én gang. Gem den et sikkert sted med det samme — hvis du mister den, er du nødt til at oprette en ny.',
        ],
      },
      {
        heading: 'Trin 3: Tilføj den i RoleChat AI',
        paragraphs: [
          'Åbn RoleChat AI-appen, og klik på "Connect AI" i den øverste linje. I indstillingspanelet klikker du på knappen "OpenRouter" til hurtig udfyldning — den indsætter automatisk den korrekte endpoint-URL.',
          'Indsæt din OpenRouter API-nøgle i feltet API Key. Skriv derefter et modelnavn i feltet Model (for eksempel er en overkommelig chatmodel et godt sted at starte). Klik på gem, så er du forbundet.',
        ],
      },
      {
        heading: 'Trin 4: Vælg en karakter, og begynd at chatte',
        paragraphs: [
          'Nu hvor din nøgle er klar, kan du browse i karakterbiblioteket og vælge en, der fanger din opmærksomhed. Klik på "Start Chat", så sender karakteren sin åbningsbesked til dig.',
          'Skriv dit svar, og inden for få sekunder får du et svar i karakter. Det var det — nu rollespiller du. Hvis skrivestilen ikke passer dig, så prøv en anden model fra OpenRouter, og se hvordan den ændrer sig.',
        ],
      },
      {
        heading: 'Tips til at vælge en model på OpenRouter',
        paragraphs: [
          'Til romancel-rollespil bør du kigge efter modeller, der er kendte for kreativ skrivning og længere svar. Generelt skriver større modeller rigere, men koster mere pr. besked; mindre modeller er billigere, men giver til tider kortere eller mindre nuancerede svar.',
          'Start med noget overkommeligt, mærk flowet, og opgrader, hvis du vil have rigere prosa. Der findes ikke noget "forkert" valg — den bedste model er den, hvis skrivestil du nyder mest.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Sådan starter du med AI-rollespil', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips til bedre rollespil', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Hvad er et AI-karakterkort?',
    datePublished: '2026-07-15',
    description:
      'En letforståelig introduktion til AI-karakterkort: hvad de er, hvordan de fungerer, og hvordan du bruger dem i RoleChat AI til privat romancel-rollespil.',
    sections: [
      {
        heading: 'Hvad er et karakterkort?',
        paragraphs: [
          'Et karakterkort er en fil, der definerer en AI-karakters personlighed, baggrundshistorie og adfærd. Tænk på det som en grundig profil, der fortæller AI\'en, hvem den skal leges som — deres navn, hvordan de taler, hvad de går op i, og hvordan de relaterer sig til dig.',
          'Når du starter en chat, læser appen karakterkortet og bruger det til at styre hvert eneste svar. Resultatet er en samtale, der føles som at tale med et rigtigt menneske med sin helt egen stemme — ikke en generisk chatbot.',
        ],
      },
      {
        heading: 'Hvad indeholder et karakterkort?',
        paragraphs: [
          'Et typisk karakterkort indeholder flere centrale oplysninger: et navn, en beskrivelse (hvem de er, og deres baggrundshistorie), en personlighed (hvordan de opfører sig og taler), et scenarie (rammen og hvordan I mødes) og en første besked (den åbningsreplik, der starter samtalen).',
          'Nogle kort indeholder også eksempeldialoger, der viser AI\'en, hvordan karakteren taler i praksis. Det hjælper AI\'en med at fange karakterens helt egen stemme — ordvalg, rytme og små vaner.',
        ],
      },
      {
        heading: 'Karakterkort-formater: V1, V2, V3 forklaret enkelt',
        paragraphs: [
          'Med tiden har fællesskabet udviklet forskellige versioner af karakterkort-formatet. V1 er den simpleste — kun det grundlæggende. V2 tilføjer flere felter som alternative hilsner og noter fra skaberen. V3 er den mest detaljerede, med plads til udvidelser og rigere metadata.',
          'Du behøver ikke bekymre dig om, hvilken version der er hvilken. RoleChat AI understøtter alle tre automatisk. Når du vælger eller importerer et kort, genkender appen formatet og håndterer det for dig.',
        ],
      },
      {
        heading: 'Sådan fungerer karakterkort i RoleChat AI',
        paragraphs: [
          'RoleChat AI leveres med et indbygget bibliotek af originale karakterer — hver eneste en defineret af et karakterkort. Du behøver ikke at finde eller downloade noget. Bare browse i biblioteket, vælg en karakter, og begynd at chatte.',
          'Hvis du allerede har et karakterkort fra et andet værktøj (for eksempel SillyTavern), kan du importere det. RoleChat AI læser standard-JSON-kort og PNG-kort med indlejrede data, så dit eksisterende bibliotek også virker her.',
        ],
      },
      {
        heading: 'Indbyggede karakterer kontra at importere sine egne',
        paragraphs: [
          'For de fleste begyndere er det nemmeste at starte med det indbyggede karakterbibliotek. Hver karakter er original, skrevet specifikt til romancel-rollespil og klar til at chatte — uden andet setup end at tilføje din AI-nøgle.',
          'Hvis du er mere erfaren og har en samling kort, lader importfunktionen dig tage dem med. Begge veje virker — det indbyggede bibliotek er bare hurtigere at komme i gang med.',
        ],
      },
      {
        heading: 'Er karakterkort sikre?',
        paragraphs: [
          'Ja. Et karakterkort er udelukkende tekstdata — det indeholder hverken kode eller scripts. Det kan ikke skade din enhed eller tilgå dine personlige oplysninger. Det værste, et dårligt skrevet kort kan gøre, er at levere en forvirrende samtale.',
          'I RoleChat AI bliver dine samtaler i din browser, og karakterdataene behandles af den AI-udbyder, du selv vælger. Ingen andre kan se dine chats.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Sådan starter du med AI-rollespil', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern eller Web Tavern: Hvilken er nemmest?',
    datePublished: '2026-07-15',
    description:
      'En venlig sammenligning af SillyTavern og RoleChat AI (tidligere Web Tavern) for begyndere. Installation, opsætning, privatliv og karakterkort — hvilken er den rigtige for dig?',
    sections: [
      {
        heading: 'Hvad er SillyTavern?',
        paragraphs: [
          'SillyTavern er en populær og kraftfuld open source-frontend til AI-rollespil. Den har eksisteret i årevis og har et engageret fællesskab. Den understøtter et enormt udvalg af indstillinger, presets, udvidelser og karakterkort-formater.',
          'Prisen for det er kompleksitet. SillyTavern kræver installation — du kører den på din egen computer, konfigurerer forbindelser til AI-udbydere og navigerer et tæt interface fyldt med avancerede parametre. For teknisk indstillede brugere er den kraft en fordel. For de fleste begyndere er den en mur.',
        ],
      },
      {
        heading: 'Hvad er RoleChat AI (tidligere Web Tavern)?',
        paragraphs: [
          'RoleChat AI — oprindeligt kendt som Web Tavern — er en browserbaseret AI-rollespilsapp designet til at være nem at bruge. Der er intet at installere. Du åbner en webside, vælger en karakter, tilføjer din AI-nøgle, og så kan du chatte.',
          'Den bevarer det privatlivsprincip, der gør SillyTavern tiltalende (medbrag egen nøgle, ingen mellemmand, der læser dine chats), men fjerner den skræmmende opsætning. Målet er enkelt: det nemmeste private AI-rollespil.',
        ],
      },
      {
        heading: 'Installation: kompleks kontra nul',
        paragraphs: [
          'SillyTavern kræver, at du downloader programmet, installerer Node.js, kører kommandolinjescripts og holder serverprocessen kørende, mens du chatter. Mobil brug kræver yderligere trin til fjernopsætning.',
          'RoleChat AI kører helt og aldeles i din browser. Ingen downloads, ingen terminal, ingen server. Den virker på desktop, bærbar, tablet og telefon — bare åbn siden, og kom i gang.',
        ],
      },
      {
        heading: 'Opsætning: dybe parametre kontra begyndervenlig',
        paragraphs: [
          'SillyTavern stiller temperatur, top-p, kontekstlængde, samplingmetoder, prompt-skabeloner, world info og snesevis af andre indstillinger til rådighed direkte på hovedskærmen. Til erfarne brugere, der vil finjustere hver eneste detalje, er det kraftfuldt.',
          'RoleChat AI gemmer det hele bag et afsnit til avancerede indstillinger. Standardskærmen viser dig din karakter, dine beskeder og et inputfelt. Hvis du senere vil dykke ned i parametrene, er de der — men du behøver aldrig at røre dem.',
        ],
      },
      {
        heading: 'Privatliv: Begge respekterer dine data',
        paragraphs: [
          'Både SillyTavern og RoleChat AI bygger på princippet "medbring egen nøgle". Du forbinder din egen AI-udbyderkonto, og dine beskeder går direkte mellem din enhed og den udbyder. Ingen af tjenesterne driver en mellemmandsserver, der læser dine samtaler.',
          'Det er den afgørende privatlivsfordel i forhold til mange kommercielle rollespilsapps, der sender dine chats gennem deres egne servere. Med både SillyTavern og RoleChat AI tilhører dine chats dig selv.',
        ],
      },
      {
        heading: 'Karakterkort: Fuld kompatibilitet',
        paragraphs: [
          'Begge værktøjer understøtter de samme karakterkort-formater (V1, V2, V3 JSON og PNG). Hvis du har en kortsamling fra SillyTavern, kan du importere disse kort direkte i RoleChat AI.',
          'RoleChat AI tilbyder også et indbygget bibliotek af originale romancel-karakterer, så selv hvis du slet ingen kort har, kan du begynde at chatte med det samme.',
        ],
      },
      {
        heading: 'Hvilken skal du vælge?',
        paragraphs: [
          'Hvis du elsker at pille, vil have maksimal kontrol over hver eneste parameter og ikke har noget imod en teknisk opsætning, er SillyTavern et fremragende valg med et stærkt fællesskab.',
          'Hvis du vil åbne en side og være i gang med rollespil på under et minut — uden at installere noget eller lære, hvad "top-p" betyder — er RoleChat AI bygget til dig. Du kan altid gå videre til SillyTavern senere, og dine karakterkort følger med.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Hvad er et karakterkort?', to: '/guides/what-is-a-character-card' },
      { label: 'Sådan starter du med AI-rollespil', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'De bedste AI-roleplay-prompts til begyndere',
    datePublished: '2026-07-15',
    description:
      'Enkle og effektive AI-roleplay-prompts og teknikker til begyndere. Lær at skabe rammen, opbygge følelser og få din karakter til at føles levende — ingen erfaring nødvendig.',
    sections: [
      {
        heading: 'Hvad gør et godt roleplay-prompt?',
        paragraphs: [
          'I AI-roleplay er en "prompt" ikke en teknisk kommando — det er blot den måde, du skriver dine beskeder på. Jo mere levende og præcis din indput er, desto rigere bliver karakterens svar. Gode prompts giver AI\'en noget at arbejde med: en stemning, et miljø, en følelse, en lille handling.',
          'Du behøver ikke at være en dygtig forfatter. Du skal bare give karakteren noget virkeligt at reagere på. Her er fem enkle teknikker, der virker for enhver karakter.',
        ],
      },
      {
        heading: 'Prompt 1: Skab rammen',
        paragraphs: [
          'I stedet for at gå lige til dialogen, så beskr hvor I er. En enkelt sætning med scenefastsættelse forankrer samtalen og giver karakteren noget at reagere på.',
          'Eksempel: "*Regnen har ikke lettet i timer. Jeg skubber café-døren op, dryppende våd, og scanner rummet efter en ledig plads." Dette giver karakteren et miljø, en stemning og en grund til at lægge mærke til dig. Svaret bliver langt mere levende, end hvis du bare havde skrevet "Hej."',
        ],
      },
      {
        heading: 'Prompt 2: Fastlæg relationen tidligt',
        paragraphs: [
          'AI\'en har brug for kontekst om, hvem du er for karakteren. Er I fremmede? Gamle venner? Rivaler? En kort linje i din første besked kan forme hele samtalen.',
          'Eksempel: "Vi har ikke talt sammen siden dimissionen, og jeg er nervøs, da jeg går hen til dit skrivebord." Dette fortæller karakteren, at der er historie, at der er spænding, og at der er en grund til, at dette øjeblik betyder noget. AI\'en vil trække på den dynamik.',
        ],
      },
      {
        heading: 'Prompt 3: Tilføj følelsesmæssig dybde',
        paragraphs: [
          'Karakterer bliver levende, når du viser, hvad du føler, ikke kun hvad du gør. En lille ærlig følelse i din besked inviterer karakteren til at svare med sine egne.',
          'Eksempel: "*Jeg prøver at holde stemmen stabil, men mine hænder ryster.* Jeg troede ikke, jeg nogensinde skulle se dig igen." Sårbarheden her giver karakteren lov til at være sårbar til gengæld — og det er der, de bedste roleplay-øjeblikke opstår.',
        ],
      },
      {
        heading: 'Prompt 4: Skab en blid spænding',
        paragraphs: [
          'En samtale, hvor alt er let, bliver hurtigt kedelig. Introducer en lille forhindring — en misforståelse, en hemmelighed, et øjebliks tøven — og se karakteren engagere sig dybere.',
          'Eksempel: "Jeg vil gerne fortælle dig sandheden, men hver gang jeg åbner munden, vil ordene ikke komme." Dette giver karakteren en grund til at presse på, at vente, at undre sig. Det forvandler en flad udveksling til en scene med noget på spil.',
        ],
      },
      {
        heading: 'Prompt 5: Skriv selv i karakter',
        paragraphs: [
          'Jo mere du bliver i karakter, desto mere vil AI\'en også. Brug stjerner til handlinger, anførselstegn til tale og hold dine kommentarer uden for karakter korte. Du behøver ikke være perfekt — bare konsistent.',
          'Eksempel: "*Jeg sætter forsigtigt koppen ned.* \'Du vidste altid, når jeg løj.\'" Læg mærke til, hvordan handlingen og dialogen fungerer sammen. Karakteren har nu en gestus, en tone og en anklage at reagere på.',
        ],
      },
      {
        heading: 'Sæt det hele sammen',
        paragraphs: [
          'Du behøver ikke at bruge alle fem teknikker i hver besked. Vælg en eller to, der passer til øjeblikket, og lad samtalen flyde naturligt. Den bedste roleplay føles som improvisation — I bygger videre på hinanden, én besked ad gangen.',
          'Husk: karakteren styres af sit kort og dit indput. Hvis et svar føles forkert, så prøv at omformulere din besked med flere detaljer eller følelse. Små ændringer i din skrivestil kan forvandle måden, karakteren svarer på.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Gennemse karakterer', to: '/characters' },
      { label: 'Åbn appen', to: '/app' },
      { label: 'Tips til bedre roleplay', to: '/guides/tips-for-better-roleplay' },
      { label: 'Sådan starter du AI-roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
