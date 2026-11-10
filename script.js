
let budget = Number(localStorage.getItem("budget")) || 30000;

let expenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
);

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

document.getElementById("expense-date").value =
    new Date().toISOString().slice(0, 10);

function saveData() {
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateDashboard() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    document.getElementById("budget").textContent =
        "KSh " + budget.toLocaleString();

    document.getElementById("total-spent").textContent =
        "KSh " + total.toLocaleString();

    document.getElementById("remaining").textContent =
        "KSh " + (budget - total).toLocaleString();
}

function displayExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(expense.name)}</td>
            <td>${escapeHTML(expense.category)}</td>
            <td>${escapeHTML(expense.date)}</td>
            <td>KSh ${expense.amount.toLocaleString()}</td>
            <td>
                <button onclick="deleteExpense(${index})">
                    Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);
    });

    updateDashboard();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value.trim();
    const amount = Number(
        document.getElementById("expense-amount").value
    );
    const category = document.getElementById("expense-category").value;
    const date = document.getElementById("expense-date").value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !date) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.push({
        name: name,
        amount: amount,
        category: category,
        date: date
    });

    saveData();
    displayExpenses();
    form.reset();

    document.getElementById("expense-date").value =
        new Date().toISOString().slice(0, 10);
});

function deleteExpense(index) {
    expenses.splice(index, 1);

    saveData();
    displayExpenses();
}

document.getElementById("edit-budget").addEventListener("click", function() {
    const newBudget = prompt("Enter your monthly budget:", budget);

    if (newBudget === null) return;

    const amount = Number(newBudget);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid budget greater than zero.");
        return;
    }

    budget = amount;
    saveData();
    updateDashboard();
});

displayExpenses();
