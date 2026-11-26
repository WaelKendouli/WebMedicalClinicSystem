
import * as objLoading from './h_LoadAndRender.js'; 
import * as objSpinner from './SpinnerHelper.js'; 
import * as objCurrent from './CurrentObject.js';
import * as objActions from './h_CommonActionsModule.js';

let liAppointments = [];
const CurrentDoctor = objCurrent.GetCurrent("current_loggedIn_User"); 

const Spinners = {
 AppointmetCard:"spnApptCard",
 spnApptTable : "spnApptTable"
}



/**
 * Renders appointment rows into the <tbody> of the table whose id is "target".
 * @param {Array} Appointments - Array of objects matching us_AppointmentItemDTO
 */
function renderAppointmentsTable(Appointments) {
    const tbody = document.getElementById("target");
    if (!tbody) {
        console.error('Element with id "target" not found.');
        return;
    }

    // Clear existing rows
    tbody.innerHTML = "";

    // Handle empty state
    if (!Appointments || Appointments.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 9; // 8 data columns + 1 actions
        td.className = "text-center text-muted py-4";
        td.textContent = "No appointments found.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    liAppointments = Appointments; // Store for later use
    // Status -> badge color mapping
    const statusBadge = (status) => {
        const s = (status || "").toLowerCase();
        let cls = "bg-secondary";
        if (s.includes("confirm") || s.includes("active") || s.includes("complete")) cls = "bg-success";
        else if (s.includes("pend") || s.includes("schedul")) cls = "bg-warning text-dark";
        else if (s.includes("cancel") || s.includes("no-show")) cls = "bg-danger";
        else if (s.includes("info")) cls = "bg-info text-dark";
        return `<span class="badge ${cls} bg-opacity-75">${escapeHtml(status)}</span>`;
    };

    // TimeSpan -> "HH:MM" (accepts "09:30:00" string or {hours, minutes} object or numeric)
    const formatTime = (t) => {
        if (t == null) return "-";
        if (typeof t === "string") {
            // "09:30:00" or "09:30"
            const parts = t.split(":");
            return `${parts[0].padStart(2, "0")}:${(parts[1] || "00").padStart(2, "0")}`;
        }
        if (typeof t === "object" && "hours" in t) {
            // .NET TimeSpan serialized as {hours, minutes, seconds}
            return `${String(t.hours).padStart(2, "0")}:${String(t.minutes || 0).padStart(2, "0")}`;
        }
        if (typeof t === "number") {
            // total minutes fallback
            const h = Math.floor(t / 60);
            const m = t % 60;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        }
        return "-";
    };

    // Date formatting (handles ISO string or Date object)
    const formatDate = (d) => {
        if (!d) return "-";
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return "-";
        // Use local date parts to avoid timezone shifts (YYYY-MM-DD)
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const escapeHtml = (str) => {
        if (str == null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Build rows
    const fragment = document.createDocumentFragment();

    Appointments.forEach((appt) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="fw-semibold">#${escapeHtml(appt.appointmentID)}</td>
            <td>${formatDate(appt.date)}</td>
            <td>${escapeHtml(appt.DoctorName)}</td>
            <td>${statusBadge(appt.status)}</td>
            <td>${escapeHtml(appt.service)}</td>
            <td>${escapeHtml(appt.patientFullName)}</td>
            <td>${formatTime(appt.start)}</td>
            <td>${formatTime(appt.end)}</td>
            <td class="text-nowrap">
                <button type="button" class="btn btn-sm btn-primary"
                        data-action="select" data-id="${escapeHtml(appt.appointmentID)}" commandfor="diagSelectedAppointment" command="show-modal">
                    Select
                </button>
            </td>`;

        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
}

/**
 * Populates the #diagSelectedAppointment dialog with a single DTO.
 * @param {Object} appt - us_AppointmentItemDTO
 */
function renderSelectedAppointment(appt) {
    if (!appt) return;

    const escapeHtml = (s) =>
        s == null ? "" : String(s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const formatDate = (d) => {
        if (!d) return "—";
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return "—";
        return dt.toLocaleDateString(undefined, {
            weekday: "short", year: "numeric", month: "short", day: "numeric"
        });
    };

    const formatTime = (t) => {
        if (t == null) return "—";
        if (typeof t === "string") {
            const p = t.split(":");
            return `${p[0].padStart(2, "0")}:${(p[1] || "00").padStart(2, "0")}`;
        }
        if (typeof t === "object" && "hours" in t) {
            return `${String(t.hours).padStart(2, "0")}:${String(t.minutes || 0).padStart(2, "0")}`;
        }
        if (typeof t === "number") {
            return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
        }
        return "—";
    };

    const statusBadge = (status) => {
        const s = (status || "").toLowerCase();
        let cls = "bg-secondary";
        if (s.includes("confirm") || s.includes("active") || s.includes("complete")) cls = "bg-success";
        else if (s.includes("pend") || s.includes("schedul")) cls = "bg-warning text-dark";
        else if (s.includes("cancel") || s.includes("no-show")) cls = "bg-danger";
        else if (s.includes("info")) cls = "bg-info text-dark";
        return `<span class="badge ${cls}">${escapeHtml(status || "—")}</span>`;
    };

    document.getElementById("apptIdBadge").textContent = `#${appt.appointmentID ?? "—"}`;
    document.getElementById("apptDate").textContent    = formatDate(appt.date);
    document.getElementById("apptS_Time").textContent  = formatTime(appt.start);
    document.getElementById("apptE_Time").textContent  = formatTime(appt.end);
    document.getElementById("apptService").textContent = appt.service || "—";
    document.getElementById("apptPatient").textContent = appt.patientFullName || "—";
    document.getElementById("apptStatus").innerHTML    = statusBadge(appt.status);
}
async function RefreshTable()
{
    
    try {
       
        await objLoading.LoadAllAppointmentsForDoctor(renderAppointmentsTable ,CurrentDoctor.doctorID);
    } catch (error) {
        throw new Error(error.message);
    }
}



async function MakeAppointmtInProgress(appointmentID) {
    try {
        objSpinner.ShowSpinner(Spinners.AppointmetCard);
        const res = await objActions.ChangeAppointmentStatusToInProgress(appointmentID);
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
    finally {
        objSpinner.HideSpinner(Spinners.AppointmetCard);
    }
}

export let CurrentAppointment = null;

document.getElementById("target").addEventListener("click", async function (e) {
    const btn = e.target.closest('button[data-action="select"]');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const appt = liAppointments.find(a => a.appointmentID === id);

    if (appt) {
        CurrentAppointment = appt;
        renderSelectedAppointment(appt);
     }
});

document.getElementById("btnConfirmSelection").addEventListener("click", async function () {
    if(await MakeAppointmtInProgress(CurrentAppointment.appointmentID)) {
            console.log(`Appointment #${CurrentAppointment.appointmentID} status changed to In Progress.`);
             objSpinner.ShowSpinner(Spinners.spnApptTable);
           await RefreshTable();
           await  objSpinner.HideSpinner(Spinners.spnApptTable);
       }   
});

document.addEventListener("DOMContentLoaded", async () => {
    await RefreshTable();
});