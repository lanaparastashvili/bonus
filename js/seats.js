let sessions = [];
let groupedSessions = {};
const rows = ["G", "F", "E", "D", "C", "B", "A"];
const seatsPerRow = [6, 8, 10, 12, 12, 12, 12];
let selectedDate = null;
let selectedTime = null;
let selectedSeats = [];
let bookedSeats = [];
let currentSessionId = null;
let movieTitle = ""; // ✅ ახალი

async function loadData() {
    // ✅ URL-დან movie title-ის წაკითხვა
    const urlParams = new URLSearchParams(window.location.search);
    movieTitle = urlParams.get('movie') || 'Unknown Movie';
    
    // Movie title-ის გამოჩენა (თუ გაქვთ HTML-ში <h1 id="movieTitle"></h1>)
    const movieTitleElement = document.getElementById('movieTitle');
    if (movieTitleElement) {
        movieTitleElement.textContent = movieTitle;
    }

    try {
        const response = await fetch('../data/sessions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        sessions = await response.json();

        groupedSessions = {};
        sessions.forEach(session => {
            if (!groupedSessions[session.date]) {
                groupedSessions[session.date] = [];
            }
            groupedSessions[session.date].push(session);
        });

        const availableDates = Object.keys(groupedSessions);
        if (availableDates.length > 0) {
            selectedDate = availableDates[0];
            const firstSession = groupedSessions[selectedDate][0];
            selectedTime = firstSession.time;
            pricePerSeat = firstSession.price;
            currentSessionId = firstSession.id;

            bookedSeats = getMockBookedSeats(currentSessionId);
        }

        renderSelectors();
        renderSeats();
        updateBookingInfo();
    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById('seatsContainer').innerHTML =
            `<div style="color: white; padding: 20px; text-align: center;">
                <h3>Data loading failed</h3>
                <p>Ensure you are running a <b>local server</b> (like Live Server) to use fetch().</p>
                <p style="font-size: 0.8em; color: #888;">Error: ${error.message}</p>
            </div>`;
    }
}

function getMockBookedSeats(id) {
    const mocks = {
        1: ["D3", "D4", "C5"],
        2: ["A1", "A2", "B1", "B2"],
        3: ["G1", "G2", "G3"],
        4: ["E4", "E5", "E6"],
        5: ["F1", "F2"],
        6: ["A11", "A12"],
        7: ["B10", "B11"],
        8: ["D3", "D4", "C5"],
        9: ["A1", "A2", "B1", "B2"],
        10: ["G1", "G2", "G3"],
        11: ["E4", "E5", "E6"],
        12: ["F1", "F2","A11", "A12"],
        13: ["A11", "A12"],
        14: ["B10", "B11","E4", "E5", "E6"],  
        15: ["D3", "D4", "C5"],
        16: ["A1", "A2", "B1", "B2"],
        17: ["G1", "G2", "G3"],
        18: ["E4", "E5", "E6"],
        19: ["F1", "F2"],
        20: ["A11", "A12"],
        21: ["B10", "B11"],
        22: ["D3", "D4", "C5"],
        23: ["A1", "A2", "B1", "B2"],
        24: ["G1", "G2", "G3"],
        25: ["E4", "E5", "E6"],
        26: ["F1", "F2","A11", "A12"],
        27: ["A11", "A12"],
        28: ["B10", "B11","E4", "E5", "E6"],
        29: ["B10", "B11"],
        30: ["D3", "D4", "C5"],
        31: ["E4", "E5", "E6"],
        32: ["F1", "F2","A11", "A12"],
        33: ["A11", "A12"],
        34: ["B10", "B11","E4", "E5", "E6"],
        35: ["B10", "B11"],
    };
    return mocks[id] || [];
}

function renderSelectors() {
    const dateSelector = document.getElementById('dateSelector');
    dateSelector.innerHTML = '';

    const availableDates = Object.keys(groupedSessions);
    availableDates.forEach(date => {
        const pill = document.createElement('div');
        const day = date.split('-')[2];
        pill.className = `pill ${date === selectedDate ? 'active' : ''}`;
        pill.textContent = day;
        pill.onclick = () => selectDate(date);
        dateSelector.appendChild(pill);
    });

    renderTimeSelector();
}

function renderTimeSelector() {
    const timeSelector = document.getElementById('timeSelector');
    timeSelector.innerHTML = '';

    const showtimes = groupedSessions[selectedDate];
    if (showtimes) {
        showtimes.forEach(session => {
            const pill = document.createElement('div');
            pill.className = `pill ${session.time === selectedTime ? 'active' : ''}`;
            pill.textContent = session.time;
            pill.onclick = () => selectTime(session.time, session.id, session.price);
            timeSelector.appendChild(pill);
        });
    }
}

function selectDate(date) {
    selectedDate = date;
    const firstSession = groupedSessions[date][0];
    selectedTime = firstSession.time;
    pricePerSeat = firstSession.price;
    currentSessionId = firstSession.id;
    bookedSeats = getMockBookedSeats(currentSessionId);

    selectedSeats = [];
    renderSelectors();
    renderSeats();
    updateBookingInfo();
}

function selectTime(time, sessionId, price) {
    selectedTime = time;
    currentSessionId = sessionId;
    pricePerSeat = price;
    bookedSeats = getMockBookedSeats(sessionId);

    selectedSeats = [];
    renderSelectors();
    renderSeats();
    updateBookingInfo();
}

function renderSeats() {
    const container = document.getElementById('seatsContainer');
    container.innerHTML = '';

    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        const leftLabel = document.createElement('div');
        leftLabel.className = 'row-label';
        leftLabel.textContent = row;
        rowDiv.appendChild(leftLabel);

        for (let i = 1; i <= seatsPerRow[rowIndex]; i++) {
            const seatId = `${row}${i}`;
            const seat = document.createElement('div');
            seat.className = 'seat';

            if (bookedSeats.includes(seatId)) {
                seat.classList.add('booked');
            } else if (selectedSeats.includes(seatId)) {
                seat.classList.add('selected');
            }

            if (!bookedSeats.includes(seatId)) {
                seat.onclick = () => toggleSeat(seatId);
            }

            rowDiv.appendChild(seat);
        }

        const rightLabel = document.createElement('div');
        rightLabel.className = 'row-label';
        rightLabel.textContent = row;
        rowDiv.appendChild(rightLabel);

        container.appendChild(rowDiv);
    });
}

function toggleSeat(seatId) {
    const index = selectedSeats.indexOf(seatId);
    if (index > -1) {
        selectedSeats.splice(index, 1);
    } else {
        if (selectedSeats.length >= 6) {
            alert("Max 6 seats allowed.");
            return;
        }
        selectedSeats.push(seatId);
    }
    renderSeats();
    updateBookingInfo();
}

function updateBookingInfo() {
    const container1 = document.querySelector('.container1');
    const selectedSeatsList = document.querySelector('.selected-seats');
    const purchaseBtn = document.querySelector('.purchase-btn');

    if (selectedSeats.length === 0) {
        container1.style.display = 'none';
        return;
    }

    container1.style.display = 'flex';
    selectedSeatsList.innerHTML = '';

    selectedSeats.forEach(seatId => {
        const row = seatId.slice(0, 1);
        const seatNum = seatId.slice(1);

        const seatItem = document.createElement('div');
        seatItem.className = 'seat-item';
        seatItem.innerHTML = `
            <div class="seat-info">
                <div class="seat-icon"></div>
                <div class="seat-text">${row} row / ${seatNum} seat</div>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="seat-price">$ ${pricePerSeat}</div>
                <button class="remove-btn" onclick="toggleSeat('${seatId}')">×</button>
            </div>
        `;
        selectedSeatsList.appendChild(seatItem);
    });

    const total = selectedSeats.length * pricePerSeat;
    purchaseBtn.textContent = `Purchase (${total}$)`;
    
    // ✅ Purchase ღილაკს დაემატება onclick
    purchaseBtn.onclick = checkout;
}

// ✅ Checkout ფუნქცია
function checkout() {
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat!");
        return;
    }
    
    const params = new URLSearchParams({
        movie: movieTitle,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats.join(','),
        price: pricePerSeat,
        total: selectedSeats.length * pricePerSeat
    });
    
    window.location.href = `checkout.html?${params.toString()}`;
}

let timeLeft = 600 + 15;
function startTimer() {
    const timerEl = document.querySelector('.timer');
    const interval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `Time left to purchase: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerEl.textContent = "Time expired!";
            document.querySelector('.purchase-btn').disabled = true;
        }
        timeLeft--;
    }, 1000);
}


loadData();
startTimer();

