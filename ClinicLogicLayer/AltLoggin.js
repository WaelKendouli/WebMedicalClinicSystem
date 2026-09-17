const UI = {
    ErrorMessage : document.getElementById("lbInvalid"),
    frmLogin : document.getElementById("loginForm")
}
function SetError(message)
{
    if (!message) {
        UI.ErrorMessage.style.display = "flex";
        UI.ErrorMessage.textContent = message;
        return;
    }
    UI.ErrorMessage.style.display = "none";
}

function CheckInputs(value, message) {
    if (!value || !value.trim()) {
        SetError(message);
        return false;
    }
    return true;
}

const API_Base = "http://localhost:5202/api/Clinic";

function LinkShow(elm)
{
 if(elm.checked)
 {
    elm.checked = false;
 }
 else
 {
    elm.checked = true;
 }

}

async function SecondaryAuthenticationMethod( email , phone )
{
     if (!CheckInputs(email, "Invalid username") ||
        !CheckInputs(phone, "Invalid password")) {
        return false;
    }
    SetError("");

    try {
        const res = await fetch(`${API_Base}/Sec-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, phone })
        });

        const data = await res.json();

        if (!res.ok) {
            SetError(data.message || `HTTP ${res.status}`);
            return false;
        }

        return true;
    } catch (e) {
        SetError(e.message || "Network error");
        return false;
    }
}



UI.frmLogin.addEventListener("submit" ,async (event)=> {
event.preventDefault();
const email = document.getElementById("email").value 
 const   phone = document.getElementById("phone").value 
 const res = await SecondaryAuthenticationMethod(email ,phone);
if (res) {
   window.open('index.html', '_self');
}
else
{
    SetError("your account does'nt exist as an admin");
}
});