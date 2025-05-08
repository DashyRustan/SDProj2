function formatUsageTime(startTime) {
    if (!startTime) return '';
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

let currentStatus = 'pending';

function updateStatusCounts(bookings) {
    const counts = {
        pending: 0,
        ongoing: 0,
        finished: 0
    };

    bookings.forEach(booking => {
        counts[booking.status] = (counts[booking.status] || 0) + 1;
    });

    Object.keys(counts).forEach(status => {
        const countElement = document.getElementById(`${status}-count`);
        if (countElement) {
            countElement.textContent = counts[status];
        }
    });
}

function updateBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tbody = document.getElementById('bookings-body');
    tbody.innerHTML = '';

    const filteredBookings = bookings.filter(booking => booking.status === currentStatus);
    
    filteredBookings.forEach(booking => {
        const row = document.createElement('tr');
        const usageTime = booking.status === 'ongoing' ? formatUsageTime(booking.startTime) : '';
        
        const actionButton = booking.status === 'pending' ? 
            `<button class="confirm-btn" onclick="confirmBooking('${booking.bookingTime}')">
                <i class="fas fa-check"></i> Confirm
            </button>` : '';

        // Create signature cell content
        const signatureContent = booking.signaturePicture ? 
            `<img src="${booking.signaturePicture}" alt="Professor's Signature" class="signature-image">` : 
            'No signature provided';
        
        row.innerHTML = `
            <td>${booking.studentName}</td>
            <td>${booking.studentId}</td>
            <td>${booking.items.join(', ')}</td>
            <td class="signature-cell">${signatureContent}</td>
            <td>${new Date(booking.bookingTime).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${booking.status}">
                    ${booking.status}
                </span>
            </td>
            <td class="usage-time">${usageTime}</td>
            <td class="action-cell">${actionButton}</td>
        `;
        tbody.appendChild(row);
    });

    updateStatusCounts(bookings);
}

// Add confirm booking function
window.confirmBooking = function(bookingTime) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = bookings.map(booking => {
        if (booking.bookingTime === bookingTime) {
            return {
                ...booking,
                status: 'ongoing',
                startTime: new Date().toISOString()
            };
        }
        return booking;
    });
    
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    updateBookings();
};

// Add click event listeners to status tabs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Update current status and refresh bookings
            currentStatus = tab.dataset.status;
            updateBookings();
        });
    });

    // Update bookings every minute to keep usage time current
    setInterval(updateBookings, 60000);

    // Initial load
    updateBookings();
});