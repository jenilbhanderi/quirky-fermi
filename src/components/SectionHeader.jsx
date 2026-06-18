/*
  ═══════════════════════════════════════════════════════════════
  SECTION HEADER COMPONENT

  A reusable component for consistent section titles across pages.
  Every major section of the site uses this pattern:
    [LABEL]     ← Small monospace text (e.g., "01 / About")
    [TITLE]     ← Big display heading
    [SUBTITLE]  ← Optional description text

  Props:
  - label:    The small uppercase label (string)
  - title:    The main heading text (string)
  - subtitle: Optional description (string)
  - centered: Whether to center-align (boolean, default false)
  ═══════════════════════════════════════════════════════════════
*/

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
}) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? "text-center" : ""}`}>
      {label && (
        <p className="label mb-4">{label}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg text-text-secondary leading-relaxed ${
            centered ? "max-w-2xl mx-auto" : "max-w-3xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
