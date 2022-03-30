import validator from 'validator';

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if(!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    if(!validator.isEmail(emailInput.value)) {
      alert('Invalid e-mail');
      error = true;
    }

    if(passwordInput.value.length < 8 || passwordInput.value.length > 36) {
      alert('Password must be between 8 and 36 characters');
      error = true;
    }

    if(!error) el.submit();
  }
}
