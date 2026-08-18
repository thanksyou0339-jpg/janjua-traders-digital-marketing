/* =========================================================
   JANJUA TRADERS
   APNA MART - FINAL ORDER SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");

    if (!form) {
        console.error("Apna Mart: orderForm not found.");
        return;
    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    const PRODUCT_PRICE = 42999;

    const DELIVERY_CHARGES = 250;

    const GMAIL =
        "thanksyou0339@gmail.com";

    const FORM_SUBMIT_URL =
        "https://formsubmit.co/ajax/" + GMAIL;


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

        let field =
            form.querySelector(
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

        return field;
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

    function getProductName() {

        const element =
            get("productTitle");

        if (!element) {
            return "Apna Mart Product";
        }

        return clean(
            element.textContent
        ) || "Apna Mart Product";
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


    /* =====================================================
       QUANTITY
    ===================================================== */

    function getQuantity() {

        const field =
            get("quantity");

        if (!field) {
            return 1;
        }

        let value =
            parseInt(
                field.value,
                10
            );

        if (
            isNaN(value) ||
            value < 1
        ) {
            value = 1;
        }

        if (value > 10) {
            value = 10;
        }

        return value;
    }


    /* =====================================================
       TOTAL
    ===================================================== */

    function calculateTotal() {

        const qty =
            getQuantity();

        const productTotal =
            PRODUCT_PRICE * qty;

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


        setHidden(
            "Product_Price",
            rupees(PRODUCT_PRICE)
        );


        setHidden(
            "Delivery_Charges",
            rupees(DELIVERY_CHARGES)
        );


        setHidden(
            "Product_Total",
            rupees(productTotal)
        );


        setHidden(
            "Total_Amount",
            rupees(total)
        );


        return {
            quantity: qty,
            productTotal: productTotal,
            total: total
        };
    }


    /* =====================================================
       PAKISTAN DATE / TIME
    ===================================================== */

    function createOrderInfo() {

        const now = new Date();


        const dateParts =
            new Intl.DateTimeFormat(
                "en-GB",
                {
                    timeZone: "Asia/Karachi",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            ).formatToParts(now);


        const timeParts =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone: "Asia/Karachi",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }
            ).formatToParts(now);


        function part(parts, type) {

            const found =
                parts.find(
                    function (item) {
                        return item.type === type;
                    }
                );

            return found
                ? found.value
                : "";
        }


        const day =
            part(dateParts, "day");

        const month =
            part(dateParts, "month");

        const year =
            part(dateParts, "year");


        const hour =
            part(timeParts, "hour");

        const minute =
            part(timeParts, "minute");

        const second =
            part(timeParts, "second");

        const period =
            part(timeParts, "dayPeriod");


        const orderDate =
            `${day}-${month}-${year}`;


        const orderTime =
            `${hour}:${minute}:${second} ${period}`;


        let hour24 =
            parseInt(hour, 10);


        if (
            period === "AM" &&
            hour24 === 12
        ) {
            hour24 = 0;
        }


        if (
            period === "PM" &&
            hour24 !== 12
        ) {
            hour24 += 12;
        }


        const hourText =
            String(hour24)
                .padStart(2, "0");


        const trackingId =
            `JT-AM-${year}${month}${day}-${hourText}${minute}${second}`;


        return {
            trackingId: trackingId,
            orderDate: orderDate,
            orderTime: orderTime
        };
    }


    /* =====================================================
       PREPARE ORDER
    ===================================================== */

    function prepareOrder(orderInfo) {

        const totals =
            calculateTotal();


        setHidden(
            "Order_ID",
            orderInfo.trackingId
        );


        setHidden(
            "Order_Date",
            orderInfo.orderDate
        );


        setHidden(
            "Order_Time",
            orderInfo.orderTime
        );


        setHidden(
            "Customer_Name",
            getValue("customerName")
        );


        setHidden(
            "Mobile_WhatsApp",
            getValue("customerPhone")
        );


        setHidden(
            "Delivery_Address",
            getValue("address")
        );


        setHidden(
            "Platform",
            "Apna Mart"
        );


        setHidden(
            "Product",
            getProductName()
        );


        setHidden(
            "Product_Description",
            getProductDescription()
        );


        setHidden(
            "Color",
            getValue("color") ||
            "Not Required"
        );


        setHidden(
            "Size",
            getValue("size") ||
            "Not Required"
        );


        setHidden(
            "Quantity",
            totals.quantity
        );


        setHidden(
            "Product_Link",
            window.location.href
        );


        /* FormSubmit */

        setHidden(
            "_subject",
            "Janjua Traders | APNA MART NEW ORDER | " +
            orderInfo.trackingId
        );


        setHidden(
            "_template",
            "table"
        );


        setHidden(
            "_captcha",
            "false"
        );
    }


    /* =====================================================
       RESULT MESSAGE
    ===================================================== */

    function showResult(
        message,
        success
    ) {

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
       QUANTITY FIX
    ===================================================== */

    const quantityField =
        get("quantity");


    if (quantityField) {

        quantityField.type = "number";

        quantityField.min = "1";

        quantityField.max = "10";

        quantityField.step = "1";

        quantityField.inputMode =
            "numeric";


        quantityField.addEventListener(
            "focus",
            function () {

                setTimeout(
                    function () {
                        quantityField.select();
                    },
                    0
                );

            }
        );


        quantityField.addEventListener(
            "input",
            function () {

                let value =
                    quantityField.value;


                /*
                 * خالی رہنے دیں تاکہ
                 * customer نیا نمبر لکھ سکے۔
                 */

                if (value === "") {

                    calculateTotal();

                    return;
                }


                value =
                    parseInt(
                        value,
                        10
                    );


                if (isNaN(value)) {

                    quantityField.value = "";

                    return;
                }


                if (value < 1) {
                    value = 1;
                }


                if (value > 10) {
                    value = 10;
                }


                quantityField.value =
                    String(value);


                calculateTotal();
            }
        );


        quantityField.addEventListener(
            "change",
            function () {

                let value =
                    parseInt(
                        quantityField.value,
                        10
                    );


                if (
                    isNaN(value) ||
                    value < 1
                ) {
                    value = 1;
                }


                if (value > 10) {
                    value = 10;
                }


                quantityField.value =
                    String(value);


                calculateTotal();
            }
        );


        quantityField.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "e" ||
                    event.key === "E" ||
                    event.key === "+" ||
                    event.key === "-"
                ) {

                    event.preventDefault();
                }
            }
        );
    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!form.checkValidity()) {

                form.reportValidity();

                return;
            }


            const orderInfo =
                createOrderInfo();


            prepareOrder(
                orderInfo
            );


            const submitButton =
                get("submitButton");


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Order Submit ہو رہا ہے...";
            }


            showResult(
                "Order Gmail پر بھیجا جا رہا ہے...",
                true
            );


            try {

                const response =
                    await fetch(
                        FORM_SUBMIT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    Object.fromEntries(
                                        new FormData(form)
                                    )
                                )
                        }
                    );


                const text =
                    await response.text();


                let data = null;


                try {

                    data =
                        JSON.parse(text);

                } catch (error) {

                    console.warn(
                        "FormSubmit response was not JSON."
                    );
                }


                if (
                    response.ok &&
                    data &&
                    (
                        data.success === true ||
                        data.success === "true"
                    )
                ) {

                    showResult(
                        "✓ Apna Mart Order کامیابی سے Gmail پر پہنچ گیا ہے۔ Tracking ID: " +
                        orderInfo.trackingId,
                        true
                    );


                    /* Customer fields clear */

                    get("customerName").value = "";

                    get("customerPhone").value = "";

                    get("address").value = "";

                    get("color").value = "";

                    get("size").value = "";


                    if (quantityField) {
                        quantityField.value = "1";
                    }


                    calculateTotal();

                } else {

                    throw new Error(
                        data &&
                        data.message
                            ? data.message
                            : "FormSubmit نے Order قبول نہیں کیا۔"
                    );
                }


            } catch (error) {

                console.error(
                    "Apna Mart Gmail Error:",
                    error
                );


                showResult(
                    "✗ Order Gmail پر نہیں بھیجا گیا۔ " +
                    (
                        error.message ||
                        "Connection error"
                    ),
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
       INITIAL LOAD
    ===================================================== */

    if (quantityField) {

        quantityField.value = "1";
    }


    calculateTotal();


    console.log(
        "Janjua Traders: Apna Mart JS loaded successfully."
    );

});
