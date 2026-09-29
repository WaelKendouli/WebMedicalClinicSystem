
const API_Base = "http://localhost:5202/api";

export async function Post(obj , URI , endPoint)
{
try {
        const res = await fetch(`${API_Base}/${URI}/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({obj})
        });

        const data = await res.json();

        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            return false;
        }
        return true;

    } catch (e) {
        console.log(`error ${e.Message}`);
        return false;
    }
}

export async function Get(URI , endPoint)
{
     try {
        const res = await fetch(`${API_Base}/${URI}/${endPoint}`, {
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

export async function Delete(Id , URI , endPoint)
{
     try {
        const response = await fetch(`${API_Base}/${URI}/${endPoint}/${Id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle 400 / 404 / other errors
            const errorText = await response.text();
            console.log(errorText || `Failed to delete (${response.status})`);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting patient:', error);
        return false;
    }
}

export async function Put(Id , NewData , URI , endPoint)
{
    try {
    const res = await fetch(`${API_Base}/${URI}/${endPoint}/${Id}`,
        {
            method: "PUT" ,
            headers : {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            } ,
            body : JSON.stringify(NewData)
        });

        if (res.ok) {
            const message = await res.text();
            console.log('Success:', message);
            return true;
        } 
}
catch(e)
{
    console.log(e.message);
    return false;
}
}