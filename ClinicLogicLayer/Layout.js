async function loadComponent(selector, url)
{
    const container = document.querySelector(selector);
    if (!container) {
        return ;
    }
    const res = await fetch(url);
    container.innerHTML = await res.text();

}
loadComponent("#header-placeholder", "forms/elements/header.html");
loadComponent("#footer-placeholder", "forms/elements/footer.html");
