import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Come iniziare con il roleplay AI da principiante',
    datePublished: '2026-07-15',
    description:
      'Una guida completa per iniziare il tuo primo roleplay AI su RoleChat AI. Scegli un personaggio, aggiungi la tua chiave AI e invia il primo messaggio in meno di cinque minuti.',
    sections: [
      {
        heading: 'Cos\'è il roleplay AI?',
        paragraphs: [
          'Il roleplay AI è una conversazione tra te e un\'IA che interpreta un personaggio di finzione. Tu reciti te stesso — o chiunque tu voglia essere — e l\'IA ti risponde restando nel personaggio, in tempo reale, costruendo insieme a te una storia un messaggio alla volta.',
          'A differenza di un chatbot che si limita a rispondere alle domande, un personaggio di roleplay ha una personalità, un passato, un modo di parlare e un legame con te. L\'obiettivo non è ottenere informazioni, ma vivere una storia con qualcuno che sembra vero.',
          'Su RoleChat AI ogni personaggio è originale — non è copiato da un gioco o da una serie — e ogni conversazione è completamente privata: gira nel tuo browser con la tua chiave AI.',
        ],
      },
      {
        heading: 'Passo 1: scegli un personaggio',
        paragraphs: [
          'Vai nella pagina Personaggi e scorri la libreria. Ogni personaggio ha un nome, uno slogan, una breve descrizione e tag di personalità, così sai subito cosa stai per incontrare.',
          'È la tua prima volta con il roleplay sentimentale? Parti con un personaggio «comfort» o «slow burn». Sono più dolci e tolleranti — perfetti per trovare l\'equilibrio. Potrai sempre provare qualcosa di più intenso in seguito.',
          'Quando ne trovi uno che ti piace, clicca sulla sua scheda per aprire la pagina del personaggio. Leggi la descrizione e il messaggio di apertura: quel messaggio è esattamente come inizierà la vostra conversazione.',
        ],
      },
      {
        heading: 'Passo 2: apri l\'app e aggiungi la tua chiave AI',
        paragraphs: [
          'Clicca il pulsante «Avvia chat privata» in qualsiasi pagina personaggio per aprire l\'app. Prima del primo messaggio dovrai aggiungere una chiave AI: una breve stringa segreta che permette all\'app di comunicare con un provider AI.',
          'Non hai ancora una chiave? Consulta la nostra guida su come ottenere una chiave AI: ci vogliono circa due minuti. La tua chiave resta salvata solo nel tuo browser; non la vediamo mai e non la conserviamo su alcun server.',
          'Una volta inserita la chiave, l\'app è pronta. Non dovrai ripetere l\'operazione, a meno che tu non cambi dispositivo o cancelli i dati del browser.',
        ],
      },
      {
        heading: 'Passo 3: invia il primo messaggio',
        paragraphs: [
          'Il personaggio ti avrà già inviato un messaggio di apertura: è lui a impostare la scena. Il tuo compito è semplicemente rispondere. Non devi essere uno scrittore. Non devi essere brillante. Scrivi semplicemente quello che diresti davvero.',
          'Un bel primo messaggio spesso è breve e umano: una reazione, una domanda, un gesto descritto tra asterischi. Ad esempio, se un medico freddo ti porge un caffè, potresti limitarti a dire «Grazie» e vedere cosa succede.',
          'L\'IA risponderà nel personaggio e la storia prenderà forma da lì. Non c\'è un modo sbagliato di giocare: segui la curiosità e il personaggio ti verrà incontro.',
        ],
      },
      {
        heading: 'Consigli per la prima sessione',
        paragraphs: [
          'Se ci riesci, resta anche tu nel personaggio: renderà il mondo più vero. Ma va benissimo anche fare un passo indietro e goderti il viaggio.',
          'Se una risposta non ti convince, puoi rigenerarla o modificare il tuo ultimo messaggio. Il roleplay è collaborativo: hai il diritto di guidarlo.',
          'Soprattutto: non c\'è fretta. Il roleplay migliore si svela con calma. Lascia respirare la relazione.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Come ottenere una chiave AI', to: '/guides/how-to-get-an-api-key' },
      { label: 'Consigli per un roleplay migliore', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Come ottenere una chiave AI per RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Una guida passo per passo per ottenere una chiave API compatibile con OpenAI e aggiungerla a RoleChat AI. Non serve alcuna competenza tecnica: bastano circa due minuti.',
    sections: [
      {
        heading: 'Cos\'è una chiave API?',
        paragraphs: [
          'Una chiave API è una breve stringa segreta — di solito inizia con «sk-» — che permette a RoleChat AI di comunicare con un provider AI per tuo conto. È così che l\'app sa che sei autorizzato a usare l\'IA.',
          'La chiave la porti tu: scegli tu il provider, paghi solo ciò che usi e le tue conversazioni passano direttamente dal tuo browser al provider. Nessun intermediario.',
        ],
      },
      {
        heading: 'Passo 1: scegli un provider',
        paragraphs: [
          'RoleChat AI funziona con qualsiasi provider che offra un\'API compatibile con OpenAI. Tra le scelte più diffuse ci sono laboratori noti e provider più nuovi a basso costo. Scegline uno disponibile nella tua regione e adatto al tuo budget.',
          'Non sai da dove iniziare? Cerca un provider con una prova gratuita generosa o un prezzo basso a messaggio. Puoi sempre cambiare in seguito incollando una nuova chiave in Impostazioni.',
        ],
      },
      {
        heading: 'Passo 2: crea un account e genera una chiave',
        paragraphs: [
          'Registrati sul sito del provider scelto, poi cerca la sezione «API keys» o «Access tokens» nella tua dashboard. Clicca «Create new key», dalle un nome che ricorderai e copia la stringa che ti mostra.',
          'Attenzione: la maggior parte dei provider mostra la chiave completa una sola volta. Salvala subito in un posto sicuro: se la perdi, dovrai generarne una nuova.',
        ],
      },
      {
        heading: 'Passo 3: aggiungila a RoleChat AI',
        paragraphs: [
          'Apri l\'app di RoleChat AI, clicca su Impostazioni e incolla la chiave nel campo «API Key». Inserisci l\'URL dell\'endpoint del provider nel campo «API Endpoint» (di solito è indicato sulla stessa pagina della dashboard della chiave).',
          'Se vuoi, scegli un modello dal menu a discesa. Se non sai quale prendere, seleziona il default consigliato dal provider: è bilanciato tra qualità e costo.',
          'Ecco fatto. Sei pronto a chattare. La chiave resta nel tuo browser e non ci viene mai inviata.',
        ],
      },
      {
        heading: 'Tenere al sicuro la chiave',
        paragraphs: [
          'Non condividere mai la tua chiave API in pubblico: è come la password del tuo account AI. Se pensi che sia stata compromessa, rigenerala dal provider e aggiornala in Impostazioni.',
          'Su un dispositivo condiviso o pubblico non attivare «salva la chiave in questo browser». Sul tuo dispositivo personale, invece, puoi salvarla comodamente.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Apri l\'app per aggiungere la chiave', to: '/app' },
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Inizia il tuo primo roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Consigli per un roleplay AI migliore',
    datePublished: '2026-07-15',
    description:
      'Piccole abitudini che rendono i personaggi AI più vivi — tono, ritmo e come guidare con delicatezza la storia senza spezzare l\'immersione.',
    sections: [
      {
        heading: 'Rispondi come una persona, non come un prompt',
        paragraphs: [
          'L\'errore più comune da principianti è scrivere all\'IA invece di scrivere al personaggio. Non descrivere ciò che vuoi che accada: dì semplicemente quello che diresti davvero. L\'IA sta già recitando la scena; il tuo compito è esserci dentro.',
          'Risposte brevi e sincere quasi sempre funzionano meglio di quelle lunghe e sovrascritte. Un vero «non so cosa dire» può far avanzare una scena più di un intero paragrafo di narrazione.',
        ],
      },
      {
        heading: 'Usa le azioni tra asterischi',
        paragraphs: [
          'Racchiudere una piccola azione tra asterischi — come *distoglie lo sguardo* o *gli porge la tazza* — dà al personaggio qualcosa di fisico a cui reagire. È il modo più semplice di aggiungere spessore senza dover scrivere un romanzo.',
          'Non esagerare. Una o due azioni per messaggio sono più che sufficienti. Con troppe, inizia a sembrare una didascalia teatrale invece di una conversazione.',
        ],
      },
      {
        heading: 'Lascia respirare la relazione',
        paragraphs: [
          'Il roleplay sentimentale migliore è lento. Se ti precipiti a una dichiarazione nei primi tre messaggi, il personaggio non ha spazio per crescere. Lascia che la fiducia si costruisca, che la tensione monti lentamente, che i piccoli momenti contino.',
          'I personaggi sono scritti pensando a un ritmo emotivo: spingere troppo e troppo in fretta può farli sentire fuori carattere. Segui il loro ritmo e la ricompensa ne varrà la pena.',
        ],
      },
      {
        heading: 'Guida quando serve',
        paragraphs: [
          'Il roleplay è collaborativo. Se una risposta non si adatta alla storia che vuoi, puoi modificare il tuo ultimo messaggio e riprovare, oppure rigenerare la replica del personaggio. Non sei obbligato a tenere la prima versione.',
          'Puoi anche riorientare con delicatezza restando nel personaggio: cambia argomento, lascia la stanza, fai una domanda. Di solito il personaggio ti seguirà senza spezzare la scena.',
        ],
      },
      {
        heading: 'Sapere quando fermarsi',
        paragraphs: [
          'Una bella sessione di roleplay è come un buon capitolo: finisce in una pausa naturale. Quando sei stanco, fermati. La conversazione sarà ancora lì al tuo ritorno e il personaggio ricorderà dove vi eravate lasciati.',
          'Non c\'è nessun premio per le sessioni infinite. La storia migliora quando sei riposato.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Nuovo al roleplay? Inizia da qui', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Come usare OpenRouter per il roleplay con personaggi AI',
    datePublished: '2026-07-15',
    description:
      'Una guida passo passo per chi inizia a usare OpenRouter con RoleChat AI. Crea un account, ottieni la tua chiave API, scegli un modello e inizia a chattare con personaggi romantici inediti in pochi minuti.',
    sections: [
      {
        heading: 'Che cos\'è OpenRouter?',
        paragraphs: [
          'OpenRouter è un servizio che ti permette di accedere a decine di modelli AI di provider diversi tramite un\'unica API. Invece di registrarti separatamente su OpenAI, Anthropic, Google e altri, crei un solo account OpenRouter e usi qualsiasi modello offrano.',
          'Per il roleplay AI è una comodità enorme. Puoi provare modelli diversi, confrontarne lo stile di scrittura e cambiare quando vuoi, tutto senza dover toccare la chiave API o uscire dall\'app.',
        ],
      },
      {
        heading: 'Perché OpenRouter funziona bene per il roleplay',
        paragraphs: [
          'Il roleplay ha bisogno di modelli bravi nella scrittura creativa, capaci di restare in personaggio e di produrre risposte più lunghe e immersivi. OpenRouter ti dà accesso a molti modelli del genere, inclusi alcuni davvero economici.',
          'Poiché paghi solo ciò che usi, puoi sperimentare in libertà. Parti da un modello più economico e, se la scrittura ti sembra piatta, provane uno più potente: il passaggio richiede pochi secondi.',
        ],
      },
      {
        heading: 'Passo 1: crea un account OpenRouter',
        paragraphs: [
          'Vai su openrouter.ai e registrati. La procedura è semplice: ti serve un indirizzo email e un modo per aggiungere un piccolo importo di credito (OpenRouter accetta diversi metodi di pagamento).',
          'Non devi caricare molto. Poche decine di dollari bastano per centinaia di messaggi di roleplay con la maggior parte dei modelli. Puoi sempre ricaricare in seguito.',
        ],
      },
      {
        heading: 'Passo 2: ottieni la tua chiave API',
        paragraphs: [
          'Una volta entrato, vai alla sezione Keys della tua dashboard OpenRouter. Clicca «Create Key», dalle un nome facile da ricordare e copia la stringa che ti viene mostrata.',
          'Attenzione: OpenRouter mostra la chiave completa una sola volta. Salvala subito in un posto sicuro: se la perdi, dovrai generarne una nuova.',
        ],
      },
      {
        heading: 'Passo 3: aggiungila a RoleChat AI',
        paragraphs: [
          'Apri l\'app RoleChat AI e clicca «Connect AI» nella barra in alto. Nel pannello Settings, clicca il pulsante di compilazione rapida «OpenRouter»: compilerà in automatico l\'URL dell\'endpoint corretto.',
          'Incolla la tua chiave API OpenRouter nel campo API Key. Poi inserisci il nome di un modello nel campo Model (per esempio, un buon punto di partenza è un modello di chat economico). Clicca su salva e la connessione è pronta.',
        ],
      },
      {
        heading: 'Passo 4: scegli un personaggio e inizia a chattare',
        paragraphs: [
          'Ora che la chiave è configurata, esplora la libreria dei personaggi e scegli qualcuno che ti colpisce. Clicca «Start Chat» e il personaggio ti invierà il suo messaggio di apertura.',
          'Scrivi la tua risposta e in pochi secondi riceverai una risposta in personaggio. Ecco fatto: stai facendo roleplay. Se lo stile di scrittura non ti convince, prova un altro modello da OpenRouter e vedrai come cambia.',
        ],
      },
      {
        heading: 'Consigli per scegliere un modello su OpenRouter',
        paragraphs: [
          'Per il roleplay sentimentale, cerca modelli noti per la scrittura creativa e output più lunghi. In generale, i modelli più grandi scrivono in modo più ricco ma costano di più per messaggio; i modelli più piccoli sono più economici ma possono produrre risposte più brevi o meno sfumate.',
          'Parti da qualcosa di economico, prendi confidenza con il flusso e passa a un modello superiore se vuoi prosa più ricca. Non c\'è una scelta «sbagliata»: il miglior modello è semplicemente quello la cui scrittura ti piace di più.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Come iniziare il roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Consigli per un roleplay migliore', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Che cos\'è una scheda personaggio AI?',
    datePublished: '2026-07-15',
    description:
      'Una spiegazione adatta a chi inizia: cosa sono le schede personaggio AI, come funzionano e come usarle in RoleChat AI per il roleplay sentimentale in privato.',
    sections: [
      {
        heading: 'Che cos\'è una scheda personaggio?',
        paragraphs: [
          'Una scheda personaggio è un file che definisce la personalità, il passato e il comportamento di un personaggio AI. Pensala come un profilo dettagliato che dice all\'AI chi deve interpretare: il nome, come parla, ciò che le importa e come si relaziona a te.',
          'Quando avvii una chat, l\'app legge la scheda personaggio e la usa per guidare ogni risposta. Il risultato è una conversazione che sembra di parlare con una persona vera, con la sua voce, e non con un chatbot generico.',
        ],
      },
      {
        heading: 'Cosa contiene una scheda personaggio?',
        paragraphs: [
          'Una scheda personaggio tipica contiene diversi dati chiave: un nome, una descrizione (chi è e il suo passato), una personalità (come si comporta e parla), uno scenario (l\'ambientazione e il vostro incontro) e un primo messaggio (la battuta di apertura che avvia la conversazione).',
          'Alcune schede includono anche dialoghi di esempio, che mostrano all\'AI come il personaggio parla nella pratica. Questo aiuta l\'AI a cogliere la voce unica del personaggio: le scelte di parole, il ritmo, le piccole abitudini.',
        ],
      },
      {
        heading: 'Formati delle schede personaggio: V1, V2, V3 spiegati in modo semplice',
        paragraphs: [
          'Nel tempo, la community ha sviluppato versioni diverse del formato scheda personaggio. V1 è la più semplice, solo l\'essenziale. V2 aggiunge altri campi come i saluti alternativi e le note dell\'autore. V3 è la più ricca, con spazio per estensioni e metadati più dettagliati.',
          'Non devi preoccuparti di quale versione sia quale. RoleChat AI le supporta tutte e tre automaticamente. Quando scegli o importi una scheda, l\'app riconosce il formato e la gestisce per te.',
        ],
      },
      {
        heading: 'Come funzionano le schede personaggio in RoleChat AI',
        paragraphs: [
          'RoleChat AI include una libreria di personaggi inediti, ciascuno definito da una scheda personaggio. Non devi cercare né scaricare nulla. Ti basta esplorare la libreria, scegliere un personaggio e iniziare a chattare.',
          'Se hai già una scheda personaggio creata con un altro strumento (SillyTavern, per esempio), puoi importarla. RoleChat AI legge le schede JSON standard e le PNG con dati incorporati, quindi la tua libreria esistente funziona anche qui.',
        ],
      },
      {
        heading: 'Personaggi inclusi o importare i tuoi',
        paragraphs: [
          'Per chi inizia, la via più semplice è partire dalla libreria di personaggi inclusa. Ogni personaggio è originale, scritto appositamente per il roleplay sentimentale e pronto a chattare senza configurazione, se non aggiungere la tua chiave AI.',
          'Se sei più esperto e hai una collezione di schede, la funzione di importazione ti permette di portarle con te. Entrambe le strade funzionano: la libreria inclusa è solo più veloce per cominciare.',
        ],
      },
      {
        heading: 'Le schede personaggio sono sicure?',
        paragraphs: [
          'Sì. Una scheda personaggio è solo dati testuali: non contiene codice né script. Non può danneggiare il tuo dispositivo né accedere alle tue informazioni personali. Il peggio che una scheda scritta male può fare è generare una conversazione un po\' confusionaria.',
          'Su RoleChat AI le tue conversazioni restano nel browser e i dati del personaggio vengono elaborati dal provider AI che scegli. Nessun altro può vedere le tue chat.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Come iniziare il roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern o Web Tavern: quale è più facile?',
    datePublished: '2026-07-15',
    description:
      'Un confronto alla mano tra SillyTavern e RoleChat AI (ex Web Tavern) pensato per chi inizia. Installazione, configurazione, privacy e schede personaggio: quale fa per te?',
    sections: [
      {
        heading: 'Che cos\'è SillyTavern?',
        paragraphs: [
          'SillyTavern è un frontend open source per il roleplay AI, molto noto e potente. È attivo da anni e ha una community appassionata. Supporta una gamma sterminata di impostazioni, preset, estensioni e formati di scheda personaggio.',
          'Il rovescio della medaglia è la complessità. SillyTavern va installato: lo esegui sul tuo computer, configuri le connessioni ai provider AI e ti muovi in un\'interfaccia fitta di parametri avanzati. Per gli utenti tecnici quel potere è un pregio. Per chi inizia, è un muro.',
        ],
      },
      {
        heading: 'Che cos\'è RoleChat AI (ex Web Tavern)?',
        paragraphs: [
          'RoleChat AI, in origine noto come Web Tavern, è un\'app di roleplay AI basata su browser, pensata per la semplicità d\'uso. Non c\'è nulla da installare. Apri una pagina web, scegli un personaggio, aggiungi la tua chiave AI e inizi a chattare.',
          'Mantiene il principio di privacy che rende SillyTavern attraente (chiave tua, nessun intermediario che legge le tue chat) ma elimina l\'installazione intimidatoria. L\'obiettivo è semplice: il roleplay AI privato più facile in assoluto.',
        ],
      },
      {
        heading: 'Installazione: complessa o zero',
        paragraphs: [
          'SillyTavern richiede di scaricare l\'applicazione, installare Node.js, eseguire script da riga di comando e mantenere attivo il processo del server mentre chatti. Su mobile servono ulteriori passaggi di configurazione remota.',
          'RoleChat AI gira interamente nel browser. Niente download, niente terminale, niente server. Funziona su desktop, portatile, tablet e telefono: apri la pagina e parti.',
        ],
      },
      {
        heading: 'Configurazione: parametri profondi o approccio per principianti',
        paragraphs: [
          'SillyTavern mette in bella vista temperatura, top-p, lunghezza di contesto, metodi di campionamento, template di prompt, world info e decine di altre impostazioni nella schermata principale. Per chi vuole regolare ogni dettaglio è molto potente.',
          'RoleChat AI nasconde tutto questo dietro una sezione Advanced. La schermata predefinita ti mostra il personaggio, i messaggi e un campo di input. Se vorrai scavare tra i parametri in un secondo momento, ci sono: ma non sei mai obbligato a toccarli.',
        ],
      },
      {
        heading: 'Privacy: entrambi rispettano i tuoi dati',
        paragraphs: [
          'Sia SillyTavern sia RoleChat AI usano il modello «bring your own key». Colleghi il tuo account del provider AI e i messaggi viaggiano direttamente tra il tuo dispositivo e quel provider. Nessuno dei due servizi gestisce un server intermediario che legge le tue conversazioni.',
          'È il vantaggio di privacy chiave rispetto a molte app commerciali di roleplay, che fanno passare le chat dai loro server. Con SillyTavern come con RoleChat AI, le tue chat sono tue.',
        ],
      },
      {
        heading: 'Schede personaggio: piena compatibilità',
        paragraphs: [
          'Entrambi gli strumenti supportano gli stessi formati di scheda personaggio (V1, V2, V3 in JSON e PNG). Se hai una collezione di schede da SillyTavern, puoi importarle in RoleChat AI direttamente.',
          'RoleChat AI offre anche una libreria inclusa di personaggi sentimentali inediti, quindi anche senza alcuna scheda puoi iniziare a chattare subito.',
        ],
      },
      {
        heading: 'Quale scegliere?',
        paragraphs: [
          'Se ami smanettare, vuoi il controllo massimo su ogni parametro e non ti spaventa una configurazione tecnica, SillyTavern è un\'ottima scelta, con una community solida.',
          'Se vuoi aprire una pagina e fare roleplay in meno di un minuto, senza installare nulla e senza imparare cosa significhi «top-p», RoleChat AI è pensato per te. Potrai sempre passare a SillyTavern in seguito, e le tue schede personaggio verranno con te.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Sfoglia i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Che cos\'è una scheda personaggio?', to: '/guides/what-is-a-character-card' },
      { label: 'Come iniziare il roleplay AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'I migliori prompt di roleplay con l\'IA per principianti',
    datePublished: '2026-07-15',
    description:
      'Prompt di roleplay con l\'IA semplici ed efficaci, pensati per chi inizia. Scopri come costruire l\'atmosfera, dare profondità emotiva e rendere il personaggio davvero vivo — senza alcuna esperienza.',
    sections: [
      {
        heading: 'Cosa rende buono un prompt di roleplay?',
        paragraphs: [
          'Nel roleplay con l\'IA, un «prompt» non è un comando tecnico: è semplicemente il modo in cui scrivi i tuoi messaggi. Più il tuo testo è vivido e dettagliato, più la risposta del personaggio sarà ricca. Un buon prompt dà all\'IA qualcosa su cui lavorare: un\'atmosfera, una cornice, un\'emozione, un piccolo gesto.',
          'Non devi essere un grande scrittore. Devi solo dare al personaggio qualcosa di vero a cui reagire. Ecco cinque tecniche semplici che funzionano con qualsiasi personaggio.',
        ],
      },
      {
        heading: 'Prompt 1: costruisci la scena',
        paragraphs: [
          'Invece di passare subito ai dialoghi, descrivi dove ti trovi. Una sola frase di ambientazione dà consistenza alla conversazione e offre al personaggio qualcosa a cui rispondere.',
          'Esempio: «*Piove da ore senza sosta. Spingo la porta del bar, fradicio, e scruto la sala in cerca di un posto libero.» Così dai al personaggio un\'ambientazione, un\'atmosfera e un motivo per notarti. La sua risposta sarà molto più vivida di un semplice «Ciao».',
        ],
      },
      {
        heading: 'Prompt 2: definisci presto il rapporto',
        paragraphs: [
          'L\'IA ha bisogno di contesto su chi sei per il personaggio. Siete estranei? Amici di vecchia data? Rivali? Una breve riga nel tuo primo messaggio può plasmare l\'intera conversazione.',
          'Esempio: «Non ci parliamo dal diploma, e sono nervoso mentre mi avvicino alla tua scrivania.» Così comunichi al personaggio che c\'è una storia, c\'è tensione e c\'è un motivo per cui questo momento conta. L\'IA si calerà in quella dinamica.',
        ],
      },
      {
        heading: 'Prompt 3: aggiungi profondità emotiva',
        paragraphs: [
          'I personaggi prendono vita quando mostri cosa provi, non solo cosa fai. Un\'emozione onesta, anche piccola, nel tuo messaggio invita il personaggio a rispondere con la sua.',
          'Esempio: «*Cerco di mantenere la voce ferma, ma le mani mi tremano.* Non pensavo ti avrei rivisto.» La vulnerabilità qui dà al personaggio il permesso di essere vulnerabile a sua volta — ed è qui che nascono i momenti migliori del roleplay.',
        ],
      },
      {
        heading: 'Prompt 4: crea una tensione leggera',
        paragraphs: [
          'Una conversazione in cui tutto fila liscio diventa presto noiosa. Inserisci un piccolo ostacolo — un malinteso, un segreto, un attimo di esitazione — e vedrai il personaggio calarsi più a fondo.',
          'Esempio: «Voglio dirti la verità, ma ogni volta che apro bocca le parole non escono.» Così dai al personaggio un motivo per insistere, per aspettare, per chiedersi. Trasforma uno scambio piatto in una scena con qualcosa in gioco.',
        ],
      },
      {
        heading: 'Prompt 5: scrivi restando nel personaggio',
        paragraphs: [
          'Più resti nel personaggio, più l\'IA farà lo stesso. Usa gli asterischi per le azioni, le virgolette per i dialoghi e tieni i commenti fuori dal personaggio brevi. Non devi essere perfetto — solo coerente.',
          'Esempio: «*Appoggio la tazza con cura.* \'Sapevi sempre quando mentivo.\'» Nota come azione e dialogo lavorino insieme. Il personaggio ha ora un gesto, un tono e un\'accusa a cui rispondere.',
        ],
      },
      {
        heading: 'Mettere tutto insieme',
        paragraphs: [
          'Non devi usare tutte e cinque le tecniche in ogni messaggio. Scegline un paio adatte al momento e lascia che la conversazione scorra naturale. Il roleplay migliore somiglia all\'improvvisazione: ci si costruisce a vicenda, un messaggio alla volta.',
          'Ricorda: il personaggio è guidato dalla sua scheda e dai tuoi input. Se una risposta ti sembra fuori luogo, prova a riformulare il messaggio con più dettaglio o più emozione. Piccoli cambiamenti nel modo in cui scrivi possono trasformare le risposte del personaggio.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Esplora i personaggi', to: '/characters' },
      { label: 'Apri l\'app', to: '/app' },
      { label: 'Consigli per un roleplay migliore', to: '/guides/tips-for-better-roleplay' },
      { label: 'Come iniziare con il roleplay IA', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
