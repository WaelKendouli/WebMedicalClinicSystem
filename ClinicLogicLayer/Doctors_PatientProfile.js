
import * as objLoading from './h_LoadAndRender.js';
import * as objSpinner from './SpinnerHelper.js';
import * as objCrud from './CRUDhelper.js';
import * as objEmail from './h_EmailModule.js';
import * as objUser from './CurrentObject.js';


const spinner = {
    doctors : "doctorsList",
    sendEmail : "sendingEmail"
}

const ContactDialog = {
  // Elements
  dialog:       document.getElementById('ContactDialog'),
  subjectInput: document.getElementById('txtSub'),
  bodyInput:    document.getElementById('txtbody'),
  btnSend:    document.getElementById('btnSend'),
  closeBtn:     document.getElementById('btnClose')
}

let SelectedDoctor = undefined ;

/**
 * Render doctor cards into the doctor grid.
 * @param {Array<Object>|Object} doctors - Array (or single object) of doctors from the API.
 */
export function renderDoctors(doctors) {
  const container = document.querySelector('#doctorGrid');
  if (!container) {
    console.error('renderDoctors: #doctorGrid container not found');
    return;
  }

  // Normalize: accept a single object or an array
  const list = Array.isArray(doctors) ? doctors : doctors ? [doctors] : [];

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5 text-muted">
        <i class="bi bi-people fs-1 d-block mb-2"></i>
        <p class="mb-0">No doctors found.</p>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach((doc) => {
    const fullName       = `Dr. ${doc.firstName ?? ''} ${doc.lastName ?? ''}`.trim();
    const specialization = doc.specialization ?? 'General Practitioner';
    const photo          = doc.photoURL || '/Clinic-1.0.0/assets/img/health/staff-4.webp';
    const bio            = doc.bio || 'No biography available.';
    const email          = doc.email || '';
    const schedule       = doc.scheduel || {};
    const hours          = schedule.startTime && schedule.endTime
      ? `${schedule.startTime.slice(0, 5)} – ${schedule.endTime.slice(0, 5)}`
      : 'Hours not set';

    const col = document.createElement('div');
    col.className = 'col-12 col-lg-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img class="card-img-top object-fit-cover"
             style="height: 300px;"
             src="${escapeHtml(photo)}"
             alt="${escapeHtml(fullName)}"
             onerror="this.src='/Clinic-1.0.0/assets/img/health/staff-4.webp'"
             loading="lazy">

        <div class="card-body d-flex flex-column">
          <h2 class="card-title h5 mb-1">${escapeHtml(fullName)}</h2>

          <span class="badge rounded-pill text-bg-light border mb-2 align-self-start">
            <i class="bi bi-heart-pulse me-1"></i>${escapeHtml(specialization)}
          </span>

          <p class="card-text text-muted flex-grow-1">${escapeHtml(bio)}</p>

          <p class="card-text small text-secondary mb-3">
            <i class="bi bi-clock me-1"></i>${escapeHtml(hours)}
          </p>

          <button  type="button"
                  class="btn btn-primary rounded-2 w-100 btnContact"
                  commandfor="ContactDialog"
                  command="show-modal"
                  data-doctor-id="${doc.doctorID ?? ''}"
                  data-doctor-email="${escapeHtml(email)}"
                  data-doctor-name="${escapeHtml(fullName)}">
            <i class="bi bi-envelope-paper me-1"></i> Contact
          </button>
        </div>
      </div>
    `;
    

    fragment.appendChild(col);
  });

  container.appendChild(fragment);

  document.getElementById('doctorGrid')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.btnContact');
  if (!btn) return;
  // find the doctor in the last-rendered list by email, or store it on the button:
  // simplest: pass what you need via data-* attributes (already there)
  SelectedDoctor = {
    email: btn.dataset.doctorEmail,
    name:  btn.dataset.doctorName
  };
});
}

/** Escape user-supplied strings to avoid breaking HTML / XSS. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function DisplayDoctors()
{
    try {
        objSpinner.ShowSpinner(spinner.doctors);
        await objLoading.LoadDoctors(renderDoctors);
    } catch (error) {
        throw new Error(error.message);
    }
    finally{
        objSpinner.HideSpinner(spinner.doctors);
    }
}

async function TrySendEmail()
{
    try {
        objSpinner.ShowSpinner(spinner.sendEmail);
        const EmailDTO = {
            from : "exampleEmail@gmail.com", // for testing
            to : SelectedDoctor.email ,
            subject : "this is subject" ,
            body : "this is body"
        }
      const res =  await objEmail.SendEmail(EmailDTO);
      if (res===true) {
        console.log("email sending process was executed succcessfully");
        return true ;
      }
    } catch (error) {
        throw new Error(error.message);
    }
    finally{
        objSpinner.HideSpinner(spinner.sendEmail);
    }
    return false;
}



document.addEventListener("DOMContentLoaded", async () => {
    await DisplayDoctors();
});

ContactDialog.btnSend.addEventListener("click" , async ()=> {
await TrySendEmail();
});