import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle2, FileText, Calculator, RefreshCw } from 'lucide-react'

const DEMO_ITEMS = [
  { id: 1, title: 'Kup norweską kartę SIM', time: '20 minut', done: true },
  { id: 2, title: 'Rejestracja w Skatteetaten — D-nummer lub NIN', time: '2–3 godziny', done: false },
  { id: 3, title: 'Otwórz konto bankowe', time: '1–2 godziny', done: false }
]

const PROBLEMS = [
  { emoji: '😤', title: 'Grupy na Facebooku', desc: 'Sprzeczne porady od setki osób — każdy mówi coś innego.' },
  { emoji: '🤯', title: 'Kolejność kroków', desc: 'Nie wiesz od czego zacząć — a kolejność ma KRYTYCZNE znaczenie.' },
  { emoji: '🚶', title: 'Niepotrzebne wizyty', desc: 'Wracasz do urzędu bo zapomniałeś jednego dokumentu.' }
]

const FEATURES = [
  { icon: CheckCircle2, title: 'Personalizowana checklist', desc: 'Krok po kroku, w odpowiedniej kolejności. Nic nie pominiesz.' },
  { icon: FileText, title: 'Gotowe szablony dokumentów', desc: 'Emaile i pisma po norwesku/angielsku. Kopiuj i wyślij.' },
  { icon: Calculator, title: 'Kalkulator kaucji', desc: 'Sprawdź czy żądana kaucja jest legalna i ile to po polsku.' },
  { icon: RefreshCw, title: 'Aktualizacje przepisów', desc: 'Dbamy o aktualność informacji. Zawsze sprawdzone źródła.' }
]

const FAQ = [
  {
    q: 'Czy informacje są aktualne?',
    a: 'Tak — regularnie weryfikujemy informacje w oficjalnych źródłach. Każda zmiana przepisów jest aktualizowana w aplikacji.'
  },
  {
    q: 'Czy mogę kupić dostęp do kilku krajów?',
    a: 'Tak, każdy kraj to osobna płatność 29 zł. Możesz kupić Norwegię, Austrię i Islandię osobno lub wszystkie naraz.'
  },
  {
    q: 'Co jeśli plany się zmienią i nie jadę?',
    a: 'Skontaktuj się z nami w ciągu 14 dni od zakupu — zwrócimy pieniądze bez pytania.'
  },
  {
    q: 'Czy to zastępuje poradę prawnika?',
    a: 'EmiDoc to przewodnik praktyczny, nie porada prawna. W skomplikowanych sytuacjach zawsze konsultuj się z prawnikiem lub lokalnym urzędem.'
  },
  {
    q: 'Jak płacę?',
    a: 'Kartą, BLIKIEM lub Przelewy24. Płatność jednorazowa, bez subskrypcji.'
  }
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full mb-6">
            🇳🇴 🇦🇹 🇮🇸 Norwegia · Austria · Islandia
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Przeprowadzka do pracy za granicę?<br />
            <span className="text-blue-600">Mamy listę wszystkiego co musisz zrobić.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Spersonalizowana checklist kroków formalnych, gotowe szablony dokumentów i kalkulator kaucji.
            Wszystko w jednym miejscu. Żadnych niespodzianek.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Zacznij za 29 zł
            </Link>
            <Link
              href="/country/norway"
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-lg"
            >
              Zobacz demo (darmowe)
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Jednorazowa płatność · Bez subskrypcji · Karta, BLIK, P24</p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            Znasz to uczucie?
          </h2>
          <p className="text-center text-gray-500 mb-10">Każdy emigrant zarobkowy przez to przechodzi.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo checklist */}
      <section className="bg-white border-y border-gray-100 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Tak wygląda Twoja checklist
          </h2>
          <p className="text-center text-gray-500 mb-8">Fragment dla Norwegii — pierwsze kroki po przyjeździe</p>
          <div className="space-y-3">
            {DEMO_ITEMS.map(item => (
              <div key={item.id} className={`border rounded-xl p-4 flex items-center gap-3 ${item.done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                  {item.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ok. {item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/register" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Zarejestruj się aby zobaczyć pełną checklistę →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Co dostajesz za 29 zł</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border-y border-gray-100 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prosta cena</h2>
          <p className="text-gray-500 mb-8">Płacisz raz, masz dostęp na zawsze.</p>
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-sm">
            <div className="text-5xl font-bold text-gray-900 mb-1">29 zł</div>
            <p className="text-gray-500 mb-6">za dostęp do jednego kraju</p>
            <ul className="text-sm text-gray-600 space-y-2 mb-8 text-left">
              {['Pełna checklist kroków', 'Gotowe szablony dokumentów', 'Kalkulator kaucji', 'Aktualizacje przepisów', 'Karta, BLIK, Przelewy24'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Kup dostęp do Norwegii
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Często zadawane pytania</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
