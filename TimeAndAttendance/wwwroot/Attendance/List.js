document.addEventListener("DOMContentLoaded", () => {
    const clearAllFilter = document.querySelector("#clearAllFilter");
    const thisMonthBtn = document.querySelector("#thisMonthBtn");
    const yearFilter = document.querySelector("#yearFilter");
    const monthFilter = document.querySelector("#monthFilter");
    const userFilter = document.querySelector("#userFilter");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const tableBody = document.querySelector("#attendanceTable tbody");
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1

    let allItems = []; // 전체 데이터를 저장
    let filteredItems = []; // 필터링 된 데이터를 저장

    // 데이터를 테이블에 렌더링
    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.userId}</td>
                <td>${formatToLocalDateTime(item.time)}</td>
                <td>${item.status}</td>
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

    // Year 드롭다운 채우기
    function populateYearDropdown(selectedUser) {
        const years = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedUser || item.userId === parseInt(selectedUser))
            .map(item => new Date(item.time).getFullYear()))].sort((a, b) => b - a);

        yearFilter.innerHTML = '<option value="">All Years</option>';
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Month 드롭다운 채우기
    function populateMonthDropdown(selectedYear, selectedUser) {
        const months = [...new Set(allItems
                .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
                .filter(item => !selectedYear || new Date(item.time).getFullYear() === parseInt(selectedYear))
                .filter(item => !selectedUser || item.userId === parseInt(selectedUser))
                .map(to => new Date(to.time).getMonth() + 1)
        )].sort((a, b) => a - b);

        monthFilter.innerHTML = '<option value="">All Months</option>';
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month.toString().padStart(2, "0"); // 두 자리 형식
            monthFilter.appendChild(option);
        });
    }

    // User 드롭다운 채우기
    function populateUserDropdown(selectedYear, selectedMonth) {
        const users = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedYear || new Date(item.time).getFullYear() === parseInt(selectedYear))
            .filter(item => !selectedMonth || (new Date(item.time).getMonth() + 1) === parseInt(selectedMonth))
            .map(item => item.userId))].sort((a, b) => a - b);

        userFilter.innerHTML = '<option value="">All Users</option>';
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user;
            option.textContent = user;
            userFilter.appendChild(option);
        });
    }

    // 필터링된 데이터 가져오기
    function getFilteredData() {
        const selectedYear = yearFilter.value;
        const selectedMonth = monthFilter.value;
        const selectedUser = userFilter.value;
        const includeDeleted = includeDeletedCheckbox.checked;

        var selectedItems = allItems.filter(item => {
            const date = new Date(item.time);

            const yearMatch = !selectedYear || date.getFullYear() === parseInt(selectedYear);
            const monthMatch = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
            const userMatch = !selectedUser || item.userId === parseInt(selectedUser);
            const deletedMatch = includeDeleted || !item.deletedAt; // includeDeleted가 체크되었거나 삭제되지 않은 항목

            return yearMatch && monthMatch && userMatch && deletedMatch;
        });

        filteredItems = selectedItems;

        return selectedItems;
    }

    // 필터 변경 시 데이터 필터링
    clearAllFilter.addEventListener("click", () => {
        yearFilter.value = '';
        monthFilter.value = '';
        userFilter.value = '';
        monthFilter.disabled = true;

        populateYearDropdown();
        populateMonthDropdown();
        populateUserDropdown();

        renderTable(getFilteredData());
    });

    thisMonthBtn.addEventListener("click", () => {
        const previousYear = currentYear.toString();
        const previousMonth = currentMonth.toString();
        const previousUser = userFilter.value;

        populateYearDropdown(previousUser);
        populateMonthDropdown(previousYear, previousUser);
        populateUserDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousUser)

        renderTable(getFilteredData());
    });

    yearFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousUser = userFilter.value;

        populateMonthDropdown(previousYear, previousUser);
        populateUserDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousUser)

        renderTable(getFilteredData());
    });

    monthFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousUser = userFilter.value;

        populateUserDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousUser)

        renderTable(getFilteredData());
    });

    userFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousUser = userFilter.value;

        populateYearDropdown(previousUser);
        populateMonthDropdown(previousYear, previousUser);
        restoreFilterSelection(previousYear, previousMonth, previousUser)

        renderTable(getFilteredData());
    });

    includeDeletedCheckbox.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousUser = userFilter.value;

        populateYearDropdown(previousUser);
        populateMonthDropdown(previousYear, previousUser);
        populateUserDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousUser)

        renderTable(getFilteredData());
    });

    // 초기 데이터 가져오기
    function fetchAllItem(isInitialFetch) {
        fetch("/api/Attendances") // 전체 데이터를 가져오는 API 호출
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch attendances");
                }
                return response.json();
            })
            .then(data => {
                allItems = data;

                // 현재 연도와 월로 초기 필터링 값 설정
                const previousYear = isInitialFetch ? currentYear.toString() : yearFilter.value;
                const previousMonth = isInitialFetch ? currentMonth.toString() : monthFilter.value;
                const previousUser = userFilter.value;

                populateYearDropdown(previousUser);
                populateMonthDropdown(previousYear, previousUser);
                populateUserDropdown(previousYear, previousMonth);
                restoreFilterSelection(previousYear, previousMonth, previousUser)

                renderTable(getFilteredData());
            })
            .catch(error => console.error("Error fetching attendances:", error));
    }

    // 초기화
    fetchAllItem(true);

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all attendances? This action cannot be undone.")) {
            fetch("/api/Attendances/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all attendances");
                    }
                    alert("All attendances have been hard deleted successfully!");
                    fetchAllItem(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all attendances. Please try again.");
                    console.error("Error hard deleting all attendances:", error);
                });
        }
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
                fetchAllItem(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting attendance. Please try again.`);
                console.error(`Error ${type} deleting attendance:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleString();
    }

    function restoreFilterSelection(previousYear, previousMonth, previousUser) {
        const yearOptions = Array.from(yearFilter.options).map(option => option.value);
        const monthOptions = Array.from(monthFilter.options).map(option => option.value);
        const userOptions = Array.from(userFilter.options).map(option => option.value);

        yearFilter.value = yearOptions.includes(previousYear) ? previousYear : ""; // Default: All Years
        monthFilter.value = monthOptions.includes(previousMonth) ? previousMonth : ""; // Default: All Months
        userFilter.value = userOptions.includes(previousUser) ? previousUser : ""; // Default: All Users

        monthFilter.disabled = !yearFilter.value;
    }
});
