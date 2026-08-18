/* =========================================================
   JANJUA TRADERS
   DARAZ FINAL GMAIL ORDER SCRIPT

   FEATURES:
   - Daraz Product
   - Product Price
   - Delivery Charges
   - Quantity 1 to 10
   - Quantity Mobile Input FIX
   - Correct Total
   - Customer Name
   - Phone / WhatsApp
   - Address
   - Platform = Daraz
   - Product Description
   - Color
   - Size
   - Product Link
   - Unique Tracking ID
   - Pakistan Date
   - Pakistan Time
   - FormSubmit AJAX
   - Gmail Order Submission
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
                "Janjua Traders Daraz: orderForm not found."
            );

            return;
        }


        /* =====================================================
           DARAZ SETTINGS
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
           PRODUCT
        ===================================================== */

        function productName() {

            const element =
                get(
                    "productTitle"
                );


            if (!element) {

                return "Daraz Product";
            }


            return clean(
                element.textContent
            ) || "Daraz Product";
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
           FINAL MOBILE FIX
        ===================================================== */

        function quantity() {

            const element =
                get(
                    "quantity"
                );


            if (!element) {

                return 1;
            }


            let value =
                clean(
                    element.value
                );


            if (
                value === ""
            ) {

                return 1;
            }


            value =
                value.replace(
                    /[^0-9]/g,
                    ""
                );


            if (
                value === ""
            ) {

                return 1;
            }


            let qty =
                parseInt(
                    value,
                    10
                );


            if (
                isNaN(qty) ||
                qty < 1
            ) {

                qty = 1;
            }


            if (
                qty > 10
            ) {

                qty = 10;
            }


            return qty;
        }


        /* =====================================================
           PRODUCT LINK
        ===================================================== */

        function productLink() {

            return window.location.href;
        }


        /* =====================================================
           ORDER DATE / TIME / TRACKING ID
           PAKISTAN TIME
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


            const orderDate =
                `${day}-${month}-${year}`;


            const orderTime =
                `${hour}:${minute}:${second} ${dayPeriod}`;


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


            const trackingId =
                `JT-DZ-${year}${month}${day}-${hour24String}${minute}${second}`;


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
           TOTAL CALCULATION
        ===================================================== */

        function calculateTotal() {

            const qty =
                quantity();


            const productTotal =
                PRODUCT_PRICE *
                qty;


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
                    qty,

                productTotal:
                    productTotal,

                total:
                    total
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
                "Daraz"
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
               FORMSUBMIT SETTINGS
            --------------------------------------------- */

            setHidden(
                "_subject",
                "Janjua Traders | DARAZ NEW ORDER | " +
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
           QUANTITY - FINAL MOBILE FIX
        ===================================================== */

        const quantityField =
            get(
                "quantity"
            );


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


            /* ---------------------------------------------
               IMPORTANT:

               Page load پر 1 خود سے نہیں ڈالا جائے گا۔

               اس سے موبائل میں:

               1 + 2 = 12

               والا مسئلہ ختم ہوگا۔

               User خود 1, 2, 3 ... 10 لکھے گا۔
            --------------------------------------------- */


            quantityField.addEventListener(
                "input",
                function () {

                    let value =
                        quantityField.value;


                    /* صرف numbers */

                    value =
                        value.replace(
                            /[^0-9]/g,
                            ""
                        );


                    /* خالی ہونے دیں */

                    if (
                        value === ""
                    ) {

                        calculateTotal();

                        return;
                    }


                    let number =
                        parseInt(
                            value,
                            10
                        );


                    if (
                        isNaN(number)
                    ) {

                        quantityField.value =
                            "";

                        calculateTotal();

                        return;
                    }


                    /* Maximum 10 */

                    if (
                        number > 10
                    ) {

                        number = 10;
                    }


                    /* Minimum 1 */

                    if (
                        number < 1
                    ) {

                        number = 1;
                    }


                    quantityField.value =
                        String(
                            number
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

                    let number =
                        parseInt(
                            quantityField.value,
                            10
                        );


                    if (
                        isNaN(number) ||
                        number < 1
                    ) {

                        number = 1;
                    }


                    if (
                        number > 10
                    ) {

                        number = 10;
                    }


                    quantityField.value =
                        String(
                            number
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
           FORM SUBMIT
        ===================================================== */

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


                /* ---------------------------------------------
                   CREATE ORDER INFO ONLY NOW
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
                        "Sending Daraz order to Gmail:",
                        orderInfo.trackingId
                    );


                    /* =========================================
                       FORMSUBMIT AJAX
                    ========================================= */

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
                                        Object.fromEntries(
                                            new FormData(
                                                form
                                            )
                                        )
                                    )
                            }
                        );


                    const text =
                        await response.text();


                    console.log(
                        "FormSubmit status:",
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
                            "Non-JSON response from FormSubmit."
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

                            "✓ Daraz Order کامیابی سے Gmail پر Submit ہو گیا ہے۔ Tracking ID: " +
                            orderInfo.trackingId,

                            true

                        );


                        /* -----------------------------------------
                           CUSTOMER FIELDS CLEAR
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


                        if (
                            quantityField
                        ) {

                            quantityField.value =
                                "";
                        }


                        /*
                         * Product information remains unchanged.
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
                        "Daraz Gmail Order Error:",
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

        /*
         * Quantity کو یہاں 1 نہیں دیا جائے گا۔
         *
         * اس کا مقصد یہ ہے کہ موبائل پر
         * پہلے سے موجود 1 کے ساتھ نیا نمبر
         * جڑ کر 12 یا 21 نہ بنے۔
         *
         * User خود Quantity لکھے گا۔
         */


        calculateTotal();


        console.log(
            "Janjua Traders: DARAZ Gmail AJAX script loaded."
        );


        console.log(
            "Daraz Quantity: FINAL MOBILE FIX"
        );


    }
);
