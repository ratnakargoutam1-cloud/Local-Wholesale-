let selectedRole = null;

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role').forEach((el, i) => {
    el.classList.toggle(
      'active',
      (role === 'retailer' && i === 0) || (role === 'wholesaler' && i === 1)
    );
  });

  const label = role === 'retailer' ? '🛍️ Dukandaar account selected' : '🏪 Wholesaler account selected';
  document.getElementById('selected').textContent = label;
  document.getElementById('selected').classList.remove('hidden');
  document.getElementById('continueBtn').classList.remove('hidden');
}

function continueToSignup() {
  if (!selectedRole) return;
  localStorage.setItem('localWholesaleRole', selectedRole);
  alert(
    selectedRole === 'retailer'
      ? 'Dukandaar signup page next step mein banega.'
      : 'Wholesaler signup page next step mein banega.'
  );
}
