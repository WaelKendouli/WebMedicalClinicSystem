import { PostWithDataReturned  ,  Get} from "./CRUDhelper.js";
import { GetCurrent , SetCurrent } from "./CurrentObject.js";
import { SetToastMessage , FillDropDownList } from "./UI_Helper.js";

const UI_Medical = {
    get Form()          { return document.getElementById("frmMedicalRecord"); },
     BtnSubmit    : document.getElementById("mrBtnSubmit"),
     Toast     :     document.getElementById("mr_informUser"),
    get Description()     { return document.getElementById("mr_description").value; },
    get Diagnosis()       { return document.getElementById("mr_diagnosis").value; },
    get AdditionalNotes() { return document.getElementById("mr_additionalNotes").value; },
    get liMedicationSelect () {return document.getElementById("liMedicationSelect"); }
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
    btnNewPrescription : document.getElementById("btnNewPrescription"),
    // ---- Containers ----
    get MedicationSection(){ return document.getElementById("MedicationSection"); } ,
     Toast     :  document.getElementById("pr_informUser")

}

async function LoadMedicationList()
{
    try {
        const data = await Get("Medications" , "GetListOfMedications");
         await FillDropDownList(data , UI_Medical.liMedicationSelect , "Select medication")
    }
    catch(e)
    {
     throw new Error(e.message)
    }
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
            UI_Medical.BtnSubmit.disabled = true;
            DisplayPrescriptionLayout(true);
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
    DisplayPrescriptionLayout(false);
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
            UI_Prescription.btnSavePrescription.disabled = true;
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

function RenderMedication()
{
    if ( UI_Prescription.btnSavePrescription.disabled === false) {
        return;
    }
    const Medications = document.getElementById("Medications");
    const Medication = 
    {
        MedicationName : UI_Medical.liMedicationSelect.selectedOptions[0]?.textContent.trim(),
        Dosage : UI_Prescription.Dosage,
        Frequency : UI_Prescription.Frequency,
        StartDate :  GetCurrent("Prescription").startDate,
        EndDate :GetCurrent("Prescription").endDate
    };
    const MedicationContainer = document.createElement("div");
     const MedicationName  = document.createElement("p");
     MedicationName.classList.add("MedicationName");
    MedicationName.textContent = `${Medication.MedicationName}`;
    MedicationContainer.appendChild(MedicationName);
    const Dosage  = document.createElement("p");
    Dosage.textContent = `Dosage : ${Medication.Dosage}`;
    MedicationContainer.appendChild(Dosage);
    const Frequency  = document.createElement("p");
    Frequency.textContent = `Frequency : ${Medication.Frequency}`;
    MedicationContainer.appendChild(Frequency);
    const StartDate  = document.createElement("p");
    StartDate.textContent = `Start Date : ${Medication.StartDate}`;
    MedicationContainer.appendChild(StartDate);
    const EndDate  = document.createElement("p");
    EndDate.textContent = `End Date : ${Medication.EndDate}`;
    MedicationContainer.appendChild(EndDate);
    const Seperate = document.createElement("div");
    Seperate.classList.add("SperatingLine");
    MedicationContainer.appendChild(Seperate);
    Medications.appendChild(MedicationContainer);
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

document.addEventListener("DOMContentLoaded" , async()=>{
    await LoadMedicationList();
});


UI_Prescription.btnSavePrescription.addEventListener("click" , async()=> {
    await AddNewPrescription();
})

UI_Prescription.BtnAddMedication.addEventListener("click" , RenderMedication);
UI_Prescription.btnNewPrescription.addEventListener("click" , ()=> {
         UI_Prescription.btnSavePrescription.disabled = false;
      const Medications = document.getElementById("Medications");
    Medications.innerHTML = '';
});