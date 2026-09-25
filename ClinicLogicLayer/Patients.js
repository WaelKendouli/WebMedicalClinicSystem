const myDialog = document.getElementById("diagAdd");
    const btnAdd = document.getElementById("btnAdd");
    const btnCancel = document.getElementById("btnCancel");
    const diagEdit = document.getElementById("diagEdit");
    const spinner = document.getElementById("tableLoading");
    const btnAddNewPatient = document.getElementById("btnAddNewPatient");
    const diagQuest = document.getElementById("diagQuest");
    const btnConfirm = document.getElementById("btnConfirm");
    const btnCancelDeletion = document.getElementById("btnCancelDeletion");

    btnAdd.addEventListener("click",()=> {
        myDialog.showModal();
    });
    btnCancel.addEventListener("click",()=> {
        myDialog.close();
        diagEdit.close();
    });
    const btnEdit = document.querySelectorAll(".btnEdit");
    btnEdit.forEach((btn) =>{
        btn.addEventListener("click" , () => {
            diagEdit.showModal();
        });
    });

    let currentPatientToEdit ;
    let currentPatientToDelete;

    const BASE_API = "http://localhost:5202/api/Patient";

    let liPatients ; // list of patients for caching +
    //  searching without depending on the server in some palces of code

    async function GetAllPatients()
    {
        try {
            setLoading(true);
        const res = await fetch(`${BASE_API}/GetAllPatients` , {
             method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            liPatients = data;
            return data;
        }
        else
        {
            throw new Error("couldn't get the data from the server");
        }
        }
        catch(e)
        {
            console.log(e.message);
            return null;
        }
        finally
        {
            setLoading(false);
        }
    }



    function renderPatientsTable(patients) {
    // 1. Find the placeholder by ID
    const placeholder = document.getElementById('table-placeholder');

    // 2. Clear any existing content inside the placeholder
    placeholder.textContent = '';

    // 3. Create the wrapper div
    const wrap = document.createElement('div');
    wrap.className = 'patients-table-wrap';

    // 4. Create the table
    const table = document.createElement('table');
    table.className = 'patients-table';

    // 5. Build the thead
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Date of Birth',
        'Phone',
        'Email',
        'Address',
        'Gender',
        'Actions'
    ];

    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    // 6. Build the tbody
    const tbody = document.createElement('tbody');

    if (!patients || patients.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 9;
        emptyCell.style.textAlign = 'center';
        emptyCell.textContent = 'No patients found';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    } else {
        patients.forEach(patient => {
            const row = document.createElement('tr');

            // ID cell (strong tag)
            const idCell = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = `${String(patient.patientID).padStart(3, '0')}`;
            idCell.appendChild(strong);
            row.appendChild(idCell);

            // Date of birth (strip time part)
            const dob = patient.dateOfBirth
                ? patient.dateOfBirth.split('T')[0]
                : 'N/A';

            // Plain text cells
            const values = [
                patient.firstName ?? '',
                patient.lastName ?? '',
                dob,
                patient.phone ?? '',
                patient.email ?? '',
                patient.address ?? 'N/A',
                patient.gender ?? 'N/A'
            ];

            values.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });

            // Actions cell
            const actionsCell = document.createElement('td');

            const editBtn = document.createElement('button');
            editBtn.className = 'btnEdit';
            editBtn.textContent = 'Edit';
            editBtn.dataset.id = patient.patientID;
            editBtn.addEventListener("click" , () => {
                 diagEdit.showModal();
                 currentPatientToEdit = patient;
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.id = patient.patientID;
            deleteBtn.addEventListener("click" , ()=>{
                currentPatientToDelete = patient;
                diagQuest.showModal();
            });

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });
    }

    table.appendChild(tbody);
    wrap.appendChild(table);

    // 7. Append the built structure into the placeholder
    placeholder.appendChild(wrap);
}

function setLoading(display)
{
     if (display === true) {
  spinner.style.display = "flex";
} else {
  spinner.style.display = "none";
}
}

async function  LoadAllPatients() {
    const data = await GetAllPatients();
    renderPatientsTable(data);
}

// ==========================================
// ADD PATIENT - Get form values
// ==========================================
function getAddPatientValues() {
    return {
        FirstName:    document.getElementById('addFirstName').value.trim(),
        LastName:     document.getElementById('addLastName').value.trim(),
        DateOfBirth:  document.getElementById('addDateOfBirth').value,
        Phone:        document.getElementById('addPhone').value.trim(),
        Email:        document.getElementById('addEmail').value.trim(),
        Gender:       document.getElementById('addGender').value,
        Password:     document.getElementById('addPassword').value,
        Address:      document.getElementById('addAddress').value.trim()
    };
}

// ==========================================
// EDIT PATIENT - Get form values
// ==========================================
function getEditPatientValues() {
    return {
        FirstName:    document.getElementById('edFirstName').value.trim(),
        LastName:     document.getElementById('edLastName').value.trim(),
        DateOfBirth:  document.getElementById('edDateOfBirth').value,
        Phone:        document.getElementById('edPhone').value.trim(),
        Email:        document.getElementById('edEmail').value.trim(),
        Gender:       document.getElementById('edGender').value,
        Password:     document.getElementById('edPassword').value,
        Address:      document.getElementById('edAddress').value.trim()
    };
}

// ==========================================
// EDIT PATIENT - Populate form with values
// ==========================================
function setEditPatientValues(patient) {
    document.getElementById('edFirstName').value   = patient.FirstName   ?? '';
    document.getElementById('edLastName').value    = patient.LastName    ?? '';
    document.getElementById('edDateOfBirth').value = patient.DateOfBirth 
        ? patient.DateOfBirth.split('T')[0]  // handle ISO date from API
        : '';
    document.getElementById('edPhone').value       = patient.Phone       ?? '';
    document.getElementById('edEmail').value       = patient.Email       ?? '';
    document.getElementById('edGender').value      = patient.Gender      ?? '';
    document.getElementById('edPassword').value    = patient.Password    ?? '';
    document.getElementById('edAddress').value     = patient.Address     ?? '';
}

// ==========================================
// ADD PATIENT - Clear form
// ==========================================
function clearAddPatientForm() {
    document.getElementById('addFirstName').value   = '';
    document.getElementById('addLastName').value    = '';
    document.getElementById('addDateOfBirth').value = '';
    document.getElementById('addPhone').value       = '';
    document.getElementById('addEmail').value       = '';
    document.getElementById('addGender').value      = '';
    document.getElementById('addPassword').value    = '';
    document.getElementById('addAddress').value     = '';
}

async function PostPatient(patient) {
    try {
        const response = await fetch(`${BASE_API}/AddNewPatient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FirstName: patient.FirstName,
                LastName: patient.LastName,
                DateOfBirth: patient.DateOfBirth,
                Email: patient.Email,
                Address: patient.Address,
                Phone: patient.Phone,
                Gender: patient.Gender,
                Password: patient.Password
            })
        });

        if (!response.ok) {
            // Handle BadRequest response
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to add new patient');
        }

        const data = await response.json();
        return true; // Returns the new patient ID
    } catch (error) {
        console.error('Error adding new patient:', error);
        throw error;
    }
}



async function deletePatient(patientID) {
    try {
        const response = await fetch(`${BASE_API}/DeletePatient/${patientID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle 400 / 404 / other errors
            const errorText = await response.text();
            throw new Error(errorText || `Failed to delete patient (${response.status})`);
        }

        const message = await response.text(); // "Patient deleted successfully"
        return message;
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error;
    }
}



async function AddnewPatient()
{
 const NewPatient = getAddPatientValues();
   await PostPatient(NewPatient);
    LoadAllPatients();
    myDialog.close();
    clearAddPatientForm();
}

// generalized logic for refreshing patients data after a certain action
async function RefreshListAfterAction(dialog , obj , ActionFunction) 
{
    try {
        await ActionFunction(obj);
        await LoadAllPatients();
        dialog.close();
    }
    catch(e)
    {
        console.log(e.message);
    }
}


btnCancelDeletion.addEventListener("click" , ()=>{
    diagQuest.close();
});

document.addEventListener("DOMContentLoaded", LoadAllPatients);
btnAddNewPatient.addEventListener("click" , ()=>{
    AddnewPatient();
});

btnConfirm.addEventListener("click" , ()=>{
    RefreshListAfterAction(diagQuest , currentPatientToDelete.patientID , deletePatient);
});