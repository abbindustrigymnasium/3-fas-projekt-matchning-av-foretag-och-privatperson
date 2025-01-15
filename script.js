// Modal Toggle Function
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

// Profile Save Handler (Save Profile -> Navigate to edit page)
function handleSaveProfile(event) {
  event.preventDefault();
  alert("Profile saved! Redirecting to your profile view.");
  window.location.href = "adpage.html"; // Redirect to profile view page
}

// Profile Edit Button (From viewProfile.html to editProfile.html)
function editProfile() {
  window.location.href = "profile.html"; // Redirect to the edit profile page
}

// Job Filter Function
function filterJobs() {
  const filterValue = document.querySelector('#job-filter').value;
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach((jobCard) => {
    const jobTitle = jobCard.querySelector('.job-title').textContent.toLowerCase();
    if (jobTitle.includes(filterValue.toLowerCase())) {
      jobCard.style.display = 'block';
    } else {
      jobCard.style.display = 'none';
    }
  });
}

// Logout function
function logout() {
  alert("Logging out...");
  window.location.href = "Main.html"; // Redirect back to main page
}
