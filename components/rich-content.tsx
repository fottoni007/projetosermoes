"use client";

import type { ReactNode } from "react";

function ytId(t: string): string | null {
  const ps = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of ps) { const m = t.match(p); if (m) return m[1]; }
  return null;
}

function spotify(t: string): { type: string; id: string } | null {
  const m = t.match(/open\.spotify\.com\/(?:embed\/)?(track|episode|show|playlist|album|artist)\/([A-Za-z0-9]+)/);
  return m ? { type: m[1], id: m[2] } : null;
}

function applePodcast(t: string): string | null {
  const m = t.match(/podcasts\.apple\.com\/([^\s"'<>]+)/);
  return m ? `https://embed.podcasts.apple.com/${m[1]}` : null;
}

function imageUrl(t: string): string | null {
  const md = t.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (md) return md[1];
  const plain = t.match(/^https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?\S*)?$/i);
  return plain ? plain[0] : null;
}

function renderInline(text: string): ReactNode[] {
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

export default function RichContent({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let k = 0;

  const flushPara = () => {
    if (para.length) { blocks.push(<p key={k++} className="leading-7 text-ink/75">{renderInline(para.join(" "))}</p>); para = []; }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={k++} className="list-disc space-y-1.5 pl-5 leading-7 text-ink/75">
          {list.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    const yt = ytId(raw);
    if (yt) {
      flushPara(); flushList();
      blocks.push(
        <div key={k++} className="my-4 aspect-video w-full overflow-hidden rounded-lg border border-ink/10 bg-black">
          <iframe src={`https://www.youtube.com/embed/${yt}`} title="Vídeo do YouTube" className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
      );
      continue;
    }

    const sp = spotify(raw);
    if (sp) {
      flushPara(); flushList();
      const h = sp.type === "track" || sp.type === "episode" ? 152 : 352;
      blocks.push(
        <iframe key={k++} className="my-4 w-full rounded-xl" style={{ height: `${h}px` }} src={`https://open.spotify.com/embed/${sp.type}/${sp.id}`} title="Spotify" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
      );
      continue;
    }

    const ap = applePodcast(raw);
    if (ap) {
      flushPara(); flushList();
      const isEpisode = /[?&]i=\d+/.test(ap);
      const h = isEpisode ? 175 : 450;
      blocks.push(
        <iframe key={k++} className="my-4 w-full rounded-xl border border-ink/10" style={{ height: `${h}px` }} src={ap} title="Apple Podcasts" loading="lazy" allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" />
      );
      continue;
    }

    const img = imageUrl(line);
    if (img) {
      flushPara(); flushList();
      {/* eslint-disable-next-line @next/next/no-img-element */}
      blocks.push(<img key={k++} src={img} alt="" className="my-4 mx-auto max-h-[40rem] max-w-full rounded-lg" loading="lazy" />);
      continue;
    }

    if (line === "") { flushPara(); flushList(); continue; }
    if (line.startsWith("### ")) { flushPara(); flushList(); blocks.push(<h3 key={k++} className="mt-5 text-base font-semibold text-ink">{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## ")) { flushPara(); flushList(); blocks.push(<h2 key={k++} className="mt-7 text-lg font-semibold text-ink">{line.slice(3)}</h2>); continue; }
    if (line.startsWith("- ")) { flushPara(); list.push(line.slice(2)); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return <>{blocks}</>;
}
