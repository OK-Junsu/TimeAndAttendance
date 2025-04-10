document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#userTable tbody");

    // Fetch and display users
    function fetchUsers() {
        fetch("/api/Users")
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
                        <td>${formatToLocalDateTime(user.deletedAt) || "N/A"}</td>
                        <td>${user.originId || "N/A"}</td>
                        <td>
                            <a href="Edit.html?id=${user.id}" class="edit-btn">Edit</a>
                            <button class="softDelete-btn" data-id="${user.id}">Soft Delete</button>
                            <button class="hardDelete-btn" data-id="${user.id}">Hard Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                attachSoftDeleteListeners();
                attachHardDeleteListeners();
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    // Soft delete a user
    function softDeleteUser(id) {
        fetch(`/api/Users/SoftDelete/${id}`, {
            method: "PUT"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to soft delete user");
                }
                alert("User soft deleted successfully!");
                fetchUsers(); // Refresh the table
            })
            .catch(error => {
                alert("Error soft deleting user. Please try again.");
                console.error("Error soft deleting user:", error);
            });
    }

    // Hard delete a user
    function hardDeleteUser(id) {
        fetch(`/api/Users/HardDelete/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to hard delete user");
                }
                alert("User hard deleted successfully!");
                fetchUsers(); // Refresh the table
            })
            .catch(error => {
                alert("Error hard deleting user. Please try again.");
                console.error("Error hard deleting user:", error);
            });
    }

    // Attach hard delete event listeners
    function attachSoftDeleteListeners() {
        document.querySelectorAll(".softDelete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                if (confirm("Are you sure you want to soft delete this user?")) {
                    softDeleteUser(id);
                }
            });
        });
    }

    // Attach soft delete event listeners
    function attachHardDeleteListeners() {
        document.querySelectorAll(".hardDelete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                if (confirm("Are you sure you want to hard delete this user?")) {
                    hardDeleteUser(id);
                }
            });
        });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "N/A";
        return new Date(dateTimeString).toLocaleString();
    }

    // Initial fetch
    fetchUsers();
});
