 
  const  frm = document.getElementById("frmInfo");
  const Message = document.getElementById("informUser");
    const rootStyles = getComputedStyle(document.documentElement);
    const valid = rootStyles.getPropertyValue('--valid').trim();
    const error = rootStyles.getPropertyValue('--error').trim();
const ddlSepcialiaztions = document.getElementById("specializationId");
const spinner = document.getElementById("spinner");
const DoctorsGrid = document.getElementById("doc_grid");
const ddloptions = document.getElementById("search_options");
const resultLabel = document.getElementById("resultLabel");
const btnReset = document.getElementById("btnResetSearch");

const API_Base = "http://localhost:5202/api/Doctors";
let liDoctors = null;

function showResultMessage(message)
{
resultLabel.textContent = message;
}


function setLoading(display)
{
     if (display === true) {
  spinner.style.display = "flex";
} else {
  spinner.style.display = "none";
}
}

function SearchFilter(specializationID)
{
    if (liDoctors===null || liDoctors===undefined) {
        return;
    }

        if (!Array.isArray(liDoctors)) return;
        let fliterResult;

        if (specializationID) {
        fliterResult = liDoctors.filter(d => 
        String(d.specializationID) === String(specializationID));
        showResultMessage(`List of doctors specialazed in  ${dicSpercialzationbyID[specializationID]}`);
    if (fliterResult.length===0) {
        showResultMessage(`No doctors specialazed in  ${dicSpercialzationbyID[specializationID]}`);
        RenderDoctors(liDoctors);
        return;
    }
}
 else {
    fliterResult = liDoctors;
}

        RenderDoctors(fliterResult);

}

function FillDropDownList(dic , list)
{
    if (dic===null || dic ===undefined) {
        throw new Error("dicitionary is empty check your API response");
    }
    list.innerHTML = "";
    let first = document.createElement("option");
    first.value = "";
    first.disabled = true;
    first.selected = true;
    first.textContent = "-- Select a Specialization --";
    list.appendChild(first);
   for(const[name,id] of Object.entries(dic))
   {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = name;
        list.appendChild(opt);
   }
}


function ShowInformation(text , status)
{
    if (text.lenght === 0) {
        Message.style.display = "none";
        return;
    }
        Message.style.display = "flex";
        Message.textContent = text;
    if (status===true) {
        
        Message.style.backgroundColor = valid;
    }
    else
    {
        Message.style.backgroundColor = error;
    }
}

async function RenderSpecialazation()
{
    const data = await LoadSpecializations();
    FillDropDownList(data , ddlSepcialiaztions);
        FillDropDownList(data,ddloptions);
}

let dicSpercialzationbyID ;


async function LoadSpecializations() {
    try {
        const res = await fetch(`${API_Base}/GetSpecializations`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!res.ok) {
            ShowInformation(`HTTP ${res.status}`, false);
            return null;
        }

        const dic = await res.json(); 
        dicSpercialzationbyID = Object.fromEntries(Object.entries(dic).map(([key , value]) => [value , key]));
        return dic;

    } catch (e) {
        ShowInformation(`error ${e.message}`, false);
    }
}
function SelectDefaultNamePerGender(gender)
{
if (gender==="Male") {
   return "/Clinic-1.0.0/assets/img/person/Young doctor.jpg";
}
else
{
    return "/Clinic-1.0.0/assets/img/person/Female doctor.jpg";
}
}

function CreateDoctorCard(data)
{
    const card = document.createElement("div");
    card.dataset.id = data.doctorID;
    card.classList.add("MyDoctor-card");
    
    const img = document.createElement("img");
    img.alt = `${data.firstName} ${data.lastName}`;
    img.src = data.photoURL && data.photoURL.trim() !== ""
        ? data.photoURL
        : SelectDefaultNamePerGender(data.gender);
    img.onerror = () => { img.src = "/Clinic-1.0.0/assets/img/person/Young doctor.jpg"; };
    img.classList.add("Doctor-Img");
    img.loading = "lazy";
    card.appendChild(img);
    const fullName = document.createElement("h3");
    fullName.textContent = `Dr. ${data.firstName} ${data.lastName}`;
    card.appendChild(fullName);

    const specialazation = document.createElement("p");
    specialazation.textContent = `${data.specialization}`;
    card.appendChild(specialazation);

     const phone = document.createElement("p");
    phone.textContent = `Phone : ${data.phone}`;
    phone.classList.add("PhoneSec");
    card.appendChild(phone);

    const email = document.createElement("p");
    email.textContent = `Email : ${data.email}`;
    email.classList.add("EmailSec");
    card.appendChild(email);

const btnUpdate = document.createElement("button");
btnUpdate.textContent = "Update";
card.appendChild(btnUpdate);
DoctorsGrid.appendChild(card);
}
async function LoadDoctors()
{
const data = await GetAllDoctors();
     setLoading(false);
     RenderDoctors(data);
}


function  RenderDoctors(data)
{
    
    
    DoctorsGrid.innerHTML = "";
 if (!Array.isArray(data)) return;
    data.forEach(element => CreateDoctorCard(element));
}

async function GetAllDoctors()
{
    try {
        setLoading(true);
        const res = await fetch(`${API_Base}/GetAllDoctors`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (!res.ok) {
            ShowInformation(`HTTP ${res.status}`, false);
            setLoading(false);
            return;
        }
        const data = await res.json();
        liDoctors = data;
        return data;
    }
    catch(e)
    {
        ShowInformation(`${e.message}`, false);
            return null;
    }
    finally
    {
        setLoading(false);
    }
}


async function PostNewDoctors( firstName , lastName , dateOfBirth ,gender ,
   phone , email , address , photoURL , specializationID
 ) 
{
     try {
        const res = await fetch(`${API_Base}/AddNewDoctor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ firstName , lastName , dateOfBirth , 
                gender , phone , email , address , photoURL ,
                specializationID
             })
        });

        const data = await res.json();

        if (!res.ok) {
            ShowInformation(`HTTP ${res.status}`,false);
            return false;
        }

        return true;
    } catch (e) {
        ShowInformation(`error ${e.Message}`,false);
        return false;
    }
}


async function updateDoctor(doctorData)
{
try {
    const res = await fetch(`${API_Base}/UpdateDoctor`,
        {
            method: "PUT" ,
            headers : {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            } ,
            body : JSON.stringify(doctorData)
        });
        
        if (res.ok) {
            const message = await response.text();
            console.log('Success:', message);
            return true;
        } else {
            const errorMessage = await response.text();
            console.error('Error:', errorMessage);
            return false;
        }
}
catch(e)
{
    console.log(e.message);
    return false;
}
}




document.addEventListener("DOMContentLoaded", RenderSpecialazation);
document.addEventListener("DOMContentLoaded", LoadDoctors);
frm.addEventListener("submit" ,async (event)=> {
event.preventDefault();
const firstName = document.getElementById('firstName').value;
const  lastName = document.getElementById('lastName').value;
 const dateOfBirth = document.getElementById('dob').value;
const  gender = document.getElementById('gender').value;
const  phone = document.getElementById('phone').value;
const  email = document.getElementById('email').value;
const  address = document.getElementById('address').value;
const  photoURL = document.getElementById('photoUrl').value;
const  specializationID = document.getElementById('specializationId').value
Message.classList.remove("hidden");
const res = await PostNewDoctors(firstName , lastName , dateOfBirth ,gender ,phone , email , address , photoURL , specializationID);
if (res) {
     ShowInformation(`Doctor ${firstName} ${lastName} was added successfully`,true);
    LoadDoctors();
}
else
{
    ShowInformation(`Adding Doctor ${firstName} ${lastName} has failed`,false);
}
setTimeout(()=>{
        Message.classList.add("hidden");
    },2000);
});

ddloptions.addEventListener("change", (e) => {
  const selectedID = e.target.value;
  SearchFilter(selectedID);
});

btnReset.addEventListener("click" , () => {
    RenderDoctors(liDoctors);
});

