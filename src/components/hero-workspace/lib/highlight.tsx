import { Fragment, type ReactNode } from "react";

const KEYWORDS = new Set([
  "import", "from", "export", "default", "return", "function", "const", "let",
  "var", "if", "else", "for", "while", "true", "false", "null", "undefined",
  "new", "class", "extends", "async", "await", "try", "catch", "throw", "of",
  "in", "typeof", "this", "as",
]);

type Token = { type: string; value: string };

// Tokenize a mix of JSX/JS/JSON with a small state machine.
function tokenize(src: string, language: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = src.length;

  const push = (type: string, value: string) => {
    if (!value) return;
    tokens.push({ type, value });
  };

  while (i < n) {
    const ch = src[i];
    const two = src.slice(i, i + 2);

    // Line comment
    if (two === "//") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      push("comment", src.slice(i, stop));
      i = stop;
      continue;
    }
    // Block comment
    if (two === "/*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      push("comment", src.slice(i, stop));
      i = stop;
      continue;
    }
    // Strings
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < n && src[j] !== quote) {
        if (src[j] === "\\") j += 2;
        else j++;
      }
      j = Math.min(j + 1, n);
      push("string", src.slice(i, j));
      i = j;
      continue;
    }
    // JSX tag open <Foo  or </Foo
    if (ch === "<" && /[A-Za-z/]/.test(src[i + 1] ?? "")) {
      // find end of tag name
      let j = i + 1;
      if (src[j] === "/") j++;
      const nameStart = j;
      while (j < n && /[A-Za-z0-9._-]/.test(src[j])) j++;
      push("punct", src.slice(i, nameStart));
      push("tag", src.slice(nameStart, j));
      i = j;
      // consume attributes until > or />
      while (i < n && src[i] !== ">") {
        const c = src[i];
        if (c === '"' || c === "'" || c === "`") {
          const quote = c;
          let k = i + 1;
          while (k < n && src[k] !== quote) k++;
          k = Math.min(k + 1, n);
          push("string", src.slice(i, k));
          i = k;
          continue;
        }
        if (c === "{") {
          // simple brace passthrough
          push("punct", "{");
          i++;
          continue;
        }
        if (c === "}") {
          push("punct", "}");
          i++;
          continue;
        }
        if (/[A-Za-z_]/.test(c)) {
          let k = i;
          while (k < n && /[A-Za-z0-9_-]/.test(src[k])) k++;
          push("attr", src.slice(i, k));
          i = k;
          continue;
        }
        if (c === "\n") {
          push("text", "\n");
          i++;
          continue;
        }
        push("punct", c);
        i++;
      }
      if (i < n && src[i] === ">") {
        push("punct", ">");
        i++;
      }
      continue;
    }
    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      push("number", src.slice(i, j));
      i = j;
      continue;
    }
    // Identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) push("keyword", word);
      else if (/^[A-Z]/.test(word)) push("type", word);
      else push("ident", word);
      i = j;
      continue;
    }
    // Punctuation
    if (/[{}()\[\];,.:=+\-*/&|!<>?]/.test(ch)) {
      push("punct", ch);
      i++;
      continue;
    }
    push("text", ch);
    i++;
  }

  // JSON: simplify — treat keys as attrs
  if (language === "json") {
    return tokens.map((t) => {
      if (t.type === "string" && t.value.startsWith('"') && t.value.endsWith('"')) {
        return t;
      }
      return t;
    });
  }
  return tokens;
}

const CLASS: Record<string, string> = {
  keyword: "text-[color:var(--brand)]",
  string: "text-amber-300/90",
  comment: "text-white/35 italic",
  tag: "text-[color:var(--brand)]/90",
  attr: "text-sky-300/80",
  number: "text-amber-200/90",
  type: "text-emerald-300/90",
  ident: "text-white/85",
  punct: "text-white/50",
  text: "text-white/80",
};

export function highlight(src: string, language = "jsx"): ReactNode {
  const tokens = tokenize(src, language);
  const lines: ReactNode[][] = [[]];
  tokens.forEach((t, idx) => {
    const parts = t.value.split("\n");
    parts.forEach((p, k) => {
      if (p) {
        lines[lines.length - 1].push(
          <span key={`${idx}-${k}`} className={CLASS[t.type] ?? "text-white/80"}>
            {p}
          </span>
        );
      }
      if (k < parts.length - 1) lines.push([]);
    });
  });
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          {line.length ? line : <Fragment>&nbsp;</Fragment>}
        </div>
      ))}
    </>
  );
}

export function lineCount(src: string): number {
  if (!src) return 1;
  return src.split("\n").length;
}