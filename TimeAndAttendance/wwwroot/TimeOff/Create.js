document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#createTimeOffForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const timeOff = {
            userId: form.userId.value,
            date: form.date.value,
            type: form.type.value,
        };

        fetch("/api/TimeOffs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(timeOff)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create time-Off");
                }
                alert("Time-Off created successfully!");
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error("Error creating time-off:", error);
            });
    });
});
