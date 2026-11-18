// Import all exports from CRUDhelper.js using the proper ES6 syntax
import * as CRUDHelper from "./CRUDhelper.js";
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


function populateServiceDropdown(servicesData) {
  

  // 1. Reset the dropdown but keep the default placeholder option
  bookAppointmentUI.service.innerHTML = '<option value="" selected disabled>Select a service…</option>';

  // 2. Loop through the API data and create a new option for each service
  servicesData.forEach(service => {
    const option = document.createElement('option');
    
    // Set the value to the serviceID
    option.value = service.serviceID;
    
    // Add the price as a data attribute (formatted as a raw number)
    option.setAttribute('data-price', service.price);
    
    // Format the display text
    // Example: "General Consultation — 50 DA"
    option.textContent = `${service.serviceName} — ${service.price} DA`;
    
    // Optional: Add a title attribute so hovering shows the description
    option.title = service.description;

    // Append the option to the select element
    bookAppointmentUI.service.appendChild(option);
  });
}



/**
 * Placeholder for your selection logic
 */
function handleDoctorSelection(doctor) {
  console.log(`Selected Doctor ID: ${doctor.doctorID} - Dr. ${doctor.firstName} ${doctor.lastName}`);
  
  // Example: Open the appointment modal and fill hidden fields
  // document.getElementById('apptDoctorId').value = doctor.doctorID;
  // document.getElementById('apptDoctorName').textContent = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  // document.getElementById('apptDoctorSpecialty').textContent = doctor.specialization;
  
  // const modal = new bootstrap.Modal(document.getElementById('bookAppointmentModal'));
  // modal.show();
}

async function LoadDoctorsTable(RenderingFunction)
{
const data = await CRUDHelper.Get("Doctors" , "GetAllDoctors");
RenderingFunction(data);
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
      await LoadAllClinicServices();
       const bsModal = bootstrap.Modal.getOrCreateInstance(bookAppointmentUI.modal);
      bsModal.show();
    });

    // Append the completed row to the table body
    doctorsListUI.listContainer.appendChild(tr);
  });
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


document.addEventListener("DOMContentLoaded", async () => {
    await LoadDoctorsTable(renderDoctorsTable);
})