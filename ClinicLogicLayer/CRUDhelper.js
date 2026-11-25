
const API_Base = "http://localhost:5202/api";

export async function Post(obj , ControllerName , endPoint)
{
try {
        const res = await fetch(`${API_Base}/${ControllerName}/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(obj)
        });

        const data = await res.json();

        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            return false;
        }
        return true;

    } catch (e) {
        console.log(`error ${e.message}`);
        return false;
    }
}

export async function Get(ControllerName , endPoint)
{
     try {
        const res = await fetch(`${API_Base}/${ControllerName}/${endPoint}`, {
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

export async function GetByAttribute(ControllerName , endPoint , attribute)
{
     try {
        const res = await fetch(`${API_Base}/${ControllerName}/${endPoint}/${attribute}`, {
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


export async function Delete(Id , ControllerName , endPoint)
{
     try {
        const response = await fetch(`${API_Base}/${ControllerName}/${endPoint}/${Id}`, {
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
        console.error('Error deleting patient:', error.message);
        return false;
    }
}

export async function Put(Id , NewData , ControllerName , endPoint)
{
    try {
    const res = await fetch(`${API_Base}/${ControllerName}/${endPoint}/${Id}`,
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

export async function PostWithDataReturned(obj , ControllerName , endPoint)
{
try {
        const res = await fetch(`${API_Base}/${ControllerName}/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(obj)
        });

        const data = await res.json();

        if (!res.ok) {
            console.log(`HTTP ${res.status}`);
            return null;
        }
        return data;

    } catch (e) {
        console.log(`error ${e.message}`);
        return null;
    }
}