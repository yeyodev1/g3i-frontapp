/**
 * Renderer mínimo del markdown del blog y de las descripciones.
 * Escapa TODO el HTML primero y luego solo reconoce: párrafos, "## ",
 * "- ", **negrita** y [link](url). Nada más, a propósito: el contenido
 * lo escribe la inmobiliaria desde el portal y no debe inyectar HTML.
 */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(url: string): string | null {
  const clean = url.trim()
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(clean)) return clean
  return null
}

function inline(text: string): string {
  let html = escapeHtml(text)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const href = safeUrl(url.replace(/&amp;/g, '&'))
    if (!href) return label
    const external = /^https?:/i.test(href)
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${escapeHtml(href)}"${attrs}>${label}</a>`
  })
  return html
}

export function renderMarkdown(source: string): string {
  if (!source) return ''
  const blocks = source.replace(/\r\n/g, '\n').split(/\n{2,}/)
  const out: string[] = []

  for (const block of blocks) {
    const lines = block.split('\n').filter((l) => l.trim() !== '')
    if (!lines.length) continue

    let paragraph: string[] = []
    let list: string[] = []
    const flush = () => {
      if (paragraph.length) out.push(`<p>${paragraph.map(inline).join('<br>')}</p>`)
      if (list.length) out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`)
      paragraph = []
      list = []
    }

    for (const line of lines) {
      const trimmed = line.trim()
      if (/^#{2,3}\s+/.test(trimmed)) {
        flush()
        out.push(`<h2>${inline(trimmed.replace(/^#{2,3}\s+/, ''))}</h2>`)
      } else if (/^[-*]\s+/.test(trimmed)) {
        if (paragraph.length) flush()
        list.push(trimmed.replace(/^[-*]\s+/, ''))
      } else {
        if (list.length) flush()
        paragraph.push(trimmed)
      }
    }
    flush()
  }

  return out.join('\n')
}

/** Descripciones de inmuebles: texto plano con párrafos separados por línea en blanco. */
export function toParagraphs(text: string): string[] {
  if (!text) return []
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}
