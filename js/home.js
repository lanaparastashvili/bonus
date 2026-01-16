const logo = document.querySelector('.logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        window.location.href = 'movie.html';
    });
}
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function loadMovieData() {
    try {
        const response = await fetch('../data/movie.json');
        const data = await response.json();
        
        const allMovies = [
            ...data.sliderMovies,
            ...data.continueMovies.map((movie, index) => ({
                ...movie,
                id: movie.id || (data.sliderMovies.length + index + 1)
            }))
        ];
        
        return allMovies;
    } catch (error) {
        console.error('Error loading movie data:', error);
        return [];
    }
}

function findMovieById(movies, movieId) {
    return movies.find(movie => movie.id === parseInt(movieId));
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    
    if (!movie) {
        detailsContainer.innerHTML = `
            <div class="loading">
                <p>ფილმი ვერ მოიძებნა</p>
                <a href="movie.html" class="booking-button">უკან დაბრუნება</a>
            </div>
        `;
        return;
    }

    const genreDisplay = Array.isArray(movie.genre) 
        ? movie.genre.join(', ')
        : movie.genre;

    detailsContainer.innerHTML = `
        <div class="movie-poster-section" style="background-image: url('${movie.image}')"></div>
        
        <div class="movie-info-section">
            <h1 class="movie-title-main">${movie.title}</h1>
            <p class="movie-title-english">${movie.title} (${movie.year || '2024'})</p>
            
            ${movie.rating ? `
            <div class="info-row">
                <div class="info-label">რეიტინგი:</div>
                <div class="info-content rating-display">⭐ ${movie.rating}/10</div>
            </div>
            ` : ''}
            
            ${genreDisplay ? `
            <div class="info-row">
                <div class="info-label">ჟანრი:</div>
                <div class="info-content genre-tags-inline">
                    <span class="genre-tag-inline">${genreDisplay}</span>
                </div>
            </div>
            ` : ''}
            
            ${movie.description ? `
            <div class="info-row">
                <div class="info-label">შინაარსი:</div>
                <div class="info-content">${movie.description}</div>
            </div>
            ` : ''}
            
            <a href="seats.html?id=${movie.id}" class="booking-button">ბილეთის შეძენა</a>
        </div>
    `;
}

async function init() {
    const movieId = getMovieIdFromUrl();
    
    if (!movieId) {
        document.getElementById('movie-details').innerHTML = `
            <div class="loading">
                <p>ფილმი არ არის არჩეული</p>
                <a href="movie.html" class="booking-button">ფილმების ნახვა</a>
            </div>
        `;
        return;
    }

    document.getElementById('movie-details').innerHTML = `
        <div class="loading">იტვირთება...</div>
    `;

    const movies = await loadMovieData();
    const movie = findMovieById(movies, movieId);
    displayMovieDetails(movie);
}

document.addEventListener('DOMContentLoaded', init);