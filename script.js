/* =========================================================
   JANJUA TRADERS
   COMPLETE ORDER SYSTEM
   COLOR + SIZE
   FORMSUBMIT AJAX EMAIL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       SETTINGS
       ===================================================== */

    const ORDER_EMAIL = "thanksyou0339@gmail.com";

    const FORM_SUBMIT_URL =
        "https://formsubmit.co/ajax/" + ORDER_EMAIL;

    /*
       آپ کی GitHub repository میں موجود product image
       اگر HTML میں image source خالی ہو تو یہ استعمال ہوگی۔
    */
    const DEFAULT_PRODUCT_IMAGE =
        "file_00000000ee44820880d5993065f8c4c9.png";


    /* =====================================================
       BASIC FUNCTIONS
       ===================================================== */

    function byId(id) {
        return document.getElementById(id);
    }


    function clean(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/\s+/g, " ")
            .trim();
    }


    function valueOf(id) {

        const element = byId(id);

        if (!element) {
            return "";
        }

        return clean(element.value);
    }


    function textOf(id) {

        const element = byId(id);

        if (!element) {
            return "";
        }

        return clean(element.textContent);
    }


    function numberFromText(value) {

        const number =
            clean(value).replace(/[^0-9.]/g, "");

        return parseFloat(number) || 0;
    }


    function hiddenField(name, value) {

        let field =
            document.querySelector(
                '#orderForm input[type="hidden"][name="' +
                name +
                '"]'
            );

        if (!field) {

            field =
                document.createElement("input");

            field.type = "hidden";
            field.name = name;

            const form = byId("orderForm");

            if (form) {
                form.appendChild(field);
            }
        }

        if (field) {
            field.value = clean(value);
        }

        return field;
    }


    /* =====================================================
       FIND FORM
       ===================================================== */

    const form = byId("orderForm");

    if (!form) {

        console.error(
            "Janjua Traders: Order form not found."
        );

        return;
    }


    /* =====================================================
       FORMSUBMIT CONFIGURATION
       ===================================================== */

    form.action = FORM_SUBMIT_URL;
    form.method = "POST";


    hiddenField(
        "_subject",
        "New Janjua Traders Order"
    );

    hiddenField(
        "_template",
        "table"
    );

    hiddenField(
        "_captcha",
        "false"
    );

    hiddenField(
        "_ajax",
        "true"
    );


    /* =====================================================
       REMOVE ADDITIONAL MESSAGE
       ===================================================== */

    const additionalMessage =
        byId("message");

    if (additionalMessage) {

        const parentLabel =
            additionalMessage.closest("label");

        if (parentLabel) {
            parentLabel.remove();
        } else {
            additionalMessage.remove();
        }
    }


    /*
       اگر Additional_Message نام کا hidden field
       کہیں موجود ہو تو اسے بھی ختم کریں۔
    */

    const additionalFields =
        form.querySelectorAll(
            '[name="Additional_Message"]'
        );

    additionalFields.forEach(function (field) {
        field.remove();
    });


    /* =====================================================
       COLOR + SIZE
       ===================================================== */

    let colorInput =
        byId("color");

    let sizeInput =
        byId("size");


    /*
       اگر موجودہ HTML میں Color/Size مل جائیں
       تو انہیں ہی استعمال کریں۔
    */


    /* =====================================================
       PRODUCT IMAGE
       ===================================================== */

    const productImage =
        byId("productImage");

    const noImage =
        byId("noImage");


    if (productImage) {

        /*
           اگر HTML میں image source خالی ہے
           تو repository والی image لگائیں۔
        */

        if (
            !clean(productImage.getAttribute("src"))
        ) {

            productImage.src =
                DEFAULT_PRODUCT_IMAGE;
        }


        productImage.onload =
            function () {

                productImage.style.display =
                    "block";

                if (noImage) {
                    noImage.style.display =
                        "none";
                }
            };


        productImage.onerror =
            function () {

                /*
                   Image نہ ملے تو broken image
                   icon کے بجائے صاف message دکھائیں۔
                */

                productImage.style.display =
                    "none";

                if (noImage) {

                    noImage.style.display =
                        "block";

                    noImage.textContent =
                        "Product Image";
                }
            };
    }


    /* =====================================================
       PRODUCT INFORMATION
       ===================================================== */

    function getProductName() {

        const element =
            byId("productTitle");

        if (!element) {
            return "";
        }

        return clean(
            element.value ||
            element.textContent
        );
    }


    function getProductDescription() {

        const element =
            byId("productDescription");

        if (!element) {
            return "";
        }

        return clean(
            element.value ||
            element.textContent
        );
    }


    function getProductPrice() {

        const element =
            byId("productPrice");

        if (!element) {
            return 0;
        }

        return numberFromText(
            element.value ||
            element.textContent
        );
    }


    function getDeliveryCharges() {

        const element =
            byId("deliveryPrice");

        if (!element) {
            return 0;
        }

        return numberFromText(
            element.value ||
            element.textContent
        );
    }


    /* =====================================================
       PLATFORM
       ===================================================== */

    function getPlatform() {

        const platform =
            byId("platform");

        if (platform) {

            return clean(
                platform.value ||
                platform.textContent
            );
        }

        return "Markaz";
    }


    /* =====================================================
       PRODUCT LINK
       ===================================================== */

    function getProductLink() {

        const field =
            form.querySelector(
                '[name="Product_Link"]'
            );

        if (
            field &&
            clean(field.value)
        ) {

            return clean(field.value);
        }

        return window.location.href;
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function getQuantity() {

        const quantity =
            byId("quantity");

        if (!quantity) {
            return 1;
        }

        let number =
            parseInt(
                quantity.value,
                10
            );

        if (
            isNaN(number) ||
            number < 1
        ) {
            number = 1;
        }

        quantity.value = number;

        return number;
    }


    /* =====================================================
       TOTAL
       ===================================================== */

    function calculateTotal() {

        const price =
            getProductPrice();

        const delivery =
            getDeliveryCharges();

        const quantity =
            getQuantity();

        /*
           Product price × quantity
           پھر delivery charges
        */

        const total =
            (price * quantity) +
            delivery;


        /* HTML میں total update */

        const totalElement =
            byId("totalPrice");

        if (totalElement) {

            totalElement.textContent =
                "Rs. " +
                total.toLocaleString(
                    "en-PK"
                );
        }


        /* Email field */

        hiddenField(
            "Total_Amount",
            "Rs. " +
            total.toLocaleString(
                "en-PK"
            )
        );


        return total;
    }


    /* =====================================================
       PREPARE ORDER DATA
       ===================================================== */

    function prepareOrder() {

        const customerName =
            valueOf("customerName");

        const customerPhone =
            valueOf("customerPhone");

        const deliveryAddress =
            valueOf("address");

        const quantity =
            getQuantity();

        const color =
            colorInput
                ? clean(colorInput.value)
                : "";

        const size =
            sizeInput
                ? clean(sizeInput.value)
                : "";


        /* =================================================
           ORDER ID
           ================================================= */

        let orderId =
            clean(
                customerPhone
            );

        if (!orderId) {

            orderId =
                "JT-" +
                Date.now();
        }


        hiddenField(
            "Order_ID",
            orderId
        );


        /* =================================================
           CUSTOMER
           ================================================= */

        hiddenField(
            "Customer_Name",
            customerName
        );


        hiddenField(
            "Mobile_WhatsApp",
            customerPhone
        );


        hiddenField(
            "Delivery_Address",
            deliveryAddress
        );


        /* =================================================
           PLATFORM
           ================================================= */

        hiddenField(
            "Platform",
            getPlatform()
        );


        /* =================================================
           PRODUCT
           ================================================= */

        hiddenField(
            "Product",
            getProductName()
        );


        hiddenField(
            "Product_Description",
            getProductDescription()
        );


        /* =================================================
           COLOR
           ================================================= */

        hiddenField(
            "Color",
            color || "Not Required"
        );


        /* =================================================
           SIZE
           ================================================= */

        hiddenField(
            "Size",
            size || "Not Required"
        );


        /* =================================================
           QUANTITY
           ================================================= */

        hiddenField(
            "Quantity",
            quantity
        );


        /* =================================================
           PRICE
           ================================================= */

        hiddenField(
            "Product_Price",
            "Rs. " +
            getProductPrice().toLocaleString(
                "en-PK"
            )
        );


        hiddenField(
            "Delivery_Charges",
            "Rs. " +
            getDeliveryCharges().toLocaleString(
                "en-PK"
            )
        );


        /* =================================================
           TOTAL
           ================================================= */

        calculateTotal();


        /* =================================================
           PRODUCT LINK
           ================================================= */

        hiddenField(
            "Product_Link",
            getProductLink()
        );
    }


    /* =====================================================
       SUCCESS / ERROR MESSAGE
       ===================================================== */

    let result =
        byId("result");


    if (!result) {

        result =
            document.createElement("div");

        result.id = "result";
        result.className = "result";
        result.setAttribute(
            "role",
            "status"
        );

        result.setAttribute(
            "aria-live",
            "polite"
        );

        form.appendChild(result);
    }


    function showSuccess(message) {

        result.className =
            "result success";

        result.textContent =
            message;

        result.style.display =
            "block";
    }


    function showError(message) {

        result.className =
            "result error";

        result.textContent =
            message;

        result.style.display =
            "block";
    }


    function clearResult() {

        result.className =
            "result";

        result.textContent = "";

        result.style.display =
            "none";
    }


    /* =====================================================
       SUBMIT BUTTON
       ===================================================== */

    const submitButton =
        byId("submitButton");


    /* =====================================================
       QUANTITY LIVE UPDATE
       ===================================================== */

    const quantity =
        byId("quantity");

    if (quantity) {

        quantity.addEventListener(
            "input",
            function () {

                calculateTotal();
            }
        );
    }


    /* =====================================================
       COLOR LIVE UPDATE
       ===================================================== */

    if (colorInput) {

        colorInput.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Color",
                    clean(colorInput.value) ||
                    "Not Required"
                );
            }
        );
    }


    /* =====================================================
       SIZE LIVE UPDATE
       ===================================================== */

    if (sizeInput) {

        sizeInput.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Size",
                    clean(sizeInput.value) ||
                    "Not Required"
                );
            }
        );
    }


    /* =====================================================
       PHONE LIVE UPDATE
       ===================================================== */

    const phone =
        byId("customerPhone");

    if (phone) {

        phone.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Mobile_WhatsApp",
                    phone.value
                );

                hiddenField(
                    "Order_ID",
                    clean(phone.value) ||
                    "JT-" + Date.now()
                );
            }
        );
    }


    /* =====================================================
       FINAL AJAX SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            /*
               Browser کا normal FormSubmit redirect
               روک دیا گیا ہے۔
            */

            event.preventDefault();

            clearResult();


            /* ---------------------------------------------
               Browser validation
               --------------------------------------------- */

            if (!form.checkValidity()) {

                form.reportValidity();

                showError(
                    "براہِ کرم تمام ضروری معلومات مکمل کریں۔"
                );

                return;
            }


            /* ---------------------------------------------
               Prepare all data
               --------------------------------------------- */

            prepareOrder();


            /* ---------------------------------------------
               Button loading
               --------------------------------------------- */

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.dataset.originalText =
                    submitButton.textContent;

                submitButton.textContent =
                    "Order Submit ہو رہا ہے...";
            }


            try {

                /* -----------------------------------------
                   Send to FormSubmit
                   ----------------------------------------- */

                const formData =
                    new FormData(form);


                const response =
                    await fetch(
                        FORM_SUBMIT_URL,
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                let data = null;


                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    data = null;
                }


                /* -----------------------------------------
                   SUCCESS
                   ----------------------------------------- */

                if (
                    response.ok &&
                    (
                        !data ||
                        data.success !== false
                    )
                ) {

                    showSuccess(
                        "✅ آپ کا Order کامیابی سے Submit ہو گیا ہے۔ ہماری ٹیم آپ سے جلد رابطہ کرے گی۔"
                    );


                    /*
                       Customer fields clear کریں،
                       مگر product information برقرار رہے۔
                    */

                    const name =
                        byId("customerName");

                    const customerPhone =
                        byId("customerPhone");

                    const address =
                        byId("address");

                    if (name) {
                        name.value = "";
                    }

                    if (customerPhone) {
                        customerPhone.value = "";
                    }

                    if (address) {
                        address.value = "";
                    }

                    if (colorInput) {
                        colorInput.value = "";
                    }

                    if (sizeInput) {
                        sizeInput.value = "";
                    }

                    if (quantity) {
                        quantity.value = 1;
                    }


                    calculateTotal();


                    /*
                       سبز message کو کچھ دیر screen پر رکھیں۔
                    */

                    window.scrollTo({
                        top:
                            result.getBoundingClientRect().top +
                            window.scrollY -
                            120,
                        behavior: "smooth"
                    });


                } else {

                    throw new Error(
                        (
                            data &&
                            data.message
                        ) ||
                        "FormSubmit نے order قبول نہیں کیا۔"
                    );
                }


            } catch (error) {

                console.error(
                    "Order submission error:",
                    error
                );


                showError(
                    "❌ Order Submit نہیں ہو سکا۔ براہِ کرم Internet connection چیک کرکے دوبارہ کوشش کریں۔"
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        submitButton.dataset.originalText ||
                        "Order Final Submit کریں";
                }
            }

        }
    );


    /* =====================================================
       INITIAL SETUP
       ===================================================== */

    prepareOrder();

    calculateTotal();


    console.log(
        "Janjua Traders Order System Loaded Successfully."
    );

});
