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
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <Logo dark className="mb-4" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A calm, precise way to see where your money goes.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} id={col.id}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
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
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Finance Flow. All rights reserved.</p>
          <p className="text-white/40 text-xs">Made for people who want to know where their money goes.</p>
        </div>
      </div>
    </footer>
  )
}
