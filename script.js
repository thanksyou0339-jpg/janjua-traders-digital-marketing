/* =========================================================
   JANJUA TRADERS
   FINAL SCRIPT.JS

   FIXES:
   - Correct Product Price
   - Correct Delivery Charges
   - Correct Total
   - Correct Gmail Order
   - Color
   - Size
   - Quantity
   - Customer Information
   - No duplicate Color / Size
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Janjua Traders: Order form not found.");
        return;
    }


    /* =====================================================
       CURRENT PRODUCT PRICE
       =====================================================

       موجودہ Product:

       Product Price = Rs. 42,999
       Delivery      = Rs. 250

       اگر Product کی قیمت بعد میں بدلے تو
       صرف PRODUCT_PRICE تبدیل کریں۔
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


    /* =====================================================
       CREATE / UPDATE HIDDEN FIELD
       ===================================================== */

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

        field.value = String(value);
    }


    /* =====================================================
       RUPEE FORMAT
       ===================================================== */

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
       PRODUCT NAME
       ===================================================== */

    function getProductName() {

        const element =
            get("productTitle");

        if (!element) {
            return "Product";
        }

        return clean(
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

        let quantity =
            parseInt(
                element.value,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < 1
        ) {
            quantity = 1;
        }

        return quantity;
    }


    /* =====================================================
       CALCULATE PRICE
       ===================================================== */

    function calculatePrice() {

        const quantity =
            getQuantity();


        /* Product total */

        const productTotal =
            PRODUCT_PRICE *
            quantity;


        /* Final total */

        const finalTotal =
            productTotal +
            DELIVERY_CHARGES;


        /* =================================================
           SHOW ON SCREEN
           ================================================= */

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
                rupees(finalTotal);
        }


        /* =================================================
           SEND TO GMAIL
           ================================================= */

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
            rupees(finalTotal)
        );


        return finalTotal;
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

        const element =
            form.querySelector(
                'input[name="Product_Link"]'
            );

        if (
            element &&
            clean(element.value)
        ) {
            return clean(element.value);
        }

        return window.location.href;
    }


    /* =====================================================
       PREPARE COMPLETE ORDER
       ===================================================== */

    function prepareOrder() {

        const name =
            getValue(
                "customerName"
            );


        const phone =
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


        /* =================================================
           CUSTOMER
           ================================================= */

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


        /* =================================================
           PLATFORM
           ================================================= */

        setHidden(
            "Platform",
            getPlatform()
        );


        /* =================================================
           PRODUCT
           ================================================= */

        setHidden(
            "Product",
            getProductName()
        );


        setHidden(
            "Product_Description",
            getProductDescription()
        );


        /* =================================================
           COLOR
           ================================================= */

        setHidden(
            "Color",
            color ||
            "Not Required"
        );


        /* =================================================
           SIZE
           ================================================= */

        setHidden(
            "Size",
            size ||
            "Not Required"
        );


        /* =================================================
           QUANTITY
           ================================================= */

        setHidden(
            "Quantity",
            getQuantity()
        );


        /* =================================================
           PRICE
           ================================================= */

        calculatePrice();


        /* =================================================
           PRODUCT LINK
           ================================================= */

        setHidden(
            "Product_Link",
            getProductLink()
        );


        /* =================================================
           REMOVE OLD ADDITIONAL MESSAGE
           ================================================= */

        const oldMessage =
            form.querySelector(
                '[name="Additional_Message"]'
            );

        if (oldMessage) {
            oldMessage.remove();
        }
    }


    /* =====================================================
       QUANTITY UPDATE
       ===================================================== */

    const quantityField =
        get("quantity");

    if (quantityField) {

        quantityField.addEventListener(
            "input",
            function () {

                calculatePrice();

                setHidden(
                    "Quantity",
                    getQuantity()
                );
            }
        );


        quantityField.addEventListener(
            "change",
            function () {

                calculatePrice();

                setHidden(
                    "Quantity",
                    getQuantity()
                );
            }
        );
    }


    /* =====================================================
       COLOR UPDATE
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
       SIZE UPDATE
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
       PHONE UPDATE
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
       FINAL FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        function () {

            /*
             * Submit سے بالکل پہلے
             * تمام معلومات دوبارہ تیار ہوں گی۔
             */

            prepareOrder();

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    prepareOrder();

    calculatePrice();


    console.log(
        "Janjua Traders Price System Ready"
    );

    console.log(
        "Product Price:",
        PRODUCT_PRICE
    );

    console.log(
        "Delivery:",
        DELIVERY_CHARGES
    );

    console.log(
        "Total:",
        PRODUCT_PRICE +
        DELIVERY_CHARGES
    );

});
