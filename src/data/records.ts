import { hashString, luminance, mulberry32, slugify } from "../lib/random"

export type SpineVariant = "text" | "label-only" | "blank"

export type RecordItem = {
	id: string
	artist: string
	title: string
	year: number
	label: string
	genre: string
	/** Vinyl colour. Black unless the pressing is coloured. */
	disc: string
	/** Three-colour cover palette: base, accent, paper. */
	palette: [string, string, string]
	/** Cover composition variant, 0-4. */
	art: number
	/** Sleeve thickness in metres. */
	thickness: number
	/** Idle lean, radians. */
	lean: number
	/** Depth offset in metres: records never sit perfectly flush. */
	depth: number
	spinePaper: string
	spineInk: string
	spineVariant: SpineVariant
}

/** [artist, title, year, label, genre, disc colour?] */
type Raw = [string, string, number, string, string, string?]

const RAW: Raw[] = [
	// ——— jazz ———
	["Miles Davis", "Kind of Blue", 1959, "Columbia", "Jazz"],
	["John Coltrane", "A Love Supreme", 1965, "Impulse!", "Jazz"],
	["John Coltrane", "Giant Steps", 1960, "Atlantic", "Jazz"],
	["The Dave Brubeck Quartet", "Time Out", 1959, "Columbia", "Jazz"],
	["Charles Mingus", "Mingus Ah Um", 1959, "Columbia", "Jazz"],
	["Herbie Hancock", "Maiden Voyage", 1965, "Blue Note", "Jazz"],
	["Herbie Hancock", "Head Hunters", 1973, "Columbia", "Jazz"],
	["Miles Davis", "Bitches Brew", 1970, "Columbia", "Jazz"],
	["Miles Davis", "In a Silent Way", 1969, "Columbia", "Jazz"],
	["Miles Davis", "Sketches of Spain", 1960, "Columbia", "Jazz"],
	["Cannonball Adderley", "Somethin' Else", 1958, "Blue Note", "Jazz"],
	["Art Blakey & The Jazz Messengers", "Moanin'", 1959, "Blue Note", "Jazz"],
	["Ornette Coleman", "The Shape of Jazz to Come", 1959, "Atlantic", "Jazz"],
	["Wayne Shorter", "Speak No Evil", 1966, "Blue Note", "Jazz"],
	["Bill Evans Trio", "Sunday at the Village Vanguard", 1961, "Riverside", "Jazz"],
	["Alice Coltrane", "Journey in Satchidananda", 1971, "Impulse!", "Jazz", "#e0602f"],
	["Pharoah Sanders", "Karma", 1969, "Impulse!", "Jazz", "#d9a441"],
	["Charles Mingus", "The Black Saint and the Sinner Lady", 1963, "Impulse!", "Jazz"],
	["Stan Getz & João Gilberto", "Getz/Gilberto", 1964, "Verve", "Jazz"],
	["Keith Jarrett", "The Köln Concert", 1975, "ECM", "Jazz"],
	["Bill Evans", "Waltz for Debby", 1961, "Riverside", "Jazz"],
	["Eric Dolphy", "Out to Lunch!", 1964, "Blue Note", "Jazz"],
	["Lee Morgan", "The Sidewinder", 1964, "Blue Note", "Jazz"],
	["Hank Mobley", "Soul Station", 1960, "Blue Note", "Jazz"],
	["Grant Green", "Idle Moments", 1965, "Blue Note", "Jazz"],
	["Freddie Hubbard", "Red Clay", 1970, "CTI", "Jazz"],
	["McCoy Tyner", "The Real McCoy", 1967, "Blue Note", "Jazz"],
	["Sun Ra", "Lanquidity", 1978, "Philly Jazz", "Jazz", "#7d5fa8"],
	["Herbie Hancock", "Empyrean Isles", 1964, "Blue Note", "Jazz"],
	["Nina Simone", "Pastel Blues", 1965, "Philips", "Jazz"],

	// ——— soul, funk, r&b ———
	["Stevie Wonder", "Songs in the Key of Life", 1976, "Tamla", "Soul"],
	["Stevie Wonder", "Innervisions", 1973, "Tamla", "Soul"],
	["Stevie Wonder", "Talking Book", 1972, "Tamla", "Soul"],
	["Marvin Gaye", "What's Going On", 1971, "Tamla", "Soul"],
	["Marvin Gaye", "Let's Get It On", 1973, "Tamla", "Soul"],
	["Sly & the Family Stone", "There's a Riot Goin' On", 1971, "Epic", "Funk"],
	["Parliament", "Mothership Connection", 1975, "Casablanca", "Funk", "#8a5cc4"],
	["Curtis Mayfield", "Super Fly", 1972, "Curtom", "Soul"],
	["Curtis Mayfield", "Curtis", 1970, "Curtom", "Soul"],
	["Isaac Hayes", "Hot Buttered Soul", 1969, "Enterprise", "Soul"],
	["Aretha Franklin", "I Never Loved a Man the Way I Love You", 1967, "Atlantic", "Soul"],
	["Al Green", "Call Me", 1973, "Hi", "Soul"],
	["Bill Withers", "Still Bill", 1972, "Sussex", "Soul"],
	["Earth, Wind & Fire", "That's the Way of the World", 1975, "Columbia", "Funk"],
	["James Brown", "The Payback", 1973, "Polydor", "Funk"],
	["The Meters", "Rejuvenation", 1974, "Reprise", "Funk"],
	["Fela Kuti", "Zombie", 1976, "Coconut", "Afrobeat"],
	["Betty Davis", "They Say I'm Different", 1974, "Just Sunshine", "Funk", "#c0417a"],
	["Shuggie Otis", "Inspiration Information", 1974, "Epic", "Soul"],
	["Donny Hathaway", "Extension of a Man", 1973, "Atco", "Soul"],
	["The Isley Brothers", "3+3", 1973, "T-Neck", "Soul"],
	["Minnie Riperton", "Come to My Garden", 1970, "GRT", "Soul"],
	["Roberta Flack", "First Take", 1969, "Atlantic", "Soul"],
	["Sade", "Diamond Life", 1984, "Epic", "Soul"],
	["Prince", "Purple Rain", 1984, "Warner Bros.", "Pop", "#6a3fa0"],
	["Michael Jackson", "Off the Wall", 1979, "Epic", "Pop"],
	["Marvin Gaye", "I Want You", 1976, "Tamla", "Soul"],
	["D'Angelo", "Voodoo", 2000, "Virgin", "R&B"],
	["Erykah Badu", "Mama's Gun", 2000, "Motown", "R&B"],
	["Solange", "A Seat at the Table", 2016, "Saint", "R&B"],

	// ——— rock, folk ———
	["The Beatles", "Abbey Road", 1969, "Apple", "Rock"],
	["The Beatles", "Revolver", 1966, "Parlophone", "Rock"],
	["The Beach Boys", "Pet Sounds", 1966, "Capitol", "Pop"],
	["The Rolling Stones", "Let It Bleed", 1969, "Decca", "Rock"],
	["The Rolling Stones", "Sticky Fingers", 1971, "Rolling Stones", "Rock"],
	["David Bowie", "The Rise and Fall of Ziggy Stardust", 1972, "RCA", "Rock"],
	["David Bowie", "Low", 1977, "RCA", "Rock"],
	["David Bowie", "\"Heroes\"", 1977, "RCA", "Rock"],
	["Pink Floyd", "The Dark Side of the Moon", 1973, "Harvest", "Rock"],
	["Pink Floyd", "Wish You Were Here", 1975, "Harvest", "Rock"],
	["Led Zeppelin", "Led Zeppelin IV", 1971, "Atlantic", "Rock"],
	["Led Zeppelin", "Physical Graffiti", 1975, "Swan Song", "Rock"],
	["The Who", "Who's Next", 1971, "Track", "Rock"],
	["Fleetwood Mac", "Rumours", 1977, "Warner Bros.", "Rock"],
	["Bob Dylan", "Blood on the Tracks", 1975, "Columbia", "Folk"],
	["Joni Mitchell", "Blue", 1971, "Reprise", "Folk"],
	["Nick Drake", "Pink Moon", 1972, "Island", "Folk"],
	["Neil Young", "Harvest", 1972, "Reprise", "Folk"],
	["The Velvet Underground", "The Velvet Underground & Nico", 1967, "Verve", "Rock"],
	["Love", "Forever Changes", 1967, "Elektra", "Rock"],
	["The Kinks", "The Village Green Preservation Society", 1968, "Pye", "Rock"],
	["The Band", "The Band", 1969, "Capitol", "Rock"],
	["Creedence Clearwater Revival", "Cosmo's Factory", 1970, "Fantasy", "Rock"],
	["Jimi Hendrix", "Electric Ladyland", 1968, "Track", "Rock"],
	["The Doors", "The Doors", 1967, "Elektra", "Rock"],
	["Janis Joplin", "Pearl", 1971, "Columbia", "Rock"],
	["Television", "Marquee Moon", 1977, "Elektra", "Post-Punk"],
	["Patti Smith", "Horses", 1975, "Arista", "Punk"],
	["Ramones", "Ramones", 1976, "Sire", "Punk"],
	["Blondie", "Parallel Lines", 1978, "Chrysalis", "Punk"],
	["Kate Bush", "Hounds of Love", 1985, "EMI", "Pop"],
	["Talk Talk", "Spirit of Eden", 1988, "Parlophone", "Post-Rock"],
	["Tom Waits", "Rain Dogs", 1985, "Island", "Rock"],
	["Leonard Cohen", "Songs of Leonard Cohen", 1967, "Columbia", "Folk"],
	["Brian Eno", "Another Green World", 1975, "Island", "Ambient"],
	["Brian Eno", "Ambient 1: Music for Airports", 1978, "EG", "Ambient"],
	["Kraftwerk", "Trans-Europe Express", 1977, "Kling Klang", "Electronic"],
	["Kraftwerk", "The Man-Machine", 1978, "Kling Klang", "Electronic"],
	["Arthur Russell", "World of Echo", 1986, "Upside Down", "Ambient"],
	["The Clash", "London Calling", 1979, "CBS", "Punk"],

	// ——— post-punk, indie ———
	["Sex Pistols", "Never Mind the Bollocks", 1977, "Virgin", "Punk"],
	["Joy Division", "Unknown Pleasures", 1979, "Factory", "Post-Punk"],
	["Joy Division", "Closer", 1980, "Factory", "Post-Punk"],
	["The Cure", "Disintegration", 1989, "Fiction", "Post-Punk", "#4a5d8a"],
	["The Cure", "Pornography", 1982, "Fiction", "Post-Punk"],
	["Depeche Mode", "Violator", 1990, "Mute", "Electronic"],
	["The Smiths", "The Queen Is Dead", 1986, "Rough Trade", "Indie"],
	["Talking Heads", "Remain in Light", 1980, "Sire", "Post-Punk"],
	["Talking Heads", "Speaking in Tongues", 1983, "Sire", "Post-Punk"],
	["New Order", "Power, Corruption & Lies", 1983, "Factory", "Post-Punk"],
	["New Order", "Technique", 1989, "Factory", "Post-Punk"],
	["Siouxsie and the Banshees", "Juju", 1981, "Polydor", "Post-Punk"],
	["Echo & the Bunnymen", "Ocean Rain", 1984, "Korova", "Post-Punk"],
	["Cocteau Twins", "Heaven or Las Vegas", 1990, "4AD", "Dream Pop"],
	["Radiohead", "OK Computer", 1997, "Parlophone", "Alternative"],
	["Radiohead", "Kid A", 2000, "Parlophone", "Alternative", "#2f6f6a"],
	["Radiohead", "In Rainbows", 2007, "XL", "Alternative", "#e6e1d6"],
	["My Bloody Valentine", "Loveless", 1991, "Creation", "Shoegaze", "#d94a6a"],
	["Slowdive", "Souvlaki", 1993, "Creation", "Shoegaze", "#c9b7e0"],
	["Jeff Buckley", "Grace", 1994, "Columbia", "Alternative"],
	["Portishead", "Dummy", 1994, "Go! Beat", "Trip Hop"],
	["Massive Attack", "Mezzanine", 1998, "Virgin", "Trip Hop"],
	["Primal Scream", "Screamadelica", 1991, "Creation", "Alternative"],
	["Oasis", "Definitely Maybe", 1994, "Creation", "Britpop"],
	["Blur", "Parklife", 1994, "Food", "Britpop"],
	["The Stone Roses", "The Stone Roses", 1989, "Silvertone", "Indie"],
	["Pulp", "Different Class", 1995, "Island", "Britpop"],
	["Björk", "Homogenic", 1997, "One Little Independent", "Electronic", "#3f5d8c"],
	["Björk", "Vespertine", 2001, "One Little Independent", "Electronic", "#efe6da"],

	// ——— electronic ———
	["Aphex Twin", "Selected Ambient Works 85-92", 1992, "R&S", "Electronic"],
	["Boards of Canada", "Music Has the Right to Children", 1998, "Warp", "Electronic"],
	["Burial", "Untrue", 2007, "Hyperdub", "Electronic", "#b8b2a8"],
	["DJ Shadow", "Endtroducing.....", 1996, "Mo' Wax", "Electronic"],
	["Daft Punk", "Discovery", 2001, "Virgin", "Electronic"],
	["Daft Punk", "Random Access Memories", 2013, "Columbia", "Electronic"],
	["Jamie xx", "In Colour", 2015, "Young Turks", "Electronic"],
	["Flying Lotus", "Cosmogramma", 2010, "Warp", "Electronic", "#e08a2f"],
	["Four Tet", "Rounds", 2003, "Domino", "Electronic"],
	["Jon Hopkins", "Immunity", 2013, "Domino", "Electronic"],
	["Burial", "Burial", 2006, "Hyperdub", "Electronic"],

	// ——— hip hop ———
	["Nas", "Illmatic", 1994, "Columbia", "Hip Hop"],
	["Wu-Tang Clan", "Enter the Wu-Tang (36 Chambers)", 1993, "Loud", "Hip Hop"],
	["A Tribe Called Quest", "The Low End Theory", 1991, "Jive", "Hip Hop", "#4a7fc1"],
	["Madvillain", "Madvillainy", 2004, "Stones Throw", "Hip Hop"],
	["Kendrick Lamar", "To Pimp a Butterfly", 2015, "Top Dawg", "Hip Hop"],
	["Kendrick Lamar", "good kid, m.A.A.d city", 2012, "Top Dawg", "Hip Hop"],
	["Lauryn Hill", "The Miseducation of Lauryn Hill", 1998, "Ruffhouse", "Hip Hop"],
	["OutKast", "Aquemini", 1998, "LaFace", "Hip Hop"],
	["Mobb Deep", "The Infamous", 1995, "Loud", "Hip Hop"],
	["J Dilla", "Donuts", 2006, "Stones Throw", "Hip Hop", "#d9c9a3"],
	["MF DOOM", "MM..FOOD", 2004, "Rhymesayers", "Hip Hop"],
	["Frank Ocean", "Blonde", 2016, "Boys Don't Cry", "R&B", "#efe9dc"],
]

/** Curated three-colour cover schemes. Randomised per record so nothing clashes. */
const PALETTES: [string, string, string][] = [
	["#0f1b2d", "#2c5f8a", "#e8dcc4"],
	["#141312", "#c8452f", "#efe6d3"],
	["#0b3d2e", "#2e8b6f", "#e6d8a8"],
	["#2b1b3d", "#7b4fa8", "#efc9d4"],
	["#3a2a1a", "#c98a3d", "#f5e6c8"],
	["#101010", "#efe9db", "#8d887d"],
	["#12343b", "#5fb0b7", "#f0e6d2"],
	["#4a0e1e", "#b3203b", "#f4d35e"],
	["#1d2b1a", "#7a9e3a", "#efe9d9"],
	["#241f2b", "#d96c2c", "#f2d0a4"],
	["#0a2540", "#4f9cf9", "#e8f0fe"],
	["#2a1a12", "#8c4a2f", "#e8c9a0"],
	["#1a1a24", "#d8b24a", "#f0ebdc"],
	["#3d1f2a", "#a8455e", "#efe2d2"],
]

const PAPER_LIGHT = ["#ddd2bd", "#d3c6ae", "#c8bca3", "#bdb097", "#d7cdb8", "#e0d7c5"]
const PAPER_DARK = ["#1a1917", "#221e1b", "#2a2521", "#16181a"]
const PAPER_COLOUR = ["#7e1f2b", "#16324f", "#2f4a31", "#a0712a", "#4f2743", "#7a3a1c", "#1d4a4a"]

export const RECORDS: RecordItem[] = RAW.map((entry) => {
	const [artist, title, year, label, genre, disc] = entry
	const id = slugify(`${artist} ${title}`)
	const rand = mulberry32(hashString(id))

	const roll = rand()
	const papers = roll < 0.16 ? PAPER_DARK : roll < 0.28 ? PAPER_COLOUR : PAPER_LIGHT
	const spinePaper = papers[Math.floor(rand() * papers.length)]!
	const spineInk = luminance(spinePaper) > 0.45 ? "#201d1a" : "#f0e9dc"

	const gatefold = rand() < 0.07
	const thickness = gatefold ? 0.0061 + rand() * 0.0014 : 0.0033 + rand() * 0.0021

	const variantRoll = rand()
	const spineVariant: SpineVariant =
		variantRoll < 0.09 ? "blank" : variantRoll < 0.18 ? "label-only" : "text"

	return {
		id,
		artist,
		title,
		year,
		label,
		genre,
		disc: disc ?? "#0d0d10",
		palette: PALETTES[Math.floor(rand() * PALETTES.length)]!,
		art: Math.floor(rand() * 5),
		thickness,
		lean: (rand() - 0.5) * 0.012,
		depth: (rand() - 0.5) * 0.003,
		spinePaper,
		spineInk,
		spineVariant,
	}
})
