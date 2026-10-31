function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function renderAdmin() {
    let cats = Store.categories(),
        products = Store.products(),
        orders = Store.orders();

    document.getElementById("admin-stats").innerHTML = `
    <div class="stat">মোট পণ্য<b>${Store.digits(products.length)}</b></div>
    <div class="stat">ক্যাটাগরি<b>${Store.digits(cats.length)}</b></div>
    <div class="stat">মোট অর্ডার<b>${Store.digits(orders.length)}</b></div>
  `;

    document.getElementById("product-category").innerHTML = cats.map(c =>
        `<option value="${c.id}">${esc(c.name)}</option>`
    ).join("");

    document.getElementById("admin-categories").innerHTML = cats.map(c =>
        `<span class="admin-chip">${c.icon || "🛍️"} ${esc(c.name)} <button onclick="deleteCategory('${c.id}')">×</button></span>`
    ).join("");

    document.getElementById("admin-products").innerHTML = products.length ? `
    <table class="admin-table">
      <thead>
        <tr>
          <th>পণ্য</th>
          <th>ক্যাটাগরি</th>
          <th>দাম</th>
          <th>ছাড়ের দাম</th>
          <th>কাজ</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${esc(p.name)}</td>
            <td>${esc((cats.find(c => c.id === p.category) || {}).name || "—")}</td>
            <td><input id="price-${p.id}" type="number" value="${p.price}"></td>
            <td><input id="old-${p.id}" type="number" value="${p.oldPrice || 0}"></td>
            <td>
              <button class="btn small" onclick="savePrice(${p.id})">সংরক্ষণ</button> 
              <button class="danger" onclick="deleteProduct(${p.id})">মুছুন</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<p class="empty">কোনো পণ্য নেই।</p>';

    document.getElementById("admin-orders").innerHTML = orders.length ? `
    <table class="admin-table">
      <thead>
        <tr>
          <th>অর্ডার</th>
          <th>ক্রেতা</th>
          <th>মোবাইল</th>
          <th>মোট</th>
          <th>অবস্থা</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>${esc(o.date)}</td>
            <td>${esc(o.name)}</td>
            <td>${esc(o.phone)}</td>
            <td>${Store.money(o.total)}</td>
            <td>
              <select onchange="updateOrder(${o.id},this.value)">
                ${["নতুন", "প্রক্রিয়াধীন", "পাঠানো হয়েছে", "সম্পন্ন", "বাতিল"].map(s =>
        `<option ${o.status === s ? "selected" : ""}>${s}</option>`
    ).join("")}
              </select>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<p class="empty">এখনো কোনো অর্ডার আসেনি।</p>';
}

function deleteCategory(id) {
    if (!confirm("ক্যাটাগরিটি মুছে ফেলবেন?")) return;
    Store.write("categories", Store.categories().filter(c => c.id !== id));
    renderAdmin();
}

function deleteProduct(id) {
    if (!confirm("পণ্যটি মুছে ফেলবেন?")) return;
    Store.write("products", Store.products().filter(p => p.id !== id));
    renderAdmin();
}

function savePrice(id) {
    let p = Store.products(),
        x = p.find(v => v.id === id);

    x.price = Number(document.getElementById("price-" + id).value);
    x.oldPrice = Number(document.getElementById("old-" + id).value);

    Store.write("products", p);
    alert("পণ্যের দাম সংরক্ষণ করা হয়েছে।");
    renderAdmin();
}

function updateOrder(id, status) {
    let o = Store.orders(),
        x = o.find(v => v.id === id);

    x.status = status;
    Store.write("orders", o);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("category-form").addEventListener("submit", e => {
        e.preventDefault();

        let f = new FormData(e.target),
            name = f.get("name").trim(),
            cats = Store.categories();

        if (cats.some(c => c.name === name)) {
            alert("এই ক্যাটাগরি আগে থেকেই আছে।");
            return;
        }

        cats.push({
            id: "cat" + Date.now(),
            name,
            icon: f.get("icon") || "🛍️"
        });

        Store.write("categories", cats);
        e.target.reset();
        renderAdmin();
    });

    document.getElementById("product-form").addEventListener("submit", e => {
        e.preventDefault();

        let f = new FormData(e.target),
            p = Store.products();

        p.unshift({
            id: Date.now(),
            name: f.get("name"),
            category: f.get("category"),
            price: Number(f.get("price")),
            oldPrice: Number(f.get("oldPrice") || 0),
            image: f.get("image") || "https://placehold.co/500x400?text=FUTPAT",
            description: f.get("description") || ""
        });

        Store.write("products", p);
        e.target.reset();
        renderAdmin();
        alert("নতুন পণ্য যোগ হয়েছে।");
    });

    document.getElementById("reset-demo").addEventListener("click", () => {
        if (confirm("সব ডেমো ডেটা ফিরিয়ে আনবেন?")) {
            ["categories", "products", "cart", "orders"].forEach(k => localStorage.removeItem("futpat_" + k));
            renderAdmin();
        }
    });

    renderAdmin();
});