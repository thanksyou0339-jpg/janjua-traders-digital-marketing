/* =========================================================
   JANJUA TRADERS
   APNAMART FINAL ORDER SCRIPT

   FEATURES:
   - ApnaMart Product
   - Product Price
   - Delivery Charges
   - Quantity 1 to 10
   - Quantity replacement fix
   - Customer Name
   - Phone / WhatsApp
   - Delivery Address
   - Color
   - Size
   - Product Link
   - Unique Tracking ID
   - Pakistan Date
   - Pakistan Time
   - Gmail Order Submission through FormSubmit
   - Custom Gmail Subject
   - Success / Error Message
   - Customer fields reset after successful order
   - Product information preserved

   IMPORTANT:
   Tracking ID + Date + Time are generated
   ONLY when customer submits the order.
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
                "Janjua Traders ApnaMart: orderForm not found."
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


        /* =====================================================
           GMAIL / FORMSUBMIT
        ===================================================== */

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


        function getFormValue(
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
           PRODUCT NAME
        ===================================================== */

        function productName() {

            const element =
                get(
                    "productTitle"
                );


            if (!element) {

                return "ApnaMart Product";
            }


            return clean(
                element.textContent
            ) || "ApnaMart Product";
        }


        /* =====================================================
           PRODUCT DESCRIPTION
        ===================================================== */

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
           PRODUCT LINK
        ===================================================== */

        function productLink() {

            const existingField =
                form.querySelector(
                    'input[name="Product_Link"]'
                );


            if (
                existingField &&
                clean(
                    existingField.value
                )
            ) {

                return clean(
                    existingField.value
                );
            }


            return window.location.href;
        }


        /* =====================================================
           QUANTITY
           IMPORTANT FIX
        ===================================================== */

        const quantityField =
            get(
                "quantity"
            );


        function getQuantity() {

            if (!quantityField) {

                return 1;
            }


            let value =
                parseInt(
                    quantityField.value,
                    10
                );


            if (
                isNaN(value)
            ) {

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


            return value;
        }


        function setQuantity(
            value
        ) {

            if (!quantityField) {

                return;
            }


            let quantity =
                parseInt(
                    value,
                    10
                );


            if (
                isNaN(quantity)
            ) {

                quantity = 1;
            }


            if (
                quantity < 1
            ) {

                quantity = 1;
            }


            if (
                quantity > 10
            ) {

                quantity = 10;
            }


            quantityField.value =
                String(
                    quantity
                );
        }


        /* =====================================================
           TOTAL CALCULATION
        ===================================================== */

        function calculateTotal() {

            const quantity =
                getQuantity();


            const productTotal =
                PRODUCT_PRICE *
                quantity;


            const total =
                productTotal +
                DELIVERY_CHARGES;


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


            return {

                quantity:
                    quantity,

                productTotal:
                    productTotal,

                total:
                    total
            };
        }


        /* =====================================================
           PAKISTAN DATE / TIME / TRACKING ID
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
                        function (entry) {

                            return (
                                entry.type ===
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


            const hourString =
                String(
                    hour24
                ).padStart(
                    2,
                    "0"
                );


            const trackingId =
                `JT-AM-${year}${month}${day}-${hourString}${minute}${second}`;


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
           PREPARE ORDER
        ===================================================== */

        function prepareOrder(
            orderInfo
        ) {

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
                getValue(
                    "customerName"
                )
            );


            setHidden(
                "Mobile_WhatsApp",
                getValue(
                    "customerPhone"
                )
            );


            setHidden(
                "Delivery_Address",
                getValue(
                    "address"
                )
            );


            setHidden(
                "Platform",
                "ApnaMart"
            );


            setHidden(
                "Product",
                productName()
            );


            setHidden(
                "Product_Description",
                productDescription()
            );


            setHidden(
                "Color",
                getValue(
                    "color"
                ) ||
                "Not Required"
            );


            setHidden(
                "Size",
                getValue(
                    "size"
                ) ||
                "Not Required"
            );


            setHidden(
                "Quantity",
                totals.quantity
            );


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
                    totals.productTotal
                )
            );


            setHidden(
                "Total_Amount",
                rupees(
                    totals.total
                )
            );


            setHidden(
                "Product_Link",
                productLink()
            );


            /* ---------------------------------------------
               FORMSUBMIT
            --------------------------------------------- */

            setHidden(
                "_subject",
                "Janjua Traders | APNAMART NEW ORDER | " +
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
           RESULT
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
           QUANTITY FIELD
           FULL REPLACEMENT FIX
        ===================================================== */

        if (
            quantityField
        ) {

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


            quantityField.autocomplete =
                "off";


            /*
             * Important:
             * Browser کی existing value کو
             * append نہیں ہونے دیں گے۔
             */


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
                "click",
                function () {

                    /*
                     * اگر user موجودہ quantity
                     * کو replace کرنا چاہے تو
                     * پہلی click کے بعد selection
                     * available رہے۔
                     */

                }
            );


            quantityField.addEventListener(
                "input",
                function () {

                    let raw =
                        quantityField.value;


                    /*
                     * صرف digits رکھیں۔
                     */

                    raw =
                        raw.replace(
                            /[^0-9]/g,
                            ""
                        );


                    /*
                     * خالی ہونے کی صورت میں
                     * ابھی field خالی رہنے دیں۔
                     * اس سے user نئی quantity لکھ سکتا ہے۔
                     */

                    if (
                        raw === ""
                    ) {

                        calculateTotal();

                        return;
                    }


                    let value =
                        parseInt(
                            raw,
                            10
                        );


                    if (
                        isNaN(value)
                    ) {

                        quantityField.value =
                            "";

                        return;
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


                    calculateTotal();
                }
            );


            quantityField.addEventListener(
                "blur",
                function () {

                    if (
                        clean(
                            quantityField.value
                        ) === ""
                    ) {

                        setQuantity(
                            1
                        );
                    }


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


                    if (
                        value > 10
                    ) {

                        value = 10;
                    }


                    setQuantity(
                        value
                    );


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

        const submitButton =
            get(
                "submitButton"
            );


        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* ---------------------------------------------
                   VALIDATION
                --------------------------------------------- */

                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;
                }


                /*
                 * Quantity کو submit سے پہلے
                 * ایک مرتبہ final normalize کریں۔
                 */

                if (
                    quantityField
                ) {

                    if (
                        clean(
                            quantityField.value
                        ) === ""
                    ) {

                        setQuantity(
                            1
                        );
                    }

                    else {

                        setQuantity(
                            getQuantity()
                        );
                    }
                }


                /* ---------------------------------------------
                   CREATE ORDER INFO
                --------------------------------------------- */

                const orderInfo =
                    createOrderInfo();


                /* ---------------------------------------------
                   PREPARE ORDER
                --------------------------------------------- */

                prepareOrder(
                    orderInfo
                );


                /* ---------------------------------------------
                   BUTTON
                --------------------------------------------- */

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
                        "Order Submit ہو رہا ہے...";
                }


                showResult(
                    "Order Gmail پر بھیجا جا رہا ہے، براہِ کرم انتظار کریں...",
                    true
                );


                try {


                    console.log(
                        "Sending ApnaMart order:",
                        orderInfo.trackingId
                    );


                    /* =========================================
                       SEND TO FORMSUBMIT
                    ========================================= */

                    const formData =
                        new FormData(
                            form
                        );


                    const response =
                        await fetch(
                            FORM_SUBMIT_URL,
                            {
                                method:
                                    "POST",

                                headers:
                                    {
                                        "Accept":
                                            "application/json"
                                    },

                                body:
                                    formData
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

                    }

                    catch (
                        parseError
                    ) {

                        console.warn(
                            "FormSubmit returned non-JSON response."
                        );
                    }


                    /* =========================================
                       SUCCESS
                    ========================================= */

                    if (
                        response.ok &&
                        data &&
                        (
                            data.success === true ||
                            data.success === "true"
                        )
                    ) {


                        showResult(

                            "✓ ApnaMart Order کامیابی سے Gmail پر Submit ہو گیا ہے۔ Tracking ID: " +
                            orderInfo.trackingId,

                            true
                        );


                        /* -----------------------------------------
                           CLEAR CUSTOMER FIELDS
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


                        /*
                         * Quantity reset to 1.
                         */

                        if (
                            quantityField
                        ) {

                            setQuantity(
                                1
                            );
                        }


                        /*
                         * Product information
                         * remains unchanged.
                         */

                        calculateTotal();


                    }

                    else {


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


                }

                catch (
                    error
                ) {


                    console.error(
                        "ApnaMart Gmail Order Error:",
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


                }

                finally {


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
            quantityField
        ) {

            if (
                clean(
                    quantityField.value
                ) === ""
            ) {

                setQuantity(
                    1
                );
            }

            else {

                setQuantity(
                    getQuantity()
                );
            }
        }


        calculateTotal();


        console.log(
            "Janjua Traders: APNAMART FINAL SCRIPT LOADED."
        );


        console.log(
            "ApnaMart Gmail submission enabled."
        );


        console.log(
            "Quantity replacement fix enabled."
        );


        console.log(
            "Pakistan Date/Time enabled."
        );


    }
);
