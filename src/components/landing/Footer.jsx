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
    <footer className="bg-navy pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="pb-10 sm:pb-12 border-b border-white/10 sm:grid sm:grid-cols-3 sm:gap-10">
          <div className="mb-8 sm:mb-0">
            <Logo dark className="mb-4" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A calm, precise way to see where your money goes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:contents">
            {columns.map((col) => (
              <div key={col.title} id={col.id}>
                <h4 className="text-white text-sm font-semibold mb-3.5 sm:mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
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
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} Finance Flow. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">·</span>
            <div className="flex items-center gap-3">
              {legalLinks.map((link) => (
                <a key={link} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs text-center sm:text-right">
            Made for people who want to know where their money goes.
          </p>
        </div>
      </div>
    </footer>
  )
}
