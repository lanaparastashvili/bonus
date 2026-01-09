let sliderMovies = [];
let continueMovies = [];
let currentIndex = 0;

// ელემენტები
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const continueGrid = document.getElementById('continueGrid');
const backgroundOverlay = document.getElementById('backgroundOverlay');
const themeToggle = document.getElementById('themeToggle');

// JSON წამოღება
fetch('../data/movie.json')
  .then(res => res.json())
  .then(data => {
      sliderMovies = data.sliderMovies;
      continueMovies = data.continueMovies;
      renderAll();
  })
  .catch(err => console.error('JSON load error:', err));

// Slide შექმნა
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

    // Hover-ზე background-ზე გადიდება
    slide.addEventListener('mouseenter', () => {
        currentIndex = index;
        updateSlider();
    });

    return slide;
}

// Background განახლება
function updateBackground(movie) {
    backgroundOverlay.style.backgroundImage = `url('${movie.image}')`;
    backgroundOverlay.style.backgroundSize = 'cover';
    backgroundOverlay.style.backgroundPosition = 'center';
    backgroundOverlay.style.transition = 'background 0.5s ease-in-out';
}

// Continue movies ბარათები
function createMovieCard(movie) {
    return `
        <div class="movie-card">
            <div class="movie-card-poster" style="background-image: url('${movie.image}')">
                <span class="card-rating">⭐ ${movie.rating}</span>
                ${movie.title}
            </div>
        </div>
    `;
}

// Render slider + continue movies
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
