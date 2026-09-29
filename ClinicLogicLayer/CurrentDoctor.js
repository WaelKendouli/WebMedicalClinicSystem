
export function SetCurrentDoctor(doctor)
{
    localStorage.setItem("CurrentDoctor", JSON.stringify(doctor));  
    const doc = localStorage.getItem("CurrentDoctor");
    const tmp = JSON.parse(doc);
    console.log(tmp);
}

export function GetCurrentDoctor()
{
    const raw = localStorage.getItem("CurrentDoctor");
    if (!raw) return null;               
    try {
        const current = JSON.parse(raw);
        console.log("Current doctor exported");
        console.log(current);
        return current;
    } catch (e) {
        console.error("Failed to parse CurrentDoctor:", e);
        return null;
    }
}