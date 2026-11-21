// Import all exports from CRUDhelper.js using the proper ES6 syntax
import * as CRUDHelper from "./CRUDhelper.js";
import * as obj_LocalStorage from "./CurrentObject.js";
import * as Spinner from './SpinnerHelper.js';

const Spinners = {
  DoctorsList :"spDoctors" ,
  AppointmentList : "spAppointments" ,
  CancelledList : "spCancelledAppointment" ,
  Modal : "spAddAppointments"
}

const bookAppointmentUI = {
  // Modal
  modal:            document.getElementById('bookAppointmentModal'),

  // Form
  form:             document.getElementById('bookAppointmentForm'),
  submitBtn:        document.getElementById('apptSubmitBtn'),
  btnChooseAppointment : document.getElementById('btn-chooseAppointment'),
  // Hidden fields
  doctorId:         document.getElementById('apptDoctorId'),
  patientId:        document.getElementById('apptPatientId'),
  startTimeHidden:  document.getElementById('apptStartTime'),
  endTimeHidden:    document.getElementById('apptEndTime'),
  statusId:         document.getElementById('apptStatusId'),

  // Doctor summary (read-only)
  doctorAvatar:     document.getElementById('apptDoctorAvatar'),
  doctorName:       document.getElementById('apptDoctorName'),
  doctorSpecialty:  document.getElementById('apptDoctorSpecialty'),
  doctorStatus:     document.getElementById('apptDoctorStatus'),

  // Selected appointment summary
  sumDate:          document.getElementById('sumDate'),
  sumStart:         document.getElementById('sumStart'),
  sumEnd:           document.getElementById('sumEnd'),
  sumService:       document.getElementById('sumService'),

  // User inputs
  service:          document.getElementById('apptService'),
  servicePrice:     document.getElementById('apptServicePrice'),
  date:             document.getElementById('apptDate'),
  startTimeSel:     document.getElementById('apptStartTimeSel'),
  endTimeSel:       document.getElementById('apptEndTimeSel'),

  // Feedback
  slotFeedback:     document.getElementById('slotFeedback'),
};

const doctorsListUI = {
  // Header elements
  headerContainer: document.querySelector('.card-header'),
  titleIcon:       document.querySelector('.bi-person-badge'),
  titleText:       document.querySelector('h5.mb-0.fw-semibold'),
  availableBadge:  document.querySelector('.badge.bg-primary-subtle'),

  listContainer:   document.getElementById('doctorsListContainer')
};

const UI_Search = {
  search:       document.getElementById('txtSearch'),
    specialities: document.getElementById('listSpecialities'),
    filterBtn:    document.getElementById('btnFilter'),
}

const obj_name = "current_loggedIn_User";


let CurrentDoctor = null;


function GenerateSpecialitiesList(specializations)
{
UI_Search.specialities.innerHTML = '<option value="" selected disabled>Select a speciality</option>'

      Object.entries(specializations).forEach(([name, id]) => {
      const opt = document.createElement('option');
      opt.value = id;          // specializationID — used for filtering
      opt.textContent = name;  // display name
     UI_Search.specialities.appendChild(opt);
})
}

async function LoadAllSpecialitiesForSearch(RenderingFunction)
{
try {
  const data = await CRUDHelper.Get("Doctors" , "GetSpecializations");
  if (data == null) {
    console.log("data is empty");
    return;
  }
  RenderingFunction(data);

} catch (error) {
  console.log(error.message);
}

}


function populateServiceDropdown(servicesData) {
  

  // 1. Reset the dropdown but keep the default placeholder option
  bookAppointmentUI.service.innerHTML = '<option value="" selected disabled>Select a service…</option>';

  // 2. Loop through the API data and create a new option for each service
  servicesData.forEach(service => {
    const option = document.createElement('option');
    
    // Set the value to the serviceID
    option.value = service.serviceName;
    
    // Add the price as a data attribute (formatted as a raw number)
    option.setAttribute('data-price', service.price);
    option.setAttribute('data-id', service.serviceID);

    
    // Format the display text
    // Example: "General Consultation — 50 DA"
    option.textContent = `${service.serviceName} — ${service.price} DA`;
    
    // Optional: Add a title attribute so hovering shows the description
    option.title = service.description;

    // Append the option to the select element
    bookAppointmentUI.service.appendChild(option);
  });
}





async function LoadDoctorsTable(RenderingFunction)
{
  try {
    Spinner.ShowSpinner(Spinners.DoctorsList);
    const data = await CRUDHelper.Get("Doctors" , "GetAllDoctors");
      RenderingFunction(data);
  } catch (error) {
    console.log(error.message);
  }
  finally {
    Spinner.HideSpinner(Spinners.DoctorsList);
  }

}

function renderDoctorsTable(doctors) {

  // 2. Clear existing rows
  doctorsListUI.listContainer.innerHTML = '';

  // 3. Handle Empty State
  if (!doctors || doctors.length === 0) {
    doctorsListUI.listContainer.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted p-4">
          <i class="bi bi-person-x fs-3 d-block mb-2"></i>
          No doctors available at the moment.
        </td>
      </tr>`;
    return;
  }

  // 4. Loop through doctors and build the table rows
  doctors.forEach(doc => {
    
    // Build the Avatar URL (Fallback to initials if photoURL is empty)
    const initials = `${doc.firstName ? doc.firstName[0] : ''}${doc.lastName ? doc.lastName[0] : ''}`;
    const avatarUrl = doc.photoURL 
      ? doc.photoURL 
      : `https://ui-avatars.com/api/?name=${initials}&background=e7f1ff&color=0d6efd&size=32&bold=true`;

    // Determine Availability (Checking the scheduel object)
    const isAvailable = doc.scheduel && doc.scheduel.isActive;
    const badgeClass = isAvailable ? 'bg-success-subtle text-success border-success' : 'bg-danger-subtle text-danger border-danger';
    const statusText = isAvailable ? 'Available' : 'Off Duty';

    // Create the table row
    const tr = document.createElement('tr');
    
    // Store ID for reference
    tr.dataset.doctorId = doc.doctorID;

    tr.innerHTML = `
      <td>
        <input class="form-check-input" type="radio" name="doctorSelect" value="${doc.doctorID}">
      </td>
      <td>
        <div class="d-flex align-items-center gap-4 w-100">
          <img src="${avatarUrl}" alt="${doc.firstName}" class="rounded-circle object-fit-cover" width="32" height="32">
          <span class="fw-semibold">Dr. ${doc.firstName} ${doc.lastName}</span>
        </div>
      </td>
      <td><span class="text-muted">${doc.specialization || 'General'}</span></td>
      <td><a href="mailto:${doc.email}" class="text-decoration-none">${doc.email}</a></td>
      <td>${doc.phone || 'N/A'}</td>
      <td>
        <span class="badge ${badgeClass} border rounded-pill">${statusText}</span>
      </td>
      <td>
        <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 book-btn" data-id="${doc.doctorID}">
          <i class="bi bi-calendar-plus me-1"></i>Book
        </button>
      </td>
    `;

    // Attach Event Listener to the Book button inside this row
    const bookBtn = tr.querySelector('.book-btn');
    bookBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); 
      CurrentDoctor = doc;
     await InitializeDialogComponenets();
       const bsModal = bootstrap.Modal.getOrCreateInstance(bookAppointmentUI.modal);
      bsModal.show();
    });

    // Append the completed row to the table body
    doctorsListUI.listContainer.appendChild(tr);
  });
}


function renderBookAppointmentModal(doctor) {
  const ui = bookAppointmentUI;

  // Doctor summary
  const initials = `${doctor.firstName?.[0] ?? ''}${doctor.lastName?.[0] ?? ''}`;
  ui.doctorAvatar.src = doctor.photoURL
    || `https://ui-avatars.com/api/?name=${initials}&background=e7f1ff&color=0d6efd&size=64&bold=true`;
  ui.doctorName.textContent = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  ui.doctorSpecialty.textContent = doctor.specialization || 'General';

  const isActive = !!doctor.scheduel?.isActive;
  ui.doctorStatus.textContent = isActive ? 'Available' : 'Off Duty';
  ui.doctorStatus.className = `badge border rounded-pill ${
    isActive ? 'bg-success-subtle text-success border-success'
             : 'bg-danger-subtle text-danger border-danger'
  }`;

  // Hidden + reset fields
  ui.doctorId.value = doctor.doctorID;
  ui.startTimeHidden.value = '';
  ui.endTimeHidden.value = '';
  ui.statusId.value = '';

  // Reset summary + inputs
  ui.sumDate.textContent = ui.sumStart.textContent = ui.sumEnd.textContent = ui.sumService.textContent = '—';
  ui.date.value = ui.service.value = ui.servicePrice.value = '';
  ui.slotFeedback.textContent = '';

  // Slots: "08:00:00" -> "08:00"
  const slots = [...new Set((doctor.scheduel?.liTimeSlots || []).map(t => t.slice(0, 5)))];

  // Fill start time
  ui.startTimeSel.innerHTML = `<option value="" disabled selected>Select start time…</option>`;
  slots.forEach(t => ui.startTimeSel.add(new Option(t, t)));

  // Reset end time
  ui.endTimeSel.innerHTML = `<option value="" disabled selected>Select end time…</option>`;

  // On start change, fill end time with later slots
  ui.startTimeSel.onchange = () => {
    const start = ui.startTimeSel.value;
    const laterSlots = slots.slice(slots.indexOf(start) + 1);

    ui.endTimeSel.innerHTML = `<option value="" disabled selected>Select end time…</option>`;
    laterSlots.forEach(t => ui.endTimeSel.add(new Option(t, t)));

    ui.startTimeHidden.value = start;
    ui.sumStart.textContent = start;
  };

  // On end change, update hidden + summary
  ui.endTimeSel.onchange = () => {
    ui.endTimeHidden.value = ui.endTimeSel.value;
    ui.sumEnd.textContent = ui.endTimeSel.value || '—';
  };



}


async function InitializeDialogComponenets()
{
  
  try {
   await LoadAllClinicServices();
  await renderBookAppointmentModal(CurrentDoctor);

  } catch (error) {
    console.log(error.message);
  }

}


async function LoadAllClinicServices()
{
    try {
        const data = await CRUDHelper.Get("ClinicServices" , "GetAllSerivces");
        if (data != null) {
            populateServiceDropdown(data);
        }

    } catch (error) {
        console.log(error.message);
    }

}

/**
 * Renders the tbody of the appointments table.
 * @param {Array} appointments - array of us_AppointmentItemDTO objects
 */
function renderAppointmentsTable(appointments) {
  const tbody = document.getElementById('appointmentsTableBody');
  tbody.innerHTML = '';

  // Empty state (colspan must match the 8 columns)
  if (!appointments || appointments.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted p-4">
          <i class="bi bi-calendar-x fs-3 d-block mb-2"></i>
          No appointments found.
        </td>
      </tr>`;
    return;
  }

  // Helpers -----------------------------------------------------------
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (t) => (t ? t.slice(0, 5) : '—'); // "10:30:00" -> "10:30"

  const statusBadge = (status) => {
    const map = {
      'Scheduled': 'bg-primary-subtle text-primary border-primary',
      'Completed': 'bg-success-subtle text-success border-success',
      'Cancelled': 'bg-danger-subtle  text-danger  border-danger',
      'Pending'  : 'bg-warning-subtle text-warning border-warning'
    };
    const cls = map[status] || 'bg-secondary-subtle text-secondary border-secondary';
    return `<span class="badge ${cls} border rounded-pill">${status}</span>`;
  };

  // Rows --------------------------------------------------------------
  appointments.forEach(appt => {
    const tr = document.createElement('tr');
    tr.dataset.appointmentId = appt.appointmentID;

    // Cancel is only meaningful while the appointment is still active
    const canCancel = appt.status !== 'Cancelled' && appt.status !== 'Completed';

    tr.innerHTML = `
      <td class="text-muted">#${appt.appointmentID}</td>
      <td class="text-start fw-semibold">${formatDate(appt.date)}</td>
      <td>${appt.doctorName}</td>
      <td>${statusBadge(appt.status)}</td>
      <td>${appt.service}</td>
      <td><i class="bi bi-clock me-1 text-muted"></i>${formatTime(appt.start)}</td>
      <td>${formatTime(appt.end)}</td>
      <td class="text-end">
        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1 btn-view">
          <i class="bi bi-eye me-1"></i>View
        </button>
        <button type="button"
                class="btn btn-sm btn-outline-danger rounded-pill px-3 btn-cancel"
                ${canCancel ? '' : 'disabled'}>
          <i class="bi bi-x-circle me-1"></i>Cancel
        </button>
      </td>
    `;

    // Events
    tr.querySelector('.btn-view').addEventListener('click', () => {
      console.log('View appointment', appt.appointmentID);
      // e.g. open details modal / navigate
    });

    const cancelBtn = tr.querySelector('.btn-cancel');
    if (canCancel) {
      cancelBtn.addEventListener('click', () => {
        cancelAppointment(appt.appointmentID);
      });
    }

    tbody.appendChild(tr);
  });
}

async function cancelAppointment(appointmentID)
{
try {
  Spinner.ShowSpinner(Spinners.CancelledList);
  Spinner.ShowSpinner(Spinners.AppointmentList);
  const res = await CRUDHelper.Put(appointmentID , null , "Appointment" , "CancelAppointment");
  if (res===true) {
    console.log("appointment canceled successfully")
        await LoadCurrentAppointments(renderAppointmentsTable);
        await LoadCancelledAppointments(renderCancelledAppointmentsTable);
  }
  else
  {
    console.log("cancelation failed , it may becuase of the clinic cancelation policy within the range of 24 hour");
  }

} catch (error) {
  throw new Error(error.message);
}
finally
{
  Spinner.HideSpinner(Spinners.CancelledList);
  Spinner.HideSpinner(Spinners.AppointmentList);
}
}


/**
 * Renders the tbody of the appointments table.
 * @param {Array} appointments - array of us_AppointmentItemDTO objects
 */
function renderCancelledAppointmentsTable(appointments) {
  const tbody = document.getElementById('CancelledTable');
  tbody.innerHTML = '';

  // Empty state (colspan must match the 8 columns)
  if (!appointments || appointments.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted p-4">
          <i class="bi bi-calendar-x fs-3 d-block mb-2"></i>
          No appointments found.
        </td>
      </tr>`;
    return;
  }

  // Helpers -----------------------------------------------------------
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (t) => (t ? t.slice(0, 5) : '—'); // "10:30:00" -> "10:30"

  const statusBadge = (status) => {
    const map = {
      'Scheduled': 'bg-primary-subtle text-primary border-primary',
      'Completed': 'bg-success-subtle text-success border-success',
      'Cancelled': 'bg-danger-subtle  text-danger  border-danger',
      'Pending'  : 'bg-warning-subtle text-warning border-warning'
    };
    const cls = map[status] || 'bg-secondary-subtle text-secondary border-secondary';
    return `<span class="badge ${cls} border rounded-pill">${status}</span>`;
  };

  // Rows --------------------------------------------------------------
  appointments.forEach(appt => {
    const tr = document.createElement('tr');
    tr.dataset.appointmentId = appt.appointmentID;

   

    tr.innerHTML = `
      <td class="text-muted">#${appt.appointmentID}</td>
      <td class="text-start fw-semibold">${formatDate(appt.date)}</td>
      <td>${appt.doctorName}</td>
      <td>${statusBadge(appt.status)}</td>
      <td>${appt.service}</td>
      <td><i class="bi bi-clock me-1 text-muted"></i>${formatTime(appt.start)}</td>
      <td>${formatTime(appt.end)}</td>
    `;

    tbody.appendChild(tr);
  });
}

async function LoadCurrentAppointments(RenderingFunction)
{
try {
  Spinner.ShowSpinner(Spinners.AppointmentList);
  const patient = obj_LocalStorage.GetCurrent(obj_name);
  if (patient === null) {
    throw new Error("patient data is unavailable");
  }
  const data = await CRUDHelper.GetByAttribute("Appointment" ,"GetAppointmentList" , patient.patientID);
  if (data === null) {
    console.log("no appointments for this patient");
  }
  else
  {
    RenderingFunction(data);
  }

} catch (error) {
  console.log(error.message);
}
finally
{
  Spinner.HideSpinner(Spinners.AppointmentList);
}
}

async function LoadCancelledAppointments(RenderingFunction)
{
try {
  Spinner.ShowSpinner(Spinners.CancelledList);
  const patient = obj_LocalStorage.GetCurrent(obj_name);
  if (patient === null) {
    throw new Error("patient data is unavailable");
  }
  const data = await CRUDHelper.GetByAttribute("Appointment" ,"GetCancelledAppointmentList" , patient.patientID);
  if (data === null) {
    console.log("no appointments for this patient");
  }
  else
  {
    RenderingFunction(data);
  }

} catch (error) {
  console.log(error.message);
}
finally {
  Spinner.HideSpinner(Spinners.CancelledList);
}
}



async function AddNewAppointment()
{
  try {
    Spinner.ShowSpinner(Spinners.Modal);
    const p = obj_LocalStorage.GetCurrent(obj_name);
    if (!p) throw new Error("No logged-in user found.");

    const ui = bookAppointmentUI;

    // --- Validate required fields before building the DTO ---
    const serviceOption = ui.service.selectedOptions[0];
    const serviceID = serviceOption?.getAttribute("data-id");
    const doctorID  = ui.doctorId.value;
    const date      = ui.date.value;
    const startTime = ui.startTimeHidden.value;
    const endTime   = ui.endTimeHidden.value;

    if (!doctorID)             throw new Error("Doctor is not selected.");
    if (!date)                 throw new Error("Appointment date is missing.");
    if (!startTime || !endTime) throw new Error("Start/end time is missing.");
    if (!serviceID)            throw new Error("Service is not selected.");

    // --- Build the DTO matching AppointmentDTO ---
    const objNewApp = {
      appointmentID:       0,             // server assigns (identity / auto-increment)
      issueDate:           new Date().toISOString(), // booking timestamp
      date:                date,             // "YYYY-MM-DD" from <input type="date">
      startTime:           startTime,        // "HH:mm"
      endTime:             endTime,          // "HH:mm"
      doctorID:            Number(doctorID),
      patientID:           Number(p.patientID),
      appointmentStatusID: 1, // always scheduled
      serviceID:           Number(serviceID)
    };


    const res = await CRUDHelper.Post(objNewApp , "Appointment" , "AddNewAppointment");
    return (res === true);
  } catch (e) {
    console.log(e.message);
  }
  finally{
        Spinner.HideSpinner(Spinners.Modal);
  }
}


document.addEventListener("DOMContentLoaded", async () => {
    await LoadDoctorsTable(renderDoctorsTable);
    await LoadAllSpecialitiesForSearch(GenerateSpecialitiesList);
    await LoadCurrentAppointments(renderAppointmentsTable);
    await LoadCancelledAppointments(renderCancelledAppointmentsTable);

});


bookAppointmentUI.submitBtn.addEventListener("click" , async () => {
try {
  if (await AddNewAppointment()===true) {
console.log("Appointment added successfully");
  await LoadCurrentAppointments(renderAppointmentsTable);
  } 
} catch (error) {
  console.log(error.message);
}
})

bookAppointmentUI.service.onchange = () => {
bookAppointmentUI.sumService.textContent = bookAppointmentUI.service.value;
}
bookAppointmentUI.date.onchange = () => {
  bookAppointmentUI.sumDate.textContent = bookAppointmentUI.date.value; 
}