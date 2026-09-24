const myDialog = document.getElementById("diagAdd");
    const btnAdd = document.getElementById("btnAdd");
    const btnCancel = document.getElementById("btnCancel");
    const diagEdit = document.getElementById("diagEdit");
    btnAdd.addEventListener("click",()=> {
        myDialog.showModal();
    });
    btnCancel.addEventListener("click",()=> {
        myDialog.close();
        diagEdit.close();
    });
    const btnEdit = document.querySelectorAll(".btnEdit");
    btnEdit.forEach((btn) =>{
        btn.addEventListener("click" , () => {
            diagEdit.showModal();
        });
    });

    const BASE_API = "http://localhost:5202/api/Patient";

    let liPatients ; // list of patients for caching +
    //  searching without depending on the server in some palces of code

    async function GetAllPatients()
    {
        try {
        const res = await fetch(`${API_Base}/GetAllPatients` , {
             method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            liPatients = data;
            return data;
        }
        else
        {
            throw new Error("couldn't get the data from the server");
        }
        }
        catch(e)
        {
            console.log(e.message);
            return null;
        }
    }