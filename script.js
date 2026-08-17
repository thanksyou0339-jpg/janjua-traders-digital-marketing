// ==========================================
// JANJUA TRADERS - DIGITAL MARKETING SYSTEM
// FINAL COMPLETE VERSION
// ==========================================


// ------------------------------------------
// 1. READ PRODUCT INFORMATION FROM LINK
// ------------------------------------------

const params = new URLSearchParams(window.location.search);

const platform =
    params.get("platform") || "Markaz";

const title =
    params.get("title") ||
    params.get("product") ||
    "آپ کا Product";

const image =
    params.get("image") || "";

const description =
    params.get("description") ||
    "اس product کی مکمل تفصیل یہاں نظر آئے گی۔";

const price =
    Number(params.get("price")) || 0;

const delivery =
    Number(params.get("delivery")) || 0;

const extra =
    params.get("extra") ||
    params.get("extras") ||
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
    document.getElementById("deliveryPrice") ||
    document.getElementById("deliveryCharge");

const totalElement =
    document.getElementById("totalPrice");

const extraElement =
    document.getElementById("extraInfo") ||
    document.getElementById("extraCharges");


// ------------------------------------------
// Platform
// ------------------------------------------

if (platformElement) {
    platformElement.textContent = platform;
}


// ------------------------------------------
// Product Title
// ------------------------------------------

if (titleElement) {
    titleElement.textContent = title;
}


// ------------------------------------------
// Product Description
// ------------------------------------------

if (descriptionElement) {
    descriptionElement.textContent = description;
}


// ------------------------------------------
// Product Image
// ------------------------------------------

if (imageElement && image) {

    imageElement.src = image;
    imageElement.style.display = "block";

    if (noImageElement) {
        noImageElement.style.display = "none";
    }
}


// ------------------------------------------
// Product Price
// ------------------------------------------

if (priceElement) {

    priceElement.textContent =
        "Rs. " +
        price.toLocaleString("en-PK");
}


// ------------------------------------------
// Delivery
// ------------------------------------------

if (deliveryElement) {

    deliveryElement.textContent =
        "Rs. " +
        delivery.toLocaleString("en-PK");
}


// ------------------------------------------
// Total
// ------------------------------------------

const total =
    price + delivery;

if (totalElement) {

    totalElement.textContent =
        "Rs. " +
        total.toLocaleString("en-PK");
}


// ------------------------------------------
// Extra Information
// ------------------------------------------

if (extraElement) {

    extraElement.textContent =
        extra;
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

        platformInput.value =
            platform;
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
                document
                    .getElementById("customerName")
                    ?.value.trim() || "";


            const customerPhone =
                document
                    .getElementById("customerPhone")
                    ?.value.trim() || "";


            const address =
                document
                    .getElementById("address")
                    ?.value.trim() || "";


            const quantity =
                Number(
                    document
                        .getElementById("quantity")
                        ?.value
                ) || 1;


            const message =
                document
                    .getElementById("message")
                    ?.value.trim() || "";


            // --------------------------------
            // FINAL AMOUNT
            // --------------------------------

            const finalTotal =
                (price * quantity) +
                delivery;


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

                productLink:
                    window.location.href,

                orderTime:
                    new Date().toISOString()
            };


            // --------------------------------
            // SAVE ORDER TEMPORARILY
            // --------------------------------

            localStorage.setItem(
                "janjua_last_order",
                JSON.stringify(orderData)
            );


            // --------------------------------
            // SHOW CONFIRMATION
            // --------------------------------

            if (result) {

                result.classList.remove(
                    "hidden"
                );


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

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// 7. CREATE PRODUCT LINK
// ==========================================

function createProductLink(data) {

    const website =
        "https://thanksyou0339-jpg.github.io/janjua-traders-digital-marketing/";


    const query =
        new URLSearchParams();


    query.set(
        "platform",
        data.platform || "Markaz"
    );


    query.set(
        "title",
        data.title ||
        data.product ||
        ""
    );


    query.set(
        "product",
        data.title ||
        data.product ||
        ""
    );


    query.set(
        "image",
        data.image || ""
    );


    query.set(
        "price",
        data.price || 0
    );


    query.set(
        "delivery",
        data.delivery || 0
    );


    query.set(
        "description",
        data.description || ""
    );


    query.set(
        "extra",
        data.extra ||
        data.extras ||
        ""
    );


    query.set(
        "extras",
        data.extra ||
        data.extras ||
        ""
    );


    return (
        website +
        "?" +
        query.toString()
    );
}


// ==========================================
// 8. LOAD PRODUCT FROM LINK
// ==========================================

function loadProductLink() {

    const linkParams =
        new URLSearchParams(
            window.location.search
        );


    const linkPlatform =
        linkParams.get("platform") ||
        "Markaz";


    const linkTitle =
        linkParams.get("title") ||
        linkParams.get("product") ||
        "آپ کا Product";


    const linkPrice =
        Number(
            linkParams.get("price")
        ) || 0;


    const linkDelivery =
        Number(
            linkParams.get("delivery")
        ) || 0;


    const linkImage =
        linkParams.get("image") ||
        "";


    const linkDescription =
        linkParams.get("description") ||
        "اس product کی مکمل تفصیل یہاں نظر آئے گی۔";


    const linkExtra =
        linkParams.get("extra") ||
        linkParams.get("extras") ||
        "";



    // --------------------------------------
    // PLATFORM
    // --------------------------------------

    const platformBox =
        document.getElementById("platform");


    if (platformBox) {

        const allowedPlatforms =
            ["OLX", "Markaz", "Daraz"];


        if (
            allowedPlatforms.includes(
                linkPlatform
            )
        ) {

            platformBox.value =
                linkPlatform;
        }
    }



    // --------------------------------------
    // PRODUCT NAME
    // --------------------------------------

    const productNameBox =
        document.getElementById("productName");


    if (
        productNameBox &&
        linkTitle
    ) {

        productNameBox.value =
            linkTitle;
    }



    // --------------------------------------
    // PRODUCT TITLE
    // --------------------------------------

    const productTitleBox =
        document.getElementById("productTitle");


    if (productTitleBox) {

        productTitleBox.textContent =
            linkTitle;
    }



    // --------------------------------------
    // PRODUCT IMAGE
    // --------------------------------------

    const productImageBox =
        document.getElementById(
            "productImage"
        );


    if (
        productImageBox &&
        linkImage
    ) {

        productImageBox.src =
            linkImage;

        productImageBox.style.display =
            "block";


        const noImageBox =
            document.getElementById(
                "noImage"
            );


        if (noImageBox) {

            noImageBox.style.display =
                "none";
        }
    }



    // --------------------------------------
    // DESCRIPTION
    // --------------------------------------

    const descriptionBox =
        document.getElementById(
            "productDescription"
        );


    if (descriptionBox) {

        descriptionBox.textContent =
            linkDescription;
    }



    // --------------------------------------
    // PRICE
    // --------------------------------------

    const productPriceBox =
        document.getElementById(
            "productPrice"
        );


    if (productPriceBox) {

        productPriceBox.textContent =
            "Rs. " +
            linkPrice.toLocaleString(
                "en-PK"
            );
    }



    // --------------------------------------
    // DELIVERY
    // --------------------------------------

    const deliveryBox =
        document.getElementById(
            "deliveryPrice"
        ) ||
        document.getElementById(
            "deliveryCharge"
        );


    if (deliveryBox) {

        deliveryBox.textContent =
            "Rs. " +
            linkDelivery.toLocaleString(
                "en-PK"
            );
    }



    // --------------------------------------
    // TOTAL
    // --------------------------------------

    const totalBox =
        document.getElementById(
            "totalPrice"
        );


    if (totalBox) {

        const linkTotal =
            linkPrice +
            linkDelivery;


        totalBox.textContent =
            "Rs. " +
            linkTotal.toLocaleString(
                "en-PK"
            );
    }



    // --------------------------------------
    // EXTRA INFORMATION
    // --------------------------------------

    const extraBox =
        document.getElementById(
            "extraInfo"
        ) ||
        document.getElementById(
            "extraCharges"
        );


    if (extraBox) {

        extraBox.textContent =
            linkExtra;
    }



    // --------------------------------------
    // PRODUCT LINK
    // --------------------------------------

    const linkBox =
        document.getElementById(
            "productLink"
        );


    if (linkBox) {

        linkBox.value =
            window.location.href;
    }
}


// ==========================================
// 9. START PRODUCT LINK SYSTEM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProductLink();

        updateTotal();

    }
);


// ==========================================
// 10. FINAL SAFETY CHECK
// ==========================================

window.JanjuaTraders = {

    createProductLink:
        createProductLink,

    loadProductLink:
        loadProductLink,

    updateTotal:
        updateTotal

};


// ==========================================
// END OF JANJUA TRADERS SCRIPT
// ==========================================
