
import * as Objspinner from './SpinnerHelper.js';
import * as ObjActions from './h_CommonActionsModule.js';
import * as ObjCurrent from './CurrentObject.js';


const Spinners = {
    Main : "spnSaveChanges"
}

const Appointment = ObjCurrent.GetCurrent("SelectedAppointment"); 
const CurrentDoctor = ObjCurrent.GetCurrent("current_loggedIn_User"); 

const UI = {
    btnSend : document.getElementById("btnSave")
}

async function submitMedicalRecord(doctorID, patientID, appointmentID) {
    // 1. Get General Information
    const description = document.getElementById("txtDescription").value;
    const additionalNotes = document.getElementById("txtAdditionalNotes").value;

    // 2. Get Vitals (Parsing to numbers/decimals, using 0 or defaults if empty)
    const height = parseFloat(document.getElementById("txtHeight").value) || 0;
    const weight = parseFloat(document.getElementById("txtWeight").value) || 0;
    const bloodPressure = document.getElementById("txtBloodPressure").value;
    const temperature = parseFloat(document.getElementById("txtTemperature").value) || 0;
    const pulse = parseInt(document.getElementById("txtPulse").value) || 0;

    // 3. Get Diagnosis
    const conclusion = document.getElementById("txtConclusion").value;
    const icd10Code = document.getElementById("txtICD10Code").value;

   

    const payload = {
        medicalRecord: {
            medicalRecordID: 0, // 0 for new record
            description: description,
            additionalNotes: additionalNotes,
            doctorID: doctorID,
            patientID: patientID,
            appointmentID: appointmentID
        },
        vitals: {
            vitalsID: 0,
            medicalRecordID: 0,
            height: height,
            weight: weight,
            bloodPressure: bloodPressure,
            temperature: temperature,
            pulse: pulse
        },
        diagnosis: {
            diagnosisID: 0,
            medicalRecordID: 0,
            conclution: conclusion,
            icd10Code: "TEST-156"
        }
    };

   
    try {
        Objspinner.ShowSpinner(Spinners.Main);
        await ObjActions.AddNewMedicalRecord(payload);
    } catch (error) {

       throw new Error(error.message);
    }
    finally
    {
        Objspinner.HideSpinner(Spinners.Main);
    }
}

UI.btnSend.addEventListener("click" , async () => {
    await submitMedicalRecord(CurrentDoctor.doctorID , Appointment.patientID , Appointment.appointmentID);
});