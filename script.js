const SUPABASE_URL = "https://njoqxgtlqegmigxqnusn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_NMFQt5vy0ADEeic6ooW76Q_B_eYqeBu";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const search = document.getElementById("search");

const linksContainer =
    document.getElementById("links");

const countriesContainer =
    document.getElementById("countries");

const categoriesContainer =
    document.getElementById("categories");

const linkCount =
    document.getElementById("link-count");


let allLinks = [];
let countries = [];
let categories = [];

let selectedCountry = "all";
let selectedCategory = "all";


async function loadData() {

    const [
        linksResult,
        countriesResult,
        categoriesResult
    ] = await Promise.all([

        supabaseClient
            .from("links")
            .select("*")
            .order("id", { ascending: true }),

        supabaseClient
            .from("countries")
            .select("*")
            .order("id", { ascending: true }),

        supabaseClient
            .from("categories")
            .select("*")
            .order("id", { ascending: true })

    ]);


    if (linksResult.error) {
        console.error(
            "Links Error:",
            linksResult.error
        );
        return;
    }


    if (countriesResult.error) {
        console.error(
            "Countries Error:",
            countriesResult.error
        );
        return;
    }


    if (categoriesResult.error) {
        console.error(
            "Categories Error:",
            categoriesResult.error
        );
        return;
    }


    allLinks = linksResult.data || [];

    countries = countriesResult.data || [];

    categories = categoriesResult.data || [];


    console.log(
        "Links found:",
        allLinks.length
    );

    console.log(
        "Countries found:",
        countries.length
    );

    console.log(
        "Categories found:",
        categories.length
    );


    displayCountries();

    displayCategories();

    applyFilters();
}


function displayCountries() {

    countriesContainer.innerHTML = "";


    const allButton =
        document.createElement("button");

    allButton.dataset.country = "all";

    allButton.textContent = "🌍 All";


    if (selectedCountry === "all") {
        allButton.classList.add("active");
    }


    countriesContainer.appendChild(
        allButton
    );


    countries.forEach(function (country) {

        const button =
            document.createElement("button");


        button.dataset.country =
            country.id;


        button.textContent =
            country.name;


        if (
            String(selectedCountry) ===
            String(country.id)
        ) {
            button.classList.add("active");
        }


        countriesContainer.appendChild(
            button
        );

    });
}


function displayCategories() {

    categoriesContainer.innerHTML = "";


    const allButton =
        document.createElement("button");

    allButton.dataset.category = "all";

    allButton.textContent = "📚 All";


    if (selectedCategory === "all") {
        allButton.classList.add("active");
    }


    categoriesContainer.appendChild(
        allButton
    );


    categories.forEach(function (category) {

        const button =
            document.createElement("button");


        button.dataset.category =
            category.id;


        button.textContent =
            category.name;


        if (
            String(selectedCategory) ===
            String(category.id)
        ) {
            button.classList.add("active");
        }


        categoriesContainer.appendChild(
            button
        );

    });
}


countriesContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) return;


        selectedCountry =
            button.dataset.country;


        displayCountries();

        applyFilters();

    }
);


categoriesContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) return;


        selectedCategory =
            button.dataset.category;


        displayCategories();

        applyFilters();

    }
);


search.addEventListener(
    "input",
    function () {

        applyFilters();

    }
);


function applyFilters() {

    const text =
        search.value
            .toLowerCase()
            .trim();


    const filteredLinks =
        allLinks.filter(function (link) {


            const countryMatch =
                selectedCountry === "all" ||
                String(link.country_id) ===
                String(selectedCountry);


            const categoryMatch =
                selectedCategory === "all" ||
                String(link.category_id) ===
                String(selectedCategory);


            const searchMatch =
                !text ||
                link.title
                    .toLowerCase()
                    .includes(text) ||
                link.url
                    .toLowerCase()
                    .includes(text);


            return (
                countryMatch &&
                categoryMatch &&
                searchMatch
            );

        });


    displayLinks(filteredLinks);
}


function displayLinks(links) {

    linksContainer.innerHTML = "";


    linkCount.textContent =
        `${links.length} LINK${links.length === 1 ? "" : "S"}`;


    if (links.length === 0) {

        const emptyCard =
            document.createElement("div");


        emptyCard.className = "card";


        const title =
            document.createElement("h3");

        title.textContent =
            "No links found";


        const message =
            document.createElement("p");

        message.textContent =
            "Try another country, category or search.";


        emptyCard.appendChild(title);

        emptyCard.appendChild(message);


        linksContainer.appendChild(
            emptyCard
        );


        return;
    }


    links.forEach(function (link) {

        const card =
            document.createElement("article");


        card.className = "card";


        const top =
            document.createElement("div");


        const title =
            document.createElement("h3");

        title.textContent =
            link.title;


        const badges =
            document.createElement("div");

        badges.className = "badges";


        const country =
            countries.find(function (item) {

                return String(item.id) ===
                    String(link.country_id);

            });


        const category =
            categories.find(function (item) {

                return String(item.id) ===
                    String(link.category_id);

            });


        if (country) {

            const badge =
                document.createElement("span");

            badge.className = "badge";

            badge.textContent =
                "🌐 " + country.name;

            badges.appendChild(badge);
        }


        if (category) {

            const badge =
                document.createElement("span");

            badge.className = "badge";

            badge.textContent =
                "📚 " + category.name;

            badges.appendChild(badge);
        }


        const url =
            document.createElement("p");

        url.textContent =
            link.url;


        top.appendChild(title);

        top.appendChild(badges);

        top.appendChild(url);


        const visit =
            document.createElement("a");

        visit.href =
            link.url;

        visit.target =
            "_blank";

        visit.rel =
            "noopener noreferrer";

        visit.textContent =
            "VISIT WEBSITE →";


        card.appendChild(top);

        card.appendChild(visit);


        linksContainer.appendChild(card);

    });
}


supabaseClient
    .channel("links-realtime")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "links"
        },
        function () {

            loadData();

        }
    )
    .subscribe();


loadData();