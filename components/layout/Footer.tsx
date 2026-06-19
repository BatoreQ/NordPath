import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-blue-600">EmiDoc</span>
            <p className="text-xs text-gray-500 mt-1">Formalności za granicą — krok po kroku</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/regulamin" className="hover:text-gray-700">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-gray-700">Prywatność</Link>
            <Link href="mailto:kontakt@emidoc.pl" className="hover:text-gray-700">Kontakt</Link>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} EmiDoc. Informacje mają charakter poglądowy — zawsze weryfikuj w oficjalnych źródłach.
        </p>
      </div>
    </footer>
  )
}
