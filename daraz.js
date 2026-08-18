document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Daraz: orderForm not found.");
        return;
    }


    /* =========================================
       DARAZ SETTINGS
    ========================================= */

    const PRODUCT_PRICE = 42999;

    const DELIVERY_CHARGES = 250;

    const BACKEND_URL = "";
    /*
     * ابھی خالی رکھیں۔
     * zindex.gs کا backend بعد میں connect کریں گے۔
     */


    /* =========================================
       HELPERS
    ========================================= */

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


    function setValue(id, value) {

        const element = get(id);

        if (element) {
            element.value = clean(value);
        }
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


    /* =========================================
       PRODUCT
    ========================================= */

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


    /* =========================================
       QUANTITY
    ========================================= */

    function getQuantity() {

        const field =
            get("quantity");

        if (!field) {
            return 1;
        }

        let quantity =
            parseInt(
                field.value,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < 1
        ) {
            quantity = 1;
        }

        if (quantity > 10) {
            quantity = 10;
        }

        return quantity;
    }


    /* =========================================
       TOTAL
    ========================================= */

    function calculateTotal() {

        const quantity =
            getQuantity();


        const productTotal =
            PRODUCT_PRICE * quantity;


        const total =
            productTotal +
            DELIVERY_CHARGES;


        const productPrice =
            get("productPrice");

        if (productPrice) {
            productPrice.textContent =
                rupees(PRODUCT_PRICE);
        }


        const deliveryPrice =
            get("deliveryPrice");

        if (deliveryPrice) {
            deliveryPrice.textContent =
                rupees(DELIVERY_CHARGES);
        }


        const totalPrice =
            get("totalPrice");

        if (totalPrice) {
            totalPrice.textContent =
                rupees(total);
        }


        setValue(
            "formProductPrice",
            rupees(PRODUCT_PRICE)
        );


        setValue(
            "formDeliveryPrice",
            rupees(DELIVERY_CHARGES)
        );


        setValue(
            "formProductTotal",
            rupees(productTotal)
        );


        setValue(
            "formTotalPrice",
            rupees(total
