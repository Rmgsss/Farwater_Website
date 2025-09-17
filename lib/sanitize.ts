import DOMPurify from "isomorphic-dompurify";

const DEFAULT_ALLOWED_TAGS = [
  "a",
  "blockquote",
  "code",
  "em",
  "strong",
  "p",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "img",
  "span",
  "br",
];

const DEFAULT_ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "class",
  "data-component",
];

export function sanitizeHtml(input: string) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
  });
}
