// ==========================================
// JANJUA TRADERS - ORDER FORM
// ==========================================

// آپ کی موجودہ Gmail
const GMAIL_EMAIL =
    "thanksyou0339@gmail.com";


// FormSubmit AJAX
const FORM_SUBMIT_URL =
    "https://formsubmit.co/ajax/" +
    GMAIL_EMAIL;


// Delivery charges
const DELIVERY_CHARGES = 0;


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // URL سے Product information لینا

        const params =
            new URLSearchParams(
                window.location.search
            );


        const product = {

            name:
                params.get("Product")
                || "Product",

            description:
                params.get(
                    "Product_Description"
                )
                || "",

            price:
                Number(
                    params.get(
                        "Product_Price"
                    )
                    || 0
                ),

            oldPrice:
                Number(
                    params.get(
                        "Old_Price"
                    )
                    || 0
                ),

            supplier:
                params.get(
                    "Supplier"
                )
                || "",

            id:
                params.get(
                    "Product_ID"
                )
                || "",

            link:
                params.get(
                    "Product_Link"
                )
                || "",

            image:
                params.get(
                    "Product_Image"
                )
                || ""

        };


        const $ = id =>
            document.getElementById(id);


        // ==================================
        // PRODUCT SHOW
        // ==================================

        $("productName").textContent =
            product.name;


        $("productPrice").textContent =
            rupees(product.price);


        if (product.oldPrice > 0) {

            $("oldPrice").textContent =
                rupees(product.oldPrice);

        }


        if (product.image) {

            $("productImage").src =
                product.image;

        }
        else {

            $("productImage")
                .style.display =
                "none";

        }


        // ==================================
        // HIDDEN FIELDS
        // ==================================

        $("formProduct").value =
            product.name;


        $("formDescription").value =
            product.description;


        $("formProductPrice").value =
            product.price;


        $("formOldPrice").value =
            product.oldPrice;


        // Supplier صرف Gmail میں جائے گا
        $("formSupplier").value =
            product.supplier;


        // Product ID صرف Gmail میں جائے گا
        $("formProductId").value =
            product.id;


        // Original supplier link
        $("formProductLink").value =
            product.link;


        $("formProductImage").value =
            product.image;


        $("formDeliveryPrice").value =
            DELIVERY_CHARGES;


        $("formUrl").value =
            window.location.href;


        // ==================================
        // ORDER ID
        // ==================================

        const orderId =
            createOrderId();


        $("orderId").value =
            orderId;


        $("emailSubject").value =
            "New Janjua Traders Order - "
            + orderId;


        // Total
        updateTotal(
            product.price
        );

    }
);


// ==========================================
// RUPEES
// ==========================================

function rupees(value) {

    return "Rs. " +
        Number(
            value || 0
        ).toLocaleString("en-PK");

}


// ==========================================
// ORDER ID
// ==========================================

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
        ).formatToParts(now);


    const get = type => {

        const item =
            parts.find(
                p => p.type === type
            );

        return item
            ? item.value
            : "00";

    };


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


// ==========================================
// QUANTITY
// ==========================================

function getQuantity() {

    const input =
        document.getElementById(
            "quantity"
        );


    let qty =
        parseInt(
            input.value,
            10
        );


    if (!Number.isFinite(qty)) {

        qty = 1;

    }


    qty =
        Math.max(
            1,
            Math.min(
                10,
                qty
            )
        );


    input.value =
        qty;


    return qty;

}


// ==========================================
// TOTAL
// ==========================================

function updateTotal(price) {

    const qty =
        getQuantity();


    const productTotal =
        Number(price) * qty;


    const total =
        productTotal +
        DELIVERY_CHARGES;


    document.getElementById(
        "visibleProductTotal"
    ).textContent =
        rupees(productTotal);


    document.getElementById(
        "visibleTotal"
    ).textContent =
        rupees(total);


    document.getElementById(
        "formTotalPrice"
    ).value =
        total;

}


// ==========================================
// QUANTITY CHANGE
// ==========================================

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


// ==========================================
// SUBMIT ORDER
// ==========================================

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        async function (event) {


            event.preventDefault();


            const form =
                this;


            const button =
                document.getElementById(
                    "submitBtn"
                );


            const success =
                document.getElementById(
                    "successMessage"
                );


            const error =
                document.getElementById(
                    "errorMessage"
                );


            success.style.display =
                "none";


            error.style.display =
                "none";


            // Validation

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            // Total دوبارہ calculate

            const qty =
                getQuantity();


            const price =
                Number(
                    document.getElementById(
                        "formProductPrice"
                    ).value || 0
                );


            const total =
                (price * qty) +
                DELIVERY_CHARGES;


            document.getElementById(
                "formTotalPrice"
            ).value =
                total;


            // Form Data

            const formData =
                new FormData(form);


            button.disabled =
                true;


            button.textContent =
                "Submitting...";


            try {


                const response =
                    await fetch(
                        FORM_SUBMIT_URL,
                        {

                            method:
                                "POST",

                            body:
                                formData,

                            headers:
                                {
                                    "Accept":
                                        "application/json"
                                }

                        }
                    );


                const result =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.ok &&
                    (
                        result.success ===
                            "true"
                        ||
                        result.success ===
                            true
                        ||
                        !result.error
                    )
                ) {


                    success.style.display =
                        "block";


                    button.textContent =
                        "Order Submitted";


                    // Customer fields صاف
                    document.getElementById(
                        "customerName"
                    ).value = "";


                    document.getElementById(
                        "mobile"
                    ).value = "";


                    document.getElementById(
                        "address"
                    ).value = "";


                    document.getElementById(
                        "color"
                    ).value = "";


                    document.getElementById(
                        "size"
                    ).value = "";


                    document.getElementById(
                        "quantity"
                    ).value = 1;


                }
                else {

                    throw new Error(
                        "FormSubmit error"
                    );

                }


            }
            catch (err) {


                console.error(err);


                error.style.display =
                    "block";


                button.disabled =
                    false;


                button.textContent =
                    "ORDER CONFIRM کریں";

            }

        }
    );
