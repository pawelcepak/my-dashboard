export type PageSectionLink = {
  id: string;
  label: string;
};

type PageSectionNavProps = {
  sections: PageSectionLink[];
};

function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PageSectionNav({ sections }: PageSectionNavProps) {
  return (
    <nav aria-label="Skróty do sekcji strony" className="page-section-nav">
      <span className="page-section-nav-label">Sekcje</span>

      <div className="page-section-nav-links">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="page-section-nav-button"
            title={`Przejdź do sekcji: ${section.label}`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
