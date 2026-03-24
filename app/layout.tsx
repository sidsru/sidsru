import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dev Portfolio | Unreal Engine Client Programmer',
  description: 'Unreal Engine C++ Client Programmer Portfolio — GAS, Motion Matching, Character System, Optimization',
  keywords: ['Unreal Engine', 'C++', 'GAS', 'Gameplay Ability System', 'Motion Matching', 'Game Developer', 'Client Programmer'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}