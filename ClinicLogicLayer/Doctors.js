 
  const  frm = document.getElementById("frmInfo");
  const Message = document.getElementById("informUser");
    const rootStyles = getComputedStyle(document.documentElement);
    const valid = rootStyles.getPropertyValue('--valid').trim();
    const error = rootStyles.getPropertyValue('--error').trim();
const ddlSepcialiaztions = document.getElementById("specializationId");

const API_Base = "http://localhost:5202/api/Doctors";

function FillDropDownList(dic)
{
    if (dic===null || dic ===undefined) {
        throw new Error("dicitionary is empty check your API response");
    }
    ddlSepcialiaztions.innerHTML = "";
    let first = document.createElement("option");
    first.value = "";
    first.disabled = true;
    first.selected = true;
    first.textContent = "-- Select a Specialization --";
    ddlSepcialiaztions.appendChild(first);
   for(const[name,id] of Object.entries(dic))
   {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = name;
        ddlSepcialiaztions.appendChild(opt);
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
            return;
        }

        const dic = await res.json(); 
        FillDropDownList(dic);

    } catch (e) {
        ShowInformation(`error ${e.message}`, false);
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

document.addEventListener("DOMContentLoaded", LoadSpecializations);



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
    
}
else
{
    ShowInformation(`Adding Doctor ${firstName} ${lastName} has failed`,false);
}
setTimeout(()=>{
        Message.classList.add("hidden");
    },2000);
});