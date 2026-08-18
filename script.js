/* =========================================================
   JANJUA TRADERS
   FINAL ORDER SCRIPT
   - No duplicate Color / Size
   - Correct Product Price
   - Correct Delivery Charges
   - Correct Total
   - Complete Gmail/FormSubmit Order
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    /* =====================================================
       CURRENT PRODUCT PRICE
       ===================================================== */

    const CURRENT_PRODUCT_PRICE = 42999;
    const CURRENT_DELIVERY_CHARGES = 250;


    /* =====================================================
       HELPERS
       ===================================================== */

    function clean(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/\s+/g, " ")
            .trim();
    }


    function get(id) {
        return document.getElementById(id);
    }


    function value(id) {

        const el = get(id);

        if (!el) {
            return "";
        }

        return clean(el.value);
    }


    function setHidden(name, val) {

        let field = form.querySelector(
            'input[type="hidden"][name="' + name + '"]'
        );

        if (!field) {

            field = document.createElement("input");

            field.type = "hidden";
            field.name = name;

            form.appendChild(field);
        }

        field.value = clean(val);
    }


    /* =====================================================
       PRODUCT INFORMATION
       ===================================================== */

    function productName() {

        const el = get("productTitle");

        if (!el) {
            return "Product";
        }

        return clean(
            el.value || el.textContent
        ) || "Product";
    }


    function productDescription() {

        const el = get("productDescription");

        if (!el) {
            return "";
        }

        return clean(
            el.value || el.textContent
        );
    }


    /* =====================================================
       PRICE
       ===================================================== */

    function productPrice() {

        const el = get("productPrice");

        if (!el) {
            return CURRENT_PRODUCT_PRICE;
        }

        const raw = clean(
            el.value || el.textContent
        );

        const number = parseFloat(
            raw.replace(/[^0-9.]/g, "")
        );

        /*
           اگر HTML میں Rs. 0 ہے
           تو اصل موجودہ قیمت استعمال ہوگی۔
        */

        if (!number || number <= 0) {
            return CURRENT_PRODUCT_PRICE;
        }

        return number;
    }


    function deliveryPrice() {

        const el = get("deliveryPrice");

        if (!el) {
            return CURRENT_DELIVERY_CHARGES;
        }

        const raw = clean(
            el.value || el.textContent
        );

        const number = parseFloat(
            raw.replace(/[^0-9.]/g, "")
        );

        if (!number || number < 0) {
            return CURRENT_DELIVERY_CHARGES;
        }

        return number;
    }


    /* =====================================================
       UPDATE PRICE ON SCREEN
       ===================================================== */

    function updatePriceDisplay() {

        const price = productPrice();
        const delivery = deliveryPrice();
        const qty = quantity();

        const total =
            (price * qty) + delivery;


        const priceDisplay =
            get("productPrice");

        if (priceDisplay) {

            priceDisplay.textContent =
                "Rs. " + price.toLocaleString("en-PK");
        }


        const deliveryDisplay =
            get("deliveryPrice");

        if (deliveryDisplay) {

            deliveryDisplay.textContent =
                "Rs. " + delivery.toLocaleString("en-PK");
        }


        const totalDisplay =
            get("totalPrice");

        if (totalDisplay) {

            totalDisplay.textContent =
                "Rs. " + total.toLocaleString("en-PK");
        }

        return total;
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function quantity() {

        const el = get("quantity");

        if (!el) {
            return 1;
        }

        const q = parseInt(
            el.value,
            10
        );

        return q > 0 ? q : 1;
    }


    /* =====================================================
       TOTAL
       ===================================================== */

    function calculateTotal() {

        const price =
            productPrice();

        const delivery =
            deliveryPrice();

        const qty =
            quantity();

        const total =
            (price * qty) + delivery;


        setHidden(
            "Product_Price",
            "Rs. " +
            price.toLocaleString("en-PK")
        );


        setHidden(
            "Delivery_Charges",
            "Rs. " +
            delivery.toLocaleString("en-PK")
        );


        setHidden(
            "Total_Amount",
            "Rs. " +
            total.toLocaleString("en-PK")
        );


        updatePriceDisplay();

        return total;
    }


    /* =====================================================
       PLATFORM
       ===================================================== */

    function platform() {

        const el =
            get("platform");

        if (!el) {
            return "Markaz";
        }

        return clean(
            el.value
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

            return clean(
                hidden.value
            );
        }

        return window.location.href;
    }


    /* =====================================================
       PREPARE ORDER
       ===================================================== */

    function prepareOrder() {

        const customerName =
            value("customerName");

        const customerPhone =
            value("customerPhone");

        const address =
            value("address");

        const color =
            value("color");

        const size =
            value("size");


        /* CUSTOMER */

        setHidden(
            "Order_ID",
            customerPhone ||
            "New Order"
        );


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
            quantity()
        );


        /* PRICE + TOTAL */

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
       QUANTITY LIVE UPDATE
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
    }


    /* =====================================================
       COLOR
       ===================================================== */

    const colorField =
        get("color");

    if (colorField) {

        colorField.addEventListener(
            "input",
            function () {

                setHidden(
                    "Color",
                    clean(colorField.value) ||
                    "Not Required"
                );

            }
        );
    }


    /* =====================================================
       SIZE
       ===================================================== */

    const sizeField =
        get("size");

    if (sizeField) {

        sizeField.addEventListener(
            "input",
            function () {

                setHidden(
                    "Size",
                    clean(sizeField.value) ||
                    "Not Required"
                );

            }
        );
    }


    /* =====================================================
       PHONE
       ===================================================== */

    const phoneField =
        get("customerPhone");

    if (phoneField) {

        phoneField.addEventListener(
            "input",
            function () {

                setHidden(
                    "Order_ID",
                    clean(
                        phoneField.value
                    ) ||
                    "New Order"
                );


                setHidden(
                    "Mobile_WhatsApp",
                    clean(
                        phoneField.value
                    )
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

            prepareOrder();

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    prepareOrder();

    updatePriceDisplay();

});
