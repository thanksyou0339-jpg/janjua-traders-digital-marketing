// ==========================================
// JANJUA TRADERS - DIGITAL MARKETING SYSTEM
// ==========================================


// ------------------------------------------
// 1. READ PRODUCT INFORMATION FROM LINK
// ------------------------------------------

const params = new URLSearchParams(window.location.search);

const platform = params.get("platform") || "Markaz";

const title =
    params.get("title") ||
    "آپ کا Product";

const image =
    params.get("image") ||
    "";

const description =
    params.get("description") ||
    "اس product کی مکمل تفصیل یہاں نظر آئے گی۔";

const price =
    Number(params.get("price")) || 0;

const delivery =
    Number(params.get("delivery")) || 0;

const extra =
    params.get("extra") ||
    "Product کی قیمت اور delivery charges آرڈر سے پہلے چیک کریں۔";


// ------------------------------------------
// 2. SHOW PRODUCT INFORMATION
// ------------------------------------------

const platformElement =
    document.getElementById("platformBadge");

const titleElement =
    document.getElementById("productTitle");

const imageElement =
    document.getElementById("productImage");

const noImageElement =
    document.getElementById("noImage");

const descriptionElement =
    document.getElementById("productDescription");

const priceElement =
    document.getElementById("productPrice");

const deliveryElement =
    document.getElementById("deliveryPrice");

const totalElement =
    document.getElementById("totalPrice");

const extraElement =
    document.getElementById("extraInfo");


// Platform

if (platformElement) {
    platformElement.textContent = platform;
}


// Product title

if (titleElement) {
    titleElement.textContent = title;
}


// Product description

if (descriptionElement) {
    descriptionElement.textContent = description;
}


// Product image

if (imageElement && image) {

    imageElement.src = image;

    imageElement.style.display = "block";

    if (noImageElement) {
        noImageElement.style.display = "none";
    }

}


// Product price

if (priceElement) {
    priceElement.textContent =
        "Rs. " + price.toLocaleString("en-PK");
}


// Delivery

if (deliveryElement) {
    deliveryElement.textContent =
        "Rs. " + delivery.toLocaleString("en-PK");
}


// Total

const total =
    price + delivery;

if (totalElement) {
    totalElement.textContent =
        "Rs. " + total.toLocaleString("en-PK");
}


// Extra information

if (extraElement) {
    extraElement.textContent = extra;
}


// ------------------------------------------
// 3. SET PLATFORM IN ORDER FORM
// ------------------------------------------

const platformInput =
    document.getElementById("platform");

if (platformInput) {

    const allowedPlatforms =
        ["OLX", "Markaz", "Daraz"];

    if (allowedPlatforms.includes(platform)) {
        platformInput.value = platform;
    }

}


// ------------------------------------------
// 4. QUANTITY CALCULATION
// ------------------------------------------

const quantityInput =
    document.getElementById("quantity");

function updateTotal() {

    const quantity =
        Number(quantityInput?.value) || 1;

    const productTotal =
        price * quantity;

    const finalTotal =
        productTotal + delivery;

    if (totalElement) {

        totalElement.textContent =
            "Rs. " +
            finalTotal.toLocaleString("en-PK");

    }

}


if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        updateTotal
    );

}


// ------------------------------------------
// 5. ORDER FORM
// ------------------------------------------

const orderForm =
    document.getElementById("orderForm");

const result =
    document.getElementById("result");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const customerName =
                document.getElementById("customerName")?.value.trim();

            const customerPhone =
                document.getElementById("customerPhone")?.value.trim();

            const address =
                document.getElementById("address")?.value.trim();

            const quantity =
                Number(
                    document.getElementById("quantity")?.value
                ) || 1;

            const message =
                document.getElementById("message")?.value.trim() || "";


            // Final amount

            const finalTotal =
                (price * quantity) + delivery;


            // --------------------------------
            // ORDER DATA
            // --------------------------------

            const orderData = {

                platform: platform,

                product: title,

                productImage: image,

                productPrice: price,

                deliveryCharges: delivery,

                quantity: quantity,

                totalAmount: finalTotal,

                customerName: customerName,

                customerPhone: customerPhone,

                address: address,

                message: message,

                orderTime:
                    new Date().toISOString()

            };


            // Save order temporarily
            // in browser

            localStorage.setItem(
                "janjua_last_order",
                JSON.stringify(orderData)
            );


            // --------------------------------
            // SHOW CONFIRMATION
            // --------------------------------

            if (result) {

                result.classList.remove("hidden");

                result.innerHTML =

                    "<strong>آپ کا Order تیار ہے۔</strong><br><br>" +

                    "Platform: " +
                    escapeHtml(platform) +

                    "<br>Product: " +
                    escapeHtml(title) +

                    "<br>Customer: " +
                    escapeHtml(customerName) +

                    "<br>Mobile: " +
                    escapeHtml(customerPhone) +

                    "<br>Quantity: " +
                    quantity +

                    "<br>Total: Rs. " +
                    finalTotal.toLocaleString("en-PK") +

                    "<br><br>" +

                    "آپ کی معلومات محفوظ ہو گئی ہیں۔";

            }


        }
    );

}


// ------------------------------------------
// 6. SAFE HTML TEXT
// ------------------------------------------

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ------------------------------------------
// 7. CREATE PRODUCT LINK
// ------------------------------------------
//
// Example:
//
// ?platform=Markaz
// &title=Mobile Phone
// &image=IMAGE_URL
// &price=25000
// &delivery=250
// &description=New Mobile
// &extra=Warranty available
//
// ------------------------------------------

function createProductLink(data) {

    const baseUrl =
        window.location.origin +
        window.location.pathname;


    const query =
        new URLSearchParams({

            platform: data.platform,

            title: data.title,

            image: data.image,

            price: data.price,

            delivery: data.delivery,

            description: data.description,

            extra: data.extra

        });


    return baseUrl + "?" + query.toString();

}


// ------------------------------------------
// END
// ------------------------------------------
