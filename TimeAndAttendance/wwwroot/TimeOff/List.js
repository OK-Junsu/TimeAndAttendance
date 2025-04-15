document.addEventListener("DOMContentLoaded", () => {
    const hardDeleteAllBtn = document.querySelector("#hardDeleteAllBtn");
    const includeDeletedCheckbox = document.querySelector("#includeDeleted");
    const yearFilter = document.querySelector("#yearFilter");
    const monthFilter = document.querySelector("#monthFilter");
    const tableBody = document.querySelector("#timeOffTable tbody");

    let allTimeOffs = []; // 전체 데이터를 저장

    // 데이터를 테이블에 렌더링
    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(timeOff => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${timeOff.id}</td>
                <td>${timeOff.userId}</td>
                <td>${timeOff.date}</td>
                <td>${timeOff.type}</td>
                <td>${timeOff.deletedAt ? formatToLocalDateTime(timeOff.deletedAt) : "N/A"}</td>
                <td>${timeOff.originId ? timeOff.originId : "N/A"}</td>
                <td>
                    <a href="Edit.html?id=${timeOff.id}" class="edit-btn">Edit</a>
                    <button class="softDelete-btn" data-id="${timeOff.id}">Soft Delete</button>
                    <button class="hardDelete-btn" data-id="${timeOff.id}">Hard Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Year 드롭다운 채우기
    function populateYearDropdown() {
        const years = [...new Set(allTimeOffs.map(to => new Date(to.date).getFullYear()))].sort((a, b) => b - a);
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
            allTimeOffs
                .filter(to => !selectedYear || new Date(to.date).getFullYear() === parseInt(selectedYear))
                .map(to => new Date(to.date).getMonth() + 1)
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

        return allTimeOffs.filter(to => {
            const date = new Date(to.date);
            const yearMatch = !selectedYear || date.getFullYear() === parseInt(selectedYear);
            const monthMatch = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
            const deletedMatch = includeDeleted || !to.deletedAt; // includeDeleted가 체크되었거나 삭제되지 않은 항목
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
    function fetchTimeOffs() {
        fetch("/api/TimeOffs") // 전체 데이터를 가져오는 API 호출
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch timeOffs");
                }
                return response.json();
            })
            .then(data => {
                allTimeOffs = data;
                populateYearDropdown();
                populateMonthDropdown();
                renderTable(allTimeOffs);
            })
            .catch(error => console.error("Error fetching time offs:", error));
    }

    // 초기화
    fetchTimeOffs();

    // Event listener for Hard Delete All button
    hardDeleteAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to hard delete all timeOffs? This action cannot be undone.")) {
            fetch("/api/TimeOffs/HardDelete", { method: "DELETE" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to hard delete all timeOffs");
                    }
                    alert("All timeOffs have been hard deleted successfully!");
                    fetchTimeOffs(); // Refresh the table
                })
                .catch(error => {
                    alert("Error hard deleting all timeOffs. Please try again.");
                    console.error("Error hard deleting all timeOffs:", error);
                });
        }
    });

    // Attach (hard or soft) delete event listeners
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("softDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to soft delete this timeOff?")) {
                deleteTimeOff(id, "soft");
            }
        }

        if (event.target.classList.contains("hardDelete-btn")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to hard delete this timeOff?")) {
                deleteTimeOff(id, "hard");
            }
        }
    });

    // Delete a timeOff
    function deleteTimeOff(id, type) {
        const endpoint = type === "soft" ? `/api/TimeOffs/SoftDelete/${id}` : `/api/TimeOffs/HardDelete/${id}`;
        const method = type === "soft" ? "PUT" : "DELETE";

        fetch(endpoint, { method })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to ${type} delete timeOff`);
                }
                alert(`TimeOff ${type} deleted successfully!`);
                fetchTimeOffs(); // Refresh the table
            })
            .catch(error => {
                alert(`Error ${type} deleting timeOff. Please try again.`);
                console.error(`Error ${type} deleting timeOff:`, error);
            });
    }

    function formatToLocalDateTime(dateTimeString) {
        if (!dateTimeString) return "N/A";
        return new Date(dateTimeString).toLocaleString();
    }
});
