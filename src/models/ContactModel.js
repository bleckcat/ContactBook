const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.valida = function() {
  this.cleanUp();

  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Invalid e-mail');
  if(!this.body.name) this.errors.push('Name is a required field');
  if(!this.body.email && !this.body.phone) {
    this.errors.push('At least one contact must be sent: email or phone');
  }
};

Contact.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    surname: this.body.surname,
    email: this.body.email,
    phone: this.body.phone,
  };
};

Contact.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Contact.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.findContacts = async function() {
  const contacts = await ContactModel.find()
    .sort({ criadoEm: -1 });
  return contacts;
};

Contact.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({_id: id});
  return contact;
};


module.exports = Contact;
