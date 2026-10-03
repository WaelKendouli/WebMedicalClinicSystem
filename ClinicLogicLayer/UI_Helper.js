export function FillDropDownList(data , list , message = "choose an options")
{
    if (data===null || data ===undefined) {
        throw new Error("data is empty check your API response");
    }
    list.innerHTML = "";
    let first = document.createElement("option");
    first.value = "";
    first.disabled = true;
    first.selected = true;
    first.textContent = message;
    list.appendChild(first);
   for(const[name,id] of Object.entries(data))
   {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = name;
        list.appendChild(opt);
   }
}

export function setLoading( element ,display)
{
  if (display===false) {
    element.style.display = "none";
  }
  else
  {
    element.style.display = "flex";
  }
}