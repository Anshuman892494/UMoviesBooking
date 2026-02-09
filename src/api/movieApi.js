export const fetchMovies = async () => {
    try {
        const API_KEY = "108c9ac0";

        // Movies by Category: Bollywood, Hollywood, Animation, Tollywood
        const moviesByCategory = {

            Animation: [
                "The Bad Guys 2",
                "Zootopia 2",
                "Ne Zha 2",
                "Mahavatar Narsimha",
                "Despicable Me 4",
                "Demon Slayer: Kimetsu no Yaiba",
                "Moana 2",
                "The Bad Guys",
                "Raya and the Last Dragon",
                "How to Train Your Dragon: The Hidden World",
                "Zootopia",
                "Moana",
                "Frozen",
            ],
            Bollywood: [
                "Dhurandhar",
                "Chhaava",
                "Kesari Chapter 2: The Untold Story of Jallianwala Bagh",
                "Sitaare Zameen Par",
                "Raid 2",
                "Be Happy",
                "Animal",
                "Dangal",
                "3 Idiots"
            ],

            Hollywood: [
                "Dune: Part Two",
                "Oppenheimer",
                "Joker",
                "Interstellar",
            ],

            Tollywood: [
                "Kantara: A Legend Chapter-1",
                "Salaar",
                "RRR",
                "K.G.F: Chapter 2",
                "Baahubali 2: The Conclusion",
            ],

            Marvel: [
                "Deadpool & Wolverine",
                "Black Panther: Wakanda Forever",
                "Thor: Love and Thunder",
                "Doctor Strange in the Multiverse of Madness",
                "Spider-Man: No Way Home",
                "Avengers: Endgame",
                "Avengers: Infinity War",
                "Black Panther",
                "Thor: Ragnarok",
                "Spider-Man: Homecoming",
                "Avengers: Age of Ultron",
                "The Avengers",
                "Captain America: The First Avenger",
                "Thor",
                "Iron Man 2",
                "Iron Man"
            ],
            DC: [
                "Aquaman and the Lost Kingdom",
                "The Flash",
                "Black Adam",
                "The Batman",
                "The Suicide Squad",
                "Wonder Woman 1984",
                "Aquaman",
                "Justice League",
                "Man of Steel"
            ]

        };


        // Flatten all movies with category tags
        const allMovies = [];
        for (const [category, movies] of Object.entries(moviesByCategory)) {
            movies.forEach(title => {
                allMovies.push({ title, category });
            });
        }

        // Fetch all movies in parallel
        const fetchPromises = allMovies.map(async ({ title, category }) => {
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
                );
                const data = await response.json();

                if (data.Response === "True") {
                    // Extract genre from OMDb data
                    const genres = data.Genre ? data.Genre.split(', ') : [];
                    const primaryGenre = genres[0] || 'Drama';

                    return {
                        id: data.imdbID,
                        title: data.Title,
                        year: data.Year,
                        rating: data.imdbRating !== "N/A" ? data.imdbRating : "7.5",
                        language: data.Language ? data.Language.split(', ')[0] : 'English',
                        poster: data.Poster !== "N/A" ? data.Poster : `https://placehold.co/210x295?text=${encodeURIComponent(data.Title)}`,
                        plot: data.Plot !== "N/A" ? data.Plot : 'No description available.',
                        genre: primaryGenre,
                        genres: genres,
                        category: category, // Add category tag (Bollywood, Hollywood, Animation, Tollywood)
                        director: data.Director,
                        actors: data.Actors,
                        runtime: data.Runtime
                    };
                }
                return null;
            } catch (error) {
                console.error(`Error fetching ${title}:`, error);
                return null;
            }
        });

        const results = await Promise.all(fetchPromises);

        // Filter out null values (failed fetches)
        const movies = results.filter(movie => movie !== null);

        return movies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

export const fetchMovieById = async (id) => {
    try {
        const API_KEY = "108c9ac0";
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch movie');
        }

        const data = await response.json();

        if (data.Response === "True") {
            const genres = data.Genre ? data.Genre.split(', ') : [];
            const primaryGenre = genres[0] || 'Drama';

            return {
                id: data.imdbID,
                title: data.Title,
                year: data.Year,
                rating: data.imdbRating !== "N/A" ? data.imdbRating : "7.5",
                language: data.Language ? data.Language.split(', ')[0] : 'Hindi',
                poster: data.Poster !== "N/A" ? data.Poster : `https://placehold.co/300x450?text=${encodeURIComponent(data.Title)}`,
                plot: data.Plot !== "N/A" ? data.Plot : 'No description available.',
                genre: primaryGenre,
                genres: genres,
                director: data.Director,
                actors: data.Actors,
                runtime: data.Runtime,
                boxOffice: data.BoxOffice,
                awards: data.Awards
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};

// Fetch Indian States
export const fetchStates = async () => {
    try {
        const response = await fetch('https://www.india-location-hub.in/api/locations/states');

        if (!response.ok) {
            throw new Error('Failed to fetch states');
        }

        const result = await response.json();
        if (result.success && result.data && result.data.states) {
            return result.data.states; // Returns array of {name, code}
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error("Error fetching states:", error);
        return [];
    }
};



// Procedural Cinema Generator
const generateCinemasForCity = (city) => {
    // seeded random-like (simple hash) to make it consistent for the same city name in a session
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (seed % 5) + 3; // 3 to 7 cinemas per city

    const brands = ["PVR", "INOX", "Cinepolis", "Carnival", "Miraj", "Mukta A2", "Gold Cinema"];
    const suffixes = ["Grand", "Icon", "Mall", "Plaza", "Square", "City", "Point", "Heights"];

    const cinemas = [];
    for (let i = 0; i < count; i++) {
        const id = seed + i + 1000;
        const brand = brands[(seed + i) % brands.length];
        const suffix = suffixes[(seed + i * 2) % suffixes.length];

        // Basic location names generic enough
        const locationSeed = ["North", "South", "Central", "City Center", "Market", "High Street", "Mall Road"];
        const location = locationSeed[(seed + i) % locationSeed.length];

        cinemas.push({
            id: id,
            name: `${brand} ${suffix}`,
            location: location,
            city: city
        });
    }
    return cinemas;
};

export const fetchCinemas = async (city) => {
    // Simulate API delay needed for realistic feeling
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateCinemasForCity(city);
};
