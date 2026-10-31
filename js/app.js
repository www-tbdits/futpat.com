
// =====================================
// PRODUCT CARD
// =====================================

function productCard(p) {

    let off = p.oldPrice > p.price
        ? Math.round((1 - p.price / p.oldPrice) * 100)
        : 0;

    let liked = Store.isWishlisted(p.id);

    return `
    <article class="product-card">

        <span class="discount">
            ${off ? Store.digits(off) + "% ছাড়" : "নতুন"}
        </span>

        <!-- WISHLIST BUTTON -->
        <button
            class="wishlist-btn ${liked ? 'active' : ''}"
            onclick="handleWishlist(${p.id})"
            aria-label="পছন্দের তালিকায় যোগ করুন"
            title="পছন্দের তালিকায় যোগ করুন">

            <i class="${liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>

        </button>

        <img
            src="${p.image || 'https://placehold.co/400x300?text=FUTPAT'}"
            alt="${p.name}"
            onerror="this.src='https://placehold.co/400x300?text=FUTPAT'">

        <h3>${p.name}</h3>

        <p>${(p.description || "").slice(0, 48)}</p>

        <div>
            <span class="price">${Store.money(p.price)}</span>
            ${p.oldPrice
            ? `<span class="old-price">${Store.money(p.oldPrice)}</span>`
            : ""}
        </div>

        <div class="product-actions">
            <small>★ ★ ★ ★ ☆</small>
            <button
                class="add-cart"
                onclick="addToCart(${p.id})">
                ＋ কার্টে নিন
            </button>
        </div>
    </article>
    `;
}


// =====================================
// CART SYSTEM
// =====================================

function addToCart(id) {
    Store.addCart(id);
    updateCartCount();
    alert("পণ্যটি কার্টে যোগ হয়েছে!");
}
function updateCartCount() {

    document.querySelectorAll("#cart-count").forEach(e => {
        e.textContent = Store.digits(Store.cartCount());
    });

}

// =====================================
// WISHLIST SYSTEM
// =====================================

function handleWishlist(id) {
    const added = Store.toggleWishlist(id);
    updateWishlistCount();

    // Update only the clicked heart button
    const buttons = document.querySelectorAll(
        `.wishlist-btn[onclick="handleWishlist(${id})"]`
    );

    buttons.forEach(button => {
        button.classList.toggle("active", added);
        const icon = button.querySelector("i");
        if (icon) {
            icon.className = added
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";
        }
    });
    // Update wishlist page if currently open
    renderWishlist();
}

function updateWishlistCount() {
    document.querySelectorAll("#wishlist-count").forEach(e => {
        e.textContent = Store.digits(Store.wishlistCount());

    });
}


// =====================================
// WISHLIST PAGE
// =====================================

function renderWishlist() {
    const host =
        document.getElementById("wishlist-products") ||
        document.getElementById("wishlist-content");

    if (!host) return;
    const products = Store.wishlistDetails();
    updateWishlistCount();
    if (!products.length) {

        host.innerHTML = `
            <div class="empty" style="grid-column:1/-1;">
                <h2>আপনার পছন্দের তালিকা খালি!</h2>
                <p>পছন্দের পণ্যগুলোর পাশে হার্টে ক্লিক করে সেভ করুন।</p>

                <a class="btn" href="shop.html">
                    শপিং শুরু করুন
                </a>
            </div>
        `;
        return;
    }
    host.innerHTML = products.map(productCard).join("");

}

// =====================================
// HOME PAGE
// =====================================

function renderHome() {

    let cats = document.getElementById("home-categories");

    if (cats) {

        cats.innerHTML = Store.categories().map(c => `

            <a class="category-card"
                href="shop.html?category=${encodeURIComponent(c.id)}">

                <span class="cat-icon">
                    ${c.icon || "🛍️"}
                </span>

                <b>${c.name}</b>

            </a>

        `).join("");

    }

    let prods = document.getElementById("home-products");

    if (prods) {

        prods.innerHTML = Store.products()
            .slice(0, 10)
            .map(productCard)
            .join("") ||
            '<div class="empty">এখনো কোনো পণ্য যোগ করা হয়নি।</div>';

    }

}


// =====================================
// SHOP PAGE
// =====================================

function renderShop() {

    let box = document.getElementById("shop-products");

    if (!box) return;

    let cats = Store.categories();

    let params = new URLSearchParams(location.search);

    let selected = params.get("category") || "all";

    let search = document.getElementById("shop-search");

    if (search) {
        search.value = params.get("q") || "";
    }

    let catBox = document.getElementById("shop-categories");

    if (!catBox) return;

    catBox.innerHTML = `

        <label>
            <input type="radio" name="cat" value="all"
            ${selected === "all" ? "checked" : ""}>
            সব পণ্য
        </label>

    ` + cats.map(c => `

        <label>

            <input type="radio" name="cat" value="${c.id}"
            ${selected === c.id ? "checked" : ""}>

            ${c.icon || "🛍️"} ${c.name}

        </label>

    `).join("");


    function draw() {

        let list = Store.products();

        let q = search ? search.value.trim().toLowerCase() : "";

        let maxInput = document.getElementById("max-price");

        let max = Number(maxInput?.value || Infinity);


        if (selected !== "all") {

            list = list.filter(p => p.category === selected);

        }

        if (q) {

            list = list.filter(p =>
                (p.name + " " + (p.description || ""))
                    .toLowerCase()
                    .includes(q)
            );

        }

        list = list.filter(p => p.price <= max);

        let sort = document.getElementById("sort-products")?.value;

        if (sort === "low") {
            list.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            list.sort((a, b) => b.price - a.price);
        }

        if (sort === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name, "bn"));
        }

        box.innerHTML = list.map(productCard).join("") ||
            '<div class="empty">দুঃখিত, কোনো পণ্য পাওয়া যায়নি।</div>';

        let resultCount = document.getElementById("result-count");

        if (resultCount) {
            resultCount.textContent =
                Store.digits(list.length) + "টি পণ্য পাওয়া গেছে";
        }

    }


    catBox.addEventListener("change", e => {

        if (e.target.name === "cat") {

            selected = e.target.value;

            draw();

        }

    });

    if (search) {
        search.addEventListener("input", draw);
    }

    document.getElementById("sort-products")
        ?.addEventListener("change", draw);

    document.getElementById("apply-filter")
        ?.addEventListener("click", draw);

    document.getElementById("clear-filter")
        ?.addEventListener("click", () => {

            selected = "all";

            if (search) search.value = "";

            if (maxInput = document.getElementById("max-price")) {
                maxInput.value = "";
            }

            let allRadio = catBox.querySelector('input[value="all"]');

            if (allRadio) allRadio.checked = true;

            draw();

        });

    draw();

}


// =====================================
// PAGE INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    updateWishlistCount();

    renderHome();

    renderShop();

    renderWishlist();

});
