document.addEventListener('DOMContentLoaded', function() {
    const reservationsList = document.getElementById('reservations-list');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    let allReservations = [];

    function loadReservations() {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        allReservations = reservations;
        updateStatusCounts(reservations);
        filterAndDisplayReservations();
    }

    function filterAndDisplayReservations() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;
        
        const filteredReservations = allReservations.filter(reservation => {
            const matchesSearch = 
                reservation.studentName.toLowerCase().includes(searchTerm) ||
                reservation.studentId.toLowerCase().includes(searchTerm) ||
                reservation.items.some(item => item.toLowerCase().includes(searchTerm));
            
            const matchesStatus = statusValue === 'all' || reservation.status === statusValue;
            
            const matchesDate = !dateValue || new Date(reservation.reservationTime).toLocaleDateString() === new Date(dateValue).toLocaleDateString();
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        // Animate out existing cards
        // GSAP animations for smooth transitions
        gsap.to('.reservation-card', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                reservationsList.innerHTML = '';
                
                if (filteredReservations.length === 0) {
                    reservationsList.innerHTML = `
                        <div class="no-results animate__animated animate__fadeIn">
                            <i class="fas fa-search fa-3x"></i>
                            <p>No reservations found</p>
                        </div>
                    `;
                    return;
                }

                filteredReservations.forEach((reservation, index) => {
                    const reservationDiv = document.createElement('div');
                    reservationDiv.className = 'reservation-card';
                    reservationDiv.style.opacity = 0;
                    reservationDiv.style.transform = 'translateY(20px)';

                    const formattedTime = new Date(reservation.reservationTime).toLocaleString();
                    
                    reservationDiv.innerHTML = `
                        <div class="card-header">
                            <h3>${reservation.studentName}</h3>
                            <span class="status-badge status-${reservation.status}">${reservation.status}</span>
                        </div>
                        <div class="card-content">
                            <p><i class="fas fa-id-card"></i> <strong>ID:</strong> ${reservation.studentId}</p>
                            <p><i class="fas fa-tools"></i> <strong>Items:</strong> ${reservation.items.join(', ')}</p>
                            <p><i class="fas fa-clock"></i> <strong>Time:</strong> ${formattedTime}</p>
                        </div>
                        ${reservation.professorSignature ? `
                            <div class="signature-section">
                                <p><i class="fas fa-signature"></i> <strong>Professor's Signature:</strong></p>
                                <img src="${reservation.professorSignature}" alt="Signature" class="signature-image">
                            </div>
                        ` : ''}
                        ${reservation.status === 'ongoing' ? `
                            <button class="complete-btn" onclick="markAsCompleted('${reservation.reservationTime}')">
                                <i class="fas fa-check"></i>
                                Mark as Completed
                            </button>
                        ` : ''}
                    `;

                    reservationsList.appendChild(reservationDiv);

                    // Animate in new cards
                    gsap.to(reservationDiv, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    // Add smooth transitions for status counts
    function updateStatusCounts(reservations) {
        const counts = {
            pending: reservations.filter(r => r.status === 'pending').length,
            ongoing: reservations.filter(r => r.status === 'ongoing').length,
            finished: reservations.filter(r => r.status === 'finished').length
        };
        
        Object.entries(counts).forEach(([status, count]) => {
            const element = document.querySelector(`.status-count.${status}`);
            gsap.to(element, {
                textContent: count,
                duration: 1,
                snap: { textContent: 1 },
                stagger: 0.1
            });
        });
    }

    // Add loading animation for refresh button
    document.querySelector('.refresh-btn').addEventListener('click', function() {
        gsap.to(this, {
            rotation: 360,
            duration: 0.8,
            ease: "power2.inOut"
        });
        loadReservations();
    });

    window.markAsCompleted = function(reservationTime) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservations = reservations.map(reservation => {
            if (reservation.reservationTime === reservationTime && reservation.status === 'ongoing') {
                return { ...reservation, status: 'finished' };
            }
            return reservation;
        });
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        allReservations = updatedReservations;
        filterAndDisplayReservations();
    };

    // Add event listeners for all filters
    searchInput.addEventListener('input', filterAndDisplayReservations);
    statusFilter.addEventListener('change', filterAndDisplayReservations);
    dateFilter.addEventListener('change', filterAndDisplayReservations);

    // Initial load
    loadReservations();
});