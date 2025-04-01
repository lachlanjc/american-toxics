export interface Site {
  id: string;
  name: string;
  address: string;
  img?: string;
  lat: number;
  lng: number;
}

export const SITES: Site[] = [
  {
    id: "43360032",
    name: "Intersil / Siemens",
    address: "10910 N Tantau Ave, Cupertino, CA 95014",
    img: "/plainsite/CAD041472341.jpg",
    lat: 37.33097,
    lng: -122.008249,
  },
  {
    id: "0900956",
    name: "Westinghouse",
    address: "???",
    img: "/plainsite/CAD001864081.jpg",
    lat: 37.378732817235,
    lng: -122.026974937172,
  },
  {
    id: "43380014",
    name: "Monolithic Memories",
    address: "1165 E Arques Ave, Sunnyvale, CA 94085",
    lat: 37.380948,
    lng: -121.9980238,
  },
  {
    id: "43360095",
    name: "Advanced Micro Devices",
    address: "915 Deguigne Dr, Sunnyvale, CA 94085",
    img: "/plainsite/CAD041472341.jpg",
    lat: 37.3864805,
    lng: -122.0075037,
  },
  {
    id: "43350080",
    name: "Intel Corporation",
    address: "365 E Middlefield Rd, Mountain View, CA 94043",
    lat: 37.3963887,
    lng: -122.057764,
  },
  {
    id: "43360081",
    name: "RAYTHEON CORPORATION",
    address: "350 ELLIS STREET, MOUNTAIN VIEW, CA 94043",
    // status: 'State Response or NPL',
    // date: '1992-05-12 00:00:00',
    // responsibleParty: 'Responsible Party',
    lat: 37.3970434,
    lng: -122.0540132,
  },
  {
    id: "43360083",
    name: "CTS Printex",
    address: "PLYMOUTH & COLONY STS	MOUNTAIN VIEW	CA	94043",
    lat: 37.4161254563787,
    lng: -122.088420662305,
  },
  {
    id: "43360092",
    name: "Advanced Micro Devices, Inc.",
    address: "901 Thompson Pl, Sunnyvale, CA 94085",
    lat: 37.3825044,
    lng: -122.0090312,
  },
  {
    id: "43350082",
    name: "HEWLETT-PACKARD",
    address: "620-640 PAGE MILL ROAD	PALO ALTO	CA	94304	SANTA CLARA",
    lat: 37.42149,
    lng: -122.144744,
  },
  {
    id: "43350085",
    name: "INTEL CORPORATION",
    address: "2880 NORTHWESTERN PKWY	SANTA CLARA	CA	95051	SANTA CLARA",
    lat: 37.3736553325008,
    lng: -121.973043878134,
  },
  {
    id: "43350086",
    name: "MICRO STORAGE/INTEL MAGNETICS",
    address: "3000 OAKMEAD VILLAGE DRIVE	SANTA CLARA	CA	95051	SANTA CLARA",
    lat: 37.3757893,
    lng: -121.9808469,
  },
  {
    id: "43360084",
    name: "SPECTRA PHYSICS, INC.",
    address: "1250 W MIDDLEFIELD RD	MOUNTAIN VIEW	CA	94043	SANTA CLARA",
    lat: 37.4079491,
    lng: -122.080276,
  },
  {
    id: "43990002",
    name: "SYNERTEK, INC. (BUILDING 1)",
    address: "3050 CORONADO DR	SANTA CLARA	CA	95054	SANTA CLARA",
    lat: 37.3771301472726,
    lng: -121.973092707249,
  },
  {
    id: "43360029",
    name: "NATIONAL SEMICONDUCTOR CORP",
    address: "2900 SEMICONDUCTOR DR	SANTA CLARA	CA	95051	SANTA CLARA",
    lat: 37.3765544509515,
    lng: -122.000322918552,
  },
];
