document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#editBusinessDayForm");
    const urlParams = new URLSearchParams(window.location.search);
    const businessDayId = urlParams.get("id");

    // Fetch business day data
    fetch(`/api/BusinessDays/${businessDayId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch business day");
            }
            return response.json();
        })
        .then(businessDay => {
            form.date.value = businessDay.date;
            form.type.value = businessDay.type;
            form.description.value = businessDay.description;
        })
        .catch(error => {
            console.error("Error fetching business day:", error);
        });

    // Soft update business day
    document.querySelector("#softUpdateBtn").addEventListener("click", () => {
        handleUpdate(businessDayId, "SoftPut")
    });

    // Hard update business day
    document.querySelector("#hardUpdateBtn").addEventListener("click", () => {
        handleUpdate(businessDayId, "HardPut")
    });

    // Handle business day update (Soft or Hard)
    function handleUpdate(id, updateType) {
        const updatedBusinessDay = {
            id: parseInt(id),
            date: form.date.value,
            type: form.type.value,
            description: form.description.value
        };

        fetch(`/api/BusinessDays/${updateType}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedBusinessDay)
        })
            .then(response => {
                if (!response.ok) {
                    alert(`Failed to ${updateType.toLowerCase()} update business day`);
                    throw new Error(`Failed to ${updateType.toLowerCase()} update business day`);
                }
                alert(`Business day ${updateType.toLowerCase()} updated successfully!`);
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error(`Error ${updateType.toLowerCase()} updating business Day:`, error);
            });
    };
});
