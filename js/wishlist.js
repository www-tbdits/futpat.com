function renderWishlist() {
    let host = document.getElementById("wishlist-content");
    if (!host) return;
    let wIds = Store.wishlist();
    let prods = Store.products().filter(p => wIds.includes(p.id));

    document.querySelectorAll("#wishlist-count").forEach(e => e.textContent = Store.digits(Store.wishlistCount()));

    if (!prods.length) {
        host.innerHTML = '<div class="empty"><h2>আপনার পছন্দের তালিকা খালি</h2><p>পছন্দের পণ্যগুলোর পাশে হৃদয়ে ক্লিক করে সেভ করুন।</p><a class="btn" href="shop.html">শপিং শুরু করুন</a></div>';
        return;
    }

    host.innerHTML = `<div class="product-grid">${prods.map(p => productCard(p)).join("")}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#wishlist-count").forEach(e => e.textContent = Store.digits(Store.wishlistCount()));
    renderWishlist();
});