
import * as objLoad from './h_LoadAndRender.js';


let MedicationCardID = 0;
const UI = {
    GeneralInformations : {
        giIssueDate : document.getElementById("giIssueDate"),
        giIssueDate : document.getElementById("giHeight"),
        giIssueDate : document.getElementById("giBlood"),
        giIssueDate : document.getElementById("giTempreture"),
        giIssueDate : document.getElementById("giPlus"),
        giIssueDate : document.getElementById("giDoctorName"),
        giIssueDate : document.getElementById("giPatient")
    } ,
    AddNewPrecription : {
        listMedications : document.getElementById("listMedications"),
        listCategories : document.getElementById("listCategories") ,
        txtStartDate : document.getElementById("txtStartDate") ,
        txtEndDate  : document.getElementById("txtEndDate") ,
        txtDosage : document.getElementById("txtDosage") ,
        txtFrequncy : document.getElementById("txtFrequncy") ,
        txtStrenght : document.getElementById("txtStrenght") ,
        listMedicationForm : document.getElementById("AddMedicationFormList") ,
        btnAddnewMedication : document.getElementById("btnAddnewMedication") ,
        btnSavePrescription : document.getElementById("btnSavePrescription") 
    },
    EditPrescritpiton : {
        listMedications_ed : document.getElementById("listMedications_ed") ,
        listCategories_ed : document.getElementById("listCategories_ed") ,
        txtStartDate_ed : document.getElementById("txtStartDate_ed") ,
        txtEndDate_ed : document.getElementById("txtEndDate_ed") ,
        txtDosage_ed : document.getElementById("txtDosage_ed") ,
        txtFequency_ed : document.getElementById("txtFequency_ed") ,
        txtStrenght_ed : document.getElementById("txtStrenght_ed") ,
        listMedicationsForms_ed : document.getElementById("listMedicationsForms_ed") ,
        btnConfirm : document.getElementById("btnConfirm") 
    } ,
    layout : {
        medicationsLayout : document.getElementById("medicationsLayout")
    }
}

function renderMedications(medications) {

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a medication...';
  placeholder.selected = true;
  placeholder.disabled = true;
  UI.AddNewPrecription.listMedications.appendChild(placeholder);

  medications.forEach(med => {
    const option = document.createElement('option');
    option.value = med.medicationID;
    option.textContent = med.medicationName;
    option.dataset.medicationId = med.medicationID;
    option.dataset.medicationName = med.medicationName;
    option.dataset.categoryId = med.categoryID;
    option.dataset.formId = med.formID;
    option.dataset.strength = med.strength;
    option.dataset.instructions = med.instructions;
    UI.AddNewPrecription.listMedications.appendChild(option);
  });
}
function renderCategories(categories) {
  const select = document.getElementById('listCategories');
  select.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a category...';
  placeholder.selected = true;
  placeholder.disabled = true;
  select.appendChild(placeholder);

  Object.entries(categories).forEach(([name, id]) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    option.dataset.categoryId = id;
    option.dataset.categoryName = name;
    select.appendChild(option);
  });
}

function renderForms(forms) {
  
  UI.AddNewPrecription.listMedicationForm.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a form...';
  placeholder.selected = true;
  placeholder.disabled = true;
  UI.AddNewPrecription.listMedicationForm.appendChild(placeholder);

  forms.forEach(form => {
    const option = document.createElement('option');
    option.value = form.formID;
    option.textContent = form.formName;
    option.dataset.formId = form.formID;
    option.dataset.formName = form.formName;
    UI.AddNewPrecription.listMedicationForm.appendChild(option);
  });
}

async function InitializeOptionsList(Loadingfunction ,renderingFunction , LocalList)
{
try {
  LocalList =  await Loadingfunction(renderingFunction);
} catch (error) {
    throw new Error(error.message);
}
}

let liMedications = null;
let liCategories = null ;
let liDosageForms = null; 

function renderMedicationCard(med) {
  MedicationCardID ++;
  const layout = UI.layout.medicationsLayout;
  const card = document.createElement('div');
  card.className = 'card my-4 text-center';
  card.dataset.medicationId = med.medicationID;
  card.dataset.CardId = MedicationCardID;


  const title = document.createElement('h4');
  title.className = 'card-title my-2';
  title.textContent = med.medicationName || 'Medication Name';

  const subtitle = document.createElement('h6');
  subtitle.className = 'card-subtitle text-muted my-2';
  subtitle.textContent = med.medicationCategoryName || 'Medication Category';

  const body = document.createElement('div');
  body.className = 'card-body';

  const outerFlex = document.createElement('div');
  outerFlex.className = 'd-flex flex-column flex-wrap gy-4';

  // --- Dates row ---
  const datesRow = document.createElement('div');
  datesRow.className = 'd-md-block d-lg-inline gap-5 my-3';

  const startLabel = document.createElement('span');
  startLabel.className = 'card-text fw-bold';
  startLabel.textContent = 'Start Date :';
  const startValue = document.createElement('span');
  startValue.className = 'card-text px-4 text-muted';
  startValue.textContent = med.startDate || '—';

  const endLabel = document.createElement('span');
  endLabel.className = 'card-text fw-bold';
  endLabel.textContent = 'End Date :';
  const endValue = document.createElement('span');
  endValue.className = 'card-text px-4 text-muted';
  endValue.textContent = med.endDate || '—';

  datesRow.append(startLabel, startValue, endLabel, endValue);

  // --- Dosage / Frequency / Strength row ---
  const midRow = document.createElement('div');
  midRow.className = 'd-flex flex-row my-4 justify-content-between align-content-center flex-wrap';

  const dosageBlock = document.createElement('div');
  dosageBlock.className = 'd-inline g-2';
  const dosageLabel = document.createElement('span');
  dosageLabel.className = 'card-text fw-bold';
  dosageLabel.textContent = 'Dosage :';
  const dosageValue = document.createElement('span');
  dosageValue.className = 'card-text px-4 text-muted';
  dosageValue.textContent = med.dosage ?? '—';
  dosageBlock.append(dosageLabel, dosageValue);

  const freqBlock = document.createElement('div');
  freqBlock.className = 'd-inline g-2';
  const freqLabel = document.createElement('span');
  freqLabel.className = 'card-text fw-bold';
  freqLabel.textContent = 'Fequency :';
  const freqValue = document.createElement('span');
  freqValue.className = 'card-text px-4 text-muted';
  freqValue.textContent = med.frequency ?? '—';
  freqBlock.append(freqLabel, freqValue);

  const strengthBlock = document.createElement('div');
  strengthBlock.className = 'd-inline gx-4';
  const strengthLabel = document.createElement('span');
  strengthLabel.className = 'card-text fw-bold';
  strengthLabel.textContent = 'Strenght :';
  const strengthValue = document.createElement('span');
  strengthValue.className = 'card-text px-4 text-muted';
  strengthValue.textContent = med.strength ?? '—';
  strengthBlock.append(strengthLabel, strengthValue);

  midRow.append(dosageBlock, freqBlock, strengthBlock);

  // --- Form row ---
  const formRow = document.createElement('div');
  formRow.className = 'd-inline gx-4';
  const formLabel = document.createElement('span');
  formLabel.className = 'card-text fw-bold';
  formLabel.textContent = 'Medication Form :';
  const formValue = document.createElement('span');
  formValue.className = 'card-text px-4 text-muted';
  formValue.textContent = med.formName || '—';
  formRow.append(formLabel, formValue);

  outerFlex.append(datesRow, midRow, formRow);
  body.appendChild(outerFlex);

  const editBtn = document.createElement('button');
  editBtn.className = 'btn m-4 btn-primary btn-md';
  editBtn.setAttribute('commandfor', 'EditDialog');
  editBtn.setAttribute('command', 'show-modal');
  editBtn.textContent = 'Edit';

  card.append(title, subtitle, body, editBtn);
  layout.appendChild(card);
}

function AddCardToLayout()
{
   const medSelect = UI.AddNewPrecription.listMedications;
    const catSelect = UI.AddNewPrecription.listCategories;
    const formSelect = UI.AddNewPrecription.listMedicationForm;

    // The <option> the user actually picked
    const medOption  = medSelect.selectedOptions[0];
    const catOption  = catSelect.selectedOptions[0];
    const formOption = formSelect.selectedOptions[0];

    // Guard: nothing selected → bail out
    if (!medOption || !medOption.value) {
        alert("Please select a medication.");
        return;
    }

    const NewMedicationCardInfo = {
        medicationId          : medOption.dataset.medicationId,   // from data-* attr
        medicationName        : medOption.textContent,            // visible label
        medicationCategoryName: catOption?.textContent ?? '—',
        startDate             : UI.AddNewPrecription.txtStartDate.value,
        endDate               : UI.AddNewPrecription.txtEndDate.value,
        dosage                : UI.AddNewPrecription.txtDosage.value,
        frequency             : UI.AddNewPrecription.txtFrequncy.value,
        formName              : formOption?.textContent ?? '—',
    };
renderMedicationCard(NewMedicationCardInfo);
}

UI.AddNewPrecription.btnAddnewMedication.addEventListener("click" , (e) => {
  e.preventDefault();
AddCardToLayout();
});

document.addEventListener("DOMContentLoaded" , async function(){
   await Promise.allSettled([
    InitializeOptionsList(objLoad.LoadAllMedications, renderMedications , liMedications),
    InitializeOptionsList(objLoad.LoadAllCategories, renderCategories , liCategories),
    InitializeOptionsList(objLoad.LoadAllDosageForms, renderForms , liDosageForms),
  ]);
});