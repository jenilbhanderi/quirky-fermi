import Link from "next/link";

/*
  ═══════════════════════════════════════════════════════════════
  FOOTER COMPONENT

  This is a Server Component (no "use client" needed) because
  it has no interactivity — just static links and text.

  Server Components are faster because they:
  1. Don't send JavaScript to the browser
  2. Render once on the server
  3. Send pure HTML
  ═══════════════════════════════════════════════════════════════
*/

const footerLinks = {
  research: [
    { href: "/research", label: "Papers" },
    { href: "/technology", label: "Technology" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "mailto:contact@hylunian.com", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ─── Main Footer Content ─── */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="group flex items-center mb-4">
              <span className="font-display text-lg font-bold tracking-tight gradient-text">
                Hylunian.
              </span>
            </Link>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              Pioneering transparent piezoelectric and triboelectric display
              interfaces that convert kinetic touch into self-sustaining
              electrical power.
            </p>
          </div>

          {/* Research Links */}
          <div>
            <h3 className="label mb-4">Research</h3>
            <ul className="space-y-2.5">
              {footerLinks.research.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="label mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Big Centered Wordmark Logo ─── */}
        <div className="py-6 border-t border-border/60 text-center select-none overflow-hidden">
          <span className="font-display text-6xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold tracking-tighter gradient-text opacity-100 block leading-none py-4">
            Hylunian.
          </span>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Hylunian. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
              Display that gives back.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
