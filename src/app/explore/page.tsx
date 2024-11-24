'use client'

import { NotFound } from '@/components/not-found'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Country } from '@/lib/interfaces'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ExplorePage() {
    const [countries, setCountries] = useState<Country[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
                const data = await response.json()
                if (data.error === false && Array.isArray(data.data)) {
                    setCountries(data.data)
                } else {
                    setError('Failed to fetch countries')
                }
            } catch (error) {
                console.error('Error fetching countries:', error)
                setError('An error occurred while fetching countries')
            } finally {
                setLoading(false)
            }
        }

        fetchCountries()
    }, [])

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return <NotFound message={error} />
    }

    return (
        <div className="min-h-screen bg-cream-100 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-coral-500 hover:underline mb-8 inline-block">&larr; Back to Home</Link>

                <h1 className="text-3xl font-bold text-navy-600 mb-6">Explore Countries</h1>

                <div className="mb-6 flex items-center max-w-md">
                    <Search className="text-gray-400 mr-2" />
                    <Input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCountries.map((country) => (
                        <Link href={`/country/${country.iso2}`} key={country.iso2}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-4">
                                    <div className="aspect-[3/2] relative mb-2">
                                        <img
                                            src={country.flag}
                                            alt={`Flag of ${country.name}`}
                                            className="object-cover w-full h-full rounded"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold text-navy-600 truncate">{country.name}</h2>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {filteredCountries.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No countries found matching your search.</p>
                )}
            </div>
        </div>
    )
}

