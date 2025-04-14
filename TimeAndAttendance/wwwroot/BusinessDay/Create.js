document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#createBusinessDayForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const businessDay = {
            date: form.date.value,
            type: form.type.value,
            description: form.description.value
        };

        fetch("/api/BusinessDays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(businessDay)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create businessDay");
                }
                alert("Business Day created successfully!");
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error("Error creating business Day:", error);
            });
    });
});
