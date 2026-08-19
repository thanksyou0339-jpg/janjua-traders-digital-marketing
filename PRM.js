/* =========================================================
   JANJUA TRADERS
   PRM.JS
   PRIVATE RATE MANAGER
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

/*
   IMPORTANT:

   یہ Private Rate Manager صرف rates.json کو پڑھنے
   اور rate update کرنے کے لیے بنایا گیا ہے۔

   GitHub Token اس JavaScript file میں شامل نہیں کیا جائے گا۔

   Publish functionality بعد میں GitHub Actions / API
   کے محفوظ طریقے سے connect کی جائے گی۔
*/


const RATES_FILE = "rates.json";


/* =========================================================
   ELEMENT HELPERS
   ========================================================= */

function get(id) {

    return document.getElementById(id);

}


/* =========================================================
   RATE FORMAT
   ========================================================= */

function formatRate(value) {

    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {

        return "Rs. —";

    }


    return "Rs. " +
        number.toLocaleString(
            "en-PK",
            {
                maximumFractionDigits: 0
            }
        );

}


/* =========================================================
   CLEAN RATE
   ========================================================= */

function cleanRate(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return null;

    }


    const number =
        Number(value);


    if (
        !Number.isFinite(number) ||
        number < 0
    ) {

        return null;

    }


    return Math.round(number);

}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function showMessage(
    message,
    type = "info"
) {

    const box =
        get("statusMessage");


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.className =
        "status-message " + type;


    box.style.display =
        "block";

}


/* =========================================================
   LOCK STATUS
   ========================================================= */

function showLocked() {

    const hd =
        get("hdRate");

    const ld =
        get("ldRate");

    const lockButton =
        get("lockButton");

    const publishButton =
        get("publishButton");

    const status =
        get("lockStatus");


    if (!hd || !ld) {
        return;
    }


    hd.disabled =
        true;

    ld.disabled =
        true;


    if (lockButton) {

        lockButton.textContent =
            "🔓 Rate Unlock کریں";

    }


    if (publishButton) {

        publishButton.disabled =
            false;

    }


    if (status) {

        status.textContent =
            "🔒 HD اور LD Rate Lock ہو گئے ہیں۔";

        status.classList.add(
            "locked"
        );

    }

}


/* =========================================================
   UNLOCK STATUS
   ========================================================= */

function showUnlocked() {

    const hd =
        get("hdRate");

    const ld =
        get("ldRate");

    const lockButton =
        get("lockButton");

    const publishButton =
        get("publishButton");

    const status =
        get("lockStatus");


    if (hd) {
        hd.disabled = false;
    }


    if (ld) {
        ld.disabled = false;
    }


    if (lockButton) {

        lockButton.textContent =
            "🔒 Rate Lock کریں";

    }


    if (publishButton) {

        publishButton.disabled =
            true;

    }


    if (status) {

        status.textContent =
            "🔓 ریٹ ابھی Lock نہیں ہے۔";

        status.classList.remove(
            "locked"
        );

    }

}


/* =========================================================
   READ INPUT RATES
   ========================================================= */

function getInputRates() {

    const hd =
        cleanRate(
            get("hdRate")?.value
        );


    const ld =
        cleanRate(
            get("ldRate")?.value
        );


    return {

        hd: hd,

        ld: ld

    };

}


/* =========================================================
   VALIDATE RATES
   ========================================================= */

function validateRates() {

    const rates =
        getInputRates();


    if (rates.hd === null) {

        showMessage(
            "براہِ کرم HD Rate درج کریں۔",
            "error"
        );

        return false;

    }


    if (rates.ld === null) {

        showMessage(
            "براہِ کرم LD Rate درج کریں۔",
            "error"
        );

        return false;

    }


    if (rates.hd <= 0) {

        showMessage(
            "HD Rate صفر سے زیادہ ہونا چاہیے۔",
            "error"
        );

        return false;

    }


    if (rates.ld <= 0) {

        showMessage(
            "LD Rate صفر سے زیادہ ہونا چاہیے۔",
            "error"
        );

        return false;

    }


    return true;

}


/* =========================================================
   DISPLAY CURRENT RATE
   ========================================================= */

function displayCurrentRates(
    hd,
    ld
) {

    const currentHD =
        get("currentHD");

    const currentLD =
        get("currentLD");


    if (currentHD) {

        currentHD.textContent =
            formatRate(hd);

    }


    if (currentLD) {

        currentLD.textContent =
            formatRate(ld);

    }

}


/* =========================================================
   LOAD RATES.JSON
   ========================================================= */

async function loadCurrentRates() {

    showMessage(
        "موجودہ Published Rate چیک کیا جا رہا ہے...",
        "info"
    );


    try {

        const response =
            await fetch(
                RATES_FILE +
                "?t=" +
                Date.now(),
                {
                    method: "GET",

                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "rates.json not found"
            );

        }


        const data =
            await response.json();


        const hd =
            cleanRate(data.hd);

        const ld =
            cleanRate(data.ld);


        displayCurrentRates(
            hd,
            ld
        );


        if (hd !== null) {

            const inputHD =
                get("hdRate");

            if (inputHD) {

                inputHD.value =
                    hd;

            }

        }


        if (ld !== null) {

            const inputLD =
                get("ldRate");

            if (inputLD) {

                inputLD.value =
                    ld;

            }

        }


        showMessage(
            "✓ موجودہ Published Rate کامیابی سے Load ہو گیا۔",
            "success"
        );


        console.log(
            "Current rates loaded:",
            data
        );

    }

    catch (error) {

        console.error(
            "Rate loading error:",
            error
        );


        displayCurrentRates(
            null,
            null
        );


        showMessage(
            "⚠️ rates.json ابھی موجود نہیں یا اس تک رسائی نہیں ہو سکی۔",
            "error"
        );

    }

}


/* =========================================================
   LOCK BUTTON
   ========================================================= */

function handleLockButton() {

    const hd =
        get("hdRate");

    const ld =
        get("ldRate");

    const lockButton =
        get("lockButton");


    if (!hd || !ld) {
        return;
    }


    if (
        hd.disabled ||
        ld.disabled
    ) {

        showUnlocked();

        showMessage(
            "Rate Unlock ہو گیا ہے۔ آپ نیا ریٹ درج کر سکتے ہیں۔",
            "info"
        );

        return;

    }


    if (!validateRates()) {
        return;
    }


    const confirmed =
        window.confirm(
            "کیا آپ HD اور LD دونوں Rates کو Lock کرنا چاہتے ہیں؟"
        );


    if (!confirmed) {
        return;
    }


    showLocked();


    showMessage(
        "✓ HD اور LD Rates Lock ہو گئے ہیں۔ اب Publish کیا جا سکتا ہے۔",
        "success"
    );

}


/* =========================================================
   PUBLISH BUTTON
   ========================================================= */

/*
   ابھی Publish button صرف local validation کرتا ہے۔

   اصل GitHub update اس file میں Token کے ذریعے نہیں کیا جائے گا۔

   محفوظ طریقہ یہ ہوگا کہ GitHub Action / server-side mechanism
   rates.json کو update کرے۔

   اس طرح GitHub Personal Access Token public JavaScript
   میں leak نہیں ہوگا۔
*/

async function handlePublishButton() {

    const publishButton =
        get("publishButton");


    if (!publishButton) {
        return;
    }


    if (publishButton.disabled) {
        return;
    }


    if (!validateRates()) {
        return;
    }


    const rates =
        getInputRates();


    const confirmed =
        window.confirm(
            "HD Rate: Rs. " +
            rates.hd +
            "\n" +
            "LD Rate: Rs. " +
            rates.ld +
            "\n\n" +
            "کیا آپ یہ Rates Publish کرنا چاہتے ہیں؟"
        );


    if (!confirmed) {
        return;
    }


    /*
       ابھی اصل GitHub publishing intentionally نہیں کی گئی۔

       اگلے مرحلے میں اس button کو محفوظ GitHub
       publishing system کے ساتھ connect کیا جائے گا۔
    */


    showMessage(
        "✓ Rate verify ہو گیا ہے۔ GitHub publishing connection اگلے مرحلے میں شامل کیا جائے گا۔",
        "info"
    );


    console.log(
        "READY TO PUBLISH:",
        rates
    );

}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

function handleRefreshButton() {

    showUnlocked();

    loadCurrentRates();

}


/* =========================================================
   PREVENT INVALID INPUT
   ========================================================= */

function setupRateInputs() {

    [
        get("hdRate"),
        get("ldRate")
    ]
    .filter(Boolean)
    .forEach(function (input) {

        input.addEventListener(
            "input",
            function () {

                let value =
                    input.value;


                value =
                    value.replace(
                        /[^0-9]/g,
                        ""
                    );


                input.value =
                    value;

            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "-" ||
                    event.key === "+" ||
                    event.key === "e" ||
                    event.key === "E"
                ) {

                    event.preventDefault();

                }

            }
        );

    });

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupButtons() {

    const lockButton =
        get("lockButton");

    const publishButton =
        get("publishButton");

    const refreshButton =
        get("refreshButton");


    if (lockButton) {

        lockButton.addEventListener(
            "click",
            handleLockButton
        );

    }


    if (publishButton) {

        publishButton.addEventListener(
            "click",
            handlePublishButton
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            handleRefreshButton
        );

    }

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Janjua Traders PRM loaded."
        );


        showUnlocked();


        setupRateInputs();


        setupButtons();


        loadCurrentRates();

    }
);
