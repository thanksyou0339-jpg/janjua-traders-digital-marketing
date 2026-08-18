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

    /*
     * Backend ابھی connect نہیں ہے۔
     * بعد میں zindex.gs / Google Apps Script
     * کا Web App URL یہاں لگایا جائے گا۔
     */
    const BACKEND_URL = "";


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

            element.value =
                clean(value);

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
       ORDER ID
    ========================================= */

    function generateOrderId() {

        const now =
            new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                now.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                now.getMinutes()
            ).padStart(2, "0");

        const seconds =
            String(
                now.getSeconds()
            ).padStart(2, "0");

        const random =
            Math.floor(
                100 +
                Math.random() * 900
            );

        return (
            "JT-DZ-" +
            year +
            month +
            day +
            "-" +
            hours +
            minutes +
            seconds +
            "-" +
            random
        );

    }


    /* =========================================
       DATE / TIME
    ========================================= */

    function setOrderDateTime() {

        const now =
            new Date();

        const date =
            now.toLocaleDateString(
                "en-PK"
            );

        const time =
            now.toLocaleTimeString(
                "en-PK",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

        setValue(
            "orderDate",
            date
        );

        setValue(
            "orderTime",
            time
        );

    }


    /* =========================================
       PRODUCT LINK
    ========================================= */

    function setProductLink() {

        setValue(
            "formProductLink",
            window.location.href
        );

    }


    /* =========================================
       TOTAL
    ========================================= */

    function calculateTotal() {

        const quantity =
            getQuantity();


        const productTotal =
            PRODUCT_PRICE *
            quantity;


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
                rupees(
                    DELIVERY_CHARGES
                );

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
            rupees(total)
        );


        return {

            quantity:
                quantity,

            productTotal:
                productTotal,

            total:
                total

        };

    }


    /* =========================================
       PREPARE PRODUCT DATA
    ========================================= */

    function prepareProductData() {

        setValue(
            "formProduct",
            getProductName()
        );


        setValue(
            "formDescription",
            getProductDescription()
        );


        setValue(
            "formPlatform",
            "Daraz"
        );


        setProductLink();


        calculateTotal();

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        const name =
            getValue("customerName");

        const phone =
            getValue("customerPhone");

        const address =
            getValue("address");

        const quantity =
            getQuantity();


        if (!name) {

            showResult(
                "براہ کرم اپنا نام درج کریں۔",
                "error"
            );

            get("customerName").focus();

            return false;

        }


        if (!phone) {

            showResult(
                "براہ کرم Mobile / WhatsApp نمبر درج کریں۔",
                "error"
            );

            get("customerPhone").focus();

            return false;

        }


        if (
            phone.length < 10
        ) {

            showResult(
                "براہ کرم درست Mobile / WhatsApp نمبر درج کریں۔",
                "error"
            );

            get("customerPhone").focus();

            return false;

        }


        if (!address) {

            showResult(
                "براہ کرم مکمل Delivery Address درج کریں۔",
                "error"
            );

            get("address").focus();

            return false;

        }


        if (
            quantity < 1 ||
            quantity > 10
        ) {

            showResult(
                "Quantity 1 سے 10 کے درمیان ہونی چاہیے۔",
                "error"
            );

            get("quantity").focus();

            return false;

        }


        return true;

    }


    /* =========================================
       RESULT MESSAGE
    ========================================= */

    function showResult(
        message,
        type
    ) {

        const result =
            get("result");

        if (!result) {
            return;
        }


        result.textContent =
            message;


        result.className =
            "result " +
            (
                type === "success"
                    ? "success"
                    : "error"
            );

    }


    /* =========================================
       BUILD ORDER DATA
    ========================================= */

    function buildOrderData() {

        const totals =
            calculateTotal();


        const orderId =
            generateOrderId();


        setValue(
            "orderId",
            orderId
        );


        setOrderDateTime();


        const data = {

            Order_ID:
                orderId,

            Order_Date:
                getValue("orderDate"),

            Order_Time:
                getValue("orderTime"),

            Product:
                getProductName(),

            Product_Description:
                getProductDescription(),

            Product_Price:
                rupees(PRODUCT_PRICE),

            Delivery_Charges:
                rupees(DELIVERY_CHARGES),

            Product_Total:
                rupees(
                    totals.productTotal
                ),

            Total_Amount:
                rupees(
                    totals.total
                ),

            Product_Link:
                window.location.href,

            Platform:
                "Daraz",

            Customer_Name:
                getValue("customerName"),

            Mobile_WhatsApp:
                getValue("customerPhone"),

            Delivery_Address:
                getValue("address"),

            Quantity:
                totals.quantity,

            Color:
                getValue("color"),

            Size:
                getValue("size")

        };


        return data;

    }


    /* =========================================
       BACKEND SUBMIT
    ========================================= */

    async function sendToBackend(
        orderData
    ) {

        if (!BACKEND_URL) {

            return {

                success: false,

                backendConnected: false,

                message:
                    "Backend ابھی connect نہیں ہے۔"

            };

        }


        const response =
            await fetch(
                BACKEND_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Backend request failed."
            );

        }


        return await response.json();

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!validateForm()) {

                return;

            }


            const submitButton =
                get("submitButton");


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Order Processing...";

            }


            try {

                const orderData =
                    buildOrderData();


                /*
                 * Backend ابھی خالی ہے۔
                 * اس لیے فی الحال Order کو browser
                 * میں successfully prepare کیا جائے گا۔
                 */

                if (!BACKEND_URL) {

                    showResult(

                        "Order تیار ہے۔ Order ID: " +
                        orderData.Order_ID +
                        " — Backend ابھی connect نہیں کیا گیا۔",

                        "success"

                    );

                    console.log(
                        "Daraz Order:",
                        orderData
                    );


                    /*
                     * Customer کی سہولت کے لیے
                     * order data کو temporary
                     * browser storage میں رکھیں۔
                     */

                    try {

                        localStorage.setItem(

                            "lastDarazOrder",

                            JSON.stringify(
                                orderData
                            )

                        );

                    }

                    catch (storageError) {

                        console.warn(
                            "Local storage unavailable.",
                            storageError
                        );

                    }


                    return;

                }


                /*
                 * Backend connected
                 */

                const result =
                    await sendToBackend(
                        orderData
                    );


                if (
                    result &&
                    result.success
                ) {

                    showResult(

                        "Order کامیابی سے submit ہوگیا۔ Order ID: " +
                        orderData.Order_ID,

                        "success"

                    );


                    form.reset();


                    setValue(
                        "quantity",
                        "1"
                    );


                    prepareProductData();

                }

                else {

                    showResult(

                        (
                            result &&
                            result.message
                        )
                        ||
                        "Order submit نہیں ہو سکا۔",

                        "error"

                    );

                }

            }

            catch (error) {

                console.error(
                    "Daraz order error:",
                    error
                );


                showResult(

                    "Order submit کرتے وقت مسئلہ آیا۔ براہ کرم دوبارہ کوشش کریں۔",

                    "error"

                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Order Final Submit کریں";

                }

            }

        }
    );


    /* =========================================
       QUANTITY CHANGE
    ========================================= */

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


    /* =========================================
       INITIALIZE
    ========================================= */

    prepareProductData();


    console.log(
        "Janjua Traders Daraz system loaded."
    );

});
