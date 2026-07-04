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
        {/* Brand + link columns */}
        <div className="pb-8 sm:pb-12 border-b border-white/10 sm:grid sm:grid-cols-3 sm:gap-10">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <Logo dark className="mb-4 justify-center sm:justify-start" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              A calm, precise way to see where your money goes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:contents">
            {columns.map((col) => (
              <div key={col.title} id={col.id}>
                <h4 className="text-white text-xs sm:text-sm font-semibold uppercase sm:normal-case tracking-wide sm:tracking-normal mb-3 sm:mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href={link === 'Contact' ? '#contact' : '#'}
                        id={link === 'Contact' ? 'contact' : undefined}
                        className="text-white/50 hover:text-white text-[13px] sm:text-sm transition-colors"
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

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-white/35 text-xs order-2 sm:order-1">
            © {new Date().getFullYear()} Finance Flow. All rights reserved.
          </p>

          <div className="flex items-center gap-4 order-1 sm:order-2">
            {legalLinks.map((link, i) => (
              <span key={link} className="flex items-center gap-4">
                <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                  {link}
                </a>
                {i < legalLinks.length - 1 && <span className="h-1 w-1 rounded-full bg-white/15" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
