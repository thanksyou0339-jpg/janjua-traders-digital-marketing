/* =========================================================
   JANJUA TRADERS - scrapt.js
   COMPLETE ORDER SUBMISSION SYSTEM

   Google Apps Script  : NO
   Google Sheet        : NO
   Separate Tracking ID: NO

   Customer Mobile Number = Order ID

   Orders Email:
   thanksyou0339@gmail.com

   First submission:
   FormSubmit may send a confirmation/activation email.
   Activate it once, then future orders will be delivered.
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       MAIN SETTINGS
       ===================================================== */

    const ORDER_EMAIL = "thanksyou0339@gmail.com";

    const FORM_ENDPOINT =
        "https://formsubmit.co/ajax/" +
        encodeURIComponent(ORDER_EMAIL);


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }

    function getValue(id, defaultValue) {
        const element = getElement(id);

        if (!element) {
            return defaultValue || "";
        }

        return String(element.value || "").trim();
    }

    function setValue(id, value) {
        const element = getElement(id);

        if (element) {
            element.value = value || "";
        }
    }

    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent = value || "";
        }
    }

    function formatMoney(value) {
        const number = Number(value || 0);

        return number.toLocaleString("en-PK");
    }


    /* =====================================================
       PRODUCT DATA FROM PRODUCT LINK
       Example:

       ?product=Mobile&price=25000&delivery=250
       ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    function getParameter(names, fallback) {

        for (const name of names) {

            const value =
                urlParams.get(name);

            if (
                value !== null &&
                value !== ""
            ) {
                try {
                    return decodeURIComponent(value);
                } catch (error) {
                    return value;
                }
            }
        }

        return fallback || "";
    }


    /* =====================================================
       PRODUCT INFORMATION
       ===================================================== */

    const product = {

        title:
            getParameter(
                ["product", "title", "productName"],
                ""
            ),

        description:
            getParameter(
                ["description", "desc"],
                ""
            ),

        price:
            Number(
                getParameter(
                    ["price", "productPrice"],
                    "0"
                )
            ) || 0,

        delivery:
            Number(
                getParameter(
                    ["delivery", "deliveryPrice"],
                    "0"
                )
            ) || 0,

        image:
            getParameter(
                ["image", "productImage"],
                ""
            ),

        platform:
            getParameter(
                ["platform", "source"],
                "Markaz"
            )
    };


    /* =====================================================
       LOAD PRODUCT ON PAGE
       ===================================================== */

    function loadProduct() {

        if (product.title) {

            setText(
                "productTitle",
                product.title
            );
        }


        if (product.description) {

            setText(
                "productDescription",
                product.description
            );
        }


        if (product.price > 0) {

            setText(
                "productPrice",
                "Rs. " +
                formatMoney(product.price)
            );
        }


        if (product.delivery > 0) {

            setText(
                "deliveryPrice",
                "Rs. " +
                formatMoney(product.delivery)
            );
        }


        const platform =
            getElement("platform");

        if (platform) {

            if (
                platform.tagName === "INPUT" ||
                platform.tagName === "SELECT"
            ) {
                platform.value =
                    product.platform;
            }
        }


        const platformBadge =
            document.querySelector(
                ".platform-badge"
            );

        if (platformBadge) {

            platformBadge.textContent =
                product.platform;
        }


        /* Product Image */

        const image =
            getElement("productImage");

        const noImage =
            getElement("noImage");

        if (
            image &&
            product.image
        ) {

            image.src =
                product.image;

            image.style.display =
                "block";

            if (noImage) {
                noImage.style.display =
                    "none";
            }

            image.onerror =
                function () {

                    image.style.display =
                        "none";

                    if (noImage) {

                        noImage.style.display =
                            "flex";
                    }
                };
        }


        /* Current Product Link */

        const productLink =
            getElement("productLink");

        if (productLink) {

            productLink.value =
                window.location.href;
        }


        updateTotal();
    }


    /* =====================================================
       TOTAL PRICE
       ===================================================== */

    function updateTotal() {

        const quantity =
            Math.max(
                1,
                Number(
                    getValue(
                        "quantity",
                        "1"
                    )
                ) || 1
            );

        const total =
            (
                product.price *
                quantity
            ) +
            product.delivery;


        setText(
            "totalPrice",
            "Rs. " +
            formatMoney(total)
        );


        setText(
            "payablePrice",
            "Rs. " +
            formatMoney(total)
        );


        return total;
    }


    /* =====================================================
       PAKISTAN MOBILE NUMBER
       ===================================================== */

    function cleanPhone(phone) {

        return String(phone || "")
            .replace(/[\s\-]/g, "");
    }


    function validPakistanMobile(phone) {

        const clean =
            cleanPhone(phone);

        return /^03\d{9}$/.test(clean);
    }


    /* =====================================================
       SHOW RESULT MESSAGE
       ===================================================== */

    function showResult(
        message,
        success
    ) {

        const result =
            getElement("result");


        if (!result) {

            alert(message);

            return;
        }


        result.classList.remove(
            "hidden"
        );


        result.style.display =
            "block";

        result.style.padding =
            "14px";

        result.style.marginTop =
            "14px";

        result.style.borderRadius =
            "10px";

        result.style.lineHeight =
            "1.8";

        result.style.background =
            success
                ? "#e8f7ed"
                : "#fff0f0";

        result.style.color =
            success
                ? "#126b2f"
                : "#a00000";

        result.textContent =
            message;
    }


    /* =====================================================
       SUBMIT ORDER
       ===================================================== */

    async function submitOrder(event) {

        event.preventDefault();


        const form =
            event.currentTarget;


        /* Customer Information */

        const customerName =
            getValue(
                "customerName"
            );


        const customerPhone =
            cleanPhone(
                getValue(
                    "customerPhone"
                )
            );


        const address =
            getValue(
                "address"
            );


        const quantity =
            Math.max(
                1,
                Number(
                    getValue(
                        "quantity",
                        "1"
                    )
                ) || 1
            );


        const message =
            getValue(
                "message"
            );


        /* =================================================
           VALIDATION
           ================================================= */

        if (!customerName) {

            showResult(
                "براہِ کرم Customer Name لکھیں۔",
                false
            );

            return;
        }


        if (
            !validPakistanMobile(
                customerPhone
            )
        ) {

            showResult(
                "براہِ کرم درست پاکستانی موبائل نمبر لکھیں، مثال: 03001234567",
                false
            );

            return;
        }


        if (!address) {

            showResult(
                "براہِ کرم مکمل Delivery Address لکھیں۔",
                false
            );

            return;
        }


        /* =================================================
           MOBILE NUMBER = ORDER ID
           ================================================= */

        const orderId =
            customerPhone;


        const total =
            (
                product.price *
                quantity
            ) +
            product.delivery;


        /* =================================================
           SUBMIT BUTTON
           ================================================= */

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        const oldButtonText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Order بھیجا جا رہا ہے...";
        }


        /* =================================================
           FORM DATA
           ================================================= */

        const formData =
            new FormData();


        formData.append(
            "_subject",
            "Janjua Traders New Order - " +
            orderId
        );


        formData.append(
            "_template",
            "table"
        );


        formData.append(
            "_captcha",
            "false"
        );


        /* Customer */

        formData.append(
            "Order ID",
            orderId
        );


        formData.append(
            "Customer Name",
            customerName
        );


        formData.append(
            "Mobile / WhatsApp",
            customerPhone
        );


        formData.append(
            "Delivery Address",
            address
        );


        /* Product */

        formData.append(
            "Platform",
            product.platform
        );


        formData.append(
            "Product",
            product.title ||
            getValue(
                "productTitle",
                "Product"
            )
        );


        formData.append(
            "Product Description",
            product.description ||
            getValue(
                "productDescription",
                ""
            )
        );


        formData.append(
            "Quantity",
            String(quantity)
        );


        formData.append(
            "Product Price",
            "Rs. " +
            formatMoney(
                product.price
            )
        );


        formData.append(
            "Delivery Charges",
            "Rs. " +
            formatMoney(
                product.delivery
            )
        );


        formData.append(
            "Total Amount",
            "Rs. " +
            formatMoney(
                total
            )
        );


        formData.append(
            "Additional Message",
            message ||
            "None"
        );


        /* Product URL */

        formData.append(
            "Product Link",
            window.location.href
        );


        /* =================================================
           SEND TO GMAIL THROUGH FORMSUBMIT
           ================================================= */

        try {

            const response =
                await fetch(
                    FORM_ENDPOINT,
                    {
                        method: "POST",

                        body:
                            formData,

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Form submission failed"
                );
            }


            /* =================================================
               SUCCESS
               ================================================= */

            showResult(

                "آپ کا Order کامیابی سے Submit ہو گیا ہے۔ " +
                "آپ کا موبائل نمبر ہی Order ID ہے: " +
                orderId,

                true
            );


            /* Clear customer fields */

            setValue(
                "customerName",
                ""
            );

            setValue(
                "customerPhone",
                ""
            );

            setValue(
                "address",
                ""
            );

            setValue(
                "quantity",
                "1"
            );

            setValue(
                "message",
                ""
            );


            updateTotal();


        } catch (error) {

            console.error(
                "Janjua Traders Order Error:",
                error
            );


            showResult(

                "Order ابھی Submit نہیں ہو سکا۔ " +
                "Internet چیک کرکے دوبارہ کوشش کریں۔",

                false
            );


        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    oldButtonText ||
                    "Order Final Submit کریں";
            }
        }
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadProduct();


            /* Quantity change */

            const quantity =
                getElement(
                    "quantity"
                );


            if (quantity) {

                quantity.addEventListener(
                    "input",
                    updateTotal
                );


                quantity.addEventListener(
                    "change",
                    updateTotal
                );
            }


            /* =================================================
               ORDER FORM
               ================================================= */

            const orderForm =
                getElement(
                    "orderForm"
                ) ||
                document.querySelector(
                    "form"
                );


            if (orderForm) {

                orderForm.addEventListener(
                    "submit",
                    submitOrder
                );

            } else {

                console.warn(
                    "Janjua Traders: Order form not found."
                );
            }

        }
    );

})();
