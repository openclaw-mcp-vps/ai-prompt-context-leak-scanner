'use client'
import { useState } from 'react'

const PATTERNS = [
  { label: 'AWS Key', re: /AKIA[0-9A-Z]{16}/ },
  { label: 'Generic API Key', re: /(?:api[_-]?key|apikey)[\s:=]+[\w\-]{16,}/i },
  { label: 'Bearer Token', re: /bearer\s+[a-zA-Z0-9\-._~+/]{20,}/i },
  { label: 'Password', re: /(?:password|passwd|pwd)[\s:=]+\S{6,}/i },
  { label: 'Private Key', re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { label: 'Email', re: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/ },
  { label: 'Credit Card', re: /\b(?:\d[ -]?){13,16}\b/ },
  { label: 'SSN', re: /\b\d{3}-\d{2}-\d{4}\b/ },
  { label: 'GitHub Token', re: /ghp_[a-zA-Z0-9]{36}/ },
  { label: 'Slack Token', re: /xox[baprs]-[0-9a-zA-Z\-]{10,}/ },
  { label: 'Stripe Key', re: /sk_(live|test)_[0-9a-zA-Z]{24,}/ },
  { label: 'OpenAI Key', re: /sk-[a-zA-Z0-9]{32,}/ },
]

type Finding = { label: string; match: string }

function scan(text: string): Finding[] {
  return PATTERNS.flatMap(({ label, re }) => {
    const m = text.match(re)
    return m ? [{ label, match: m[0].slice(0, 40) + (m[0].length > 40 ? '…' : '') }] : []
  })
}

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [findings, setFindings] = useState<Finding[] | null>(null)

  function handleScan() {
    setFindings(scan(prompt))
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col items-center px-4 py-16">
      {/* Hero */}
      <section className="max-w-2xl w-full text-center mb-12">
        <span className="inline-block bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">AI Security</span>
        <h1 className="text-4xl font-bold text-white mb-4">Scan Prompts for Sensitive Data Leaks</h1>
        <p className="text-[#8b949e] text-lg mb-8">Paste your AI prompt below. We detect API keys, passwords, PII, and secrets client-side — nothing leaves your browser.</p>
        <textarea
          className="w-full h-40 bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-[#c9d1d9] text-sm resize-none focus:outline-none focus:border-[#58a6ff] placeholder-[#484f58]"
          placeholder="Paste your prompt here..."
          value={prompt}
          onChange={e => { setPrompt(e.target.value); setFindings(null) }}
        />
        <button
          onClick={handleScan}
          disabled={!prompt.trim()}
          className="mt-4 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >Scan Prompt</button>
        {findings !== null && (
          <div className="mt-6 text-left">
            {findings.length === 0 ? (
              <div className="bg-[#0f2a1a] border border-[#238636] rounded-lg p-4 text-[#3fb950] font-medium">No sensitive data detected. Your prompt looks clean.</div>
            ) : (
              <div className="bg-[#2a0f0f] border border-[#da3633] rounded-lg p-4">
                <p className="text-[#f85149] font-semibold mb-3">{findings.length} issue{findings.length > 1 ? 's' : ''} found:</p>
                <ul className="space-y-2">
                  {findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="bg-[#da3633] text-white text-xs px-2 py-0.5 rounded font-bold shrink-0">{f.label}</span>
                      <code className="text-[#ffa198] break-all">{f.match}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Pricing */}
      <section className="max-w-sm w-full mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Simple Pricing</h2>
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-xl p-8 text-center">
          <p className="text-[#58a6ff] font-semibold uppercase tracking-widest text-xs mb-2">Pro</p>
          <p className="text-5xl font-bold text-white mb-1">$25<span className="text-xl text-[#8b949e] font-normal">/mo</span></p>
          <p className="text-[#8b949e] text-sm mb-6">Unlimited scans + team sharing</p>
          <ul className="text-sm text-[#c9d1d9] space-y-2 mb-8 text-left">
            {['Unlimited prompt scans','12+ sensitive data patterns','API access for CI/CD pipelines','Priority support'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-[#3fb950]">✓</span>{f}</li>
            ))}
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || '#'}
            className="block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold py-3 rounded-lg transition-colors"
          >Get Started</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl w-full mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
        <div className="space-y-6">
          {[
            ['Does my prompt data get sent to a server?', 'No. All scanning runs entirely in your browser using JavaScript regex patterns. Your prompts never leave your device.'],
            ['What kinds of secrets can it detect?', 'API keys (OpenAI, AWS, GitHub, Stripe, Slack), passwords, bearer tokens, private keys, emails, credit card numbers, and SSNs.'],
            ['Can I use this in my CI/CD pipeline?', 'Yes — Pro subscribers get API access to integrate prompt scanning into automated workflows before any LLM call is made.'],
          ].map(([q, a]) => (
            <div key={q} className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <p className="font-semibold text-white mb-2">{q}</p>
              <p className="text-[#8b949e] text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-[#484f58] text-sm">© {new Date().getFullYear()} AI Prompt Context Leak Scanner</footer>
    </main>
  )
}
