import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Prompt Context Leak Scanner',
  description: 'Scan AI prompts for accidentally included API keys, passwords, PII, and other sensitive data before execution.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.microtool.dev/script.js" data-website-id="e0b4907c-351f-4d12-acd5-df063950d476"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
