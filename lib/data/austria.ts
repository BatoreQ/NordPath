import type { ChecklistGroup, DocumentTemplate } from '../types'

export const austriaChecklist: ChecklistGroup[] = [
  {
    id: 'arrival',
    title: 'Pierwsze kroki w Austrii',
    description: 'Krytyczne formalności po przyjeździe',
    priority: 'critical',
    timing: 'Pierwsze 3 dni',
    items: [
      {
        id: 'austria_meldezettel',
        title: 'Zameldowanie — Meldezettel',
        description: 'W Austrii musisz się zameldować w ciągu 3 dni od przybycia. Meldezettel (potwierdzenie zameldowania) jest wymagany do niemal wszystkich urzędowych czynności.',
        officialUrl: 'https://www.oesterreich.gv.at/themen/leben_in_oesterreich/wohnen/3/1/Seite.270011.html',
        estimatedTime: '30 minut',
        requiredDocuments: ['Paszport lub dowód osobisty', 'Formularz Meldezettel (podpisany przez właściciela lokalu)', 'Umowa najmu lub zgoda właściciela'],
        tips: [
          'Meldezettel musisz uzyskać w lokalnym urzędzie (Magistrat lub Gemeindeamt)',
          'Właściciel mieszkania musi podpisać formularz Meldezettel przed wizytą',
          'Bez zameldowania nie możesz starać się o numer podatkowy ani otworzyć konta'
        ],
        isBlocking: true
      }
    ]
  },
  {
    id: 'tax_and_banking',
    title: 'Podatki i finanse',
    description: 'Numer podatkowy i konto bankowe',
    priority: 'critical',
    timing: 'Dni 3–14',
    items: [
      {
        id: 'austria_finanz_online',
        title: 'Rejestracja w FinanzOnline',
        description: 'FinanzOnline to austriacki portal podatkowy. Rejestracja daje dostęp do Twojego konta podatkowego i umożliwia składanie zeznań podatkowych.',
        officialUrl: 'https://finanzonline.bmf.gv.at',
        estimatedTime: '45 minut',
        requiredDocuments: ['Meldezettel', 'Paszport', 'Umowa o pracę'],
        tips: [
          'Rejestracja odbywa się online lub przez urząd skarbowy (Finanzamt)',
          'Otrzymasz swój numer podatkowy (Steuernummer) po rejestracji'
        ],
        isBlocking: true
      },
      {
        id: 'austria_ecard',
        title: 'Karta ubezpieczenia zdrowotnego (e-card)',
        description: 'e-card to austriacka karta ubezpieczenia zdrowotnego. Dostaniesz ją automatycznie po zatrudnieniu, gdy pracodawca zgłosi Cię do ubezpieczenia (Sozialversicherung).',
        officialUrl: 'https://www.gesundheitskasse.at',
        estimatedTime: '2–4 tygodnie (oczekiwanie na kartę)',
        requiredDocuments: ['Umowa o pracę', 'Dane osobowe'],
        tips: [
          'Pracodawca musi Cię zgłosić przed pierwszym dniem pracy',
          'Do czasu otrzymania karty możesz poprosić o tymczasowe zaświadczenie',
          'Karta jest bezpłatna'
        ],
        isBlocking: false
      }
    ]
  }
]

export const austriaDocuments: DocumentTemplate[] = [
  {
    id: 'austria_meldezettel_template',
    title: 'Email do właściciela — prośba o podpisanie Meldezettel',
    category: 'email',
    language: 'english',
    description: 'Poproś właściciela mieszkania o podpisanie formularza zameldowania.',
    placeholders: [
      { key: 'IMIE', label: 'Twoje imię i nazwisko', type: 'text', example: 'Jan Kowalski' },
      { key: 'WLASCICIEL', label: 'Imię właściciela', type: 'text', example: 'Herr Müller' },
      { key: 'ADRES', label: 'Adres mieszkania', type: 'text', example: 'Mariahilfer Straße 10, 1060 Wien' }
    ],
    content: `Subject: Request to Sign Meldezettel – Registration Form

Dear {WLASCICIEL},

I hope you are doing well. As required by Austrian law, I need to register my residence within 3 days of moving in.

Could you please sign the Meldezettel (registration form) for my address at {ADRES}? I can bring the form to you or we can arrange a convenient time to meet.

This is a legal requirement and I would greatly appreciate your assistance.

Best regards,
{IMIE}`
  }
]

export const austriaCalculatorData = {
  maxDepositMonths: 3,
  currency: 'EUR',
  avgRentVienna: 1200,
  avgRentGraz: 900,
  taxRates: { low: 20, high: 35 },
  minimumWage: { general: 12.00 }
}
