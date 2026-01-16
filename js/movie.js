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



function createMovieCard(movie, index) {
    const movieId = movie.id || (sliderMovies.length + index + 1);
    
    return `
        <div class="movie-card" data-movie-id="${movieId}" onclick="viewMovieDetails(${movieId})" style="cursor: pointer;">
            <div class="movie-card-poster" style="background-image: url('${movie.image}')">
                <div class="card-overlay">
                    <span class="card-rating">⭐ ${movie.rating}</span>
                    ${movie.description ? `<p class="card-description">${movie.description}</p>` : ''}
                </div>
            </div>
            <div class="movie-card-info">
                <h3 class="card-title">${movie.title}</h3>
                <div class="card-meta">
                    <span class="card-genre">${movie.genre || ''}</span>
                    ${movie.year ? `<span class="card-year">${movie.year}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}
function createMovieCard(movie, index) {
    const movieId = movie.id || (sliderMovies.length + index + 1);
    
    return `
        <div class="movie-card" data-movie-id="${movieId}" onclick="viewMovieDetails(${movieId})" style="cursor: pointer;">
            <div class="movie-card-poster" style="background-image: url('${movie.image}')">
            </div>
        </div>
    `;
}
function viewMovieDetails(movieId) {
    window.location.href = `../cinema-project/index.html?id=${movieId}`;
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
const movieSearch = document.getElementById('movieSearch');
const genreSelect = document.getElementById('genreSelect');

function filterMovies() {
    const searchTerm = movieSearch.value.toLowerCase();
    const selectedGenre = genreSelect.value;

    
    const filtered = continueMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        
        const matchesGenre = selectedGenre === 'all' || 
                            (movie.genre && movie.genre.toLowerCase() === selectedGenre.toLowerCase());
        
        return matchesSearch && matchesGenre;
    });

    renderContinueMovies(filtered);
}

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

movieSearch.addEventListener('input', filterMovies);
genreSelect.addEventListener('change', filterMovies);

function renderAll() {
    sliderTrack.innerHTML = '';
    sliderMovies.forEach((movie, index) => {
        sliderTrack.appendChild(createMovieSlide(movie, index));
    });

    renderContinueMovies(continueMovies);
    updateSlider();
}const logo = document.querySelector('.logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        window.location.href = 'movie.html';
    });
}
let currentUser = null;

const users = [
    { email: 'admin@mail.com', password: '123456', name: 'Admin' },
    { email: 'user@mail.com', password: 'password', name: 'User' }
];

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        alert('ველები ვერ მოიძებნა!');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        alert('გთხოვთ შეავსოთ ყველა ველი!');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        
        updateUIAfterLogin(currentUser);
        closeLoginModal();
        
        emailInput.value = '';
        passwordInput.value = '';
        
        alert('✅ წარმატებით შეხვედით, ' + user.name + '! 🎬');
    } else {
        alert('❌ არასწორი ელ. ფოსტა ან პაროლი!\n\nსცადეთ:\nadmin@mail.com / 123456\nან\nuser@mail.com / password');
    }
}

function updateUIAfterLogin(userData) {
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.innerHTML = `
            <div class="user-profile">
                <span class="user-name">${userData.name.charAt(0)}</span>
            </div>
        `;
        
        profileIcon.removeEventListener('click', openLoginModal);
        profileIcon.addEventListener('click', showUserMenu);
    }
}

function showUserMenu(e) {
    e.stopPropagation();
    
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <p class="user-menu-name">${currentUser.name}</p>
            <p class="user-menu-email">${currentUser.email}</p>
        </div>
        <div class="user-menu-item" id="profileBtn">📋 პროფილი</div>
        <div class="user-menu-item" id="logoutBtn">🚪 გასვლა</div>
    `;
    
    document.body.appendChild(menu);
    
    const profileIcon = document.querySelector('.profile-icon');
    const rect = profileIcon.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '20px';
    
    document.getElementById('profileBtn').addEventListener('click', showProfile);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    setTimeout(() => {
        const closeMenu = function(event) {
            if (!event.target.closest('.user-menu') && !event.target.closest('.profile-icon')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }, 100);
}


function showProfile() {
    if (currentUser) {
        alert(`📋 თქვენი პროფილი:\n\nსახელი: ${currentUser.name}\nელ. ფოსტა: ${currentUser.email}\nშესვლის დრო: ${new Date(currentUser.loginTime).toLocaleString('ka-GE')}`);
    }
    
    const menu = document.querySelector('.user-menu');
    if (menu) menu.remove();
}


function logout() {
    if (confirm('დარწმუნებული ხართ რომ გსურთ გასვლა?')) {
        currentUser = null;
        
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.innerHTML = '<img src="../img/Account.png" alt="">';
            profileIcon.removeEventListener('click', showUserMenu);
            profileIcon.addEventListener('click', openLoginModal);
        }
        
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.remove();
        
        alert('👋 წარმატებით გახვედით!');
    } else {
        const menu = document.querySelector('.user-menu');
        if (menu) menu.remove();
    }
}

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Login system ready');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form listener added');
    } else {
        console.error('❌ Login form not found');
    }
    
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLoginModal);
        console.log('✅ Close button listener added');
    }
    
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', openLoginModal);
        console.log('✅ Profile icon listener added');
    } else {
        console.error('❌ Profile icon not found');
    }
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
});

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const modal = document.getElementById('loginModal');
        if (modal && modal.style.display === 'flex') {
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            if (emailInput && passwordInput && (emailInput.value || passwordInput.value)) {
                handleLogin(event);
            }
        }
    }
});