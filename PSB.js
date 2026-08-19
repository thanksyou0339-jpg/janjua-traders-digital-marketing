/* =========================================================
   JANJUA TRADERS - PSB.JS
   POLYTHENE SHOPPER BAGS
   FINAL VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ADMIN RATES
       یہاں صرف Admin ریٹ تبدیل کرے گا۔
       ریٹ فی KG ہے۔
       ===================================================== */

    const ADMIN_RATES = {
        LD_PER_KG: 0,
        HD_PER_KG: 0
    };


    /* =====================================================
       DELIVERY SETTINGS
       ===================================================== */

    const NORMAL_DELIVERY_CHARGES = 0;

    const URGENT_DELIVERY_CHARGES = 0;


    /* =====================================================
       AVAILABLE AREAS
       ===================================================== */

    const AVAILABLE_AREAS = [
        "Sabarwal Colony",
        "Fatima Jinnah Colony",
        "Hyderabad Town"
    ];


    /* =====================================================
       GMAIL / FORMSUBMIT
       ===================================================== */

    const FORM_SUBMIT_EMAIL =
        "thanksyou0339@gmail.com";

    const FORM_SUBMIT_URL =
        "https://formsubmit.co/ajax/" +
        FORM_SUBMIT_EMAIL;


    /* =====================================================
       BAG WEIGHT
       ===================================================== */

    const BAG_WEIGHT_KG = {

        "8x11": 0.25,

        "9x12": 0.50,

        "10x14": 1.00,

        "12x16": 1.50

    };


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


    function rupees(number) {

        return "Rs. " +
            Number(number || 0)
                .toLocaleString(
                    "en-PK",
                    {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }
                );

    }


    function setText(id, value) {

        const element = get(id);

        if (element) {

            element.textContent = value;

        }

    }


    /* =====================================================
       RATE DISPLAY
       ===================================================== */

    function updateRateDisplays() {

        setText(
            "ldRateDisplay",
            rupees(
                ADMIN_RATES.LD_PER_KG
            ) + " / KG"
        );


        setText(
            "hdRateDisplay",
            rupees(
                ADMIN_RATES.HD_PER_KG
            ) + " / KG"
        );

    }


    /* =====================================================
       QUANTITY
       ===================================================== */

    function getQuantity(input) {

        let value =
            clean(input.value);

        if (value === "") {

            return 0;

        }

        value =
            value.replace(
                /\D/g,
                ""
            );

        let quantity =
            parseInt(
                value,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < 0
        ) {

            quantity = 0;

        }

        return quantity;

    }


    /* =====================================================
       CALCULATE LD / HD
       ===================================================== */

    function calculateType(type) {

        const selector =
            type === "LD"
                ? ".ld-qty"
                : ".hd-qty";


        const rate =
            type === "LD"
                ? Number(
                    ADMIN_RATES.LD_PER_KG
                )
                : Number(
                    ADMIN_RATES.HD_PER_KG
                );


        const inputs =
            document.querySelectorAll(
                selector
            );


        let totalQuantity = 0;

        let totalWeight = 0;

        let totalAmount = 0;


        inputs.forEach(
            function (input) {

                const size =
                    clean(
                        input.dataset.size
                    );


                const quantity =
                    getQuantity(
                        input
                    );


                const weight =
                    Number(
                        BAG_WEIGHT_KG[size] ||
                        0
                    );


                const weightTotal =
                    quantity *
                    weight;


                const amount =
                    weightTotal *
                    rate;


                totalQuantity +=
                    quantity;


                totalWeight +=
                    weightTotal;


                totalAmount +=
                    amount;

            }
        );


        return {

            quantity:
                totalQuantity,

            weight:
                totalWeight,

            amount:
                totalAmount

        };

    }


    /* =====================================================
       DELIVERY TYPE
       ===================================================== */

    function getDeliveryType() {

        const selected =
            document.querySelector(
                'input[name="deliveryType"]:checked'
            );


        if (!selected) {

            return "normal";

        }


        return selected.value;

    }


    /* =====================================================
       DELIVERY CHARGES
       ===================================================== */

    function getDeliveryCharges() {

        if (
            getDeliveryType() ===
            "urgent"
        ) {

            return Number(
                URGENT_DELIVERY_CHARGES
            );

        }


        return Number(
            NORMAL_DELIVERY_CHARGES
        );

    }


    /* =====================================================
       COMPLETE CALCULATION
       ===================================================== */

    function calculateTotal() {

        const ld =
            calculateType("LD");


        const hd =
            calculateType("HD");


        const delivery =
            getDeliveryCharges();


        const grandTotal =
            ld.amount +
            hd.amount +
            delivery;


        setText(
            "ldSubtotal",
            rupees(
                ld.amount
            )
        );


        setText(
            "hdSubtotal",
            rupees(
                hd.amount
            )
        );


        setText(
            "finalLD",
            rupees(
                ld.amount
            )
        );


        setText(
            "finalHD",
            rupees(
                hd.amount
            )
        );


        setText(
            "deliveryCharges",
            rupees(
                delivery
            )
        );


        setText(
            "grandTotal",
            rupees(
                grandTotal
            )
        );


        return {

            ld:
                ld,

            hd:
                hd,

            delivery:
                delivery,

            grandTotal:
                grandTotal

        };

    }


    /* =====================================================
       AREA VALIDATION
       ===================================================== */

    function validateArea(
        showMessage = true
    ) {

        const area =
            getValue(
                "deliveryArea"
            );


        const message =
            get(
                "areaMessage"
            );


        if (!area) {

            if (
                message &&
                showMessage
            ) {

                message.textContent =
                    "براہِ کرم اپنا ڈیلیوری ایریا منتخب کریں۔";

                message.style.display =
                    "block";

                message.className =
                    "area-message error";

            }

            return false;

        }


        const available =
            AVAILABLE_AREAS.includes(
                area
            );


        if (
            message &&
            showMessage
        ) {

            message.style.display =
                "block";


            if (available) {

                message.textContent =
                    "✓ یہ ایریا ڈیلیوری کے لیے دستیاب ہے۔";

                message.className =
                    "area-message success";

            }

            else {

                message.textContent =
                    "✗ ابھی یہ ایریا آپ کے لیے دستیاب نہیں ہے۔";

                message.className =
                    "area-message error";

            }

        }


        return available;

    }


    /* =====================================================
       PAKISTAN DATE / TIME / ORDER ID
       ===================================================== */

    function createOrderInfo() {

        const now =
            new Date();


        const dateParts =
            new Intl.DateTimeFormat(
                "en-GB",
                {
                    timeZone:
                        "Asia/Karachi",

                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric"
                }
            ).formatToParts(
                now
            );


        const timeParts =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        "Asia/Karachi",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        true
                }
            ).formatToParts(
                now
            );


        function part(
            parts,
            type
        ) {

            const item =
                parts.find(
                    function (x) {

                        return (
                            x.type ===
                            type
                        );

                    }
                );


            return item
                ? item.value
                : "";

        }


        const day =
            part(
                dateParts,
                "day"
            );


        const month =
            part(
                dateParts,
                "month"
            );


        const year =
            part(
                dateParts,
                "year"
            );


        const hour =
            part(
                timeParts,
                "hour"
            );


        const minute =
            part(
                timeParts,
                "minute"
            );


        const second =
            part(
                timeParts,
                "second"
            );


        const period =
            part(
                timeParts,
                "dayPeriod"
            );


        let hour24 =
            parseInt(
                hour,
                10
            );


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


        const hourString =
            String(
                hour24
            ).padStart(
                2,
                "0"
            );


        const trackingId =
            `JT-PSB-${year}${month}${day}-${hourString}${minute}${second}`;


        return {

            trackingId:
                trackingId,

            date:
                `${day}-${month}-${year}`,

            time:
                `${hour}:${minute}:${second} ${period}`

        };

    }


    /* =====================================================
       HIDDEN FORM
       ===================================================== */

    function getHiddenForm() {

        let form =
            get(
                "psbEmailForm"
            );


        if (!form) {

            form =
                document.createElement(
                    "form"
                );


            form.id =
                "psbEmailForm";


            form.style.display =
                "none";


            document.body.appendChild(
                form
            );

        }


        return form;

    }


    /* =====================================================
       PREPARE GMAIL ORDER
       ===================================================== */

    function prepareOrder(
        orderInfo,
        totals
    ) {

        const form =
            getHiddenForm();


        form.innerHTML =
            "";


        function add(
            name,
            value
        ) {

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "hidden";


            input.name =
                name;


            input.value =
                clean(
                    value
                );


            form.appendChild(
                input
            );

        }


        add(
            "Order_ID",
            orderInfo.trackingId
        );


        add(
            "Order_Date",
            orderInfo.date
        );


        add(
            "Order_Time",
            orderInfo.time
        );


        add(
            "Customer_Name",
            getValue(
                "customerName"
            )
        );


        add(
            "Shop_Name",
            getValue(
                "shopName"
            )
        );


        add(
            "Mobile_WhatsApp",
            getValue(
                "phone"
            )
        );


        add(
            "Delivery_Address",
            getValue(
                "address"
            )
        );


        add(
            "Delivery_Area",
            getValue(
                "deliveryArea"
            )
        );


        add(
            "Delivery_Type",
            getDeliveryType() ===
            "urgent"
                ? "Urgent"
                : "Normal"
        );


        add(
            "LD_Rate_Per_KG",
            rupees(
                ADMIN_RATES.LD_PER_KG
            )
        );


        add(
            "HD_Rate_Per_KG",
            rupees(
                ADMIN_RATES.HD_PER_KG
            )
        );


        add(
            "LD_Total_Quantity",
            totals.ld.quantity
        );


        add(
            "LD_Total_Weight_KG",
            totals.ld.weight.toFixed(
                2
            )
        );


        add(
            "LD_Subtotal",
            rupees(
                totals.ld.amount
            )
        );


        add(
            "HD_Total_Quantity",
            totals.hd.quantity
        );


        add(
            "HD_Total_Weight_KG",
            totals.hd.weight.toFixed(
                2
            )
        );


        add(
            "HD_Subtotal",
            rupees(
                totals.hd.amount
            )
        );


        add(
            "Delivery_Charges",
            rupees(
                totals.delivery
            )
        );


        add(
            "Grand_Total",
            rupees(
                totals.grandTotal
            )
        );


        /* ---------------------------------------------
           ہر سائز کی Quantity
           --------------------------------------------- */

        document
            .querySelectorAll(
                ".bag-qty"
            )
            .forEach(
                function (input) {

                    const type =
                        clean(
                            input.dataset.type
                        );


                    const size =
                        clean(
                            input.dataset.size
                        );


                    const quantity =
                        getQuantity(
                            input
                        );


                    const weight =
                        Number(
                            BAG_WEIGHT_KG[
                                size
                            ] || 0
                        );


                    add(
                        `${type}_${size}_Quantity`,
                        quantity
                    );


                    add(
                        `${type}_${size}_Weight_KG`,
                        (
                            quantity *
                            weight
                        ).toFixed(
                            2
                        )
                    );

                }
            );


        /* ---------------------------------------------
           FORMSUBMIT
           --------------------------------------------- */

        add(
            "_subject",
            "Janjua Traders | PSB NEW ORDER | " +
            orderInfo.trackingId
        );


        add(
            "_template",
            "table"
        );


        add(
            "_captcha",
            "false"
        );


        return form;

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showSubmitMessage(
        message,
        success
    ) {

        const element =
            get(
                "submitMessage"
            );


        if (!element) {

            return;

        }


        element.textContent =
            message;


        element.style.display =
            "block";


        element.className =
            success
                ? "submit-message success"
                : "submit-message error";

    }


    /* =====================================================
       CLEAR CUSTOMER DATA
       ===================================================== */

    function clearCustomerFields() {

        [
            "customerName",
            "shopName",
            "phone",
            "address"
        ].forEach(
            function (id) {

                const element =
                    get(id);


                if (element) {

                    element.value =
                        "";

                }

            }
        );


        const area =
            get(
                "deliveryArea"
            );


        if (area) {

            area.value =
                "";

        }


        const areaMessage =
            get(
                "areaMessage"
            );


        if (areaMessage) {

            areaMessage.style.display =
                "none";

        }


        document
            .querySelectorAll(
                ".bag-qty"
            )
            .forEach(
                function (input) {

                    input.value =
                        "0";

                }
            );


        const normal =
            document.querySelector(
                'input[name="deliveryType"][value="normal"]'
            );


        if (normal) {

            normal.checked =
                true;

        }


        calculateTotal();

    }


    /* =====================================================
       AREA CHANGE
       ===================================================== */

    const deliveryArea =
        get(
            "deliveryArea"
        );


    if (deliveryArea) {

        deliveryArea.addEventListener(
            "change",
            function () {

                validateArea(
                    true
                );

            }
        );

    }


    /* =====================================================
       BAG QUANTITY EVENTS
       ===================================================== */

    document
        .querySelectorAll(
            ".bag-qty"
        )
        .forEach(
            function (input) {


                input.addEventListener(
                    "focus",
                    function () {

                        setTimeout(
                            function () {

                                input.select();

                            },
                            0
                        );

                    }
                );


                input.addEventListener(
                    "mouseup",
                    function (event) {

                        event.preventDefault();

                        input.select();

                    }
                );


                input.addEventListener(
                    "input",
                    function () {

                        let value =
                            input.value
                                .replace(
                                    /\D/g,
                                    ""
                                );


                        if (
                            value === ""
                        ) {

                            input.value =
                                "0";


                            calculateTotal();

                            return;

                        }


                        let quantity =
                            parseInt(
                                value,
                                10
                            );


                        if (
                            isNaN(quantity) ||
                            quantity < 0
                        ) {

                            quantity = 0;

                        }


                        input.value =
                            String(
                                quantity
                            );


                        calculateTotal();

                    }
                );


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "e" ||
                            event.key === "E" ||
                            event.key === "+" ||
                            event.key === "-" ||
                            event.key === "."
                        ) {

                            event.preventDefault();

                        }

                    }
                );

            }
        );


    /* =====================================================
       DELIVERY CHANGE
       ===================================================== */

    document
        .querySelectorAll(
            'input[name="deliveryType"]'
        )
        .forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    function () {

                        calculateTotal();

                    }
                );

            }
        );


    /* =====================================================
       SUBMIT ORDER
       ===================================================== */

    const submitButton =
        get(
            "submitOrder"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            async function () {


                /* -----------------------------------------
                   REQUIRED FIELDS
                   ----------------------------------------- */

                const requiredFields = [

                    {
                        id:
                            "customerName",

                        message:
                            "کسٹمر کا نام لکھیں۔"
                    },

                    {
                        id:
                            "shopName",

                        message:
                            "دکان کا نام لکھیں۔"
                    },

                    {
                        id:
                            "phone",

                        message:
                            "موبائل / WhatsApp نمبر لکھیں۔"
                    },

                    {
                        id:
                            "address",

                        message:
                            "مکمل پتہ لکھیں۔"
                    }

                ];


                for (
                    const field
                    of requiredFields
                ) {

                    if (
                        !getValue(
                            field.id
                        )
                    ) {

                        showSubmitMessage(
                            "✗ " +
                            field.message,
                            false
                        );


                        const element =
                            get(
                                field.id
                            );


                        if (element) {

                            element.focus();

                        }


                        return;

                    }

                }


                /* -----------------------------------------
                   AREA
                   ----------------------------------------- */

                if (
                    !validateArea(
                        true
                    )
                ) {

                    showSubmitMessage(
                        "✗ منتخب کیا گیا ایریا ابھی دستیاب نہیں ہے۔",
                        false
                    );

                    return;

                }


                /* -----------------------------------------
                   TOTAL
                   ----------------------------------------- */

                const totals =
                    calculateTotal();


                const totalQuantity =
                    totals.ld.quantity +
                    totals.hd.quantity;


                if (
                    totalQuantity <= 0
                ) {

                    showSubmitMessage(
                        "✗ براہِ کرم کم از کم ایک Shopper Bag کی مقدار منتخب کریں۔",
                        false
                    );

                    return;

                }


                /* -----------------------------------------
                   CREATE ORDER INFO
                   ----------------------------------------- */

                const orderInfo =
                    createOrderInfo();


                prepareOrder(
                    orderInfo,
                    totals
                );


                /* -----------------------------------------
                   BUTTON
                   ----------------------------------------- */

                submitButton.disabled =
                    true;


                submitButton.textContent =
                    "Order Submit ہو رہا ہے...";


                showSubmitMessage(
                    "Order Gmail پر بھیجا جا رہا ہے، براہِ کرم انتظار کریں...",
                    true
                );


                try {

                    const form =
                        getHiddenForm();


                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
                            {

                                method:
                                    "POST",

                                headers:
                                    {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded",

                                        "Accept":
                                            "application/json"
                                    },

                                body:
                                    new URLSearchParams(
                                        new FormData(
                                            form
                                        )
                                    ).toString()

                            }
                        );


                    const text =
                        await response.text();


                    let data =
                        null;


                    try {

                        data =
                            JSON.parse(
                                text
                            );

                    }

                    catch (error) {

                        console.warn(
                            "FormSubmit response JSON نہیں تھا۔"
                        );

                    }


                    const successful =
                        response.ok &&
                        (
                            !data ||
                            data.success === true ||
                            data.success === "true"
                        );


                    if (!successful) {

                        throw new Error(
                            data &&
                            data.message
                                ? data.message
                                : "Gmail submission failed."
                        );

                    }


                    /* -----------------------------------------
                       SUCCESS
                       ----------------------------------------- */

                    showSubmitMessage(
                        "✓ آرڈر کامیابی سے Gmail پر Submit ہو گیا ہے۔ Tracking ID: " +
                        orderInfo.trackingId,
                        true
                    );


                    clearCustomerFields();


                }

                catch (error) {

                    console.error(
                        "PSB Gmail Order Error:",
                        error
                    );


                    showSubmitMessage(
                        "✗ آرڈر Gmail پر نہیں بھیجا گیا۔ " +
                        (
                            error.message ||
                            "براہِ کرم دوبارہ کوشش کریں۔"
                        ),
                        false
                    );

                }


                finally {

                    submitButton.disabled =
                        false;


                    submitButton.textContent =
                        "Order Submit کریں";

                }

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    updateRateDisplays();

    calculateTotal();


    console.log(
        "Janjua Traders PSB loaded successfully."
    );


    console.log(
        "LD Rate:",
        ADMIN_RATES.LD_PER_KG
    );


    console.log(
        "HD Rate:",
        ADMIN_RATES.HD_PER_KG
    );

});
