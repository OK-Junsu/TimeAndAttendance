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

    // Update user
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedUser = {
            id: parseInt(userId),
            name: form.name.value,
            joiningDate: form.joiningDate.value,
            resignationDate: form.resignationDate.value || null
        };

        fetch(`/api/Users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update user");
                }
                alert("User updated successfully!");
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error("Error updating user:", error);
            });
    });
});
