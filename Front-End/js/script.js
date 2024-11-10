// Base URL of the Spring Boot backend
const BASE_URL = "http://localhost:8080/api";

let monthlySalesChart, categorySalesChart, productSalesChart;

async function loadCharts() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const salesData = await fetchSalesData(startDate, endDate);
    const { monthlySales, categorySales, productSales } = salesData;

    // Monthly Sales Chart (Line Chart)
    const monthlyLabels = monthlySales.map(data => data.month);
    const monthlyValues = monthlySales.map(data => data.totalSales);
    renderChart("monthlySalesChart", "line", monthlyLabels, monthlyValues, "Monthly Sales Trend");

    // Category Sales Chart (Bar Chart)
    const categoryLabels = categorySales.map(data => data.category);
    const categoryValues = categorySales.map(data => data.totalSales);
    renderChart("categorySalesChart", "bar", categoryLabels, categoryValues, "Sales by Category");

    // Product Sales Distribution (Pie Chart)
    const productLabels = productSales.map(data => data.productName);
    const productValues = productSales.map(data => data.totalSales);
    renderChart("productSalesChart", "pie", productLabels, productValues, "Product Sales Distribution");
}

// Fetch sales data from backend
async function fetchSalesData(startDate, endDate) {
    const response = await fetch(`${BASE_URL}/sales/date-range?startDate=${startDate}&endDate=${endDate}`);
    const sales = await response.json();

    // Process and organize the data for each chart
    const monthlySales = calculateMonthlySales(sales);
    const categorySales = calculateCategorySales(sales);
    const productSales = calculateProductSales(sales);

    return { monthlySales, categorySales, productSales };
}

// Render chart with Chart.js
function renderChart(chartId, chartType, labels, data, label) {
    const ctx = document.getElementById(chartId).getContext("2d");

    // Destroy existing chart if it exists
    if (window[chartId]) {
        window[chartId].destroy();
    }

    window[chartId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: chartType === "pie" ? generateColors(data.length) : "#007bff",
                borderColor: "#007bff",
                fill: false
            }]
        }
    });
}

// Helper functions to calculate data for charts
function calculateMonthlySales(sales) {
    const monthlySalesMap = {};

    sales.forEach(sale => {
        const month = new Date(sale.saleDate).toLocaleString('default', { month: 'long' });
        monthlySalesMap[month] = (monthlySalesMap[month] || 0) + sale.total;
    });

    return Object.entries(monthlySalesMap).map(([month, totalSales]) => ({ month, totalSales }));
}

function calculateCategorySales(sales) {
    const categorySalesMap = {};

    sales.forEach(sale => {
        categorySalesMap[sale.category] = (categorySalesMap[sale.category] || 0) + sale.total;
    });

    return Object.entries(categorySalesMap).map(([category, totalSales]) => ({ category, totalSales }));
}

function calculateProductSales(sales) {
    const productSalesMap = {};

    sales.forEach(sale => {
        productSalesMap[sale.productName] = (productSalesMap[sale.productName] || 0) + sale.total;
    });

    return Object.entries(productSalesMap).map(([productName, totalSales]) => ({ productName, totalSales }));
}

// Generate colors for pie chart
function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(i * 50) % 360}, 70%, 70%)`);
    }
    return colors;
}

// Load charts on page load
document.addEventListener("DOMContentLoaded", loadCharts);
