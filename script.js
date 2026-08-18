/* =========================================================
   JANJUA TRADERS
   FINAL COMPLETE ORDER SCRIPT

   FEATURES:
   - Customer information
   - Product information
   - Color
   - Size
   - Quantity
   - Product price
   - Delivery charges
   - Automatic total
   - Gmail / FormSubmit
   - No duplicate Color / Size fields
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Order form not found.");
        return;
    }


    /* =====================================================
       PRODUCT PRICE SETTINGS
       =====================================================

       اس وقت موجودہ Product کی قیمت:
       42,999 روپے

       Delivery:
       250 روپے

       بعد میں Product بدلنے پر صرف یہی دو values
       تبدیل کی جا سکتی ہیں۔
       ===================================================== */

    const PRODUCT_PRICE = 42999;
    const DELIVERY_CHARGES = 250;


    /* =====================================================
       BASIC HELPERS
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


    /* =====================================================
       HIDDEN FORM FIELD
       ===================================================== */

    function setHidden(name, value) {

        let field = form.querySelector(
            'input[type="hidden"][name="' +
            name +
            '"]'
        );

        if (!field) {

            field =
                document.createElement("input");

            field.type = "hidden";
            field.name = name;

            form.appendChild(field);
        }

        field.value = clean(value);
    }


    /* =====================================================
       PRODUCT NAME
       ===================================================== */

    function getProductName() {

        const element =
            get("productTitle");

        if (!element) {
            return "Product";
        }

        return clean(
            element.value ||
            element.textContent
        ) || "Product";
    }


    /* =====================================================
       PRODUCT DESCRIPTION
       ===================================================== */

    function getProductDescription() {

        const element =
            get("productDescription");

        if (!element) {
            return "";
        }

        return clean(
            element.value ||
            element.textContent
        );
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function getQuantity() {

        const element =
            get("quantity");

        if (!element) {
            return 1;
        }

        const quantity =
            parseInt(
                element.value,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < 1
        ) {
            return 1;
        }

        return quantity;
    }


    /* =====================================================
       TOTAL CALCULATION
       ===================================================== */

    function calculateTotal() {

        const quantity =
            getQuantity();

        const productTotal =
            PRODUCT_PRICE *
            quantity;

        const total =
            productTotal +
            DELIVERY_CHARGES;


        /* -------------------------------------------------
           UPDATE PAGE DISPLAY
           ------------------------------------------------- */

        const priceDisplay =
            get("productPrice");

        if (priceDisplay) {

            priceDisplay.textContent =
                "Rs. " +
                PRODUCT_PRICE.toLocaleString(
                    "en-PK"
                );
        }


        const deliveryDisplay =
            get("deliveryPrice");

        if (deliveryDisplay) {

            deliveryDisplay.textContent =
                "Rs. " +
                DELIVERY_CHARGES.toLocaleString(
                    "en-PK"
                );
        }


        const totalDisplay =
            get("totalPrice");

        if (totalDisplay) {

            totalDisplay.textContent =
                "Rs. " +
                total.toLocaleString(
                    "en-PK"
                );
        }


        /* -------------------------------------------------
           GMAIL DATA
           ------------------------------------------------- */

        setHidden(
            "Product_Price",
            "Rs. " +
            PRODUCT_PRICE.toLocaleString(
                "en-PK"
            )
        );


        setHidden(
            "Delivery_Charges",
            "Rs. " +
            DELIVERY_CHARGES.toLocaleString(
                "en-PK"
            )
        );


        setHidden(
            "Total_Amount",
            "Rs. " +
            total.toLocaleString(
                "en-PK"
            )
        );


        return total;
    }


    /* =====================================================
       PLATFORM
       ===================================================== */

    function getPlatform() {

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

    function getProductLink() {

        const hiddenLink =
            form.querySelector(
                'input[name="Product_Link"]'
            );

        if (
            hiddenLink &&
            clean(hiddenLink.value)
        ) {
            return clean(
                hiddenLink.value
            );
        }

        return window.location.href;
    }


    /* =====================================================
       PREPARE COMPLETE ORDER
       ===================================================== */

    function prepareOrder() {

        const customerName =
            getValue(
                "customerName"
            );

        const customerPhone =
            getValue(
                "customerPhone"
            );

        const address =
            getValue(
                "address"
            );

        const color =
            getValue(
                "color"
            );

        const size =
            getValue(
                "size"
            );


        /* -------------------------------------------------
           ORDER ID
           ------------------------------------------------- */

        setHidden(
            "Order_ID",
            customerPhone ||
            "New Order"
        );


        /* -------------------------------------------------
           CUSTOMER
           ------------------------------------------------- */

        setHidden(
            "Customer_Name",
            customerName
        );


        setHidden(
            "Mobile_WhatsApp",
            customerPhone
        );


        setHidden(
            "Delivery_Address",
            address
        );


        /* -------------------------------------------------
           PLATFORM
           ------------------------------------------------- */

        setHidden(
            "Platform",
            getPlatform()
        );


        /* -------------------------------------------------
           PRODUCT
           ------------------------------------------------- */

        setHidden(
            "Product",
            getProductName()
        );


        setHidden(
            "Product_Description",
            getProductDescription()
        );


        /* -------------------------------------------------
           COLOR
           ------------------------------------------------- */

        setHidden(
            "Color",
            color ||
            "Not Required"
        );


        /* -------------------------------------------------
           SIZE
           ------------------------------------------------- */

        setHidden(
            "Size",
            size ||
            "Not Required"
        );


        /* -------------------------------------------------
           QUANTITY
           ------------------------------------------------- */

        setHidden(
            "Quantity",
            getQuantity()
        );


        /* -------------------------------------------------
           PRICE + DELIVERY + TOTAL
           ------------------------------------------------- */

        calculateTotal();


        /* -------------------------------------------------
           PRODUCT LINK
           ------------------------------------------------- */

        setHidden(
            "Product_Link",
            getProductLink()
        );


        /* -------------------------------------------------
           REMOVE OLD ADDITIONAL MESSAGE
           ------------------------------------------------- */

        const oldMessage =
            form.querySelector(
                '[name="Additional_Message"]'
            );

        if (oldMessage) {

            oldMessage.remove();
        }
    }


    /* =====================================================
       QUANTITY CHANGE
       ===================================================== */

    const quantityField =
        get("quantity");

    if (quantityField) {

        quantityField.addEventListener(
            "input",
            function () {

                calculateTotal();

            }
        );


        quantityField.addEventListener(
            "change",
            function () {

                calculateTotal();

            }
        );
    }


    /* =====================================================
       COLOR CHANGE
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
       SIZE CHANGE
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
       PHONE CHANGE
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
       FINAL SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        function () {

            /*
               Submit سے پہلے تمام data تیار ہوگا۔
               FormSubmit کو normally submit ہونے دیا جائے گا۔
            */

            prepareOrder();

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    prepareOrder();

    calculateTotal();

});
