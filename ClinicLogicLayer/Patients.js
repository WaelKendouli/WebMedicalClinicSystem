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