import { Post } from "./CRUDhelper.js";
import { GetCurrent , SetCurrent } from "./CurrentObject.js";


const UI_Medical = {
    get Form()          { return document.getElementById("frmMedicalRecord"); },
     BtnSubmit    : document.getElementById("mrBtnSubmit"),
    get BtnCancel()     { return document.getElementById("mrBtnCancelForm"); },
    get BtnPrescription(){ return document.getElementById("btnPrescription"); },
    get Toast()         { return document.getElementById("mr_informUser"); },

    get Description()     { return document.getElementById("mr_description").value; },
    get Diagnosis()       { return document.getElementById("mr_diagnosis").value; },
    get AdditionalNotes() { return document.getElementById("mr_additionalNotes").value; }
};


async function AddNewMedicalRecord() {
    try {
        const NewMedical = {
            Description : UI_Medical.Description ,
            Diagnosis : UI_Medical.Diagnosis ,
            AdditionalNotes : UI_Medical.AdditionalNotes ,
            DoctorID :  GetCurrent("CurrentAppointment").doctorID ,
            PatientID : GetCurrent("CurrentAppointment").patientID ,
            AppointmentID : GetCurrent("CurrentAppointment").appointmentID
        }
        const data = await Post(NewMedical , "MedicalRecords" , "AddMedicalRecord");
        if (data?.Success === true || data?.success === true) {
            console.log("Medical record added successfully");
        } else {
            console.log("Medical record adding failed", data);
        }
    }
    catch(e)
    {
        throw new Error(e.message);
    }
}

UI_Medical.BtnSubmit.addEventListener("click" , async ()=> {
    await AddNewMedicalRecord();
} );