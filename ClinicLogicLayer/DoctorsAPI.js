
const API_Base = "http://localhost:5202/api/Doctors";


export async function extGetAllDoctors()
{
     try {
        const res = await fetch(`${API_Base}/GetAllDoctors`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            return null;
        }
        const data = await res.json();
        return data;
    }
    catch(e)
    {
        console.log(`${e.message}`);
            return null;
    }
}

export let dicSpercialzationbyID;

export async function extGetSpeciSpecializations()
{
    try {
        const res = await fetch(`${API_Base}/GetSpecializations`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            return null;
        }

        const dic = await res.json(); 
        dicSpercialzationbyID = Object.fromEntries(Object.entries(dic).map(([key , value]) => [value , key]));
        return dic;

    } catch (e) {
        console.log(`error ${e.message}`);
    }
}