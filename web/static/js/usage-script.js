document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date();
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Set default date values for filters
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    document.getElementById('startDate').valueAsDate = oneMonthAgo;
    document.getElementById('endDate').valueAsDate = currentDate;

    // Populate item filter dropdown with mock data
    populateItemFilter();
    
    // Load mock usage data
    loadMockUsageData();
    
    // Initialize charts
    initializeMonthlyUsageChart();
    initializePopularItemsChart();
});

function populateItemFilter() {
    const items = [
        'Microscope', 'Oscilloscope', 'Multimeter', 'Function Generator', 
        'Power Supply', 'Soldering Station', 'Logic Analyzer', 'Spectrum Analyzer'
    ];
    
    const itemFilter = document.getElementById('itemFilter');
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.toLowerCase().replace(/\s+/g, '-');
        option.textContent = item;
        itemFilter.appendChild(option);
    });
}

function loadMockUsageData() {
    const usageData = [
        {
            date: '2023-06-15',
            item: 'Microscope',
            studentName: 'John Doe',
            studentId: 'S12345',
            checkoutTime: '09:30 AM',
            returnTime: '04:15 PM',
            status: 'Returned'
        },
        {
            date: '2023-06-14',
            item: 'Oscilloscope',
            studentName: 'Jane Smith',
            studentId: 'S12346',
            checkoutTime: '10:15 AM',
            returnTime: '03:45 PM',
            status: 'Returned'
        },
        {
            date: '2023-06-14',
            item: 'Multimeter',
            studentName: 'Mike Johnson',
            studentId: 'S12347',
            checkoutTime: '11:00 AM',
            returnTime: '',
            status: 'Active'
        },
        {
            date: '2023-06-13',
            item: 'Function Generator',
            studentName: 'Sarah Williams',
            studentId: 'S12348',
            checkoutTime: '09:00 AM',
            returnTime: '02:30 PM',
            status: 'Returned'
        },
        {
            date: '2023-06-12',
            item: 'Power Supply',
            studentName: 'David Brown',
            studentId: 'S12349',
            checkoutTime: '01:30 PM',
            returnTime: '',
            status: 'Active'
        }
    ];
    
    renderUsageTable(usageData);
}

function renderUsageTable(data) {
    const usageBody = document.getElementById('usage-body');
    usageBody.innerHTML = '';
    
    data.forEach(usage => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usage.date}</td>
            <td>${usage.item}</td>
            <td>${usage.studentName}</td>
            <td>${usage.studentId}</td>
            <td>${usage.checkoutTime}</td>
            <td>${usage.returnTime || '-'}</td>
            <td><span class="status-badge ${usage.status.toLowerCase()}">${usage.status}</span></td>
        `;
        usageBody.appendChild(row);
    });
}

function applyFilters() {
    // In a real application, this would filter the data based on the selected criteria
    // For this demo, we'll just reload the mock data
    loadMockUsageData();
    alert('Filters applied!');
}

function initializeMonthlyUsageChart() {
    const ctx = document.getElementById('monthlyUsageChart').getContext('2d');
    const monthlyUsageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Number of Checkouts',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(52, 152, 219, 0.8)'
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

function initializePopularItemsChart() {
    const ctx = document.getElementById('popularItemsChart').getContext('2d');
    const popularItemsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Microscope', 'Oscilloscope', 'Multimeter', 'Function Generator', 'Power Supply'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ]
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