// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Check if dark mode is saved in localStorage
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode"); 
}

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});

// Fetch Orders Every 30 Seconds
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders'); 
        const orders = await response.json();
        updateOrderList(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

// Update Order List UI
function updateOrderList(orders) {
    const orderListContainer = document.getElementById("orderList");
    orderListContainer.innerHTML = ""; // Clear existing orders

    orders.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-card");
        orderElement.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Status: ${order.status}</p>
            <p>Customer: ${order.customerName}</p>
        `;
        orderListContainer.appendChild(orderElement);
    });
}

// Auto-refresh order list every 30 seconds
setInterval(fetchOrders, 30000);
fetchOrders(); // Initial fetch
