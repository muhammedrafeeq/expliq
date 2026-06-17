// E:\Projects\Works\Expliq\src\components\renderer\ArticleRenderer.tsx
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // Import syntax styling
import { Block, ArticleDocument } from '@/lib/types/blocks'
import Link from 'next/link'
import Image from 'next/image'

interface ArticleRendererProps {
  document: ArticleDocument
}

function highlightCode(code: string, language: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value
    }
  } catch {
    // fall through to plain text
  }
  return code // Fallback plain text
}

import { Info, AlertTriangle, Sparkles, AlertCircle } from 'lucide-react'
import { CopyButton } from './CopyButton'

export function ArticleRenderer({ document }: ArticleRendererProps) {
  const blocks = document.blocks || []

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-article-max-width mx-auto leading-[1.8] text-body-lg text-on-surface/90 space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const HeadingTag = `h${block.level}` as 'h2' | 'h3' | 'h4'
            const cleanId = (block.content || '').replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
            return (
              <HeadingTag
                key={block.id}
                id={cleanId}
                className={`font-serif text-on-surface leading-tight tracking-tight ${
                  block.level === 2
                    ? 'text-2xl md:text-3xl border-b border-outline-variant/30 pb-2 font-extrabold mt-12 mb-6'
                    : block.level === 3
                    ? 'text-xl md:text-2xl font-bold mt-10 mb-4'
                    : 'text-lg font-bold mt-8 mb-3'
                }`}
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            )
          }

          case 'paragraph':
            return (
              <p
                key={block.id}
                className="text-base md:text-lg font-sans text-on-surface/85 leading-relaxed selection:bg-primary-fixed-dim selection:text-on-primary-fixed"
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            )

          case 'quote':
            return (
              <blockquote
                key={block.id}
                className="relative my-10 pl-8 pr-6 py-6 rounded-lg bg-primary-fixed/5 border-l-4 border-primary overflow-hidden select-none"
              >
                {/* Decorative Quote Mark */}
                <div className="absolute top-2 left-2 text-primary/10 select-none pointer-events-none font-serif text-8xl leading-none">
                  “
                </div>
                <p className="relative font-serif italic text-lg md:text-xl text-on-surface leading-relaxed mb-3 z-10">
                  {block.content}
                </p>
                {block.attribution && (
                  <cite className="relative block text-xs md:text-sm font-semibold tracking-wide text-on-surface-variant/80 not-italic z-10">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            )

          case 'code': {
            const highlightedHtml = highlightCode(block.content, block.language)
            return (
              <div
                key={block.id}
                className="group my-8 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800/80 text-sm font-mono relative shadow-md"
              >
                <div className="flex justify-between items-center bg-zinc-900/80 px-5 py-3 border-b border-zinc-800/50 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {block.language}
                    </span>
                  </div>
                  {block.filename && <span className="text-[10px] text-zinc-400 font-mono">{block.filename}</span>}
                </div>
                <pre className="p-6 overflow-x-auto text-zinc-300 leading-relaxed">
                  <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                </pre>
                <CopyButton code={block.content} />
              </div>
            )
          }

          case 'callout': {
            const styles = {
              info: {
                bg: 'bg-primary-fixed/5 border-primary text-on-surface-variant',
                icon: <Info className="text-primary shrink-0" size={18} />,
                titleColor: 'text-primary'
              },
              warning: {
                bg: 'bg-amber-500/5 border-amber-500 text-on-surface-variant',
                icon: <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={18} />,
                titleColor: 'text-amber-700 dark:text-amber-400'
              },
              tip: {
                bg: 'bg-emerald-500/5 border-emerald-500 text-on-surface-variant',
                icon: <Sparkles className="text-emerald-600 dark:text-emerald-400 shrink-0" size={18} />,
                titleColor: 'text-emerald-700 dark:text-emerald-400'
              },
              important: {
                bg: 'bg-red-500/5 border-red-500 text-on-surface-variant',
                icon: <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={18} />,
                titleColor: 'text-red-700 dark:text-red-400'
              }
            }
            const cfg = styles[block.style as 'info' | 'warning' | 'tip' | 'important'] || styles.info
            return (
              <div
                key={block.id}
                className={`my-8 border-l-4 p-5 rounded-r-2xl flex gap-3.5 items-start ${cfg.bg}`}
              >
                {cfg.icon}
                <div className="space-y-1">
                  {block.title && <div className={`font-bold text-sm tracking-wide ${cfg.titleColor}`}>{block.title}</div>}
                  <div className="text-sm opacity-90 leading-relaxed font-sans">{block.content}</div>
                </div>
              </div>
            )
          }

          case 'divider':
            return (
              <div key={block.id} className="my-12 flex justify-center items-center">
                {block.style === 'dots' ? (
                  <div className="flex gap-2.5 items-center justify-center select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60" />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60" />
                  </div>
                ) : (
                  <hr className="w-full border-t border-outline-variant/30" />
                )}
              </div>
            )

          case 'list': {
            const ListTag = block.style === 'numbered' ? 'ol' : 'ul'
            return (
              <ListTag key={block.id} className="pl-6 my-5 space-y-2 list-outside font-sans text-base md:text-lg">
                {block.items.map((item, idx) => (
                  <li
                    key={idx}
                    className={`text-on-surface/85 leading-relaxed ${
                      block.style === 'bullet'
                        ? 'list-disc marker:text-primary/70'
                        : block.style === 'numbered'
                        ? 'list-decimal marker:text-primary/70 marker:font-bold'
                        : 'list-none flex gap-2 items-center'
                    }`}
                  >
                    {block.style === 'checklist' && <span className="text-primary font-bold">✓</span>}
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ListTag>
            )
          }

          case 'image':
            return (
              <figure key={block.id} className="my-10 flex flex-col items-center select-none">
                <div
                  className={`relative w-full overflow-hidden rounded-lg border border-outline-variant/40 shadow-md ${
                    block.alignment === 'center' ? 'max-w-xl aspect-[4/3]' : 'aspect-video'
                  }`}
                >
                  <img src={block.url} alt={block.alt} className="w-full h-full object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-center text-xs text-on-surface-variant/70 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'affiliate':
            return (
              <div
                key={block.id}
                className="my-10 border border-primary/20 bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 p-6 rounded-lg flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute -right-24 -bottom-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="space-y-3 flex-1">
                  {block.badge && (
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {block.badge}
                    </span>
                  )}
                  <h4 className="font-serif font-bold text-on-surface text-xl md:text-2xl">{block.product_name}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{block.description}</p>
                  {block.price && (
                    <div className="text-sm font-bold text-on-surface">
                      Price: <span className="text-lg text-primary">{block.price}</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <Link
                    href={`/api/affiliate/click?partner=${encodeURIComponent(
                      block.product_name
                    )}&article=${block.id}&url=${encodeURIComponent(block.affiliate_url)}`}
                    target="_blank"
                    className="block text-center bg-primary hover:bg-primary/95 text-on-primary text-sm font-bold px-7 py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    {block.cta_text}
                  </Link>
                </div>
              </div>
            )

          case 'table':
            return (
              <div
                key={block.id}
                className="my-8 overflow-hidden border border-outline-variant/40 rounded-lg shadow-sm bg-surface-container-lowest"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-outline-variant/30 border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/60">
                        {block.headers.map((header, colIdx) => (
                          <th
                            key={colIdx}
                            className="px-5 py-4 text-left font-serif font-bold text-xs tracking-wider uppercase text-on-surface/80"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {block.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-primary-fixed/5 transition-colors duration-150">
                          {row.map((cell, colIdx) => (
                            <td key={colIdx} className="px-5 py-3.5 text-sm font-sans text-on-surface-variant">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <div className="bg-surface-container-lowest px-5 py-3 border-t border-outline-variant/20 text-xs text-on-surface-variant/70 italic">
                    {block.caption}
                  </div>
                )}
              </div>
            )

          case 'embed': {
            if (block.provider === 'youtube') {
              return (
                <div
                  key={block.id}
                  className="my-8 aspect-video rounded-lg overflow-hidden border border-outline-variant/40 shadow-md"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${block.embed_id}`}
                    title={block.caption || 'YouTube Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                    loading="lazy"
                  />
                </div>
              )
            }
            return (
              <div key={block.id} className="text-xs text-on-surface-variant/70 italic">
                Embed provider {block.provider} is rendered dynamically client-side.
              </div>
            )
          }

          case 'key-takeaways':
            return (
              <div
                key={block.id}
                className="my-8 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-r-2xl"
              >
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm tracking-wide uppercase mb-4">
                  Key Takeaways
                </p>
                <ul className="space-y-2.5">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-sm md:text-base text-on-surface/85">
                      <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )

          case 'pull-quote':
            return (
              <div key={block.id} className="my-12 px-4 md:px-16 text-center space-y-4">
                <p className="font-serif italic text-2xl md:text-3xl leading-snug text-on-surface">
                  {block.content}
                </p>
                {block.attribution && (
                  <cite className="block text-sm font-semibold text-on-surface-variant not-italic">
                    — {block.attribution}
                  </cite>
                )}
              </div>
            )

          case 'steps':
            return (
              <div key={block.id} className="my-8 space-y-0">
                {block.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center z-10">
                        {idx + 1}
                      </div>
                      {idx < block.items.length - 1 && (
                        <div className="w-0.5 h-full min-h-8 bg-primary/20 my-1" />
                      )}
                    </div>
                    <p className="text-base md:text-lg text-on-surface/85 leading-relaxed pb-6 pt-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )

          case 'faq':
            return (
              <div key={block.id} className="my-8 divide-y divide-outline-variant/30 border border-outline-variant/30 rounded-xl overflow-hidden">
                {block.items.map((faqItem, idx) => (
                  <div key={idx} className="px-6 py-5 space-y-2 bg-surface-container-lowest hover:bg-primary-fixed/5 transition-colors">
                    <p className="font-bold text-on-surface text-base">{faqItem.question}</p>
                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">{faqItem.answer}</p>
                  </div>
                ))}
              </div>
            )

          case 'cta':
            return (
              <div
                key={block.id}
                className="my-10 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-surface-container-low p-8 flex flex-col items-center text-center gap-4"
              >
                <h3 className="font-serif font-bold text-xl md:text-2xl text-on-surface">{block.heading}</h3>
                {block.subtext && (
                  <p className="text-sm md:text-base text-on-surface-variant max-w-md">{block.subtext}</p>
                )}
                <a
                  href={block.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.03] active:scale-95 ${
                    block.style === 'primary'
                      ? 'bg-primary text-on-primary shadow-md hover:shadow-lg'
                      : 'border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {block.buttonLabel}
                </a>
              </div>
            )

          case 'stat':
            return (
              <div
                key={block.id}
                className="my-10 flex flex-col items-center text-center py-8 px-6 border-t-4 border-primary rounded-b-xl bg-surface-container-lowest shadow-sm"
              >
                <span className="text-5xl md:text-6xl font-extrabold text-primary leading-none tracking-tight">
                  {block.value}
                </span>
                <span className="mt-3 text-base md:text-lg font-semibold text-on-surface">{block.label}</span>
                {block.context && (
                  <span className="mt-1.5 text-xs text-on-surface-variant">{block.context}</span>
                )}
              </div>
            )

          case 'newsletter':
            return (
              <div
                key={block.id}
                className="my-10 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-surface-container-low p-8 flex flex-col items-center text-center gap-4"
              >
                <h3 className="font-serif font-bold text-xl md:text-2xl text-on-surface">{block.heading}</h3>
                {block.subtext && (
                  <p className="text-sm md:text-base text-on-surface-variant max-w-md">{block.subtext}</p>
                )}
                <div className="flex gap-2 w-full max-w-sm mt-1">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    disabled
                    className="flex-1 rounded-lg border border-outline-variant px-4 py-2.5 text-sm bg-surface text-on-surface placeholder:text-outline-variant outline-none"
                  />
                  <button
                    disabled
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold opacity-90 cursor-default"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
