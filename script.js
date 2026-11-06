const grid = document.getElementById("grid");
const pagination = document.getElementById("pagination");
const search = document.getElementById("search");
const sortBtn = document.getElementById("sortBtn");

let bosses = [];
let currentPage = 1;
let itemsPerPage = 8;
let isSorted = false;

async function loadBosses(){

    grid.innerHTML = "<p style='padding:20px'>Carregando...</p>";

    try{
        const res = await fetch("https://eldenring.fanapis.com/api/bosses?limit=100");
        const data = await res.json();

        bosses = data.data || [];
        render();

    }catch(err){
        grid.innerHTML = "<p style='padding:20px'>Erro ao carregar dados.</p>";
    }
}

function render(){

    let list = [...bosses];

    const query = search.value.toLowerCase();

    if(query){
        list = list.filter(b =>
            b.name.toLowerCase().includes(query)
        );
    }

    if(isSorted){
        list.sort((a,b) => a.name.localeCompare(b.name));
    }

    if(list.length === 0){
        grid.innerHTML = "<p style='padding:20px'>Nenhum boss encontrado.</p>";
        pagination.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageItems = list.slice(start, end);

    grid.innerHTML = pageItems.map(boss => {

        const img = boss.image?.trim()
            ? boss.image
            : "https://via.placeholder.com/300x180";

        const location = boss.location || boss.region || "Unknown";
        const type = boss.type || "Boss";
        const description = boss.description || "No description available";

        return `
            <div class="card">

                <img src="${img}" alt="${boss.name}">

                <h3>${boss.name}</h3>

                <div class="meta">
                    <span>Location: ${location}</span>
                    <span>Type: ${type}</span>
                </div>

                <p>${description}</p>

            </div>
        `;
    }).join("");

    renderPagination(list.length);
}

function renderPagination(total){

    const pages = Math.ceil(total / itemsPerPage);

    pagination.innerHTML = "";

    for(let i = 1; i <= pages; i++){

        pagination.innerHTML += `
            <button class="${i === currentPage ? "active" : ""}"
            onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
}

function goToPage(page){
    currentPage = page;
    render();
}

search.addEventListener("input", ()=>{
    currentPage = 1;
    render();
});

sortBtn.addEventListener("click", ()=>{
    isSorted = !isSorted;
    render();
});

loadBosses();