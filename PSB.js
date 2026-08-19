/* =========================================================
   JANJUA TRADERS
   PSB - POLYTHENE SHOPPER BAGS
   FINAL JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GMAIL / FORMSUBMIT
    ===================================================== */

    const EMAIL =
        "thanksyou0339@gmail.com";

    const FORM_URL =
        "https://formsubmit.co/ajax/" + EMAIL;


    /* =====================================================
       ADMIN RATES
       بعد میں یہاں اصل ریٹ ڈال سکتے ہیں
       ===================================================== */

    const LD_RATE_PER_KG = 0;
    const HD_RATE_PER_KG = 0;


    /* =====================================================
       DELIVERY CHARGES
       Normal = Free
       Urgent = Admin rate
       ===================================================== */

    const NORMAL_DELIVERY = 0;
    const URGENT_DELIVERY = 0;


    /* =====================================================
       DELIVERY AREAS
    ===================================================== */

    const DELIVERY_AREAS = [

        "VIP Town",
        "Sabarwal Colony",
        "Fatima Jinnah Colony",
        "Hyderabad Town",
        "Sabar Town",
        "Rana Town",
        "Hamdia Colony",
        "Chakian",
        "Dhrema",
        "Mari",
        "Lakhmoor",
        "Pitpan Chak",
        "Churanja Chak",
        "55 Chak Shamali",
        "56 Chak Shamali",
        "92 Mor"

    ];


    /* =====================================================
       HELPERS
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


    function money(value) {

        return "Rs. " +
            Number(value || 0)
                .toLocaleString(
                    "en-PK"
                );

    }


    /* =====================================================
       AREA CHECK
    ===================================================== */

    const areaSelect =
        get("deliveryArea");

    const areaMessage =
        get("areaMessage");


    if (areaSelect) {

        areaSelect.addEventListener(
            "change",
            function () {

                const selected =
                    clean(
                        areaSelect.value
                    );


                if (!areaMessage) {

                    return;

                }


                if (!selected) {

                    areaMessage.textContent =
                        "";

                    areaMessage.className =
                        "area-message";

                    return;

                }


                if (
                    DELIVERY_AREAS.includes(
                        selected
                    )
                ) {

                    areaMessage.textContent =
                        "✓ " +
                        selected +
                        " — اس ایریا کے لیے ڈیلیوری دستیاب ہے۔";

                    areaMessage.className =
                        "area-message ok";

                }

            }
        );

    }


    /* =====================================================
       RATE DISPLAY
    ===================================================== */

    const ldRateDisplay =
        get("ldRateDisplay");

    const hdRateDisplay =
        get("hdRateDisplay");


    if (ldRateDisplay) {

        ldRateDisplay.textContent =
            LD_RATE_PER_KG > 0
                ? money(LD_RATE_PER_KG) + " / KG"
                : "Admin Rate / KG";

    }


    if (hdRateDisplay) {

        hdRateDisplay.textContent =
            HD_RATE_PER_KG > 0
                ? money(HD_RATE_PER_KG) + " / KG"
                : "Admin Rate / KG";

    }


    /* =====================================================
       QUANTITY
       ہر click پر صرف اپنی value رہے گی
       2 = 2
       4 = 4
       20 نہیں
       ===================================================== */

    const quantityInputs =
        document.querySelectorAll(
            ".bag-qty"
        );


    quantityInputs.forEach(
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

                        calculateTotal();

                        return;

                    }


                    let number =
                        parseInt(
                            value,
                            10
                        );


                    if (
                        isNaN(number) ||
                        number < 0
                    ) {

                        number = 0;

                    }


                    input.value =
                        String(
                            number
                        );


                    calculateTotal();

                }
            );


            input.addEventListener(
                "change",
                function () {

                    let number =
                        parseInt(
                            input.value,
                            10
                        );


                    if (
                        isNaN(number) ||
                        number < 0
                    ) {

                        number = 0;

                    }


                    input.value =
                        String(
                            number
                        );


                    calculateTotal();

                }
            );

        }
    );


    /* =====================================================
       CALCULATE TOTAL
    ===================================================== */

    function calculateTotal() {

        let ldQuantity = 0;

        let hdQuantity = 0;


        document
            .querySelectorAll(
                ".ld-qty"
            )
            .forEach(
                function (input) {

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


                    ldQuantity +=
                        qty;

                }
            );


        document
            .querySelectorAll(
                ".hd-qty"
            )
            .forEach(
                function (input) {

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


                    hdQuantity +=
                        qty;

                }
            );


        const ldSubtotal =
            ldQuantity *
            LD_RATE_PER_KG;


        const hdSubtotal =
            hdQuantity *
            HD_RATE_PER_KG;


        let deliveryType =
            document.querySelector(
                'input[name="deliveryType"]:checked'
            );


        deliveryType =
            deliveryType
                ? deliveryType.value
                : "normal";


        const deliveryCharges =
            deliveryType === "urgent"
                ? URGENT_DELIVERY
                : NORMAL_DELIVERY;


        const grandTotal =
            ldSubtotal +
            hdSubtotal +
            deliveryCharges;


        /* ---------------------------------------------
           DISPLAY
        --------------------------------------------- */

        if (
            get("ldSubtotal")
        ) {

            get("ldSubtotal").textContent =
                money(
                    ldSubtotal
                );

        }


        if (
            get("hdSubtotal")
        ) {

            get("hdSubtotal").textContent =
                money(
                    hdSubtotal
                );

        }


        if (
            get("finalLD")
        ) {

            get("finalLD").textContent =
                money(
                    ldSubtotal
                );

        }


        if (
            get("finalHD")
        ) {

            get("finalHD").textContent =
                money(
                    hdSubtotal
                );

        }


        if (
            get("deliveryCharges")
        ) {

            get("deliveryCharges").textContent =
                money(
                    deliveryCharges
                );

        }


        if (
            get("grandTotal")
        ) {

            get("grandTotal").textContent =
                money(
                    grandTotal
                );

        }


        return {

            ldQuantity:
                ldQuantity,

            hdQuantity:
                hdQuantity,

            ldSubtotal:
                ldSubtotal,

            hdSubtotal:
                hdSubtotal,

            deliveryCharges:
                deliveryCharges,

            grandTotal:
                grandTotal,

            deliveryType:
                deliveryType

        };

    }


    /* =====================================================
       DELIVERY RADIO
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
       ORDER DATE / TIME / ID
       PAKISTAN TIME
    ===================================================== */

    function createOrderInfo() {

        const now =
            new Date();


        const parts =
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
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        false

                }
            ).formatToParts(
                now
            );


        function part(type) {

            const found =
                parts.find(
                    function (item) {

                        return (
                            item.type ===
                            type
                        );

                    }
                );


            return found
                ? found.value
                : "";

        }


        const day =
            part("day");

        const month =
            part("month");

        const year =
            part("year");

        const hour =
            part("hour");

        const minute =
            part("minute");

        const second =
            part("second");


        return {

            id:
                "JT-PSB-" +
                year +
                month +
                day +
                "-" +
                hour +
                minute +
                second,

            date:
                day +
                "-" +
                month +
                "-" +
                year,

            time:
                hour +
                ":" +
                minute +
                ":" +
                second

        };

    }


    /* =====================================================
       BAG DETAILS
    ===================================================== */

    function getBagDetails() {

        const details = [];


        document
            .querySelectorAll(
                ".bag-qty"
            )
            .forEach(
                function (input) {

                    const qty =
                        parseInt(
                            input.value,
                            10
                        );


                    if (
                        !isNaN(qty) &&
                        qty > 0
                    ) {

                        details.push(

                            input.dataset.type +
                            " " +
                            input.dataset.size +
                            " = " +
                            qty

                        );

                    }

                }
            );


        if (
            details.length === 0
        ) {

            return "کوئی مقدار منتخب نہیں کی گئی";

        }


        return details.join(
            " | "
        );

    }


    /* =====================================================
       ORDER SUBMIT
    ===================================================== */

    const submitOrder =
        get("submitOrder");


    if (
        submitOrder
    ) {

        submitOrder.addEventListener(
            "click",
            async function () {


                const submitMessage =
                    get("submitMessage");


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                const customerName =
                    clean(
                        get("customerName")?.value
                    );


                const shopName =
                    clean(
                        get("shopName")?.value
                    );


                const phone =
                    clean(
                        get("phone")?.value
                    );


                const address =
                    clean(
                        get("address")?.value
                    );


                const deliveryArea =
                    clean(
                        get("deliveryArea")?.value
                    );


                if (
                    !customerName ||
                    !shopName ||
                    !phone ||
                    !address ||
                    !deliveryArea
                ) {

                    if (
                        submitMessage
                    ) {

                        submitMessage.textContent =
                            "براہِ کرم نام، دکان کا نام، موبائل، مکمل پتہ اور ایریا مکمل کریں۔";

                        submitMessage.className =
                            "submit-message error";

                    }


                    return;

                }


                const totals =
                    calculateTotal();


                if (
                    totals.ldQuantity === 0 &&
                    totals.hdQuantity === 0
                ) {

                    if (
                        submitMessage
                    ) {

                        submitMessage.textContent =
                            "براہِ کرم LD یا HD میں کم از کم ایک مقدار منتخب کریں۔";

                        submitMessage.className =
                            "submit-message error";

                    }


                    return;

                }


                const order =
                    createOrderInfo();


                /* -----------------------------------------
                   EMAIL DATA
                ----------------------------------------- */

                const data = {

                    Order_ID:
                        order.id,

                    Order_Date:
                        order.date,

                    Order_Time:
                        order.time,


                    Customer_Name:
                        customerName,

                    Shop_Name:
                        shopName,

                    Mobile_WhatsApp:
                        phone,

                    Delivery_Address:
                        address,

                    Delivery_Area:
                        deliveryArea,


                    Delivery_Type:
                        totals.deliveryType ===
                        "urgent"
                            ? "Urgent"
                            : "Normal",


                    LD_Quantity:
                        totals.ldQuantity,

                    HD_Quantity:
                        totals.hdQuantity,


                    LD_Subtotal:
                        money(
                            totals.ldSubtotal
                        ),

                    HD_Subtotal:
                        money(
                            totals.hdSubtotal
                        ),

                    Delivery_Charges:
                        money(
                            totals.deliveryCharges
                        ),

                    Grand_Total:
                        money(
                            totals.grandTotal
                        ),


                    Shopper_Bag_Details:
                        getBagDetails(),


                    _subject:
                        "Janjua Traders | PSB NEW ORDER | " +
                        order.id,

                    _template:
                        "table",

                    _captcha:
                        "false"

                };


                /* -----------------------------------------
                   BUTTON
                ----------------------------------------- */

                submitOrder.disabled =
                    true;


                submitOrder.textContent =
                    "Gmail پر بھیجا جا رہا ہے...";


                if (
                    submitMessage
                ) {

                    submitMessage.textContent =
                        "آپ کا آرڈر Gmail پر بھیجا جا رہا ہے، براہِ کرم انتظار کریں...";

                    submitMessage.className =
                        "submit-message success";

                }


                try {


                    const response =
                        await fetch(
                            FORM_URL,
                            {

                                method:
                                    "POST",

                                headers:
                                    {

                                        "Content-Type":
                                            "application/json",

                                        "Accept":
                                            "application/json"

                                    },

                                body:
                                    JSON.stringify(
                                        data
                                    )

                            }
                        );


                    const text =
                        await response.text();


                    let result =
                        null;


                    try {

                        result =
                            JSON.parse(
                                text
                            );

                    }

                    catch (
                        error
                    ) {

                        console.log(
                            "Non JSON response"
                        );

                    }


                    if (
                        !response.ok ||
                        !result ||
                        !(
                            result.success === true ||
                            result.success === "true"
                        )
                    ) {

                        throw new Error(
                            result?.message ||
                            "Gmail submission failed"
                        );

                    }


                    /* -----------------------------------------
                       SUCCESS
                    ----------------------------------------- */

                    if (
                        submitMessage
                    ) {

                        submitMessage.textContent =
                            "✓ آرڈر کامیابی سے Gmail پر پہنچ گیا ہے۔ Order ID: " +
                            order.id;

                        submitMessage.className =
                            "submit-message success";

                    }


                    /* CUSTOMER FIELDS CLEAR */

                    if (
                        get("customerName")
                    ) {

                        get("customerName").value =
                            "";

                    }


                    if (
                        get("shopName")
                    ) {

                        get("shopName").value =
                            "";

                    }


                    if (
                        get("phone")
                    ) {

                        get("phone").value =
                            "";

                    }


                    if (
                        get("address")
                    ) {

                        get("address").value =
                            "";

                    }


                    if (
                        get("deliveryArea")
                    ) {

                        get("deliveryArea").value =
                            "";

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


                    calculateTotal();


                }

                catch (
                    error
                ) {

                    console.error(
                        "PSB Order Error:",
                        error
                    );


                    if (
                        submitMessage
                    ) {

                        submitMessage.textContent =
                            "✗ آرڈر Gmail پر نہیں بھیجا گیا۔ دوبارہ کوشش کریں۔";

                        submitMessage.className =
                            "submit-message error";

                    }

                }

                finally {

                    submitOrder.disabled =
                        false;


                    submitOrder.textContent =
                        "Order Submit کریں";

                }

            }
        );

    }


    /* =====================================================
       HELP DESK
       الگ Gmail Subject
       ===================================================== */

    const helpButton =
        get("sendHelpDesk");


    if (
        helpButton
    ) {

        helpButton.addEventListener(
            "click",
            async function () {


                const helpResult =
                    get("helpResult");


                const name =
                    clean(
                        get("helpName")?.value
                    );


                const contact =
                    clean(
                        get("helpContact")?.value
                    );


                const message =
                    clean(
                        get("helpMessage")?.value
                    );


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (
                    !name ||
                    !contact ||
                    !message
                ) {

                    if (
                        helpResult
                    ) {

                        helpResult.textContent =
                            "براہِ کرم نام، موبائل/WhatsApp اور اپنا پیغام مکمل کریں۔";

                        helpResult.className =
                            "submit-message error";

                    }


                    return;

                }


                const info =
                    createOrderInfo();


                /* -----------------------------------------
                   HELP DESK DATA
                ----------------------------------------- */

                const data = {

                    Message_Type:
                        "HELP DESK / CUSTOMER CONTACT",

                    Date:
                        info.date,

                    Time:
                        info.time,

                    Name:
                        name,

                    Mobile_WhatsApp:
                        contact,

                    Customer_Message:
                        message,


                    _subject:
                        "Janjua Traders | HELP DESK MESSAGE | " +
                        info.id,

                    _template:
                        "table",

                    _captcha:
                        "false"

                };


                /* -----------------------------------------
                   BUTTON
                ----------------------------------------- */

                helpButton.disabled =
                    true;


                helpButton.textContent =
                    "Gmail پر بھیجا جا رہا ہے...";


                if (
                    helpResult
                ) {

                    helpResult.textContent =
                        "آپ کا پیغام Gmail پر بھیجا جا رہا ہے...";

                    helpResult.className =
                        "submit-message success";

                }


                try {


                    const response =
                        await fetch(
                            FORM_URL,
                            {

                                method:
                                    "POST",

                                headers:
                                    {

                                        "Content-Type":
                                            "application/json",

                                        "Accept":
                                            "application/json"

                                    },

                                body:
                                    JSON.stringify(
                                        data
                                    )

                            }
                        );


                    const text =
                        await response.text();


                    let result =
                        null;


                    try {

                        result =
                            JSON.parse(
                                text
                            );

                    }

                    catch (
                        error
                    ) {

                        console.log(
                            "Non JSON response"
                        );

                    }


                    if (
                        !response.ok ||
                        !result ||
                        !(
                            result.success === true ||
                            result.success === "true"
                        )
                    ) {

                        throw new Error(
                            result?.message ||
                            "Help Desk submission failed"
                        );

                    }


                    /* -----------------------------------------
                       HELP SUCCESS
                    ----------------------------------------- */

                    if (
                        helpResult
                    ) {

                        helpResult.textContent =
                            "✓ آپ کا Help Desk پیغام کامیابی سے Gmail پر پہنچ گیا ہے۔";

                        helpResult.className =
                            "submit-message success";

                    }


                    if (
                        get("helpName")
                    ) {

                        get("helpName").value =
                            "";

                    }


                    if (
                        get("helpContact")
                    ) {

                        get("helpContact").value =
                            "";

                    }


                    if (
                        get("helpMessage")
                    ) {

                        get("helpMessage").value =
                            "";

                    }


                }

                catch (
                    error
                ) {

                    console.error(
                        "Help Desk Error:",
                        error
                    );


                    if (
                        helpResult
                    ) {

                        helpResult.textContent =
                            "✗ Help Desk پیغام Gmail پر نہیں بھیجا گیا۔ دوبارہ کوشش کریں۔";

                        helpResult.className =
                            "submit-message error";

                    }

                }

                finally {

                    helpButton.disabled =
                        false;


                    helpButton.textContent =
                        "Help Desk کو پیغام بھیجیں";

                }

            }
        );

    }


    /* =====================================================
       INITIAL CALCULATION
    ===================================================== */

    calculateTotal();


    console.log(
        "Janjua Traders PSB Final JS Loaded."
    );


});
