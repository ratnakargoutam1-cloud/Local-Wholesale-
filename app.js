const SUPABASE_URL = 'https://izxvsvyvvtbaxtxgcfav.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XZmYflVzFZOujSbJFXlEuw_ml-zIviI';

let supabaseClient = null;
let mode = 'login';
let role = 'retailer';

function getSupabase() {
  if (!supabaseClient) {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('Supabase load nahi hua. Internet connection check karein.');
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
  }

  return supabaseClient;
}


// LOGIN / SIGNUP TAB
function showForm(selectedMode) {
  mode = selectedMode;

  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');

  const nameLabel = document.getElementById('nameLabel');
  const nameInput = document.getElementById('name');

  const emailLabel = document.getElementById('emailLabel');
  const emailInput = document.getElementById('email');

  const confirmLabel = document.getElementById('confirmLabel');
  const confirmInput = document.getElementById('confirm');

  const submitBtn = document.getElementById('submitBtn');

  if (mode === 'signup') {
    loginTab.classList.remove('active');
    signupTab.classList.add('active');

    nameLabel.classList.remove('hidden');
    nameInput.classList.remove('hidden');

    emailLabel.classList.remove('hidden');
    emailInput.classList.remove('hidden');

    confirmLabel.classList.remove('hidden');
    confirmInput.classList.remove('hidden');

    submitBtn.textContent = 'Create Account';
  } else {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');

    nameLabel.classList.add('hidden');
    nameInput.classList.add('hidden');

    emailLabel.classList.add('hidden');
    emailInput.classList.add('hidden');

    confirmLabel.classList.add('hidden');
    confirmInput.classList.add('hidden');

    submitBtn.textContent = 'Login';
  }

  document.getElementById('message').textContent = '';
}


// ROLE SELECTION
function selectRole(selectedRole) {
  role = selectedRole;

  const retailer = document.getElementById('retailerRole');
  const wholesaler = document.getElementById('wholesalerRole');

  retailer.classList.toggle('active', role === 'retailer');
  wholesaler.classList.toggle('active', role === 'wholesaler');
}


// LOGIN / SIGNUP SUBMIT
async function handleSubmit(event) {
  event.preventDefault();

  const message = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  message.textContent = '';
  submitBtn.disabled = true;

  try {
    const supabase = getSupabase();

    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;

    if (!mobile || !password) {
      throw new Error('Mobile number aur password enter karein.');
    }

    // Mobile ko Supabase ke liye email format mein use kar rahe hain
    const email = mobile.replace(/\D/g, '') + '@localwholesale.app';

    if (mode === 'signup') {
      const name = document.getElementById('name').value.trim();
      const confirm = document.getElementById('confirm').value;

      if (!name) {
        throw new Error('Naam enter karein.');
      }

      if (password !== confirm) {
        throw new Error('Password aur Confirm Password same nahi hain.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Account create nahi hua.');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: name,
          role: role,
          mobile: mobile
        });

      if (profileError) throw profileError;

      message.textContent =
        '✅ Account successfully create ho gaya!';

    } else {
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});

if (error) throw error;

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', data.user.id)
  .single();

if (profileError) throw profileError;
   
    message.textContent = '✅ Login successful!';

setTimeout(() => {
  window.location.href = 'retailer.html';
}, 500);
