/* =========================================================
   JANJUA TRADERS
   FINAL COMPLETE SCRIPT.JS

   FEATURES:
   - Product Price
   - Delivery Charges
   - Quantity 1 to 10
   - Quantity typing fix
   - Correct Total
   - Customer Name
   - Phone / WhatsApp
   - Address
   - Platform
   - Product
   - Product Description
   - Color
   - Size
   - Product Link
   - Unique Tracking ID
   - Exact Pakistan Date
   - Exact Pakistan Time
   - FormSubmit AJAX
   - Gmail Order Submission
   - Custom Gmail Subject
   - Success / Error Message
   - Customer fields reset after successful order
   - Product information preserved

   IMPORTANT:
   Tracking ID + Date + Time are generated
   ONLY when the customer submits the order.
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           FORM
           ===================================================== */

        const form =
            document.getElementById(
                "orderForm"
            );


        if (!form) {

            console.error(
                "Janjua Traders: orderForm not found."
            );

            return;
        }


        /* =====================================================
           SETTINGS
           ===================================================== */

        const PRODUCT_PRICE =
            42999;


        const DELIVERY_CHARGES =
            250;


        const FORM_SUBMIT_EMAIL =
            "thanksyou0339@gmail.com";


        const FORM_SUBMIT_URL =
            "https://formsubmit.co/ajax/" +
            FORM_SUBMIT_EMAIL;


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

            const element =
                get(id);


            if (!element) {

                return "";
            }


            return clean(
                element.value
            );
        }


        function setHidden(
            name,
            value
        ) {

            let field =
                form.querySelector(
                    'input[type="hidden"][name="' +
                    name +
                    '"]'
                );


            if (!field) {

                field =
                    document.createElement(
                        "input"
                    );

                field.type =
                    "hidden";

                field.name =
                    name;

                form.appendChild(
                    field
                );
            }


            field.value =
                clean(value);


            return field;
        }


        function rupees(number) {

            return "Rs. " +
                Number(number)
                    .toLocaleString(
                        "en-PK",
                        {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }
                    );
        }


        /* =====================================================
           ORDER DATE / TIME / TRACKING ID
           PAKISTAN TIME
           ===================================================== */

        function createOrderInfo() {

            const now =
                new Date();


            /* ---------------------------------------------
               Pakistan Date
               --------------------------------------------- */

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


            /* ---------------------------------------------
               Pakistan Time
               --------------------------------------------- */

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


            function partValue(
                parts,
                type
            ) {

                const part =
                    parts.find(
                        function (item) {

                            return (
                                item.type ===
                                type
                            );
                        }
                    );


                return part
                    ? part.value
                    : "";
            }


            const day =
                partValue(
                    dateParts,
                    "day"
                );


            const month =
                partValue(
                    dateParts,
                    "month"
                );


            const year =
                partValue(
                    dateParts,
                    "year"
                );


            const hour =
                partValue(
                    timeParts,
                    "hour"
                );


            const minute =
                partValue(
                    timeParts,
                    "minute"
                );


            const second =
                partValue(
                    timeParts,
                    "second"
                );


            const dayPeriod =
                partValue(
                    timeParts,
                    "dayPeriod"
                );


            /* ---------------------------------------------
               Display Date
               --------------------------------------------- */

            const orderDate =
                `${day}-${month}-${year}`;


            /* ---------------------------------------------
               Display Time
               --------------------------------------------- */

            const orderTime =
                `${hour}:${minute}:${second} ${dayPeriod}`;


            /* ---------------------------------------------
               Convert to 24 Hour
               --------------------------------------------- */

            let hour24 =
                parseInt(
                    hour,
                    10
                );


            if (
                dayPeriod === "AM" &&
                hour24 === 12
            ) {

                hour24 = 0;
            }


            if (
                dayPeriod === "PM" &&
                hour24 !== 12
            ) {

                hour24 += 12;
            }


            const hour24String =
                String(hour24)
                    .padStart(
                        2,
                        "0"
                    );


            /* ---------------------------------------------
               Unique Tracking ID

               Example:
               JT-20260818-143541
               --------------------------------------------- */

            const trackingId =
                `JT-${year}${month}${day}-${hour24String}${minute}${second}`;


            return {

                trackingId:
                    trackingId,

                orderDate:
                    orderDate,

                orderTime:
                    orderTime
            };
        }


        /* =====================================================
           PRODUCT
           ===================================================== */

        function productName() {

            const element =
                get(
                    "productTitle"
                );


            if (!element) {

                return "Product";
            }


            return clean(
                element.textContent
            ) || "Product";
        }


        function productDescription() {

            const element =
                get(
                    "productDescription"
                );


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

        function quantity() {

            const element =
                get(
                    "quantity"
                );


            if (!element) {

                return 1;
            }


            let qty =
                parseInt(
                    element.value,
                    10
                );


            if (
                isNaN(qty) ||
                qty < 1
            ) {

                return 1;
            }


            if (
                qty > 10
            ) {

                return 10;
            }


            return qty;
        }


        /* =====================================================
           PLATFORM
           ===================================================== */

        function platform() {

            const element =
                get(
                    "platform"
                );


            if (!element) {

                return "Markaz";
            }


            return clean(
                element.value
            ) || "Markaz";
        }


        /* =====================================================
           PRODUCT LINK
           ===================================================== */

        function productLink() {

            const field =
                form.querySelector(
                    'input[name="Product_Link"]'
                );


            if (
                field &&
                clean(field.value)
            ) {

                return clean(
                    field.value
                );
            }


            return window.location.href;
        }


        /* =====================================================
           TOTAL CALCULATION
           ===================================================== */

        function calculateTotal() {

            const qty =
                quantity();


            const productTotal =
                PRODUCT_PRICE * qty;


            const total =
                productTotal +
                DELIVERY_CHARGES;


            /* ---------------------------------------------
               SCREEN
               --------------------------------------------- */

            const productPriceElement =
                get(
                    "productPrice"
                );


            if (
                productPriceElement
            ) {

                productPriceElement.textContent =
                    rupees(
                        PRODUCT_PRICE
                    );
            }


            const deliveryElement =
                get(
                    "deliveryPrice"
                );


            if (
                deliveryElement
            ) {

                deliveryElement.textContent =
                    rupees(
                        DELIVERY_CHARGES
                    );
            }


            const totalElement =
                get(
                    "totalPrice"
                );


            if (
                totalElement
            ) {

                totalElement.textContent =
                    rupees(
                        total
                    );
            }


            /* ---------------------------------------------
               EMAIL DATA
               --------------------------------------------- */

            setHidden(
                "Product_Price",
                rupees(
                    PRODUCT_PRICE
                )
            );


            setHidden(
                "Delivery_Charges",
                rupees(
                    DELIVERY_CHARGES
                )
            );


            setHidden(
                "Product_Total",
                rupees(
                    productTotal
                )
            );


            setHidden(
                "Total_Amount",
                rupees(
                    total
                )
            );


            return total;
        }


        /* =====================================================
           PREPARE ORDER
           ===================================================== */

        function prepareOrder(
            orderInfo
        ) {

            const name =
                getValue(
                    "customerName"
                );


            const phone =
                getValue(
                    "customerPhone"
                );


            const address =
                getValue(
                    "address"
                );


            const color =
                getValue(
                    "color"
                );


            const size =
                getValue(
                    "size"
                );


            const qty =
                quantity();


            /* ---------------------------------------------
               TRACKING ID
               --------------------------------------------- */

            setHidden(
                "Order_ID",
                orderInfo.trackingId
            );


            /* ---------------------------------------------
               ORDER DATE
               --------------------------------------------- */

            setHidden(
                "Order_Date",
                orderInfo.orderDate
            );


            /* ---------------------------------------------
               ORDER TIME
               --------------------------------------------- */

            setHidden(
                "Order_Time",
                orderInfo.orderTime
            );


            /* ---------------------------------------------
               CUSTOMER
               --------------------------------------------- */

            setHidden(
                "Customer_Name",
                name
            );


            setHidden(
                "Mobile_WhatsApp",
                phone
            );


            setHidden(
                "Delivery_Address",
                address
            );


            /* ---------------------------------------------
               PLATFORM
               --------------------------------------------- */

            setHidden(
                "Platform",
                platform()
            );


            /* ---------------------------------------------
               PRODUCT
               --------------------------------------------- */

            setHidden(
                "Product",
                productName()
            );


            setHidden(
                "Product_Description",
                productDescription()
            );


            /* ---------------------------------------------
               COLOR
               --------------------------------------------- */

            setHidden(
                "Color",
                color ||
                "Not Required"
            );


            /* ---------------------------------------------
               SIZE
               --------------------------------------------- */

            setHidden(
                "Size",
                size ||
                "Not Required"
            );


            /* ---------------------------------------------
               QUANTITY
               --------------------------------------------- */

            setHidden(
                "Quantity",
                qty
            );


            /* ---------------------------------------------
               PRICE
               --------------------------------------------- */

            calculateTotal();


            /* ---------------------------------------------
               PRODUCT LINK
               --------------------------------------------- */

            setHidden(
                "Product_Link",
                productLink()
            );


            /* ---------------------------------------------
               FORMSUBMIT SETTINGS
               --------------------------------------------- */

            setHidden(
                "_subject",
                "Janjua Traders | New Order | " +
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


            /* ---------------------------------------------
               FINAL ORDER OBJECT
               --------------------------------------------- */

            return {

                Order_ID:
                    getValueFromForm(
                        "Order_ID"
                    ),

                Order_Date:
                    getValueFromForm(
                        "Order_Date"
                    ),

                Order_Time:
                    getValueFromForm(
                        "Order_Time"
                    ),

                Customer_Name:
                    getValueFromForm(
                        "Customer_Name"
                    ),

                Mobile_WhatsApp:
                    getValueFromForm(
                        "Mobile_WhatsApp"
                    ),

                Delivery_Address:
                    getValueFromForm(
                        "Delivery_Address"
                    ),

                Platform:
                    getValueFromForm(
                        "Platform"
                    ),

                Product:
                    getValueFromForm(
                        "Product"
                    ),

                Product_Description:
                    getValueFromForm(
                        "Product_Description"
                    ),

                Color:
                    getValueFromForm(
                        "Color"
                    ),

                Size:
                    getValueFromForm(
                        "Size"
                    ),

                Quantity:
                    getValueFromForm(
                        "Quantity"
                    ),

                Product_Price:
                    getValueFromForm(
                        "Product_Price"
                    ),

                Delivery_Charges:
                    getValueFromForm(
                        "Delivery_Charges"
                    ),

                Product_Total:
                    getValueFromForm(
                        "Product_Total"
                    ),

                Total_Amount:
                    getValueFromForm(
                        "Total_Amount"
                    ),

                Product_Link:
                    getValueFromForm(
                        "Product_Link"
                    ),

                _subject:
                    "Janjua Traders | New Order | " +
                    orderInfo.trackingId,

                _template:
                    "table",

                _captcha:
                    "false"
            };
        }


        /* =====================================================
           GET FORM VALUE
           ===================================================== */

        function getValueFromForm(
            name
        ) {

            const field =
                form.querySelector(
                    'input[name="' +
                    name +
                    '"]'
                );


            if (!field) {

                return "";
            }


            return clean(
                field.value
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
                get(
                    "result"
                );


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
           SUBMIT BUTTON
           ===================================================== */

        const submitButton =
            get(
                "submitButton"
            );


        /* =====================================================
           QUANTITY LIVE
           ===================================================== */

        const quantityField =
            get(
                "quantity"
            );


        if (
            quantityField
        ) {


            /* ---------------------------------------------
               Quantity Settings
               --------------------------------------------- */

            quantityField.type =
                "number";


            quantityField.min =
                "1";


            quantityField.max =
                "10";


            quantityField.step =
                "1";


            quantityField.inputMode =
                "numeric";


            /* ---------------------------------------------
               Select Existing Value
               --------------------------------------------- */

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


            /* ---------------------------------------------
               INPUT
               --------------------------------------------- */

            quantityField.addEventListener(
                "input",
                function () {


                    if (
                        quantityField.value === ""
                    ) {

                        setHidden(
                            "Quantity",
                            1
                        );


                        calculateTotal();

                        return;
                    }


                    let value =
                        parseInt(
                            quantityField.value,
                            10
                        );


                    if (
                        isNaN(value)
                    ) {

                        quantityField.value =
                            "1";


                        value = 1;
                    }


                    if (
                        value < 1
                    ) {

                        value = 1;
                    }


                    if (
                        value > 10
                    ) {

                        value = 10;
                    }


                    quantityField.value =
                        String(
                            value
                        );


                    setHidden(
                        "Quantity",
                        value
                    );


                    calculateTotal();
                }
            );


            /* ---------------------------------------------
               CHANGE
               --------------------------------------------- */

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


                    if (
                        value > 10
                    ) {

                        value = 10;
                    }


                    quantityField.value =
                        String(
                            value
                        );


                    setHidden(
                        "Quantity",
                        value
                    );


                    calculateTotal();
                }
            );


            /* ---------------------------------------------
               KEYBOARD PROTECTION
               --------------------------------------------- */

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
           COLOR
           ===================================================== */

        const colorField =
            get(
                "color"
            );


        if (
            colorField
        ) {

            colorField.addEventListener(
                "input",
                function () {

                    setHidden(
                        "Color",
                        clean(
                            colorField.value
                        ) ||
                        "Not Required"
                    );
                }
            );
        }


        /* =====================================================
           SIZE
           ===================================================== */

        const sizeField =
            get(
                "size"
            );


        if (
            sizeField
        ) {

            sizeField.addEventListener(
                "input",
                function () {

                    setHidden(
                        "Size",
                        clean(
                            sizeField.value
                        ) ||
                        "Not Required"
                    );
                }
            );
        }


        /* =====================================================
           PHONE
           ===================================================== */

        const phoneField =
            get(
                "customerPhone"
            );


        if (
            phoneField
        ) {

            phoneField.addEventListener(
                "input",
                function () {

                    const phone =
                        clean(
                            phoneField.value
                        );


                    setHidden(
                        "Mobile_WhatsApp",
                        phone
                    );
                }
            );
        }


        /* =====================================================
           FINAL AJAX SUBMIT
           ===================================================== */

        form.addEventListener(
            "submit",
            async function (event) {


                event.preventDefault();


                /* ---------------------------------------------
                   Browser Validation
                   --------------------------------------------- */

                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;
                }


                /* ---------------------------------------------
                   CREATE EXACT ORDER TIME
                   --------------------------------------------- */

                const orderInfo =
                    createOrderInfo();


                /* ---------------------------------------------
                   PREPARE ORDER
                   --------------------------------------------- */

                const orderData =
                    prepareOrder(
                        orderInfo
                    );


                /* ---------------------------------------------
                   Button
                   --------------------------------------------- */

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
                        "Order Submit ہو رہا ہے...";
                }


                /* ---------------------------------------------
                   Result
                   --------------------------------------------- */

                showResult(
                    "Order submit ہو رہا ہے، براہِ کرم انتظار کریں...",
                    true
                );


                try {


                    console.log(
                        "Sending order to FormSubmit:",
                        orderData
                    );


                    /* =============================================
                       AJAX REQUEST
                       ============================================= */

                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
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
                                        orderData
                                    )
                            }
                        );


                    const text =
                        await response.text();


                    console.log(
                        "FormSubmit HTTP status:",
                        response.status
                    );


                    console.log(
                        "FormSubmit response:",
                        text
                    );


                    let data =
                        null;


                    try {

                        data =
                            JSON.parse(
                                text
                            );

                    } catch (
                        error
                    ) {

                        console.warn(
                            "FormSubmit returned non-JSON response."
                        );
                    }


                    /* =============================================
                       SUCCESS
                       ============================================= */

                    if (
                        response.ok &&
                        data &&
                        (
                            data.success === true ||
                            data.success === "true"
                        )
                    ) {


                        showResult(
                            "✓ Order کامیابی سے Submit ہو گیا ہے۔ Tracking ID: " +
                            orderInfo.trackingId,
                            true
                        );


                        /* -----------------------------------------
                           Clear Customer Fields
                           ----------------------------------------- */

                        const customerName =
                            get(
                                "customerName"
                            );


                        const customerPhone =
                            get(
                                "customerPhone"
                            );


                        const address =
                            get(
                                "address"
                            );


                        const color =
                            get(
                                "color"
                            );


                        const size =
                            get(
                                "size"
                            );


                        if (
                            customerName
                        ) {

                            customerName.value =
                                "";
                        }


                        if (
                            customerPhone
                        ) {

                            customerPhone.value =
                                "";
                        }


                        if (
                            address
                        ) {

                            address.value =
                                "";
                        }


                        if (
                            color
                        ) {

                            color.value =
                                "";
                        }


                        if (
                            size
                        ) {

                            size.value =
                                "";
                        }


                        /* -----------------------------------------
                           Quantity Reset
                           ----------------------------------------- */

                        if (
                            quantityField
                        ) {

                            quantityField.value =
                                "1";
                        }


                        /*
                         * IMPORTANT:
                         * یہاں prepareOrder دوبارہ نہیں چلایا جائے گا۔
                         *
                         * اس سے نیا Tracking ID / Date / Time
                         * generate نہیں ہوگا۔
                         *
                         * Gmail میں صرف submitted order کا
                         * اصل Tracking ID / Date / Time رہے گا۔
                         */


                    } else {


                        console.error(
                            "FormSubmit rejected order:",
                            data || text
                        );


                        let errorMessage =
                            "FormSubmit نے Order قبول نہیں کیا۔";


                        if (
                            data &&
                            data.message
                        ) {

                            errorMessage =
                                data.message;
                        }


                        throw new Error(
                            errorMessage
                        );
                    }


                } catch (
                    error
                ) {


                    console.error(
                        "Janjua Traders FormSubmit Error:",
                        error
                    );


                    showResult(
                        "✗ Order Gmail پر نہیں بھیجا گیا۔ " +
                        (
                            error.message ||
                            "FormSubmit error"
                        ),
                        false
                    );


                } finally {


                    if (
                        submitButton
                    ) {

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

        if (
            quantityField &&
            clean(
                quantityField.value
            ) === ""
        ) {

            quantityField.value =
                "1";
        }


        /*
         * Page load پر صرف price/total calculate کریں۔
         *
         * Tracking ID / Date / Time یہاں generate نہیں ہوں گے۔
         */

        calculateTotal();


        console.log(
            "Janjua Traders: FINAL Gmail AJAX script loaded."
        );


        console.log(
            "Quantity: 1 to 10 - Fixed"
        );


        console.log(
            "Tracking ID: Generated on Submit"
        );


        console.log(
            "Order Date/Time: Pakistan Time"
        );


    }
);
