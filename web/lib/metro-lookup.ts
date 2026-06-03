// Maps city names → metro area names for hub pages and density data.
export const METRO_LOOKUP: Record<string, string> = {
  // New Jersey
  Edison: 'Edison-New Brunswick', Iselin: 'Edison-New Brunswick',
  Woodbridge: 'Edison-New Brunswick', 'New Brunswick': 'Edison-New Brunswick',
  Piscataway: 'Edison-New Brunswick', Metuchen: 'Edison-New Brunswick',
  'Jersey City': 'Jersey City-Hoboken', Hoboken: 'Jersey City-Hoboken',
  Secaucus: 'Jersey City-Hoboken', Newark: 'Newark',

  // New York
  'Jackson Heights': 'New York City', Flushing: 'New York City',
  Manhattan: 'New York City', Brooklyn: 'New York City',
  Queens: 'New York City', Bronx: 'New York City',
  'New York': 'New York City', Astoria: 'New York City',
  'Murray Hill': 'New York City',

  // California
  Fremont: 'SF Bay Area', Sunnyvale: 'SF Bay Area',
  'San Jose': 'SF Bay Area', 'Santa Clara': 'SF Bay Area',
  Milpitas: 'SF Bay Area', 'Mountain View': 'SF Bay Area',
  Cupertino: 'SF Bay Area', 'San Francisco': 'SF Bay Area',
  Oakland: 'SF Bay Area', Berkeley: 'SF Bay Area',
  Artesia: 'Los Angeles', Cerritos: 'Los Angeles',
  'Los Angeles': 'Los Angeles', 'Santa Monica': 'Los Angeles',
  Norwalk: 'Los Angeles',

  // Illinois
  Chicago: 'Chicago', Naperville: 'Chicago',
  Schaumburg: 'Chicago', Skokie: 'Chicago',
  Evanston: 'Chicago', 'Oak Brook': 'Chicago',
  'Des Plaines': 'Chicago', Lisle: 'Chicago',

  // Texas
  Houston: 'Houston', 'Sugar Land': 'Houston',
  'Missouri City': 'Houston', Katy: 'Houston',
  Stafford: 'Houston', Pearland: 'Houston',
  Dallas: 'Dallas-Fort Worth', Irving: 'Dallas-Fort Worth',
  Richardson: 'Dallas-Fort Worth', Plano: 'Dallas-Fort Worth',
  Carrollton: 'Dallas-Fort Worth', Garland: 'Dallas-Fort Worth',
  'Fort Worth': 'Dallas-Fort Worth', Arlington: 'Dallas-Fort Worth',
  Frisco: 'Dallas-Fort Worth', Allen: 'Dallas-Fort Worth',

  // Georgia
  Atlanta: 'Atlanta', Decatur: 'Atlanta',
  Norcross: 'Atlanta', Duluth: 'Atlanta',
  Alpharetta: 'Atlanta', 'Sandy Springs': 'Atlanta',
  Suwanee: 'Atlanta', 'Johns Creek': 'Atlanta',

  // Virginia
  Herndon: 'DC-Northern Virginia', Fairfax: 'DC-Northern Virginia',
  Chantilly: 'DC-Northern Virginia', Reston: 'DC-Northern Virginia',
  Sterling: 'DC-Northern Virginia', Centreville: 'DC-Northern Virginia',
  Washington: 'DC-Northern Virginia', Ashburn: 'DC-Northern Virginia',

  // Washington
  Bellevue: 'Seattle-Bellevue', Redmond: 'Seattle-Bellevue',
  Bothell: 'Seattle-Bellevue', Seattle: 'Seattle-Bellevue',
  Kirkland: 'Seattle-Bellevue', Sammamish: 'Seattle-Bellevue',

  // Massachusetts
  Boston: 'Boston', Cambridge: 'Boston',
  Waltham: 'Boston', Somerville: 'Boston',
  Framingham: 'Boston', Watertown: 'Boston',

  // North Carolina
  Charlotte: 'Charlotte', 'Cary': 'Raleigh-Durham',
  Raleigh: 'Raleigh-Durham', Durham: 'Raleigh-Durham',
  'Chapel Hill': 'Raleigh-Durham', Morrisville: 'Raleigh-Durham',

  // Ohio
  Columbus: 'Columbus', Dublin: 'Columbus',
  Westerville: 'Columbus', Hilliard: 'Columbus',
  Cleveland: 'Cleveland', Cincinnati: 'Cincinnati',

  // Michigan
  Troy: 'Detroit Metro', 'Rochester Hills': 'Detroit Metro',
  'Ann Arbor': 'Ann Arbor', 'Sterling Heights': 'Detroit Metro',
  Detroit: 'Detroit Metro', Novi: 'Detroit Metro',

  // Pennsylvania
  Philadelphia: 'Philadelphia', Horsham: 'Philadelphia',
  Lansdale: 'Philadelphia', 'Cherry Hill': 'Philadelphia',
  'King of Prussia': 'Philadelphia',

  // Arizona
  Phoenix: 'Phoenix', Tempe: 'Phoenix',
  Chandler: 'Phoenix', Scottsdale: 'Phoenix',
  Mesa: 'Phoenix', Gilbert: 'Phoenix',

  // Florida
  Miami: 'Miami', Orlando: 'Orlando',
  Tampa: 'Tampa', Jacksonville: 'Jacksonville',
  'Boca Raton': 'Miami', 'Fort Lauderdale': 'Miami',
};

export function getMetro(city: string): string | undefined {
  return METRO_LOOKUP[city];
}
