/* =========================================================
   JANJUA TRADERS
   COMPLETE FINAL SCRIPT.JS

   FEATURES:
   - Correct Product Price
   - Correct Delivery Charges
   - Correct Total
   - Customer Name
   - Phone / WhatsApp
   - Address
   - Platform
   - Product
   - Quantity
   - Color
   - Size
   - Product Link
   - FormSubmit AJAX
   - Gmail Order Submission
   - Green Success Message
   - No duplicate Color / Size fields
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Janjua Traders: orderForm not found.");
        return;
    }


    /* =====================================================
       FIXED CURRENT PRODUCT PRICE
       ===================================================== */

    const PRODUCT_PRICE = 42999;
    const DELIVERY_CHARGES = 250;


    /* =====================================================
       HELPERS
       ===================================================== */

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


    function get(id) {

        return document.getElementById(id);
    }


    function getValue(id) {

        const element = get(id);

        if (!element) {
            return "";
        }

        return clean(element.value);
    }


    function setHidden(name, value) {

        let field = form.querySelector(
            'input[type="hidden"][name="' +
            name +
            '"]'
        );

        if (!field) {

            field = document.createElement("input");

            field.type = "hidden";
            field.name = name;

            form.appendChild(field);
        }

        field.value = clean(value);
    }


    function rupees(number) {

        return "Rs. " +
            Number(number).toLocaleString(
                "en-PK",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            );
    }


    /* =====================================================
       PRODUCT
       ===================================================== */

    function productName() {

        const element =
            get("productTitle");

        if (!element) {
            return "Product";
        }

        return clean(
            element.textContent
        ) || "Product";
    }


    function productDescription() {

        const element =
            get("productDescription");

        if (!element) {
            return "";
        }

        return clean(
            element.textContent
        );
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function quantity() {

        const element =
            get("quantity");

        if (!element) {
            return 1;
        }

        const number =
            parseInt(
                element.value,
                10
            );

        if (
            isNaN(number) ||
            number < 1
        ) {
            return 1;
        }

        return number;
    }


    /* =====================================================
       TOTAL
       ===================================================== */

    function calculateTotal() {

        const qty =
            quantity();

        const productTotal =
            PRODUCT_PRICE * qty;

        const total =
            productTotal +
            DELIVERY_CHARGES;


        /* SCREEN */

        const productPriceElement =
            get("productPrice");

        if (productPriceElement) {

            productPriceElement.textContent =
                rupees(PRODUCT_PRICE);
        }


        const deliveryElement =
            get("deliveryPrice");

        if (deliveryElement) {

            deliveryElement.textContent =
                rupees(DELIVERY_CHARGES);
        }


        const totalElement =
            get("totalPrice");

        if (totalElement) {

            totalElement.textContent =
                rupees(total);
        }


        /* EMAIL DATA */

        setHidden(
            "Product_Price",
            rupees(PRODUCT_PRICE)
        );


        setHidden(
            "Delivery_Charges",
            rupees(DELIVERY_CHARGES)
        );


        setHidden(
            "Total_Amount",
            rupees(total)
        );


        return total;
    }


    /* =====================================================
       PLATFORM
       ===================================================== */

    function platform() {

        const element =
            get("platform");

        if (!element) {
            return "Markaz";
        }

        return clean(
            element.value
        ) || "Markaz";
    }


    /* =====================================================
       PRODUCT LINK
       ===================================================== */

    function productLink() {

        const hidden =
            form.querySelector(
                'input[name="Product_Link"]'
            );

        if (
            hidden &&
            clean(hidden.value)
        ) {
            return clean(hidden.value);
        }

        return window.location.href;
    }


    /* =====================================================
       PREPARE ALL ORDER DATA
       ===================================================== */

    function prepareOrder() {

        const name =
            getValue("customerName");

        const phone =
            getValue("customerPhone");

        const address =
            getValue("address");

        const color =
            getValue("color");

        const size =
            getValue("size");

        const qty =
            quantity();


        /* CUSTOMER */

        setHidden(
            "Order_ID",
            phone ||
            "New Order"
        );


        setHidden(
            "Customer_Name",
            name
        );


        setHidden(
            "Mobile_WhatsApp",
            phone
        );


        setHidden(
            "Delivery_Address",
            address
        );


        /* PLATFORM */

        setHidden(
            "Platform",
            platform()
        );


        /* PRODUCT */

        setHidden(
            "Product",
            productName()
        );


        setHidden(
            "Product_Description",
            productDescription()
        );


        /* COLOR */

        setHidden(
            "Color",
            color ||
            "Not Required"
        );


        /* SIZE */

        setHidden(
            "Size",
            size ||
            "Not Required"
        );


        /* QUANTITY */

        setHidden(
            "Quantity",
            qty
        );


        /* PRICE */

        calculateTotal();


        /* PRODUCT LINK */

        setHidden(
            "Product_Link",
            productLink()
        );


        /* REMOVE OLD ADDITIONAL MESSAGE */

        const oldMessage =
            form.querySelector(
                '[name="Additional_Message"]'
            );

        if (oldMessage) {
            oldMessage.remove();
        }
    }


    /* =====================================================
       SUCCESS / ERROR MESSAGE
       ===================================================== */

    function showResult(message, success) {

        const result =
            get("result");

        if (!result) {
            return;
        }

        result.textContent =
            message;

        result.className =
            success
                ? "result success"
                : "result error";

        result.style.display =
            "block";
    }


    /* =====================================================
       BUTTON
       ===================================================== */

    const submitButton =
        get("submitButton");


    /* =====================================================
       QUANTITY LIVE
       ===================================================== */

    const quantityField =
        get("quantity");

    if (quantityField) {

        quantityField.addEventListener(
            "input",
            function () {

                calculateTotal();

                setHidden(
                    "Quantity",
                    quantity()
                );
            }
        );


        quantityField.addEventListener(
            "change",
            function () {

                calculateTotal();

                setHidden(
                    "Quantity",
                    quantity()
                );
            }
        );
    }


    /* =====================================================
       COLOR LIVE
       ===================================================== */

    const colorField =
        get("color");

    if (colorField) {

        colorField.addEventListener(
            "input",
            function () {

                setHidden(
                    "Color",
                    clean(
                        colorField.value
                    ) ||
                    "Not Required"
                );
            }
        );
    }


    /* =====================================================
       SIZE LIVE
       ===================================================== */

    const sizeField =
        get("size");

    if (sizeField) {

        sizeField.addEventListener(
            "input",
            function () {

                setHidden(
                    "Size",
                    clean(
                        sizeField.value
                    ) ||
                    "Not Required"
                );
            }
        );
    }


    /* =====================================================
       PHONE LIVE
       ===================================================== */

    const phoneField =
        get("customerPhone");

    if (phoneField) {

        phoneField.addEventListener(
            "input",
            function () {

                const phone =
                    clean(
                        phoneField.value
                    );


                setHidden(
                    "Order_ID",
                    phone ||
                    "New Order"
                );


                setHidden(
                    "Mobile_WhatsApp",
                    phone
                );
            }
        );
    }


    /* =====================================================
       AJAX FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            /*
             * Browser کا normal FormSubmit redirect
             * روک دیا گیا ہے۔
             */

            event.preventDefault();


            /* Browser validation */

            if (
                !form.checkValidity()
            ) {

                form.reportValidity();

                return;
            }


            /* Prepare everything */

            prepareOrder();


            /* Button */

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Order Submit ہو رہا ہے...";
            }


            /* Result */

            showResult(
                "Order submit ہو رہا ہے، براہِ کرم انتظار کریں...",
                true
            );


            try {

                /*
                 * FormSubmit AJAX endpoint
                 */

                const response =
                    await fetch(
                        "https://formsubmit.co/ajax/thanksyou0339@gmail.com",
                        {
                            method: "POST",

                            headers: {
                                "Accept":
                                    "application/json",

                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body:
                                new URLSearchParams(
                                    new FormData(form)
                                ).toString()
                        }
                    );


                let data = null;


                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    data = null;
                }


                /* =================================================
                   SUCCESS
                   ================================================= */

                if (
                    response.ok &&
                    (
                        !data ||
                        data.success === true ||
                        data.success === "true"
                    )
                ) {

                    showResult(
                        "✓ Order کامیابی سے Submit ہو گیا ہے۔ Gmail پر Order بھیج دیا گیا ہے۔",
                        true
                    );


                    /*
                     * Form reset
                     * Product information کو چھیڑا نہیں جائے گا۔
                     */

                    const customerName =
                        get("customerName");

                    const customerPhone =
                        get("customerPhone");

                    const address =
                        get("address");

                    const color =
                        get("color");

                    const size =
                        get("size");


                    if (customerName)
                        customerName.value = "";


                    if (customerPhone)
                        customerPhone.value = "";


                    if (address)
                        address.value = "";


                    if (color)
                        color.value = "";


                    if (size)
                        size.value = "";


                    if (quantityField)
                        quantityField.value = "1";


                    prepareOrder();

                } else {

                    throw new Error(
                        "FormSubmit did not accept the order."
                    );
                }


            } catch (error) {

                console.error(
                    "FormSubmit Error:",
                    error
                );


                showResult(
                    "Order Submit نہیں ہو سکا۔ Internet connection اور FormSubmit activation چیک کریں۔",
                    false
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
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
        "Janjua Traders: Final script loaded."
    );

    console.log(
        "Product Price:",
        PRODUCT_PRICE
    );

    console.log(
        "Delivery Charges:",
        DELIVERY_CHARGES
    );

});
