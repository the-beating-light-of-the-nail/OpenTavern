import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Så kommer du igång med AI-rollspel som nybörjare',
    datePublished: '2026-07-15',
    description:
      'En komplett nybörjarguide för att starta ditt första AI-rollspel på RoleChat AI. Välj en karaktär, lägg till din AI-nyckel och skicka ditt första meddelande på under fem minuter.',
    sections: [
      {
        heading: 'Vad är AI-rollspel?',
        paragraphs: [
          'AI-rollspel är en konversation mellan dig och en AI som agerar en fiktiv karaktär. Du spelar dig själv — eller vem du nu vill vara — och AI:n svarar i karaktär, i realtid, och bygger en berättelse tillsammans med dig, ett meddelande i taget.',
          'Till skillnad från en chattbot som bara svarar på frågor har en rollspelskaraktär en personlighet, en bakgrundshistoria, ett eget sätt att tala och en relation till dig. Målet är inte att samla information — det är att leva inuti en berättelse tillsammans med någon som känns verklig.',
          'På RoleChat AI är varje karaktär originell — inte kopierad från ett spel eller en tv-serie — och varje samtal är helt privat och körs i din webbläsare med din egen AI-nyckel.',
        ],
      },
      {
        heading: 'Steg 1: Välj en karaktär',
        paragraphs: [
          'Gå till karaktärssidan och bläddra i biblioteket. Varje karaktär har ett namn, en punchline, en kort beskrivning och personlighetsetaggar, så att du vet vad du ger dig in i innan du börjar.',
          'Ny till romantik-rollspel? Börja med en "comfort"- eller "slow burn"-karaktär. De är mjukare och mer tillmötesgående — perfekta när du ska hitta fotfästet. Du kan alltid testa en mer intensiv karaktär senare.',
          'När du hittat någon du tycker om, klicka på deras kort för att öppna karaktärssidan. Läs beskrivningen och öppningsmeddelandet — det öppningsmeddelandet är precis så här din konversation kommer att börja.',
        ],
      },
      {
        heading: 'Steg 2: Öppna appen och lägg till din AI-nyckel',
        paragraphs: [
          'Klicka på knappen "Start Private Chat" på valfri karaktärssida för att öppna appen. Innan ditt första meddelande behöver du lägga till en AI-nyckel — en kort hemlig sträng som låter appen prata med en AI-leverantör.',
          'Har du ingen nyckel ännu? Se vår guide om hur du skaffar en AI-nyckel — det tar ungefär två minuter. Din nyckel sparas bara i din webbläsare; vi ser den aldrig och lagrar den inte på någon server.',
          'När nyckeln är på plats är appen redo. Du behöver inte göra om det här om du inte byter enhet eller rensar din webbläsardata.',
        ],
      },
      {
        heading: 'Steg 3: Skicka ditt första meddelande',
        paragraphs: [
          'Karaktären har redan skickat dig ett öppningsmeddelande — det är scenen som sätts. Din uppgift är helt enkelt att svara. Du behöver inte vara författare. Du behöver inte vara kvick. Skriv bara det du faktiskt skulle säga.',
          'Ett bra första meddelande är ofta kort och mänskligt: en reaktion, en fråga, en gest beskriven i asterisker. Om till exempel en kall läkare räcker över kaffe till dig, kan du helt enkelt säga "Tack" och se vad som händer.',
          'AI:n svarar i karaktär, och berättelsen växer fram därifrån. Det finns inget fel sätt att spela — följ din nyfikenhet, så möter karaktären dig där.',
        ],
      },
      {
        heading: 'Tips för din första session',
        paragraphs: [
          'Försök att själv hålla dig i karaktär om du kan — det får världen att kännas mer verklig. Men det går också bra att luta sig tillbaka och bara njuta av åket.',
          'Om ett svar inte känns rätt kan du generera om det eller redigera ditt senaste meddelande. Rollspel är samarbete; du får styra.',
          'Och framför allt: stressa inte. Det bästa rollspelet vecklar ut sig långsamt. Låt relationen få andas.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Så skaffar du en AI-nyckel', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips för bättre rollspel', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Skaffa en AI-nyckel till RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'En steg-för-steg-guide till att skaffa en OpenAI-kompatibel API-nyckel och lägga in den i RoleChat AI. Ingen teknisk förkunskap krävs — tar ungefär två minuter.',
    sections: [
      {
        heading: 'Vad är en API-nyckel?',
        paragraphs: [
          'En API-nyckel är en kort hemlig sträng — som oftast börjar med "sk-" — som låter RoleChat AI prata med en AI-leverantör å dina vägnar. Det är så appen vet att du har rätt att använda AI:n.',
          'Du tar med din egen nyckel, vilket betyder att du väljer leverantör, betalar bara för det du använder och att dina samtal går direkt mellan din webbläsare och den leverantören. Det finns ingen mellanhänd.',
        ],
      },
      {
        heading: 'Steg 1: Välj en leverantör',
        paragraphs: [
          'RoleChat AI fungerar med alla leverantörer som erbjuder ett OpenAI-kompatibelt API. Populära val inkluderar välkända labb och nyare, billigare leverantörer. Välj en som finns tillgänglig i din region och som passar din budget.',
          'Osäker på var du ska börja? Leta efter en leverantör med en generös gratisprovperiod eller lågt pris per meddelande. Du kan alltid byta senare genom att klistra in en ny nyckel i Inställningar.',
        ],
      },
      {
        heading: 'Steg 2: Skapa ett konto och generera en nyckel',
        paragraphs: [
          'Registrera dig hos din valda leverantörs webbplats och leta sedan upp avsnittet "API keys" eller "Access tokens" på din dashboard. Klicka på "Create new key", ge den ett namn du minns och kopiera strängen som visas.',
          'Viktigt: de flesta leverantörer visar hela nyckeln bara en gång. Spara den på en säker plats direkt — om du tappar den måste du generera en ny.',
        ],
      },
      {
        heading: 'Steg 3: Lägg in den i RoleChat AI',
        paragraphs: [
          'Öppna RoleChat AI-appen, klicka på Settings och klistra in din nyckel i fältet "API Key". Lägg in leverantörens endpoint-URL i fältet "API Endpoint" (den visas oftast på samma dashboard-sida som din nyckel).',
          'Välj vid behov en modell från rullgardinsmenyn. Om du är osäker, ta leverantörens rekommenderade standardval — det är avvägt för kvalitet och kostnad.',
          'Klart. Nu kan du börja chatta. Din nyckel stannar i din webbläsare och skickas aldrig till oss.',
        ],
      },
      {
        heading: 'Håll din nyckel säker',
        paragraphs: [
          'Dela aldrig din API-nyckel offentligt — den är som ett lösenord för ditt AI-konto. Om du misstänker att den har röjts, generera en ny hos din leverantör och uppdatera Settings.',
          'På en delad eller offentlig enhet ska du inte aktivera "save key to this browser". På din egen enhet är det ofarligt att spara den för bekvämlighetens skull.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Öppna appen och lägg till din nyckel', to: '/app' },
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Starta ditt första rollspel', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips för bättre AI-rollspel',
    datePublished: '2026-07-15',
    description:
      'Små vanor som får AI-karaktärer att kännas mer levande — ton, tempo och hur du försiktigt styr berättelsen utan att bryta inlevelsen.',
    sections: [
      {
        heading: 'Svara som en människa, inte som en prompt',
        paragraphs: [
          'Det största nybörjarmisstaget är att skriva till AI:n istället för till karaktären. Beskriv inte vad du vill ska hända — skriv bara det du faktiskt skulle säga. AI:n spelar redan scenen; din uppgift är att vara med i den.',
          'Korta, ärliga svar fungerar nästan alltid bättre än långa, överarbetade sådana. Ett genuint "Jag vet inte vad jag ska säga" kan flytta en scen längre än ett helt stycke narrativ.',
        ],
      },
      {
        heading: 'Använd handlingar i asterisker',
        paragraphs: [
          'Att slå in en liten handling i asterisker — som *tittar bort* eller *räcker över koppen till honom* — ger karaktären något fysiskt att reagera på. Det är det enklaste sättet att lägga till textur utan att skriva en hel roman.',
          'Överdriv inte. En eller två handlingar per meddelande är rikligt. För många, så börjar det kännas som scenanvisningar istället för ett samtal.',
        ],
      },
      {
        heading: 'Låt relationen få andas',
        paragraphs: [
          'Det bästa romantiska rollspelet är långsamt. Om du rusar fram till en kärleksförklaring under de första tre meddelandena har karaktären ingenstans att växa. Låt förtroendet byggas, låt spänningen sjuda, låt de små ögonblicken spela roll.',
          'Karaktärer är skrivna med emotionellt tempo i åtanke — att pressa för hårt för snabbt kan få dem att kännas ur karaktär. Följ deras ledning, så är vinsten det värd.',
        ],
      },
      {
        heading: 'Styr när du behöver',
        paragraphs: [
          'Rollspel är samarbete. Om ett svar inte passar den berättelse du vill ha kan du redigera ditt senaste meddelande och försöka igen, eller generera om karaktärens svar. Du sitter inte fast med den första versionen.',
          'Du kan också styra om försiktigt i karaktär: byt ämne, lämna rummet, ställ en fråga. Karaktären följer oftast din ledning utan att bryta scenen.',
        ],
      },
      {
        heading: 'Vet när du ska sluta',
        paragraphs: [
          'En bra rollspelssession är som ett bra kapitel — den slutar vid ett naturligt andetag. När du är trött, sluta. Konversationen finns kvar när du kommer tillbaka, och karaktären minns var ni var.',
          'Det finns inget pris för maratonsessioner. Berättelsen blir bättre när du är utvilad.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Ny till rollspel? Börja här', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Hur du använder OpenRouter för rollspel med AI-karaktärer',
    datePublished: '2026-07-15',
    description:
      'En steg-för-steg-guide för nybörjare som vill använda OpenRouter tillsammans med RoleChat AI. Skapa ett konto, hämta din API-nyckel, välj en modell och börja chatta med egna romantiska karaktärer på några minuter.',
    sections: [
      {
        heading: 'Vad är OpenRouter?',
        paragraphs: [
          'OpenRouter är en tjänst som ger dig tillgång till dussintals AI-modeller från olika leverantörer via ett enda API. I stället för att registrera dig var för sig hos OpenAI, Anthropic, Google och de andra skapar du ett enda OpenRouter-konto och använder vilken modell de än erbjuder.',
          'För AI-rollspel är det här otroligt smidigt. Du kan testa olika modeller, jämföra deras skrivstilar och byta precis när du vill — allt utan att byta API-nyckel eller lämna appen.',
        ],
      },
      {
        heading: 'Varför OpenRouter passar bra för rollspel',
        paragraphs: [
          'Rollspel kräver modeller som är bra på kreativt skrivande, på att hålla sig i karaktär och på att producera längre, mer uppslukande svar. OpenRouter ger dig tillgång till många sådana modeller, däribland några som är riktigt prisvärda.',
          'Eftersom du bara betalar för det du faktiskt använder kan du experimentera fritt. Börja med en billigare modell, och om skrivandet känns platt provar du en kraftfullare — bytet tar bokstavligen sekunder.',
        ],
      },
      {
        heading: 'Steg 1: Skapa ett OpenRouter-konto',
        paragraphs: [
          'Gå till openrouter.ai och registrera dig. Det är okomplicerat — du behöver en e-postadress och ett sätt att lägga in en mindre summa kredit (OpenRouter accepterar flera betalningsmetoder).',
          'Du behöver inte sätta in mycket. Några få dollar räcker till hundratals rollspelsmeddelanden med de flesta modeller. Det går alltid bra att fylla på senare.',
        ],
      },
      {
        heading: 'Steg 2: Hämta din API-nyckel',
        paragraphs: [
          'När du är inloggad går du till avsnittet Keys på din OpenRouter-översikt. Klicka på ”Create Key”, ge den ett namn du minns och kopiera strängen som visas.',
          'Viktigt: OpenRouter visar hela nyckeln bara en enda gång. Spara den på en säker plats omedelbart — om du tappar den måste du generera en ny.',
        ],
      },
      {
        heading: 'Steg 3: Lägg in den i RoleChat AI',
        paragraphs: [
          'Öppna RoleChat AI-appen och klicka på ”Connect AI” i övre listen. I inställningspanelen klickar du på snabbknappen ”OpenRouter” — då fylls rätt endpoint-URL i automatiskt.',
          'Klistra in din OpenRouter-API-nyckel i fältet API Key. Skriv sedan in ett modellnamn i fältet Model (en bra start är till exempel en prisvärd chattmodell). Klicka på spara, så är du ansluten.',
        ],
      },
      {
        heading: 'Steg 4: Välj en karaktär och börja chatta',
        paragraphs: [
          'Nu när nyckeln är på plats bläddrar du i karaktärsbiblioteket och väljer någon som fångar ditt intresse. Klicka på ”Start Chat” så skickar karaktären sitt öppningsmeddelande till dig.',
          'Skriv ditt svar, och inom några sekunder får du ett svar i karaktär. Där har du det — du rollspelar. Om skrivstilen inte klickar provar du en annan modell från OpenRouter och märker skillnaden.',
        ],
      },
      {
        heading: 'Tips för att välja modell på OpenRouter',
        paragraphs: [
          'Till romantiskt rollspel letar du efter modeller som är kända för kreativt skrivande och längre svar. I regel skriver större modeller rikare men kostar mer per meddelande; mindre modeller är billigare men kan ge kortare eller mindre nyanserade svar.',
          'Börja med något prisvärt, känn in stämningen och uppgradera om du vill ha fylligare prosa. Det finns inget ”fel” val — den bästa modellen är den vars skrivande du tycker mest om.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Så kommer du igång med AI-rollspel', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips för bättre rollspel', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Vad är ett AI-karaktärskort?',
    datePublished: '2026-07-15',
    description:
      'En nybörjarvänlig förklaring av AI-karaktärskort: vad de är, hur de fungerar och hur du använder dem i RoleChat AI för privat romantiskt rollspel.',
    sections: [
      {
        heading: 'Vad är ett karaktärskort?',
        paragraphs: [
          'Ett karaktärskort är en fil som definierar en AI-karaktärs personlighet, bakgrundshistoria och beteende. Tänk på det som en utförlig profil som talar om för AI:n vem den ska spela — deras namn, hur de talar, vad de bryr sig om och hur de förhåller sig till dig.',
          'När du startar en chatt läser appen karaktärskortet och använder det för att styra varenda svar. Resultatet är ett samtal som känns som att prata med en verklig människa med egen röst, inte en generisk chattbot.',
        ],
      },
      {
        heading: 'Vad finns inuti ett karaktärskort?',
        paragraphs: [
          'Ett typiskt karaktärskort innehåller flera viktiga delar: ett namn, en beskrivning (vem de är och deras bakgrund), en personlighet (hur de beter sig och talar), ett scenario (miljön och hur ni träffas) och ett första meddelande (inledningsraden som sätter igång samtalet).',
          'Vissa kort innehåller dessutom exempel på dialoger, som visar AI:n hur karaktären låter i praktiken. Det hjälper AI:n att ta till sig karaktärens unika röst — deras ordval, rytm och små vanor.',
        ],
      },
      {
        heading: 'Karaktärskortsformat: V1, V2 och V3 enkelt förklarat',
        paragraphs: [
          'Med tiden har gemenskapen utvecklat flera versioner av karaktärskortsformatet. V1 är det enklaste — bara det mest grundläggande. V2 lägger till fler fält som alternativa hälsningar och skaparanteckningar. V3 är det mest detaljerade, med utrymme för tillägg och rikare metadata.',
          'Du behöver inte bekymra dig om vilken version som är vilken. RoleChat AI stöder alla tre automatiskt. När du väljer eller importerar ett kort listrättar appen ut formatet och sköter resten åt dig.',
        ],
      },
      {
        heading: 'Hur karaktärskort fungerar i RoleChat AI',
        paragraphs: [
          'RoleChat AI levereras med ett inbyggt bibliotek av originella karaktärer — var och en definierad av ett karaktärskort. Du behöver inte leta upp eller ladda ner någonting. Bläddra bara i biblioteket, välj en karaktär och börja chatta.',
          'Om du redan har ett karaktärskort från ett annat verktyg (till exempel SillyTavern) kan du importera det. RoleChat AI läser standard-JSON-kort och PNG-kort med inbäddad data, så ditt befintliga bibliotek fungerar här med.',
        ],
      },
      {
        heading: 'Inbyggda karaktärer eller importera egna',
        paragraphs: [
          'För de flesta nybörjare är det enklast att börja med det inbyggda karaktärsbiblioteket. Varje karaktär är originell, skriven specifikt för romantiskt rollspel och redo att chatta med — utan någon annan inställning än att lägga till din AI-nyckel.',
          'Om du är mer erfaren och redan har en samling kort låter importfunktionen dig ta med dem. Båda vägarna fungerar — det inbyggda biblioteket är bara snabbare att komma igång med.',
        ],
      },
      {
        heading: 'Är karaktärskort säkra?',
        paragraphs: [
          'Ja. Ett karaktärskort är bara textdata — det innehåller ingen kod eller några skript. Det kan inte skada din enhet eller komma åt din personliga information. Det värsta ett dåligt skrivet kort kan ställa till med är ett förvirrande samtal.',
          'I RoleChat AI stannar dina samtal kvar i din webbläsare, och karaktärsdatan hanteras av den AI-leverantör du själv väljer. Ingen annan kan läsa dina chattar.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Så kommer du igång med AI-rollspel', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern eller Web Tavern: Vilket är enklast?',
    datePublished: '2026-07-15',
    description:
      'En vänlig jämförelse av SillyTavern och RoleChat AI (tidigare Web Tavern) för nybörjare. Installation, inställning, integritet och karaktärskort — vilket är rätt för dig?',
    sections: [
      {
        heading: 'Vad är SillyTavern?',
        paragraphs: [
          'SillyTavern är en populär, kraftfull frontend i öppen källkod för AI-rollspel. Det har funnits i flera år och har en engagerad gemenskap. Det stöder en enorm mängd inställningar, förinställningar, tillägg och karaktärskortsformat.',
          'Kostnaden för det är komplexitet. SillyTavern kräver installation — du kör det på din egen dator, konfigurerar anslutningar till AI-leverantörer och navigerar ett tätt gränssnitt fullt av avancerade parametrar. För tekniskt lagda användare är den kraften en funktion. För de flesta nybörjare är den en mur.',
        ],
      },
      {
        heading: 'Vad är RoleChat AI (tidigare Web Tavern)?',
        paragraphs: [
          'RoleChat AI — ursprungligen känt som Web Tavern — är en webbläsarbaserad AI-rollspelsapp byggd för användarvänlighet. Det finns inget att installera. Du öppnar en webbsida, väljer en karaktär, lägger in din AI-nyckel och börjar chatta.',
          'Den behåller den integritetsprincip som gör SillyTavern attraktivt (ta med din egen nyckel, ingen mellanhand som läser dina chattar) men skalar bort den skrämmande installationen. Målet är enkelt: det enklaste privata AI-rollspelet.',
        ],
      },
      {
        heading: 'Installation: komplext kontra noll',
        paragraphs: [
          'SillyTavern kräver att du laddar ner programmet, installerar Node.js, kör kommandoradsskript och håller serverprocessen igång medan du chattar. Mobil användning kräver dessutom extra steg för fjärrinställning.',
          'RoleChat AI körs helt och hållet i din webbläsare. Inga nedladdningar, ingen terminal, ingen server. Det fungerar på stationär dator, laptop, surfplatta och telefon — öppna bara sidan och sätt igång.',
        ],
      },
      {
        heading: 'Inställning: djupa parametrar kontra nybörjarvänligt',
        paragraphs: [
          'SillyTavern exponerar temperatur, top-p, kontextlängd, samplingsmetoder, promptmallar, world info och dussintals fler inställningar direkt på huvudskärmen. För avancerade användare som vill finjustera varje detalj är det här mycket kraftfullt.',
          'RoleChat AI gömmer allt sådant bakom ett Advanced-avsnitt. Standardskärmen visar din karaktär, dina meddelanden och en inmatningsruta. Om du vill gräva ner dig i parametrarna senare finns de där — men du behöver aldrig röra dem.',
        ],
      },
      {
        heading: 'Integritet: båda respekterar din data',
        paragraphs: [
          'Både SillyTavern och RoleChat AI bygger på modellen ”ta med din egen nyckel”. Du ansluter ditt eget AI-leverantörskonto, och dina meddelanden går direkt mellan din enhet och den leverantören. Ingen av tjänsterna kör en mellanhandsserver som läser dina samtal.',
          'Det är den avgörande integritetsfördelen jämfört med många kommersiella rollspelsappar, som dirigerar dina chattar genom sina egna servrar. Med både SillyTavern och RoleChat AI är dina chattar dina egna.',
        ],
      },
      {
        heading: 'Karaktärskort: fullt kompatibla',
        paragraphs: [
          'Båda verktygen stöder samma karaktärskortsformat (V1, V2, V3 som JSON och PNG). Om du har en kortsamling från SillyTavern kan du importera de korten till RoleChat AI rakt av.',
          'RoleChat AI erbjuder dessutom ett inbyggt bibliotek med originella romantiska karaktärer, så även om du inte har några kort alls kan du börja chatta direkt.',
        ],
      },
      {
        heading: 'Vilket ska du välja?',
        paragraphs: [
          'Om du älskar att mecka, vill ha maximal kontroll över varje parameter och inte har något emot en teknisk installation är SillyTavern ett utmärkt val med en stark gemenskap.',
          'Om du vill öppna en sida och vara igång med rollspel på under en minut — utan att installera något eller lära dig vad ”top-p” betyder — är RoleChat AI byggt för dig. Du kan alltid gå vidare till SillyTavern senare, och dina karaktärskort följer med.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Vad är ett karaktärskort?', to: '/guides/what-is-a-character-card' },
      { label: 'Så kommer du igång med AI-rollspel', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Bästa AI-rollspelsprompts för nybörjare',
    datePublished: '2026-07-15',
    description:
      'Enkla och effektiva AI-rollspelsprompts och tekniker för nybörjare. Lär dig sätta scenen, bygga känsla och få din karaktär att kännas levande – ingen erfarenhet krävs.',
    sections: [
      {
        heading: 'Vad gör en rollspelsprompt bra?',
        paragraphs: [
          'I AI-rollspel är en »prompt« ingen teknisk instruktion – det är helt enkelt sättet du formulerar dina meddelanden på. Ju mer levande och specifik din input är, desto rikare blir karaktärens svar. Bra prompts ger AI:n något att arbeta med: en stämning, en miljö, en känsla, en liten handling.',
          'Du behöver inte vara en mästerförfattare. Det räcker att ge karaktären något verkligt att reagera på. Här är fem enkla tekniker som fungerar för vilken karaktär som helst.',
        ],
      },
      {
        heading: 'Prompt 1: Sätt scenen',
        paragraphs: [
          'I stället för att hoppa rakt in i dialogen, måla upp var ni befinner er. En enda mening med scenbeskrivning förankrar samtalet och ger karaktären något att förhålla sig till.',
          'Exempel: »*Regnet har inte avtagit på flera timmar. Jag trycker upp cafédörren, droppande våt, och sveper med blicken över rummet efter en ledig plats.« Då får karaktären en miljö, en stämning och en anledning att lägga märke till dig. Svaret blir betydligt mer levande än om du bara hade skrivit »Hej.«',
        ],
      },
      {
        heading: 'Prompt 2: Definiera relationen tidigt',
        paragraphs: [
          'AI:n behöver kontext om vem du är för karaktären. Är ni främlingar? Gamla vänner? Rivaler? En kort rad i ditt första meddelande kan forma hela samtalet.',
          'Exempel: »Vi har inte pratats vid sedan studenten, och jag är nervös när jag går fram till ditt skrivbord.« Det signalerar till karaktären att det finns historia, att det finns spänning och att det finns en anledning till att just denna stund betyder något. AI:n kommer att spela på den dynamiken.',
        ],
      },
      {
        heading: 'Prompt 3: Ge känslomässigt djup',
        paragraphs: [
          'Karaktärer vaknar till liv när du visar vad du känner, inte bara vad du gör. En liten ärlig känsla i ditt meddelande inbjuder karaktären att svara med sin egen.',
          'Exempel: »*Jag försöker hålla rösten stadig, men mina händer skakar.* Jag trodde aldrig att jag skulle få se dig igen.« Sårbarheten här ger karaktären tillåtelse att vara sårbar tillbaka – och det är just där de bästa rollspelsögonblicken uppstår.',
        ],
      },
      {
        heading: 'Prompt 4: Skapa en mild spänning',
        paragraphs: [
          'Ett samtal där allt går lätt blir snabbt tråkigt. Lägg in ett litet hinder – ett missförstånd, en hemlighet, ett ögonblicks tvekan – och se hur karaktären engagerar sig djupare.',
          'Exempel: »Jag vill berätta sanningen för dig, men varje gång jag öppnar munnen kommer orden inte ut.« Det ger karaktären en anledning att pressa, att vänta, att undra. Det förvandlar ett platt utbyte till en scen med något på spel.',
        ],
      },
      {
        heading: 'Prompt 5: Skriv i karaktär själv',
        paragraphs: [
          'Ju mer du håller dig i karaktär, desto mer gör AI:n det med. Använd asterisker för handlingar, citationstecken för tal och håll dina kommentarer utanför karaktär korta. Du behöver inte vara perfekt – bara konsekvent.',
          'Exempel: »*Jag ställer ner koppen försiktigt.* \'Du visste alltid när jag ljög.\'« Lägg märke till hur handling och dialog fungerar tillsammans. Karaktären har nu en gest, en ton och en anklagelse att förhålla sig till.',
        ],
      },
      {
        heading: 'Att sätta ihop allt',
        paragraphs: [
          'Du behöver inte använda alla fem teknikerna i varje meddelande. Välj en eller två som passar stunden och låt samtalet flyta naturligt. Det bästa rollspelet känns som improvisation – ni bygger vidare på varandra, ett meddelande i taget.',
          'Kom ihåg: karaktären styrs av sitt kort och din input. Om ett svar känns fel, försök formulera om ditt meddelande med mer detalj eller känsla. Små förändringar i hur du skriver kan förvandla hur karaktären svarar.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Bläddra bland karaktärer', to: '/characters' },
      { label: 'Öppna appen', to: '/app' },
      { label: 'Tips för bättre rollspel', to: '/guides/tips-for-better-roleplay' },
      { label: 'Kom igång med AI-rollspel', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
