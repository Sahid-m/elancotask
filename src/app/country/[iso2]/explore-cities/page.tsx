'use client'

import { NotFound } from '@/components/not-found'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PopulationCount {
    year: string
    value: string
    sex: string
    reliabilty: string
}

interface City {
    city: string
    country: string
    populationCounts: PopulationCount[]
}

export default function ExploreCities() {
    const { iso2 } = useParams()
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(true)
    const [country, setCountry] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First, fetch the country name using the iso2 code
                const flagResponse = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
                const flagData = await flagResponse.json()

                if (flagData.error === false && Array.isArray(flagData.data)) {
                    const foundCountry = flagData.data.find((c: { iso2: string }) => c.iso2 === iso2)
                    if (foundCountry) {
                        setCountry(foundCountry.name)

                        // Then, fetch the cities data
                        const citiesResponse = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                order: "asc",
                                orderBy: "name",
                                country: foundCountry.name
                            }),
                        })
                        const citiesData = await citiesResponse.json()
                        if (!citiesData.data || citiesData.data.length === 0) {
                            setError('No cities found for this country.')
                        } else {
                            setCities(citiesData.data)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setError('An error occurred while fetching data.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [iso2])

    const sortedCities = [...cities].sort((a, b) => {
        if (sortConfig.key === 'name') {
            return sortConfig.direction === 'asc' ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city)
        } else {
            const aValue = parseInt(a.populationCounts[0]?.value || '0')
            const bValue = parseInt(b.populationCounts[0]?.value || '0')
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
    })

    const filteredCities = sortedCities.filter(city =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSort = (key: string) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
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
                <Link href={`/country/${iso2}`} className="text-coral-500 hover:underline mb-8 inline-block">&larr; Back to Country</Link>

                <Card className="bg-white shadow-lg">
                    <CardHeader className="bg-navy-700 text-white">
                        <CardTitle className="text-2xl">Explore Cities in {country}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="mb-6 flex gap-4">
                            <Input
                                type="text"
                                placeholder="Search cities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button variant="secondary" className="flex items-center gap-2">
                                <Search size={18} />
                                Search
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                                            City Name
                                            {sortConfig.key === 'name' && (
                                                sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
                                            )}
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('population')}>
                                            Population
                                            {sortConfig.key === 'population' && (
                                                sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
                                            )}
                                        </TableHead>
                                        <TableHead>Year</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCities.map((city, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{city.city}</TableCell>
                                            <TableCell>{parseInt(city.populationCounts[0]?.value || '0').toLocaleString()}</TableCell>
                                            <TableCell>{city.populationCounts[0]?.year}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

