document.addEventListener("DOMContentLoaded", () => {
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const yearFilter = document.querySelector("#yearFilter");
    const monthFilter = document.querySelector("#monthFilter");
    const tableBody = document.querySelector("#businessDayTable tbody");

    let allBusinessDays = []; // 전체 데이터를 저장

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
                <td>${businessDay.deletedAt ? formatToLocalDateTime(businessDay.deletedAt) : "N/A"}</td>
                <td>${businessDay.originId ? businessDay.originId : "N/A"}</td>
                <td>
                    <a href="Edit.html?id=${businessDay.id}" class="edit-btn">Edit</a>
                    <button class="softDelete-btn" data-id="${businessDay.id}">Soft Delete</button>
                    <button class="hardDelete-btn" data-id="${businessDay.id}">Hard Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Year 드롭다운 채우기
    function populateYearDropdown() {
        const years = [...new Set(allBusinessDays.map(bd => new Date(bd.date).getFullYear()))].sort((a, b) => b - a);
        yearFilter.innerHTML = '<option value="">All Years</option>';
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Month 드롭다운 채우기
    function populateMonthDropdown(selectedYear) {
        const months = [...new Set(
            allBusinessDays
                .filter(bd => !selectedYear || new Date(bd.date).getFullYear() === parseInt(selectedYear))
                .map(bd => new Date(bd.date).getMonth() + 1)
        )].sort((a, b) => a - b);

        monthFilter.innerHTML = '<option value="">All Months</option>';
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month.toString().padStart(2, "0"); // 두 자리 형식
            monthFilter.appendChild(option);
        });
    }

    // 필터링된 데이터 가져오기
    function getFilteredData() {
        const selectedYear = yearFilter.value;
        const selectedMonth = monthFilter.value;
        const includeDeleted = includeDeletedCheckbox.checked;

        return allBusinessDays.filter(bd => {
            const date = new Date(bd.date);
            const yearMatch = !selectedYear || date.getFullYear() === parseInt(selectedYear);
            const monthMatch = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
            const deletedMatch = includeDeleted || !bd.deletedAt; // includeDeleted가 체크되었거나 삭제되지 않은 항목
            return yearMatch && monthMatch && deletedMatch;
        });
    }

    // 필터 변경 시 데이터 필터링
    yearFilter.addEventListener("change", () => {
        populateMonthDropdown(yearFilter.value); // 선택된 Year에 따라 Month 목록 갱신
        renderTable(getFilteredData());
    });

    monthFilter.addEventListener("change", () => {
        renderTable(getFilteredData());
    });

    includeDeletedCheckbox.addEventListener("change", () => {
        renderTable(getFilteredData());
    });

    // 초기 데이터 가져오기
    function fetchBusinessDays() {
        fetch("/api/BusinessDays") // 전체 데이터를 가져오는 API 호출
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch businessDays");
                }
                return response.json();
            })
            .then(data => {
                allBusinessDays = data;
                populateYearDropdown();
                populateMonthDropdown();
                renderTable(allBusinessDays);
            })
            .catch(error => console.error("Error fetching business days:", error));
    }

    // 초기화
    fetchBusinessDays();

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all businessDays? This action cannot be undone.")) {
            fetch("/api/BusinessDays/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all businessDays");
                    }
                    alert("All businessDays have been hard deleted successfully!");
                    fetchBusinessDays(); // Refresh the table
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
                fetchBusinessDays(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting businessDay. Please try again.`);
                console.error(`Error ${type} deleting businessDay:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "N/A";
        return new Date(dateTimeString).toLocaleString();
    }
});
