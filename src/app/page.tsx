import Features from '@/components/features'
import Header from '@/components/header'
import Hero from '@/components/hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <Features />
      </main>
    </div>
  )
}

