const myDialog = document.getElementById("diagAdd");
    const btnAdd = document.getElementById("btnAdd");
    const btnCancel = document.getElementById("btnCancel");
    const diagEdit = document.getElementById("diagEdit");
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

    const BASE_API = "http://localhost:5202/api/Patient";

    let liPatients ; // list of patients for caching +
    //  searching without depending on the server in some palces of code

    async function GetAllPatients()
    {
        try {
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
            strong.textContent = `PT-${String(patient.patientID).padStart(3, '0')}`;
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
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.id = patient.patientID;

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

async function  LoadAllPatients() {
    const data = await GetAllPatients();
    renderPatientsTable(data);
}

document.addEventListener("DOMContentLoaded", LoadAllPatients);
