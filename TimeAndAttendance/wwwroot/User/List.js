document.addEventListener("DOMContentLoaded", () => {
    const clearAllFilter = document.querySelector("#clearAllFilter");
    const nameFilter = document.querySelector("#nameFilter");
    const dateFilter = document.querySelector("#dateFilter");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const tableBody = document.querySelector("#userTable tbody");
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");

    let allItems = []; // 전체 데이터를 저장
    let filteredItems = []; // 필터링 된 데이터를 저장

    // 데이터를 테이블에 렌더링
    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.joiningDate}</td>
                <td>${item.resignationDate || ""}</td>
                <td>${item.deletedAt ? formatToLocalDateTime(item.deletedAt) : ""}</td>
                <td>${item.originId ? item.originId : ""}</td>
                <td>
                    <a href="Edit.html?id=${item.id}" class="edit-btn">Edit</a>
                    <button class="softDelete-btn" data-id="${item.id}">Soft Delete</button>
                    <button class="hardDelete-btn" data-id="${item.id}">Hard Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Update tableSummary
        totalItemsCount.textContent = allItems.length;
        filteredItemsCount.textContent = filteredItems.length;
    }

    // Name 드롭다운 채우기
    function populateNameDropdown(selectedDate) {
        const names = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedDate || item.joiningDate === selectedDate)
            .map(item => item.name))].sort((a, b) => a - b);

        nameFilter.innerHTML = '<option value="">All Names</option>';
        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            nameFilter.appendChild(option);
        });
    }

    // Date 드롭다운 채우기
    function populateDateDropdown(selectedName) {
        const dates = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedName || item.name === selectedName)
            .map(item => item.joiningDate))].sort((a, b) => b - a);

        dateFilter.innerHTML = '<option value="">All Dates</option>';
        dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });
    }

    // 필터링된 데이터 가져오기
    function getFilteredData() {
        const selectedName = nameFilter.value;
        const selectedDate = dateFilter.value;
        const includeDeleted = includeDeletedCheckbox.checked;

        var selectedItems = allItems.filter(item => {
            const nameMatch = !selectedName || item.name === selectedName;
            const dateMatch = !selectedDate || item.joiningDate === selectedDate;
            const deletedMatch = includeDeleted || !item.deletedAt; // includeDeleted가 체크되었거나 삭제되지 않은 항목

            return nameMatch && dateMatch && deletedMatch;
        });

        filteredItems = selectedItems;

        return selectedItems;
    }

    // 필터 변경 시 데이터 필터링
    clearAllFilter.addEventListener("click", () => {
        nameFilter.value = '';
        dateFilter.value = '';

        populateNameDropdown();
        populateDateDropdown();

        renderTable(getFilteredData());
    });

    nameFilter.addEventListener("change", () => {
        const previousName = nameFilter.value;
        const previousDate = dateFilter.value;

        populateDateDropdown(previousName);
        restoreFilterSelection(previousName, previousDate)

        renderTable(getFilteredData());
    });

    dateFilter.addEventListener("change", () => {
        const previousName = nameFilter.value;
        const previousDate = dateFilter.value;

        populateNameDropdown(previousDate);
        restoreFilterSelection(previousName, previousDate)

        renderTable(getFilteredData());
    });

    includeDeletedCheckbox.addEventListener("change", () => {
        const previousName = nameFilter.value;
        const previousDate = dateFilter.value;

        populateNameDropdown(previousDate);
        populateDateDropdown(previousName);
        restoreFilterSelection(previousName, previousDate)

        renderTable(getFilteredData());
    });

    // Fetch and display users
    function fetchAllItem() {
        fetch("/api/Users")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then(data => {
                allItems = data;

                const previousName = nameFilter.value;
                const previousDate = dateFilter.value;

                populateNameDropdown(previousDate);
                populateDateDropdown(previousName);
                restoreFilterSelection(previousName, previousDate)

                renderTable(getFilteredData());
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    // 초기화
    fetchAllItem();

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all users? This action cannot be undone.")) {
            fetch("/api/Users/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all users");
                    }
                    alert("All users have been hard deleted successfully!");
                    fetchAllItem(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all users. Please try again.");
                    console.error("Error hard deleting all users:", error);
                });
        }
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
                fetchAllItem(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting user. Please try again.`);
                console.error(`Error ${type} deleting user:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleString();
    }

    function restoreFilterSelection(previousName, previousDate) {
        const nameOptions = Array.from(nameFilter.options).map(option => option.value);
        const dateOptions = Array.from(dateFilter.options).map(option => option.value);

        nameFilter.value = nameOptions.includes(previousName) ? previousName : "";
        dateFilter.value = dateOptions.includes(previousDate) ? previousDate : "";
    }
});
