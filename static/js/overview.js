// Initialize charts
function initializeCharts() {
    // Usage Statistics Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    new Chart(usageCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Times Used',
                data: [],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Availability Chart
    const availabilityCtx = document.getElementById('availabilityChart').getContext('2d');
    new Chart(availabilityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'In Use'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Update the updateInventoryTable function
async function updateInventoryTable() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';
    
    try {
        const response = await fetch('http://localhost:5000/api/inventory');
        const items = await response.json();
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.no}</td>
                <td>${item.category}</td>
                <td>${item.class_name}</td>
                <td>${item.qty}</td>
                <td>${item.item_description}</td>
                <td>${item.remarks}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Modal functions
function openAddItemModal() {
    document.getElementById('modal-title').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Form submission
document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const newItem = {
        no: parseInt(document.getElementById('itemNo').value),
        category: document.getElementById('itemCategory').value,
        class_name: document.getElementById('itemClass').value,
        qty: document.getElementById('itemQty').value,
        item_description: document.getElementById('itemDescription').value,
        remarks: document.getElementById('itemRemarks').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) {
            throw new Error('Failed to add item');
        }

        await updateInventoryTable();
        initializeCharts();
        closeModal();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item');
    }
});

// Set current date
document.getElementById('current-date').textContent = new Date().toLocaleDateString();

// Initialize the dashboard
window.onload = function() {
    updateInventoryTable();
    initializeCharts();
};