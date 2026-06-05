import type { ReactNode } from "react";

function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(https?:\/\/[^\s]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  const cls = "font-medium text-olive underline underline-offset-2 hover:text-olive/80";
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      let url = m[1];
      let trailing = "";
      const tm = url.match(/[.,;:!?)\]]+$/);
      if (tm) { trailing = tm[0]; url = url.slice(0, url.length - trailing.length); }
      nodes.push(<a key={i++} href={url} target="_blank" rel="noopener noreferrer" className={cls}>{url}</a>);
      if (trailing) nodes.push(trailing);
    } else if (m[2]) {
      nodes.push(<a key={i++} href={`mailto:${m[2]}`} className={cls}>{m[2]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function ForumText({ text }: { text: string }) {
  const paras = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {paras.map((p, idx) => (
        <p key={idx} className="whitespace-pre-wrap leading-7 text-ink/80">{linkify(p)}</p>
      ))}
    </div>
  );
}
