import React from "react";

function renderInline(text, keyPrefix) {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g,
  );

  return tokens.filter(Boolean).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={key}>{token.slice(1, -1)}</code>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

function startsBlock(line) {
  return (
    /^#{1,3}\s/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*]\s/.test(line) ||
    /^\d+\.\s/.test(line) ||
    /^```/.test(line)
  );
}

export default function MarkdownRenderer({ content, compact = false }) {
  const lines = String(content || "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}`;
      blocks.push(
        <Tag key={`heading-${index}`}>
          {renderInline(heading[2], `heading-${index}`)}
        </Tag>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={`code-${index}`}>
          <code className={language ? `language-${language}` : undefined}>
            {code.join("\n")}
          </code>
        </pre>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`}>
          {renderInline(quote.join(" "), `quote-${index}`)}
        </blockquote>,
      );
      continue;
    }

    const unordered = /^[-*]\s+/.test(line);
    const ordered = /^\d+\.\s+/.test(line);
    if (unordered || ordered) {
      const items = [];
      const pattern = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (index < lines.length && pattern.test(lines[index])) {
        items.push(lines[index].replace(pattern, ""));
        index += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag key={`list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`item-${index}-${itemIndex}`}>
              {renderInline(item, `item-${index}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !startsBlock(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {renderInline(paragraph.join(" "), `paragraph-${index}`)}
      </p>,
    );

    if (compact && blocks.length >= 2) break;
  }

  return <div className="markdown-content">{blocks}</div>;
}

export function getMarkdownTitle(content) {
  const heading = String(content || "").match(/^#\s+(.+)$/m);
  return heading ? heading[1].replace(/[*`]/g, "") : "Interview Experience";
}

export function getMarkdownExcerpt(content, maxLength = 180) {
  const text = String(content || "")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
