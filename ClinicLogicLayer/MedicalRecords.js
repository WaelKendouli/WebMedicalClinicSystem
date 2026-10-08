import { PostWithDataReturned } from "./CRUDhelper.js";
import { GetCurrent , SetCurrent } from "./CurrentObject.js";
import { SetToastMessage } from "./UI_Helper.js";

const UI_Medical = {
    get Form()          { return document.getElementById("frmMedicalRecord"); },
     BtnSubmit    : document.getElementById("mrBtnSubmit"),
    get BtnPrescription(){ return document.getElementById("btnPrescription"); },
     Toast     :     document.getElementById("mr_informUser"),
    BtnClearPrescriptionLayout : document.getElementById("BtnClearPrescriptionLayout") ,
    get Description()     { return document.getElementById("mr_description").value; },
    get Diagnosis()       { return document.getElementById("mr_diagnosis").value; },
    get AdditionalNotes() { return document.getElementById("mr_additionalNotes").value; }
};

const UI_Prescription = {
     PrescriptionContainers : document.querySelectorAll(".elmPrescription") ,
      get Form()            { return document.getElementById("frmPrescription"); },

    // ---- User-input fields (getters → always read the current value) ----
    get StartDate()       { return document.getElementById("pr_startDate").value; },
    get EndDate()         { return document.getElementById("pr_endDate").value; },
    get Dosage()          { return document.getElementById("pr_dosage").value; },
    get Frequency()       { return document.getElementById("pr_frequency").value; },

    // ---- Buttons ----
    get BtnAddMedication(){ return document.getElementById("btnAddMediction"); }, // note: id has a typo in HTML
     btnSavePrescription : document.getElementById("btnSavePrescription"),

    // ---- Containers ----
    get MedicationSection(){ return document.getElementById("MedicationSection"); } ,
     Toast     :  document.getElementById("pr_informUser")

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

async function AddNewPrescription()
{
     try {
        const NewPrescription = {
            medicalRecordID : GetCurrent("MedicalRecord").medicalRecordID,
            startDate : UI_Prescription.StartDate , 
            endDate : UI_Prescription.EndDate
        }
        const data = await PostWithDataReturned(NewPrescription , "Prescription" , "AddNewPrescription");
        if(data === null || data === undefined)
        {
            throw new Error(" returned prescription data is null or undefiend");
        }

        if (data.success === true) {
            console.log("Prescription record added successfully");
            SetToastMessage(UI_Prescription.Toast ,"Prescription record added successfully" , "");
            SetCurrent("Prescription",data.prescription);
        } else {
            console.log("Prescription record adding failed", data);
            SetToastMessage(UI_Prescription.Toast ,"Prescription record adding failed" , "");
        }
    }
    catch(e)
    {
       SetToastMessage(UI_Prescription.Toast ,e.message, "");
        throw new Error(e.message);
    }

}


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
});
UI_Prescription.btnSavePrescription.addEventListener("click" , async()=> {
    await AddNewPrescription();
})