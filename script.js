/* =========================================================
   JANJUA TRADERS
   CLEAN ORDER SCRIPT
   - No duplicate Color / Size fields
   - Uses Color / Size already present in index.html
   - Prepares complete order for FormSubmit
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    /* =====================================================
       HELPERS
       ===================================================== */

    function clean(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value).replace(/\s+/g, " ").trim();
    }

    function get(id) {
        return document.getElementById(id);
    }

    function value(id) {
        const el = get(id);
        return el ? clean(el.value) : "";
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


    function numberFromElement(id) {

        const el = get(id);

        if (!el) {
            return 0;
        }

        const raw = clean(
            el.value || el.textContent
        );

        const number = parseFloat(
            raw.replace(/[^0-9.]/g, "")
        );

        return isNaN(number) ? 0 : number;
    }


    function productPrice() {
        return numberFromElement("productPrice");
    }


    function deliveryPrice() {
        return numberFromElement("deliveryPrice");
    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function quantity() {

        const el = get("quantity");

        if (!el) {
            return 1;
        }

        const q = parseInt(el.value, 10);

        return q > 0 ? q : 1;
    }


    /* =====================================================
       TOTAL
       ===================================================== */

    function calculateTotal() {

        const total =
            (productPrice() * quantity()) +
            deliveryPrice();

        setHidden(
            "Product_Price",
            "Rs. " + productPrice()
        );

        setHidden(
            "Delivery_Charges",
            "Rs. " + deliveryPrice()
        );

        setHidden(
            "Total_Amount",
            "Rs. " + total
        );

        const totalDisplay = get("totalPrice");

        if (totalDisplay) {
            totalDisplay.textContent =
                "Rs. " + total;
        }

        return total;
    }


    /* =====================================================
       PLATFORM
       ===================================================== */

    function platform() {

        const el = get("platform");

        if (!el) {
            return "Markaz";
        }

        return clean(el.value) || "Markaz";
    }


    /* =====================================================
       PRODUCT LINK
       ===================================================== */

    function productLink() {

        const hidden = form.querySelector(
            'input[name="Product_Link"]'
        );

        if (hidden && clean(hidden.value)) {
            return clean(hidden.value);
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

        /* -------------------------------------------------
           CUSTOMER
           ------------------------------------------------- */

        setHidden(
            "Order_ID",
            customerPhone || "New Order"
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

        /* -------------------------------------------------
           PLATFORM
           ------------------------------------------------- */

        setHidden(
            "Platform",
            platform()
        );

        /* -------------------------------------------------
           PRODUCT
           ------------------------------------------------- */

        setHidden(
            "Product",
            productName()
        );

        setHidden(
            "Product_Description",
            productDescription()
        );

        /* -------------------------------------------------
           COLOR
           ------------------------------------------------- */

        setHidden(
            "Color",
            color || "Not Required"
        );

        /* -------------------------------------------------
           SIZE
           ------------------------------------------------- */

        setHidden(
            "Size",
            size || "Not Required"
        );

        /* -------------------------------------------------
           QUANTITY
           ------------------------------------------------- */

        setHidden(
            "Quantity",
            quantity()
        );

        /* -------------------------------------------------
           PRICES
           ------------------------------------------------- */

        calculateTotal();

        /* -------------------------------------------------
           PRODUCT LINK
           ------------------------------------------------- */

        setHidden(
            "Product_Link",
            productLink()
        );

        /* -------------------------------------------------
           REMOVE OLD ADDITIONAL MESSAGE IF IT EXISTS
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
       LIVE TOTAL
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
       LIVE COLOR
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
       LIVE SIZE
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
                    clean(phoneField.value) ||
                    "New Order"
                );

                setHidden(
                    "Mobile_WhatsApp",
                    clean(phoneField.value)
                );
            }
        );
    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        function () {

            prepareOrder();

            /*
               FormSubmit کو submit ہونے دیا جا رہا ہے۔
               کوئی preventDefault نہیں لگایا گیا۔
            */

        }
    );


    /* =====================================================
       INITIAL SETUP
       ===================================================== */

    prepareOrder();

});
