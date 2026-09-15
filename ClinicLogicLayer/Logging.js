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


async function PrimaryAuthenticationMethod(username , password , email ="" , phone ="")
{
     if (!CheckInputs(username, "Invalid username") ||
        !CheckInputs(password, "Invalid password")) {
        return false;
    }
    SetError("");

    try {
        const res = await fetch(`${API_Base}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password, email, phone })
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
const Username = document.getElementById("username").value 
 const   Password = document.getElementById("password").value 
 const res = await PrimaryAuthenticationMethod(Username ,Password);
if (res) {
    window.location.href = 'index.html';
}
});