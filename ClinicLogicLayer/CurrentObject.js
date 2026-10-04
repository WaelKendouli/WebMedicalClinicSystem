export function SetCurrent(key ,obj)
{
    localStorage.setItem(key, JSON.stringify(obj));  
    const doc = localStorage.getItem(key);
    const tmp = JSON.parse(doc);
    console.log(tmp);
}

export function GetCurrent(key)
{
    const raw = localStorage.getItem(key);
    if (!raw) return null;               
    try {
        const current = JSON.parse(raw);
        console.log("Current object exported");
        console.log(current);
        return current;
    } catch (e) {
        console.error("Failed to parse CurrentDoctor:", e);
        return null;
    }
}