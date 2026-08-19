/* =========================================================
   JANJUA TRADERS
   PSB.JS
   FINAL POLYTHENE SHOPPER BAG SYSTEM

   ORDER + SEPARATE HELP DESK

   Gmail:
   ORDER  -> normal order subject
   HELP   -> separate HELP DESK MESSAGE subject
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

        const el = get(id);

        if (!el) {
            return "";
        }

        return clean(el.value);
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


    /* =====================================================
       PAKISTAN DATE / TIME
    ===================================================== */

    function pakistanDateTime() {

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
                    item => item.type === type
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


        const date =
            `${day}-${month}-${year}`;


        const time =
            `${hour}:${minute}:${second} ${period}`;


        return {

            date: date,

            time: time,

            orderId:
                `JT-PSB-${year}${month}${day}-${h24}${minute}${second}`
        };
    }


    /* =====================================================
       HEADER CLEANUP
    ===================================================== */

    const header =
        document.querySelector(".main-header");


    if (header) {

        const brand =
            header.querySelector(".brand-name");


        if (brand) {

            brand.textContent =
                "JANJUA TRADERS";

            brand.style.fontWeight = "900";
            brand.style.fontSize = "28px";
            brand.style.textAlign = "center";
            brand.style.animation =
                "janjuaPulse 2.4s ease-in-out infinite";
        }


        const subtitle =
            header.querySelector(".brand-subtitle");


        if (subtitle) {

            subtitle.textContent =
                "Polythene Shopper Bags";

            subtitle.style.fontSize = "15px";
        }


        const oldLogo =
            header.querySelector(".logo-placeholder");


        if (oldLogo) {

            oldLogo.textContent =
                "JANJUA";

            oldLogo.style.fontWeight = "900";
        }
    }


    /* =====================================================
       MOBILE HEADER ANIMATION
    ===================================================== */

    if (!document.getElementById("psbAnimationStyle")) {

        const style =
            document.createElement("style");

        style.id = "psbAnimationStyle";

        style.textContent = `

            @keyframes janjuaPulse {

                0% {
                    transform: scale(1);
                    opacity: .88;
                }

                50% {
                    transform: scale(1.035);
                    opacity: 1;
                }

                100% {
                    transform: scale(1);
                    opacity: .88;
                }
            }

            html,
            body {
                max-width: 100%;
                overflow-x: hidden !important;
            }

            .container {
                width: min(920px, 94%);
                max-width: 100%;
            }

            .card,
            .instruction-card {
                max-width: 100%;
                overflow: hidden;
            }

            .help-desk-card {
                width: 100%;
                max-width: 100%;
                overflow: hidden;
            }

            .help-desk-card textarea {
                width: 100%;
                min-height: 115px;
                resize: vertical;
            }

            .help-required {
                color: #b00020;
                font-weight: 800;
            }

            .help-title {
                font-weight: 900;
            }

            @media (max-width: 500px) {

                .main-header {
                    padding: 12px 9px !important;
                }

                .brand-name {
                    font-size: 23px !important;
                }

                .brand-subtitle {
                    font-size: 13px !important;
                }

                .instruction-card {
                    margin: 10px auto !important;
                    padding: 12px !important;
                    width: calc(100% - 16px) !important;
                    border-radius: 13px !important;
                }

                .instruction-card h2 {
                    font-size: 17px !important;
                    margin-bottom: 7px !important;
                }

                .instruction-card p {
                    font-size: 12px !important;
                    line-height: 1.55 !important;
                    margin: 5px 0 !important;
                }

                .help-desk-card {
                    padding: 14px !important;
                    border-radius: 14px !important;
                }

                .help-desk-card h2 {
                    font-size: 19px !important;
                }

                .help-desk-card input,
                .help-desk-card select,
                .help-desk-card textarea {
                    font-size: 15px !important;
                    padding: 11px !important;
                }

                .help-send-button {
                    font-size: 16px !important;
                    padding: 13px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }


    /* =====================================================
       COMPACT TERMS / INSTRUCTIONS
    ===================================================== */

    const instructionCard =
        document.querySelector(".instruction-card");


    if (instructionCard) {

        instructionCard.style.maxWidth = "100%";
        instructionCard.style.boxSizing = "border-box";


        const list =
            instructionCard.querySelector(
                ".instruction-list"
            );


        if (list) {

            list.style.maxWidth = "100%";
            list.style.overflowWrap = "break-word";
        }
    }


    /* =====================================================
       DELIVERY AREAS
    ===================================================== */

    const deliveryArea =
        get("deliveryArea");


    const areas = [

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

        "Lakhmor",

        "Pitpan Chak",

        "Pachpan Chak Shumali",

        "Chhappan Chak Shumali",

        "Baanway Mor",

        "Churanja Chak"

    ];


    if (deliveryArea) {

        const current =
            clean(deliveryArea.value);


        deliveryArea.innerHTML = "";

        const first =
            document.createElement("option");

        first.value = "";

        first.textContent =
            "اپنا ایریا منتخب کریں";

        deliveryArea.appendChild(first);


        areas.forEach(function (area) {

            const option =
                document.createElement("option");

            option.value = area;

            option.textContent = area;

            deliveryArea.appendChild(option);
        });


        if (current) {
            deliveryArea.value = current;
        }
    }


    /* =====================================================
       AREA MESSAGE
    ===================================================== */

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

                    msg.style.display = "block";
                    msg.style.color = "#176b2c";
                    msg.style.background = "#e5f8ea";
                    msg.style.padding = "8px";
                    msg.style.borderRadius = "8px";

                } else {

                    msg.style.display = "none";
                }
            }
        );
    }


    /* =====================================================
       QUANTITY INPUT FIX
    ===================================================== */

    document
        .querySelectorAll(".bag-qty")
        .forEach(function (input) {

            input.type = "number";
            input.min = "0";
            input.step = "1";

            input.addEventListener(
                "input",
                function () {

                    let value =
                        input.value
                            .replace(/\D/g, "");

                    if (value === "") {

                        input.value = "0";

                    } else {

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
                }
            );
        });


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
       EXISTING CALCULATION SUPPORT
    ===================================================== */

    function calculateBagTotals() {

        let ldSubtotal = 0;
        let hdSubtotal = 0;


        document
            .querySelectorAll(".ld-qty")
            .forEach(function (input) {

                const qty =
                    parseInt(
                        input.value,
                        10
                    ) || 0;

                const rate =
                    parseFloat(
                        input.dataset.rate || 0
                    );

                ldSubtotal +=
                    qty * rate;
            });


        document
            .querySelectorAll(".hd-qty")
            .forEach(function (input) {

                const qty =
                    parseInt(
                        input.value,
                        10
                    ) || 0;

                const rate =
                    parseFloat(
                        input.dataset.rate || 0
                    );

                hdSubtotal +=
                    qty * rate;
            });


        const ld =
            get("ldSubtotal");

        const hd =
            get("hdSubtotal");

        const finalLD =
            get("finalLD");

        const finalHD =
            get("finalHD");

        const delivery =
            get("deliveryCharges");

        const grand =
            get("grandTotal");


        if (ld) {
            ld.textContent =
                rupees(ldSubtotal);
        }


        if (hd) {
            hd.textContent =
                rupees(hdSubtotal);
        }


        if (finalLD) {
            finalLD.textContent =
                rupees(ldSubtotal);
        }


        if (finalHD) {
            finalHD.textContent =
                rupees(hdSubtotal);
        }


        const deliveryCharge =
            getDeliveryCharge();


        if (delivery) {
            delivery.textContent =
                rupees(deliveryCharge);
        }


        if (grand) {

            grand.textContent =
                rupees(
                    ldSubtotal +
                    hdSubtotal +
                    deliveryCharge
                );
        }


        return {

            ld: ldSubtotal,

            hd: hdSubtotal,

            delivery:
                deliveryCharge,

            total:
                ldSubtotal +
                hdSubtotal +
                deliveryCharge
        };
    }


    document
        .querySelectorAll(
            ".bag-qty, input[name='deliveryType']"
        )
        .forEach(function (element) {

            element.addEventListener(
                "input",
                calculateBagTotals
            );

            element.addEventListener(
                "change",
                calculateBagTotals
            );
        });


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

                const name =
                    getValue("customerName");

                const shop =
                    getValue("shopName");

                const phone =
                    getValue("phone");

                const address =
                    getValue("address");

                const area =
                    getValue("deliveryArea");


                if (!name) {

                    alert("براہِ کرم اپنا نام لکھیں۔");
                    return;
                }


                if (!shop) {

                    alert("براہِ کرم دکان کا نام لکھیں۔");
                    return;
                }


                if (!phone) {

                    alert("براہِ کرم موبائل / WhatsApp نمبر لکھیں۔");
                    return;
                }


                if (!address) {

                    alert("براہِ کرم مکمل پتہ لکھیں۔");
                    return;
                }


                if (!area) {

                    alert("براہِ کرم اپنا Delivery Area منتخب کریں۔");
                    return;
                }


                const info =
                    pakistanDateTime();


                const totals =
                    calculateBagTotals();


                orderButton.disabled = true;

                orderButton.textContent =
                    "Order Gmail پر بھیجا جا رہا ہے...";


                const form =
                    document.createElement("form");


                form.style.display = "none";


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
                        )?.value || "normal",

                    LD_Subtotal:
                        rupees(totals.ld),

                    HD_Subtotal:
                        rupees(totals.hd),

                    Delivery_Charges:
                        rupees(totals.delivery),

                    Grand_Total:
                        rupees(totals.total),

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
                    .querySelectorAll(".bag-qty")
                    .forEach(function (input, index) {

                        fields[
                            "Bag_" + (index + 1)
                        ] =
                            `${input.dataset.type || ""} | ${input.dataset.size || ""} | Quantity: ${input.value || 0}`;
                    });


                Object.keys(fields)
                    .forEach(function (key) {

                        setHidden(
                            form,
                            key,
                            fields[key]
                        );
                    });


                document.body.appendChild(form);


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


                    if (!response.ok) {
                        throw new Error(
                            "Gmail submission failed"
                        );
                    }


                    const result =
                        get("submitMessage");


                    if (result) {

                        result.textContent =
                            "✓ آپ کا Order کامیابی سے Gmail پر بھیج دیا گیا ہے۔ Order ID: " +
                            info.orderId;

                        result.style.display = "block";
                        result.style.color = "#176b2c";
                    }


                }

                catch (error) {

                    console.error(error);

                    const result =
                        get("submitMessage");


                    if (result) {

                        result.textContent =
                            "✗ Order Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                        result.style.display = "block";
                        result.style.color = "#9a1c1c";
                    }

                }

                finally {

                    form.remove();

                    orderButton.disabled = false;

                    orderButton.textContent =
                        "Order Submit کریں";
                }
            }
        );
    }


    /* =====================================================
       CREATE HELP DESK
       COMPLETELY SEPARATE FROM ORDER
    ===================================================== */

    function createHelpDesk() {

        if (get("helpDeskCard")) {
            return;
        }


        const main =
            document.querySelector("main.container");


        if (!main) {
            return;
        }


        const card =
            document.createElement("section");


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


        main.appendChild(card);


        /* ---------------------------------------------
           HELP DESK AREAS
        --------------------------------------------- */

        const helpArea =
            get("helpArea");


        areas.forEach(function (area) {

            const option =
                document.createElement("option");

            option.value = area;
            option.textContent = area;

            helpArea.appendChild(option);
        });


        /* ---------------------------------------------
           HELP DESK SEND
        --------------------------------------------- */

        const helpButton =
            get("helpSendButton");


        helpButton.addEventListener(
            "click",
            async function () {

                const name =
                    getValue("helpName");

                const phone =
                    getValue("helpPhone");

                const area =
                    getValue("helpArea");

                const message =
                    getValue("helpMessage");


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


                helpButton.disabled = true;

                helpButton.textContent =
                    "Help Desk Message Gmail پر بھیجا جا رہا ہے...";


                const helpForm =
                    document.createElement("form");


                helpForm.style.display = "none";


                const fields = {

                    Message_Type:
                        "HELP DESK MESSAGE",

                    Help_Desk_ID:
                        `JT-HD-${info.orderId}`,

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
                        `JT-HD-${info.orderId}`,

                    _template:
                        "table",

                    _captcha:
                        "false"
                };


                Object.keys(fields)
                    .forEach(function (key) {

                        setHidden(
                            helpForm,
                            key,
                            fields[key]
                        );
                    });


                document.body.appendChild(
                    helpForm
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
                        get("helpResult");


                    result.textContent =
                        "✓ آپ کا Help Desk Message کامیابی سے Gmail پر بھیج دیا گیا ہے۔";

                    result.style.display =
                        "block";

                    result.style.color =
                        "#176b2c";


                    /* Clear Help Desk only */

                    get("helpName").value = "";

                    get("helpPhone").value = "";

                    get("helpArea").value = "";

                    get("helpMessage").value = "";


                }

                catch (error) {

                    console.error(
                        "Help Desk Error:",
                        error
                    );


                    const result =
                        get("helpResult");


                    result.textContent =
                        "✗ Help Desk Message Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                    result.style.display =
                        "block";

                    result.style.color =
                        "#9a1c1c";
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


    createHelpDesk();


    /* =====================================================
       FINAL
    ===================================================== */

    console.log(
        "Janjua Traders PSB FINAL JS loaded."
    );

    console.log(
        "Order system: ACTIVE"
    );

    console.log(
        "Separate Help Desk: ACTIVE"
    );

    console.log(
        "Gmail destination:",
        GMAIL_EMAIL
    );

});
