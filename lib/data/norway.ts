import type { ChecklistGroup, DocumentTemplate } from '../types'

export const norwayChecklist: ChecklistGroup[] = [
  {
    id: 'arrival',
    title: 'Pierwsze 24 godziny',
    description: 'Krytyczne kroki zaraz po przyjeździe',
    priority: 'critical',
    timing: 'Pierwsze 24h',
    items: [
      {
        id: 'norway_sim_card',
        title: 'Kup norweską kartę SIM',
        description: 'Norweskie urzędy wysyłają SMSy z kodami. Bez norweskiego numeru nie założysz konta bankowego ani nie zarejestrujesz się w wielu systemach.',
        estimatedTime: '20 minut',
        requiredDocuments: ['Paszport lub dowód osobisty'],
        officialUrl: undefined,
        tips: [
          'Najlepsza opcja budżetowa: Chilimobil lub Fjordkraft',
          'Kup w Narvesen, 7-Eleven lub Clas Ohlson',
          'Starter pack kosztuje ok. 99–149 NOK',
          'Zachowaj paragon — może być potrzebny do rejestracji numeru'
        ],
        isBlocking: true
      },
      {
        id: 'norway_accommodation_confirm',
        title: 'Potwierdź adres zamieszkania',
        description: 'Musisz mieć konkretny adres w Norwegii zanim pójdziesz do Skatteetaten. Adres pracodawcy lub akademika wystarczy na start.',
        estimatedTime: '5 minut',
        requiredDocuments: ['Umowa najmu lub pismo od pracodawcy z adresem'],
        tips: [
          'Jeśli mieszkasz u pracodawcy, poproś o pisemne potwierdzenie adresu',
          'Hotel jest akceptowany tylko tymczasowo (max 2 tygodnie)'
        ],
        isBlocking: true
      }
    ]
  },
  {
    id: 'week_one',
    title: 'Pierwszy tydzień — Formalności urzędowe',
    description: 'Rejestracja i dokumenty tożsamości w Norwegii',
    priority: 'critical',
    timing: 'Dni 2–7',
    items: [
      {
        id: 'norway_nin_register',
        title: 'Rejestracja w Skatteetaten — D-nummer lub NIN',
        description: 'Numer identyfikacyjny to klucz do wszystkiego w Norwegii: konta bankowego, umowy o pracę, dostępu do służby zdrowia. Jeśli planujesz zostać ponad 6 miesięcy, rejestrujesz się po numer NIN (fødselsnummer). Poniżej 6 miesięcy — D-nummer.',
        officialUrl: 'https://www.skatteetaten.no/en/person/foreign/are-you-intending-to-work-in-norway/',
        estimatedTime: '2–3 godziny (z dojazdem i kolejką)',
        requiredDocuments: [
          'Paszport (oryginał, nie kopia)',
          'Umowa o pracę (podpisana przez obie strony)',
          'Dowód adresu zamieszkania w Norwegii',
          'Wypełniony formularz RF-1209 (pobierz ze strony Skatteetaten)'
        ],
        tips: [
          'Zarezerwuj wizytę online na nav.no — kolejki mogą być 1–2 tygodniowe',
          'Przyjedź 15 minut przed czasem',
          'Weź ze sobą kopie wszystkich dokumentów',
          'Jeśli pracodawca nie dał Ci jeszcze podpisanej umowy, masz problem — dopilnuj tego najpierw',
          'Numer dostaniesz pocztą po 1–3 tygodniach od wizyty',
          'Bez numeru NIE możesz legalnie pracować — to priorytet #1'
        ],
        isBlocking: true
      },
      {
        id: 'norway_bank_account',
        title: 'Otwórz konto bankowe',
        description: 'Większość pracodawców przelewa wynagrodzenie tylko na norweskie konto. Polskie konto wiąże się z wysokimi opłatami za przewalutowanie.',
        officialUrl: 'https://sbanken.no',
        estimatedTime: '1–2 godziny lub online 30 minut',
        requiredDocuments: [
          'D-nummer lub NIN (musisz go już mieć!)',
          'Paszport',
          'Norweski numer telefonu',
          'Adres zamieszkania'
        ],
        tips: [
          'DNB i Nordea — najpopularniejsze, anglojęzyczna obsługa',
          'Sbanken — w pełni online, bez opłat miesięcznych',
          'Noen (dawniej Komplett Bank) — przyjazne dla cudzoziemców',
          'Zapytaj pracodawcę z jakiego banku korzystają — czasem jest to bez znaczenia, ale warto wiedzieć',
          'Bez NIN/D-nummer żaden bank Cię nie przyjmie'
        ],
        isBlocking: true
      },
      {
        id: 'norway_nav_register',
        title: 'Rejestracja w NAV (opcjonalnie ale ważne)',
        description: 'NAV to norweski odpowiednik ZUS i MOPS razem wziętych. Rejestracja daje dostęp do zasiłków chorobowych i informacji o prawach pracowniczych.',
        officialUrl: 'https://www.nav.no/en/home',
        estimatedTime: '30 minut online',
        requiredDocuments: ['NIN lub D-nummer', 'Norweskie konto bankowe'],
        tips: [
          'Zrób to po otrzymaniu NIN/D-nummer',
          'Stwórz konto na nav.no z pomocą MinID lub BankID',
          'MinID dostaniesz pocztą po rejestracji w Skatteetaten'
        ],
        isBlocking: false
      }
    ]
  },
  {
    id: 'month_one',
    title: 'Pierwszy miesiąc — Życie i prawa',
    description: 'Ubezpieczenie, prawo pracy, mieszkanie',
    priority: 'important',
    timing: 'Dni 8–30',
    items: [
      {
        id: 'norway_health_insurance',
        title: 'Zgłoszenie do norweskiej służby zdrowia (fastlege)',
        description: 'W Norwegii masz prawo do lekarza pierwszego kontaktu (fastlege) po zarejestrowaniu się. BEZ rejestracji płacisz pełne, bardzo wysokie ceny.',
        officialUrl: 'https://www.helsenorge.no/en/fastlege/',
        estimatedTime: '15 minut online',
        requiredDocuments: ['NIN', 'Adres zamieszkania'],
        tips: [
          'Zrób to na helsenorge.no — tylko po norweskim, użyj Google Translate',
          'Jeśli jesteś zdrowy i młody, możesz to odłożyć, ale nie dłużej niż miesiąc',
          'Wizyta u lekarza bez fastlege kosztuje ok. 300–500 NOK'
        ],
        isBlocking: false
      },
      {
        id: 'norway_tax_card',
        title: 'Karta podatkowa (Skattekort)',
        description: 'Bez karty podatkowej pracodawca potrąci Ci 50% wynagrodzenia jako podatek! Karta określa Twój właściwy próg podatkowy.',
        officialUrl: 'https://www.skatteetaten.no/en/person/taxes/tax-deduction-cards/',
        estimatedTime: '10 minut online',
        requiredDocuments: ['NIN lub D-nummer', 'Dane pracodawcy (NIP firmy, adres)'],
        tips: [
          'Zrób to ZANIM dostaniesz pierwszą wypłatę',
          'Wypełnij wniosek online na skatteetaten.no',
          'Karta jest wysyłana bezpośrednio do pracodawcy elektronicznie',
          'Standardowa stawka dla pracownika gastronomii to ok. 22–26%',
          'Bez karty = 50% podatku, nie ma wyjątków'
        ],
        isBlocking: true
      },
      {
        id: 'norway_rental_checklist',
        title: 'Zabezpiecz się przy wynajmie mieszkania',
        description: 'Norweskie prawo chroni najemcę, ale musisz wiedzieć o swoich prawach. Kaucja max 3 miesiące czynszu, protokół zdawczo-odbiorczy obowiązkowy.',
        officialUrl: 'https://www.husleietvister.no',
        estimatedTime: '1 godzina (przy podpisywaniu umowy)',
        requiredDocuments: [
          'Umowa najmu (leiekontrakt)',
          'Zdjęcia stanu mieszkania przy wprowadzce',
          'Potwierdzenie wpłaty kaucji (depositum)'
        ],
        tips: [
          'Kaucja trafia na osobne, zablokowane konto — właściciel nie może jej używać',
          'Zawsze rób zdjęcia każdego pomieszczenia PRZED wprowadzką',
          'Umowę możesz podpisać po norwesku lub angielsku — obie są legalne',
          'Strona Husleietvistutvalget rozwiązuje spory najmu bezpłatnie',
          'Minimum 1 miesiąc wypowiedzenia dla obydwu stron (zwykle 3 miesiące)'
        ],
        isBlocking: false
      }
    ]
  }
]

export const norwayDocuments: DocumentTemplate[] = [
  {
    id: 'norway_email_employer_address',
    title: 'Email do pracodawcy — prośba o potwierdzenie adresu',
    category: 'email',
    language: 'english',
    description: 'Potrzebujesz pisemnego potwierdzenia adresu zamieszkania od pracodawcy do rejestracji w Skatteetaten. Użyj tego szablonu.',
    placeholders: [
      { key: 'IMIE', label: 'Twoje imię i nazwisko', type: 'text', example: 'Jan Kowalski' },
      { key: 'PRACODAWCA', label: 'Imię i nazwisko przełożonego', type: 'text', example: 'Erik Hansen' },
      { key: 'NAZWA_FIRMY', label: 'Nazwa firmy', type: 'text', example: 'Bergen Seafood AS' },
      { key: 'ADRES', label: 'Twój adres w Norwegii', type: 'text', example: 'Storgata 15, 5003 Bergen' }
    ],
    content: `Subject: Request for Confirmation of Accommodation Address

Dear {PRACODAWCA},

I hope this message finds you well. I am writing to kindly request a brief written confirmation of my accommodation address in Norway, as I need this document to complete my registration with Skatteetaten (Norwegian Tax Administration).

Could you please provide a simple letter or email stating that I, {IMIE}, am currently residing at the following address: {ADRES}, and that I am employed with {NAZWA_FIRMY}?

This is required for me to obtain my D-nummer / national identity number, which I need to open a bank account and finalize all employment paperwork.

I would greatly appreciate your assistance with this matter. Please let me know if you need any additional information from my side.

Best regards,
{IMIE}`
  },
  {
    id: 'norway_email_bank_enquiry',
    title: 'Email do banku — otwarcie konta dla cudzoziemca',
    category: 'email',
    language: 'english',
    description: 'Szablon do zapytania banku o wymagane dokumenty i umówienia wizyty.',
    placeholders: [
      { key: 'IMIE', label: 'Twoje imię i nazwisko', type: 'text', example: 'Jan Kowalski' },
      { key: 'NUMER_D', label: 'Twój D-nummer lub NIN', type: 'text', example: '01010123456' },
      { key: 'TELEFON', label: 'Twój norweski numer telefonu', type: 'text', example: '+47 123 45 678' }
    ],
    content: `Subject: Request to Open a Bank Account – Foreign National

Dear Sir or Madam,

My name is {IMIE} and I recently moved to Norway for work. I would like to open a personal bank account with your institution.

I hold a valid D-nummer / Norwegian identity number: {NUMER_D}. I have a signed employment contract and proof of my Norwegian address available upon request.

Could you please advise on the required documents and the process for opening an account as a foreign national? I am also available to visit a branch at your earliest convenience.

My contact number is {TELEFON}.

Thank you for your time and assistance.

Best regards,
{IMIE}`
  },
  {
    id: 'norway_rental_protocol',
    title: 'Protokół zdawczo-odbiorczy mieszkania (po norwesku)',
    category: 'form',
    language: 'norway',
    description: 'Wypełnij ten dokument RAZEM z właścicielem przy wprowadzaniu się. Chroni Cię przy zwrocie kaucji.',
    placeholders: [
      { key: 'IMIE_NAJEMCY', label: 'Twoje imię i nazwisko', type: 'text', example: 'Jan Kowalski' },
      { key: 'IMIE_WYNAJMUJACEGO', label: 'Imię i nazwisko właściciela', type: 'text', example: 'Olav Andersen' },
      { key: 'ADRES', label: 'Adres mieszkania', type: 'text', example: 'Bergveien 12, 0123 Oslo' },
      { key: 'DATA', label: 'Data wprowadzki', type: 'date', example: '15.03.2025' },
      { key: 'CZYNSZ', label: 'Miesięczny czynsz (NOK)', type: 'number', example: '8500' },
      { key: 'KAUCJA', label: 'Kwota kaucji (NOK)', type: 'number', example: '25500' }
    ],
    content: `INNFLYTTINGSPROTOKOLL (Protokół wprowadzki)

Adresse / Adres: {ADRES}
Dato / Data: {DATA}

Leietaker / Najemca: {IMIE_NAJEMCY}
Utleier / Wynajmujący: {IMIE_WYNAJMUJACEGO}

Månedlig leie / Miesięczny czynsz: {CZYNSZ} NOK
Depositum / Kaucja: {KAUCJA} NOK

---
ROMMENES TILSTAND / STAN POMIESZCZEŃ

Stue / Salon:
Tilstand / Stan: [ ] God  [ ] Middels  [ ] Dårlig
Kommentarer / Uwagi: ________________________________

Soverom / Sypialnia:
Tilstand / Stan: [ ] God  [ ] Middels  [ ] Dårlig
Kommentarer / Uwagi: ________________________________

Kjøkken / Kuchnia:
Tilstand / Stan: [ ] God  [ ] Middels  [ ] Dårlig
Kommentarer / Uwagi: ________________________________

Bad / Łazienka:
Tilstand / Stan: [ ] God  [ ] Middels  [ ] Dårlig
Kommentarer / Uwagi: ________________________________

---
UTSTYR / WYPOSAŻENIE

Nøkler mottatt / Klucze odebrane: [ ] Tak  [ ] Nie  Antall / Ilość: ___
Parkeringsplass / Miejsce parkingowe: [ ] Tak  [ ] Nie
Bod / Komórka: [ ] Tak  [ ] Nie

---
MÅLERSTANDER / LICZNIKI

El / Prąd (kWh): _______________
Vann / Woda (m³): _______________

---
Underskrift leietaker / Podpis najemcy:
{IMIE_NAJEMCY} _________________________ Dato: {DATA}

Underskrift utleier / Podpis wynajmującego:
{IMIE_WYNAJMUJACEGO} _________________________ Dato: {DATA}

WAŻNE: Zrób zdjęcia każdego pomieszczenia PRZED podpisaniem.`
  }
]

export const norwayCalculatorData = {
  maxDepositMonths: 3,
  currency: 'NOK',
  avgRentOslo: 12000,
  avgRentBergen: 9500,
  avgRentTrondheim: 8500,
  taxRates: { low: 22, high: 38.2 },
  minimumWage: { hospitality: 190.06, general: 198.60 }
}
