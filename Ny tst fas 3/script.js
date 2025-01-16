function toggleModal(modalId, action) {
  const modal = document.getElementById(modalId);
  modal.style.display = action === 'open' ? 'block' : 'none';
}

// Login handler
function handleLogin(event) {
  event.preventDefault();
  const username = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="psw"]').value;

  if (username && password) {
    alert("Login successful! Redirecting to your profile.");
    window.location.href = "profile.html"; // Redirect to profile page
  } else {
    alert("Please enter valid credentials.");
  }
}

// Sign-up handler
function handleSignUp(event) {
  event.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="psw"]').value;
  const confirmPassword = document.querySelector('input[name="psw-repeat"]').value;

  if (email && password && password === confirmPassword) {
    alert("Sign-up successful! Redirecting to your profile.");
    window.location.href = "profile.html"; // Redirect to profile page
  } else {
    alert("Please fill in all fields correctly.");
  }
}

// Example Logout Functionality
function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html";
  }
  
  // Save Profile Data
  function saveProfile() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const skills = document.getElementById("skills").value;
    const bio = document.getElementById("bio").value;
  
    if (!name || !email) {
      alert("Please fill in all required fields.");
      return;
    }
  
    localStorage.setItem("profile", JSON.stringify({ name, email, skills, bio }));
    alert("Profile saved successfully!");
  }
  
  // Load Jobs
  document.addEventListener("DOMContentLoaded", () => {
    const jobListings = document.getElementById("job-listings");
  
    // Example job data (could come from a database/API)
    const jobs = [
      { title: "Frontend Developer", location: "Stockholm", description: "React/Angular experience preferred." },
      { title: "Backend Developer", location: "Gothenburg", description: "Experience with Node.js and databases required." },
      { title: "Fullstack Developer", location: "Malmo", description: "Knowledge of full development stack is a must." },
    ];
  
    if (jobListings) {
      jobs.forEach((job) => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
  
        jobCard.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>Location:</strong> ${job.location}</p>
          <p>${job.description}</p>
          <button>Apply Now</button>
        `;
  
        jobListings.appendChild(jobCard);
      });
    }
  });
  