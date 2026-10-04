import { PostWithDataReturned } from "./CRUDhelper.js";
import { GetCurrent , SetCurrent } from "./CurrentObject.js";
import { SetToastMessage } from "./UI_Helper.js";

const UI_Medical = {
    get Form()          { return document.getElementById("frmMedicalRecord"); },
     BtnSubmit    : document.getElementById("mrBtnSubmit"),
    get BtnCancel()     { return document.getElementById("mrBtnCancelForm"); },
    get BtnPrescription(){ return document.getElementById("btnPrescription"); },
     Toast     :     document.getElementById("mr_informUser"),
    BtnClearPrescriptionLayout : document.getElementById("BtnClearPrescriptionLayout") ,
    get Description()     { return document.getElementById("mr_description").value; },
    get Diagnosis()       { return document.getElementById("mr_diagnosis").value; },
    get AdditionalNotes() { return document.getElementById("mr_additionalNotes").value; }
};

const UI_Prescription = {
     PrescriptionContainers : document.querySelectorAll(".elmPrescription")
}

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
        const data = await PostWithDataReturned(NewMedical , "MedicalRecords" , "AddMedicalRecord");
        if (data.success === true) {
            console.log("Medical record added successfully");
            SetToastMessage(UI_Medical.Toast ,"Medical record added successfully" , "");
            SetCurrent("MedicalRecord",data.mr);
        } else {
            console.log("Medical record adding failed", data);
            SetToastMessage(UI_Medical.Toast ,"Medical record adding failed" , "");

        }
    }
    catch(e)
    {
       SetToastMessage(UI_Medical.Toast ,e.message, "");
        throw new Error(e.message);
    }
}

UI_Medical.BtnSubmit.addEventListener("click" , async ()=> {
    await AddNewMedicalRecord();
} );

function DisplayPrescriptionLayout(display)
{
    let visibily ;
    if (display === true) {
        visibily = "flex";
    }
    else 
    {
        visibily = "none";
    }
    UI_Prescription.PrescriptionContainers.forEach((elm)=>{
        elm.style.display = visibily;
    })
}

UI_Medical.BtnPrescription.addEventListener("click" , ()=>{
    DisplayPrescriptionLayout(true);
});
UI_Medical.BtnClearPrescriptionLayout.addEventListener("click" ,()=> {
    DisplayPrescriptionLayout(false);
})