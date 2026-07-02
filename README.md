# NordPath — Asystent Sprawdzania Egzaminów

Aplikacja webowa (PWA) pomagająca nauczycielom szybciej sprawdzać już zebrane, papierowe prace
pisemne uczniów. Nauczyciel fotografuje kartkę leżącą na biurku, a system rozpoznaje odpowiedzi
zamknięte i otwarte, sugeruje ocenę na podstawie klucza/wzorca i generuje raport.

To narzędzie działa wyłącznie offline w stosunku do ucznia — pracuje na już zebranych pracach,
po zakończeniu egzaminu. Nie jest to system czasu rzeczywistego używany podczas pisania testu.

## Struktura repozytorium

```
web/                React + Vite PWA (frontend nauczyciela)
server/              Express API — CRUD + wywołania Claude API
supabase/migrations/ Schemat bazy danych (Postgres) i RLS
```

## Wymagania

- Node.js 20+
- Konto Supabase (darmowy tier wystarczy na start)
- Klucz API Claude (console.anthropic.com)

## Konfiguracja

### 1. Supabase

1. Utwórz nowy projekt w Supabase.
2. Zastosuj migrację `supabase/migrations/0001_init.sql` (SQL Editor albo `supabase db push`).
3. Włącz logowanie e-mail/hasło w **Authentication → Providers**.
4. Skopiuj `Project URL`, `anon key` i `service_role key` z **Project Settings → API**.

### 2. Backend (`server/`)

```bash
cd server
cp .env.example .env   # uzupełnij SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
npm install
npm run dev             # http://localhost:8787
```

### 3. Frontend (`web/`)

```bash
cd web
cp .env.example .env    # uzupełnij VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm install
npm run dev              # http://localhost:5173
```

## Flow aplikacji

1. **Konfiguracja egzaminu** — nauczyciel tworzy egzamin i dodaje pytania (klucz dla zamkniętych,
   wzorzec + kryteria dla otwartych).
2. **Skanowanie prac** — kartka pod kamerą telefonu/laptopa → jedno kliknięcie na stronę. Kolejne
   zdjęcia tworzą kolejne strony tej samej pracy ucznia.
3. **Ocenianie (Claude API)** — po zakończeniu pracy ucznia zdjęcia są wysyłane do Claude wraz z
   kluczem odpowiedzi; model zwraca ustrukturyzowany JSON (rozpoznana odpowiedź, poprawność,
   sugerowana punktacja, uzasadnienie).
4. **Panel weryfikacji** — nauczyciel przegląda prace, dla pytań otwartych widzi odczytany tekst,
   sugestię AI i uzasadnienie, zatwierdza jednym kliknięciem albo koryguje punktację.
5. **Raport** — eksport CSV z wynikami per uczeń/pytanie.

## Model danych

Zobacz `supabase/migrations/0001_init.sql` — tabele `exams`, `questions`, `student_submissions`,
`submission_answers`, z RLS ograniczającym dostęp do właściciela (`teacher_id`).

## Deploy

- **Frontend:** Vercel (katalog `web/`).
- **Backend:** dowolny host Node.js (np. Render/Fly.io) lub przepisanie routów na Supabase Edge
  Functions.
- **Baza danych / storage:** Supabase.
