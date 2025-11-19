addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

let engine = null
async function initStockfish() {
  if (engine) return engine
  engine = { send: async (cmd) => 'ok' }
  return engine
}

async function handle(request) {
  const url = new URL(request.url)
  if (url.pathname !== '/engine') return new Response('Not found', { status: 404 })
  const fen = url.searchParams.get('fen') || ''
  const depth = url.searchParams.get('depth') || '12'
  if (!fen) return new Response(JSON.stringify({ error: 'missing fen' }), { status: 400 })

  const out = { bestmove: null, eval: 0 }
  const explanation = `Demo-Erklärung: einfache Heuristik. Eval: ${out.eval}`
  return new Response(JSON.stringify({ bestmove: out.bestmove, eval: out.eval, explanation }), { headers: { 'content-type':'application/json' } })
}