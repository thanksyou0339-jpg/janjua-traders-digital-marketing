document.addEventListener(
    "DOMContentLoaded",
    function () {


        const params =
            new URLSearchParams(
                window.location.search
            );


        const productName =
            params.get("Product") || "Product";


        const description =
            params.get(
                "Product_Description"
            ) || "";


        const price =
            Number(
                params.get(
                    "Product_Price"
                ) || 0
            );


        const oldPrice =
            Number(
                params.get(
                    "Old_Price"
                ) || 0
            );


        const supplier =
            params.get(
                "Supplier"
            ) || "";


        const productId =
            params.get(
                "Product_ID"
            ) || "";


        const productLink =
            params.get(
                "Product_Link"
            ) || "";


        const productImage =
            params.get(
                "Product_Image"
            ) || "";


        // =========================
        // PRODUCT SHOW
        // =========================

        document.getElementById(
            "productName"
        ).textContent =
            productName;


        document.getElementById(
            "productPrice"
        ).textContent =
            rupees(price);


        if (oldPrice > 0) {

            document.getElementById(
                "oldPrice"
            ).textContent =
                rupees(oldPrice);

        }


        if (productImage) {

            document.getElementById(
                "productImage"
            ).src =
                productImage;

        }


        // =========================
        // HIDDEN DATA
        // =========================

        document.getElementById(
            "formProduct"
        ).value =
            productName;


        document.getElementById(
            "formDescription"
        ).value =
            description;


        document.getElementById(
            "formProductPrice"
        ).value =
            price;


        document.getElementById(
            "formOldPrice"
        ).value =
            oldPrice;


        // Supplier
        document.getElementById(
            "formSupplier"
        ).value =
            supplier;


        // Product ID
        document.getElementById(
            "formProductId"
        ).value =
            productId;


        // Original Product Link
        document.getElementById(
            "formProductLink"
        ).value =
            productLink;


        document.getElementById(
            "formProductImage"
        ).value =
            productImage;


        document.getElementById(
            "formUrl"
        ).value =
            window.location.href;


        // =========================
        // ORDER ID
        // =========================

        const orderId =
            createOrderId();


        document.getElementById(
            "orderId"
        ).value =
            orderId;


        document.getElementById(
            "emailSubject"
        ).value =
            "New Janjua Traders Order - "
            + orderId;


        // TOTAL

        updateTotal(price);

    }
);


// =========================
// RUPEES
// =========================

function rupees(value) {

    return "Rs. " +
        Number(value || 0)
            .toLocaleString("en-PK");

}


// =========================
// ORDER ID
// =========================

function createOrderId() {

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Karachi",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }
        )
        .formatToParts(now);


    function get(type) {

        const item =
            parts.find(
                p => p.type === type
            );

        return item
            ? item.value
            : "00";

    }


    return (
        "JT-" +

        get("year") +

        get("month") +

        get("day") +

        "-" +

        get("hour") +

        get("minute") +

        get("second")
    );

}


// =========================
// TOTAL
// =========================

function updateTotal(price) {

    const quantityInput =
        document.getElementById(
            "quantity"
        );


    let quantity =
        parseInt(
            quantityInput.value,
            10
        );


    if (!quantity) {

        quantity = 1;

    }


    if (quantity < 1) {

        quantity = 1;

    }


    if (quantity > 10) {

        quantity = 10;

    }


    quantityInput.value =
        quantity;


    const total =
        Number(price) *
        quantity;


    document.getElementById(
        "visibleProductTotal"
    ).textContent =
        rupees(total);


    document.getElementById(
        "visibleTotal"
    ).textContent =
        rupees(total);


    document.getElementById(
        "formTotalPrice"
    ).value =
        total;

}


// =========================
// QUANTITY CHANGE
// =========================

document
    .getElementById("quantity")
    .addEventListener(
        "input",
        function () {

            const price =
                Number(
                    document.getElementById(
                        "formProductPrice"
                    ).value || 0
                );


            updateTotal(price);

        }
    );
