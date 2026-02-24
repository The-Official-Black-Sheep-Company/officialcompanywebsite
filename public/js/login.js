// Login Page Script
function openLegalPopup() {
  window.open(
    "legal.html",
    "Legal",
    "width=800,height=600,scrollbars=yes,resizable=yes"
  );
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Password visibility toggle
  const togglePasswordBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-password');
  
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  }
});
