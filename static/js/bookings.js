document.addEventListener('DOMContentLoaded', function() {
    function updateBookings() {
        const bookingsList = document.getElementById('bookings-list');
        
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
            
            // Filter bookings for current user
            const userBookings = bookings.filter(booking => booking.studentId === userData.studentId);
            
            if (!userData.studentId) {
                bookingsList.innerHTML = '<div class="no-bookings">Please log in to view your bookings</div>';
                return;
            }
            
            if (userBookings.length === 0) {
                bookingsList.innerHTML = '<div class="no-bookings">No bookings found</div>';
                return;
            }
            
            bookingsList.innerHTML = '';
            
            // Sort bookings by date (newest first)
            userBookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            
            userBookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.className = 'booking-card';
                
                const statusClass = `status-${booking.status.toLowerCase()}`;
                const canComplete = booking.status === 'ongoing';
                
                const formattedDate = new Date(booking.bookingTime).toLocaleString();
                
                bookingCard.innerHTML = `
                    <div class="booking-header">
                        <div class="booking-info">
                            <h3>Booking #${booking.bookingTime.substring(0, 10)}</h3>
                            <span class="booking-date">${formattedDate}</span>
                        </div>
                        <span class="status-badge ${statusClass}">${booking.status.toUpperCase()}</span>
                    </div>
                    <div class="booking-details">
                        <h4>Items:</h4>
                        <ul class="items-list">
                            ${booking.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    ${canComplete ? `
                        <div class="booking-actions">
                            <button class="complete-btn" onclick="completeBooking('${booking.bookingTime}')">
                                <i class="fas fa-check"></i> Mark as Completed
                            </button>
                        </div>
                    ` : ''}
                `;
                
                bookingsList.appendChild(bookingCard);
            });
        } catch (error) {
            console.error('Error updating bookings:', error);
            bookingsList.innerHTML = '<div class="no-bookings">Error loading bookings. Please try again.</div>';
        }
    }
    
    // Function to complete a booking
    window.completeBooking = function(bookingTime) {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const updatedBookings = bookings.map(booking => {
                if (booking.bookingTime === bookingTime) {
                    return { ...booking, status: 'finished' };
                }
                return booking;
            });
            
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            updateBookings();
        } catch (error) {
            console.error('Error completing booking:', error);
            alert('Error completing booking. Please try again.');
        }
    };
    
    // Initialize bookings display
    updateBookings();
    
    // Refresh bookings every minute
    setInterval(updateBookings, 60000);
});