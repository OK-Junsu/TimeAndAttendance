document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#editTimeOffForm");
    const urlParams = new URLSearchParams(window.location.search);
    const timeOffId = urlParams.get("id");

    // Fetch time-Off data
    fetch(`/api/TimeOffs/${timeOffId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch time-Off");
            }
            return response.json();
        })
        .then(timeOff => {
            form.userId.value = timeOff.userId;
            form.date.value = timeOff.date;
            form.type.value = timeOff.type;
        })
        .catch(error => {
            console.error("Error fetching time-Off:", error);
        });

    // Soft update time-Off
    document.querySelector("#softUpdateBtn").addEventListener("click", () => {
        handleUpdate(timeOffId, "SoftPut")
    });

    // Hard update time-Off
    document.querySelector("#hardUpdateBtn").addEventListener("click", () => {
        handleUpdate(timeOffId, "HardPut")
    });

    // Handle time-Off update (Soft or Hard)
    function handleUpdate(id, updateType) {
        const updatedTimeOff = {
            id: parseInt(id),
            userId: form.userId.value,
            date: form.date.value,
            type: form.type.value,
        };

        fetch(`/api/TimeOffs/${updateType}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTimeOff)
        })
            .then(response => {
                if (!response.ok) {
                    alert(`Failed to ${updateType.toLowerCase()} update time-Off`);
                    throw new Error(`Failed to ${updateType.toLowerCase()} update time-Off`);
                }
                alert(`time-Off ${updateType.toLowerCase()} updated successfully!`);
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error(`Error ${updateType.toLowerCase()} updating time-Off:`, error);
            });
    };
});
