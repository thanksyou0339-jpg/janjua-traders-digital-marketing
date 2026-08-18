/* =========================================================
   JANJUA TRADERS
   DARAZ SYSTEM
   zscript.js

   FEATURES:
   - Daraz Product
   - Product Price
   - Delivery Charges
   - Quantity 1 to 10
   - Customer Name
   - Mobile / WhatsApp
   - Delivery Address
   - Color
   - Size
   - Daraz Product Link
   - Pakistan Date
   - Pakistan Time
   - Unique Tracking ID
   - Gmail / FormSubmit Order
   - Success / Error Message
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
           PAKISTAN DATE / TIME
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
           TOTAL
        ===================================================== */

        function calculateTotal() {

            const qty =
                quantity();


            const productTotal =
                PRODUCT_PRICE * qty;


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


            return total;
        }



        /* =====================================================
           PREPARE ORDER
        ===================================================== */

        function prepareOrder(
            orderInfo
        ) {

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
                quantity()
            );


            setHidden(
                "Product_Link",
                getValue(
                    "productLink"
                )
            );


            calculateTotal();


            setHidden(
                "_subject",
                "Janjua Traders | Daraz New Order | " +
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
           QUANTITY
        ===================================================== */

        const quantityField =
            get(
                "quantity"
            );


        if (
            quantityField
        ) {

            quantityField.min =
                "1";

            quantityField.max =
                "10";

            quantityField.step =
                "1";


            quantityField.addEventListener(
                "input",
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
           PRODUCT LINK
        ===================================================== */

        const productLinkField =
            get(
                "productLink"
            );


        if (
            productLinkField
        ) {

            productLinkField.addEventListener(
                "input",
                function () {

                    setHidden(
                        "Product_Link",
                        productLinkField.value
                    );
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


                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;
                }


                const orderInfo =
                    createOrderInfo();


                prepareOrder(
                    orderInfo
                );


                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Order Submit ہو رہا ہے...";
                }


                showResult(
                    "Order submit ہو رہا ہے، براہِ کرم انتظار کریں...",
                    true
                );


                try {

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

                    } catch (
                        error
                    ) {

                        console.warn(
                            "Non-JSON response from FormSubmit."
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

                        showResult(
                            "✓ Order کامیابی سے Submit ہو گیا ہے۔ Tracking ID: " +
                            orderInfo.trackingId,
                            true
                        );


                        get(
                            "customerName"
                        ).value = "";


                        get(
                            "customerPhone"
                        ).value = "";


                        get(
                            "address"
                        ).value = "";


                        get(
                            "color"
                        ).value = "";


                        get(
                            "size"
                        ).value = "";


                        get(
                            "productLink"
                        ).value = "";


                        quantityField.value =
                            "1";


                    } else {

                        throw new Error(
                            data &&
                            data.message
                                ? data.message
                                : "FormSubmit نے Order قبول نہیں کیا۔"
                        );
                    }


                } catch (
                    error
                ) {

                    console.error(
                        "Daraz Order Error:",
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
            !quantityField.value
        ) {

            quantityField.value =
                "1";
        }


        calculateTotal();


        console.log(
            "Janjua Traders Daraz zscript.js loaded successfully."
        );

    }
);
