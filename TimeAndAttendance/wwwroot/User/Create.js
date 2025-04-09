document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#createUserForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const user = {
            name: form.name.value,
            joiningDate: form.joiningDate.value,
            resignationDate: form.resignationDate.value || null
        };

        fetch("/api/Users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create user");
                }
                alert("User created successfully!");
                window.location.href = "List.html";
            })
            .catch(error => {
                console.error("Error creating user:", error);
            });
    });
});
