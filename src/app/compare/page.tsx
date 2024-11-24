/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { NotFound } from '@/components/not-found'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Country {
    name: string
    iso2: string
}

interface PopulationData {
    country: string
    populationCounts: { year: number; value: number }[]
}

export default function ComparePage() {
    const [countries, setCountries] = useState<Country[]>([])
    const [selectedCountries, setSelectedCountries] = useState<string[]>([])
    const [populationData, setPopulationData] = useState<PopulationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showComparison, setShowComparison] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [sheetOpen, setSheetOpen] = useState(false)

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
                const data = await response.json()
                if (data.error === false && Array.isArray(data.data)) {
                    setCountries(data.data.map((country: any) => ({ name: country.name, iso2: country.iso2 })))
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

    const handleCountrySelect = (countryName: string) => {
        setSelectedCountries(prev => {
            if (prev.includes(countryName)) {
                return prev.filter(c => c !== countryName)
            } else if (prev.length < 2) {
                return [...prev, countryName]
            }
            return prev
        })
    }

    const fetchPopulationData = async () => {
        setLoading(true)
        setError(null)
        try {
            const dataPromises = selectedCountries.map(async (country) => {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/population', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country }),
                })
                const data = await response.json()
                if (data.error) throw new Error(`Failed to fetch data for ${country}`)
                return {
                    country,
                    populationCounts: data.data.populationCounts
                        .map((count: any) => ({
                            year: parseInt(count.year),
                            value: parseInt(count.value),
                        }))
                        .sort((a: any, b: any) => a.year - b.year), // Sort by year
                }
            })

            const results = await Promise.all(dataPromises)
            setPopulationData(results)
            console.log(populationData);
            console.log(results);
            setShowComparison(true)
            setSheetOpen(false)
        } catch (error) {
            console.error('Error fetching population data:', error)
            setError('Failed to fetch population data for selected countries')
        } finally {
            setLoading(false)
        }
    }

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading && countries.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (error && !showComparison) {
        return <NotFound message={error} />
    }

    const chartData = populationData[0]?.populationCounts.map((item) => {

        console.log(populationData);
        const matchingYearData = populationData[1]?.populationCounts.find(
            (count) => count.year === item.year
        );

        console.log({
            year: item.year,
            [populationData[0].country]: item.value,
            [populationData[1].country]: matchingYearData?.value, // Ensure null is explicitly handled
        })

        return {
            year: item.year,
            [populationData[0].country]: item.value,
            [populationData[1].country]: matchingYearData?.value || null, // Ensure null is explicitly handled
        };
    });


    return (
        <div className="min-h-screen bg-cream-100 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-coral-500 hover:underline mb-8 inline-block">&larr; Back to Home</Link>

                <Card className="bg-white shadow-lg">
                    <CardHeader className="bg-navy-700 text-white">
                        <CardTitle className="text-2xl">Compare Countries</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!showComparison ? (
                            <div className="space-y-4">
                                <p className="text-lg">Select two countries to compare their population data.</p>
                                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="secondary">Select Countries</Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] sm:w-[540px]">
                                        <SheetHeader>
                                            <SheetTitle>Select Countries</SheetTitle>
                                            <SheetDescription>
                                                Choose two countries to compare. Click on a country to select or deselect it.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-4">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Search className="text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search countries..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                                {filteredCountries.map((country) => (
                                                    <label key={country.iso2} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={selectedCountries.includes(country.name)}
                                                            onCheckedChange={() => handleCountrySelect(country.name)}
                                                        />
                                                        <span>{country.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <div>
                                    <h3 className="font-semibold mb-2">Selected Countries:</h3>
                                    <ul className="list-disc list-inside">
                                        {selectedCountries.map(country => (
                                            <li key={country}>{country}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    onClick={fetchPopulationData}
                                    disabled={selectedCountries.length !== 2}
                                    variant="secondary"
                                >
                                    Compare Selected Countries
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-center">
                                    {populationData[0]?.country} vs {populationData[1]?.country}
                                </h2>
                                <p className="text-center text-gray-600">
                                    Population comparison from {populationData[0]?.populationCounts[0]?.year} to {populationData[0]?.populationCounts[populationData[0]?.populationCounts.length - 1]?.year}
                                </p>
                                <div className="h-[400px] mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={chartData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" />
                                            <YAxis
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                            />
                                            <Tooltip
                                                formatter={(value: number) => `${(value / 1000).toFixed(1)}k`}
                                                labelFormatter={(label) => `Year: ${label}`}
                                            />
                                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                            <Legend />
                                            <Line type="monotone" dataKey={populationData[0]?.country} stroke="#8884d8" activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey={populationData[1]?.country} stroke="#82ca9d" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center">
                                    <Button onClick={() => setShowComparison(false)} variant="secondary">
                                        Compare Other Countries
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

