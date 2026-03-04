export default function Footer() {
  return (
    <footer className="mt-10 pb-10 pt-8">
      <div className="glass card rounded-[1.75rem] px-6 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-2">
            <div className="text-lg font-extrabold tracking-tight">Waku Waku</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Ton catalogue manga rapide, clair et agréable.
            </p>
            <div className="text-xs text-zinc-500">
              © {new Date().getFullYear()} Waku Waku
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <div className="text-sm font-extrabold text-zinc-800">Navigation</div>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li>
                <a className="hover:text-zinc-900 transition" href="/">
                  Découvrir
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900 transition" href="/search">
                  Catalogue
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900 transition" href="/collection">
                  Collection
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900 transition" href="/profile">
                  Profil
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / About */}
          <div className="space-y-2">
            <div className="text-sm font-extrabold text-zinc-800">Infos</div>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li className="flex items-center justify-between gap-3">
                <span>Statut</span>
                <span className="badge">Bêta</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span>Données</span>
                <span className="text-zinc-700 font-semibold">AniList</span>
              </li>
              <li className="text-xs text-zinc-500 leading-relaxed pt-1">
                Les couvertures, titres et descriptions proviennent d’une API publique.  
                Ce projet est à usage pédagogique.
              </li>
            </ul>
          </div>
        </div>
        <div className="hr" />
      </div>
    </footer>
  );
}