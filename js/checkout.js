document.addEventListener("DOMContentLoaded", () => {
    let items = Store.cartDetails(),
        summary = document.getElementById("checkout-summary"),
        form = document.getElementById("checkout-form"),
        successModal = document.getElementById("successModal"),
        modalOkBtn = document.getElementById("modalOkBtn");

    if (!items.length) {
        summary.innerHTML = '<p>আপনার কার্ট খালি।</p><a href="shop.html">পণ্য দেখুন</a>';
        form.style.display = "none";
        return;
    }

    let deliveryCost = 60; // Default delivery charge (Dhaka Inside)

    function renderSummary() {
        let subtotal = Store.total();
        let grandTotal = subtotal + deliveryCost;

        summary.innerHTML = items.map(p =>
            `<div class="summary-row"><span>${p.name} × ${Store.digits(p.qty)}</span><b>${Store.money(p.price * p.qty)}</b></div>`
        ).join("") +
            `<div class="summary-row"><span>ডেলিভারি চার্জ</span><b>${Store.money(deliveryCost)}</b></div>` +
            `<div class="summary-row"><span>পেমেন্ট মেথড</span><b>ক্যাশ অন ডেলিভারি</b></div>` +
            `<div class="summary-row"><strong>সর্বমোট</strong><strong class="price">${Store.money(grandTotal)}</strong></div>`;
    }

    // Delivery location change listener
    let deliveryInputs = form.querySelectorAll('input[name="delivery_location"]');
    deliveryInputs.forEach(input => {
        input.addEventListener("change", (e) => {
            deliveryCost = e.target.value === "outside_dhaka" ? 120 : 60;
            renderSummary();
        });
    });

    // Initial render
    renderSummary();

    // Form submission
    form.addEventListener("submit", e => {
        e.preventDefault();
        let f = new FormData(e.target),
            selectedLocation = f.get("delivery_location"),
            charge = selectedLocation === "outside_dhaka" ? 120 : 60,
            locationText = selectedLocation === "outside_dhaka" ? "ঢাকার বাইরে" : "ঢাকার ভেতরে";

        let order = {
            id: Date.now(),
            name: f.get("name"),
            phone: f.get("phone"),
            address: f.get("address"),
            deliveryLocation: locationText,
            deliveryCharge: charge,
            paymentMethod: "Cash on Delivery",
            note: f.get("note"),
            items,
            subtotal: Store.total(),
            total: Store.total() + charge,
            status: "নতুন",
            date: new Date().toLocaleString("bn-BD")
        };

        let orders = Store.orders();
        orders.unshift(order);
        Store.write("orders", orders);
        Store.write("cart", []);

        // Show Professional Success Modal Popup instead of alert
        successModal.classList.add("active");
    });

    // Modal button click handler to redirect
    modalOkBtn.addEventListener("click", () => {
        successModal.classList.remove("active");
        location.href = "index.html";
    });
});