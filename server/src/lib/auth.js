import { supabase } from './supabase.js';

// Nauczyciel loguje sie przez Supabase Auth po stronie frontendu i wysyla
// Bearer token z kazdym zapytaniem. Tu weryfikujemy token i ladujemy user.id
// jako req.teacherId, zeby routy mogly scopowac zapytania do wlasciciela.
export async function requireTeacher(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Nieprawidlowy lub wygasly token' });
  }

  req.teacherId = data.user.id;
  next();
}
