document.addEventListener('DOMContentLoaded', function() {
    // Initialize inventory
    const inventory = {
        'Multimeter': 10,
        'Breadboard': 15,
        'Power Supply': 8
    };
    
    // Initialize cart
    const cart = new Map();
    
    // Update inventory displays
    function updateInventoryDisplays() {
        Object.entries(inventory).forEach(([item, count]) => {
            const display = document.querySelector(`[data-item="${item}"]`);
            if (display) {
                display.textContent = `Available: ${count}`;
            }
        });
    }
    
    // Update cart display
    function updateCart() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';
        
        cart.forEach((quantity, item) => {
            if (quantity > 0) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item} x${quantity}</span>
                    <button onclick="removeFromCart('${item}')" class="remove-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                cartList.appendChild(li);
            }
        });
    }
    
    // Update quantity
    window.updateQuantity = function(item, change) {
        const currentQty = cart.get(item) || 0;
        const newQty = Math.max(0, currentQty + change);
        
        if (newQty <= inventory[item]) {
            cart.set(item, newQty);
            document.getElementById(`quantity-${item}`).textContent = newQty;
            updateCart();
            
            // Update button states
            const minusBtn = document.querySelector(`[onclick="updateQuantity('${item}', -1)"]`);
            const plusBtn = document.querySelector(`[onclick="updateQuantity('${item}', 1)"]`);
            
            minusBtn.disabled = newQty === 0;
            plusBtn.disabled = newQty === inventory[item];
        }
    };
    
    // Remove item from cart
    window.removeFromCart = function(item) {
        cart.delete(item);
        document.getElementById(`quantity-${item}`).textContent = '0';
        updateCart();
    };
    
    // Confirm booking
    window.confirmBooking = function() {
        const professorEmail = document.getElementById('professor-email').value;
        
        if (!professorEmail) {
            alert('Please enter professor\'s email');
            return;
        }
        
        if (cart.size === 0) {
            alert('Please select at least one item');
            return;
        }
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
        
        const reservation = {
            studentName: userData.name,
            studentId: userData.studentId,
            items: Array.from(cart.entries()).map(([item, qty]) => `${item} (${qty})`),
            professorEmail: professorEmail,
            reservationTime: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save reservation
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        // Show success message and redirect
        alert('Reservation submitted successfully!');
        window.location.href = 'reservations.html';
    };
    
    // Initialize displays
    updateInventoryDisplays();
    
    // Add animation to items on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });
    
    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const letters = document.querySelectorAll('.letter');
    let currentLetter = 'all';

    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.item');
        
        items.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            const startsWithLetter = currentLetter === 'all' || itemName.startsWith(currentLetter.toLowerCase());
            const matchesSearch = itemName.includes(searchTerm);
            
            item.style.display = (startsWithLetter && matchesSearch) ? '' : 'none';
            
            // Animate items that are visible
            if (startsWithLetter && matchesSearch) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }

    // Search input handler
    searchInput.addEventListener('input', filterItems);

    // Alphabet navigation handler
    letters.forEach(letter => {
        letter.addEventListener('click', () => {
            letters.forEach(l => l.classList.remove('active'));
            letter.classList.add('active');
            currentLetter = letter.dataset.letter;
            filterItems();
        });
    });

    // Initialize with 'All' selected
    document.querySelector('[data-letter="all"]').classList.add('active');
    
    // Initialize signature pad
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255,255,255,0.1)',
        penColor: 'white',
        velocityFilterWeight: 0.7,
        minWidth: 0.5,
        maxWidth: 2.5,
        throttle: 16
    });
    
    // Clear signature
    window.clearSignature = function() {
        signaturePad.clear();
    };
    
    // Save signature
    window.saveSignature = function() {
        if (signaturePad.isEmpty()) {
            alert('Please provide a signature first.');
            return;
        }
        
        const dataURL = signaturePad.toDataURL();
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataURL;
        link.click();
    };
    
    // Undo last stroke
    window.undoSignature = function() {
        const data = signaturePad.toData();
        if (data) {
            data.pop(); // remove the last stroke
            signaturePad.fromData(data);
        }
    };
    
    // Handle picture preview
    const pictureInput = document.getElementById('signature-picture');
    const picturePreview = document.getElementById('signature-preview');
    
    pictureInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                picturePreview.src = e.target.result;
                picturePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Update confirm booking function
    window.confirmBooking = function() {
        const signaturePicture = document.getElementById('signature-picture').files[0];
        let signatureData = null;
        
        // Check if either signature method is provided
        if (!signaturePicture && signaturePad.isEmpty()) {
            alert('Please provide professor\'s signature (either draw or upload)');
            return;
        }
        
        if (cart.size === 0) {
            alert('Please select at least one item');
            return;
        }
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
        if (!userData.studentId) {
            alert('Please log in to make a booking');
            return;
        }
        
        // Function to process the booking
        const processBooking = (signatureImage) => {
            const booking = {
                studentName: userData.name,
                studentId: userData.studentId,
                items: Array.from(cart.entries()).map(([item, qty]) => `${item} (${qty})`),
                professorSignature: signatureImage,
                bookingTime: new Date().toISOString(),
                status: 'pending'
            };
            
            try {
                // Save booking
                const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
                bookings.push(booking);
                localStorage.setItem('bookings', JSON.stringify(bookings));
                
                // Update inventory
                cart.forEach((qty, item) => {
                    inventory[item] -= qty;
                });
                
                // Clear cart and signature
                cart.clear();
                signaturePad.clear();
                document.getElementById('signature-picture').value = '';
                document.getElementById('signature-preview').style.display = 'none';
                updateInventoryDisplays();
                
                // Show success message and redirect
                alert('Reservation submitted successfully!');
                // After saving reservation, redirect to reservations page
                window.location.href = "reservations.html";
            } catch (error) {
                alert('Error saving reservation. Please try again.');
                console.error('Reservation save error:', error);
            }
        };
        
        // Process signature based on method used
        if (signaturePicture) {
            const reader = new FileReader();
            reader.onload = function(e) {
                processBooking(e.target.result);
            };
            reader.onerror = function() {
                alert('Error reading signature file. Please try again.');
            };
            reader.readAsDataURL(signaturePicture);
        } else {
            processBooking(signaturePad.toDataURL());
        }
    };
});

// Function to confirm booking/reservation
function confirmBooking() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert('Please add at least one item to your reservation.');
        return;
    }

    // Get signature
    const signatureData = getSignatureData();
    if (!signatureData) {
        alert('Professor\'s signature is required.');
        return;
    }

    // Get user data (assuming it's stored in localStorage)
    const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (!userData.studentId || !userData.name) {
        alert('Please log in to make a reservation.');
        return;
    }

    // Create reservation object
    const reservation = {
        studentName: userData.name,
        studentId: userData.studentId,
        items: cartItems,
        signaturePicture: signatureData,
        reservationTime: new Date().toISOString(),
        status: 'pending'
    };

    // Save to localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Clear cart
    clearCart();
    
    // Show success message
    alert('Reservation submitted successfully! Please wait for admin approval.');
    
    // Redirect to reservations page
    window.location.href = 'reservations.html';
}

// Helper function to get signature data
function getSignatureData() {
    // Check if signature pad has content
    if (signaturePad && !signaturePad.isEmpty()) {
        return signaturePad.toDataURL();
    }
    
    // Check if signature image was uploaded
    const signaturePreview = document.getElementById('signature-preview');
    if (signaturePreview && signaturePreview.style.display !== 'none') {
        return signaturePreview.src;
    }
    
    return null;
}

// Helper function to get cart items
function getCartItems() {
    const cartList = document.getElementById('cart-list');
    const items = [];
    
    if (cartList) {
        const itemElements = cartList.querySelectorAll('li');
        itemElements.forEach(item => {
            const itemName = item.textContent.split(' x')[0].trim();
            items.push(itemName);
        });
    }
    
    return items;
}

// Helper function to clear cart
function clearCart() {
    const cartList = document.getElementById('cart-list');
    if (cartList) {
        cartList.innerHTML = '';
    }
    
    // Reset all quantity displays
    document.querySelectorAll('.quantity').forEach(elem => {
        elem.textContent = '0';
    });
}