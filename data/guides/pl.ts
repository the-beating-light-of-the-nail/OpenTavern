import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Jak zacząć AI roleplay — poradnik dla początkujących',
    datePublished: '2026-07-15',
    description:
      'Kompletny przewodnik dla początkujących, który pomoże Ci rozpocząć Twoją pierwszą sesję AI roleplay na RoleChat AI. Wybierz postać, dodaj swój klucz AI i wyślij pierwszą wiadomość w mniej niż pięć minut.',
    sections: [
      {
        heading: 'Czym jest AI roleplay?',
        paragraphs: [
          'AI roleplay to rozmowa między Tobą a sztuczną inteligencją, która wciela się w fikcyjną postać. Występujesz jako Ty sam — albo jako ktokolwiek zechcesz — a AI odpowiada w roli, w czasie rzeczywistym, budując wspólnie z Tobą historię, wiadomość po wiadomości.',
          'W odróżnieniu od chatbota, który po prostu odpowiada na pytania, postać roleplayowa ma osobowość, historię, swój sposób mówienia oraz relację z Tobą. Chodzi tu nie o zdobywanie informacji — ale o zamieszkanie w historii z kimś, kto wydaje się prawdziwy.',
          'Na RoleChat AI każda postać jest oryginalna — nie skopiowana z żadnej gry ani serialu — a każda rozmowa jest w pełni prywatna i działa w Twojej przeglądarce, z Twoim własnym kluczem AI.',
        ],
      },
      {
        heading: 'Krok 1: Wybierz postać',
        paragraphs: [
          'Wejdź na stronę Postacie i przejrzyj bibliotekę. Każda postać ma imię, hasło przewodnie, krótki opis oraz tagi osobowości, więc wiesz, na co się piszesz, zanim zaczniesz.',
          'Dopiero zaczynasz przygodę z romansowym roleplay? Wybierz postać typu „comfort” albo „slow burn”. Są łagodniejsze i bardziej wyrozumiałe — idealne, żeby znaleźć swój rytm. Z bardziej intensywną postacią zawsze zdążysz eksperymentować później.',
          'Gdy znajdziesz kogoś, kto Ci się spodoba, kliknij jego kartę, aby otworzyć stronę postaci. Przeczytaj opis oraz wiadomość otwierającą — to właśnie tak rozpocznie się Wasza rozmowa.',
        ],
      },
      {
        heading: 'Krok 2: Otwórz aplikację i dodaj swój klucz AI',
        paragraphs: [
          'Kliknij przycisk „Rozpocznij prywatny czat” na stronie dowolnej postaci, aby otworzyć aplikację. Zanim wyślesz pierwszą wiadomość, musisz dodać klucz AI — krótki, tajny ciąg znaków, który pozwala aplikacji połączyć się z dostawcą AI.',
          'Nie masz jeszcze klucza? Zobacz nasz poradnik, jak zdobyć klucz AI — zajmie to około dwóch minut. Twój klucz jest przechowywany wyłącznie w Twojej przeglądarce; nigdy go nie widzimy i nie zapisujemy na żadnym serwerze.',
          'Gdy klucz zostanie dodany, aplikacja jest gotowa. Nie musisz tego powtarzać, chyba że zmienisz urządzenie lub wyczyścisz dane przeglądarki.',
        ],
      },
      {
        heading: 'Krok 3: Wyślij swoją pierwszą wiadomość',
        paragraphs: [
          'Postać wyśle Ci już wiadomość otwierającą — to ona nadaje ton scenie. Twoim zadaniem jest po prostu odpowiedzieć. Nie musisz być pisarzem. Nie musisz błysnąć dowcipem. Wpisz po prostu to, co naprawdę byś powiedział.',
          'Świetna pierwsza wiadomość bywa często krótka i ludzka: reakcja, pytanie, gest opisany w asteriskach. Na przykład, gdy chłodny lekarz podaje Ci kawę, możesz po prostu powiedzieć „Dziękuję” i zobaczyć, co się wydarzy.',
          'AI odpowie w roli, a historia potoczy się dalej. Nie ma złego sposobu na grę — podążaj za ciekawością, a postać wyjdzie Ci naprzeciw.',
        ],
      },
      {
        heading: 'Wskazówki na Twoją pierwszą sesję',
        paragraphs: [
          'Staraj się sam pozostać w roli, jeśli możesz — dzięki temu świat wydaje się bardziej prawdziwy. Ale równie dobrze możesz chwilę odpuścić i po prostu cieszyć się samą zabawą.',
          'Jeśli jakaś odpowiedź nie siądzie, możesz ją wygenerować ponownie albo zmienić swoją ostatnią wiadomość. Roleplay to gra zespołowa — wolno Ci nią sterować.',
          'A przede wszystkim: się nie spiesz. Najlepszy roleplay rozwija się powoli. Daj relacji odetchnąć.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Jak zdobyć klucz AI', to: '/guides/how-to-get-an-api-key' },
      { label: 'Wskazówki dla lepszego roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Jak zdobyć klucz AI do RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Instrukcja krok po kroku, jak zdobyć klucz API zgodny z OpenAI i dodać go do RoleChat AI. Bez wiedzy technicznej — zajmie to około dwóch minut.',
    sections: [
      {
        heading: 'Czym jest klucz API?',
        paragraphs: [
          'Klucz API to krótki, tajny ciąg znaków — zazwyczaj zaczynający się od „sk-” — który pozwala RoleChat AI komunikować się z dostawcą AI w Twoim imieniu. W ten sposób aplikacja wie, że masz prawo korzystać z danego modelu.',
          'Przynosisz własny klucz, co oznacza, że to Ty wybierasz dostawcę, płacisz tylko za to, co zużyjesz, a Twoje rozmowy idą bezpośrednio między Twoją przeglądarką a tym dostawcą. Bez żadnego pośrednika.',
        ],
      },
      {
        heading: 'Krok 1: Wybierz dostawcę',
        paragraphs: [
          'RoleChat AI współpracuje z każdym dostawcą, który udostępnia API zgodne z OpenAI. Popularne wybory to zarówno znane laboratoria, jak i nowsi, tańsi dostawcy. Wybierz takiego, który działa w Twoim regionie i mieści się w Twoim budżecie.',
          'Nie wiesz, od czego zacząć? Poszukaj dostawcy z hojnym okresem próbnym albo niską ceną za wiadomość. Zawsze możesz zmienić dostawcę później, wklejając nowy klucz w Ustawieniach.',
        ],
      },
      {
        heading: 'Krok 2: Załóż konto i wygeneruj klucz',
        paragraphs: [
          'Zarejestruj się na stronie wybranego dostawcy, a następnie znajdź w panelu sekcję „API keys” albo „Access tokens”. Kliknij „Create new key”, nadaj jej nazwę, którą łatwo zapamiętasz, i skopiuj wyświetlony ciąg znaków.',
          'Ważne: większość dostawców pokazuje pełny klucz tylko raz. Zapisz go od razu w bezpiecznym miejscu — jeśli go zgubisz, będziesz musiał wygenerować nowy.',
        ],
      },
      {
        heading: 'Krok 3: Dodaj go do RoleChat AI',
        paragraphs: [
          'Otwórz aplikację RoleChat AI, kliknij Settings i wklej swój klucz w polu „API Key”. Adres endpointu dostawcy wklej w polu „API Endpoint” (zazwyczaj znajdziesz go na tej samej stronie panelu co klucz).',
          'Opcjonalnie możesz wybrać model z listy rozwijanej. Jeśli nie jesteś pewien, wybierz domyślny model polecany przez dostawcę — jest zbalansowany pod kątem jakości i kosztów.',
          'To wszystko. Możesz już rozmawiać. Twój klucz zostaje w Twojej przeglądarce i nigdy nie trafia do nas.',
        ],
      },
      {
        heading: 'Jak zadbać o bezpieczeństwo klucza',
        paragraphs: [
          'Nigdy nie udostępniaj publicznie swojego klucza API — to jak hasło do Twojego konta AI. Jeśli podejrzewasz, że mógł wyciec, wygeneruj nowy u swojego dostawcy i zaktualizuj go w Settings.',
          'Na współdzielonym lub publicznym urządzeniu nie włączaj opcji „zapisz klucz w tej przeglądarce”. Na własnym urządzeniu możesz bezpiecznie zapisać go dla wygody.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Otwórz aplikację, aby dodać klucz', to: '/app' },
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Rozpocznij swój pierwszy roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Wskazówki do lepszego AI roleplay',
    datePublished: '2026-07-15',
    description:
      'Drobne nawyki, dzięki którym postacie AI wydają się bardziej żywe — ton, tempo i sposób, jak łagodnie pokierować historią bez psucia immersji.',
    sections: [
      {
        heading: 'Odpowiadaj jak człowiek, a nie jak prompt',
        paragraphs: [
          'Najczęstszy błąd początkujących to pisanie do AI zamiast do postaci. Nie opisuj tego, co ma się wydarzyć — powiedz po prostu to, co naprawdę byś powiedział. AI już odgrywa scenę; Twoim zadaniem jest w niej być.',
          'Krótkie, szczere odpowiedzi prawie zawsze sprawdzają się lepiej niż długie, przepompowane. Prawdziwe „nie wiem, co powiedzieć” potrafi popchnąć scenę dalej niż cały akapit narracji.',
        ],
      },
      {
        heading: 'Używaj akcji w asteriskach',
        paragraphs: [
          'Otoczenie drobnej akcji asteriskami — np. *odwraca wzrok* albo *podaje mu kubek* — daje postaci coś fizycznego, na co może zareagować. To najprostszy sposób, by dodać scenie głębi bez pisania powieści.',
          'Tylko nie przesadzaj. Jedna, dwie akcje na wiadomość w zupełności wystarczą. Zbyt wiele i zaczyna to brzmieć jak didaskalia zamiast rozmowy.',
        ],
      },
      {
        heading: 'Daj relacji odetchnąć',
        paragraphs: [
          'Najlepszy romansowy roleplay jest powolny. Jeśli w pierwszych trzech wiadomościach rzucisz wyznanie miłości, postać nie ma dokąd rosnąć. Pozwól, by zaufanie narastało, by napięcie buzowało, by małe chwile znaczyły coś.',
          'Postacie są pisane z myślą o emocjonalnym tempie — zbyt mocny nacisk zbyt wcześnie może sprawić, że wyjdą z roli. Idź za ich prowadzeniem, a efekt będzie tego wart.',
        ],
      },
      {
        heading: 'Steruj, gdy musisz',
        paragraphs: [
          'Roleplay to gra zespołowa. Jeśli odpowiedź nie pasuje do historii, jaką chcesz opowiedzieć, możesz zmienić swoją ostatnią wiadomość i spróbować jeszcze raz albo wygenerować odpowiedź postaci ponownie. Nie musisz tkwić przy pierwszej wersji.',
          'Możesz też łagodnie zmienić kierunek, pozostając w roli: zmień temat, wyjdź z pokoju, zadaj pytanie. Postać zazwyczaj podąży za Twoim prowadzeniem bez wybijania się ze sceny.',
        ],
      },
      {
        heading: 'Wiedz, kiedy skończyć',
        paragraphs: [
          'Świetna sesja roleplayowa jest jak dobry rozdział — kończy się w naturalnym miejscu. Gdy jesteś zmęczony, przerwij. Rozmowa poczeka na Twój powrót, a postać pamięta, gdzie skończyliście.',
          'Nie ma nagrody za maratony. Historia jest lepsza, gdy jesteś wypoczęty.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Nowy w roleplay? Zacznij tutaj', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Jak korzystać z OpenRouter do roleplay z postaciami AI',
    datePublished: '2026-07-15',
    description:
      'Przewodnik krok po kroku dla początkujących: jak używać OpenRouter z RoleChat AI. Załóż konto, zdobądź swój klucz API, wybierz model i w kilka minut zacznij rozmawiać z autorskimi postaciami romantycznymi.',
    sections: [
      {
        heading: 'Czym jest OpenRouter?',
        paragraphs: [
          'OpenRouter to usługa, która daje dostęp do dziesiątek modeli AI od różnych dostawców za pomocą jednego API. Zamiast zakładać osobne konta w OpenAI, Anthropic, Google i innych, tworzysz jedno konto OpenRouter i korzystasz z dowolnego oferowanego przez nich modelu.',
          'Do roleplay AI to niezwykle wygodne rozwiązanie. Możesz wypróbować różne modele, porównać ich styl pisania i przełączać się, kiedy tylko chcesz — wszystko bez zmiany klucza API i bez wychodzenia z aplikacji.',
        ],
      },
      {
        heading: 'Dlaczego OpenRouter sprawdza się w roleplay',
        paragraphs: [
          'Roleplay wymaga modeli, które dobrze radzą sobie z pisaniem kreatywnym, utrzymaniem postaci i generowaniem dłuższych, immersyjnych odpowiedzi. OpenRouter daje dostęp do wielu takich modeli, w tym do kilku bardzo przystępnych cenowo.',
          'Ponieważ płacisz tylko za to, czego realnie użyjesz, możesz swobodnie eksperymentować. Zacznij od tańszego modelu, a jeśli pisania zabierze wyrazistości, wypróbuj mocniejszy — zmiana zajmuje sekundy.',
        ],
      },
      {
        heading: 'Krok 1: Załóż konto OpenRouter',
        paragraphs: [
          'Wejdź na openrouter.ai i zarejestruj się. Proces jest prosty — potrzebujesz adresu e-mail oraz sposobu na dodanie niewielkiej kwoty środków (OpenRouter obsługuje kilka metod płatności).',
          'Nie musisz od razu zasilać konta dużą kwotą. Kilka dolarów wystarczy na setki wiadomości w roleplay przy większości modeli. Saldo zawsze możesz doładować później.',
        ],
      },
      {
        heading: 'Krok 2: Zdobądź swój klucz API',
        paragraphs: [
          'Po zalogowaniu przejdź do sekcji Keys w panelu OpenRouter. Kliknij „Create Key”, nadaj mu nazwę, którą łatwo zapamiętasz, i skopiuj wyświetlony ciąg znaków.',
          'Ważne: OpenRouter pokazuje pełny klucz tylko raz. Od razu zapisz go w bezpiecznym miejscu — jeśli go zgubisz, będziesz musiał wygenerować nowy.',
        ],
      },
      {
        heading: 'Krok 3: Dodaj go do RoleChat AI',
        paragraphs: [
          'Otwórz aplikację RoleChat AI i kliknij „Connect AI” na górnym pasku. W panelu Settings kliknij przycisk szybkiego wypełniania „OpenRouter” — automatycznie wpisze on prawidłowy adres endpointu.',
          'Wklej swój klucz API OpenRouter w polu API Key. Następnie wpisz nazwę modelu w polu Model (np. dobry punkt startowy to przystępny cenowo model czatowy). Kliknij zapisz i gotowe — połączenie jest aktywne.',
        ],
      },
      {
        heading: 'Krok 4: Wybierz postać i zacznij rozmawiać',
        paragraphs: [
          'Skoro Twój klucz jest już skonfigurowany, przejrzyj bibliotekę postaci i wybierz kogoś, kto przykuje Twoją uwagę. Kliknij „Start Chat”, a postać wyśle Ci swoją wiadomość powitalną.',
          'Wpisz odpowiedź, a w ciągu kilku sekund otrzymasz reakcję w pełni w charakterze. To wszystko — jesteś w roleplay. Jeśli styl pisania Ci nie leży, wypróbuj inny model z OpenRouter i zobacz, jak się zmieni.',
        ],
      },
      {
        heading: 'Wskazówki: jak wybrać model w OpenRouter',
        paragraphs: [
          'Do romantycznego roleplay szukaj modeli znanych z kreatywnego pisania i dłuższych odpowiedzi. Zasadniczo większe modele piszą bogaciej, ale kosztują więcej za wiadomość; mniejsze są tańsze, ale mogą dawać krótsze lub mniej zniuansowane repliki.',
          'Zacznij od czegoś przystępnego cenowo, złap wyczucie flow i przejdź na mocniejszy model, gdy zechcesz bogatszej prozy. Nie ma tu „złego” wyboru — najlepszy jest ten model, którego pisania najbardziej się delektujesz.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Jak zacząć roleplay z AI', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Wskazówki do lepszego roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Czym jest karta postaci AI?',
    datePublished: '2026-07-15',
    description:
      'Przystępne wyjaśnienie dla początkujących: czym są karty postaci AI, jak działają i jak korzystać z nich w RoleChat AI do prywatnego, romantycznego roleplay.',
    sections: [
      {
        heading: 'Czym jest karta postaci?',
        paragraphs: [
          'Karta postaci to plik, który definiuje osobowość, historię i zachowanie postaci AI. Możesz o tym myśleć jak o szczegółowym profilu, który mówi AI, w kogo ma się wcielić — ich imię, sposób mówienia, to, na czym im zależy, i ich relacja z Tobą.',
          'Gdy rozpoczynasz czat, aplikacja odczytuje kartę postaci i na jej podstawie prowadzi każdą odpowiedź. Dzięki temu rozmowa przypomina kontakt z żywą osobą mającą swój własny głos, a nie z generycznym chatbotem.',
        ],
      },
      {
        heading: 'Co znajduje się w karcie postaci?',
        paragraphs: [
          'Typowa karta postaci zawiera kilka kluczowych elementów: imię, opis (kim jest oraz jej historia), osobowość (jak się zachowuje i mówi), scenariusz (sceneria i okoliczności Waszego spotkania) oraz pierwszą wiadomość (kwestia otwierająca, która rozpoczyna rozmowę).',
          'Niektóre karty zawierają też przykładowe dialogi, które pokazują AI, jak postać mówi w praktyce. Pomaga to modelowi złapać niepowtarzalny głos postaci — dobór słów, rytm, drobne nawyki.',
        ],
      },
      {
        heading: 'Formaty kart postaci: V1, V2, V3 wyjaśnione prosto',
        paragraphs: [
          'Z biegiem czasu społeczność wypracowała różne wersje formatu kart postaci. V1 to najprostsza — same podstawy. V2 dodaje więcej pól, jak alternatywne powitania i notatki twórcy. V3 jest najbardziej szczegółowa, z miejscem na rozszerzenia i bogatsze metadane.',
          'Nie musisz się martwić, która wersja jest która. RoleChat AI obsługuje automatycznie wszystkie trzy. Kiedy wybierasz lub importujesz kartę, aplikacja sama rozpoznaje format i zajmuje się resztą.',
        ],
      },
      {
        heading: 'Jak działają karty postaci w RoleChat AI',
        paragraphs: [
          'RoleChat AI ma wbudowaną bibliotekę autorskich postaci — każda z nich jest zdefiniowana przez kartę postaci. Nie musisz niczego szukać ani pobierać. Wystarczy przejrzeć bibliotekę, wybrać postać i zacząć rozmawiać.',
          'Jeśli masz już kartę postaci z innego narzędzia (np. SillyTavern), możesz ją zaimportować. RoleChat AI odczytuje standardowe karty JSON oraz karty PNG z osadzonymi danymi, więc Twoja istniejąca biblioteka zadziała również tutaj.',
        ],
      },
      {
        heading: 'Wbudowane postacie kontra import własnych',
        paragraphs: [
          'Dla większości początkujących start z wbudowaną biblioteką postaci to najprostsza droga. Każda postać jest autorska, napisana specjalnie pod romantyczny roleplay i gotowa do rozmowy — bez żadnej konfiguracji poza dodaniem klucza AI.',
          'Jeśli masz już więcej doświadczenia i własną kolekcję kart, funkcja importu pozwala przenieść je wszystkie. Obie ścieżki działają — biblioteka wbudowana po prostu pozwala zacząć szybciej.',
        ],
      },
      {
        heading: 'Czy karty postaci są bezpieczne?',
        paragraphs: [
          'Tak. Karta postaci to wyłącznie dane tekstowe — nie zawiera kodu ani skryptów. Nie może zaszkodzić Twojemu urządzeniu ani uzyskać dostępu do Twoich danych osobowych. Najgorsze, co może zrobić źle napisana karta, to wygenerować zagmatwaną rozmowę.',
          'W RoleChat AI Twoje rozmowy zostają w przeglądarce, a dane postaci przetwarza wybrany przez Ciebie dostawca AI. Nikt inny nie ma wglądu w Twoje czaty.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Jak zacząć roleplay z AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern czy Web Tavern: co jest łatwiejsze?',
    datePublished: '2026-07-15',
    description:
      'Przyjazne porównanie SillyTavern i RoleChat AI (dawniej Web Tavern) dla początkujących. Instalacja, konfiguracja, prywatność i karty postaci — co sprawdzi się u Ciebie?',
    sections: [
      {
        heading: 'Czym jest SillyTavern?',
        paragraphs: [
          'SillyTavern to popularny, potężny frontend open-source do roleplay AI. Istnieje od lat i ma zaangażowaną społeczność. Obsługuje ogromną liczbę ustawień, presetów, rozszerzeń i formatów kart postaci.',
          'Ceną za to jest złożoność. SillyTavern wymaga instalacji — uruchamiasz go na własnym komputerze, konfigurujesz połączenia z dostawcami AI i poruszasz się po gęstym interfejsie pełnym zaawansowanych parametrów. Dla użytkowników biegłych technicznie ta moc to zaleta. Dla większości początkujących to mur.',
        ],
      },
      {
        heading: 'Czym jest RoleChat AI (dawniej Web Tavern)?',
        paragraphs: [
          'RoleChat AI — pierwotnie znany jako Web Tavern — to działająca w przeglądarce aplikacja do roleplay AI, zaprojektowana z myślą o prostocie obsługi. Nie ma nic do instalowania. Otwierasz stronę, wybierasz postać, dodajesz swój klucz AI i zaczynasz rozmawiać.',
          'Zachowuje zasadę prywatności, która czyni SillyTavern tak atrakcyjnym (własny klucz, bez pośrednika czytającego Twoje czaty), ale zrzuca z siebie onieśmielającą konfigurację. Cel jest prosty: najłatwiejszy prywatny roleplay z AI.',
        ],
      },
      {
        heading: 'Instalacja: skomplikowana kontra żadna',
        paragraphs: [
          'SillyTavern wymaga pobrania aplikacji, zainstalowania Node.js, uruchamiania skryptów w wierszu poleceń i utrzymywania procesu serwera w trakcie czatu. Korzystanie na telefonie wymaga dodatkowych kroków konfiguracji zdalnej.',
          'RoleChat AI działa w całości w przeglądarce. Bez pobierania, bez terminala, bez serwera. Działa na komputerze stacjonarnym, laptopie, tablecie i telefonie — po prostu otwierasz stronę i zaczynasz.',
        ],
      },
      {
        heading: 'Konfiguracja: głębokie parametry kontra przyjazne początkującym',
        paragraphs: [
          'SillyTavern wystawia na głównym ekranie temperaturę, top-p, długość kontekstu, metody próbkowania, szablony promptów, world info i dziesiątki innych ustawień. Dla zaawansowanych użytkowników, którzy chcą dostroić każdy detal, to potężne narzędzie.',
          'RoleChat AI chowa to wszystko w sekcji Advanced. Domyślny ekran pokazuje Twoją postać, Twoje wiadomości i pole wprowadzania. Jeśli zechcesz później wejść w parametry, są na miejscu — ale nigdy nie musisz ich dotykać.',
        ],
      },
      {
        heading: 'Prywatność: obie opcje szanują Twoje dane',
        paragraphs: [
          'Zarówno SillyTavern, jak i RoleChat AI stosują model „bring your own key”. Podłączasz własne konto u dostawcy AI, a Twoje wiadomości płyną bezpośrednio między Twoim urządzeniem a tym dostawcą. Żadna z usług nie utrzymuje serwera pośredniczącego, który czytałby Twoje rozmowy.',
          'To kluczowa przewaga prywatności nad wieloma komercyjnymi aplikacjami do roleplay, które puszczają Twoje czaty przez własne serwery. Zarówno z SillyTavern, jak i RoleChat AI Twoje rozmowy są w pełni Twoje.',
        ],
      },
      {
        heading: 'Karty postaci: pełna kompatybilność',
        paragraphs: [
          'Oba narzędzia obsługują te same formaty kart postaci (V1, V2, V3, JSON i PNG). Jeśli masz kolekcję kart z SillyTavern, możesz zaimportować je bezpośrednio do RoleChat AI.',
          'RoleChat AI oferuje też wbudowaną bibliotekę autorskich postaci romantycznych, więc nawet bez żadnych kart możesz od razu zacząć rozmawiać.',
        ],
      },
      {
        heading: 'Co powinieneś wybrać?',
        paragraphs: [
          'Jeśli lubisz dłubać, chcesz pełnej kontroli nad każdym parametrem i nie przeszkadza Ci techniczna konfiguracja, SillyTavern to świetny wybór z silną społecznością.',
          'Jeśli wolisz otworzyć stronę i zacząć roleplay w mniej niż minutę — bez niczego instalowania i bez uczenia się, co oznacza „top-p” — RoleChat AI zostało stworzone dla Ciebie. W każdej chwili możesz później przejść na SillyTavern, a Twoje karty postaci pójdziesz z Tobą.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Czym jest karta postaci?', to: '/guides/what-is-a-character-card' },
      { label: 'Jak zacząć roleplay z AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Najlepsze prompty do roleplay AI dla początkujących',
    datePublished: '2026-07-15',
    description:
      'Proste i skuteczne prompty oraz techniki roleplay AI dla początkujących. Dowiedz się, jak budować scenę, wywoływać emocje i sprawić, by postać wydała się żywa — bez żadnego wcześniejszego doświadczenia.',
    sections: [
      {
        heading: 'Co sprawia, że prompt do roleplay jest dobry?',
        paragraphs: [
          'W roleplay AI „prompt" nie jest techniczną komendą — to po prostu sposób, w jaki piszesz swoje wiadomości. Im bardziej żywy i konkretny Twój tekst, tym bogatsza odpowiedź postaci. Dobry prompt daje sztucznej inteligencji materiał do pracy: nastrój, tło, emocję, drobny gest.',
          'Nie musisz być wybitnym pisarzem. Wystarczy dać postaci coś, na co naprawdę może zareagować. Oto pięć prostych technik, które sprawdzają się przy dowolnej postaci.',
        ],
      },
      {
        heading: 'Prompt 1: Zbuduj scenę',
        paragraphs: [
          'Zamiast od razu przechodzić do dialogu, najpierw namaluj otoczenie. Jedno zdanie budujące scenę osadza rozmowę w realiach i daje postaci punkt zaczepienia.',
          'Przykład: „*Deszcz nie ustaje od godzin. Popycham drzwi kawiarni, ociekając wodą, i przeglądam salę w poszukiwaniu wolnego miejsca.*” Daje to postaci tło, nastrój i powód, by Cię zauważyć. Jej odpowiedź będzie znacznie żywsza niż po zwykłym „Cześć”.',
        ],
      },
      {
        heading: 'Prompt 2: Wczesne określenie relacji',
        paragraphs: [
          'Sztuczna inteligencja potrzebuje kontekstu: kim jesteś dla postaci. Nieznajomymi? Starymi przyjaciółmi? Rywalami? Krótkie zdanie w pierwszej wiadomości może ukształtować całą rozmowę.',
          'Przykład: „Nie odzywaliśmy się do siebie od obrony dyplomu i z nerwami podchodzę do Twojego biurka.” Tłumaczy to postaci, że jest między wami przeszłość, jest napięcie i jest powód, dla którego ta chwila ma znaczenie. AI chętnie włoży się w taką dynamikę.',
        ],
      },
      {
        heading: 'Prompt 3: Dodaj głębię emocjonalną',
        paragraphs: [
          'Postacie ożywają, gdy pokazujesz, co czujesz, a nie tylko co robisz. Drobiazgowa, szczera emocja w Twojej wiadomości zachęca postać do odpowiedzi własnym uczuciem.',
          'Przykład: „*Staraj się mówić równym głosem, ale dłonie mi się trzęsą.* Nie sądziłam, że jeszcze kiedyś Cię zobaczę.” Ta chwila słabości daje postaci przyzwolenie, by również ona pokazała wrażliwość — a właśnie w takich momentach rodzi się najlepszy roleplay.',
        ],
      },
      {
        heading: 'Prompt 4: Wprowadź delikatne napięcie',
        paragraphs: [
          'Rozmowa, w której wszystko idzie gładko, szybko staje się nudna. Wprowadź drobną przeszkodę — nieporozumienie, sekret, chwilę wahania — i zobacz, jak postać angażuje się znacznie mocniej.',
          'Przykład: „Chcę powiedzieć Ci prawdę, ale za każdym razem, gdy otwieram usta, słowa nie chcą przejść.” To daje postaci powód, by naciskać, czekać, drążyć temat. Zmienia płaską wymianę zdań w scenę, w której o coś chodzi.',
        ],
      },
      {
        heading: 'Prompt 5: Sam pisz z perspektywy postaci',
        paragraphs: [
          'Im dłużej pozostajesz w roli, tym dłużej AI robi to samo. Używaj gwiazdek dla akcji, cudzysłowów dla mowy, a komentarze poza postacią trzymaj krótko. Nie musisz być perfekcyjny — wystarczy, że będziesz konsekwentny.',
          'Przykład: „*Odkładam filiżankę ostrożnie na stół.* »Zawsze wiedziałaś, kiedy kłamię.«” Zauważ, jak akcja i dialog współpracują ze sobą. Postać ma teraz gest, ton i zarzut, na które może zareagować.',
        ],
      },
      {
        heading: 'Jak połączyć to w całość',
        paragraphs: [
          'Nie musisz stosować wszystkich pięciu technik w każdej wiadomości. Wybierz jedną lub dwie, które pasują do chwili, i pozwól rozmowie płynąć naturalnie. Najlepszy roleplay przypomina improwizację — budujecie nawzajem na swoich słowach, jedna wiadomość po drugiej.',
          'Pamiętaj: postać prowadzi jej karta oraz to, co Ty wpisujesz. Jeśli odpowiedź wydaje się nietrafiona, spróbuj przeformułować wiadomość z większą ilością szczegółów lub emocji. Drobne zmiany w sposobie pisania potrafią całkowicie odmienić reakcję postaci.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Przeglądaj postacie', to: '/characters' },
      { label: 'Otwórz aplikację', to: '/app' },
      { label: 'Wskazówki do lepszego roleplay', to: '/guides/tips-for-better-roleplay' },
      { label: 'Jak zacząć roleplay z AI', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
