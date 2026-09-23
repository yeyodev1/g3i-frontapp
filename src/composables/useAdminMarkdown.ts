/**
 * Markdown simple del blog, el mismo subconjunto que acepta el backend:
 * párrafos, "## " subtítulos, "- " listas, **negrita** y [enlace](url).
 * Se escapa el HTML primero: el contenido nunca inyecta etiquetas propias.
 */
function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(text: string): string {
  return escape(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

export function renderMarkdown(source: string): string {
  return source
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`
      if (block.startsWith('### ')) return `<h3>${inline(block.slice(4))}</h3>`
      const lines = block.split('\n')
      if (lines.every((line) => line.trim().startsWith('- '))) {
        const items = lines.map((line) => `<li>${inline(line.trim().slice(2))}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${lines.map(inline).join('<br>')}</p>`
    })
    .join('')
}

export function useAdminMarkdown() {
  return { renderMarkdown }
}
