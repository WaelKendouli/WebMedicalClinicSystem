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

bookAppointmentUI.btnChooseAppointment.addEventListener("click" , async ()=> {
    await LoadAllClinicServices();
})