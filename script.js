const list = document.getElementById("list");
let currentFilter = "all";

/* Загрузка и отображение */
function loadItems() {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    list.innerHTML = "";

    const filteredItems = currentFilter === "all"
        ? items
        : items.filter(item => item.category === currentFilter);

    filteredItems.forEach((item, index) => {
        const li = document.createElement("li");
        const stars = "⭐".repeat(item.rating);

        li.innerHTML = `
            <strong>${item.title}</strong><br>
            ${item.category}<br>
            ${stars}<br>
            <button class="delete-btn" onclick="deleteItem(${index})">
                Удалить
            </button>
        `;

        list.appendChild(li);
    });
}

/* Добавление */
function addItem() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const rating = Number(document.getElementById("rating").value);

    if (title === "") {
        alert("Введите название!");
        return;
    }

    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.push({ title, category, rating });

    localStorage.setItem("watchlist", JSON.stringify(items));
    document.getElementById("title").value = "";

    loadItems();
}

/* Удаление */
function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];
    items.splice(index, 1);
    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

/* Сортировка */
function sortByRating(order) {
    const items = JSON.parse(localStorage.getItem("watchlist")) || [];

    items.sort((a, b) => {
        return order === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating;
    });

    localStorage.setItem("watchlist", JSON.stringify(items));
    loadItems();
}

/* Фильтр */
function filterCategory(category) {
    currentFilter = category;
    loadItems();
}

/* Запуск при открытии */
loadItems();
