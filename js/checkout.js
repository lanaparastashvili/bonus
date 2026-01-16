

const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('movie') || 'Unknown Movie';
const bookingDate = urlParams.get('date');
const bookingTime = urlParams.get('time');
const selectedSeatsFromURL = urlParams.get('seats') ? urlParams.get('seats').split(',') : [];
const pricePerSeat = parseFloat(urlParams.get('price')) || 0;
const totalPrice = parseFloat(urlParams.get('total')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    const movieEl = document.getElementById('checkoutMovieTitle');
    const dateEl = document.getElementById('checkoutDate');
    const timeEl = document.getElementById('checkoutTime');
    const seatsEl = document.getElementById('checkoutSeats');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (movieEl) movieEl.textContent = movieTitle;
    if (dateEl) dateEl.textContent = bookingDate;
    if (timeEl) timeEl.textContent = bookingTime;
    if (seatsEl) seatsEl.textContent = selectedSeatsFromURL.join(', ');
    if (totalEl) totalEl.textContent = `$${totalPrice}`;
});

const form = document.getElementById('orderForm');
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const promo = document.getElementById('promo');
const phone = document.getElementById('phone');
const payment = document.getElementById('payment');
const cardNumber = document.getElementById('cardNumber');
let promoApplied = false;

cardNumber.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

phone.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

function applyPromo() {
    const promoValue = promo.value.trim().toUpperCase();
    if (promoValue === '') {
        showError(promo, 'promoError', 'Please enter a promo code');
        return;
    }
    
    if (promoValue === 'SAVE10' || promoValue === 'DISCOUNT20') {
        clearError(promo, 'promoError');
        promoApplied = true;
        alert('Promo code applied successfully!');
        promo.style.borderColor = '#27ae60';
    } else {
        showError(promo, 'promoError', 'Invalid promo code');
        promoApplied = false;
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;

    if (fullname.value.trim() === '') {
        showError(fullname, 'fullnameError', 'Name and surname is required');
        isValid = false;
    } else if (fullname.value.trim().split(' ').length < 2) {
        showError(fullname, 'fullnameError', 'Please enter both name and surname');
        isValid = false;
    } else {
        clearError(fullname, 'fullnameError');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError(email, 'emailError', 'Email is required');
        isValid = false;
    } else if (!emailPattern.test(email.value.trim())) {
        showError(email, 'emailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(email, 'emailError');
    }

    if (phone.value === '') {
        showError(phone, 'phoneError', 'Phone number is required');
        isValid = false;
    } else if (phone.value.length !== 7) {
        showError(phone, 'phoneError', 'Phone number must be 7 digits');
        isValid = false;
    } else {
        clearError(phone, 'phoneError');
    }

    const cardValue = cardNumber.value.replace(/\s/g, '');
    if (cardValue === '') {
        showError(cardNumber, 'cardError', 'Card number is required');
        isValid = false;
    } else if (cardValue.length < 13 || cardValue.length > 16) {
        showError(cardNumber, 'cardError', 'Please enter a valid card number');
        isValid = false;
    } else {
        clearError(cardNumber, 'cardError');
    }

   if (isValid) {

        const bookingData = {
            movie: movieTitle,
            date: bookingDate,
            time: bookingTime,
            seats: selectedSeatsFromURL,
            total: totalPrice,
            fullname: fullname.value.trim(),
            email: email.value.trim()
        };

        saveBookingToLocalStorage(bookingData);
        markSeatsAsTaken(bookingDate, bookingTime, selectedSeatsFromURL);

        const params = new URLSearchParams({
            movie: movieTitle,
            date: bookingDate,
            time: bookingTime,
            seats: selectedSeatsFromURL.join(','),
            total: totalPrice,
            fullname: fullname.value.trim(),
            email: email.value.trim()
        });
        
        window.location.href = `success.html?${params.toString()}`;
    }
});

fullname.addEventListener('blur', function() {
    if (fullname.value.trim() === '') {
        showError(fullname, 'fullnameError', 'Name and surname is required');
    } else if (fullname.value.trim().split(' ').length < 2) {
        showError(fullname, 'fullnameError', 'Please enter both name and surname');
    } else {
        clearError(fullname, 'fullnameError');
    }
});

email.addEventListener('blur', function() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError(email, 'emailError', 'Email is required');
    } else if (!emailPattern.test(email.value.trim())) {
        showError(email, 'emailError', 'Please enter a valid email address');
    } else {
        clearError(email, 'emailError');
    }
});

phone.addEventListener('blur', function() {
    if (phone.value === '') {
        showError(phone, 'phoneError', 'Phone number is required');
    } else if (phone.value.length !== 7) {
        showError(phone, 'phoneError', 'Phone number must be 7 digits');
    } else {
        clearError(phone, 'phoneError');
    }
});

cardNumber.addEventListener('blur', function() {
    const cardValue = cardNumber.value.replace(/\s/g, '');
    if (cardValue === '') {
        showError(cardNumber, 'cardError', 'Card number is required');
    } else if (cardValue.length < 13 || cardValue.length > 16) {
        showError(cardNumber, 'cardError', 'Please enter a valid card number');
    } else {
        clearError(cardNumber, 'cardError');
    }
});

function showError(input, errorId, message) {
    input.classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input, errorId) {
    input.classList.remove('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function closeForm() {
    const overlay = document.querySelector('.model-overlay');
    if (overlay) {
        overlay.style.setProperty('display', 'none', 'important');
    }
}

function saveBookingToLocalStorage(bookingData) {

    let bookings = JSON.parse(localStorage.getItem('cinemaBookings') || '[]');
    
    bookings.push(bookingData);
    localStorage.setItem('cinemaBookings', JSON.stringify(bookings));
    
    console.log('Booking saved:', bookingData);
}
function markSeatsAsTaken(date, time, seats) {
    const sessionKey = `takenSeats_${date}_${time}`;

    let takenSeats = JSON.parse(localStorage.getItem(sessionKey) || '[]');
    
    seats.forEach(seat => {
        if (!takenSeats.includes(seat)) {
            takenSeats.push(seat);
        }
    });
    
    localStorage.setItem(sessionKey, JSON.stringify(takenSeats));
    
    console.log(`Seats marked as taken for ${date} ${time}:`, seats);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
