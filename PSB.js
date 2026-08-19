/* =========================================================
   JANJUA TRADERS
   PSB.JS
   FINAL VERSION
   ORDER + SEPARATE HELP DESK
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

        const element = get(id);

        if (!element) {
            return "";
        }

        return clean(element.value);
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

        const field =
            document.createElement("input");

        field.type = "hidden";
        field.name = name;
        field.value = clean(value);

        form.appendChild(field);

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


        return {

            date:
                `${day}-${month}-${year}`,

            time:
                `${hour}:${minute}:${second} ${period}`,

            orderId:
                `JT-PSB-${year}${month}${day}-${hour}${minute}${second}`
        };
    }


    /* =====================================================
       DELIVERY AREAS
    ===================================================== */

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

        "55 Chak Shumali",

        "56 Chak Shumali",

        "92 Mor",

        "Maqam Hayat",

        "Sherpur Chowk",

        "Churanja Chak"

    ];


    /* =====================================================
       AREA SELECT
    ===================================================== */

    function fillAreaSelect(selectElement) {

        if (!selectElement) {
            return;
        }


        const current =
            clean(selectElement.value);


        selectElement.innerHTML = "";


        const firstOption =
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "اپنا ایریا منتخب کریں";

        selectElement.appendChild(
            firstOption
        );


        areas.forEach(function (area) {

            const option =
                document.createElement("option");

            option.value = area;

            option.textContent = area;

            selectElement.appendChild(
                option
            );
        });


        if (current) {
            selectElement.value = current;
        }
    }


    const deliveryArea =
        get("deliveryArea");


    fillAreaSelect(deliveryArea);


    /* =====================================================
       AREA MESSAGE
    ===================================================== */

    if (deliveryArea) {

        deliveryArea.addEventListener(
            "change",
            function () {

                const message =
                    get("areaMessage");


                if (!message) {
                    return;
                }


                if (deliveryArea.value) {

                    message.textContent =
                        "✓ یہ ایریا ہماری Delivery List میں موجود ہے۔";

                    message.style.display =
                        "block";

                    message.style.color =
                        "#176b2c";

                    message.style.background =
                        "#e5f8ea";

                    message.style.padding =
                        "8px";

                    message.style.borderRadius =
                        "8px";

                } else {

                    message.style.display =
                        "none";
                }
            }
        );
    }


    /* =====================================================
       QUANTITY INPUT
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
                        String(input.value)
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


                    calculateTotals();
                }
            );
        });


    /* =====================================================
       DELIVERY CHARGE
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
       CALCULATE LD / HD / GRAND TOTAL
    ===================================================== */

    function calculateTotals() {

        let ldSubtotal = 0;

        let hdSubtotal = 0;


        /* -------------------------------
           LD
        ------------------------------- */

        document
            .querySelectorAll(".ld-qty")
            .forEach(function (input) {

                const quantity =
                    parseInt(
                        input.value,
                        10
                    ) || 0;


                const rate =
                    parseFloat(
                        input.dataset.rate || "0"
                    ) || 0;


                ldSubtotal +=
                    quantity * rate;
            });


        /* -------------------------------
           HD
        ------------------------------- */

        document
            .querySelectorAll(".hd-qty")
            .forEach(function (input) {

                const quantity =
                    parseInt(
                        input.value,
                        10
                    ) || 0;


                const rate =
                    parseFloat(
                        input.dataset.rate || "0"
                    ) || 0;


                hdSubtotal +=
                    quantity * rate;
            });


        const deliveryCharge =
            getDeliveryCharge();


        const grandTotal =
            ldSubtotal +
            hdSubtotal +
            deliveryCharge;


        /* -------------------------------
           DISPLAY
        ------------------------------- */

        const ldSubtotalElement =
            get("ldSubtotal");


        const hdSubtotalElement =
            get("hdSubtotal");


        const finalLDElement =
            get("finalLD");


        const finalHDElement =
            get("finalHD");


        const deliveryElement =
            get("deliveryCharges");


        const grandElement =
            get("grandTotal");


        if (ldSubtotalElement) {

            ldSubtotalElement.textContent =
                rupees(ldSubtotal);
        }


        if (hdSubtotalElement) {

            hdSubtotalElement.textContent =
                rupees(hdSubtotal);
        }


        if (finalLDElement) {

            finalLDElement.textContent =
                rupees(ldSubtotal);
        }


        if (finalHDElement) {

            finalHDElement.textContent =
                rupees(hdSubtotal);
        }


        if (deliveryElement) {

            deliveryElement.textContent =
                rupees(deliveryCharge);
        }


        if (grandElement) {

            grandElement.textContent =
                rupees(grandTotal);
        }


        return {

            ld: ldSubtotal,

            hd: hdSubtotal,

            delivery:
                deliveryCharge,

            total:
                grandTotal
        };
    }


    /* =====================================================
       TOTAL EVENTS
    ===================================================== */

    document
        .querySelectorAll(
            ".bag-qty, input[name='deliveryType']"
        )
        .forEach(function (element) {

            element.addEventListener(
                "input",
                calculateTotals
            );


            element.addEventListener(
                "change",
                calculateTotals
            );
        });


    calculateTotals();


    /* =====================================================
       PRODUCT RATE DISPLAY
    ===================================================== */

    function updateRateDisplays() {

        const ldInputs =
            document.querySelectorAll(
                ".ld-qty"
            );


        const hdInputs =
            document.querySelectorAll(
                ".hd-qty"
            );


        let ldRate = 0;

        let hdRate = 0;


        ldInputs.forEach(function (input) {

            const rate =
                parseFloat(
                    input.dataset.rate || "0"
                ) || 0;


            if (rate > 0) {
                ldRate = rate;
            }
        });


        hdInputs.forEach(function (input) {

            const rate =
                parseFloat(
                    input.dataset.rate || "0"
                ) || 0;


            if (rate > 0) {
                hdRate = rate;
            }
        });


        const ldDisplay =
            get("ldRateDisplay");


        const hdDisplay =
            get("hdRateDisplay");


        if (
            ldDisplay &&
            ldRate > 0
        ) {

            ldDisplay.textContent =
                rupees(ldRate) + " / KG";
        }


        if (
            hdDisplay &&
            hdRate > 0
        ) {

            hdDisplay.textContent =
                rupees(hdRate) + " / KG";
        }
    }


    updateRateDisplays();


    /* =====================================================
       ORDER BUTTON
    ===================================================== */

    const orderButton =
        get("submitOrder");


    if (orderButton) {

        orderButton.addEventListener(
            "click",
            async function () {


                /* ---------------------------
                   CUSTOMER DATA
                --------------------------- */

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


                /* ---------------------------
                   VALIDATION
                --------------------------- */

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
                    calculateTotals();


                orderButton.disabled =
                    true;


                orderButton.textContent =
                    "Order Gmail پر بھیجا جا رہا ہے...";


                /* ---------------------------
                   CREATE FORM
                --------------------------- */

                const form =
                    document.createElement("form");


                form.style.display =
                    "none";


                /* ---------------------------
                   ORDER DATA
                --------------------------- */

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


                /* ---------------------------
                   BAG DETAILS
                --------------------------- */

                document
                    .querySelectorAll(".bag-qty")
                    .forEach(function (input, index) {

                        const type =
                            input.dataset.type || "";


                        const size =
                            input.dataset.size || "";


                        const quantity =
                            input.value || "0";


                        fields[
                            "Bag_" +
                            (index + 1)
                        ] =
                            type +
                            " | Size: " +
                            size +
                            " | Quantity: " +
                            quantity;
                    });


                /* ---------------------------
                   ADD HIDDEN FIELDS
                --------------------------- */

                Object.keys(fields)
                    .forEach(function (key) {

                        setHidden(
                            form,
                            key,
                            fields[key]
                        );
                    });


                document.body.appendChild(
                    form
                );


                /* ---------------------------
                   SEND ORDER
                --------------------------- */

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
                            "Order submission failed"
                        );
                    }


                    const result =
                        get("submitMessage");


                    if (result) {

                        result.textContent =
                            "✓ آپ کا Order کامیابی سے Gmail پر بھیج دیا گیا ہے۔ Order ID: " +
                            info.orderId;

                        result.style.display =
                            "block";

                        result.style.color =
                            "#176b2c";

                        result.style.background =
                            "#e4f7e9";
                    }


                }

                catch (error) {

                    console.error(
                        "Order Error:",
                        error
                    );


                    const result =
                        get("submitMessage");


                    if (result) {

                        result.textContent =
                            "✗ Order Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                        result.style.display =
                            "block";

                        result.style.color =
                            "#9a1c1c";

                        result.style.background =
                            "#ffe7e7";
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
       COMPLETELY SEPARATE FROM ORDER
       ===================================================== */

    function createHelpDesk() {

        if (get("helpDeskCard")) {
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
                معلومات / کام کی درخواست کے لیے نیچے
                اپنا پیغام درج کریں۔
            </p>


            <label for="helpName">

                اپنا نام

                <span class="help-required">
                    *
                </span>

            </label>


            <input
                id="helpName"
                type="text"
                placeholder="اپنا نام لکھیں"
                required
            >


            <label for="helpPhone">

                موبائل / WhatsApp نمبر

                <span class="help-required">
                    *
                </span>

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

                <span class="help-required">
                    *
                </span>

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

                آپ کا مسئلہ / پیغام

                <span class="help-required">
                    *
                </span>

            </label>


            <textarea
                id="helpMessage"
                placeholder="اپنی شکایت، مسئلہ، رابطے کی درخواست، اضافی معلومات یا کسی جائز کام کی درخواست یہاں لکھیں..."
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


        /* =================================================
           HELP AREA LIST
        ================================================= */

        const helpArea =
            get("helpArea");


        fillAreaSelect(helpArea);


        /* =================================================
           HELP SEND
        ================================================= */

        const helpButton =
            get("helpSendButton");


        if (!helpButton) {
            return;
        }


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


                /* ---------------------------
                   VALIDATION
                --------------------------- */

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
                        "براہِ کرم اپنا مسئلہ / پیغام لکھیں۔"
                    );

                    return;
                }


                const info =
                    pakistanDateTime();


                const helpId =
                    "JT-HD-" +
                    info.orderId;


                helpButton.disabled =
                    true;


                helpButton.textContent =
                    "Help Desk Gmail پر بھیجا جا رہا ہے...";


                /* ---------------------------
                   HELP FORM
                --------------------------- */

                const helpForm =
                    document.createElement("form");


                helpForm.style.display =
                    "none";


                /* ---------------------------
                   HELP DATA
                --------------------------- */

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

                    Platform:
                        "Janjua Traders PSB",

                    _subject:
                        "HELP DESK MESSAGE | JANJUA TRADERS | " +
                        helpId,

                    _template:
                        "table",

                    _captcha:
                        "false"
                };


                /* ---------------------------
                   ADD FIELDS
                --------------------------- */

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


                /* ---------------------------
                   SEND HELP DESK
                --------------------------- */

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


                    if (result) {

                        result.textContent =
                            "✓ آپ کا Help Desk Message کامیابی سے Gmail پر بھیج دیا گیا ہے۔";

                        result.style.display =
                            "block";

                        result.style.color =
                            "#176b2c";

                        result.style.background =
                            "#e4f7e9";
                    }


                    /* -----------------------
                       CLEAR HELP FORM ONLY
                    ----------------------- */

                    const helpName =
                        get("helpName");


                    const helpPhone =
                        get("helpPhone");


                    const helpArea =
                        get("helpArea");


                    const helpMessage =
                        get("helpMessage");


                    if (helpName) {
                        helpName.value = "";
                    }


                    if (helpPhone) {
                        helpPhone.value = "";
                    }


                    if (helpArea) {
                        helpArea.value = "";
                    }


                    if (helpMessage) {
                        helpMessage.value = "";
                    }


                }

                catch (error) {

                    console.error(
                        "Help Desk Error:",
                        error
                    );


                    const result =
                        get("helpResult");


                    if (result) {

                        result.textContent =
                            "✗ Help Desk Message Gmail پر نہیں بھیجا جا سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

                        result.style.display =
                            "block";

                        result.style.color =
                            "#9a1c1c";

                        result.style.background =
                            "#ffe7e7";
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
       START HELP DESK
    ===================================================== */

    createHelpDesk();


    /* =====================================================
       FINAL STATUS
    ===================================================== */

    console.log(
        "Janjua Traders PSB JS loaded successfully."
    );

    console.log(
        "Order System: ACTIVE"
    );

    console.log(
        "Help Desk: ACTIVE"
    );

    console.log(
        "Delivery Areas: ACTIVE"
    );

    console.log(
        "LD / HD Totals: ACTIVE"
    );

});
