// Initialize the page
function initializePage() {
    // Set current date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    
    // Load usage history from localStorage
    updateUsageTable();
}

// Update usage table
function updateUsageTable() {
    const tbody = document.getElementById('usage-body');
    tbody.innerHTML = '';
    
    // Get usage history from localStorage
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory')) || [];
    
    usageHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.itemName}</td>
            <td>${entry.studentId}</td>
            <td>${entry.studentName}</td>
            <td>${entry.borrowedTime}</td>
            <td>${entry.returnTime || '-'}</td>
            <td>
                <span class="status-badge ${entry.status === 'active' ? 'status-active' : 'status-returned'}">
                    ${entry.status}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter functionality
function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const itemFilter = document.getElementById('itemFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#usage-body tr');
    
    rows.forEach(row => {
        const date = new Date(row.cells[0].textContent);
        const item = row.cells[1].textContent;
        const status = row.cells[6].textContent.trim().toLowerCase();
        
        const dateMatch = (!startDate || date >= new Date(startDate)) && 
                        (!endDate || date <= new Date(endDate));
        const itemMatch = !itemFilter || item === itemFilter;
        const statusMatch = !statusFilter || status === statusFilter;
        
        row.style.display = dateMatch && itemMatch && statusMatch ? '' : 'none';
    });
}

// Initialize the page when loaded
window.onload = initializePage;