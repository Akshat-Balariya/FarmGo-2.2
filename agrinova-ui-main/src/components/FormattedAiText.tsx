type FormattedAiTextProps = {
  text: string;
  compact?: boolean;
};

type Section = {
  title: string;
  lines: string[];
};

const cleanMarkdown = (line: string) => {
  return line.replace(/\*\*/g, "").trim();
};

const parseSections = (text: string): Section[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: Section[] = [];
  let current: Section = { title: "Analysis", lines: [] };

  for (const rawLine of lines) {
    const line = cleanMarkdown(rawLine);
    const sectionMatch = line.match(/^\d+\)\s*(.+)$/);

    if (sectionMatch) {
      if (current.lines.length || current.title !== "Analysis") {
        sections.push(current);
      }
      current = { title: sectionMatch[1], lines: [] };
      continue;
    }

    current.lines.push(line);
  }

  if (current.lines.length || current.title !== "Analysis") {
    sections.push(current);
  }

  return sections;
};

const renderLine = (line: string, index: number) => {
  if (/^[-*]\s+/.test(line)) {
    return (
      <li key={index} className="ml-5 list-disc text-foreground/90 leading-relaxed">
        {line.replace(/^[-*]\s+/, "")}
      </li>
    );
  }

  return (
    <p key={index} className="text-foreground/90 leading-relaxed">
      {line}
    </p>
  );
};

export default function FormattedAiText({ text, compact = false }: FormattedAiTextProps) {
  const sections = parseSections(text);

  if (!sections.length) {
    return <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {sections.map((section, sectionIndex) => (
        <div key={`${section.title}-${sectionIndex}`} className="space-y-2">
          <h4 className="text-base font-semibold text-foreground">{section.title}</h4>
          <div className="space-y-2">
            {section.lines.map((line, lineIndex) => renderLine(line, lineIndex))}
          </div>
        </div>
      ))}
    </div>
  );
}
