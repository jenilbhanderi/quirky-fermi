import Link from "next/link";

/*
  ═══════════════════════════════════════════════════════════════
  BUTTON COMPONENT

  A reusable button with multiple variants:
  - "primary": Solid blue background (main CTA)
  - "secondary": Outlined with border (secondary action)
  - "ghost": Text-only with subtle hover (tertiary action)

  Props:
  - children:  Button text/content
  - variant:   "primary" | "secondary" | "ghost" (default: "primary")
  - href:      If provided, renders as a Link instead of a button
  - className: Additional custom classes
  - ...props:  Any other button/link props (onClick, disabled, etc.)

  WHY USE A COMPONENT FOR BUTTONS?
  Without this, you'd copy-paste the same Tailwind classes every time
  you need a button. If you later want to change the button style,
  you'd have to find and update every instance. With a component,
  change it once → updated everywhere.
  ═══════════════════════════════════════════════════════════════
*/

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm",
  secondary:
    "border border-border text-text-primary bg-surface hover:bg-surface-elevated transition-colors",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors",
};

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    px-5 py-2.5 rounded-lg
    text-sm font-medium
    transition-all duration-200
    cursor-pointer
    ${variants[variant]}
    ${className}
  `;

  // If href is provided, render as a Next.js Link (for navigation)
  if (href) {
    return (
      <Link href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  // Otherwise render as a regular button (for actions)
  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
