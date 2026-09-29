const SUPABASE_URL =
    "https://njoqxgtlqegmigxqnusn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_NMFQt5vy0ADEeic6ooW76Q_B_eYqeBu";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// ELEMENTS
// ===============================

const loginScreen =
    document.getElementById("login-screen");

const adminScreen =
    document.getElementById("admin-screen");

const googleLogin =
    document.getElementById("google-login");

const logoutButton =
    document.getElementById("logout");

const loginError =
    document.getElementById("login-error");

const adminEmail =
    document.getElementById("admin-email");


// ===============================
// GOOGLE LOGIN
// ===============================

googleLogin.addEventListener("click", async () => {

    loginError.textContent = "";

    const { error } =
        await supabaseClient.auth.signInWithOAuth({
            provider: "google",

            options: {
                redirectTo:
                    window.location.origin +
                    window.location.pathname
            }
        });

    if (error) {
        loginError.textContent =
            error.message;
    }
});


// ===============================
// AUTH STATE
// ===============================

async function checkUser() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (session) {
        showAdmin(session);
    } else {
        showLogin();
    }
}


supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        if (session) {
            showAdmin(session);
        } else {
            showLogin();
        }

    }
);


function showLogin() {

    loginScreen.classList.remove("hidden");

    adminScreen.classList.add("hidden");

}


function showAdmin(session) {

    loginScreen.classList.add("hidden");

    adminScreen.classList.remove("hidden");

    adminEmail.textContent =
        session.user.email;

    loadEverything();
}


// ===============================
// LOGOUT
// ===============================

logoutButton.addEventListener(
    "click",
    async () => {

        await supabaseClient.auth.signOut();

    }
);


// ===============================
// GLOBAL DATA
// ===============================

let countries = [];
let categories = [];
let links = [];


// ===============================
// LOAD EVERYTHING
// ===============================

async function loadEverything() {

    await loadCountries();

    await loadCategories();

    await loadLinks();

}


// ===============================
// COUNTRIES
// ===============================

async function loadCountries() {

    const { data, error } =
        await supabaseClient
            .from("countries")
            .select("*")
            .order("id", {
                ascending: true
            });

    console.log("COUNTRIES:", data);
    console.log("COUNTRIES ERROR:", error);

    if (error) {

        console.error(
            "Country loading error:",
            error
        );

        return;
    }

    countries = data || [];

    renderCountries();

    populateCountrySelect();
}


function renderCountries() {

    const container =
        document.getElementById(
            "countries-list"
        );

    const count =
        document.getElementById(
            "country-count"
        );

    count.textContent =
        countries.length;

    container.innerHTML = "";

    countries.forEach(country => {

        const div =
            document.createElement("div");

        div.className = "item";

        div.innerHTML = `
            <span>
                ${escapeHTML(country.name)}
            </span>

            <button
                class="delete"
                onclick="deleteCountry(${country.id})"
            >
                Delete
            </button>
        `;

        container.appendChild(div);

    });
}


function populateCountrySelect() {

    const select =
        document.getElementById(
            "link-country"
        );

    select.innerHTML =
        `<option value="">
            Select country
        </option>`;

    countries.forEach(country => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            country.id;

        option.textContent =
            country.name;

        select.appendChild(option);

    });
}


// ===============================
// ADD COUNTRY
// ===============================

document
    .getElementById("add-country")
    .addEventListener(
        "click",
        async () => {

            const input =
                document.getElementById(
                    "country-name"
                );

            const name =
                input.value.trim();

            if (!name) {

                alert(
                    "Please enter country name."
                );

                return;
            }

            const { error } =
                await supabaseClient
                    .from("countries")
                    .insert({
                        name: name
                    });

            if (error) {

                alert(error.message);

                return;
            }

            input.value = "";

            await loadCountries();

        }
    );


// ===============================
// DELETE COUNTRY
// ===============================

async function deleteCountry(id) {

    if (
        !confirm(
            "Delete this country?"
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("countries")
            .delete()
            .eq("id", id);

    if (error) {

        alert(error.message);

        return;
    }

    await loadCountries();

}


// ===============================
// CATEGORIES
// ===============================

async function loadCategories() {

    const { data, error } =
        await supabaseClient
            .from("categories")
            .select("*")
            .order("id", {
                ascending: true
            });

    console.log("CATEGORIES:", data);
    console.log(
        "CATEGORIES ERROR:",
        error
    );

    if (error) {

        console.error(
            "Category loading error:",
            error
        );

        return;
    }

    categories = data || [];

    renderCategories();

    populateCategorySelect();
}


function renderCategories() {

    const container =
        document.getElementById(
            "categories-list"
        );

    const count =
        document.getElementById(
            "category-count"
        );

    count.textContent =
        categories.length;

    container.innerHTML = "";

    categories.forEach(category => {

        const div =
            document.createElement("div");

        div.className = "item";

        div.innerHTML = `
            <span>
                ${escapeHTML(category.name)}
            </span>

            <button
                class="delete"
                onclick="deleteCategory(${category.id})"
            >
                Delete
            </button>
        `;

        container.appendChild(div);

    });
}


function populateCategorySelect() {

    const select =
        document.getElementById(
            "link-category"
        );

    select.innerHTML =
        `<option value="">
            Select category
        </option>`;

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category.id;

        option.textContent =
            category.name;

        select.appendChild(option);

    });
}


// ===============================
// ADD CATEGORY
// ===============================

document
    .getElementById("add-category")
    .addEventListener(
        "click",
        async () => {

            const input =
                document.getElementById(
                    "category-name"
                );

            const name =
                input.value.trim();

            if (!name) {

                alert(
                    "Please enter category name."
                );

                return;
            }

            const { error } =
                await supabaseClient
                    .from("categories")
                    .insert({
                        name: name
                    });

            if (error) {

                alert(error.message);

                return;
            }

            input.value = "";

            await loadCategories();

        }
    );


// ===============================
// DELETE CATEGORY
// ===============================

async function deleteCategory(id) {

    if (
        !confirm(
            "Delete this category?"
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("categories")
            .delete()
            .eq("id", id);

    if (error) {

        alert(error.message);

        return;
    }

    await loadCategories();

}


// ===============================
// LINKS
// ===============================

async function loadLinks() {

    const { data, error } =
        await supabaseClient
            .from("links")
            .select("*")
            .order("id", {
                ascending: true
            });

    console.log("LINKS:", data);
    console.log("LINKS ERROR:", error);

    if (error) {

        console.error(
            "Link loading error:",
            error
        );

        return;
    }

    links = data || [];

    renderLinks();

}


function renderLinks() {

    const container =
        document.getElementById(
            "links-list"
        );

    const count =
        document.getElementById(
            "link-count"
        );

    count.textContent =
        links.length;

    container.innerHTML = "";

    links.forEach(link => {

        const country =
            countries.find(
                c =>
                    c.id ===
                    link.country_id
            );

        const category =
            categories.find(
                c =>
                    c.id ===
                    link.category_id
            );

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "link-item";

        div.innerHTML = `
            <strong>
                ${escapeHTML(link.title)}
            </strong>

            <div>
                Country:
                ${escapeHTML(
                    country?.name ||
                    "Unknown"
                )}
            </div>

            <div>
                Category:
                ${escapeHTML(
                    category?.name ||
                    "Unknown"
                )}
            </div>

            <a
                href="${escapeAttribute(link.url)}"
                target="_blank"
                rel="noopener"
            >
                ${escapeHTML(link.url)}
            </a>

            <br><br>

            <button
                class="delete"
                onclick="deleteLink(${link.id})"
            >
                Delete
            </button>
        `;

        container.appendChild(div);

    });

}


// ===============================
// ADD LINK
// ===============================

document
    .getElementById("add-link")
    .addEventListener(
        "click",
        async () => {

            const title =
                document
                    .getElementById(
                        "link-title"
                    )
                    .value
                    .trim();

            const url =
                document
                    .getElementById(
                        "link-url"
                    )
                    .value
                    .trim();

            const countryId =
                document
                    .getElementById(
                        "link-country"
                    )
                    .value;

            const categoryId =
                document
                    .getElementById(
                        "link-category"
                    )
                    .value;


            if (
                !title ||
                !url ||
                !countryId ||
                !categoryId
            ) {

                alert(
                    "Please fill everything."
                );

                return;
            }


            const { error } =
                await supabaseClient
                    .from("links")
                    .insert({

                        title: title,

                        url: url,

                        country_id:
                            Number(countryId),

                        category_id:
                            Number(categoryId)

                    });


            if (error) {

                alert(error.message);

                return;
            }


            document
                .getElementById(
                    "link-title"
                )
                .value = "";

            document
                .getElementById(
                    "link-url"
                )
                .value = "";


            document
                .getElementById(
                    "link-message"
                )
                .textContent =
                    "Website added successfully!";


            await loadLinks();

        }
    );


// ===============================
// DELETE LINK
// ===============================

async function deleteLink(id) {

    if (
        !confirm(
            "Delete this website?"
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("links")
            .delete()
            .eq("id", id);

    if (error) {

        alert(error.message);

        return;
    }

    await loadLinks();

}


// ===============================
// SECURITY HELPERS
// ===============================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}


// ===============================
// START
// ===============================

checkUser();
