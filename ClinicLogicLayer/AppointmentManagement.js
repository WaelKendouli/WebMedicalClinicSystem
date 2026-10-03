
import {GetCurrentDoctor} from "./CurrentDoctor.js";
import {Post , Get , Put , Delete} from "./CRUDhelper.js";


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
        UI.diagEdit.showModal();
        SelectedAppointment = appt;
      });
      const btnCancel = document.createElement("button");
      btnCancel.dataset.id = "btnCancel";
      btnCancel.textContent = "Cancel";
      btnCancel.style.background = "hsla(5, 100%, 50%, 0.67)";
      btnCancel.addEventListener("click" , ()=>{
        UI.Confirm.diagConfirm.showModal();
        SelectedAppointment = appt;
      });


      tdActions.appendChild(btn);
      tdActions.appendChild(btnCancel);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  }

  table.appendChild(tbody);

  // --- Mount ---
  
  UI.AppointmentTableContainer.appendChild(table);
}