
export function ShowSpinner(SpinnerId)
{
const spinner = document.getElementById(SpinnerId);
spinner.classList.remove('d-none');

}
export function HideSpinner(SpinnerId)
{
const spinner = document.getElementById(SpinnerId);
spinner.classList.add('d-none');

}
