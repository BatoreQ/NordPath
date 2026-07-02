-- NordPath: Asystent Sprawdzania Egzaminów
-- Schemat bazowy: egzaminy, pytania, prace uczniów, rozpoznane odpowiedzi

create extension if not exists "pgcrypto";

-- Egzaminy
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references auth.users(id) not null,
  title text not null,
  created_at timestamptz default now()
);

-- Pytania w egzaminie
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  question_number int not null,
  type text check (type in ('closed', 'open')) not null,
  correct_answer text,          -- dla 'closed': "A"/"B"/"C"/"D"
  model_answer text,            -- dla 'open': wzorcowa odpowiedź
  max_points numeric not null default 1,
  grading_criteria text,        -- opcjonalnie: kryteria punktacji cząstkowej
  unique (exam_id, question_number)
);

-- Prace uczniów
create table if not exists student_submissions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  student_identifier text,      -- np. numer w dzienniku, może być anonimowe
  image_urls text[],            -- zdjęcia poszczególnych stron
  status text default 'pending' check (status in ('pending', 'processed', 'reviewed')),
  total_score numeric,
  created_at timestamptz default now()
);

-- Odpowiedzi rozpoznane per pytanie
create table if not exists submission_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references student_submissions(id) on delete cascade not null,
  question_id uuid references questions(id) not null,
  recognized_text text,         -- co OCR/model odczytał
  is_correct boolean,           -- dla closed
  suggested_score numeric,      -- dla open — sugestia AI
  final_score numeric,          -- to co nauczyciel ostatecznie zatwierdził
  teacher_reviewed boolean default false,
  ai_reasoning text,            -- uzasadnienie oceny AI, do wglądu nauczyciela
  unique (submission_id, question_id)
);

create index if not exists idx_questions_exam_id on questions(exam_id);
create index if not exists idx_submissions_exam_id on student_submissions(exam_id);
create index if not exists idx_answers_submission_id on submission_answers(submission_id);
create index if not exists idx_answers_question_id on submission_answers(question_id);

-- Row Level Security: nauczyciel widzi i edytuje wyłącznie własne egzaminy oraz
-- wszystko, co jest z nimi powiązane (pytania, prace, odpowiedzi).

alter table exams enable row level security;
alter table questions enable row level security;
alter table student_submissions enable row level security;
alter table submission_answers enable row level security;

create policy "teachers manage own exams" on exams
  for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "teachers manage own questions" on questions
  for all
  using (exists (select 1 from exams e where e.id = exam_id and e.teacher_id = auth.uid()))
  with check (exists (select 1 from exams e where e.id = exam_id and e.teacher_id = auth.uid()));

create policy "teachers manage own submissions" on student_submissions
  for all
  using (exists (select 1 from exams e where e.id = exam_id and e.teacher_id = auth.uid()))
  with check (exists (select 1 from exams e where e.id = exam_id and e.teacher_id = auth.uid()));

create policy "teachers manage own submission answers" on submission_answers
  for all
  using (
    exists (
      select 1 from student_submissions s
      join exams e on e.id = s.exam_id
      where s.id = submission_id and e.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from student_submissions s
      join exams e on e.id = s.exam_id
      where s.id = submission_id and e.teacher_id = auth.uid()
    )
  );

-- Storage bucket na zdjęcia kartek (prywatny, dostęp przez signed URL)
insert into storage.buckets (id, name, public)
values ('submission-scans', 'submission-scans', false)
on conflict (id) do nothing;

create policy "teachers manage own scans" on storage.objects
  for all
  using (bucket_id = 'submission-scans' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'submission-scans' and (storage.foldername(name))[1] = auth.uid()::text);
