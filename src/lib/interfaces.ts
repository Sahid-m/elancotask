export interface Country {
  name: string;
  flag: string;
  iso2: string;
}

export interface PopulationCount {
  year: number;
  value: number;
}

export interface CountryData {
  country: string;
  code: string;
  iso3: string;
  populationCounts: PopulationCount[];
}
