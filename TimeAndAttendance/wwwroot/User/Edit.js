document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#editUserForm");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    // Fetch user data
    fetch(`/api/Users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user");
            }
            return response.json();
        })
        .then(user => {
            form.name.value = user.name;
            form.joiningDate.value = user.joiningDate;
            form.resignationDate.value = user.resignationDate || "";
        })
        .catch(error => {
            console.error("Error fetching user:", error);
        });

    // Soft Update user
    document.querySelector("#softUpdateBtn").addEventListener("click", () => {
        handleUpdate(userId, "SoftPut")
    });

    // Hard Update user
    document.querySelector("#hardUpdateBtn").addEventListener("click", () => {
        handleUpdate(userId, "HardPut")
    });

    // Handle user update (Soft or Hard)
    function handleUpdate(id, updateType) {
        const updatedUser = {
            id: parseInt(id),
            name: form.name.value,
            joiningDate: form.joiningDate.value,
            resignationDate: form.resignationDate.value || null
        };

        fetch(`/api/Users/${updateType}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => {
                if (!response.ok) {
                    alert(`Failed to ${updateType.toLowerCase()} update user`);
                    throw new Error(`Failed to ${updateType.toLowerCase()} update user`);
                }
                alert(`User ${updateType.toLowerCase()} updated successfully!`);
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error(`Error ${updateType.toLowerCase()} updating user:`, error);
            });
    };
});
