import Logo from './Logo'

const columns = [
  {
    title: 'Product',
    links: ['Features', 'How it works', 'Insights', 'Pricing'],
  },
  {
    title: 'Company',
    id: 'about',
    links: ['About', 'Careers', 'Contact'],
  },
]

const legalLinks = ['Privacy', 'Terms', 'Security']

export default function Footer() {
  return (
    <footer className="bg-navy pt-12 sm:pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Logo + tagline — always shown, centered on mobile for a calmer look */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left mb-10 sm:mb-0">
          <Logo dark className="mb-4" />
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            A calm, precise way to see where your money goes.
          </p>
        </div>

        {/* Link columns — collapsed out of the way on mobile. A full sitemap
            isn't useful on a small screen; the essentials (About/Contact,
            legal) still live in the bottom bar below. */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-10 sm:mt-10 sm:pb-12 sm:border-b sm:border-white/10">
          {columns.map((col) => (
            <div key={col.title} id={col.id}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === 'Contact' ? '#contact' : '#'}
                      id={link === 'Contact' ? 'contact' : undefined}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile-only anchors for #about/#contact, since the columns above are hidden */}
        <span id="about" className="sm:hidden" />
        <span id="contact" className="sm:hidden" />

        <div className="h-px bg-white/10 mb-8 sm:hidden" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:items-center sm:pt-6 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 order-2 sm:order-1">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="text-white/50 hover:text-white text-xs transition-colors">
                {link}
              </a>
            ))}
          </div>

          <p className="text-white/35 text-xs text-center order-3 sm:order-2 sm:text-right">
            Made for people who want to know where their money goes.
          </p>

          <p className="text-white/35 text-xs order-1 sm:order-3">
            © {new Date().getFullYear()} Finance Flow
          </p>
        </div>
      </div>
    </footer>
  )
}
