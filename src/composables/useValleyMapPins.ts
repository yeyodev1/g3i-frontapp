import type L from 'leaflet'
import { pinPath } from './useLeafletMap'
import { formatPrice } from '@/utils/format'
import { copyPages } from '@/config/copy.pages'
import type { MapPin } from '@/types'

const c = copyPages.valley
// Distancia en píxeles bajo la cual dos pines de precio se tapan.
const CLUSTER_PX = 46

export function domEl<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = '') {
  const node = document.createElement(tag)
  node.className = className
  if (text) node.textContent = text
  return node
}

/** Agrupación simple y codiciosa por distancia en pantalla (sin librerías de clusters). */
export function groupPins(pins: MapPin[], project: (pin: MapPin) => L.Point): MapPin[][] {
  const groups: { at: L.Point; pins: MapPin[] }[] = []
  for (const pin of pins) {
    const pt = project(pin)
    const near = groups.find((g) => g.at.distanceTo(pt) < CLUSTER_PX)
    if (near) near.pins.push(pin)
    else groups.push({ at: pt, pins: [pin] })
  }
  return groups.map((g) => g.pins)
}

function priceText(pin: MapPin) {
  if (!pin.price) return ''
  return `${pin.kind === 'project' ? `${c.from} ` : ''}${formatPrice(pin.price)}`
}

/** Popup de un inmueble: foto, tipo · zona, título y precio en Cormorant, botón. */
export function pinPopup(pin: MapPin, zone: string, type: string, navigate: (path: string) => void) {
  const isProject = pin.kind === 'project'
  const box = domEl('div', 'valley-pop')
  if (pin.cover) {
    const img = domEl('img', '')
    img.src = pin.cover
    img.alt = pin.title
    img.loading = 'lazy'
    box.append(img)
  }
  const body = domEl('div', 'valley-pop__body')
  const kicker = [isProject ? c.projectTag : type, zone].filter(Boolean).join(' · ')
  body.append(domEl('span', 'valley-pop__label', kicker), domEl('strong', 'valley-pop__title', pin.title))
  if (pin.price) body.append(domEl('span', 'valley-pop__price', priceText(pin)))
  const btn = domEl('button', 'valley-pop__cta', isProject ? c.seeProject : c.seeProperty)
  btn.type = 'button'
  btn.addEventListener('click', () => navigate(pinPath(pin)))
  body.append(btn)
  box.append(body)
  return box
}

/** Pines en la misma coordenada: lista corta para elegir uno. */
export function clusterPopup(pins: MapPin[], pick: (pin: MapPin) => void) {
  const box = domEl('div', 'valley-pop valley-pop--list')
  const body = domEl('div', 'valley-pop__body')
  body.append(domEl('span', 'valley-pop__label', c.results(pins.length)))
  for (const pin of pins) {
    const row = domEl('button', 'valley-pop__row')
    row.type = 'button'
    row.append(domEl('span', 'valley-pop__row-title', pin.title), domEl('span', 'valley-pop__row-price', priceText(pin)))
    row.addEventListener('click', () => pick(pin))
    body.append(row)
  }
  box.append(body)
  return box
}
