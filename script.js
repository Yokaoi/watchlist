const list = document.getElementById("list");
const undoContainer = document.getElementById("undoContainer");
const historyList = document.getElementById("historyList");
let currentFilter = "all";
let lastDeleted = null;
let undoTimeout = null;

let history = JSON.parse(localStorage.getItem("history")) || [];

function saveHistory(action, item = null) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    history.push({ action, items: JSON.parse(JSON.stringify(items)), item });
    localStorage.setItem("history", JSON.stringify(history));
}

function loadItems() {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    list.innerHTML = "";

    const filteredItems = currentFilter === "all" ? items : items.filter(item => item.category === currentFilter);
    filteredItems.forEach((item, index) => {
        const li = document.createElement("li");
        const stars = "⭐".repeat(item.rating);

        li.innerHTML = `
            <strong onclick="editItem(${index})" style="cursor:pointer">${item.title}</strong><br>
            ${item.category}<br>
            <span class="stars">${stars}</span><br>
            <button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>
        `;
        list.appendChild(li);
    });
}

function addItem() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const rating = Number(document.getElementById("rating").value);
    if (title === "") return alert("Введите название!");

    saveHistory("add");

    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.push({ title, category, rating });
    localStorage.setItem("watchlist", JSON.stringify(items));
    document.getElementById("title").value = "";
    loadItems();
}

function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    lastDeleted = { item: items[index], index };
    saveHistory("delete", lastDeleted.item);

    items.splice(index, 1);
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();

    undoContainer.style.display = "block";
    if (undoTimeout) clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => { undoContainer.style.display = "none"; lastDeleted = null; }, 5000);
}

function undoDelete() {
    if (!lastDeleted) return;
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.splice(lastDeleted.index, 0, lastDeleted.item);
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();

    const li = list.getElementsByTagName('li')[lastDeleted.index];
    if (li) { li.classList.add('restore'); li.addEventListener('animationend', () => li.classList.remove('restore')); }

    undoContainer.style.display = "none";
    lastDeleted = null;
    if (undoTimeout) clearTimeout(undoTimeout);
}

function editItem(index) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    const item = items[index];
    const newTitle = prompt("Изменить название:", item.title);
    if (!newTitle) return;
    const newCategory = prompt("Изменить категорию (Фильм/Сериал/Аниме/Мультфильм):", item.category);
    if (!newCategory) return;
    const newRating = prompt("Изменить рейтинг (1-5):", item.rating);
    if (!newRating || newRating < 1 || newRating > 5) return;

    saveHistory("edit", item);

    items[index] = { title: newTitle, category: newCategory, rating: Number(newRating) };
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

function sortBy(field, order) {
    saveHistory("sort");
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.sort((a, b) => field === "title" ? (order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title))
                                         : (order === "asc" ? a.rating - b.rating : b.rating - a.rating));
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

function filterCategory(category) {
    currentFilter = category;
    loadItems();
}

function searchItems() {
    const query = document.getElementById("search").value.toLowerCase();
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    list.innerHTML = "";
    items.filter(item => item.title.toLowerCase().includes(query)).forEach((item, index) => {
        const li = document.createElement("li");
        const stars = "⭐".repeat(item.rating);
        li.innerHTML = `<strong onclick="editItem(${index})" style="cursor:pointer">${item.title}</strong><br>${item.category}<br><span class="stars">${stars}</span><br><button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>`;
        list.appendChild(li);
    });
}

function showHistory() {
    historyList.innerHTML = "";
    history.forEach((h, i) => {
        const li = document.createElement("li");
        li.textContent = `${i+1}. ${h.action} (${h.items.length} элементов)`;
        li.onclick = () => { localStorage.setItem("watchlist", JSON.stringify(h.items)); loadItems(); };
        historyList.appendChild(li);
    });
}

function changeColor(hex) {
    document.documentElement.style.setProperty('--main-color', `#${hex}`);
}

loadItems();
