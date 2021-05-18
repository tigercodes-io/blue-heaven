export default class FormMessage {
  constructor(settings) {
    this.settings = settings;
    this.form = document.querySelector(settings.form);
    if (this.form && (typeof window.fetch === "function")) {
      this.url = this.form.getAttribute("action");
      this.formButton = this.form.querySelector(settings.button);
    }
  }

  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  getFormValues() {
    const formData = new FormData();
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach(field => {
      const fieldName = field.getAttribute("name");
      const fieldValue = field.value;
      formData.append(fieldName, fieldValue);
    });
    return formData;
  }

  validateForm() {
    const fields = this.form.querySelectorAll("[required]");
    let valid = true;
    fields.forEach(field => {
      if (valid) valid = !!field.value;
    });
    return valid;
  }

  onSendForm(event) {
    event.preventDefault();
    event.currentTarget.disabled = true;
    event.currentTarget.innerText = "Enviando...";
  }

  sendForm(event) {
    if (this.validateForm()) {
      this.onSendForm(event);
      fetch(this.url, {
        method: 'POST',
        body: this.getFormValues(),
      })
        .then(r => {
          if (!r.ok) throw Error(r.statusText);
          return r.text()
        })
        .then(body => this.displaySuccess())
        .catch(error => {
          this.displayError()
        });
    }
  }

  init() {
    if (this.form) {
      this.sendForm = this.sendForm.bind(this);
      this.formButton.addEventListener("click", this.sendForm);
    }
    return this;
  }
}
