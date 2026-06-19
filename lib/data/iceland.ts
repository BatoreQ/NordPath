import type { ChecklistGroup, DocumentTemplate } from '../types'

export const icelandChecklist: ChecklistGroup[] = [
  {
    id: 'arrival',
    title: 'Pierwsze kroki na Islandii',
    description: 'Podstawowe formalności po przyjeździe',
    priority: 'critical',
    timing: 'Pierwsze 7 dni',
    items: [
      {
        id: 'iceland_kennitala',
        title: 'Uzyskaj Kennitala (islandzki numer ID)',
        description: 'Kennitala to islandzki numer identyfikacyjny (odpowiednik PESEL). Bez niego nie otworzysz konta bankowego, nie podpiszesz umowy ani nie będziesz korzystać z usług publicznych.',
        officialUrl: 'https://www.skra.is/english/individuals/arriving-in-iceland/',
        estimatedTime: '1–2 godziny',
        requiredDocuments: ['Paszport', 'Umowa o pracę lub zaproszenie od pracodawcy', 'Dowód adresu zamieszkania na Islandii'],
        tips: [
          'Rejestracja w Þjóðskrá (National Registry) w Reykjaviku',
          'Kennitala dostajesz zazwyczaj od razu lub w ciągu kilku dni',
          'Bez Kennitala nie możesz legalnie pracować'
        ],
        isBlocking: true
      },
      {
        id: 'iceland_rsk_register',
        title: 'Rejestracja podatkowa w RSK',
        description: 'RSK (Ríkisskattstjóri) to islandzki urząd skarbowy. Musisz się w nim zarejestrować i uzyskać kartę podatkową, aby pracodawca mógł legalnie wypłacać wynagrodzenie.',
        officialUrl: 'https://www.rsk.is/english/',
        estimatedTime: '30 minut online',
        requiredDocuments: ['Kennitala', 'Umowa o pracę'],
        tips: [
          'Rejestracja możliwa online po uzyskaniu Kennitala',
          'Domyślna stawka podatkowa bez rejestracji to 37,6% — zarejestruj się jak najszybciej'
        ],
        isBlocking: true
      }
    ]
  }
]

export const icelandDocuments: DocumentTemplate[] = [
  {
    id: 'iceland_employer_email',
    title: 'Email do pracodawcy — prośba o dokumenty do rejestracji',
    category: 'email',
    language: 'english',
    description: 'Poproś pracodawcę o dokumenty potrzebne do uzyskania Kennitala.',
    placeholders: [
      { key: 'IMIE', label: 'Twoje imię i nazwisko', type: 'text', example: 'Jan Kowalski' },
      { key: 'PRACODAWCA', label: 'Imię i nazwisko przełożonego', type: 'text', example: 'Sigrid Björnsson' },
      { key: 'FIRMA', label: 'Nazwa firmy', type: 'text', example: 'Reykjavik Fish Processing ehf' }
    ],
    content: `Subject: Request for Employment Documents – Kennitala Registration

Dear {PRACODAWCA},

I hope this message finds you well. I have recently arrived in Iceland and I need to register for my Kennitala (Icelandic ID number) at Þjóðskrá as soon as possible.

For this registration, I need:
1. A signed employment contract from {FIRMA}
2. A letter confirming my employment and Icelandic address

Could you please provide these documents at your earliest convenience? Without the Kennitala, I cannot legally receive my salary or access public services.

Thank you very much for your help.

Best regards,
{IMIE}`
  }
]

export const icelandCalculatorData = {
  maxDepositMonths: 3,
  currency: 'ISK',
  avgRentReykjavik: 250000,
  taxRates: { low: 31.45, high: 37.95 },
  minimumWage: { general: 390000 }
}
