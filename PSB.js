/* =========================================================
   JANJUA TRADERS
   PSB - POLYTHENE SHOPPER BAGS
   FINAL PSB.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ADMIN RATE SETTINGS
       یہاں صرف ریٹ تبدیل کرنے ہوں گے
       ===================================================== */

    const ADMIN_SETTINGS = {

        LD_RATE_PER_KG: 0,
        HD_RATE_PER_KG: 0,

        NORMAL_DELIVERY_CHARGES: 0,

        URGENT_DELIVERY_CHARGES: 0

    };


    /* =====================================================
       FORM / ELEMENT HELPERS
       ===================================================== */

    function get(id) {
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


    function rupees(value) {

        return "Rs. " +
            Number(value || 0).toLocaleString(
                "en-PK",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            );
    }


    /* =====================================================
       DELIVERY AREAS
       ===================================================== */

    const AVAILABLE_AREAS = [

        "Sabarwal Colony",
        "Fatima Jinnah Colony",
        "Hyderabad Town"

    ];


    /* =====================================================
       DELIVERY AREA CHECK
       ===================================================== */

    const deliveryArea =
        get("deliveryArea");

    const areaMessage =
        get("areaMessage");


    function checkArea() {

        if (!deliveryArea) {
            return false;
        }


        const selectedArea =
            clean(deliveryArea.value);


        if (selectedArea === "") {

            if (areaMessage) {

                areaMessage.style.display =
                    "none";

                areaMessage.textContent =
                    "";
            }

            return false;
        }


        const available =
            AVAILABLE_AREAS.includes(
                selectedArea
            );


        if (areaMessage) {

            areaMessage.style.display =
                "block";


            if (available) {

                areaMessage.className =
                    "area-message available";

                areaMessage.textContent =
                    "✓ یہ ایریا ڈیلیوری کے لیے دستیاب ہے۔";

            } else {

                areaMessage.className =
                    "area-message unavailable";

                areaMessage.textContent =
                    "✗ ابھی یہ ایریا آپ کے لیے دستیاب نہیں ہے۔";

            }

        }


        return available;
    }


    if (deliveryArea) {

        deliveryArea.addEventListener(
            "change",
            function () {

                checkArea();
                calculateTotal();

            }
        );

    }


    /* =====================================================
       RATE DISPLAY
       ===================================================== */

    function updateRateDisplay() {

        const ldDisplay =
            get("ldRateDisplay");

        const hdDisplay =
            get("hdRateDisplay");


        if (ldDisplay) {

            ldDisplay.textContent =
                rupees(
                    ADMIN_SETTINGS.LD_RATE_PER_KG
                ) +
                " / KG";

        }


        if (hdDisplay) {

            hdDisplay.textContent =
                rupees(
                    ADMIN_SETTINGS.HD_RATE_PER_KG
                ) +
                " / KG";

        }

    }


    /* =====================================================
       BAG WEIGHT
       =====================================================

       ہر سائز کی quantity کو اس کے مقررہ وزن
       کے حساب سے KG میں تبدیل کیا جائے گا۔

       8x11  = 0.25 KG
       9x12  = 0.50 KG
       10x14 = 1.00 KG
       12x16 = 1.50 KG

       مثال:

       2 عدد 8x11
       = 2 × 0.25
       = 0.50 KG

       پھر:
       0.50 × Admin Rate/KG
       ===================================================== */

    const BAG_WEIGHTS = {

        "8x11": 0.25,

        "9x12": 0.50,

        "10x14": 1.00,

        "12x16": 1.50

    };


    /* =====================================================
       QUANTITY READING
       ===================================================== */

    function getQuantity(input) {

        if (!input) {
            return 0;
        }


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


        if (value === "") {
            return 0;
        }


        let qty =
            parseInt(
                value,
                10
            );


        if (
            isNaN(qty) ||
            qty < 0
        ) {

            qty = 0;

        }


        return qty;
    }


    /* =====================================================
       CALCULATE TYPE
       ===================================================== */

    function calculateType(type) {

        const selector =
            type === "LD"
                ? ".ld-qty"
                : ".hd-qty";


        const inputs =
            document.querySelectorAll(
                selector
            );


        const rate =
            type === "LD"
                ? ADMIN_SETTINGS.LD_RATE_PER_KG
                : ADMIN_SETTINGS.HD_RATE_PER_KG;


        let totalKG = 0;

        let subtotal = 0;


        inputs.forEach(
            function (input) {

                const size =
                    input.dataset.size;


                const qty =
                    getQuantity(
                        input
                    );


                const weight =
                    BAG_WEIGHTS[size] || 0;


                const kg =
                    qty * weight;


                totalKG +=
                    kg;

            }
        );


        subtotal =
            totalKG * rate;


        return {

            type:
                type,

            totalKG:
                totalKG,

            subtotal:
                subtotal

        };

    }


    /* =====================================================
       DELIVERY CHARGES
       ===================================================== */

    function getDeliveryCharges() {

        const selected =
            document.querySelector(
                'input[name="deliveryType"]:checked'
            );


        if (!selected) {

            return 0;

        }


        if (
            selected.value ===
            "urgent"
        ) {

            return ADMIN_SETTINGS
                .URGENT_DELIVERY_CHARGES;

        }


        return ADMIN_SETTINGS
            .NORMAL_DELIVERY_CHARGES;

    }


    /* =====================================================
       MAIN CALCULATION
       ===================================================== */

    function calculateTotal() {

        const ld =
            calculateType(
                "LD"
            );


        const hd =
            calculateType(
                "HD"
            );


        const delivery =
            getDeliveryCharges();


        const grandTotal =
            ld.subtotal +
            hd.subtotal +
            delivery;


        /* ---------------------------------------------
           LD SUBTOTAL
        --------------------------------------------- */

        const ldSubtotal =
            get("ldSubtotal");


        if (ldSubtotal) {

            ldSubtotal.textContent =
                rupees(
                    ld.subtotal
                );

        }


        /* ---------------------------------------------
           HD SUBTOTAL
        --------------------------------------------- */

        const hdSubtotal =
            get("hdSubtotal");


        if (hdSubtotal) {

            hdSubtotal.textContent =
                rupees(
                    hd.subtotal
                );

        }


        /* ---------------------------------------------
           FINAL LD
        --------------------------------------------- */

        const finalLD =
            get("finalLD");


        if (finalLD) {

            finalLD.textContent =
                rupees(
                    ld.subtotal
                );

        }


        /* ---------------------------------------------
           FINAL HD
        --------------------------------------------- */

        const finalHD =
            get("finalHD");


        if (finalHD) {

            finalHD.textContent =
                rupees(
                    hd.subtotal
                );

        }


        /* ---------------------------------------------
           DELIVERY
        --------------------------------------------- */

        const deliveryElement =
            get("deliveryCharges");


        if (deliveryElement) {

            deliveryElement.textContent =
                rupees(
                    delivery
                );

        }


        /* ---------------------------------------------
           GRAND TOTAL
        --------------------------------------------- */

        const grandTotalElement =
            get("grandTotal");


        if (grandTotalElement) {

            grandTotalElement.textContent =
                rupees(
                    grandTotal
                );

        }


        return {

            ldKG:
                ld.totalKG,

            ldSubtotal:
                ld.subtotal,

            hdKG:
                hd.totalKG,

            hdSubtotal:
                hd.subtotal,

            delivery:
                delivery,

            grandTotal:
                grandTotal

        };

    }


    /* =====================================================
       BAG INPUT EVENTS
       ===================================================== */

    const bagInputs =
        document.querySelectorAll(
            ".bag-qty"
        );


    bagInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    let value =
                        input.value;


                    value =
                        value.replace(
                            /\D/g,
                            ""
                        );


                    if (
                        value === ""
                    ) {

                        input.value =
                            "";

                    }

                    else {

                        input.value =
                            String(
                                parseInt(
                                    value,
                                    10
                                )
                            );

                    }


                    calculateTotal();

                }
            );


            input.addEventListener(
                "change",
                function () {

                    if (
                        input.value === ""
                    ) {

                        input.value =
                            "0";

                    }


                    let qty =
                        parseInt(
                            input.value,
                            10
                        );


                    if (
                        isNaN(qty) ||
                        qty < 0
                    ) {

                        qty = 0;

                    }


                    input.value =
                        String(
                            qty
                        );


                    calculateTotal();

                }
            );

        }
    );


    /* =====================================================
       DELIVERY TYPE EVENTS
       ===================================================== */

    const deliveryTypes =
        document.querySelectorAll(
            'input[name="deliveryType"]'
        );


    deliveryTypes.forEach(
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
       ORDER INFORMATION
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
            name
        ) {

            const item =
                parts.find(
                    function (x) {

                        return x.type === name;

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


        const orderDate =
            `${day}-${month}-${year}`;


        const orderTime =
            `${hour}:${minute}:${second} ${period}`;


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


        const orderID =
            `JT-PSB-${year}${month}${day}-${String(hour24).padStart(2, "0")}${minute}${second}`;


        return {

            orderID:
                orderID,

            orderDate:
                orderDate,

            orderTime:
                orderTime

        };

    }


    /* =====================================================
       COLLECT BAG DETAILS
       ===================================================== */

    function collectBags(type) {

        const selector =
            type === "LD"
                ? ".ld-qty"
                : ".hd-qty";


        const inputs =
            document.querySelectorAll(
                selector
            );


        const bags = [];


        inputs.forEach(
            function (input) {

                const qty =
                    getQuantity(
                        input
                    );


                if (
                    qty > 0
                ) {

                    const size =
                        input.dataset.size;


                    const weight =
                        BAG_WEIGHTS[size] || 0;


                    bags.push({

                        type:
                            type,

                        size:
                            size,

                        quantity:
                            qty,

                        weightPerBag:
                            weight,

                        totalKG:
                            qty * weight

                    });

                }

            }
        );


        return bags;

    }


    /* =====================================================
       FORMSUBMIT
       ===================================================== */

    const FORM_SUBMIT_EMAIL =
        "thanksyou0339@gmail.com";


    const FORM_SUBMIT_URL =
        "https://formsubmit.co/ajax/" +
        FORM_SUBMIT_EMAIL;


    /* =====================================================
       SUBMIT MESSAGE
       ===================================================== */

    function showMessage(
        message,
        success
    ) {

        const element =
            get("submitMessage");


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
       SUBMIT
       ===================================================== */

    const submitButton =
        get("submitOrder");


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            async function () {

                /* -----------------------------------------
                   BASIC VALIDATION
                ----------------------------------------- */

                const customerName =
                    clean(
                        get("customerName")
                            ?.value
                    );


                const shopName =
                    clean(
                        get("shopName")
                            ?.value
                    );


                const phone =
                    clean(
                        get("phone")
                            ?.value
                    );


                const address =
                    clean(
                        get("address")
                            ?.value
                    );


                const selectedArea =
                    clean(
                        get("deliveryArea")
                            ?.value
                    );


                if (
                    customerName === ""
                ) {

                    showMessage(
                        "براہِ کرم کسٹمر کا نام لکھیں۔",
                        false
                    );

                    get("customerName")
                        ?.focus();

                    return;

                }


                if (
                    shopName === ""
                ) {

                    showMessage(
                        "براہِ کرم دکان کا نام لکھیں۔",
                        false
                    );

                    get("shopName")
                        ?.focus();

                    return;

                }


                if (
                    phone === ""
                ) {

                    showMessage(
                        "براہِ کرم موبائل / WhatsApp نمبر لکھیں۔",
                        false
                    );

                    get("phone")
                        ?.focus();

                    return;

                }


                if (
                    address === ""
                ) {

                    showMessage(
                        "براہِ کرم مکمل پتہ لکھیں۔",
                        false
                    );

                    get("address")
                        ?.focus();

                    return;

                }


                if (
                    selectedArea === ""
                ) {

                    showMessage(
                        "براہِ کرم ڈیلیوری ایریا منتخب کریں۔",
                        false
                    );

                    get("deliveryArea")
                        ?.focus();

                    return;

                }


                if (
                    !checkArea()
                ) {

                    showMessage(
                        "یہ ایریا ابھی ڈیلیوری کے لیے دستیاب نہیں ہے۔",
                        false
                    );

                    return;

                }


                /* -----------------------------------------
                   TOTALS
                ----------------------------------------- */

                const totals =
                    calculateTotal();


                const ldBags =
                    collectBags(
                        "LD"
                    );


                const hdBags =
                    collectBags(
                        "HD"
                    );


                if (
                    ldBags.length === 0 &&
                    hdBags.length === 0
                ) {

                    showMessage(
                        "براہِ کرم کم از کم ایک Shopper Bag کی مقدار درج کریں۔",
                        false
                    );

                    return;

                }


                /* -----------------------------------------
                   ORDER INFO
                ----------------------------------------- */

                const orderInfo =
                    createOrderInfo();


                const deliveryRadio =
                    document.querySelector(
                        'input[name="deliveryType"]:checked'
                    );


                const deliveryType =
                    deliveryRadio
                        ? deliveryRadio.value
                        : "normal";


                const deliveryTypeText =
                    deliveryType === "urgent"
                        ? "Urgent Delivery"
                        : "Normal Delivery";


                /* -----------------------------------------
                   BAG SUMMARY
                ----------------------------------------- */

                let bagSummary =
                    "";


                ldBags.forEach(
                    function (bag) {

                        bagSummary +=
                            `LD ${bag.size} | مقدار: ${bag.quantity} | KG: ${bag.totalKG.toFixed(2)}\n`;

                    }
                );


                hdBags.forEach(
                    function (bag) {

                        bagSummary +=
                            `HD ${bag.size} | مقدار: ${bag.quantity} | KG: ${bag.totalKG.toFixed(2)}\n`;

                    }
                );


                /* -----------------------------------------
                   FORM DATA
                ----------------------------------------- */

                const formData =
                    new FormData();


                formData.append(
                    "_subject",
                    "Janjua Traders | PSB NEW ORDER | " +
                    orderInfo.orderID
                );


                formData.append(
                    "_template",
                    "table"
                );


                formData.append(
                    "_captcha",
                    "false"
                );


                formData.append(
                    "Order_ID",
                    orderInfo.orderID
                );


                formData.append(
                    "Order_Date",
                    orderInfo.orderDate
                );


                formData.append(
                    "Order_Time",
                    orderInfo.orderTime
                );


                formData.append(
                    "Customer_Name",
                    customerName
                );


                formData.append(
                    "Shop_Name",
                    shopName
                );


                formData.append(
                    "Mobile_WhatsApp",
                    phone
                );


                formData.append(
                    "Delivery_Address",
                    address
                );


                formData.append(
                    "Delivery_Area",
                    selectedArea
                );


                formData.append(
                    "Delivery_Type",
                    deliveryTypeText
                );


                formData.append(
                    "LD_Rate_Per_KG",
                    rupees(
                        ADMIN_SETTINGS.LD_RATE_PER_KG
                    )
                );


                formData.append(
                    "LD_Total_KG",
                    totals.ldKG.toFixed(2)
                );


                formData.append(
                    "LD_Subtotal",
                    rupees(
                        totals.ldSubtotal
                    )
                );


                formData.append(
                    "HD_Rate_Per_KG",
                    rupees(
                        ADMIN_SETTINGS.HD_RATE_PER_KG
                    )
                );


                formData.append(
                    "HD_Total_KG",
                    totals.hdKG.toFixed(2)
                );


                formData.append(
                    "HD_Subtotal",
                    rupees(
                        totals.hdSubtotal
                    )
                );


                formData.append(
                    "Delivery_Charges",
                    rupees(
                        totals.delivery
                    )
                );


                formData.append(
                    "Grand_Total",
                    rupees(
                        totals.grandTotal
                    )
                );


                formData.append(
                    "Bag_Details",
                    bagSummary
                );


                /* -----------------------------------------
                   BUTTON
                ----------------------------------------- */

                submitButton.disabled =
                    true;


                submitButton.textContent =
                    "Order Submit ہو رہا ہے...";


                showMessage(
                    "Order Gmail پر بھیجا جا رہا ہے، براہِ کرم انتظار کریں...",
                    true
                );


                try {

                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
                            {

                                method:
                                    "POST",

                                body:
                                    formData,

                                headers:
                                    {
                                        "Accept":
                                            "application/json"
                                    }

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

                    catch (
                        error
                    ) {

                        console.warn(
                            "FormSubmit response JSON نہیں تھا۔"
                        );

                    }


                    if (
                        response.ok &&
                        (
                            !data ||
                            data.success === true ||
                            data.success === "true"
                        )
                    ) {

                        showMessage(

                            "✓ Order کامیابی سے Gmail پر بھیج دیا گیا ہے۔ Order ID: " +
                            orderInfo.orderID,

                            true

                        );


                        /* ---------------------------------
                           CUSTOMER FIELDS CLEAR
                        --------------------------------- */

                        if (
                            get("customerName")
                        ) {

                            get(
                                "customerName"
                            ).value =
                                "";

                        }


                        if (
                            get("shopName")
                        ) {

                            get(
                                "shopName"
                            ).value =
                                "";

                        }


                        if (
                            get("phone")
                        ) {

                            get(
                                "phone"
                            ).value =
                                "";

                        }


                        if (
                            get("address")
                        ) {

                            get(
                                "address"
                            ).value =
                                "";

                        }


                        if (
                            get("deliveryArea")
                        ) {

                            get(
                                "deliveryArea"
                            ).value =
                                "";

                        }


                        if (areaMessage) {

                            areaMessage.style.display =
                                "none";

                        }


                        /* ---------------------------------
                           BAG QUANTITIES CLEAR
                        --------------------------------- */

                        bagInputs.forEach(
                            function (input) {

                                input.value =
                                    "0";

                            }
                        );


                        calculateTotal();

                    }

                    else {

                        throw new Error(
                            data &&
                            data.message
                                ? data.message
                                : "FormSubmit نے Order قبول نہیں کیا۔"
                        );

                    }

                }

                catch (
                    error
                ) {

                    console.error(
                        "PSB Order Error:",
                        error
                    );


                    showMessage(

                        "✗ Order Gmail پر نہیں بھیجا گیا۔ " +
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
       INITIALIZE
       ===================================================== */

    updateRateDisplay();

    calculateTotal();


    console.log(
        "Janjua Traders PSB.js loaded successfully."
    );

    console.log(
        "LD Rate:",
        ADMIN_SETTINGS.LD_RATE_PER_KG
    );

    console.log(
        "HD Rate:",
        ADMIN_SETTINGS.HD_RATE_PER_KG
    );

});
