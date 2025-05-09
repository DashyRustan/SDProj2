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

function updateStatusCounts(reservations) {
    const counts = {
        pending: 0,
        ongoing: 0,
        finished: 0
    };

    reservations.forEach(reservation => {
        counts[reservation.status] = (counts[reservation.status] || 0) + 1;
    });

    Object.keys(counts).forEach(status => {
        const countElement = document.getElementById(`${status}-count`);
        if (countElement) {
            countElement.textContent = counts[status];
        }
    });
}

function updateReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const tbody = document.getElementById('bookings-body');
    tbody.innerHTML = '';

    const filteredReservations = reservations.filter(reservation => reservation.status === currentStatus);
    
    filteredReservations.forEach(reservation => {
        const row = document.createElement('tr');
        const usageTime = reservation.status === 'ongoing' ? formatUsageTime(reservation.startTime) : '';
        
        let actionButton = '';
        if (reservation.status === 'pending') {
            actionButton = `<button class="accept-btn" onclick="confirmReservation('${reservation.reservationTime}')">
                <i class="fas fa-check"></i> Accept
            </button>`;
        } else if (reservation.status === 'ongoing') {
            actionButton = `<button class="confirm-return-btn" onclick="confirmReturn('${reservation.reservationTime}')">
                <i class="fas fa-undo"></i> Confirm Return
            </button>`;
        } else if (reservation.status === 'finished') {
            actionButton = `<button class="delete-btn" onclick="deleteReservation('${reservation.reservationTime}')">
                <i class="fas fa-trash"></i> Delete
            </button>`;
        }

        // Create signature cell content
        const signatureContent = reservation.signaturePicture ? 
            `<img src="${reservation.signaturePicture}" alt="Professor's Signature" class="signature-image">` : 
            'No signature provided';
        
        // Fix for displaying items - ensure we're handling both string and array formats
        let itemsDisplay = '';
        if (reservation.items) {
            if (Array.isArray(reservation.items)) {
                itemsDisplay = reservation.items.join(', ');
            } else if (typeof reservation.items === 'string') {
                itemsDisplay = reservation.items;
            }
        }
        
        row.innerHTML = `
            <td>${reservation.studentName}</td>
            <td>${reservation.studentId}</td>
            <td>${itemsDisplay}</td>
            <td class="signature-cell">${signatureContent}</td>
            <td>${new Date(reservation.reservationTime).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${reservation.status}">
                    ${reservation.status}
                </span>
            </td>
            <td class="usage-time">${usageTime}</td>
            <td class="action-cell">${actionButton}</td>
        `;
        tbody.appendChild(row);
    });

    updateStatusCounts(reservations);
}

// Add confirm reservation function
window.confirmReservation = function(reservationTime) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const updatedReservations = reservations.map(reservation => {
        if (reservation.reservationTime === reservationTime) {
            return {
                ...reservation,
                status: 'ongoing',
                startTime: new Date().toISOString()
            };
        }
        return reservation;
    });
    
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    updateReservations();
};

// Add undo reservation function
window.undoReservation = function(reservationTime) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const updatedReservations = reservations.filter(reservation => 
        reservation.reservationTime !== reservationTime
    );
    
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    updateReservations();
};

// Add click event listeners to status tabs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentStatus = tab.dataset.status;
            updateReservations(); // Fixed function name
        });
    });

    // Update reservations every minute
    setInterval(updateReservations, 60000); // Fixed function name

    // Initial load
    updateReservations(); // Fixed function name
});

// Add confirm return function for ongoing reservations
window.confirmReturn = function(reservationTime) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const updatedReservations = reservations.map(reservation => {
        if (reservation.reservationTime === reservationTime) {
            return {
                ...reservation,
                status: 'finished',
                returnTime: new Date().toISOString()
            };
        }
        return reservation;
    });
    
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    updateReservations();
};

// Update the updateReservations function to show different action buttons based on status
function updateReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const tbody = document.getElementById('bookings-body');
    tbody.innerHTML = '';

    const filteredReservations = reservations.filter(reservation => reservation.status === currentStatus);
    
    filteredReservations.forEach(reservation => {
        const row = document.createElement('tr');
        const usageTime = reservation.status === 'ongoing' ? formatUsageTime(reservation.startTime) : '';
        
        let actionButton = '';
        if (reservation.status === 'pending') {
            actionButton = `<button class="accept-btn" onclick="confirmReservation('${reservation.reservationTime}')">
                <i class="fas fa-check"></i> Accept
            </button>`;
        } else if (reservation.status === 'ongoing') {
            actionButton = `<button class="confirm-return-btn" onclick="confirmReturn('${reservation.reservationTime}')">
                <i class="fas fa-undo"></i> Confirm Return
            </button>`;
        } else if (reservation.status === 'finished') {
            actionButton = `<button class="delete-btn" onclick="deleteReservation('${reservation.reservationTime}')">
                <i class="fas fa-trash"></i> Delete
            </button>`;
        }

        // Create signature cell content
        const signatureContent = reservation.signaturePicture ? 
            `<img src="${reservation.signaturePicture}" alt="Professor's Signature" class="signature-image">` : 
            'No signature provided';
        
        row.innerHTML = `
            <td>${reservation.studentName}</td>
            <td>${reservation.studentId}</td>
            <td>${reservation.items.join(', ')}</td>
            <td class="signature-cell">${signatureContent}</td>
            <td>${new Date(reservation.reservationTime).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${reservation.status}">
                    ${reservation.status}
                </span>
            </td>
            <td class="usage-time">${usageTime}</td>
            <td class="action-cell">${actionButton}</td>
        `;
        tbody.appendChild(row);
    });

    updateStatusCounts(reservations);
}

// Add delete reservation function
window.deleteReservation = function(reservationTime) {
    if (confirm('Are you sure you want to delete this reservation?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservations = reservations.filter(reservation => 
            reservation.reservationTime !== reservationTime
        );
        
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        updateReservations();
    }
};