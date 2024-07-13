document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://qfledge.vercel.app/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile information");
    }

    const profileData = await response.json();
    console.log("Profile Data:", profileData);

    // Update the DOM with the profile information
    document.getElementById("display-username").textContent =
      profileData.username;
    document.getElementById("display-email").textContent = profileData.email;
    const displayProfilePictureElement = document.getElementById(
      "display-profile-picture"
    );
    if (displayProfilePictureElement) {
      displayProfilePictureElement.src =
        `uploads/${profileData.profilePicture}` || "public/default.jpg";
    }

    const displayProfilePicture = document.getElementById("profile-picture");
    if (displayProfilePicture) {
      displayProfilePicture.src =
        `uploads/${profileData.profilePicture}` || "public/default.jpg";
    }

    const displayProfilePictureElements =
      document.querySelectorAll(".profile-picture");
    displayProfilePictureElements.forEach((element) => {
      element.src =
        `uploads/${profileData.profilePicture}` || "public/default.jpg";
    });

    const display = document.getElementById("display");
    if (display) {
      display.src =
        `uploads/${profileData.profilePicture}` || "public/default.jpg";
    }

    // Prefill the form with current user details
    document.getElementById("username").value = profileData.username;
    document.getElementById("email").value = profileData.email;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }

  // Handle form submission for profile update
  const form = document.getElementById("edit-profile-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:3000/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile information");
      }

      console.log("Profile updated successfully");
      // Refresh the page to show updated profile information
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  });
});
