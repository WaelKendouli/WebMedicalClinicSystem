 
  const  frm = document.getElementById("frmInfo");
  

const API_Base = "http://localhost:5202/api/Clinic";




async function PostNewDoctors( firstName , lastName , dateOfBirth ,gender ,
   phone , email , address , photoURL , specializationID = 3
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
            console.log(data.message || `HTTP ${res.status}`);
            return false;
        }

        return true;
    } catch (e) {
        console.log(e.message || "Network error");
        return false;
    }
}

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

const res = await PostNewDoctors(firstName , lastName , dateOfBirth ,gender ,phone , email , address , photoURL );
if (res) {
    
}
else
{
    
}
});