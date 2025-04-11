document.addEventListener("DOMContentLoaded", () => {
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const tableBody = document.querySelector("#userTable tbody");

    // Fetch and display users
    function fetchUsers() {
        tableBody.innerHTML = ""; // Clear existing rows before fetching new data
        const endpoint = includeDeletedCheckbox.checked ? "/api/Users" : "/api/Users/NotDeleted";
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then(users => {
                tableBody.innerHTML = ""; // Clear existing rows
                users.forEach(user => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.joiningDate}</td>
                        <td>${user.resignationDate || "N/A"}</td>
                        <td>${user.deletedAt ? formatToLocalDateTime(user.deletedAt) : "N/A"}</td>
                        <td>${user.originId ? user.originId : "N/A"}</td>
                        <td>
                            <a href="Edit.html?id=${user.id}" class="edit-btn">Edit</a>
                            <button class="softDelete-btn" data-id="${user.id}">Soft Delete</button>
                            <button class="hardDelete-btn" data-id="${user.id}">Hard Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all users? This action cannot be undone.")) {
            fetch("/api/Users/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all users");
                    }
                    alert("All users have been hard deleted successfully!");
                    fetchUsers(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all users. Please try again.");
                    console.error("Error hard deleting all users:", error);
                });
        }
    });

    // Attach event listener to the checkbox
    includeDeletedCheckbox.addEventListener("change", () => {
        fetchUsers();
    });

    // Attach (hard or soft) delete event listeners
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("softDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to soft delete this user?")) {
                deleteUser(id, "soft");
            }
        }

        if (event.target.classList.contains("hardDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to hard delete this user?")) {
                deleteUser(id, "hard");
            }
        }
    });

    // Delete a user
    function deleteUser(id, type) {
        const endpoint = type === "soft" ? `/api/Users/SoftDelete/${id}` : `/api/Users/HardDelete/${id}`;
        const method = type === "soft" ? "PUT" : "DELETE";

        fetch(endpoint, { method })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to ${type} delete user`);
                }
                alert(`User ${type} deleted successfully!`);
                fetchUsers(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting user. Please try again.`);
                console.error(`Error ${type} deleting user:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "N/A";
        return new Date(dateTimeString).toLocaleString();
    }

    // Initial fetch
    fetchUsers();
});
