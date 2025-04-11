document.addEventListener("DOMContentLoaded", () => {
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const tableBody = document.querySelector("#attendanceTable tbody");

    // Fetch and display attendances
    function fetchAttendances() {
        tableBody.innerHTML = ""; // Clear existing rows before fetching new data
        const endpoint = includeDeletedCheckbox.checked ? "/api/Attendances" : "/api/Attendances/NotDeleted";
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch attendances");
                }
                return response.json();
            })
            .then(attendances => {
                tableBody.innerHTML = ""; // Clear existing rows
                attendances.forEach(attendance => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${attendance.id}</td>
                        <td>${attendance.userId}</td>
                        <td>${formatToLocalDateTime(attendance.time)}</td>
                        <td>${attendance.status}</td>
                        <td>${attendance.deletedAt ? formatToLocalDateTime(attendance.deletedAt) : "N/A"}</td>
                        <td>${attendance.originId ? attendance.originId : "N/A"}</td>
                        <td>
                            <a href="Edit.html?id=${attendance.id}" class="edit-btn">Edit</a>
                            <button class="softDelete-btn" data-id="${attendance.id}">Soft Delete</button>
                            <button class="hardDelete-btn" data-id="${attendance.id}">Hard Delete</button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Error fetching attendances:", error);
            });
    }

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all attendances? This action cannot be undone.")) {
            fetch("/api/Attendances/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all attendances");
                    }
                    alert("All attendances have been hard deleted successfully!");
                    fetchAttendances(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all attendances. Please try again.");
                    console.error("Error hard deleting all attendances:", error);
                });
        }
    });

    // Attach event listener to the checkbox
    includeDeletedCheckbox.addEventListener("change", () => {
        fetchAttendances();
    });

    // Attach (hard or soft) delete event listeners
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("softDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to soft delete this attendance?")) {
                deleteAttendance(id, "soft");
            }
        }

        if (event.target.classList.contains("hardDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to hard delete this attendance?")) {
                deleteAttendance(id, "hard");
            }
        }
    });

    // Delete a attendance
    function deleteAttendance(id, type) {
        const endpoint = type === "soft" ? `/api/Attendances/SoftDelete/${id}` : `/api/Attendances/HardDelete/${id}`;
        const method = type === "soft" ? "PUT" : "DELETE";

        fetch(endpoint, { method })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to ${type} delete attendance`);
                }
                alert(`Attendance ${type} deleted successfully!`);
                fetchAttendances(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting attendance. Please try again.`);
                console.error(`Error ${type} deleting attendance:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "N/A";
        return new Date(dateTimeString).toLocaleString();
    }

    // Initial fetch
    fetchAttendances();
});
