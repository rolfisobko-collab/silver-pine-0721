import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const outDir = join(process.cwd(), 'public', 'alta-category-icons')

const categories = [
  'Accesorios',
  'Antenas',
  'Baterias',
  'Blindajes',
  'Botones',
  'Buzzer',
  'Camaras',
  'Celulares',
  'Combos',
  'DOCK TEST IPHONE',
  'FPC',
  'Flash Flex',
  'Flex Antena',
  'Flex Wifi',
  'Flex de Carga',
  'Flex de Sensor',
  'Flex home',
  'Glass',
  'Herramientas e insumos',
  'Ic de Carga',
  'MICROFONO',
  'Main Flex',
  'Modulos',
  'Parlante',
  'Partes recicladas',
  'Pegatinas',
  'Pines de Carga',
  'Placa de Carga',
  'Placas',
  'Porta Sim',
  'Power Flex',
  'REPUESTOS VARIOS ANDROID',
  'REPUESTOS VARIOS IPHONE',
  'Sensor Huella',
  'Sensores',
  'Socalo de Sim',
  'Speaker',
  'Tactil',
  'Tag on',
  'Tapas',
  'Tornillos',
  'Visor de Camara',
  'Volumen Flex',
]

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function profile(name) {
  const text = normalize(name)
  if (text.includes('modulo')) return ['screen', '#ff2947', '#101014']
  if (text.includes('bateria')) return ['battery', '#38e887', '#0e6b40']
  if (text.includes('glass') || text.includes('tactil')) return ['glass', '#38d7ff', '#1557ff']
  if (text.includes('herramienta') || text.includes('tornillo')) return ['tool', '#ffc247', '#ff4d00']
  if (text.includes('camara') || text.includes('visor')) return ['camera', '#5aa2ff', '#542bff']
  if (text.includes('flex') || text.includes('fpc')) return ['ribbon', '#b45cff', '#ff3aa5']
  if (text.includes('carga') || text.includes('pin') || text.includes('power')) return ['charge', '#23ddff', '#0c2bff']
  if (text.includes('placa') || text.includes('ic')) return ['chip', '#00e0a4', '#005b49']
  if (text.includes('sim')) return ['sim', '#ffb347', '#f03f35']
  if (text.includes('parlante') || text.includes('speaker') || text.includes('buzzer')) return ['sound', '#d76dff', '#3923a8']
  if (text.includes('microfono')) return ['mic', '#ff5f8f', '#890f46']
  if (text.includes('antena') || text.includes('wifi')) return ['signal', '#59e2ff', '#0065a8']
  if (text.includes('boton') || text.includes('home') || text.includes('volumen')) return ['button', '#ff7a45', '#8b1e0f']
  if (text.includes('tapa')) return ['case', '#f55f79', '#80152a']
  if (text.includes('celular') || text.includes('iphone') || text.includes('android')) return ['phone', '#f2163a', '#141414']
  if (text.includes('reciclada')) return ['recycle', '#55e38d', '#174e33']
  if (text.includes('tag') || text.includes('pegatina')) return ['tag', '#ff5574', '#5036e8']
  if (text.includes('blindaje')) return ['shield', '#9aa7b8', '#242938']
  if (text.includes('sensor') || text.includes('huella')) return ['sensor', '#36e6c8', '#11444e']
  if (text.includes('combo') || text.includes('accesorio')) return ['spark', '#ff3154', '#ff9a3d']
  return ['spark', '#ef233c', '#16171c']
}

function pictogram(kind) {
  const stroke = 'stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"'
  const fillWhite = 'fill="white"'
  const translucent = 'fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.7)" stroke-width="4"'

  switch (kind) {
    case 'screen':
      return `<rect x="78" y="54" width="100" height="148" rx="22" ${translucent}/><path d="M98 175h60" ${stroke}/><path d="M105 82h46" ${stroke}/>`
    case 'battery':
      return `<rect x="64" y="84" width="118" height="72" rx="18" ${translucent}/><rect x="184" y="107" width="14" height="26" rx="5" ${fillWhite}/><path d="M91 120h44" ${stroke}/><path d="M126 98l-21 31h28l-18 29" ${stroke}/>`
    case 'glass':
      return `<rect x="68" y="48" width="120" height="160" rx="28" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.78)" stroke-width="5"/><path d="M94 71l68 114" stroke="rgba(255,255,255,0.55)" stroke-width="4"/><path d="M86 152h84" ${stroke}/>`
    case 'tool':
      return `<path d="M86 174l72-72" ${stroke}/><path d="M162 62c-4 18-21 30-39 26l45 45c-4-18 8-35 26-39" ${stroke}/><circle cx="82" cy="178" r="16" ${translucent}/>`
    case 'camera':
      return `<rect x="55" y="80" width="146" height="96" rx="24" ${translucent}/><circle cx="128" cy="128" r="30" fill="rgba(255,255,255,0.25)" stroke="white" stroke-width="7"/><circle cx="174" cy="103" r="8" ${fillWhite}/>`
    case 'ribbon':
      return `<path d="M58 82c52-25 87 26 140-2" ${stroke}/><path d="M58 126c52-25 87 26 140-2" ${stroke}/><path d="M58 170c52-25 87 26 140-2" ${stroke}/><circle cx="70" cy="82" r="10" ${fillWhite}/><circle cx="186" cy="168" r="10" ${fillWhite}/>`
    case 'charge':
      return `<path d="M84 82v52c0 26 18 42 44 42s44-16 44-42V82" ${stroke}/><path d="M104 68v32M152 68v32" ${stroke}/><path d="M133 102l-24 38h31l-16 42" ${stroke}/>`
    case 'chip':
      return `<rect x="78" y="78" width="100" height="100" rx="20" ${translucent}/><rect x="106" y="106" width="44" height="44" rx="10" ${fillWhite}/><path d="M58 98h20M58 128h20M58 158h20M178 98h20M178 128h20M178 158h20M98 58v20M128 58v20M158 58v20M98 178v20M128 178v20M158 178v20" ${stroke}/>`
    case 'sim':
      return `<path d="M84 54h70l34 34v114H84z" ${translucent}/><path d="M108 124h40M108 150h56M108 98h28" ${stroke}/>`
    case 'sound':
      return `<path d="M70 110h34l42-34v104l-42-34H70z" fill="rgba(255,255,255,0.25)" stroke="white" stroke-width="6" stroke-linejoin="round"/><path d="M166 104c12 15 12 33 0 48M188 86c26 31 26 63 0 94" ${stroke}/>`
    case 'mic':
      return `<rect x="98" y="50" width="60" height="104" rx="30" ${translucent}/><path d="M76 124c0 33 20 54 52 54s52-21 52-54M128 178v28M102 206h52" ${stroke}/>`
    case 'signal':
      return `<circle cx="128" cy="168" r="10" ${fillWhite}/><path d="M91 132c20-20 54-20 74 0M70 108c32-32 84-32 116 0M50 84c43-43 113-43 156 0" ${stroke}/>`
    case 'button':
      return `<rect x="70" y="70" width="116" height="116" rx="34" ${translucent}/><circle cx="128" cy="128" r="32" fill="rgba(255,255,255,0.22)" stroke="white" stroke-width="7"/><path d="M128 103v25" ${stroke}/>`
    case 'case':
      return `<path d="M78 70c28-22 72-22 100 0v122c-25 14-75 14-100 0z" ${translucent}/><path d="M105 84h46M100 162h56" ${stroke}/>`
    case 'phone':
      return `<rect x="82" y="46" width="92" height="164" rx="26" ${translucent}/><circle cx="128" cy="184" r="7" ${fillWhite}/><path d="M112 70h32" ${stroke}/>`
    case 'recycle':
      return `<path d="M108 72l22-19 21 37M88 155l-8-28 42 2M164 156l29-7-20-37" ${stroke}/><path d="M126 53c42 2 72 43 56 83M80 127c-18-36 6-79 46-74M176 151c-22 33-72 37-99 6" ${stroke}/>`
    case 'tag':
      return `<path d="M70 74h74l48 48-76 76-48-48z" ${translucent}/><circle cx="104" cy="108" r="10" ${fillWhite}/>`
    case 'shield':
      return `<path d="M128 48l70 26v48c0 46-28 78-70 94-42-16-70-48-70-94V74z" ${translucent}/><path d="M128 80v92M96 122h64" ${stroke}/>`
    case 'sensor':
      return `<circle cx="128" cy="128" r="56" ${translucent}/><path d="M128 82c27 10 43 31 43 58M128 102c16 7 25 20 25 38M128 122c6 4 9 10 9 18M98 168c20 18 48 18 68 0" ${stroke}/>`
    default:
      return `<path d="M128 50l17 54 55 2-45 31 15 55-42-33-44 33 16-55-44-31 55-2z" fill="rgba(255,255,255,0.28)" stroke="white" stroke-width="6" stroke-linejoin="round"/>`
  }
}

function svgFor(name) {
  const [kind, a, b] = profile(name)
  const id = slugify(name)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="bg-${id}" x1="22" y1="16" x2="222" y2="236" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="shine-${id}" cx="36%" cy="24%" r="70%">
      <stop offset="0" stop-color="white" stop-opacity=".7"/>
      <stop offset=".42" stop-color="white" stop-opacity=".12"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="black" flood-opacity=".26"/>
    </filter>
  </defs>
  <rect x="18" y="18" width="220" height="220" rx="58" fill="url(#bg-${id})" filter="url(#shadow-${id})"/>
  <path d="M-10 212C58 154 84 98 116-10h46C132 96 102 166 8 256z" fill="rgba(255,255,255,.16)"/>
  <path d="M124-18h36l-20 292h-36z" fill="rgba(239,35,60,.34)" transform="rotate(18 128 128)"/>
  <path d="M0 194c54-32 128-43 256-18v80H0z" fill="rgba(255,255,255,.12)"/>
  <rect x="18" y="18" width="220" height="220" rx="58" fill="url(#shine-${id})"/>
  <g>
    ${pictogram(kind)}
  </g>
  <rect x="19.5" y="19.5" width="217" height="217" rx="56" fill="none" stroke="rgba(255,255,255,.62)" stroke-width="3"/>
</svg>`
}

mkdirSync(outDir, { recursive: true })
for (const name of [...categories, 'default']) {
  writeFileSync(join(outDir, `${slugify(name)}.svg`), svgFor(name), 'utf8')
}

console.log(`Generated ${categories.length + 1} category icons in ${outDir}`)
