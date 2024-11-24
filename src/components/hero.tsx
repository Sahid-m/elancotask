'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Country } from "@/lib/interfaces"
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
      .then(response => response.json())
      .then(data => {
        if (data.error === false && Array.isArray(data.data)) {
          setCountries(data.data)
        }
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCountries(filtered.slice(0, 5))
    } else {
      setFilteredCountries([])
    }
  }, [searchTerm, countries])

  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-bold mb-4">
        <span className="text-navy-600">Population</span> <span className="text-coral-500">Insights</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Find Population data of any city and country easily without any hassle
      </p>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex w-full">
            <Input
              type="search"
              placeholder="Enter a country..."
              className="rounded-r-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none bg-coral-500 hover:bg-coral-600">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          {filteredCountries.length > 0 && (
            <ul className="bg-white mt-2 w-full border rounded-md shadow-lg">
              {filteredCountries.map((country) => (
                <li key={country.iso2} className="border-b last:border-b-0">
                  <Link href={`/country/${country.iso2}`} className="flex items-center p-2 hover:bg-gray-100">
                    <img src={country.flag} alt={`${country.name} flag`} className="w-8 h-6 mr-2" />
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

