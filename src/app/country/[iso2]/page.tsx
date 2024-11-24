'use client'

import { NotFound } from '@/components/not-found'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CountryData, Country as CountryInterface } from '@/lib/interfaces'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// interface PopulationCount {
//     year: number
//     value: number
// }

// interface CountryData {
//     country: string
//     code: string
//     iso3: string
//     populationCounts: PopulationCount[]
// }

// interface CountryDetails {
//     name: string
//     flag: string
//     iso2: string
// }

export default function CountryDetails() {
    const { iso2 } = useParams()
    const [country, setCountry] = useState<CountryInterface | null>(null)
    const [populationData, setPopulationData] = useState<CountryData | null>(null)
    const [showGraph, setShowGraph] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch country details
                const flagResponse = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
                const flagData = await flagResponse.json()

                if (flagData.error === false && Array.isArray(flagData.data)) {
                    const foundCountry = flagData.data.find((c: CountryInterface) => c.iso2 === iso2)
                    if (foundCountry) {
                        setCountry(foundCountry)

                        // Fetch population data
                        const popResponse = await fetch('https://countriesnow.space/api/v0.1/countries/population', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                country: foundCountry.name,
                            }),
                        })
                        const popData = await popResponse.json()
                        if (!popData.error) {
                            setPopulationData(popData.data)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setCountry(null)
                setPopulationData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [iso2])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (!country || !populationData) {
        return <NotFound message="Country not found or data unavailable." />
    }

    const latestPopulation = populationData.populationCounts[populationData.populationCounts.length - 1]
    const formattedPopulation = new Intl.NumberFormat().format(latestPopulation.value)

    return (
        <div className="min-h-screen bg-cream-100 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-coral-500 hover:underline mb-8 inline-block">&larr; Back to Search</Link>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Flag Section */}
                    <div className="w-full">
                        <h1 className="text-4xl font-bold text-coral-500 mb-6">{country.name}</h1>
                        <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={country.flag}
                                alt={`${country.name} flag`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Stats Section */}
                    <Card className="bg-navy-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">Population Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-gray-300">Latest Population ({latestPopulation.year})</p>
                                <p className="text-3xl font-bold">{formattedPopulation}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Population Growth</h3>
                                {showGraph && (
                                    <div className="h-[200px] mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={populationData.populationCounts.slice(-20)}>
                                                <XAxis dataKey="year" stroke="#fff" />
                                                <YAxis
                                                    stroke="#fff"
                                                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                                />
                                                <Tooltip
                                                    formatter={(value: number) => new Intl.NumberFormat().format(value)}
                                                    labelFormatter={(label) => `Year: ${label}`}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#FF6B6B"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => setShowGraph(!showGraph)}
                                    variant="secondary"
                                >
                                    {showGraph ? 'Hide Graph' : 'View Graph'}
                                </Button>
                                <Link href={`/country/${iso2}/explore-cities`} passHref>
                                    <Button variant="secondary">
                                        Explore Cities
                                    </Button>
                                </Link>
                                <Link href="/compare" passHref>
                                    <Button variant="secondary">
                                        Compare Countries
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

