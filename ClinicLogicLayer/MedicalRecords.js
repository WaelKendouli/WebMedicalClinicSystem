const UI_Medical = {
    get Form()          { return document.getElementById("frmMedicalRecord"); },
    get BtnSubmit()     { return document.getElementById("mrBtnSubmit"); },
    get BtnCancel()     { return document.getElementById("mrBtnCancelForm"); },
    get BtnPrescription(){ return document.getElementById("btnPrescription"); },
    get Toast()         { return document.getElementById("mr_informUser"); },

    get Description()     { return document.getElementById("mr_description"); },
    get Diagnosis()       { return document.getElementById("mr_diagnosis"); },
    get AdditionalNotes() { return document.getElementById("mr_additionalNotes"); }
};

