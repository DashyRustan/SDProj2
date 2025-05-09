document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date();
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Initialize charts
    initializeUsageChart();
    initializeAvailabilityChart();
    
    // Load mock data for demonstration
    loadMockData();
});

function initializeUsageChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');
    const usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Equipment Usage',
                data: [12, 19, 15, 25, 22, 30],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.4
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
}

function initializeAvailabilityChart() {
    const ctx = document.getElementById('availabilityChart').getContext('2d');
    const availabilityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'In Use', 'Maintenance'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function loadMockData() {
    // Mock data for statistics
    document.querySelectorAll('.stat-card .stat-value')[0].textContent = '120';
    document.querySelectorAll('.stat-card .stat-value')[1].textContent = '30';
    document.querySelectorAll('.stat-card .stat-value')[2].textContent = '90';
    document.querySelectorAll('.stat-card .stat-value')[3].textContent = '45';
    
    // Mock data for recent activities
    const activities = [
        { date: '2023-06-15', item: 'Microscope', action: 'Borrowed', user: 'John Doe', status: 'Active' },
        { date: '2023-06-14', item: 'Oscilloscope', action: 'Returned', user: 'Jane Smith', status: 'Completed' },
        { date: '2023-06-14', item: 'Multimeter', action: 'Borrowed', user: 'Mike Johnson', status: 'Active' },
        { date: '2023-06-13', item: 'Function Generator', action: 'Maintenance', user: 'Admin', status: 'Pending' },
        { date: '2023-06-12', item: 'Power Supply', action: 'Borrowed', user: 'Sarah Williams', status: 'Active' }
    ];
    
    const activityBody = document.getElementById('activity-body');
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${activity.date}</td>
            <td>${activity.item}</td>
            <td>${activity.action}</td>
            <td>${activity.user}</td>
            <td><span class="status-badge ${activity.status.toLowerCase()}">${activity.status}</span></td>
        `;
        activityBody.appendChild(row);
    });
}

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