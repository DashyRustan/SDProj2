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
        
        const booking = {
            studentName: userData.name,
            studentId: userData.studentId,
            items: Array.from(cart.entries()).map(([item, qty]) => `${item} (${qty})`),
            professorEmail: professorEmail,
            bookingTime: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save booking
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Show success message and redirect
        alert('Booking submitted successfully!');
        window.location.href = 'bookings.html';
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
    
    // Update confirm booking function
    window.confirmBooking = function() {
        const signaturePicture = document.getElementById('signature-picture').files[0];
        
        try {
            // Validate inputs
            if (!signaturePicture) {
                alert('Please upload professor\'s signature picture');
                return;
            }
            
            if (signaturePad.isEmpty()) {
                alert('Please add professor\'s e-signature');
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
            
            // Convert signature to data URL
            const signatureData = signaturePad.toDataURL();
            
            // Create FileReader for signature picture
            const reader = new FileReader();
            reader.onload = function(e) {
                const booking = {
                    studentName: userData.name,
                    studentId: userData.studentId,
                    items: Array.from(cart.entries()).map(([item, qty]) => `${item} (${qty})`),
                    professorPicture: e.target.result,
                    professorSignature: signatureData,
                    bookingTime: new Date().toISOString(),
                    status: 'pending'
                };
                
                try {
                    // Save booking
                    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
                    bookings.push(booking);
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    // Clear cart and signature
                    cart.clear();
                    signaturePad.clear();
                    
                    // Show success message and redirect
                    alert('Booking submitted successfully!');
                    window.location.href = 'bookings.html';
                } catch (error) {
                    alert('Error saving booking. Please try again.');
                    console.error('Booking save error:', error);
                }
            };
            
            reader.onerror = function() {
                alert('Error reading signature file. Please try again.');
            };
            
            reader.readAsDataURL(signaturePicture);
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.error('Confirmation error:', error);
        }
    };
    
    // Handle picture preview
    const pictureInput = document.getElementById('professor-picture');
    const picturePreview = document.getElementById('picture-preview');
    
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
    
    // Clear signature
    window.clearSignature = function() {
        signaturePad.clear();
    };
    
    // Update confirm booking function
    window.confirmBooking = function() {
        const professorPicture = document.getElementById('professor-picture').files[0];
        
        if (!professorPicture) {
            alert('Please upload professor\'s picture');
            return;
        }
        
        if (signaturePad.isEmpty()) {
            alert('Please add professor\'s signature');
            return;
        }
        
        if (cart.size === 0) {
            alert('Please select at least one item');
            return;
        }
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
        
        // Convert signature to data URL
        const signatureData = signaturePad.toDataURL();
        
        // Create FileReader for picture
        const reader = new FileReader();
        reader.onload = function(e) {
            const booking = {
                studentName: userData.name,
                studentId: userData.studentId,
                items: Array.from(cart.entries()).map(([item, qty]) => `${item} (${qty})`),
                professorPicture: e.target.result,
                professorSignature: signatureData,
                bookingTime: new Date().toISOString(),
                status: 'pending'
            };
            
            // Save booking
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show success message and redirect
            alert('Booking submitted successfully!');
            window.location.href = 'bookings.html';
        };
        
        reader.readAsDataURL(professorPicture);
    };
});