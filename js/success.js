
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('movie') || 'Unknown Movie';
const bookingDate = urlParams.get('date');
const bookingTime = urlParams.get('time');
const seats = urlParams.get('seats');
const totalPrice = urlParams.get('total');
const fullname = urlParams.get('fullname');
const email = urlParams.get('email');

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'flex';
    }
});

function closeModal() {
    window.location.href = 'movie.html';
}

document.querySelector('.save-btn').addEventListener('click', function() {
    const ticketData = `
🎬 Movie: ${movieTitle}
📅 Date: ${bookingDate}
🕐 Time: ${bookingTime}
💺 Seats: ${seats}
💰 Total: $${totalPrice}
👤 Name: ${fullname}
📧 Email: ${email}
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${movieTitle.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Ticket saved successfully!');
});