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
                        <td>
                            <a href="Edit.html?id=${user.id}" class="edit-btn">Edit</a>
                            <button class="delete-btn" data-id="${user.id}">Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                attachDeleteListeners();
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    // Delete a user
    function deleteUser(id) {
        fetch(`/api/Users/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete user");
                }
                fetchUsers(); // Refresh the table
            })
            .catch(error => {
                console.error("Error deleting user:", error);
            });
    }

    // Attach delete event listeners
    function attachDeleteListeners() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this user?")) {
                    deleteUser(id);
                }
            });
        });
    }

    // Initial fetch
    fetchUsers();
});
