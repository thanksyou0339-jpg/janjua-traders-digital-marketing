const ORDER_FORM = "order-form.html";

const productGrid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");

function rupees(value) {
    return "Rs. " + Number(value || 0).toLocaleString("en-PK");
}

function showProducts(productList) {

    if (!productGrid) return;

    productGrid.innerHTML = productList.map(product => `
        <div class="product-card">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description || ""}</p>

                <div class="price-row">
                    <strong>${rupees(product.price)}</strong>

                    ${
                        product.oldPrice
                        ? `<del>${rupees(product.oldPrice)}</del>`
                        : ""
                    }
                </div>

                <button
                    class="order-btn"
                    onclick="orderProduct('${product.id}')"
                >
                    ORDER NOW
                </button>

            </div>

        </div>
    `).join("");
}


function orderProduct(productId) {

    const product = products.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {
        alert("Product نہیں ملا");
        return;
    }

    const params = new URLSearchParams();

    params.set("Product", product.name);
    params.set("Product_Description", product.description || "");
    params.set("Product_Price", product.price || 0);
    params.set("Old_Price", product.oldPrice || "");

    // Hidden information
    params.set("Supplier", product.supplier || "");
    params.set("Product_ID", product.id || "");
    params.set("Product_Link", product.productLink || "");
    params.set("Product_Image", product.image || "");

    window.location.href =
        ORDER_FORM + "?" + params.toString();
}


function showCategory(category) {

    if (category === "All") {
        showProducts(products);
        return;
    }

    const filtered = products.filter(product =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );

    showProducts(filtered);
}


if (searchBox) {

    searchBox.addEventListener("input", function () {

        const text =
            this.value.trim().toLowerCase();

        if (!text) {
            showProducts(products);
            return;
        }

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(text) ||
            (product.description || "")
                .toLowerCase()
                .includes(text) ||
            product.category
                .toLowerCase()
                .includes(text)
        );

        showProducts(filtered);

    });
}


showProducts(products);
