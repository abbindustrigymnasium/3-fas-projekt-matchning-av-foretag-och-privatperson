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

  //Profil script
  function logout() {
    alert("Logging out...");
    window.location.href = "Main.html"; // Redirect back to main page
  }
  