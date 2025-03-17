// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    initializeBootstrapComponents();
    
    // DOM elements
    const adminAccessBtn = document.getElementById('admin-access-btn');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const adminUI = document.getElementById('admin-ui');
    const customerUI = document.getElementById('customer-ui');
    const searchForm = document.getElementById('search-form');
    const repairForm = document.getElementById('repair-form');
    const editRepairForm = document.getElementById('edit-repair-form');
    const adminSearch = document.getElementById('admin-search');
    
    // Sample data - in a real application, this would come from a database
    let repairs = [
        {
            id: 1,
            serviceNumber: 'SRV-1001',
            productName: 'MacBook Pro',
            status: 'In Progress',
            model: '2023 M2',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            issueDescription: 'Screen flickering and battery drains quickly',
            estimatedCompletion: '2025-03-25',
            technician: 'Mike Smith',
            notes: 'Customer mentioned the issues started after a recent update'
        },
        {
            id: 2,
            serviceNumber: 'SRV-1002',
            productName: 'Dell XPS 13',
            status: 'Received',
            model: '9380',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            issueDescription: 'Won\'t power on',
            estimatedCompletion: '2025-03-30',
            technician: 'Sarah Johnson',
            notes: ''
        }
    ];
    
    // Admin password - in a real application, this would be securely stored and handled server-side
    const ADMIN_PASSWORD = 'admin123';
    
    // Event Listeners
    adminAccessBtn.addEventListener('click', showLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    searchForm.addEventListener('submit', handleSearch);
    repairForm.addEventListener('submit', handleAddRepair);
    editRepairForm.addEventListener('submit', handleEditRepair);
    adminSearch.addEventListener('input', filterAdminList);
    
    // Check if the user is already logged in (using session storage)
    checkLoginStatus();
    
    // Render the admin repair list initially
    renderAdminRepairList();
    
    // Functions
    function initializeBootstrapComponents() {
        // Initialize all Bootstrap modals
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        const editServiceModal = new bootstrap.Modal(document.getElementById('editServiceModal'));
        
        // Store modals in window for easy access
        window.loginModal = loginModal;
        window.editServiceModal = editServiceModal;
    }
    
    function showLoginModal(e) {
        e.preventDefault();
        window.loginModal.show();
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        
        if (password === ADMIN_PASSWORD) {
            // Store login status in session storage
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Switch to admin UI
            adminUI.classList.remove('hidden');
            customerUI.classList.add('hidden');
            
            // Hide the login modal
            window.loginModal.hide();
            
            // Reset the form
            loginForm.reset();
        } else {
            alert('Invalid password. Please try again.');
        }
    }
    
    function handleLogout(e) {
        e.preventDefault();
        
        // Remove login status from session storage
        sessionStorage.removeItem('isLoggedIn');
        
        // Switch back to customer UI
        adminUI.classList.add('hidden');
        customerUI.classList.remove('hidden');
    }
    
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            adminUI.classList.remove('hidden');
            customerUI.classList.add('hidden');
        } else {
            adminUI.classList.add('hidden');
            customerUI.classList.remove('hidden');
        }
    }
    
    function handleSearch(e) {
        e.preventDefault();
        
        const searchServiceNumber = document.getElementById('search-service-number').value;
        const repair = repairs.find(r => r.serviceNumber === searchServiceNumber);
        
        const repairResult = document.getElementById('repair-result');
        const searchError = document.getElementById('search-error');
        
        if (repair) {
            // Populate repair result
            document.getElementById('result-service-number').textContent = repair.serviceNumber;
            document.getElementById('result-product-name').textContent = repair.productName;
            document.getElementById('result-model').textContent = repair.model;
            document.getElementById('result-customer-name').textContent = repair.customerName;
            document.getElementById('result-status').textContent = repair.status;
            document.getElementById('result-estimated-completion').textContent = formatDate(repair.estimatedCompletion);
            document.getElementById('result-issue-description').textContent = repair.issueDescription;
            
            // Set progress bar based on status
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = getProgressPercentage(repair.status);
            progressBar.style.width = progressPercentage + '%';
            progressBar.setAttribute('aria-valuenow', progressPercentage);
            
            // Show result and hide error
            repairResult.classList.remove('hidden');
            searchError.classList.add('hidden');
        } else {
            // Show error and hide result
            repairResult.classList.add('hidden');
            searchError.classList.remove('hidden');
        }
    }
    
    function handleAddRepair(e) {
        e.preventDefault();
        
        // Create new repair object
        const newRepair = {
            id: repairs.length + 1,
            serviceNumber: document.getElementById('service-number').value,
            productName: document.getElementById('product-name').value,
            status: document.getElementById('status').value,
            model: document.getElementById('model').value,
            customerName: document.getElementById('customer-name').value,
            customerEmail: document.getElementById('customer-email').value,
            issueDescription: document.getElementById('issue-description').value,
            estimatedCompletion: document.getElementById('estimated-completion').value,
            technician: document.getElementById('technician').value,
            notes: document.getElementById('notes').value
        };
        
        // Add to repairs array
        repairs.push(newRepair);
        
        // Re-render the admin repair list
        renderAdminRepairList();
        
        // Reset the form
        repairForm.reset();
        
        // Show success message
        alert('New service added successfully!');
        
        // Switch to list tab
        document.getElementById('list-tab').click();
    }
    
    function handleEditRepair(e) {
        e.preventDefault();
        
        const serviceId = parseInt(document.getElementById('edit-service-id').value);
        const repairIndex = repairs.findIndex(r => r.id === serviceId);
        
        if (repairIndex !== -1) {
            // Update repair object
            repairs[repairIndex] = {
                id: serviceId,
                serviceNumber: document.getElementById('edit-service-number').value,
                productName: document.getElementById('edit-product-name').value,
                status: document.getElementById('edit-status').value,
                model: document.getElementById('edit-model').value,
                customerName: document.getElementById('edit-customer-name').value,
                customerEmail: document.getElementById('edit-customer-email').value,
                issueDescription: document.getElementById('edit-issue-description').value,
                estimatedCompletion: document.getElementById('edit-estimated-completion').value,
                technician: document.getElementById('edit-technician').value,
                notes: document.getElementById('edit-notes').value
            };
            
            // Re-render the admin repair list
            renderAdminRepairList();
            
            // Hide the modal
            window.editServiceModal.hide();
            
            // Show success message
            alert('Service updated successfully!');
        }
    }
    
    function renderAdminRepairList() {
        const adminRepairList = document.getElementById('admin-repair-list');
        adminRepairList.innerHTML = '';
        
        repairs.forEach(repair => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${repair.serviceNumber}</td>
                <td>${repair.productName}</td>
                <td><span class="badge ${getStatusBadgeClass(repair.status)}">${repair.status}</span></td>
                <td>${repair.model}</td>
                <td>${repair.customerName}</td>
                <td>
                    <button class="btn btn-sm bg-blue-500 text-white me-1 edit-btn" data-id="${repair.id}">Edit</button>
                    <button class="btn btn-sm bg-red-500 text-white delete-btn" data-id="${repair.id}">Delete</button>
                </td>
            `;
            
            adminRepairList.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
    }
    
    function handleEditClick(e) {
        const serviceId = parseInt(e.target.getAttribute('data-id'));
        const repair = repairs.find(r => r.id === serviceId);
        
        if (repair) {
            // Populate the edit form
            document.getElementById('edit-service-id').value = repair.id;
            document.getElementById('edit-service-number').value = repair.serviceNumber;
            document.getElementById('edit-product-name').value = repair.productName;
            document.getElementById('edit-status').value = repair.status;
            document.getElementById('edit-model').value = repair.model;
            document.getElementById('edit-customer-name').value = repair.customerName;
            document.getElementById('edit-customer-email').value = repair.customerEmail;
            document.getElementById('edit-issue-description').value = repair.issueDescription;
            document.getElementById('edit-estimated-completion').value = repair.estimatedCompletion;
            document.getElementById('edit-technician').value = repair.technician;
            document.getElementById('edit-notes').value = repair.notes;
            
            // Show the edit modal
            window.editServiceModal.show();
        }
    }
    
    function handleDeleteClick(e) {
        if (confirm('Are you sure you want to delete this service?')) {
            const serviceId = parseInt(e.target.getAttribute('data-id'));
            repairs = repairs.filter(r => r.id !== serviceId);
            renderAdminRepairList();
        }
    }
    
    function filterAdminList() {
        const searchTerm = adminSearch.value.toLowerCase();
        const filteredRepairs = repairs.filter(repair => 
            repair.serviceNumber.toLowerCase().includes(searchTerm) ||
            repair.productName.toLowerCase().includes(searchTerm) ||
            repair.customerName.toLowerCase().includes(searchTerm) ||
            repair.model.toLowerCase().includes(searchTerm) ||
            repair.status.toLowerCase().includes(searchTerm)
        );
        
        const adminRepairList = document.getElementById('admin-repair-list');
        adminRepairList.innerHTML = '';
        
        filteredRepairs.forEach(repair => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${repair.serviceNumber}</td>
                <td>${repair.productName}</td>
                <td><span class="badge ${getStatusBadgeClass(repair.status)}">${repair.status}</span></td>
                <td>${repair.model}</td>
                <td>${repair.customerName}</td>
                <td>
                    <button class="btn btn-sm bg-blue-500 text-white me-1 edit-btn" data-id="${repair.id}">Edit</button>
                    <button class="btn btn-sm bg-red-500 text-white delete-btn" data-id="${repair.id}">Delete</button>
                </td>
            `;
            
            adminRepairList.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
    }
    
    // Helper Functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function getProgressPercentage(status) {
        switch (status) {
            case 'Received':
                return 25;
            case 'Diagnosing':
                return 40;
            case 'In Progress':
                return 50;
            case 'Testing':
                return 75;
            case 'Ready for Pickup':
                return 90;
            case 'Completed':
                return 100;
            default:
                return 0;
        }
    }
    
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Received':
                return 'bg-info';
            case 'Diagnosing':
                return 'bg-secondary';
            case 'In Progress':
                return 'bg-primary';
            case 'Testing':
                return 'bg-warning';
            case 'Ready for Pickup':
                return 'bg-success';
            case 'Completed':
                return 'bg-dark';
            default:
                return 'bg-light';
        }
    }
});