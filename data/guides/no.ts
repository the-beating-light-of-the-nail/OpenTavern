import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Slik kommer du i gang med AI-rollespill som nybegynner',
    datePublished: '2026-07-15',
    description:
      'En komplett nybegynnerguide til å starte ditt første AI-rollespill på RoleChat AI. Velg en karakter, legg til AI-nøkkelen din, og send den første meldingen på under fem minutter.',
    sections: [
      {
        heading: 'Hva er AI-rollespill?',
        paragraphs: [
          'AI-rollespill er en samtale mellom deg og en AI som spiller en fiktiv karakter. Du spiller deg selv — eller hvem du helst vil være — og AI-en svarer i karakter, i sanntid, og bygger en historie sammen med deg, én melding av gangen.',
          'I motsetning til en chatbot som bare svarer på spørsmål, har en rollespillkarakter en personlighet, en bakgrunnshistorie, en måte å snakke på og et forhold til deg. Målet er ikke å hente informasjon. Det er å leve inne i en historie sammen med noen som føles ekte.',
          'På RoleChat AI er hver karakter original — ikke kopiert fra et spill eller en serie — og hver samtale er helt privat, og kjører i nettleseren din med din egen AI-nøkkel.',
        ],
      },
      {
        heading: 'Trinn 1: Velg en karakter',
        paragraphs: [
          'Gå til Characters-siden og bla gjennom biblioteket. Hver karakter har et navn, en slager, en kort beskrivelse og personlighetstagger, slik at du vet hva du går inn i før du begynner.',
          'Ny på romantisk rollespill? Start med en «comfort»- eller «slow burn»-karakter. De er mykere og mer tilgivende — perfekte for å finne fotfesteet. Du kan alltids prøve en mer intens karakter senere.',
          'Når du har funnet en du liker, klikker du på kortet for å åpne karakterens side. Les beskrivelsen og åpningsmeldingen — den åpningsmeldingen er nøyaktig hvordan samtalen din vil starte.',
        ],
      },
      {
        heading: 'Trinn 2: Åpne appen og legg til AI-nøkkelen din',
        paragraphs: [
          'Klikk på «Start Private Chat»-knappen på en hvilken som helst karakterside for å åpne appen. Før den første meldingen din må du legge til en AI-nøkkel — en kort hemmelig streng som lar appen snakke med en AI-leverandør.',
          'Har du ikke en nøkkel ennå? Se guiden vår om hvordan du skaffer en AI-nøkkel — det tar omtrent to minutter. Nøkkelen din lagres kun i nettleseren din; vi ser den aldri og lagrer den ikke på en server.',
          'Så snart nøkkelen din er på plass, er appen klar. Du trenger ikke å gjøre dette igjen med mindre du bytter enhet eller tømmer nettleserdataene dine.',
        ],
      },
      {
        heading: 'Trinn 3: Send din første melding',
        paragraphs: [
          'Karakteren har allerede sendt deg en åpningsmelding — den setter scenen. Din oppgave er ganske enkelt å svare. Du trenger ikke å være forfatter. Du trenger ikke å være kvikk. Bare skriv det du faktisk ville sagt.',
          'En god første melding er ofte kort og menneskelig: en reaksjon, et spørsmål, en gest beskrevet i asterisker. Hvis for eksempel en kald doktor rekker deg kaffe, kan du bare si «Takk» og se hva som skjer.',
          'AI-en vil svare i karakter, og historien vokser derfra. Det finnes ingen feil måte å spille på — følg nysgjerrigheten din, så møter karakteren deg der.',
        ],
      },
      {
        heading: 'Tips til din første økt',
        paragraphs: [
          'Prøv å selv forbli i karakter hvis du kan — det får verden til å føles mer ekte. Men det er også helt greit å trekke seg tilbake og bare nyte turen.',
          'Hvis et svar ikke føles riktig, kan du regenerere det eller redigere den siste meldingen din. Rollespill er samarbeid; du har lov til å styre.',
          'Viktigst av alt: ikke ha travelt. Det beste rollespillet folder seg ut sakte. La forholdet få puste.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bla gjennom karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Slik skaffer du en AI-nøkkel', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips til bedre rollespill', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Slik skaffer du en AI-nøkkel til RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'En trinn-for-trinn-guide til å skaffe en OpenAI-kompatibel API-nøkkel og legge den til i RoleChat AI. Ingen teknisk bakgrunns kunnskap kreves — det tar omtrent to minutter.',
    sections: [
      {
        heading: 'Hva er en API-nøkkel?',
        paragraphs: [
          'En API-nøkkel er en kort hemmelig streng — som regel starter den med «sk-» — som lar RoleChat AI snakke med en AI-leverandør på dine vegne. Slik vet appen at du har tillatelse til å bruke AI-en.',
          'Du tar med din egen nøkkel, noe som betyr at du velger leverandøren selv, du betaler kun for det du bruker, og samtalene dine går direkte mellom nettleseren din og den leverandøren. Det er ingen mellommann.',
        ],
      },
      {
        heading: 'Trinn 1: Velg en leverandør',
        paragraphs: [
          'RoleChat AI fungerer med alle leverandører som tilbyr en OpenAI-kompatibel API. Populære valg omfatter velkjente labber og nyere, rimelige leverandører. Velg en som er tilgjengelig i regionen din og som passer budsjettet ditt.',
          'Usikker på hvor du skal starte? Se etter en leverandør med en sjenerøs gratis prøveperiode eller lav pris per melding. Du kan alltids bytte senere ved å lime inn en ny nøkkel i Innstillinger.',
        ],
      },
      {
        heading: 'Trinn 2: Opprett en konto og generer en nøkkel',
        paragraphs: [
          'Registrer deg hos den valgte leverandørens nettside, finn deretter «API keys»- eller «Access tokens»-delen av dashbordet ditt. Klikk «Create new key», gi den et navn du husker, og kopier strengen du får opp.',
          'Viktig: de fleste leverandører viser den fullstendige nøkkelen kun én gang. Lagre den et trygt sted umiddelbart — hvis du mister den, må du generere en ny.',
        ],
      },
      {
        heading: 'Trinn 3: Legg den til i RoleChat AI',
        paragraphs: [
          'Åpne RoleChat AI-appen, klikk på Innstillinger, og lim nøkkelen din inn i «API Key»-feltet. Legg leverandørens endpoint-URL inn i «API Endpoint»-feltet (den vises vanligvis på samme dashbordside som nøkkelen din).',
          'Eventuelt kan du velge en modell fra rullegardinmenyen. Hvis du er usikker, velg leverandørens anbefalte standard — den er avstemt for balanse mellom kvalitet og kostnad.',
          'Det var det hele. Du er klar til å chatte. Nøkkelen din blir værende i nettleseren din og sendes aldri til oss.',
        ],
      },
      {
        heading: 'Å holde nøkkelen din trygg',
        paragraphs: [
          'Aldri del API-nøkkelen din offentlig — den er som et passord for AI-kontoen din. Hvis du tror den kan være kompromittert, regenerer den hos leverandøren din og oppdater Innstillinger.',
          'På en delt eller offentlig enhet bør du ikke skru på «lagre nøkkel i denne nettleseren». På din egen enhet er det trygt å lagre den for enkelhets skyld.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Åpne appen for å legge til nøkkelen din', to: '/app' },
      { label: 'Bla gjennom karakterer', to: '/characters' },
      { label: 'Start ditt første rollespill', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips til bedre AI-rollespill',
    datePublished: '2026-07-15',
    description:
      'Små vaner som får AI-karakterer til å føles mer levende — tone, tempo og hvordan du forsiktig styrer historien uten å bryte fordypelsen.',
    sections: [
      {
        heading: 'Svar som et menneske, ikke som en prompt',
        paragraphs: [
          'Den største nybegynnerfeilen er å skrive til AI-en i stedet for til karakteren. Ikke beskr hva du vil skal skje — bare si det du faktisk ville sagt. AI-en spiller allerede scenen; din oppgave er å være med i den.',
          'Korte, ekte svar fungerer nesten alltid bedre enn lange, overkompliserte. Et ærlig «jeg vet ikke hva jeg skal si» kan flytte en scene lenger enn et helt avsnitt med fortelling.',
        ],
      },
      {
        heading: 'Bruk handlinger i asterisker',
        paragraphs: [
          'Å pakke en liten handling inn i asterisker — som *ser bort* eller *rekker ham koppen* — gir karakteren noe fysisk å reagere på. Det er den enkleste måten å gi tekstur på uten å skrive en hel roman.',
          'Ikke overdriv. Én eller to handlinger per melding er rikelig. Blir det for mange, begynner det å føles som sceneanvisninger i stedet for en samtale.',
        ],
      },
      {
        heading: 'La forholdet få puste',
        paragraphs: [
          'Det beste romantiske rollespillet er tregt. Hvis du skynder deg til en kjærlighetserklæring i de tre første meldingene, har karakteren ingen steder å vokse. La tilliten bygge seg, la spenningen simre, la de små øyeblikkene bety noe.',
          'Karakterer er skrevet med emosjonelt tempo i tankene — å presse for hardt og for fort kan få dem til å føles ute av karakter. Følg deres led, og belønningen er det verdt.',
        ],
      },
      {
        heading: 'Styr når du må',
        paragraphs: [
          'Rollespill er samarbeid. Hvis et svar ikke passer historien du vil ha, kan du redigere den siste meldingen din og prøve igjen, eller regenerere karakterens svar. Du sitter ikke fast med den første versjonen.',
          'Du kan også forsiktig omdirigere i karakter: bytt tema, forlat rommet, still et spørsmål. Karakteren vil som regel følge ledelsen din uten å bryte scenen.',
        ],
      },
      {
        heading: 'Vit når du skal stoppe',
        paragraphs: [
          'En flott rollespilløkt er som et godt kapittel — den slutter ved et naturlig pustepunkt. Når du er sliten, stopp. Samtalen er her når du kommer tilbake, og karakteren husker hvor dere slapp.',
          'Det er ingen premie for maratonøkter. Historien blir bedre når du er uthvilt.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bla gjennom karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Ny på rollespill? Start her', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Slik bruker du OpenRouter til AI-rollespill med karakterer',
    datePublished: '2026-07-15',
    description:
      'En trinn-for-trinn-nybegynnerguide til OpenRouter sammen med RoleChat AI. Opprett en konto, hent API-nøkkelen din, velg en modell og begynn å chatte med originale romantikk-karakterer på få minutter.',
    sections: [
      {
        heading: 'Hva er OpenRouter?',
        paragraphs: [
          'OpenRouter er en tjeneste som gir deg tilgang til titalls AI-modeller fra ulike leverandører gjennom én enkelt API. I stedet for å registrere deg hver for seg hos OpenAI, Anthropic, Google og flere, oppretter du én OpenRouter-konto og kan bruke hvilken som helst av modellene de tilbyr.',
          'For AI-rollespill er dette utrolig praktisk. Du kan prøve ulike modeller, sammenligne skrivestilen deres og bytte når som helst — alt uten å endre API-nøkkelen eller forlate appen.',
        ],
      },
      {
        heading: 'Hvorfor OpenRouter fungerer godt for rollespill',
        paragraphs: [
          'Rollespill krever modeller som er gode til kreativt skriving, til å holde seg i karakter og til å produsere lengre, oppslukende svar. OpenRouter gir deg tilgang til mange slike modeller, inkludert noen som er svært overkommelige i pris.',
          'Siden du kun betaler for det du bruker, kan du eksperimentere fritt. Start med en billigere modell, og hvis skrivingen kjennes flat, prøv en kraftigere en — byttet tar bare noen sekunder.',
        ],
      },
      {
        heading: 'Trinn 1: Opprett en OpenRouter-konto',
        paragraphs: [
          'Gå til openrouter.ai og registrer deg. Prosessen er grei — du trenger en e-postadresse og en måte å legge inn et lite beløp kreditt på (OpenRouter støtter flere betalingsmåter).',
          'Du trenger ikke legge inn mye. Noen få dollar er nok til hundrevis av rollespill-meldinger med de fleste modeller. Du kan alltid fylle på senere.',
        ],
      },
      {
        heading: 'Trinn 2: Hent API-nøkkelen din',
        paragraphs: [
          'Når du er logget inn, går du til Keys-delen av OpenRouter-panelet ditt. Klikk «Create Key», gi den et navn du husker, og kopier strengen som vises.',
          'Viktig: OpenRouter viser den fullstendige nøkkelen bare én gang. Lagre den et trygt sted umiddelbart — hvis du mister den, må du generere en ny.',
        ],
      },
      {
        heading: 'Trinn 3: Legg den til i RoleChat AI',
        paragraphs: [
          'Åpne RoleChat AI-appen og klikk «Connect AI» i den øverste linjen. I Settings-panelet klikker du hurtigknappen «OpenRouter» — da fylles riktig endepunkt-URL automatisk inn.',
          'Lim inn OpenRouter API-nøkkelen din i API Key-feltet. Skriv deretter et modellnavn i Model-feltet (et godt sted å starte er for eksempel en overkommelig chat-modell). Klikk lagre, og du er koblet til.',
        ],
      },
      {
        heading: 'Trinn 4: Velg en karakter og begynn å chatte',
        paragraphs: [
          'Nå som nøkkelen er satt opp, kan du utforske karakterbiblioteket og velge noen som fanger blikket ditt. Klikk «Start Chat», så sender karakteren deg åpningsmeldingen sin.',
          'Svar med din egen melding, og i løpet av noen sekunder får du et svar i karakter. Det var det — nå rollespiller du. Hvis skrivestilen ikke passer deg, prøv en annen modell fra OpenRouter og se hvordan det endrer seg.',
        ],
      },
      {
        heading: 'Tips til å velge modell på OpenRouter',
        paragraphs: [
          'Til romantisk rollespell bør du se etter modeller som er kjent for kreativt skriving og lengre svar. Større modeller skriver generelt rikere, men koster mer per melding; mindre modeller er billigere, men kan gi kortere eller mindre nyanserte svar.',
          'Start med noe overkommelig, bli kjent med flyten og oppgrader hvis du ønsker rikere prosa. Det finnes ingen «feil» valg — den beste modellen er den hvis skriving du liker best.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Utforsk karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Slik starter du AI-rollespill', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips for bedre rollespill', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Hva er et AI-karakterkort?',
    datePublished: '2026-07-15',
    description:
      'En nybegynnervennlig forklaring av AI-karakterkort: hva de er, hvordan de virker, og hvordan du bruker dem i RoleChat AI til privat romantisk rollespill.',
    sections: [
      {
        heading: 'Hva er et karakterkort?',
        paragraphs: [
          'Et karakterkort er en fil som definerer en AI-karakters personlighet, bakgrunnshistorie og adferd. Tenk på det som en detaljert profil som forteller AI-en hvem den skal late som — navnet deres, måten de snakker på, hva de bryr seg om og hvordan de forholder seg til deg.',
          'Når du starter en chat, leser appen karakterkortet og bruker det til å styre hvert eneste svar. Resultatet er en samtale som føles som å snakke med et ekte menneske med sin egen stemme, ikke en generisk chatbot.',
        ],
      },
      {
        heading: 'Hva inneholder et karakterkort?',
        paragraphs: [
          'Et typisk karakterkort inneholder flere viktige opplysninger: et navn, en beskrivelse (hvem de er og bakgrunnshistorien deres), en personlighet (hvordan de oppfører seg og snakker), et scenario (rammen og hvordan dere møtes) og en første melding (åpningsetningen som setter i gang samtalen).',
          'Noen kort inneholder også eksempeldialoger, som viser AI-en hvordan karakteren snakker i praksis. Det hjelper AI-en med å fange opp karakterens unike stemme — ordvalgene, rytmen, de små vanene.',
        ],
      },
      {
        heading: 'Karakterkort-formater: V1, V2 og V3 forklart enkelt',
        paragraphs: [
          'Over tid har miljøet utviklet ulike versjoner av karakterkort-formatet. V1 er det enkleste — bare det grunnleggende. V2 legger til flere felt, som alternative hilsener og notater fra oppretteren. V3 er det mest detaljerte, med plass til utvidelser og rikere metadata.',
          'Du trenger ikke bry deg om hvilken versjon som er hvilken. RoleChat AI støtter alle tre automatisk. Når du velger eller importerer et kort, finner appen ut formatet og håndterer det for deg.',
        ],
      },
      {
        heading: 'Hvordan karakterkort fungerer i RoleChat AI',
        paragraphs: [
          'RoleChat AI kommer med et innebygd bibliotek av originale karakterer — hver av dem er definert av et karakterkort. Du trenger ikke finne eller laste ned noe. Bare utforsk biblioteket, velg en karakter og begynn å chatte.',
          'Hvis du allerede har et karakterkort fra et annet verktøy (SillyTavern, for eksempel), kan du importere det. RoleChat AI leser standard JSON-kort og PNG-kort med innebygde data, så det biblioteket du allerede har, virker også her.',
        ],
      },
      {
        heading: 'Innebygde karakterer kontra å importere egne',
        paragraphs: [
          'For de fleste nybegynnere er det enkleste å starte med det innebygde karakterbiblioteket. Hver karakter er original, skrevet spesielt for romantisk rollespill og klar til å chatte med — uten annet oppsett enn å legge inn AI-nøkkelen.',
          'Hvis du er mer erfaren og har en samling kort, lar importfunksjonen deg ta dem med over. Begge veier fungerer — det innebygde biblioteket er rett og slett raskere å komme i gang med.',
        ],
      },
      {
        heading: 'Er karakterkort trygge?',
        paragraphs: [
          'Ja. Et karakterkort er utelukkende tekstdata — det inneholder verken kode eller skript. Det kan ikke skade enheten din eller få tilgang til personopplysningene dine. Det verste et dårlig skrevet kort kan gjøre, er å gi en forvirrende samtale.',
          'I RoleChat AI blir samtalene værende i nettleseren din, og karakterdataene behandles av den AI-leverandøren du velger. Ingen andre kan lese chattene dine.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Utforsk karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Slik starter du AI-rollespill', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern mot Web Tavern: Hvilken er enklest?',
    datePublished: '2026-07-15',
    description:
      'En vennlig sammenligning av SillyTavern og RoleChat AI (tidligere Web Tavern) for nybegynnere. Installasjon, oppsett, personvern og karakterkort — hvilken er rett for deg?',
    sections: [
      {
        heading: 'Hva er SillyTavern?',
        paragraphs: [
          'SillyTavern er en populær, kraftig og åpen kildekode-frontend for AI-rollespill. Den har eksistert i mange år og har et engasjert miljø. Den støtter et enormt utvalg av innstillinger, forhåndsinnstillinger, utvidelser og karakterkort-formater.',
          'Avhengigheten er kompleksiteten. SillyTavern krever installasjon — du kjører det på din egen maskin, setter opp tilkoblinger til AI-leverandører og navigerer et tett grensesnitt fulle av avanserte parametere. For teknisk kyndige brukere er den kraften en fordel. For de fleste nybegynnere er den en mur.',
        ],
      },
      {
        heading: 'Hva er RoleChat AI (tidligere Web Tavern)?',
        paragraphs: [
          'RoleChat AI — opprinnelig kjent som Web Tavern — er en nettleserbasert AI-rollespill-app laget for enkel bruk. Det er ingenting å installere. Du åpner en nettside, velger en karakter, legger inn AI-nøkkelen din og begynner å chatte.',
          'Den beholder personvern-prinsippet som gjør SillyTavern attraktiv (bruk din egen nøkkel, ingen mellommann som leser chattene dine), men fjerner det skremmende oppsettet. Målet er enkelt: det enkleste private AI-rollespillet.',
        ],
      },
      {
        heading: 'Installasjon: komplisert mot null',
        paragraphs: [
          'SillyTavern krever at du laster ned applikasjonen, installerer Node.js, kjører kommandolinje-skript og holder serverprosessen kjørende mens du chatter. Mobil bruk krever i tillegg ekstra oppsett over ekstern tilkobling.',
          'RoleChat AI kjører utelukkende i nettleseren. Ingen nedlastinger, ingen terminal, ingen server. Det virker på stasjonær, bærbar, nettbrett og telefon — bare åpne siden og start.',
        ],
      },
      {
        heading: 'Oppsett: dype parametere mot nybegynnervennlig',
        paragraphs: [
          'SillyTavern legger frem temperatur, top-p, kontekstlengde, samplingsmetoder, ledetekstmaler, world info og dusinvis av flere innstillinger på hovedskjermen. For avanserte brukere som vil fininnstille hver eneste detalj, er dette kraftig.',
          'RoleChat AI gjemmer alt dette bak en Advanced-del. Standardskjermen viser deg karakteren din, meldingene dine og et skrivefelt. Hvis du vil dykke ned i parameterne senere, er de der — men du trenger aldri røre dem.',
        ],
      },
      {
        heading: 'Personvern: begge respekterer dataene dine',
        paragraphs: [
          'Både SillyTavern og RoleChat AI bruker modellen med «bruk din egen nøkkel». Du kobler til din egen AI-leverandørkonto, og meldingene dine går direkte mellom enheten din og den leverandøren. Ingen av tjenestene driver en mellommannsserver som leser samtalene dine.',
          'Det er den viktigste personvern-fordelen i forhold til mange kommersielle rollespill-apper, som ruter chattene dine gjennom egne servere. Med både SillyTavern og RoleChat AI er chattene dine dine egne.',
        ],
      },
      {
        heading: 'Karakterkort: fullt kompatible',
        paragraphs: [
          'Begge verktøyene støtter de samme karakterkort-formatene (V1, V2, V3 JSON og PNG). Har du en kortsamling fra SillyTavern, kan du importere disse kortene direkte i RoleChat AI.',
          'RoleChat AI tilbyr i tillegg et innebygd bibliotek av originale romantikk-karakterer, så selv hvis du ikke har noen kort, kan du begynne å chatte umiddelbart.',
        ],
      },
      {
        heading: 'Hvilken bør du velge?',
        paragraphs: [
          'Hvis du elsker å fikle, vil ha maksimal kontroll over hver eneste parameter og ikke har noe imot et teknisk oppsett, er SillyTavern et godt valg med et sterkt miljø.',
          'Vil du åpne en side og være i gang med rollespill på under et minutt — uten å installere noe eller lære hva «top-p» betyr — er RoleChat AI bygget for deg. Du kan alltids gå videre til SillyTavern senere, og karakterkortene følger med deg.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Utforsk karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Hva er et karakterkort?', to: '/guides/what-is-a-character-card' },
      { label: 'Slik starter du AI-rollespill', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'De beste AI-rollespill-promptene for nybegynnere',
    datePublished: '2026-07-15',
    description:
      'Enkle og effektive AI-rollespill-prompter og teknikker for nybegynnere. Lær hvordan du setter scenen, bygger opp følelser og får karakteren til å føles levende — ingen erfaring kreves.',
    sections: [
      {
        heading: 'Hva kjennetegner en god rollespill-prompt?',
        paragraphs: [
          'I AI-rollespill er en «prompt» ikke en teknisk kommando — det er rett og slett måten du skriver meldingene dine på. Jo mer levende og konkret du er, jo rikere blir karakterens svar. En god prompt gir AI-en noe å jobbe med: en stemning, et miljø, en følelse, en liten handling.',
          'Du trenger ikke å være en dyktig forfatter. Det holder å gi karakteren noe ekte å reagere på. Her er fem enkle teknikker som fungerer med hvilken som helst karakter.',
        ],
      },
      {
        heading: 'Prompt 1: Sett scenen',
        paragraphs: [
          'I stedet for å gå rett til dialogen, tegn opp hvor dere er. Én enkelt setning med scenebygging forankrer samtalen og gir karakteren noe å forholde seg til.',
          'Eksempel: «*Regnet har ikke gitt seg på timer. Jeg dytter opp kafédøren, dryppende våt, og skanner rommet etter en ledig plass.» Dette gir karakteren et miljø, en stemning og en grunn til å legge merke til deg. Svaret blir langt mer levende enn om du bare hadde sagt «Hei.»',
        ],
      },
      {
        heading: 'Prompt 2: Avklar forholdet tidlig',
        paragraphs: [
          'AI-en trenger kontekst om hvem du er for karakteren. Er dere fremmede? Barndomskamerater? Rivaler? En kort setning i den første meldingen din kan forme hele samtalen.',
          'Eksempel: «Vi har ikke snakket sammen siden eksamensfesten, og jeg er nervøs når jeg går bort til pulten din.» Dette forteller karakteren at det finnes en historie, en spenning og en grunn til at akkurat dette øyeblikket betyr noe. AI-en vil bygge videre på den dynamikken.',
        ],
      },
      {
        heading: 'Prompt 3: Tilfør følelsesmessig dybde',
        paragraphs: [
          'Karakterer våkner til live når du viser hva du føler, ikke bare hva du gjør. En liten, ærlig følelse i meldingen din inviterer karakteren til å svare med sin egen.',
          'Eksempel: «*Jeg prøver å holde stemmen jevn, men hendene mine skjelver.* Jeg trodde aldri jeg skulle se deg igjen.» Sårbarheten her gir karakteren tillatelse til å være sårbar tilbake — og det er nettopp der de beste rollespill-øyeblikkene oppstår.',
        ],
      },
      {
        heading: 'Prompt 4: Skap en litt spenning',
        paragraphs: [
          'En samtale hvor alt flyter lett, blir kjedelig raskt. Legg inn en liten hindring — et missforståelse, en hemmelighet, et øyeblikks nøling — og se hvordan karakteren engasjerer seg dypere.',
          'Eksempel: «Jeg vil fortelle deg sannheten, men hver gang jeg åpner munnen, kommer ordene ikke ut.» Dette gir karakteren en grunn til å presse på, til å vente, til å lure. Det forvandler en flat utveksling til en scene med noe på spill.',
        ],
      },
      {
        heading: 'Prompt 5: Behold rollen selv',
        paragraphs: [
          'Jo mer du holder deg i rollen, jo mer vil AI-en gjøre det samme. Bruk asterisker til handlinger, anførselstegn til tale og hold utenfor-rollen-kommentarene korte. Du trenger ikke å være perfekt — bare konsistent.',
          'Eksempel: «*Jeg setter forsiktig fra meg koppen.* \'Du visste alltid når jeg løy.\'» Legg merke til hvordan handlingen og dialogen spiller sammen. Karakteren har nå en gest, en tone og en anklage å reagere på.',
        ],
      },
      {
        heading: 'Å sette alt sammen',
        paragraphs: [
          'Du trenger ikke å bruke alle fem teknikkene i hver eneste melding. Velg én eller to som passer øyeblikket, og la samtalen flyte naturlig. Det beste rollespillet minner om improvisasjon — dere bygger på hverandre, én melding av gangen.',
          'Husk: karakteren styres av kortet sitt og det du skriver. Hvis et svar føles feil, prøv å omformulere meldingen med mer detalj eller følelse. Små endringer i måten du skriver på, kan forandre hvordan karakteren svarer.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bla gjennom karakterer', to: '/characters' },
      { label: 'Åpne appen', to: '/app' },
      { label: 'Tips for bedre rollespill', to: '/guides/tips-for-better-roleplay' },
      { label: 'Slik starter du med AI-rollespill', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
