// JANJUA TRADERS - SHOP SCRIPT

const ORDER_FORM = "order-form.html";

const productGrid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");

function rupees(value) {
    return "Rs. " + Number(value || 0).toLocaleString("en-PK");
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showProducts(productList) {

    if (!productGrid) return;

    if (!productList.length) {
        productGrid.innerHTML = `
            <p style="text-align:center;padding:30px;">
                Product نہیں ملا۔
            </p>
        `;
        return;
    }

    productGrid.innerHTML = productList.map(product => `

        <div class="product-card">

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
                onerror="this.style.display='none'"
            >

            <div class="product-info">

                <h3>${escapeHTML(product.name)}</h3>

                <p>
                    ${escapeHTML(product.description || "")}
                </p>

                <div class="price-row">

                    <strong>
                        ${rupees(product.price)}
                    </strong>

                    ${
                        product.oldPrice
                        ? `<del>${rupees(product.oldPrice)}</del>`
                        : ""
                    }

                </div>

                <button
                    class="order-btn"
                    onclick="orderProduct('${escapeHTML(product.id)}')"
                >
                    ORDER NOW
                </button>

            </div>

        </div>

    `).join("");
}


// ===============================
// ORDER NOW
// ===============================

function orderProduct(productId) {

    const product = products.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {
        alert("Product نہیں ملا۔");
        return;
    }

    const params = new URLSearchParams();

    params.set("Product", product.name);

    params.set(
        "Product_Description",
        product.description || ""
    );

    params.set(
        "Product_Price",
        product.price || 0
    );

    params.set(
        "Old_Price",
        product.oldPrice || ""
    );

    // یہ customer کو نظر نہیں آئے گا
    params.set(
        "Supplier",
        product.supplier || ""
    );

    // یہ بھی customer کو نظر نہیں آئے گا
    params.set(
        "Product_ID",
        product.id || ""
    );

    // اصل supplier product link
    params.set(
        "Product_Link",
        product.productLink || ""
    );

    params.set(
        "Product_Image",
        product.image || ""
    );

    window.location.href =
        ORDER_FORM + "?" + params.toString();
}


// ===============================
// CATEGORY
// ===============================

function showCategory(category) {

    if (category === "All") {

        showProducts(products);

        return;
    }

    const filtered = products.filter(product =>

        String(product.category).toLowerCase()
        ===
        String(category).toLowerCase()

    );

    showProducts(filtered);
}


// ===============================
// SEARCH
// ===============================

if (searchBox) {

    searchBox.addEventListener(
        "input",
        function () {

            const text =
                this.value.trim().toLowerCase();

            if (!text) {

                showProducts(products);

                return;
            }

            const filtered = products.filter(product =>

                String(product.name)
                    .toLowerCase()
                    .includes(text)

                ||

                String(product.description || "")
                    .toLowerCase()
                    .includes(text)

                ||

                String(product.category || "")
                    .toLowerCase()
                    .includes(text)

            );

            showProducts(filtered);

        }
    );
}


// ===============================
// START
// ===============================

showProducts(products);
