import { extGetAllDoctors, extGetSpeciSpecializations } from "./DoctorsAPI.js";
import { GetPatientInfos } from "./CurrentPatient.js";
import { SetCurrentDoctor , GetCurrentDoctor } from "./CurrentDoctor.js";
import {Post , Get , Delete , Put , GetByAttribute} from "./CRUDhelper.js";



const UI = {
    tableContainer : document.getElementById("tableContainer") ,
    diagAddNew : document.getElementById("diagAddNew"),
    loadingSpin : document.getElementById("loadingSpin") ,
    frmInfo : {
        form : document.getElementById("frmInfo") ,
        appointmentStatusList : document.getElementById("appointmentStatusId"),
        btnSubmit : document.getElementById("btnSubmit") ,
        btnCancelForm : document.getElementById("btnCancelForm")
    } ,
    AppointmentTableContainer : document.getElementById("App_Placeholder")
}


function setLoading(display)
{
  if (display===false) {
    UI.loadingSpin.style.display = "none";
  }
  else
  {
    UI.loadingSpin.style.display = "flex";
  }
}
/**
 * Renders the doctors list into the .doctors-table tbody.
 * Uses only document.createElement + appendChild (no innerHTML).
 * @param {Array} doctors - Array of doctor objects from the API/JSON.
 */
function renderDoctorsTable(doctors) {
  // --- Wrap ---
  UI.tableContainer.innerHTML ="";

  // --- Table ---
  const table = document.createElement('table');
  table.className = 'doctors-table';

  // --- Thead ---
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  const headers = ['ID', 'Name', 'Specialty', 'Gender', 'Email', 'Actions'];
  headers.forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  // --- Tbody ---
  const tbody = document.createElement('tbody');

  if (!Array.isArray(doctors) || doctors.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = headers.length;
    td.textContent = 'No doctors found.';
    td.style.textAlign = 'center';
    td.style.padding = '2rem';
    td.style.color = '#64748b';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    doctors.forEach((doc) => {
      const tr = document.createElement('tr');
      tr.dataset.doctorId = doc.doctorID;

      // ID
      const tdId = document.createElement('td');
      const strongId = document.createElement('strong');
      strongId.textContent = `#D-${String(doc.doctorID).padStart(4, '0')}`;
      tdId.appendChild(strongId);
      tr.appendChild(tdId);

      // Name
      const tdName = document.createElement('td');
      tdName.textContent =
        `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`.trim();
      tr.appendChild(tdName);

      // Specialty
      const tdSpecialty = document.createElement('td');
      tdSpecialty.textContent = doc.specialization || 'N/A';
      tr.appendChild(tdSpecialty);

      // Gender
      const tdGender = document.createElement('td');
      tdGender.textContent = doc.gender || 'N/A';
      tr.appendChild(tdGender);

      // Email
      const tdEmail = document.createElement('td');
      tdEmail.textContent = doc.email || 'N/A';
      tr.appendChild(tdEmail);

      // Actions
      const tdActions = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'btn-edit';
      btn.textContent = 'choose doctor';
      btn.dataset.doctorId = doc.doctorID;
      btn.addEventListener("click" ,()=>{
        SetCurrentDoctor(doc);
        UI.diagAddNew.showModal();
      });
      
      tdActions.appendChild(btn);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  }

  table.appendChild(tbody);
  UI.tableContainer.appendChild(table);
}

/**
 * Placeholder handler when a doctor is chosen.
 * Replace with your actual logic (open modal, fill form, etc.).
 */
async function AddNewAppointment()
{
    const NewAppointment = {
      date  : document.getElementById("date").value ,
      time : document.getElementById("time").value ,
       doctorID : Number(GetCurrentDoctor().doctorID) ,
       patientID : Number(GetPatientInfos().patientID) ,
       appointmentStatusID : Number(document.getElementById("appointmentStatusId").value) 
    } 
    try {

      if (await Post(NewAppointment , "Appointment" , "AddNewAppointment")===true) {
         UI.diagAddNew.close();
         console.log("Appointment added succesfully");
      }
      else
      {
         console.log("Adding Appointment failed");
      }

    } catch (error) {
      console.log(error.message);
    }
    
}


function onChooseDoctor(doctor) {
  console.log('Chosen doctor:', doctor);
}

function renderAppointmentsTable(appointments) {

    UI.AppointmentTableContainer.classList.add('cus-table-wrap');
  // --- Table ---
  const table = document.createElement('table');
  table.className = 'cus-table';

  // --- Thead ---
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  const headers = ['AppointmentID', 'Patient Name', 'Doctor Name', 'Field', 'Status', 'Date', 'Time', 'Actions'];
  headers.forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  // --- Tbody ---
  const tbody = document.createElement('tbody');

  if (!Array.isArray(appointments) || appointments.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = headers.length;
    td.textContent = 'No appointments found.';
    td.style.textAlign = 'center';
    td.style.padding = '2rem';
    td.style.color = '#64748b';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    appointments.forEach((appt) => {
      const tr = document.createElement('tr');
      tr.dataset.appointmentId = appt.appointmentID;

      // Appointment ID
      const tdId = document.createElement('td');
      const strongId = document.createElement('strong');
      strongId.textContent = `#A-${String(appt.appointmentID).padStart(4, '0')}`;
      tdId.appendChild(strongId);
      tr.appendChild(tdId);

      // Patient Name (FullName)
      const tdPatient = document.createElement('td');
      tdPatient.textContent = appt.fullName || 'N/A';
      tr.appendChild(tdPatient);

      // Doctor Name
      const tdDoctor = document.createElement('td');
      tdDoctor.textContent = appt.doctorName || 'N/A';
      tr.appendChild(tdDoctor);

      // Field
      const tdField = document.createElement('td');
      tdField.textContent = appt.field || 'N/A';
      tr.appendChild(tdField);

      // Status
      const tdStatus = document.createElement('td');
      tdStatus.textContent = appt.appointmentStatus || 'N/A';
      tr.appendChild(tdStatus);

      // Date
      const tdDate = document.createElement('td');
      tdDate.textContent = appt.date
        ? new Date(appt.date).toLocaleDateString()
        : 'N/A';
      tr.appendChild(tdDate);

      // Time
      const tdTime = document.createElement('td');
      tdTime.textContent = appt.time;
      tr.appendChild(tdTime);

      // Actions
      const tdActions = document.createElement('td');
      tdActions.classList.add("row-actions");
      const btn = document.createElement('button');
      btn.dataset.id = "btnEditAppointment";
      btn.textContent = 'Edit Appointment';
      btn.addEventListener('click', () => {
        console.log('Appointment selected:', appt);
      });
      const btnCancel = document.createElement("button");
      btnCancel.dataset.id = "btnCancel";
      btnCancel.textContent = "Cancel";
      btnCancel.style.background = "hsla(5, 100%, 50%, 0.67)";
      btnCancel.addEventListener("click" , ()=>{
        // add the cancel method here 
      });


      tdActions.appendChild(btn);
      tdActions.appendChild(btnCancel);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  }

  table.appendChild(tbody);

  // --- Mount ---
  UI.AppointmentTableContainer.innerHTML = '';
  UI.AppointmentTableContainer.appendChild(table);
}


async function DispalyAppointmentsForPatient()
{
  try
  {
          const Appointments = await GetByAttribute("Appointment" , "GetAppointmentList" , GetPatientInfos().patientID);
        if (Appointments.length > 0) {
          renderAppointmentsTable(Appointments);
        }
        else
        {
          console.log("no appointnents were found");
        }
  }
  catch(e)
  {
    throw new Error(e.message);
  }

}

async function  DispalyDoctorsData() {
  try
  {
    setLoading(true);
const data = await extGetAllDoctors();
    await renderDoctorsTable(data);
    setLoading(false);
  }
  catch(e){
    console.log(e.message);
    setLoading(false);
  }
  finally
  {
    setLoading(false);
  }
    
}

document.addEventListener("DOMContentLoaded", DispalyDoctorsData);
document.addEventListener("DOMContentLoaded" , GetPatientInfos);
document.addEventListener("DOMContentLoaded",DispalyAppointmentsForPatient);

UI.frmInfo.btnCancelForm.addEventListener("click" , () => {
  UI.diagAddNew.close();
})
UI.frmInfo.btnSubmit.addEventListener("click" , async ()=> {
  await  AddNewAppointment();
  await DispalyAppointmentsForPatient();
});