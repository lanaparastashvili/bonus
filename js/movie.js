let sliderMovies = [];
let continueMovies = [];
let currentIndex = 0;


const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const continueGrid = document.getElementById('continueGrid');
const backgroundOverlay = document.getElementById('backgroundOverlay');
const themeToggle = document.getElementById('themeToggle');


fetch('../data/movie.json')
  .then(res => res.json())
  .then(data => {
      sliderMovies = data.sliderMovies;
      continueMovies = data.continueMovies;
      renderAll();
  })
  .catch(err => console.error('JSON load error:', err));

function createMovieSlide(movie, index) {
    const slide = document.createElement('div');
    slide.className = 'movie-slide';
    slide.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" class="movie-poster-img">
        <div class="movie-overlay">
            <h2 class="movie-title">${movie.title}</h2>
            <div class="movie-info">
                <div class="movie-rating">⭐ ${movie.rating}</div>
                <span>${movie.year || ''}</span>
                <span>${movie.genre || ''}</span>
            </div>
            <button class="book-btn" onclick="bookMovie('${movie.title}')">Book Now</button>
        </div>
    `;
    slide.dataset.index = index;

 
    slide.addEventListener('mouseenter', () => {
        currentIndex = index;
        updateSlider();
    });

    return slide;
}

function updateBackground(movie) {
    backgroundOverlay.style.backgroundImage = `url('${movie.image}')`;
    backgroundOverlay.style.backgroundSize = 'cover';
    backgroundOverlay.style.backgroundPosition = 'center';
    backgroundOverlay.style.transition = 'background 0.5s ease-in-out';
}


function createMovieCard(movie) {
    return `
        <div class="movie-card">
            <div class="movie-card-poster" style="background-image: url('${movie.image}')">
                <span class="card-rating">⭐ ${movie.rating}</span>
                
            </div>
        </div>
    `;
}

function renderAll() {
    sliderTrack.innerHTML = '';
    sliderMovies.forEach((movie, index) => {
        sliderTrack.appendChild(createMovieSlide(movie, index));
    });

    continueGrid.innerHTML = continueMovies.map(createMovieCard).join('');

    updateSlider();
}


function updateSlider() {
    const slides = document.querySelectorAll('.movie-slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'dimmed');
        if (index === currentIndex) slide.classList.add('active');
        else slide.classList.add('dimmed');
    });

    updateBackground(sliderMovies[currentIndex]);
}



function bookMovie(title) {
    alert(`Booking tickets for: ${title}`);
}

themeToggle.addEventListener('click', () => {
    const theme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
});
function bookMovie(title) {
    window.location.href = `seats.html?movie=${encodeURIComponent(title)}`;
}
// 1. ცვლადები ფილტრებისთვის (დაამატეთ სხვების გვერდით)
const movieSearch = document.getElementById('movieSearch');
const genreSelect = document.getElementById('genreSelect');

// 2. ფუნქცია, რომელიც ფილტრავს JSON-იდან წამოღებულ continueMovies მასივს
function filterMovies() {
    const searchTerm = movieSearch.value.toLowerCase();
    const selectedGenre = genreSelect.value;

    // ფილტრაცია
    const filtered = continueMovies.filter(movie => {
        // ვამოწმებთ სათაურს (Search)
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        
        // ვამოწმებთ ჟანრს (Select) - თუ "all" არის, ყველა გადის
        const matchesGenre = selectedGenre === 'all' || 
                            (movie.genre && movie.genre.toLowerCase() === selectedGenre.toLowerCase());
        
        return matchesSearch && matchesGenre;
    });

    // გაფილტრული მონაცემების ხელახალი რენდერი
    renderContinueMovies(filtered);
}

// 3. დამხმარე ფუნქცია მხოლოდ ქვედა გრიდის დასახატად
function renderContinueMovies(moviesList) {
    if (!continueGrid) return;
    
    if (moviesList.length === 0) {
        continueGrid.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 50px;">
            No movies found matching your criteria.
        </p>`;
        return;
    }

    continueGrid.innerHTML = moviesList.map(createMovieCard).join('');
}

// 4. მოვლენების მიბმა (Events)
movieSearch.addEventListener('input', filterMovies);
genreSelect.addEventListener('change', filterMovies);

// 5. თქვენი არსებული renderAll-ის მცირე შესწორება
function renderAll() {
    sliderTrack.innerHTML = '';
    sliderMovies.forEach((movie, index) => {
        sliderTrack.appendChild(createMovieSlide(movie, index));
    });

    // თავდაპირველად ვხატავთ ყველა ფილმს JSON-იდან
    renderContinueMovies(continueMovies);
    updateSlider();
}