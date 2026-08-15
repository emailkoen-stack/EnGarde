let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
let plannerWeekOffset = 0;
let currentRecipeIndex = null;
let editingRecipe = null;
let shoppingChecked =
    JSON.parse(
        localStorage.getItem("shoppingChecked") || "{}"
    );
let shoppingCleared =
    JSON.parse(
        localStorage.getItem("shoppingCleared") || "{}"
    );

/* ---------- 1. CONSTANTS ---------- */
/* ----------    ├── categorieën ---------- */
/* ----------    ├── eenheden ---------- */
/* ----------    ├── maaltijdtypes ---------- */
/* ----------    ├── dagen ---------- */
/* ----------    ├── recepttypes ---------- */
/* ----------    ├── keukens ---------- */
/* ----------    └── hoofdingrediënten ---------- */
const INGREDIENT_CATEGORIES = [
    "Groenten & fruit",
    "Vlees & vis",
    "Zuivel & eieren",
    "Droge voeding",
    "Conserven & sauzen",
    "Kruiden & specerijen",
    "Brood & bakkerij",
    "Diepvries",
    "Dranken",
    "Overig"
];
const INGREDIENT_UNITS = [
    ["g", "gram (g)"],
    ["kg", "kilogram (kg)"],
    ["ml", "milliliter (ml)"],
    ["cl", "centiliter (cl)"],
    ["l", "liter (l)"],
    ["stuks", "stuks"],
    ["el", "eetlepel (el)"],
    ["tl", "theelepel (tl)"],
    ["teentjes", "teentjes"],
    ["snufjes", "snufjes"]
];
const MEAL_TYPES = {
    Ontbijt: "🥐 Ontbijt",
    Lunch: "🥪 Lunch",
    Avondeten: "🍽️ Avondeten",
    Snack: "🍎 Snack"
};
const DAYS = [
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
    "Zondag"
];
const RECIPE_TYPES = [
    "Hoofdgerecht",
    "Voorgerecht",
    "Bijgerecht",
    "Dessert",
    "Ontbijt / lunch",
    "Soep",
    "Salade",
    "Hapje / snack",
    "Gebak"
];
const RECIPE_CUISINES = [
    "Belgisch",
    "Frans",
    "Italiaans",
    "Spaans",
    "Grieks",
    "Mexicaans",
    "Aziatisch",
    "Amerikaans",
    "Mediterraan",
    "Overig"
];
const MAIN_INGREDIENTS = [
    "Rund",
    "Varken",
    "Kip",
    "Vis",
    "Schaaldieren",
    "Vegetarisch",
    "Vegan",
    "Pasta",
    "Rijst",
    "Groenten"
];

/* ---------- 2. DATA / STORAGE ---------- */
/* ----------    ├── saveRecipes() ---------- */
/* ----------    ├── saveMealPlan() ---------- */

function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}
function saveMealPlan() {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}
/* ---------- 3. HELPERS ---------- */
/* ----------    ├── getCategoryIcon() ---------- */
/* ----------    ├── databaseCategories() ---------- */
/* ----------    ├── databaseUnits() ---------- */
/* ----------    ├── formatAmount() ---------- */
/* ----------    ├── scaledAmount() ---------- */
/* ----------    ├── getWeekStart() ---------- */
/* ----------    ├── getWeekKey() ---------- */
/* ----------    ├── getWeekDateRange() ---------- */
/* ----------    ├── formatPlannerDate() ---------- */
function getCategoryIcon(category) {

    const icons = {

        "Groenten & fruit": "🥬",

        "Vlees & vis": "🥩",

        "Zuivel & eieren": "🥛",

        "Droge voeding": "🍝",

        "Conserven & sauzen": "🥫",

        "Kruiden & specerijen": "🧂",

        "Brood & bakkerij": "🥖",

        "Diepvries": "🧊",

        "Dranken": "🥤",

        "Overig": "🛒"

    };

    return icons[category] || "🛒";
}
function databaseCategories(selected = "") {

    return INGREDIENT_CATEGORIES.map(
        category => `
            <option
                value="${category}"
                ${category === selected ? "selected" : ""}>
                ${getCategoryIcon(category)}
                ${category}
            </option>
        `
    ).join("");
}
function databaseUnits(selected = "") {

    return INGREDIENT_UNITS.map(
        ([value, label]) => `
            <option
                value="${value}"
                ${value === selected ? "selected" : ""}>
                ${label}
            </option>
        `
    ).join("");
}
function formatAmount(amount, unit = "", name = "") {

    amount = Number(amount);

    if (!Number.isFinite(amount)) {
        return 0;
    }

    const normalizedUnit =
        String(unit).toLowerCase().trim();

    const normalizedName =
        String(name).toLowerCase().trim();

    // Hele aantallen
    const wholeUnits = [
        "stuks",
        "teentjes",
        "eieren"
    ];

    const wholeNames = [
        "ei",
        "eieren"
    ];

    if (
        wholeUnits.includes(normalizedUnit) ||
        wholeNames.includes(normalizedName)
    ) {
        return Math.max(1, Math.ceil(amount));
    }

    // Lepels afronden op kwartjes
    if (
        normalizedUnit === "el" ||
        normalizedUnit === "tl"
    ) {
        return Number(
            (Math.round(amount * 4) / 4).toFixed(2)
        );
    }

    // Overige hoeveelheden
    return Number(amount.toFixed(2));
}
function scaledAmount(recipe, ingredient) {

    const originalPersons =
        recipe.persons || 1;

    const selectedPersons =
        recipe.selectedPersons ||
        originalPersons;

    const factor =
        selectedPersons / originalPersons;

    return ingredient.amount * factor;

}
function getWeekStart(offset = 0) {

    const date = new Date();

    date.setHours(0, 0, 0, 0);

    // Maandag van deze week
    const day =
        date.getDay() === 0
            ? 7
            : date.getDay();

    date.setDate(
        date.getDate() -
        (day - 1) +
        (offset * 7)
    );

    return date;
}
function getWeekKey(offset = 0) {

    const date = getWeekStart(offset);

    const thursday = new Date(date);

    thursday.setDate(
        thursday.getDate() + 3
    );

    const year =
        thursday.getFullYear();

    const firstThursday =
        new Date(year, 0, 4);

    const firstDay =
        firstThursday.getDay() === 0
            ? 7
            : firstThursday.getDay();

    firstThursday.setDate(
        firstThursday.getDate() -
        (firstDay - 1)
    );

    const week =
        Math.round(
            (date - firstThursday) /
            (7 * 86400000)
        ) + 1;

    return `${year}-W${String(week).padStart(2, "0")}`;
}
function getWeekDateRange(offset = 0) {

    const start =
        getWeekStart(offset);

    const end =
        new Date(start);

    end.setDate(
        end.getDate() + 6
    );


    const formatDate = date => {

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        return `${day}/${month}`;

    };


    return `${formatDate(start)} – ${formatDate(end)}`;

}
function formatPlannerDate(dayIndex) {

    const date = getWeekStart(plannerWeekOffset);

    date.setDate(
        date.getDate() + dayIndex
    );

    const day =
        String(date.getDate()).padStart(2, "0");

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    return `${day}/${month}`;
}

/* ---------- 4. NAVIGATION ---------- */
/* ----------    ├── openSection() ---------- */
/* ----------    ├── goHome() ---------- */
/* ----------    ├── showSettings() ---------- */
function openSection(section) {

    if (section === "recipes") {
        showRecipes();
    }

    if (section === "planner") {
        showPlanner();
    }

    if (section === "shopping") {
        showShoppingList();
    }

    if (section === "settings") {
        showSettings();
    }


    /*
     * Actieve knop in de bottom navigation
     */
    document.querySelectorAll(".bottom-nav button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const activeButton =
        document.querySelector(
            `.bottom-nav button[data-section="${section}"]`
        );


    if (activeButton) {
        activeButton.classList.add("active");
    }

}
function goHome() {

    location.reload();

}
function showSettings() {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="goHome()">
                ‹
            </button>

            <h2>Instellingen</h2>

            <div></div>

        </div>


        <div class="settings-list">

            <button
                class="settings-item"
                onclick="showIngredients()">

                <span class="settings-icon">
                    🥕
                </span>

                <span class="settings-text">

                    <strong>
                        Ingrediënten
                    </strong>

                    <small>
                        Ingrediëntendatabase beheren
                    </small>

                </span>

                <span class="arrow">
                    ›
                </span>

            </button>


            <button
                class="settings-item"
                onclick="showBackup()">

                <span class="settings-icon">
                    💾
                </span>

                <span class="settings-text">

                    <strong>
                        Backup
                    </strong>

                    <small>
                        Gegevens exporteren of terugzetten
                    </small>

                </span>

                <span class="arrow">
                    ›
                </span>

            </button>


        </div>

    `;
}

/* ---------- 5. RECIPES ---------- */
/* ----------    ├── showRecipes() ---------- */
/* ----------    ├── filterRecipes() ---------- */
/* ----------    ├── renderRecipes() ---------- */
/* ----------    ├── newRecipe() ---------- */
/* ----------    ├── saveNewRecipe() ---------- */
/* ----------    ├── editRecipe() ---------- */
/* ----------    ├── saveEditedRecipe() ---------- */
/* ----------    ├── viewRecipe() ---------- */
/* ----------    ├── changeRecipePersons() ---------- */
/* ----------    ├── cancelEditRecipe() ---------- */
/* ----------    ├── showSaveConfirmDialog() ---------- */
/* ----------    ├── confirmSaveRecipe() ---------- */
/* ----------    ├── confirmDiscardRecipe() ---------- */
/* ----------    ├── closeSaveConfirmDialog() ---------- */
/* ----------    ├── viewRecipeById ---------- */
function showRecipes() {

    const main = document.querySelector("main");

    main.innerHTML = `
        <div class="page-header">
            <button class="back-button" onclick="goHome()">‹</button>
            <h2>Recepten</h2>
            <button class="new-recipe-button" onclick="newRecipe()">＋</button>
        </div>
        <div class="recipe-search">

            <input
                id="recipe-search-input"
                type="search"
                placeholder="🔎 Zoek recept..."
                oninput="filterRecipes()">


            <div class="recipe-filters">

                <select
                    id="recipe-type-filter"
                    onchange="filterRecipes()">

                    <option value="">
                        Alle types
                    </option>

                    <option value="Voorgerecht">
                        Voorgerechten
                    </option>

                    <option value="Hoofdgerecht">
                        Hoofdgerechten
                    </option>

                    <option value="Bijgerecht">
                        Bijgerechten
                    </option>

                    <option value="Dessert">
                        Desserts
                    </option>

                    <option value="Ontbijt">
                        Ontbijt
                    </option>

                    <option value="Lunch">
                        Lunch
                    </option>

                </select>


                <select
                    id="recipe-cuisine-filter"
                    onchange="filterRecipes()">

                    <option value="">
                        Alle keukens
                    </option>

                    <option value="Belgisch">
                        Belgisch
                    </option>

                    <option value="Frans">
                        Frans
                    </option>

                    <option value="Italiaans">
                        Italiaans
                    </option>

                    <option value="Spaans">
                        Spaans
                    </option>

                    <option value="Grieks">
                        Grieks
                    </option>

                    <option value="Mexicaans">
                        Mexicaans
                    </option>

                    <option value="Aziatisch">
                        Aziatisch
                    </option>

                    <option value="Amerikaans">
                        Amerikaans
                    </option>

                    <option value="Mediterraan">
                        Mediterraan
                    </option>

                    <option value="Overig">
                        Overig
                    </option>

                </select>


                <button
                    type="button"
                    id="favorite-filter"
                    class="filter-button"
                    onclick="toggleFavoriteFilter()">

                    ⭐ Favorieten

                </button>

            </div>
            <div class="tag-search">

                <input
                    id="recipe-tag-filter"
                    type="search"
                    placeholder="🏷️ Zoek op tag..."
                    oninput="filterRecipes()">

            </div>
            <div class="recipe-sort">

                <span class="recipe-sort-label">
                    Sorteren op
                </span>

                <select
                    id="recipe-sort"
                    onchange="filterRecipes()">

                    <option value="name-asc">
                        Naam A → Z
                    </option>

                    <option value="name-desc">
                        Naam Z → A
                    </option>

                    <option value="favorite">
                        ⭐ Favorieten eerst
                    </option>

                    <option value="newest">
                        Nieuwste eerst
                    </option>

                </select>

            </div>
            <button
                type="button"
                class="clear-filters-button"
                onclick="clearRecipeFilters()">

                Filters wissen

            </button>
        </div>
        <div id="recipe-list"></div>
    `;

    renderRecipes();
}
function filterRecipes() {

    const search =
        document.getElementById("recipe-search-input")
            .value
            .toLowerCase()
            .trim();


    const type =
        document.getElementById("recipe-type-filter")
            .value;


    const cuisine =
        document.getElementById("recipe-cuisine-filter")
            .value;


    const tag =
        document.getElementById("recipe-tag-filter")
            .value
            .toLowerCase()
            .trim();


    const favoritesOnly =
        document
            .getElementById("favorite-filter")
            .classList
            .contains("active");


    const sort =
        document.getElementById("recipe-sort")
            .value;


    let filteredRecipes =
        recipes.filter(recipe => {

            const matchesSearch =
                (recipe.name || "")
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                !type ||
                (recipe.type || "Hoofdgerecht") === type;


            const matchesCuisine =
                !cuisine ||
                (recipe.cuisine || "") === cuisine;


            const matchesTag =
                !tag ||
                (recipe.tags || [])
                    .some(recipeTag =>
                        recipeTag
                            .toLowerCase()
                            .includes(tag)
                    );


            const matchesFavorite =
                !favoritesOnly ||
                recipe.favorite === true;


            return (
                matchesSearch &&
                matchesType &&
                matchesCuisine &&
                matchesTag &&
                matchesFavorite
            );

        });


    // Sorteer de gefilterde recepten
    filteredRecipes.sort((a, b) => {

        if (sort === "name-asc") {

            return (a.name || "")
                .localeCompare(
                    b.name || "",
                    "nl",
                    { sensitivity: "base" }
                );

        }


        if (sort === "name-desc") {

            return (b.name || "")
                .localeCompare(
                    a.name || "",
                    "nl",
                    { sensitivity: "base" }
                );

        }


        if (sort === "favorite") {

            if (a.favorite === b.favorite) {

                return (a.name || "")
                    .localeCompare(
                        b.name || "",
                        "nl",
                        { sensitivity: "base" }
                    );

            }

            return a.favorite ? -1 : 1;

        }


        if (sort === "newest") {

            return (b.createdAt || 0) -
                   (a.createdAt || 0);

        }


        return 0;

    });


    renderRecipes(filteredRecipes);
}
function renderRecipes(recipeList = recipes) {

    const list = document.getElementById("recipe-list");

    if (recipeList.length === 0) {

        list.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">🔎</div>

                <h3>Geen recepten gevonden</h3>

                <p>
                    Probeer een andere zoekterm.
                </p>

            </div>
        `;

        return;
    }


    list.innerHTML = recipeList.map(recipe => {

        const index =
            recipes.indexOf(recipe);


        return `

            <button
                class="recipe-card"
                onclick="viewRecipe(${index})">

                <div class="recipe-icon">
                    🍽️
                </div>


                <div class="recipe-info">

                    <strong>
                        ${recipe.name}
                    </strong>


                    <small>
                        ${recipe.type || "Hoofdgerecht"}
                        ${
                            recipe.cuisine
                            ? " · " + recipe.cuisine
                            : ""
                        }
                    </small>


                    <small>
                        👥 ${recipe.persons} personen
                        ${
                            recipe.favorite
                            ? " · ⭐"
                            : ""
                        }
                    </small>

                </div>


                <span class="arrow">
                    ›
                </span>

            </button>

        `;

    }).join("");
}
function newRecipe() {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">
            <button class="back-button" onclick="showRecipes()">‹</button>
            <h2>Nieuw recept</h2>
            <div></div>
        </div>

        <div class="form">

            <label>
                Naam van het recept

                <input
                    id="recipe-name"
                    type="text"
                    placeholder="Bijvoorbeeld spaghetti bolognese">
            </label>


            <label>
                Aantal personen

                <input
                    id="recipe-persons"
                    type="number"
                    value="4"
                    min="1">
            </label>


            <label>
                Type gerecht

                <select id="recipe-type">

                    ${RECIPE_TYPES.map(type => `

                        <option value="${type}">
                            ${type}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Keuken

                <select id="recipe-cuisine">

                    <option value="">Geen specifieke keuken</option>

                    ${RECIPE_CUISINES.map(cuisine => `

                        <option value="${cuisine}">
                            ${cuisine}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Hoofdingrediënt

                <select id="recipe-main-ingredient">

                    <option value="">Geen</option>

                    ${MAIN_INGREDIENTS.map(ingredient => `

                        <option value="${ingredient}">
                            ${ingredient}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Bereidingstijd

                <select id="recipe-time">

                    <option value="< 15 min">&lt; 15 min</option>
                    <option value="15–30 min">15–30 min</option>
                    <option value="30–60 min">30–60 min</option>
                    <option value="> 60 min">&gt; 60 min</option>

                </select>

            </label>


            <label>
                Tags

                <input
                    id="recipe-tags"
                    type="text"
                    placeholder="Kidsproof, BBQ, Favoriet...">

                <small class="field-help">
                    Scheid meerdere tags met komma's.
                </small>

            </label>


            <label class="checkbox-label">

                <input
                    id="recipe-favorite"
                    type="checkbox">

                ⭐ Favoriet

            </label>


            <label>
                Beschrijving

                <textarea
                    id="recipe-description"
                    placeholder="Korte beschrijving van het gerecht"></textarea>

            </label>


            <button
                class="primary-button"
                onclick="saveNewRecipe()">

                Recept opslaan

            </button>

        </div>
    `;
}
function saveNewRecipe() {

    const name =
        document.getElementById("recipe-name").value.trim();

    const persons =
        Number(document.getElementById("recipe-persons").value);

    const type =
        document.getElementById("recipe-type").value;

    const cuisine =
        document.getElementById("recipe-cuisine").value;

    const mainIngredient =
        document.getElementById("recipe-main-ingredient").value;

    const time =
        document.getElementById("recipe-time").value;

    const tagsText =
        document.getElementById("recipe-tags").value;

    const favorite =
        document.getElementById("recipe-favorite").checked;

    const description =
        document.getElementById("recipe-description").value.trim();


    if (!name) {

        alert("Geef het recept een naam.");

        return;
    }


    const tags = tagsText
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");


    const recipe = {

        id: Date.now(),

        name: name,

        persons: persons || 4,

        type: type,

        cuisine: cuisine,

        mainIngredient: mainIngredient,

        time: time,

        tags: tags,

        favorite: favorite,

        description: description,

        ingredients: [],

        instructions: []

    };


    recipes.push(recipe);

    saveRecipes();

    showRecipes();
}
function editRecipe(index) {

    if (!editingRecipe || editingRecipe._index !== index) {

        editingRecipe = structuredClone(recipes[index]);

        editingRecipe._index = index;

    }

    const recipe = editingRecipe;

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="cancelEditRecipe(${index})">
                ‹
            </button>

            <h2>Recept bewerken</h2>

            <div></div>

        </div>


        <div class="form">
            <div class="section-title">

                <h3>Receptgegevens</h3>

            </div>
            <label>
                Naam van het recept

                <input
                    id="edit-recipe-name"
                    type="text"
                    value="${recipe.name}">
            </label>


            <label>
                Aantal personen

                <input
                    id="edit-recipe-persons"
                    type="number"
                    value="${recipe.persons}"
                    min="1">
            </label>


            <label>
                Type gerecht

                <select id="edit-recipe-type">

                    ${RECIPE_TYPES.map(type => `

                        <option value="${type}">
                            ${type}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Keuken

                <select id="edit-recipe-cuisine">

                    <option value="">Geen specifieke keuken</option>

                    ${RECIPE_CUISINES.map(cuisine => `

                        <option value="${cuisine}">
                            ${cuisine}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Hoofdingrediënt

                <select id="edit-recipe-main-ingredient">

                    <option value="">Geen</option>

                    ${MAIN_INGREDIENTS.map(ingredient => `

                        <option value="${ingredient}">
                            ${ingredient}
                        </option>

                    `).join("")}

                </select>

            </label>


            <label>
                Bereidingstijd

                <select id="edit-recipe-time">

                    <option value="< 15 min">&lt; 15 min</option>
                    <option value="15–30 min">15–30 min</option>
                    <option value="30–60 min">30–60 min</option>
                    <option value="> 60 min">&gt; 60 min</option>

                </select>

            </label>


            <label>
                Tags

                <input
                    id="edit-recipe-tags"
                    type="text"
                    value="${(recipe.tags || []).join(", ")}">

                <small class="field-help">
                    Scheid meerdere tags met komma's.
                </small>

            </label>


            <label class="checkbox-label">

                <input
                    id="edit-recipe-favorite"
                    type="checkbox"
                    ${recipe.favorite ? "checked" : ""}>

                ⭐ Favoriet

            </label>


            <label>
                Beschrijving

                <textarea
                    id="edit-recipe-description"
                    placeholder="Korte beschrijving van het gerecht">${recipe.description || ""}</textarea>

            </label>


            <div class="section-title">

                <h3>Ingrediënten</h3>

            </div>


            <div class="edit-ingredients-list">

                ${
                    (recipe.ingredients || []).length === 0

                    ? `
                        <p class="placeholder">
                            Nog geen ingrediënten toegevoegd.
                        </p>
                    `

                    : (recipe.ingredients || []).map((ingredient, ingredientIndex) => `

                        <div class="edit-ingredient-row">

                            <div class="edit-ingredient-info">

                                <strong>
                                    ${formatAmount(
                                        ingredient.amount,
                                        ingredient.unit,
                                        ingredient.name
                                    )}
                                    ${ingredient.unit}
                                </strong>

                                <span>
                                    ${ingredient.name}
                                </span>

                                ${
                                    ingredient.note
                                    ? `<small>${ingredient.note}</small>`
                                    : ""
                                }

                            </div>


                            <div class="ingredient-actions">

                                <button
                                    type="button"
                                    class="edit-ingredient"
                                    onclick="editIngredient(${index}, ${ingredientIndex}, true)">
                                    ✏️
                                </button>

                                <button
                                    type="button"
                                    class="delete-ingredient"
                                    onclick="deleteIngredient(${index}, ${ingredientIndex}, true)">
                                    ×
                                </button>

                            </div>

                        </div>

                    `).join("")
                }

            </div>


            <button
                type="button"
                class="secondary-button"
                onclick="addIngredientFromEdit(${index})">

                ＋ Ingrediënt toevoegen

            </button>


            <div class="section-title">

                <h3>Bereiding</h3>

            </div>


            <div id="instruction-list"></div>


            <button
                type="button"
                class="secondary-button"
                onclick="addInstructionStep()">

                ＋ Stap toevoegen

            </button>

            <button
                class="primary-button"
                onclick="saveEditedRecipe(${index})">

                Wijzigingen opslaan

            </button>

        </div>
    `;


    document.getElementById("edit-recipe-type").value =
        recipe.type || "Hoofdgerecht";

    document.getElementById("edit-recipe-cuisine").value =
        recipe.cuisine || "";

    document.getElementById("edit-recipe-main-ingredient").value =
        recipe.mainIngredient || "";

    document.getElementById("edit-recipe-time").value =
        recipe.time || "< 15 min";
    const instructions =
        Array.isArray(recipe.instructions)
        ? recipe.instructions
        : [];

    instructions.forEach((instruction, index) => {

    addInstructionStep(instruction);

});
}
function saveEditedRecipe(index) {

    const recipe = editingRecipe;


    const name =
        document.getElementById("edit-recipe-name")
            .value
            .trim();

    const persons =
        Number(
            document.getElementById("edit-recipe-persons")
                .value
        );

    const type =
        document.getElementById("edit-recipe-type").value;

    const cuisine =
        document.getElementById("edit-recipe-cuisine").value;

    const mainIngredient =
        document.getElementById("edit-recipe-main-ingredient").value;

    const time =
        document.getElementById("edit-recipe-time").value;

    const tagsText =
        document.getElementById("edit-recipe-tags").value;

    const favorite =
        document.getElementById("edit-recipe-favorite").checked;

    const description =
        document.getElementById("edit-recipe-description")
            .value
            .trim();


    const instructions =
        Array.from(
            document.querySelectorAll(".instruction-input")
        )
        .map(input => input.value.trim())
        .filter(step => step !== "");


    if (!name) {

        alert("Geef het recept een naam.");

        return;
    }


    if (!persons || persons < 1) {

        alert("Geef een geldig aantal personen.");

        return;
    }


    const tags =
        tagsText
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");


    recipe.name = name;
    recipe.persons = persons;
    recipe.type = type;
    recipe.cuisine = cuisine;
    recipe.mainIngredient = mainIngredient;
    recipe.time = time;
    recipe.tags = tags;
    recipe.favorite = favorite;
    recipe.description = description;
    recipe.instructions = instructions;


    // Tijdelijke versie definitief maken
    delete recipe._index;

    recipes[index] = recipe;


    saveRecipes();


    // Bewerkmodus afsluiten
    editingRecipe = null;


    viewRecipe(index);
}
function viewRecipe(index) {

    const recipe = recipes[index];

    const main = document.querySelector("main");

    const tags = recipe.tags && recipe.tags.length
        ? recipe.tags.map(tag =>
            `<span class="tag">${tag}</span>`
          ).join("")
        : "";

    const ingredients = recipe.ingredients || [];

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showRecipes()">
                ‹
            </button>

            <h2>Recept</h2>

            <button
                class="new-recipe-button"
                onclick="editRecipe(${index})">
                ✏️
            </button>

        </div>


        <div class="recipe-detail">

            <div class="big-recipe-icon">
                🍽️
            </div>


            <h1>${recipe.name}</h1>


            <div class="recipe-meta">

                <div class="servings-control">

                    <button
                        class="servings-button"
                        onclick="changeRecipePersons(${index}, -1)">
                        −
                    </button>

                    <strong id="recipe-persons-display">
                        ${recipe.selectedPersons || recipe.persons} personen
                    </strong>

                    <button
                        class="servings-button"
                        onclick="changeRecipePersons(${index}, 1)">
                        +
                    </button>

                </div>


                <span>🍽️ ${recipe.type}</span>

                ${
                    recipe.cuisine
                    ? `<span>🌍 ${recipe.cuisine}</span>`
                    : ""
                }

                ${
                    recipe.mainIngredient
                    ? `<span>🥩 ${recipe.mainIngredient}</span>`
                    : ""
                }

                <span>⏱ ${recipe.time}</span>

            </div>


            ${
                tags
                ? `<div class="tags">${tags}</div>`
                : ""
            }


            ${
                recipe.favorite
                ? `<div class="favorite">⭐ Favoriet</div>`
                : ""
            }


            ${
                recipe.description
                ? `<p>${recipe.description}</p>`
                : ""
            }


            <div class="section-title">

                <h3>Ingrediënten</h3>

            </div>


            <div class="ingredients-list">

                ${
                    ingredients.length === 0

                    ? `
                        <p class="placeholder">
                            Nog geen ingrediënten toegevoegd.
                        </p>
                    `

                    : ingredients.map((ingredient, ingredientIndex) => `

                        <div class="ingredient-row">

                            <div class="ingredient-amount">
                                ${formatAmount(
                                    scaledAmount(recipe, ingredient),
                                    ingredient.unit,
                                    ingredient.name
                                )}
                                ${ingredient.unit}
                            </div>


                            <div class="ingredient-name">
                                ${ingredient.name}

                                ${
                                    ingredient.note
                                    ? `<small>${ingredient.note}</small>`
                                    : ""
                                }
                            </div>

                        </div>

                    `).join("")
                }

            </div>


            <div class="section-title">

                <h3>Bereiding</h3>

            </div>


            <div class="instructions-list">

                ${
                    Array.isArray(recipe.instructions) &&
                    recipe.instructions.length > 0

                    ? recipe.instructions.map((step, stepIndex) => `

                        <div class="instruction-display">

                            <div class="instruction-display-number">
                                ${stepIndex + 1}
                            </div>

                            <div class="instruction-text">
                                ${step}
                            </div>

                        </div>

                    `).join("")

                    : `
                        <p class="placeholder">
                            Nog geen bereidingsstappen toegevoegd.
                        </p>
                    `
                }

            </div>

        </div>
    `;
}
function changeRecipePersons(recipeIndex, change) {

    const recipe = recipes[recipeIndex];

    const current =
        recipe.selectedPersons || recipe.persons;

    const newPersons =
        Math.max(1, current + change);

    recipe.selectedPersons = newPersons;

    saveRecipes();

    viewRecipe(recipeIndex);
}
function cancelEditRecipe(index) {

    showSaveConfirmDialog(index);
}
function showSaveConfirmDialog(index) {

    const main = document.querySelector("main");

    main.insertAdjacentHTML("beforeend", `

        <div class="save-confirm-overlay">

            <div class="save-confirm-dialog">

                <h3>Wijzigingen opslaan?</h3>

                <p>
                    Je hebt wijzigingen aangebracht.
                    Wil je deze opslaan voordat je het recept verlaat?
                </p>

                <div class="save-confirm-buttons">

                    <button
                        class="primary-button"
                        onclick="confirmSaveRecipe(${index})">
                        Opslaan
                    </button>

                    <button
                        class="secondary-button"
                        onclick="confirmDiscardRecipe(${index})">
                        Niet opslaan
                    </button>

                    <button
                        class="cancel-button"
                        onclick="closeSaveConfirmDialog()">
                        Annuleren
                    </button>

                </div>

            </div>

        </div>

    `);
}
function confirmSaveRecipe(index) {

    closeSaveConfirmDialog();

    saveEditedRecipe(index);
}
function confirmDiscardRecipe(index) {

    closeSaveConfirmDialog();

    editingRecipe = null;

    viewRecipe(index);
}
function closeSaveConfirmDialog() {

    const dialog =
        document.querySelector(".save-confirm-overlay");

    if (dialog) {
        dialog.remove();
    }
}
function viewRecipeById(recipeId) {

    const index = recipes.findIndex(
        recipe => recipe.id === recipeId
    );

    if (index !== -1) {
        viewRecipe(index);
    }
}

/* ---------- 6. INGREDIENTS ---------- */
/* ----------    ├── addIngredient() ---------- */
/* ----------    ├── editIngredient() ---------- */
/* ----------    ├── saveIngredient() ---------- */
/* ----------    ├── saveEditedIngredient() ---------- */
/* ----------    ├── deleteIngredient() ---------- */
/* ----------    ├── newCustomIngredient() ---------- */
/* ----------    ├── saveCustomIngredient() ---------- */
/* ----------    ├── updateIngredientDefaults() ---------- */
/* ----------    └── addIngredientFromEdit() ---------- */
function addIngredient(recipeIndex, fromEdit = false) {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="${fromEdit
                    ? `editRecipe(${recipeIndex})`
                    : `viewRecipe(${recipeIndex})`
                }">
                ‹
            </button>

            <h2>Ingrediënt</h2>

            <div></div>

        </div>


        <div class="form">

            <label>
                Ingrediënt

                <input
                    id="ingredient-name"
                    list="ingredient-options"
                    type="text"
                    placeholder="Zoek ingrediënt..."
                    onchange="updateIngredientDefaults()">

                <datalist id="ingredient-options">

                    ${
                        getAllIngredients().map(ingredient => `
                            <option value="${ingredient.name}">
                        `).join("")
                    }

                </datalist>
                <button
                    type="button"
                    class="secondary-button"
                    onclick="newCustomIngredient(${recipeIndex})">

                    ＋ Nieuw ingrediënt

                </button>

            </label>


            <label>
                Hoeveelheid

                <input
                    id="ingredient-amount"
                    type="number"
                    step="0.01"
                    placeholder="Bijvoorbeeld 500">
            </label>


            <label>
                Eenheid

                <select id="ingredient-unit">

                    ${databaseUnits()}

                </select>

            </label>


            <label>
                Categorie

                <select id="ingredient-category">

                    ${databaseCategories()}

                </select>

            </label>


            <label>
                Opmerking

                <input
                    id="ingredient-note"
                    type="text"
                    placeholder="Bijvoorbeeld fijngesneden">

            </label>


            <button
                class="primary-button"
                onclick="saveIngredient(${recipeIndex}, ${fromEdit})">

                Ingrediënt toevoegen

            </button>

        </div>
    `;
}
function editIngredient(recipeIndex, ingredientIndex, fromEdit = false) {

    const recipe = recipes[recipeIndex];

    const ingredient =
        recipe.ingredients[ingredientIndex];

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="${fromEdit
                    ? `editRecipe(${recipeIndex})`
                    : `viewRecipe(${recipeIndex})`
                }">
                ‹
            </button>

            <h2>Ingrediënt bewerken</h2>

            <div></div>

        </div>


        <div class="form">

            <label>
                Ingrediënt

                <input
                    id="edit-ingredient-name"
                    list="ingredient-options"
                    type="text"
                    value="${ingredient.name}">
                
                <datalist id="ingredient-options">

                    ${
                        getAllIngredients()
                        .map(item => `
                            <option value="${item.name}">
                        `)
                        .join("")
                    }

                </datalist>

            </label>


            <label>
                Hoeveelheid

                <input
                    id="edit-ingredient-amount"
                    type="number"
                    step="0.01"
                    value="${ingredient.amount}">
            </label>


            <label>
                Eenheid

                <select id="edit-ingredient-unit">

                    ${databaseUnits()}

                </select>

            </label>


            <label>
                Categorie

                <select id="edit-ingredient-category">

                    ${databaseCategories()}

                </select>

            </label>


            <label>
                Opmerking

                <input
                    id="edit-ingredient-note"
                    type="text"
                    value="${ingredient.note || ""}"
                    placeholder="Bijvoorbeeld fijngesneden">

            </label>


            <button
                class="primary-button"
                onclick="saveEditedIngredient(${recipeIndex}, ${ingredientIndex}, ${fromEdit})">

                Wijzigingen opslaan

            </button>

        </div>
    `;


    document.getElementById("edit-ingredient-unit").value =
        ingredient.unit;

    document.getElementById("edit-ingredient-category").value =
        ingredient.category || "Overig";
}
function saveIngredient(recipeIndex, fromEdit = false) {

    const amount =
        Number(
            document.getElementById("ingredient-amount").value
        );

    const name =
        document.getElementById("ingredient-name")
            .value
            .trim();

    const note =
        document.getElementById("ingredient-note")
            .value
            .trim();


    if (!name) {

        alert("Geef het ingrediënt een naam.");

        return;
    }


    if (!amount || amount <= 0) {

        alert("Geef een geldige hoeveelheid in.");

        return;
    }


    const databaseIngredient =
        getAllIngredients().find(
            item =>
                item.name.toLowerCase().trim() ===
                name.toLowerCase().trim()
        );


    if (!databaseIngredient) {

        alert(
            "Kies een ingrediënt uit de voorgestelde lijst.\n\n" +
            "Wil je een nieuw ingrediënt toevoegen? " +
            "Gebruik dan '＋ Nieuw ingrediënt'."
        );

        return;
    }


    const unit =
        databaseIngredient.unit;

    const category =
        databaseIngredient.category;

    const shopping =
        databaseIngredient.shopping !== false;


    if (fromEdit) {

        if (!editingRecipe.ingredients) {
            editingRecipe.ingredients = [];
        }


        editingRecipe.ingredients.push({

            id: databaseIngredient.id,

            amount: amount,

            unit: unit,

            name: databaseIngredient.name,

            category: category,

            shopping: shopping,

            note: note

        });


        editRecipe(recipeIndex);

        return;
    }


    // Normale toevoeging buiten de bewerkmodus
    if (!recipes[recipeIndex].ingredients) {

        recipes[recipeIndex].ingredients = [];

    }


    recipes[recipeIndex].ingredients.push({

        id: databaseIngredient.id,

        amount: amount,

        unit: unit,

        name: databaseIngredient.name,

        category: category,

        shopping: shopping,

        note: note

    });


    saveRecipes();

    viewRecipe(recipeIndex);
}
function saveEditedIngredient(
    recipeIndex,
    ingredientIndex,
    fromEdit = false
) {

    const targetRecipe =
        fromEdit
            ? editingRecipe
            : recipes[recipeIndex];


    const ingredient =
        targetRecipe.ingredients[ingredientIndex];


    const name =
        document.getElementById("edit-ingredient-name")
            .value
            .trim();

    const amount =
        Number(
            document.getElementById("edit-ingredient-amount")
                .value
        );

    const unit =
        document.getElementById("edit-ingredient-unit").value;

    const category =
        document.getElementById("edit-ingredient-category").value;

    const note =
        document.getElementById("edit-ingredient-note")
            .value
            .trim();


    if (!name) {

        alert("Geef het ingrediënt een naam.");

        return;
    }


    if (!amount || amount <= 0) {

        alert("Geef een geldige hoeveelheid in.");

        return;
    }


    ingredient.name = name;
    ingredient.amount = amount;
    ingredient.unit = unit;
    ingredient.category = category;
    ingredient.note = note;


    if (fromEdit) {

        editRecipe(recipeIndex);

    } else {

        saveRecipes();

        viewRecipe(recipeIndex);

    }
}
function deleteIngredient(recipeIndex, ingredientIndex, fromEdit = false) {

    const targetRecipe =
        fromEdit
            ? editingRecipe
            : recipes[recipeIndex];


    targetRecipe.ingredients.splice(
        ingredientIndex,
        1
    );


    if (fromEdit) {

        editRecipe(recipeIndex);

        return;
    }


    saveRecipes();

    viewRecipe(recipeIndex);
}
function newCustomIngredient(recipeIndex = null) {

    currentRecipeIndex = recipeIndex;

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="${
                    recipeIndex !== null
                        ? `addIngredient(${recipeIndex})`
                        : `showIngredients()`
                }">
                ‹
            </button>

            <h2>Nieuw ingrediënt</h2>

            <div></div>

        </div>


        <div class="form">

            <label>

                Naam

                <input
                    id="custom-name"
                    type="text"
                    placeholder="Bijvoorbeeld mascarpone">

            </label>


            <label>

                Categorie

                <select id="custom-category">

                    ${databaseCategories()}

                </select>

            </label>


            <label>

                Standaardeenheid

                <select id="custom-unit">

                    ${databaseUnits()}

                </select>   

            </label>


            <label class="checkbox-label">

                <input
                    id="custom-shopping"
                    type="checkbox"
                    checked>

                Opnemen in boodschappenlijst

            </label>


            <button
                class="primary-button"
                onclick="saveCustomIngredient()">

                Ingrediënt opslaan

            </button>

        </div>
    `;
}
function saveCustomIngredient() {

    const name =
        document.getElementById("custom-name")
            .value
            .trim();

    const category =
        document.getElementById("custom-category").value;

    const unit =
        document.getElementById("custom-unit").value;

    const shopping =
        document.getElementById("custom-shopping").checked;


    if (!name) {

        alert("Geef het ingrediënt een naam.");

        return;
    }


    const ingredients =
        getAllIngredients();


    const exists =
        ingredients.some(
            ingredient =>
                ingredient.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert("Dit ingrediënt bestaat al.");

        return;
    }


    const newIngredient = {

        id: "custom_" + Date.now(),

        name: name,

        category: category,

        unit: unit,

        shopping: shopping

    };


    ingredients.push(newIngredient);


    saveManagedIngredients(ingredients);


    // We kwamen vanuit een recept
    if (currentRecipeIndex !== null) {

        const recipeIndex =
            currentRecipeIndex;

        currentRecipeIndex = null;

        addIngredient(recipeIndex);

        // Ingrediënt automatisch invullen
        setTimeout(() => {

            const nameInput =
                document.getElementById("ingredient-name");

            if (nameInput) {

                nameInput.value =
                    newIngredient.name;

                updateIngredientDefaults();

            }

        }, 0);

        return;
    }


    // We kwamen vanuit instellingen
    showIngredients();

}
function updateIngredientDefaults() {

    const name =
        document.getElementById("ingredient-name").value.trim();

    if (!name) {
        return;
    }

    const ingredient =
        getAllIngredients().find(
            item =>
                item.name.toLowerCase() ===
                name.toLowerCase()
        );

    if (!ingredient) {
        return;
    }

    const unit =
        document.getElementById("ingredient-unit");

    const category =
        document.getElementById("ingredient-category");


    // Standaardeenheid uit de database
    if (ingredient.unit) {
        unit.value = ingredient.unit;
    }


    // Categorie uit de database
    if (ingredient.category) {
        category.value = ingredient.category;
    }

}
function addIngredientFromEdit(recipeIndex) {

    addIngredient(recipeIndex, true);

}

/* ---------- 7. INGREDIENT DATABASE ---------- */
/* ----------    ├── showIngredients() ---------- */
/* ----------    ├── renderIngredientDatabase() ---------- */
/* ----------    ├── filterIngredients()
/* ----------    ├── newDatabaseIngredient() ---------- */
/* ----------    ├── databaseIngredientForm()
/* ----------    ├── saveDatabaseIngredient()
/* ----------    ├── editDatabaseIngredient() ---------- */
/* ----------    ├── updateDatabaseIngredient() ---------- */
/* ----------    └── deleteDatabaseIngredient() ---------- */
function showIngredients() {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showSettings()">
                ‹
            </button>

            <h2>Ingrediënten</h2>

            <button
                class="new-recipe-button"
                onclick="newDatabaseIngredient()">
                ＋
            </button>

        </div>


        <div class="ingredient-search">

            <input
                id="ingredient-search"
                type="search"
                placeholder="🔍 Zoek ingrediënt..."
                oninput="filterIngredients()">


            <select
                id="ingredient-category-filter"
                onchange="filterIngredients()">

                <option value="">
                    Alle categorieën
                </option>

                ${databaseCategories("")}

            </select>

        </div>


        <div id="ingredient-database-list"></div>

    `;


    renderIngredientDatabase();
}
function renderIngredientDatabase(
    search = "",
    category = ""
) {

    const list =
        document.getElementById(
            "ingredient-database-list"
        );


    if (!list) return;


    const ingredients =
        getAllIngredients()
            .filter(ingredient =>
                ingredient.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            )
            .filter(ingredient =>
                !category ||
                ingredient.category === category
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );


    if (ingredients.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🥕
                </div>

                <h3>Geen ingrediënten</h3>

                <p>
                    Geen ingrediënten gevonden.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML = ingredients.map(
        ingredient => `

            <button
                class="database-ingredient"
                onclick="editDatabaseIngredient('${ingredient.id}')">

                <div class="database-ingredient-icon">

                    ${getCategoryIcon(
                        ingredient.category
                    )}

                </div>


                <div class="database-ingredient-info">

                    <strong>
                        ${ingredient.name}
                    </strong>

                    <small>

                        ${ingredient.category}
                        ·
                        ${ingredient.unit}

                        ${
                            ingredient.shopping === false
                                ? " · niet op boodschappenlijst"
                                : ""
                        }

                    </small>

                </div>


                <span class="arrow">
                    ›
                </span>

            </button>

        `
    ).join("");
}
function filterIngredients() {

    const search =
        document.getElementById(
            "ingredient-search"
        ).value;


    const category =
        document.getElementById(
            "ingredient-category-filter"
        ).value;


    renderIngredientDatabase(
        search,
        category
    );
}
function newDatabaseIngredient() {

    const main = document.querySelector("main");


    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showIngredients()">
                ‹
            </button>

            <h2>Nieuw ingrediënt</h2>

            <div></div>

        </div>


        ${databaseIngredientForm()}

    `;
}
function databaseIngredientForm(ingredient = null) {

    const isEdit = ingredient !== null;


    return `

        <div class="form">

            <label>

                Naam

                <input
                    id="database-name"
                    type="text"
                    value="${isEdit ? ingredient.name : ""}"
                    placeholder="Bijvoorbeeld mascarpone">

            </label>


            <label>

                Categorie

                <select id="database-category">

                    ${databaseCategories(
                        isEdit
                            ? ingredient.category
                            : "Groenten & fruit"
                    )}

                </select>

            </label>


            <label>

                Standaardeenheid

                <select id="database-unit">

                    ${databaseUnits(
                        isEdit
                            ? ingredient.unit
                            : "g"
                    )}

                </select>

            </label>


            <label class="checkbox-label">

                <input
                    id="database-shopping"
                    type="checkbox"
                    ${
                        !isEdit ||
                        ingredient.shopping !== false
                            ? "checked"
                            : ""
                    }>

                Opnemen in boodschappenlijst

            </label>


            <button
                class="primary-button"
                onclick="${
                    isEdit
                        ? `updateDatabaseIngredient('${ingredient.id}')`
                        : "saveDatabaseIngredient()"
                }">

                ${
                    isEdit
                        ? "Wijzigingen opslaan"
                        : "Ingrediënt toevoegen"
                }

            </button>


            ${
                isEdit
                    ? `

                        <button
                            class="danger-button"
                            onclick="deleteDatabaseIngredient('${ingredient.id}')">

                            🗑️ Ingrediënt verwijderen

                        </button>

                    `
                    : ""
            }

        </div>

    `;
}
function saveDatabaseIngredient() {

    const name =
        document.getElementById("database-name").value.trim();

    const category =
        document.getElementById("database-category").value;

    const unit =
        document.getElementById("database-unit").value;

    const shopping =
        document.getElementById("database-shopping").checked;


    if (!name) {
        alert("Geef het ingrediënt een naam.");
        return;
    }


    const ingredients = getAllIngredients();


    const exists = ingredients.some(
        ingredient =>
            ingredient.name.toLowerCase() ===
            name.toLowerCase()
    );


    if (exists) {
        alert("Dit ingrediënt bestaat al.");
        return;
    }


    ingredients.push({

        id: "custom_" + Date.now(),

        name: name,

        category: category,

        unit: unit,

        shopping: shopping

    });


    saveManagedIngredients(ingredients);

    showIngredients();
}
function editDatabaseIngredient(id) {

    const ingredient =
        getAllIngredients().find(
            item => item.id === id
        );


    if (!ingredient) {

        alert(
            "Ingrediënt niet gevonden."
        );

        return;
    }


    const main =
        document.querySelector("main");


    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showIngredients()">
                ‹
            </button>

            <h2>Ingrediënt bewerken</h2>

            <div></div>

        </div>


        ${databaseIngredientForm(ingredient)}

    `;
}
function updateDatabaseIngredient(id) {

    const ingredient =
        getAllIngredients().find(
            item => item.id === id
        );


    if (!ingredient) return;


    const name =
        document.getElementById(
            "database-name"
        ).value.trim();


    if (!name) {

        alert(
            "Geef het ingrediënt een naam."
        );

        return;
    }


    ingredient.name = name;

    ingredient.category =
        document.getElementById(
            "database-category"
        ).value;

    ingredient.unit =
        document.getElementById(
            "database-unit"
        ).value;

    ingredient.shopping =
        document.getElementById(
            "database-shopping"
        ).checked;


    saveManagedIngredients(getAllIngredients());

    showIngredients();
}
function deleteDatabaseIngredient(id) {

    const ingredient =
        getAllIngredients().find(
            item => item.id === id
        );


    if (!ingredient) return;


    const confirmed =
        confirm(
            `Wil je "${ingredient.name}" verwijderen?`
        );


    if (!confirmed) return;


   const ingredients =
    getAllIngredients().filter(
        item => item.id !== id
    );


saveManagedIngredients(ingredients);

showIngredients();
}

/* ---------- 8. MEAL PLANNER ---------- */
/* ----------    ├── showPlanner() ---------- */
/* ----------    ├── clearCurrentWeek() ---------- */
/* ----------    ├── addMeal() ---------- */
/* ----------    ├── saveMeal() ---------- */
/* ----------    ├── editMeal() ---------- */
/* ----------    ├── updateMeal() ---------- */
/* ----------    ├── removeMeal() ---------- */
/* ----------    ├── updatePlannerPersons() ---------- */
/* ----------    ├── changePlannerWeek() ---------- */
/* ----------    ├── goToCurrentWeek() ---------- */
/* ----------    └── renderWeekNavigation() ---------- */
function showPlanner() {

    const main = document.querySelector("main");

    const days = [
        "Maandag",
        "Dinsdag",
        "Woensdag",
        "Donderdag",
        "Vrijdag",
        "Zaterdag",
        "Zondag"
    ];


    const weekKey =
        getWeekKey(plannerWeekOffset);


    const currentWeek =
        mealPlan[weekKey] || {};


    const mealTypeLabels = {

        "Ontbijt": "🥐 Ontbijt",

        "Lunch": "🥪 Lunch",

        "Avondeten": "🍽️ Avondeten",

        "Snack": "🍎 Snack"

    };


    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="goHome()">
                ‹
            </button>

            <h2>Weekplanner</h2>

            <div></div>

        </div>


        ${renderWeekNavigation()}


        <div class="planner-actions">

            <button
                type="button"
                class="clear-week-button"
                onclick="clearCurrentWeek()">

                🗑️ Week leegmaken

            </button>

        </div>


        <div class="planner">

            ${days.map((day, dayIndex) => {

                let meals =
                    currentWeek[dayIndex];


                /*
                 * Ondersteuning voor oude weekplanningen
                 *
                 * Oude structuur:
                 * {
                 *     recipeId: 123,
                 *     persons: 4
                 * }
                 *
                 * Nieuwe structuur:
                 * [
                 *     {
                 *         recipeId: 123,
                 *         persons: 4,
                 *         mealType: "Avondeten"
                 *     }
                 * ]
                 */

                if (meals && !Array.isArray(meals)) {

                    meals = [meals];

                }
                if (meals && meals.length > 0) {

                    const mealOrder = {
                        "Ontbijt": 1,
                        "Lunch": 2,
                        "Snack": 3,
                        "Avondeten": 4
                    };

                    meals.sort((a, b) => {

                        const orderA =
                            mealOrder[a.mealType] || 99;

                        const orderB =
                            mealOrder[b.mealType] || 99;

                        return orderA - orderB;
                    });
                }
                if (!meals || meals.length === 0) {

                    return `

                        <div class="planner-day">

                            <div class="day-name">

                                ${day}

                                <small>
                                    ${formatPlannerDate(dayIndex)}
                                </small>

                            </div>


                            <button
                                class="empty-meal"
                                onclick="addMeal(${dayIndex})">

                                ＋ Maaltijd toevoegen

                            </button>

                        </div>

                    `;

                }


                const mealCards =
                    meals.map(
                        (meal, mealIndex) => {

                            const recipe =
                                recipes.find(
                                    recipe =>
                                        recipe.id ===
                                        meal.recipeId
                                );


                            if (!recipe) {
                                return "";
                            }


                            const mealType =
                                mealTypeLabels[
                                    meal.mealType
                                ] ||
                                "🍽️ Maaltijd";


                            return `

                                <div class="planned-meal">

                                    <div
                                        class="meal-info"
                                        onclick="viewRecipeById(${meal.recipeId})">

                                        <div class="meal-icon">
                                            🍽️
                                        </div>


                                        <div>

                                            <strong>
                                                ${recipe.name}
                                            </strong>


                                            <small>
                                                ${mealType}
                                            </small>


                                            <small>
                                                👥 ${meal.persons} personen
                                            </small>

                                        </div>

                                    </div>


                                    <div class="meal-actions">

                                    <button
                                        type="button"
                                        class="edit-meal"
                                        onclick="editMeal(${dayIndex}, ${mealIndex})">

                                        ✏️

                                    </button>


                                    <button
                                        type="button"
                                        class="remove-meal"
                                        onclick="removeMeal(${dayIndex}, ${mealIndex})">

                                        ×

                                    </button>

                                </div>

                                </div>

                            `;

                        }
                    ).join("");


                return `

                    <div class="planner-day">

                        <div class="day-name">

                            ${day}

                            <small>
                                ${formatPlannerDate(dayIndex)}
                            </small>

                        </div>


                        <div class="planned-meals">

                            ${mealCards}

                        </div>


                        <button
                            class="empty-meal"
                            onclick="addMeal(${dayIndex})">

                            ＋ Maaltijd toevoegen

                        </button>

                    </div>

                `;

            }).join("")}

        </div>
    `;
}
function clearCurrentWeek() {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    const confirmed =
        confirm(
            `Wil je week ${weekKey.split("-W")[1]} volledig leegmaken?\n\n` +
            "Alle geplande maaltijden van deze week worden verwijderd."
        );


    if (!confirmed) {
        return;
    }


    delete mealPlan[weekKey];


    // Ook aangekochte/verwijderde boodschappen
    // van deze week opnieuw beginnen
    delete shoppingChecked[weekKey];

    delete shoppingCleared[weekKey];


    saveMealPlan();


    localStorage.setItem(
        "shoppingChecked",
        JSON.stringify(shoppingChecked)
    );


    localStorage.setItem(
        "shoppingCleared",
        JSON.stringify(shoppingCleared)
    );


    showPlanner();
}
function addMeal(dayIndex) {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showPlanner()">
                ‹
            </button>

            <h2>Maaltijd kiezen</h2>

            <div></div>

        </div>


        <div class="form">

            <label>

                Maaltijd

                <select id="planner-meal-type">

                    <option value="Ontbijt">
                        🥐 Ontbijt
                    </option>

                    <option value="Lunch">
                        🥪 Lunch
                    </option>

                    <option value="Avondeten" selected>
                        🍽️ Avondeten
                    </option>

                    <option value="Snack">
                        🍎 Snack
                    </option>

                </select>

            </label>


            <label>

                Recept

                <select
                id="planner-recipe"
                onchange="updatePlannerPersons()">

                    <option value="">
                        Kies een recept
                    </option>

                    ${
                        recipes
                            .slice()
                            .sort((a, b) =>
                                a.name.localeCompare(b.name)
                            )
                            .map(recipe => `

                                <option value="${recipe.id}">
                                    ${recipe.name}
                                </option>

                            `)
                            .join("")
                    }

                </select>

            </label>


            <label>

                Aantal personen

                <input
                    id="planner-persons"
                    type="number"
                    value="4"
                    min="1">

            </label>


            <button
                class="primary-button"
                onclick="saveMeal(${dayIndex})">

                Maaltijd toevoegen

            </button>

        </div>
    `;
}
function saveMeal(dayIndex) {

    const recipeId =
        Number(
            document.getElementById("planner-recipe").value
        );

    const persons =
        Number(
            document.getElementById("planner-persons").value
        );

    const mealType =
        document.getElementById("planner-meal-type").value;


    if (!recipeId) {

        alert("Kies eerst een recept.");

        return;
    }


    if (!persons || persons < 1) {

        alert("Geef een geldig aantal personen.");

        return;
    }


    const weekKey =
        getWeekKey(plannerWeekOffset);


    if (!mealPlan[weekKey]) {

        mealPlan[weekKey] = {};

    }


    if (!Array.isArray(mealPlan[weekKey][dayIndex])) {

        mealPlan[weekKey][dayIndex] = [];

    }


    mealPlan[weekKey][dayIndex].push({

        recipeId: recipeId,

        persons: persons,

        mealType: mealType

    });


    saveMealPlan();

    showPlanner();

}
function editMeal(dayIndex, mealIndex) {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    let meals =
        mealPlan[weekKey]?.[dayIndex];


    if (!Array.isArray(meals)) {

        meals = meals
            ? [meals]
            : [];

    }


    const meal =
        meals[mealIndex];


    if (!meal) {

        return;

    }


    const main =
        document.querySelector("main");


    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showPlanner()">
                ‹
            </button>

            <h2>Maaltijd bewerken</h2>

            <div></div>

        </div>


        <div class="form">

            <label>

                Maaltijd

                <select id="planner-meal-type">

                    <option value="Ontbijt">
                        🥐 Ontbijt
                    </option>

                    <option value="Lunch">
                        🥪 Lunch
                    </option>

                    <option value="Avondeten">
                        🍽️ Avondeten
                    </option>

                    <option value="Snack">
                        🍎 Snack
                    </option>

                </select>

            </label>


            <label>

                Recept

                <select
                    id="planner-recipe"
                    onchange="updatePlannerPersons()">

                    <option value="">
                        Kies een recept
                    </option>

                    ${
                        recipes
                            .slice()
                            .sort((a, b) =>
                                a.name.localeCompare(b.name)
                            )
                            .map(recipe => `

                                <option
                                    value="${recipe.id}">

                                    ${recipe.name}

                                </option>

                            `)
                            .join("")
                    }

                </select>

            </label>


            <label>

                Aantal personen

                <input
                    id="planner-persons"
                    type="number"
                    value="${meal.persons}"
                    min="1">

            </label>


            <button
                class="primary-button"
                onclick="updateMeal(${dayIndex}, ${mealIndex})">

                Wijzigingen opslaan

            </button>

        </div>

    `;


    document.getElementById(
        "planner-meal-type"
    ).value = meal.mealType || "Avondeten";


    document.getElementById(
        "planner-recipe"
    ).value = meal.recipeId;

}
function updateMeal(dayIndex, mealIndex) {

    const recipeId =
        Number(
            document.getElementById(
                "planner-recipe"
            ).value
        );


    const persons =
        Number(
            document.getElementById(
                "planner-persons"
            ).value
        );


    const mealType =
        document.getElementById(
            "planner-meal-type"
        ).value;


    if (!recipeId) {

        alert("Kies eerst een recept.");

        return;

    }


    if (!persons || persons < 1) {

        alert("Geef een geldig aantal personen.");

        return;

    }


    const weekKey =
        getWeekKey(plannerWeekOffset);


    if (
        !mealPlan[weekKey] ||
        !Array.isArray(
            mealPlan[weekKey][dayIndex]
        )
    ) {

        return;

    }


    const meal =
        mealPlan[weekKey][dayIndex][mealIndex];


    if (!meal) {

        return;

    }


    meal.recipeId =
        recipeId;


    meal.persons =
        persons;


    meal.mealType =
        mealType;


    saveMealPlan();

    showPlanner();

}
function removeMeal(dayIndex, mealIndex) {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    const meals =
        mealPlan[weekKey]?.[dayIndex];


    if (
        !Array.isArray(meals) ||
        !meals[mealIndex]
    ) {

        return;

    }


    const meal =
        meals[mealIndex];


    const recipe =
        recipes.find(
            recipe =>
                recipe.id === meal.recipeId
        );


    const recipeName =
        recipe
            ? recipe.name
            : "deze maaltijd";


    const confirmed =
        confirm(
            `Wil je "${recipeName}" verwijderen uit de weekplanner?`
        );


    if (!confirmed) {

        return;

    }


    meals.splice(
        mealIndex,
        1
    );


    if (meals.length === 0) {

        delete mealPlan[weekKey][dayIndex];

    }


    saveMealPlan();

    showPlanner();

}
function updatePlannerPersons() {

    const recipeId =
        Number(
            document.getElementById("planner-recipe").value
        );

    const personsInput =
        document.getElementById("planner-persons");


    if (!recipeId || !personsInput) {
        return;
    }


    const recipe =
        recipes.find(
            recipe => recipe.id === recipeId
        );


    if (!recipe) {
        return;
    }


    personsInput.value =
        recipe.persons || 4;
}
function changePlannerWeek(change) {

    plannerWeekOffset += change;

    if (
        document.querySelector(".shopping-list")
    ) {

        showShoppingList();

    } else {

        showPlanner();

    }

}
function goToCurrentWeek() {

    plannerWeekOffset = 0;

    if (document.querySelector(".shopping-list")) {

        showShoppingList();

    } else {

        showPlanner();

    }
}
function renderWeekNavigation() {

    return `
        <div class="week-navigation">

            <button
                class="week-nav-button"
                onclick="changePlannerWeek(-1)">
                ‹
            </button>


            <div class="week-navigation-title">

                <strong>
                    Week ${getWeekKey(plannerWeekOffset).split("-W")[1]}
                </strong>

                <small>
                    ${getWeekDateRange(plannerWeekOffset)}
                </small>


                ${
                    plannerWeekOffset !== 0
                    ? `
                        <button
                            class="current-week-button"
                            onclick="goToCurrentWeek()">
                            Deze week
                        </button>
                    `
                    : ""
                }

            </div>


            <button
                class="week-nav-button"
                onclick="changePlannerWeek(1)">
                ›
            </button>

        </div>
    `;
}

/* ---------- 9. SHOPPING LIST ---------- */
/* ----------    ├── showShoppingList() ---------- */
/* ----------    ├── toggleShoppingItem() ---------- */
/* ----------    ├── checkAllShoppingItems() ---------- */
/* ----------    ├── uncheckAllShoppingItems() ---------- */
/* ----------    └── clearBoughtShoppingItems() ---------- */
function showShoppingList() {

    const main = document.querySelector("main");

    const shoppingItems = {};


    const weekKey =
        getWeekKey(plannerWeekOffset);

    const weekCleared =
        shoppingCleared[weekKey] || {};

    const currentWeek =
        mealPlan[weekKey] || {};


    /*
     * Doorloop alle dagen van de week
     */
    Object.values(currentWeek).forEach(dayMeals => {

        /*
         * Ondersteuning voor oude planning
         * met één maaltijd per dag
         */
        const meals =
            Array.isArray(dayMeals)
                ? dayMeals
                : [dayMeals];


        meals.forEach(meal => {

            const recipe =
                recipes.find(
                    recipe =>
                        recipe.id === meal.recipeId
                );


            if (!recipe) return;


            const factor =
                meal.persons / recipe.persons;


            (recipe.ingredients || []).forEach(ingredient => {

                /*
                 * Ingrediënten die niet op de
                 * boodschappenlijst moeten komen overslaan
                 */
                if (ingredient.shopping === false) {
                    return;
                }


                const amount =
                    ingredient.amount * factor;


                const category =
                    ingredient.category || "Overig";


                const key =
                    category
                    + "|"
                    + ingredient.name
                        .toLowerCase()
                        .trim()
                    + "|"
                    + ingredient.unit;


                if (!shoppingItems[key]) {

                    shoppingItems[key] = {

                        name: ingredient.name,

                        unit: ingredient.unit,

                        amount: 0,

                        category: category

                    };

                }


                shoppingItems[key].amount += amount;

            });

        });

    });


    const items =
        Object.entries(shoppingItems)
            .filter(([itemKey]) =>
                !weekCleared[itemKey]
            )
            .map(([itemKey, item]) => ({
                ...item,
                itemKey: itemKey
            }));        


    const categories = {};


    items.forEach(item => {

        if (!categories[item.category]) {

            categories[item.category] = [];

        }


        categories[item.category].push(item);

    });


    const categoryOrder = [

        "Groenten & fruit",

        "Vlees & vis",

        "Zuivel & eieren",

        "Brood & bakkerij",

        "Droge voeding",

        "Conserven & sauzen",

        "Kruiden & specerijen",

        "Diepvries",

        "Dranken",

        "Overig"

    ];


    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="goHome()">
                ‹
            </button>

            <h2>Boodschappen</h2>

            <div></div>

        </div>


        ${renderWeekNavigation()}


        <div class="shopping-actions">

            <button
                type="button"
                class="shopping-check-all-button"
                onclick="checkAllShoppingItems()">

                ☑️ Alles afvinken

            </button>


            <button
                type="button"
                class="shopping-uncheck-all-button"
                onclick="uncheckAllShoppingItems()">

                ☐ Alles uitvinken

            </button>


            <button
                type="button"
                class="clear-bought-button"
                onclick="clearBoughtShoppingItems()">

                🗑️ Aangekochte items wissen

            </button>

        </div>


        <div class="shopping-list">

            ${
                items.length === 0

                ? `

                    <div class="empty-state">

                        <div class="empty-icon">
                            🛒
                        </div>

                        <h3>Nog geen boodschappen</h3>

                        <p>
                            Plan eerst enkele maaltijden.
                        </p>

                    </div>

                `

                : categoryOrder
                    .filter(
                        category =>
                            categories[category]
                    )
                    .map(category => `

                        <div class="shopping-category">

                            <h3>
                                ${getCategoryIcon(category)}
                                ${category}
                            </h3>


                            ${
                                categories[category]
                                    .map(item => {

                                        const itemKey =
                                            item.itemKey;

                                        const checked =
                                            shoppingChecked[weekKey]?.[itemKey] === true;


                                        return `

                                            <label
                                                class="shopping-item ${checked ? "checked" : ""}">

                                                <input
                                                    type="checkbox"
                                                    ${checked ? "checked" : ""}
                                                    onchange="toggleShoppingItem('${itemKey}')">

                                                <span
                                                    class="shopping-name">

                                                    <strong>
                                                        ${formatAmount(
                                                            item.amount,
                                                            item.unit,
                                                            item.name
                                                        )}
                                                        ${item.unit}
                                                    </strong>

                                                    ${item.name}

                                                </span>

                                            </label>

                                        `;

                                    })
                                    .join("")
                            }

                        </div>

                    `)
                    .join("")
            }

        </div>

    `;
}
function toggleShoppingItem(itemKey) {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    if (!shoppingChecked[weekKey]) {

        shoppingChecked[weekKey] = {};

    }


    shoppingChecked[weekKey][itemKey] =
        !shoppingChecked[weekKey][itemKey];


    localStorage.setItem(
        "shoppingChecked",
        JSON.stringify(shoppingChecked)
    );


    showShoppingList();
}
function checkAllShoppingItems() {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    const currentWeek =
        mealPlan[weekKey] || {};


    if (!shoppingChecked[weekKey]) {

        shoppingChecked[weekKey] = {};

    }


    Object.values(currentWeek).forEach(dayMeals => {

        const meals =
            Array.isArray(dayMeals)
                ? dayMeals
                : [dayMeals];


        meals.forEach(meal => {

            const recipe =
                recipes.find(
                    recipe =>
                        recipe.id === meal.recipeId
                );


            if (!recipe) return;


            (recipe.ingredients || []).forEach(ingredient => {

                if (ingredient.shopping === false) {
                    return;
                }


                const key =
                    (ingredient.category || "Overig")
                    + "|"
                    + ingredient.name
                        .toLowerCase()
                        .trim()
                    + "|"
                    + ingredient.unit;


                shoppingChecked[weekKey][key] = true;

            });

        });

    });


    localStorage.setItem(
        "shoppingChecked",
        JSON.stringify(shoppingChecked)
    );


    showShoppingList();
}
function uncheckAllShoppingItems() {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    shoppingChecked[weekKey] = {};


    localStorage.setItem(
        "shoppingChecked",
        JSON.stringify(shoppingChecked)
    );


    showShoppingList();
}
function clearBoughtShoppingItems() {

    const weekKey =
        getWeekKey(plannerWeekOffset);


    const confirmed =
        confirm(
            "Wil je alle aangekochte items uit deze boodschappenlijst wissen?"
        );


    if (!confirmed) {
        return;
    }


    if (!shoppingCleared[weekKey]) {

        shoppingCleared[weekKey] = {};

    }


    const currentChecked =
        shoppingChecked[weekKey] || {};


    Object.entries(currentChecked).forEach(
        ([itemKey, checked]) => {

            if (checked === true) {

                shoppingCleared[weekKey][itemKey] = true;

                delete currentChecked[itemKey];

            }

        }
    );


    localStorage.setItem(
        "shoppingChecked",
        JSON.stringify(shoppingChecked)
    );


    localStorage.setItem(
        "shoppingCleared",
        JSON.stringify(shoppingCleared)
    );


    showShoppingList();

}

/* ---------- 10. RECIPE INSTRUCTIONS ---------- */
/* ----------    ├── addInstructionStep() ---------- */
/* ----------    ├── renumberInstructions() ---------- */
function addInstructionStep(text = "") {

    const list =
        document.getElementById("instruction-list");

    const step =
        document.createElement("div");

    step.className = "instruction-step";

    step.innerHTML = `

        <span class="instruction-number">
            ${list.children.length + 1}.
        </span>

        <textarea
            class="instruction-input"
            placeholder="Beschrijf deze stap...">${text}</textarea>

        <button
            type="button"
            class="delete-instruction"
            onclick="this.parentElement.remove(); renumberInstructions();">
            ×
        </button>

    `;

    list.appendChild(step);
}
function renumberInstructions() {

    const steps =
        document.querySelectorAll(".instruction-step");

    steps.forEach((step, index) => {

        step.querySelector(".instruction-number")
            .textContent = `${index + 1}.`;

    });
}

/* ---------- 11. FILTERS ---------- */
/* ----------    ├── toggleFavoriteFilter() ---------- */
/* ----------    └── clearRecipeFilters() ---------- */
function toggleFavoriteFilter() {

    const button =
        document.getElementById("favorite-filter");


    button.classList.toggle("active");


    filterRecipes();
}
function clearRecipeFilters() {

    document.getElementById("recipe-search-input").value = "";

    document.getElementById("recipe-type-filter").value = "";

    document.getElementById("recipe-cuisine-filter").value = "";

    document.getElementById("recipe-tag-filter").value = "";


    const favoriteButton =
        document.getElementById("favorite-filter");

    favoriteButton.classList.remove("active");


    filterRecipes();
}

/* ---------- 12. BACKUP ---------- */
/* ----------    ├── showBackup() ---------- */
/* ----------    ├── exportBackup() ---------- */
/* ----------    └── importBackup() ---------- */

function showBackup() {

    const main = document.querySelector("main");

    main.innerHTML = `

        <div class="page-header">

            <button
                class="back-button"
                onclick="showSettings()">
                ‹
            </button>

            <h2>Backup</h2>

            <div></div>

        </div>


        <div class="form">

            <button
                type="button"
                class="primary-button"
                onclick="exportBackup()">

                📤 Backup exporteren

            </button>


            <button
                type="button"
                class="secondary-button"
                onclick="document.getElementById('backup-file').click()">

                📥 Backup importeren

            </button>


            <input
                id="backup-file"
                type="file"
                accept=".json,application/json"
                style="display: none;"
                onchange="importBackup(event)">


            <p class="backup-info">

                Een backup bevat je recepten, ingrediënten,
                weekplanning en boodschappenlijstgegevens.

            </p>

        </div>

    `;
}
function exportBackup() {

    const backup = {

        version: 1,

        exportedAt: new Date().toISOString(),

        recipes: recipes,

        mealPlan: mealPlan,

        managedIngredients: managedIngredients,

        shoppingChecked: shoppingChecked,

        shoppingCleared: shoppingCleared

    };


    const json =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    link.download =
        `recepten-backup-${date}.json`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}
function importBackup(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function () {

        try {

            const backup =
                JSON.parse(reader.result);


            if (
                !backup ||
                backup.version !== 1 ||
                !Array.isArray(backup.recipes) ||
                !backup.mealPlan
            ) {

                alert(
                    "Dit bestand is geen geldige recepten-backup."
                );

                return;
            }


            const confirmed =
                confirm(
                    "Weet je zeker dat je deze backup wilt terugzetten?\n\n" +
                    "De huidige gegevens worden vervangen."
                );


            if (!confirmed) {
                return;
            }


            recipes =
                backup.recipes;


            mealPlan =
                backup.mealPlan;


            managedIngredients =
                backup.managedIngredients || [];


            shoppingChecked =
                backup.shoppingChecked || {};


            shoppingCleared =
                backup.shoppingCleared || {};


            saveRecipes();

            saveMealPlan();

            saveManagedIngredients(
                managedIngredients
            );


            localStorage.setItem(
                "shoppingChecked",
                JSON.stringify(
                    shoppingChecked
                )
            );


            localStorage.setItem(
                "shoppingCleared",
                JSON.stringify(
                    shoppingCleared
                )
            );


            alert(
                "Backup succesvol teruggezet."
            );


            location.reload();

        } catch (error) {

            console.error(
                "Backup import fout:",
                error
            );


            alert(
                "Het backupbestand kon niet worden gelezen."
            );

        }

    };


    reader.readAsText(file);

}
/* ---------- 13. ONEDRIVE ---------- */