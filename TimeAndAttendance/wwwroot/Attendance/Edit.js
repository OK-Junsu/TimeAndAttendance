document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#editAttendanceForm");
    const urlParams = new URLSearchParams(window.location.search);
    const attendanceId = urlParams.get("id");

    // Fetch attendance data
    fetch(`/api/Attendances/${attendanceId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch attendance");
            }
            return response.json();
        })
        .then(attendance => {
            form.userId.value = attendance.userId;
            form.time.value = attendance.time;
            form.status.value = attendance.status;
        })
        .catch(error => {
            console.error("Error fetching attendance:", error);
        });

    // Soft Update attendance
    document.querySelector("#softUpdateBtn").addEventListener("click", () => {
        handleUpdate(attendanceId, "SoftPut")
    });

    // Hard Update attendance
    document.querySelector("#hardUpdateBtn").addEventListener("click", () => {
        handleUpdate(attendanceId, "HardPut")
    });

    // Handle attendance update (Soft or Hard)
    function handleUpdate(id, updateType) {
        const updatedAttendance = {
            id: parseInt(id),
            userId: form.userId.value,
            time: form.time.value,
            status: form.status.value
        };

        fetch(`/api/Attendances/${updateType}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAttendance)
        })
            .then(response => {
                if (!response.ok) {
                    alert(`Failed to ${updateType.toLowerCase()} update attendance`);
                    throw new Error(`Failed to ${updateType.toLowerCase()} update attendance`);
                }
                alert(`Attendance ${updateType.toLowerCase()} updated successfully!`);
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error(`Error ${updateType.toLowerCase()} updating attendance:`, error);
            });
    };
});
