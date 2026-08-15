

/* ----------  1. INGREDIENT DATABASE ---------- */
/* ----------    ├── ingredientDatabase ---------- */
const ingredientDatabase = [
    // GROENTEN & FRUIT
    { id: "aardappel", name: "Aardappel", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "ui", name: "Ui", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "rode_ui", name: "Rode ui", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "bosui", name: "Bosui", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "knoflook", name: "Knoflook", category: "Groenten & fruit", unit: "teentjes", shopping: true },
    { id: "prei", name: "Prei", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "wortel", name: "Wortel", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "paprika", name: "Paprika", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "rode_paprika", name: "Rode paprika", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "courgette", name: "Courgette", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "aubergine", name: "Aubergine", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "champignons", name: "Champignons", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "broccoli", name: "Broccoli", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "bloemkool", name: "Bloemkool", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "spinazie", name: "Spinazie", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "boontjes", name: "Sperziebonen", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "erwten", name: "Erwten", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "mais", name: "Maïs", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "tomaat", name: "Tomaat", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "kerstomaten", name: "Kerstomaten", category: "Groenten & fruit", unit: "g", shopping: true },
    { id: "komkommer", name: "Komkommer", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "sla", name: "Sla", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "avocado", name: "Avocado", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "citroen", name: "Citroen", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "limoen", name: "Limoen", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "appel", name: "Appel", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "banaan", name: "Banaan", category: "Groenten & fruit", unit: "stuks", shopping: true },
    { id: "perzik", name: "Perzik", category: "Groenten & fruit", unit: "stuks", shopping: true },

    // VLEES & VIS
    { id: "rundergehakt", name: "Rundergehakt", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "varkensgehakt", name: "Varkensgehakt", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "kipfilet", name: "Kipfilet", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "kippenbout", name: "Kippenbout", category: "Vlees & vis", unit: "stuks", shopping: true },
    { id: "kippengehakt", name: "Kippengehakt", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "spek", name: "Spek", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "spekblokjes", name: "Spekblokjes", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "ham", name: "Ham", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "salami", name: "Salami", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "worst", name: "Worst", category: "Vlees & vis", unit: "stuks", shopping: true },
    { id: "biefstuk", name: "Biefstuk", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "varkenshaasje", name: "Varkenshaasje", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "zalm", name: "Zalm", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "tonijn", name: "Tonijn", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "kabeljauw", name: "Kabeljauw", category: "Vlees & vis", unit: "g", shopping: true },
    { id: "garnalen", name: "Garnalen", category: "Vlees & vis", unit: "g", shopping: true },

    // ZUIVEL & EIEREN
    { id: "melk", name: "Melk", category: "Zuivel & eieren", unit: "ml", shopping: true },
    { id: "room", name: "Room", category: "Zuivel & eieren", unit: "ml", shopping: true },
    { id: "zure_room", name: "Zure room", category: "Zuivel & eieren", unit: "ml", shopping: true },
    { id: "creme_fraiche", name: "Crème fraîche", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "boter", name: "Boter", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "eieren", name: "Eieren", category: "Zuivel & eieren", unit: "stuks", shopping: true },
    { id: "parmezaan", name: "Parmezaan", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "mozzarella", name: "Mozzarella", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "cheddar", name: "Cheddar", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "geraspte_kaas", name: "Geraspte kaas", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "geitenkaas", name: "Geitenkaas", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "feta", name: "Feta", category: "Zuivel & eieren", unit: "g", shopping: true },
    { id: "yoghurt", name: "Yoghurt", category: "Zuivel & eieren", unit: "g", shopping: true },

    // DROGE VOEDING
    { id: "spaghetti", name: "Spaghetti", category: "Droge voeding", unit: "g", shopping: true },
    { id: "penne", name: "Penne", category: "Droge voeding", unit: "g", shopping: true },
    { id: "pasta", name: "Pasta", category: "Droge voeding", unit: "g", shopping: true },
    { id: "lasagnebladen", name: "Lasagnebladen", category: "Droge voeding", unit: "g", shopping: true },
    { id: "rijst", name: "Rijst", category: "Droge voeding", unit: "g", shopping: true },
    { id: "basmatirijst", name: "Basmatirijst", category: "Droge voeding", unit: "g", shopping: true },
    { id: "couscous", name: "Couscous", category: "Droge voeding", unit: "g", shopping: true },
    { id: "noedels", name: "Noedels", category: "Droge voeding", unit: "g", shopping: true },
    { id: "bloem", name: "Bloem", category: "Droge voeding", unit: "g", shopping: true },
    { id: "zelfrijzende_bloem", name: "Zelfrijzende bloem", category: "Droge voeding", unit: "g", shopping: true },
    { id: "paneermeel", name: "Paneermeel", category: "Droge voeding", unit: "g", shopping: true },
    { id: "havermout", name: "Havermout", category: "Droge voeding", unit: "g", shopping: true },
    { id: "suiker", name: "Suiker", category: "Droge voeding", unit: "g", shopping: true },
    { id: "bruine_suiker", name: "Bruine suiker", category: "Droge voeding", unit: "g", shopping: true },
    { id: "rijstmeel", name: "Rijstmeel", category: "Droge voeding", unit: "g", shopping: true },

    // CONSERVEN & SAUZEN
    { id: "tomatenblokjes", name: "Tomatenblokjes", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "tomatenpuree", name: "Tomatenpuree", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "passata", name: "Passata", category: "Conserven & sauzen", unit: "ml", shopping: true },
    { id: "kokosmelk", name: "Kokosmelk", category: "Conserven & sauzen", unit: "ml", shopping: true },
    { id: "kikkererwten", name: "Kikkererwten", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "kidneybonen", name: "Kidneybonen", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "witte_bonen", name: "Witte bonen", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "pesto", name: "Pesto", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "mayonaise", name: "Mayonaise", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "ketchup", name: "Ketchup", category: "Conserven & sauzen", unit: "g", shopping: true },
    { id: "mosterd", name: "Mosterd", category: "Conserven & sauzen", unit: "el", shopping: true },
    { id: "sojasaus", name: "Sojasaus", category: "Conserven & sauzen", unit: "ml", shopping: true },

    // KRUIDEN & SPECERIJEN
    { id: "zout", name: "Zout", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "peper", name: "Zwarte peper", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "paprikapoeder", name: "Paprikapoeder", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "currypoeder", name: "Currypoeder", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "kerrie", name: "Kerriepoeder", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "komijn", name: "Komijn", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "kaneel", name: "Kaneel", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "oregano", name: "Oregano", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "basilicum", name: "Basilicum", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "tijm", name: "Tijm", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "rozemarijn", name: "Rozemarijn", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "chilipoeder", name: "Chilipoeder", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "nootmuskaat", name: "Nootmuskaat", category: "Kruiden & specerijen", unit: "tl", shopping: false },
    { id: "laurier", name: "Laurier", category: "Kruiden & specerijen", unit: "stuks", shopping: false },

    // BROOD & BAKKERIJ
    { id: "stokbrood", name: "Stokbrood", category: "Brood & bakkerij", unit: "stuks", shopping: true },
    { id: "brood", name: "Brood", category: "Brood & bakkerij", unit: "stuks", shopping: true },
    { id: "wraps", name: "Wraps", category: "Brood & bakkerij", unit: "stuks", shopping: true },
    { id: "pizzadeeg", name: "Pizzadeeg", category: "Brood & bakkerij", unit: "stuks", shopping: true },
    { id: "bladerdeeg", name: "Bladerdeeg", category: "Brood & bakkerij", unit: "stuks", shopping: true },

    // DIEPVRIES
    { id: "diepvries_spinazie", name: "Diepvries spinazie", category: "Diepvries", unit: "g", shopping: true },
    { id: "diepvries_erwten", name: "Diepvries erwten", category: "Diepvries", unit: "g", shopping: true },
    { id: "diepvries_friet", name: "Diepvries frieten", category: "Diepvries", unit: "g", shopping: true },
    { id: "diepvries_groenten", name: "Diepvries groenten", category: "Diepvries", unit: "g", shopping: true },

    // DRANKEN
    { id: "water", name: "Water", category: "Dranken", unit: "ml", shopping: false },
    { id: "witte_wijn", name: "Witte wijn", category: "Dranken", unit: "ml", shopping: true },
    { id: "rode_wijn", name: "Rode wijn", category: "Dranken", unit: "ml", shopping: true },

    // OVERIG
    { id: "olijfolie", name: "Olijfolie", category: "Overig", unit: "ml", shopping: false },
    { id: "zonnebloemolie", name: "Zonnebloemolie", category: "Overig", unit: "ml", shopping: false },
    { id: "sesamolie", name: "Sesamolie", category: "Overig", unit: "ml", shopping: true },
    { id: "azijn", name: "Azijn", category: "Overig", unit: "ml", shopping: false },
    { id: "balsamico", name: "Balsamicoazijn", category: "Overig", unit: "ml", shopping: true },
    { id: "honing", name: "Honing", category: "Overig", unit: "g", shopping: true },
    { id: "bouillonblokje", name: "Bouillonblokje", category: "Overig", unit: "stuks", shopping: false },
    { id: "noten", name: "Noten", category: "Overig", unit: "g", shopping: true },
    { id: "amandelen", name: "Amandelen", category: "Overig", unit: "g", shopping: true },
    { id: "walnoten", name: "Walnoten", category: "Overig", unit: "g", shopping: true },
    { id: "pijnboompitten", name: "Pijnboompitten", category: "Overig", unit: "g", shopping: true },
    { id: "rozijnen", name: "Rozijnen", category: "Overig", unit: "g", shopping: true },
    { id: "chocolade", name: "Chocolade", category: "Overig", unit: "g", shopping: true },
    { id: "cacaopoeder", name: "Cacaopoeder", category: "Overig", unit: "g", shopping: true },
    { id: "bakpoeder", name: "Bakpoeder", category: "Overig", unit: "tl", shopping: true },
    { id: "vanille", name: "Vanille", category: "Overig", unit: "tl", shopping: true }
];

/* ----------  2. DATA / STORAGE ---------- */
/* ----------    ├── managedIngredients ---------- */
/* ----------    ├── initializeIngredientDatabase() ---------- */
/* ----------    ├── saveManagedIngredients() ---------- */
/* ----------    ├── getAllIngredients() ---------- */
let managedIngredients =
    JSON.parse(localStorage.getItem("managedIngredients"));
function initializeIngredientDatabase() {

    if (managedIngredients) {
        return;
    }

    const oldCustomIngredients =
        JSON.parse(
            localStorage.getItem("customIngredients")
        ) || [];


    managedIngredients = [

        ...ingredientDatabase,

        ...oldCustomIngredients

    ];


    localStorage.setItem(
        "managedIngredients",
        JSON.stringify(managedIngredients)
    );
}
function saveManagedIngredients(ingredients) {

    managedIngredients = ingredients;

    localStorage.setItem(
        "managedIngredients",
        JSON.stringify(managedIngredients)
    );

}
function getAllIngredients() {

    initializeIngredientDatabase();

    return managedIngredients;

}

/* ----------  3. INITIALIZATION ---------- */
/* ----------    ├── initializeIngredientDatabase() ---------- */
initializeIngredientDatabase();














