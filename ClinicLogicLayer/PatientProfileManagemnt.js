import * as CRUD_API from './CRUDhelper.js';
import * as LoggedInUser from './CurrentObject.js';
const ObjName = 'current_loggedIn_User';
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
  dob:       document.getElementById('your-dob'),
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

const Toast = {
  el:      document.getElementById('tst'),
  titleEl: document.getElementById('tst-Title'),
  msgEl:   document.getElementById('tst-message'),

  // Bootstrap colors we support
  variants: {
    success: 'bg-success',
    danger:  'bg-danger',
    warning: 'bg-warning',
    info:    'bg-info',
    primary: 'bg-primary',
    dark:    'bg-dark'
  },

  /** Set the toast color by variant name (success | danger | warning | info | primary | dark) */
  setColor: function (variant) {
    // Remove any existing bg-* class
    Object.keys(this.variants).forEach(function (key) {
      Toast.el.classList.remove(Toast.variants[key]);
    });
    // Add the requested one (fallback to success)
    var cls = this.variants[variant] || this.variants.success;
    this.el.classList.add(cls);
  },

  /** Show the toast with a title + message + color */
  show: function (message, variant, title) {
    this.titleEl.textContent = title || (variant === 'danger' ? 'Error' : 'Success');
    this.msgEl.textContent   = message || '';
    this.setColor(variant || 'success');
    this.el.classList.add('show');
    this.el.style.display = 'block';

    // Auto-hide after 4 seconds
    clearTimeout(this._timer);
    this._timer = setTimeout(function () {
      Toast.el.classList.remove('show');
      Toast.el.style.display = 'none';
    }, 4000);
  },

  hide: function () {
    clearTimeout(this._timer);
    this.el.classList.remove('show');
    this.el.style.display = 'none';
  }
};

/* ---------- Shortcuts ---------- */
function toastSuccess(message, title) {
  Toast.show(message, 'success', title || 'Success');
}

function toastError(message, title) {
  Toast.show(message, 'danger', title || 'Error');
}

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



/*async function UpdateMainUserData()
{
 try {
    let currentPatientData = LoggedInUser.GetCurrent(ObjName);
    if (await ) {
        
    }

 } catch (error) {
    console.log(error.message);
 }

}*/
