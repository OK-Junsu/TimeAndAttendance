document.addEventListener("DOMContentLoaded", () => {
    const clearAllFilter = document.querySelector("#clearAllFilter");
    const thisMonthBtn = document.querySelector("#thisMonthBtn");
    const yearFilter = document.querySelector("#yearFilter");
    const monthFilter = document.querySelector("#monthFilter");
    const typeFilter = document.querySelector("#typeFilter");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const tableBody = document.querySelector("#businessDayTable tbody");
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1

    let allItems = []; // 전체 데이터를 저장
    let filteredItems = []; // 필터링 된 데이터를 저장

    // 데이터를 테이블에 렌더링
    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(businessDay => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${businessDay.id}</td>
                <td>${businessDay.date}</td>
                <td>${businessDay.type}</td>
                <td>${businessDay.description || ""}</td> 
                <td>${businessDay.deletedAt ? formatToLocalDateTime(businessDay.deletedAt) : ""}</td>
                <td>${businessDay.originId ? businessDay.originId : ""}</td>
                <td>
                    <a href="Edit.html?id=${businessDay.id}" class="edit-btn">Edit</a>
                    <button class="softDelete-btn" data-id="${businessDay.id}">Soft Delete</button>
                    <button class="hardDelete-btn" data-id="${businessDay.id}">Hard Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Update tableSummary
        totalItemsCount.textContent = allItems.length;
        filteredItemsCount.textContent = filteredItems.length;
    }

    // Year 드롭다운 채우기
    function populateYearDropdown(selectedType) {
        const years = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedType || item.type === selectedType)
            .map(item => new Date(item.date).getFullYear())
        )].sort((a, b) => b - a);

        yearFilter.innerHTML = '<option value="">All Years</option>';
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Month 드롭다운 채우기
    function populateMonthDropdown(selectedYear, selectedType) {
        const months = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear))
            .filter(item => !selectedType || item.type === selectedType)
            .map(item => new Date(item.date).getMonth() + 1)
        )].sort((a, b) => a - b);

        monthFilter.innerHTML = '<option value="">All Months</option>';
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month.toString().padStart(2, "0"); // 두 자리 형식
            monthFilter.appendChild(option);
        });
    }

    // Type 드롭다운 채우기
    function populateTypeDropdown(selectedYear, selectedMonth) {
        const types = [...new Set(allItems
            .filter(item => includeDeletedCheckbox.checked || !item.deletedAt)
            .filter(item => !selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear))
            .filter(item => !selectedMonth || (new Date(item.date).getMonth() + 1) === parseInt(selectedMonth))
            .map(item => item.type)
        )].sort((a, b) => a - b);

        typeFilter.innerHTML = '<option value="">All Types</option>';
        types.forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type.toString();
            typeFilter.appendChild(option);
        });
    }

    // 필터링된 데이터 가져오기
    function getFilteredData() {
        const selectedYear = yearFilter.value;
        const selectedMonth = monthFilter.value;
        const selectedType = typeFilter.value;
        const includeDeleted = includeDeletedCheckbox.checked;

        var selectedItems = allItems.filter(item => {
            const date = new Date(item.date);

            const yearMatch = !selectedYear || date.getFullYear() === parseInt(selectedYear);
            const monthMatch = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
            const typeMatch = !selectedType || item.type === selectedType;
            const deletedMatch = includeDeleted || !item.deletedAt; // includeDeleted가 체크되었거나 삭제되지 않은 항목

            return yearMatch && monthMatch && typeMatch && deletedMatch;
        });

        filteredItems = selectedItems;

        return selectedItems;
    }

    // 필터 변경 시 데이터 필터링
    clearAllFilter.addEventListener("click", () => {
        yearFilter.value = '';
        monthFilter.value = '';
        typeFilter.value = '';
        monthFilter.disabled = true;

        populateYearDropdown();
        populateMonthDropdown();
        populateTypeDropdown();

        renderTable(getFilteredData());
    });

    thisMonthBtn.addEventListener("click", () => {
        const previousYear = currentYear.toString();
        const previousMonth = currentMonth.toString();
        const previousType = typeFilter.value;

        populateYearDropdown(previousType);
        populateMonthDropdown(previousYear, previousType);
        populateTypeDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousType)

        renderTable(getFilteredData());
    });

    yearFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousType = typeFilter.value;

        populateMonthDropdown(previousYear, previousType); // 선택된 Year에 따라 Month 목록 갱신
        populateTypeDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousType)

        renderTable(getFilteredData());
    });

    monthFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousType = typeFilter.value;

        populateTypeDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousType)

        renderTable(getFilteredData());
    });

    typeFilter.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousType = typeFilter.value;

        populateYearDropdown(previousType);
        populateMonthDropdown(previousYear, previousType);
        restoreFilterSelection(previousYear, previousMonth, previousType)

        renderTable(getFilteredData());
    });

    includeDeletedCheckbox.addEventListener("change", () => {
        const previousYear = yearFilter.value;
        const previousMonth = monthFilter.value;
        const previousType = typeFilter.value;

        populateYearDropdown(previousType);
        populateMonthDropdown(previousYear, previousType);
        populateTypeDropdown(previousYear, previousMonth);
        restoreFilterSelection(previousYear, previousMonth, previousType)

        renderTable(getFilteredData());
    });

    // 초기 데이터 가져오기
    function fetchAllItem(isInitialFetch) {
        fetch("/api/BusinessDays") // 전체 데이터를 가져오는 API 호출
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch businessDays");
                }
                return response.json();
            })
            .then(data => {
                allItems = data;


                // 현재 연도와 월로 초기 필터링 값 설정
                const previousYear = isInitialFetch ? currentYear.toString() : yearFilter.value;
                const previousMonth = isInitialFetch ? currentMonth.toString() : monthFilter.value;
                const previousType = typeFilter.value;

                populateYearDropdown(previousType);
                populateMonthDropdown(previousYear, previousType);
                populateTypeDropdown(previousYear, previousMonth);
                restoreFilterSelection(previousYear, previousMonth, previousType)

                renderTable(getFilteredData());
            })
            .catch(error => console.error("Error fetching business days:", error));
    }

    // 초기화
    fetchAllItem(true);

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all businessDays? This action cannot be undone.")) {
            fetch("/api/BusinessDays/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all businessDays");
                    }
                    alert("All businessDays have been hard deleted successfully!");
                    fetchAllItem(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all businessDays. Please try again.");
                    console.error("Error hard deleting all businessDays:", error);
                });
        }
    });

    // Attach (hard or soft) delete event listeners
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("softDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to soft delete this businessDay?")) {
                deleteBusinessDay(id, "soft");
            }
        }

        if (event.target.classList.contains("hardDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to hard delete this businessDay?")) {
                deleteBusinessDay(id, "hard");
            }
        }
    });

    // Delete a businessDay
    function deleteBusinessDay(id, type) {
        const endpoint = type === "soft" ? `/api/BusinessDays/SoftDelete/${id}` : `/api/BusinessDays/HardDelete/${id}`;
        const method = type === "soft" ? "PUT" : "DELETE";

        fetch(endpoint, { method })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to ${type} delete businessDay`);
                }
                alert(`BusinessDay ${type} deleted successfully!`);
                fetchAllItem(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting businessDay. Please try again.`);
                console.error(`Error ${type} deleting businessDay:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleString();
    }

    function restoreFilterSelection(previousYear, previousMonth, previousType) {
        const yearOptions = Array.from(yearFilter.options).map(option => option.value);
        const monthOptions = Array.from(monthFilter.options).map(option => option.value);
        const typeOptions = Array.from(typeFilter.options).map(option => option.value);

        yearFilter.value = yearOptions.includes(previousYear) ? previousYear : "";
        monthFilter.value = monthOptions.includes(previousMonth) ? previousMonth : "";
        typeFilter.value = typeOptions.includes(previousType) ? previousType : "";

        monthFilter.disabled = !yearFilter.value;
    }
});
