import * as CRUD_API from './CRUDhelper.js';

/* ---------- HEADER / ACTION BUTTONS ---------- */
var HeaderUI = {
  editProfileBtn:    document.querySelector('[data-bs-target="#editProfileModal"]'),
  changePhotoBtn:    document.querySelector('[data-bs-target="#changeMyPhoto"]'),
  changePasswordBtn: document.querySelector('[data-bs-target="#changeMyPassword"]'),
  avatarImg:         document.querySelector('.profile-avatar'),
  nameHeading:       document.querySelector('.profile-header h1'),
  statusBadge:       document.querySelector('.profile-header .badge')
};

/* ---------- MAIN INFO (read-only display) ---------- */
var MainInfoUI = {
  email:     document.getElementById('your-email'),
  phone:     document.getElementById('your-phone'),
  firstName: document.getElementById('your-fname'),
  lastName:  document.getElementById('your-lname'),
  gender:    document.getElementById('your-gender'),
  role:      document.getElementById('your-role'),
  dob:       document.getElementById('your-dob'),
  bloodType: document.getElementById('your-blood')
};

/* ---------- EDIT PROFILE MODAL ---------- */
var EditProfileUI = {
  modalEl: document.getElementById('editProfileModal'),
  form:    document.getElementById('editProfileForm'),
  inputs: {
    firstName: document.getElementById('edit-fname'),
    lastName:  document.getElementById('edit-lname'),
    email:     document.getElementById('edit-email'),
    phone:     document.getElementById('edit-phone'),
    gender:    document.getElementById('edit-gender'),
    dob:       document.getElementById('edit-dob')
  },
  buttons: {
    cancel: document.querySelector('#editProfileModal [data-bs-dismiss="modal"]'),
    submit: document.querySelector('#editProfileForm button[type="submit"]')
  }
};

/* ---------- CHANGE PASSWORD MODAL ---------- */
var ChangePasswordUI = {
  modalEl: document.getElementById('changeMyPassword'),
  form:    document.getElementById('changeMyPasswordForm'),
  inputs: {
    previous: document.getElementById('prv-password'),
    newPwd:   document.getElementById('new-password'),
    confirm:  document.getElementById('confirm-password')
  },
  buttons: {
    cancel: document.querySelector('#changeMyPassword [data-bs-dismiss="modal"]'),
    submit: document.querySelector('#changeMyPasswordForm button[type="submit"]')
  }
};

/* ---------- CHANGE PHOTO MODAL ---------- */
var ChangePhotoUI = {
  modalEl:    document.getElementById('changeMyPhoto'),
  form:       document.getElementById('changeMyPhotoForm'),
  previewImg: document.querySelector('#changeMyPhoto img'),
  chooseBtn:  document.querySelector('#changeMyPhoto button.btn-primary')
};

var ProfileSync = {

  /** Fill edit-profile form with current displayed values */
  hydrateEditForm: function () {
    EditProfileUI.inputs.firstName.value = MainInfoUI.firstName.textContent.trim();
    EditProfileUI.inputs.lastName.value  = MainInfoUI.lastName.textContent.trim();
    EditProfileUI.inputs.email.value     = MainInfoUI.email.textContent.trim();
    EditProfileUI.inputs.phone.value     = MainInfoUI.phone.textContent.trim();
    EditProfileUI.inputs.gender.value    = MainInfoUI.gender.textContent.trim();

    var dobText = MainInfoUI.dob.textContent.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dobText)) {
      EditProfileUI.inputs.dob.value = dobText;
    }
  },

  /** Push form values into displayed main info */
  applyEditProfile: function () {
    MainInfoUI.firstName.textContent = EditProfileUI.inputs.firstName.value;
    MainInfoUI.lastName.textContent  = EditProfileUI.inputs.lastName.value;
    MainInfoUI.email.textContent     = EditProfileUI.inputs.email.value;
    MainInfoUI.phone.textContent     = EditProfileUI.inputs.phone.value;
    MainInfoUI.gender.textContent    = EditProfileUI.inputs.gender.value;
    if (EditProfileUI.inputs.dob.value) {
      MainInfoUI.dob.textContent = EditProfileUI.inputs.dob.value;
    }
  },

  /** True if new password matches confirmation and is non-empty */
  isPasswordChangeValid: function () {
    var n = ChangePasswordUI.inputs.newPwd.value;
    var c = ChangePasswordUI.inputs.confirm.value;
    return n.length > 0 && n === c;
  }
};