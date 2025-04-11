document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#createAttendanceForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const attendance = {
            userId: form.userId.value,
            time: form.time.value,
            status: form.status.value
        };

        fetch("/api/Attendances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendance)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create attendance");
                }
                alert("Attendance created successfully!");
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error("Error creating attendance:", error);
            });
    });
});
