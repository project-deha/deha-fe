import Link from 'next/link'

export function LogoDeha() {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">DEHA</span>
    </Link>
  )
}

