// Function to open the add item modal
function openAddItemModal() {
    // Implementation for opening modal
}

// Function to add a new consumable item
async function addConsumableItem(formData) {
    try {
        const response = await fetch('/api/consumables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
            updateConsumablesTable();
        }
    } catch (error) {
        console.error('Error adding consumable:', error);
    }
}

// Function to update the consumables table
async function updateConsumablesTable() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';
    
    try {
        const response = await fetch('/api/consumables');
        const items = await response.json();
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.no}</td>
                <td>${item.category}</td>
                <td>${item.class}</td>
                <td>${item.qty}</td>
                <td>${item.item_description}</td>
                <td>${item.remarks}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editItem(${item.no})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteItem(${item.no})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching consumables:', error);
    }
}

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateConsumablesTable();
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Category filter functionality
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const category = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-body tr');
    
    rows.forEach(row => {
        if (!category) {
            row.style.display = '';
            return;
        }
        const rowCategory = row.children[1].textContent.toLowerCase();
        row.style.display = rowCategory === category ? '' : 'none';
    });
});