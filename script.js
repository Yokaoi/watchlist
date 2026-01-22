const list = document.getElementById("list");
const undoContainer = document.getElementById("undoContainer");
const randomOutput = document.getElementById("randomOutput");

let currentFilter = "all";
let lastDeleted = null;
let undoTimeout = null;

function loadItems() {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    list.innerHTML = "";
    let filtered = currentFilter === "all" ? items : items.filter(item => item.category === currentFilter || (currentFilter==="favorites" && item.favorite));
    filtered.forEach((item,index)=>{
        const li = document.createElement("li");
        const stars = "⭐".repeat(item.rating);
        li.innerHTML = `
            <input type="checkbox" class="select-multi" data-index="${index}">
            <strong contenteditable="true" oninput="editItem(${index}, this.innerText)">${item.title}</strong>
            <span class="favorite" onclick="toggleFavorite(${index})">${item.favorite?'⭐':'☆'}</span><br>
            ${item.category} | ${item.date || 'не указана'}<br>
            <span contenteditable="true" oninput="editRating(${index}, this.innerText)">${stars}</span>
            <br><button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>
        `;
        list.appendChild(li);
    });
}

function addItem() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const rating = Number(document.getElementById("rating").value);
    if(!title) return alert("Введите название!");

    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.push({title, category, rating, favorite:false, date});
    localStorage.setItem("watchlist", JSON.stringify(items));
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    loadItems();
}

function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    lastDeleted = {item: items[index], index};
    items.splice(index,1);
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
    undoContainer.style.display = "block";
    if(undoTimeout) clearTimeout(undoTimeout);
    undoTimeout = setTimeout(()=>{undoContainer.style.display="none"; lastDeleted=null;},5000);
}

function undoDelete() {
    if(!lastDeleted) return;
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.splice(lastDeleted.index,0,lastDeleted.item);
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
    undoContainer.style.display="none"; lastDeleted=null;
    if(undoTimeout) clearTimeout(undoTimeout);
}

function editItem(index, value) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items[index].title = value;
    localStorage.setItem("watchlist", JSON.stringify(items));
}

function editRating(index,value){
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    const stars = value.length; 
    if(stars>=1 && stars<=5) items[index].rating = stars;
    localStorage.setItem("watchlist", JSON.stringify(items));
}

function toggleFavorite(index){
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items[index].favorite = !items[index].favorite;
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

function sortBy(field,order){
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.sort((a,b)=>{
        if(field==="title") return order==="asc"? a.title.localeCompare(b.title): b.title.localeCompare(a.title);
        else return order==="asc"? a.rating-b.rating:b.rating-a.rating;
    });
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

function filterCategory(category){
    currentFilter = category;
    loadItems();
}

function filterFavorites(){
    currentFilter="favorites";
    loadItems();
}

function searchItems(){
    const q=document.getElementById("search").value.toLowerCase();
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    list.innerHTML="";
    items.filter(item=>item.title.toLowerCase().includes(q)).forEach((item,index)=>{
        const li=document.createElement("li");
        const stars="⭐".repeat(item.rating);
        li.innerHTML=`<strong contenteditable="true" oninput="editItem(${index}, this.innerText)">${item.title}</strong>
        <span class="favorite" onclick="toggleFavorite(${index})">${item.favorite?'⭐':'☆'}</span><br>
        ${item.category} | ${item.date || 'не указана'}<br>
        <span contenteditable="true" oninput="editRating(${index}, this.innerText)">${stars}</span><br>
        <button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>`;
        list.appendChild(li);
    });
}

function randomMovie(){
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    if(items.length===0){ randomOutput.innerText="Список пуст!"; return;}
    const rand = items[Math.floor(Math.random()*items.length)];
    randomOutput.innerText=`🎬 ${rand.title} (${rand.category}) ⭐${rand.rating}`;
}

function changeColor(hex){ document.documentElement.style.setProperty('--main-color',`#${hex}`); }

loadItems();
