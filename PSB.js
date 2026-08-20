/* =========================================================
   JANJUA TRADERS
   PSB.JS
   FINAL VERSION
   CENTRAL LD / HD RATE SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const GMAIL_EMAIL = "thanksyou0339@gmail.com";

    const FORM_SUBMIT_URL =
        "https://formsubmit.co/ajax/" + GMAIL_EMAIL;


    /* =====================================================
       CENTRAL RATE SETTINGS
    ===================================================== */

    let CURRENT_LD_RATE = 0;

    let CURRENT_HD_RATE = 0;

    let RATES_LOADED = false;


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


    function getValue(id) {

        const el = get(id);

        return el ? clean(el.value) : "";
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


    function setHidden(form, name, value) {

        let field =
            form.querySelector(
                'input[type="hidden"][name="' + name + '"]'
            );


        if (!field) {

            field =
                document.createElement("input");

            field.type = "hidden";

            field.name = name;

            form.appendChild(field);
        }


        field.value =
            clean(value);


        return field;
    }


    /* =====================================================
       PAKISTAN DATE / TIME
    ===================================================== */

    function pakistanDateTime() {

        const now =
            new Date();


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

            const item =
                parts.find(
                    x => x.type === type
                );

            return item
                ? item.value
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


        const h24 =
            String(hour24)
                .padStart(2, "0");


        return {

            date:
                `${day}-${month}-${year}`,

            time:
                `${hour}:${minute}:${second} ${period}`,

            orderId:
                `JT-PSB-${year}${month}${day}-${h24}${minute}${second}`
        };
    }


    /* =====================================================
       FINAL DELIVERY AREAS
    ===================================================== */

    const areas = [

        "VIP Town",

        "Sabarwal Colony",

        "Fatima Jinnah Colony",

        "Hyderabad Town",

        "Rana Town",

        "Hamdia Colony",

        "Chakian",

        "Dhrema",

        "Mari",

        "Lakhmor",

        "Pitpan Chak",

        "Pachpan Chak Shumali",

        "Chhappan Chak Shumali",

        "Baanway Mor",

        "15 Block",

        "مقامِ حیات کالونی",

        "12 Block",

        "Sharb​​at Chowk"
    ];


    /* =====================================================
       AREA LIST FUNCTION
    ===================================================== */

    function fillAreaSelect(select) {

        if (!select) {
            return;
        }


        const current =
            clean(select.value);


        select.innerHTML = "";


        const first =
            document.createElement("option");


        first.value = "";


        first.textContent =
            "اپنا ایریا منتخب کریں";


        select.appendChild(first);


        areas.forEach(
            function (area) {

                const option =
                    document.createElement("option");


                option.value =
                    area;


                option.textContent =
                    area;


                select.appendChild(option);
            }
        );


        if (
            current &&
            areas.includes(current)
        ) {

            select.value =
                current;
        }
    }


    /* =====================================================
       MAIN DELIVERY AREA
    ===================================================== */

    const deliveryArea =
        get("deliveryArea");


    fillAreaSelect(
        deliveryArea
    );


    if (deliveryArea) {

        deliveryArea.addEventListener(
            "change",
            function () {

                const msg =
                    get("areaMessage");


                if (!msg) {
                    return;
                }


                if (deliveryArea.value) {

                    msg.textContent =
                        "✓ یہ ایریا ہماری Delivery List میں موجود ہے۔";


                    msg.style.display =
                        "block";


                    msg.style.color =
                        "#176b2c";


                    msg.style.background =
                        "#e5f8ea";


                    msg.style.padding =
                        "8px";


                    msg.style.borderRadius =
                        "8px";

                }

                else {

                    msg.style.display =
                        "none";
                }
            }
        );
    }


    /* =====================================================
       TEXT INPUT DIRECTION FIX
    ===================================================== */

    document
        .querySelectorAll(
            "input[type='text'], input[type='tel'], textarea"
        )
        .forEach(
            function (field) {

                field.style.direction =
                    "ltr";


                field.style.textAlign =
                    "left";


                field.style.unicodeBidi =
                    "plaintext";
            }
        );


    /* =====================================================
       QUANTITY INPUT FIX
    ===================================================== */

    document
        .querySelectorAll(".bag-qty")
        .forEach(
            function (input) {

                input.type =
                    "number";


                input.min =
                    "0";


                input.step =
                    "1";


                input.inputMode =
                    "numeric";


                input.style.width =
                    "60px";


                input.style.maxWidth =
                    "60px";


                input.style.textAlign =
                    "center";


                input.style.direction =
                    "ltr";


                input.addEventListener(
                    "input",
                    function () {

                        let value =
                            input.value
                                .replace(/\D/g, "");


                        if (value === "") {

                            input.value =
                                "0";
                        }

                        else {

                            input.value =
                                String(
                                    Math.max(
                                        0,
                                        parseInt(
                                            value,
                                            10
                                        )
                                    )
                                );
                        }


                        calculateBagTotals();
                    }
                );
            }
        );


    /* =====================================================
       DELIVERY CHARGES
    ===================================================== */

    const URGENT_DELIVERY_FEE = 0;


    function getDeliveryCharge() {

        const selected =
            document.querySelector(
                'input[name="deliveryType"]:checked'
            );


        if (
            selected &&
            selected.value === "urgent"
        ) {

            return URGENT_DELIVERY_FEE;
        }


        return 0;
    }


    /* =====================================================
       CALCULATE LD / HD
       CENTRAL RATES ARE USED HERE
    ===================================================== */

    function calculateBagTotals() {

        let ldSubtotal = 0;

        let hdSubtotal = 0;


        /* ---------------------------------------------
           LD
        --------------------------------------------- */

        document
            .querySelectorAll(".ld-qty")
            .forEach(
                function (input) {

                    const qty =
                        parseInt(
                            input.value,
                            10
                        ) || 0;


                    input.dataset.rate =
                        CURRENT_LD_RATE;


                    const rate =
                        CURRENT_LD_RATE;


                    ldSubtotal +=
                        qty * rate;
                }
            );


        /* ---------------------------------------------
           HD
        --------------------------------------------- */

        document
            .querySelectorAll(".hd-qty")
            .forEach(
                function (input) {

                    const qty =
                        parseInt(
                            input.value,
                            10
                        ) || 0;


                    input.dataset.rate =
                        CURRENT_HD_RATE;


                    const rate =
                        CURRENT_HD_RATE;


                    hdSubtotal +=
                        qty * rate;
                }
            );


        const delivery =
            getDeliveryCharge();


        const grandTotal =
            ldSubtotal +
            hdSubtotal +
            delivery;


        /* ---------------------------------------------
           LD DISPLAY
        --------------------------------------------- */

        if (get("ldSubtotal")) {

            get("ldSubtotal").textContent =
                rupees(ldSubtotal);
        }


        if (get("finalLD")) {

            get("finalLD").textContent =
                rupees(ldSubtotal);
        }


        /* ---------------------------------------------
           HD DISPLAY
        --------------------------------------------- */

        if (get("hdSubtotal")) {

            get("hdSubtotal").textContent =
                rupees(hdSubtotal);
        }


        if (get("finalHD")) {

            get("finalHD").textContent =
                rupees(hdSubtotal);
        }


        /* ---------------------------------------------
           DELIVERY
        --------------------------------------------- */

        if (get("deliveryCharges")) {

            get("deliveryCharges").textContent =
                rupees(delivery);
        }


        /* ---------------------------------------------
           FINAL TOTAL
        --------------------------------------------- */

        if (get("grandTotal")) {

            get("grandTotal").textContent =
                rupees(grandTotal);
        }


        return {

            ld:
                ldSubtotal,

            hd:
                hdSubtotal,

            delivery:
                delivery,

            total:
                grandTotal
        };
    }


    /* =====================================================
       CUSTOMER RATE DISPLAY
    ===================================================== */

    function createRateDisplay() {

        if (get("todayRateCard")) {
            return;
        }


        const main =
            document.querySelector(
                "main.container"
            );


        if (!main) {
            return;
        }


        const card =
            document.createElement(
                "section"
            );


        card.id =
            "todayRateCard";


        card.className =
            "card";


        card.style.marginBottom =
            "15px";


        card.style.textAlign =
            "center";


        card.innerHTML = `

            <h2 style="
                margin-bottom:10px;
            ">
                آج کے ریٹس
            </h2>


            <div style="
                display:flex;
                gap:10px;
                justify-content:center;
                flex-wrap:wrap;
            ">


                <div style="
                    padding:12px 18px;
                    border-radius:10px;
                    background:#e8f5e9;
                    min-width:120px;
                ">

                    <strong>
                        LD Rate
                    </strong>


                    <div
                        id="ldRateDisplay"
                        style="
                            font-size:18px;
                            font-weight:bold;
                            margin-top:5px;
                        "
                    >
                        ریٹ لوڈ ہو رہا ہے...
                    </div>

                </div>


                <div style="
                    padding:12px 18px;
                    border-radius:10px;
                    background:#e8f5e9;
                    min-width:120px;
                ">

                    <strong>
                        HD Rate
                    </strong>


                    <div
                        id="hdRateDisplay"
                        style="
                            font-size:18px;
                            font-weight:bold;
                            margin-top:5px;
                        "
                    >
                        ریٹ لوڈ ہو رہا ہے...
                    </div>

                </div>

            </div>


            <p style="
                margin-top:10px;
                margin-bottom:0;
            ">
                تازہ ریٹ کے مطابق آپ کا آرڈر calculate ہوگا۔
            </p>
        `;


        main.prepend(card);
    }


    /* =====================================================
       LOAD CENTRAL RATES
       SOURCE: rates.json
    ===================================================== */

    async function loadRates() {

        try {

            const response =
                await fetch(
                    "rates.json?v=" +
                    Date.now(),
                    {
                        cache:
                            "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "rates.json could not be loaded."
                );
            }


            const rates =
                await response.json();


            const ldRate =
                Number(
                    rates.ldRate
                );


            const hdRate =
                Number(
                    rates.hdRate
                );


            if (
                !Number.isFinite(ldRate) ||
                ldRate < 0
            ) {

                throw new Error(
                    "Invalid LD rate."
                );
            }


            if (
                !Number.isFinite(hdRate) ||
                hdRate < 0
            ) {

                throw new Error(
                    "Invalid HD rate."
                );
            }


            CURRENT_LD_RATE =
                ldRate;


            CURRENT_HD_RATE =
                hdRate;


            RATES_LOADED =
                true;


            /* -----------------------------------------
               SHOW LD RATE
            ----------------------------------------- */

            if (
                get("ldRateDisplay")
            ) {

                get(
                    "ldRateDisplay"
                ).textContent =
                    rupees(
                        CURRENT_LD_RATE
                    ) +
                    " / KG";
            }


            /* -----------------------------------------
               SHOW HD RATE
            ----------------------------------------- */

            if (
                get("hdRateDisplay")
            ) {

                get(
                    "hdRateDisplay"
                ).textContent =
                    rupees(
                        CURRENT_HD_RATE
                    ) +
                    " / KG";
            }


            /* -----------------------------------------
               APPLY LD RATE
            ----------------------------------------- */

            document
                .querySelectorAll(".ld-qty")
                .forEach(
                    function (input) {

                        input.dataset.rate =
                            CURRENT_LD_RATE;
                    }
                );


            /* -----------------------------------------
               APPLY HD RATE
            ----------------------------------------- */

            document
                .querySelectorAll(".hd-qty")
                .forEach(
                    function (input) {

                        input.dataset.rate =
                            CURRENT_HD_RATE;
                    }
                );


            /* Recalculate everything */

            calculateBagTotals();


            console.log(
                "Central rates loaded successfully."
            );


            console.log(
                "LD Rate:",
                CURRENT_LD_RATE
            );


            console.log(
                "HD Rate:",
                CURRENT_HD_RATE
            );
        }


        catch (error) {

            RATES_LOADED =
                false;


            console.error(
                "Rate loading error:",
                error
            );


            if (
                get("ldRateDisplay")
            ) {

                get(
                    "ldRateDisplay"
                ).textContent =
                    "ریٹ دستیاب نہیں";
            }


            if (
                get("hdRateDisplay")
            ) {

                get(
                    "hdRateDisplay"
                ).textContent =
                    "ریٹ دستیاب نہیں";
            }
        }
    }


    /* =====================================================
       CALCULATION EVENTS
    ===================================================== */

    document
        .querySelectorAll(
            ".bag-qty, input[name='deliveryType']"
        )
        .forEach(
            function (element) {

                element.addEventListener(
                    "input",
                    calculateBagTotals
                );


                element.addEventListener(
                    "change",
                    calculateBagTotals
                );
            }
        );


    calculateBagTotals();


    /* =====================================================
       ORDER SUBMIT
    ===================================================== */

    const orderButton =
        get("submitOrder");


    if (orderButton) {

        orderButton.addEventListener(
            "click",
            async function () {

                /* -----------------------------------------
                   RATE CHECK
                ----------------------------------------- */

                if (!RATES_LOADED) {

                    alert(
                        "براہِ کرم چند سیکنڈ انتظار کریں۔ آج کے ریٹس لوڈ ہو رہے ہیں۔"
                    );

                    await loadRates();


                    if (!RATES_LOADED) {

                        alert(
                            "آج کے ریٹس لوڈ نہیں ہو سکے۔ براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔"
                        );

                        return;
                    }
                }


                const name =
                    getValue(
                        "customerName"
                    );


                const shop =
                    getValue(
                        "shopName"
                    );


                const phone =
                    getValue(
                        "phone"
                    );


                const address =
                    getValue(
                        "address"
                    );


                const area =
                    getValue(
                        "deliveryArea"
                    );


                if (!name) {

                    alert(
                        "براہِ کرم اپنا نام لکھیں۔"
                    );

                    return;
                }


                if (!shop) {

                    alert(
                        "براہِ کرم دکان کا نام لکھیں۔"
                    );

                    return;
                }


                if (!phone) {

                    alert(
                        "براہِ کرم موبائل / WhatsApp نمبر لکھیں۔"
                    );

                    return;
                }


                if (!address) {

                    alert(
                        "براہِ کرم مکمل پتہ لکھیں۔"
                    );

                    return;
                }


                if (!area) {

                    alert(
                        "براہِ کرم اپنا Delivery Area منتخب کریں۔"
                    );

                    return;
                }


                const info =
                    pakistanDateTime();


                const totals =
                    calculateBagTotals();


                orderButton.disabled =
                    true;


                orderButton.textContent =
                    "Order Gmail پر بھیجا جا رہا ہے...";


                const form =
                    document.createElement(
                        "form"
                    );


                form.style.display =
                    "none";


                const fields = {

                    Message_Type:
                        "ORDER",

                    Order_ID:
                        info.orderId,

                    Order_Date:
                        info.date,

                    Order_Time:
                        info.time,

                    Customer_Name:
                        name,

                    Shop_Name:
                        shop,

                    Mobile_WhatsApp:
                        phone,

                    Delivery_Address:
                        address,

                    Delivery_Area:
                        area,

                    Delivery_Type:
                        document.querySelector(
                            'input[name="deliveryType"]:checked'
                        )?.value ||
                        "normal",

                    LD_Rate_Per_KG:
                        rupees(
                            CURRENT_LD_RATE
                        ),

                    HD_Rate_Per_KG:
                        rupees(
                            CURRENT_HD_RATE
                        ),

                    LD_Subtotal:
                        rupees(
                            totals.ld
                        ),

                    HD_Subtotal:
                        rupees(
                            totals.hd
                        ),

                    Delivery_Charges:
                        rupees(
                            totals.delivery
                        ),

                    Grand_Total:
                        rupees(
                            totals.total
                        ),

                    Platform:
                        "Janjua Traders PSB",

                    _subject:
                        "JANJUA TRADERS | NEW PSB ORDER | " +
                        info.orderId,

                    _template:
                        "table",

                    _captcha:
                        "false"
                };


                document
                    .querySelectorAll(
                        ".bag-qty"
                    )
                    .forEach(
                        function (
                            input,
                            index
                        ) {

                            fields[
                                "Bag_" +
                                (index + 1)
                            ] =

                                `${input.dataset.type || ""} | ${input.dataset.size || ""} | Quantity: ${input.value || 0}`;
                        }
                    );


                Object.keys(fields)
                    .forEach(
                        function (key) {

                            setHidden(
                                form,
                                key,
                                fields[key]
                            );
                        }
                    );


                document.body.appendChild(
                    form
                );


                try {

                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        Object.fromEntries(
                                            new FormData(
                                                form
                                            )
                                        )
                                    )
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Gmail submission failed"
                        );
                    }


                    const result =
                        get(
                            "submitMessage"
                        );


                    if (result) {

                        result.textContent =
                            "✓ آپ کا Order کامیابی سے Gmail پر بھیج دیا گیا ہے۔ Order ID: " +
                            info.orderId;


                        result.style.display =
                            "block";


                        result.style.color =
                            "#176b2c";
                    }

                }


                catch (error) {

                    console.error(
                        error
                    );


                    const result =
                        get(
                            "submitMessage"
                        );


                    if (result) {

                        result.textContent =
                            "✗ Order Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";


                        result.style.display =
                            "block";


                        result.style.color =
                            "#9a1c1c";
                    }

                }


                finally {

                    form.remove();


                    orderButton.disabled =
                        false;


                    orderButton.textContent =
                        "Order Submit کریں";
                }
            }
        );
    }


    /* =====================================================
       HELP DESK
    ===================================================== */

    function createHelpDesk() {

        if (
            get("helpDeskCard")
        ) {

            return;
        }


        const main =
            document.querySelector(
                "main.container"
            );


        if (!main) {
            return;
        }


        const card =
            document.createElement(
                "section"
            );


        card.id =
            "helpDeskCard";


        card.className =
            "card help-desk-card";


        card.innerHTML = `

            <h2 class="help-title">
                Help Desk Center
            </h2>


            <p>
                اپنی شکایت، کسی مسئلے، رابطے یا کسی جائز
                معلومات / کام کی درخواست کے لیے نیچے اپنا
                پیغام درج کریں۔
            </p>


            <label for="helpName">
                اپنا نام
                <span class="help-required">*</span>
            </label>


            <input
                id="helpName"
                type="text"
                placeholder="اپنا نام لکھیں"
                required
            >


            <label for="helpPhone">
                Mobile / WhatsApp نمبر
                <span class="help-required">*</span>
            </label>


            <input
                id="helpPhone"
                type="tel"
                inputmode="tel"
                placeholder="03XXXXXXXXX"
                required
            >


            <label for="helpArea">
                اپنا ایریا
                <span class="help-required">*</span>
            </label>


            <select
                id="helpArea"
                required
            >

                <option value="">
                    اپنا ایریا منتخب کریں
                </option>

            </select>


            <label for="helpMessage">
                آپ کا پیغام
                <span class="help-required">*</span>
            </label>


            <textarea
                id="helpMessage"
                placeholder="یہاں اپنی شکایت، مسئلہ، رابطے یا کسی جائز کام کی درخواست لکھیں..."
                required
            ></textarea>


            <button
                id="helpSendButton"
                type="button"
                class="submit-button help-send-button"
            >
                Help Desk Message Send کریں
            </button>


            <div
                id="helpResult"
                class="submit-message"
                style="display:none;"
            ></div>
        `;


        main.appendChild(
            card
        );


        const helpArea =
            get(
                "helpArea"
            );


        fillAreaSelect(
            helpArea
        );


        /* ---------------------------------------------
           TEXT CURSOR FIX
        --------------------------------------------- */

        [
            get("helpName"),
            get("helpPhone"),
            get("helpMessage")
        ]

        .filter(Boolean)

        .forEach(
            function (field) {

                field.style.direction =
                    "ltr";


                field.style.textAlign =
                    "left";


                field.style.unicodeBidi =
                    "plaintext";
            }
        );


        /* ---------------------------------------------
           HELP SEND
        --------------------------------------------- */

        const helpButton =
            get(
                "helpSendButton"
            );


        helpButton.addEventListener(
            "click",
            async function () {

                const name =
                    getValue(
                        "helpName"
                    );


                const phone =
                    getValue(
                        "helpPhone"
                    );


                const area =
                    getValue(
                        "helpArea"
                    );


                const message =
                    getValue(
                        "helpMessage"
                    );


                if (!name) {

                    alert(
                        "براہِ کرم اپنا نام لکھیں۔"
                    );

                    return;
                }


                if (!phone) {

                    alert(
                        "براہِ کرم اپنا Mobile / WhatsApp نمبر لکھیں۔"
                    );

                    return;
                }


                if (!area) {

                    alert(
                        "براہِ کرم اپنا Area منتخب کریں۔"
                    );

                    return;
                }


                if (!message) {

                    alert(
                        "براہِ کرم اپنا پیغام لکھیں۔"
                    );

                    return;
                }


                const info =
                    pakistanDateTime();


                helpButton.disabled =
                    true;


                helpButton.textContent =
                    "Help Desk Message Gmail پر بھیجا جا رہا ہے...";


                const helpForm =
                    document.createElement(
                        "form"
                    );


                helpForm.style.display =
                    "none";


                const helpId =
                    `JT-HD-${info.orderId}`;


                const fields = {

                    Message_Type:
                        "HELP DESK MESSAGE",

                    Help_Desk_ID:
                        helpId,

                    Date:
                        info.date,

                    Time:
                        info.time,

                    Customer_Name:
                        name,

                    Mobile_WhatsApp:
                        phone,

                    Area:
                        area,

                    Customer_Message:
                        message,

                    Department:
                        "Janjua Traders Help Desk",

                    _subject:
                        "HELP DESK MESSAGE | JANJUA TRADERS | " +
                        helpId,

                    _template:
                        "table",

                    _captcha:
                        "false"
                };


                Object.keys(fields)
                    .forEach(
                        function (key) {

                            setHidden(
                                helpForm,
                                key,
                                fields[key]
                            );
                        }
                    );


                document.body.appendChild(
                    helpForm
                );


                try {

                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        Object.fromEntries(
                                            new FormData(
                                                helpForm
                                            )
                                        )
                                    )
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Help Desk submission failed"
                        );
                    }


                    const result =
                        get(
                            "helpResult"
                        );


                    if (result) {

                        result.textContent =
                            "✓ آپ کا Help Desk Message کامیابی سے Gmail پر بھیج دیا گیا ہے۔";


                        result.style.display =
                            "block";


                        result.style.color =
                            "#176b2c";
                    }


                    get(
                        "helpName"
                    ).value = "";


                    get(
                        "helpPhone"
                    ).value = "";


                    get(
                        "helpArea"
                    ).value = "";


                    get(
                        "helpMessage"
                    ).value = "";
                }


                catch (error) {

                    console.error(
                        "Help Desk Error:",
                        error
                    );


                    const result =
                        get(
                            "helpResult"
                        );


                    if (result) {

                        result.textContent =
                            "✗ Help Desk Message Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";


                        result.style.display =
                            "block";


                        result.style.color =
                            "#9a1c1c";
                    }
                }


                finally {

                    helpForm.remove();


                    helpButton.disabled =
                        false;


                    helpButton.textContent =
                        "Help Desk Message Send کریں";
                }
            }
        );
    }


    /* =====================================================
       START RATE SYSTEM
    ===================================================== */

    createRateDisplay();


    loadRates();


    /* =====================================================
       START HELP DESK
    ===================================================== */

    createHelpDesk();


    /* =====================================================
       FINAL CONSOLE
    ===================================================== */

    console.log(
        "Janjua Traders PSB FINAL JS loaded."
    );


    console.log(
        "Central LD / HD Rate System ACTIVE."
    );


    console.log(
        "Customer Rate Display ACTIVE."
    );


    console.log(
        "Delivery areas updated."
    );


    console.log(
        "Quantity alignment fixed."
    );


    console.log(
        "Text cursor direction fixed."
    );


    console.log(
        "Separate Help Desk ACTIVE."
    );

});
