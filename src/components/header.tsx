import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-coral-500">INSIPOP</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-navy-600 hover:text-coral-500">Home</Link></li>
            <li><Link href="/explore" className="text-navy-600 hover:text-coral-500">Explore</Link></li>
            <li><Link href="/compare" className="text-navy-600 hover:text-coral-500">Compare</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

