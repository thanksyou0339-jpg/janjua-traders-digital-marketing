/* =========================================================
   JANJUA TRADERS - COMPLETE scrapt.js
   VERSION: ORDER + COLOR + SIZE + GMAIL

   No Google Apps Script
   No Google Sheet
   No separate Tracking ID

   Customer Mobile Number = Order ID

   Orders:
   thanksyou0339@gmail.com
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       SETTINGS
       ===================================================== */

    const ORDER_EMAIL =
        "thanksyou0339@gmail.com";

    const FORM_ENDPOINT =
        "https://formsubmit.co/ajax/" +
        encodeURIComponent(ORDER_EMAIL);


    /* =====================================================
       HELPERS
       ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    function getValue(id, fallback = "") {
        const element = getElement(id);

        if (!element) {
            return fallback;
        }

        return String(
            element.value || ""
        ).trim();
    }


    function setValue(id, value) {
        const element = getElement(id);

        if (element) {
            element.value =
                value || "";
        }
    }


    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent =
                value || "";
        }
    }


    function money(value) {
        return Number(
            value || 0
        ).toLocaleString("en-PK");
    }


    /* =====================================================
       PRODUCT LINK PARAMETERS
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    function parameter(
        names,
        fallback = ""
    ) {

        for (const name of names) {

            const value =
                params.get(name);

            if (
                value !== null &&
                value !== ""
            ) {

                try {
                    return decodeURIComponent(
                        value
                    );
                } catch (error) {
                    return value;
                }
            }
        }

        return fallback;
    }


    /* =====================================================
       PRODUCT INFORMATION
       ===================================================== */

    const product = {

        title:
            parameter(
                [
                    "product",
                    "title",
                    "productName"
                ],
                ""
            ),

        description:
            parameter(
                [
                    "description",
                    "desc"
                ],
                ""
            ),

        price:
            Number(
                parameter(
                    [
                        "price",
                        "productPrice"
                    ],
                    "0"
                )
            ) || 0,

        delivery:
            Number(
                parameter(
                    [
                        "delivery",
                        "deliveryPrice"
                    ],
                    "0"
                )
            ) || 0,

        image:
            parameter(
                [
                    "image",
                    "productImage"
                ],
                ""
            ),

        platform:
            parameter(
                [
                    "platform",
                    "source"
                ],
                "Markaz"
            ),

        category:
            parameter(
                [
                    "category",
                    "type",
                    "productType"
                ],
                ""
            )
    };


    /* =====================================================
       DETECT WHETHER COLOR / SIZE IS NEEDED
       ===================================================== */

    function needsColorOrSize() {

        const category =
            (
                product.category +
                " " +
                product.title +
                " " +
                product.description
            ).toLowerCase();


        const clothingWords = [
            "shirt",
            "t-shirt",
            "tshirt",
            "tee",
            "dress",
            "kurta",
            "shalwar",
            "kameez",
            "suit",
            "trouser",
            "jeans",
            "pant",
            "clothes",
            "cloth",
            "clothing",
            "hoodie",
            "jacket",
            "coat",
            "wear",
            "لباس",
            "قمیض",
            "شرٹ",
            "ٹی شرٹ",
            "کپڑے"
        ];


        const shoeWords = [
            "shoe",
            "shoes",
            "sandal",
            "sandals",
            "slipper",
            "slippers",
            "sneaker",
            "sneakers",
            "jogger",
            "joggers",
            "boot",
            "boots",
            "چپل",
            "جوتا",
            "جوتے"
        ];


        const colorWords = [
            "color",
            "colour",
            "رنگ"
        ];


        const sizeWords = [
            "size",
            "سائز"
        ];


        const colorRequired =
            colorWords.some(
                word =>
                    category.includes(word)
            ) ||
            clothingWords.some(
                word =>
                    category.includes(word)
            ) ||
            shoeWords.some(
                word =>
                    category.includes(word)
            );


        const sizeRequired =
            sizeWords.some(
                word =>
                    category.includes(word)
            ) ||
            clothingWords.some(
                word =>
                    category.includes(word)
            ) ||
            shoeWords.some(
                word =>
                    category.includes(word)
            );


        return {
            color: colorRequired,
            size: sizeRequired
        };
    }


    /* =====================================================
       CREATE COLOR / SIZE FIELDS AUTOMATICALLY
       ===================================================== */

    function createVariantFields() {

        const requirement =
            needsColorOrSize();


        let container =
            getElement(
                "productOptions"
            );


        /*
          اگر HTML میں productOptions موجود نہیں،
          تو form کے اندر خود بنا دیا جائے گا۔
        */

        if (!container) {

            const form =
                getElement(
                    "orderForm"
                ) ||
                document.querySelector(
                    "form"
                );


            if (!form) {
                return;
            }


            container =
                document.createElement(
                    "div"
                );


            container.id =
                "productOptions";


            container.style.marginTop =
                "15px";


            container.style.marginBottom =
                "15px";


            form.insertBefore(
                container,
                form.querySelector(
                    'button[type="submit"]'
                )
            );
        }


        container.innerHTML = "";


        /* =================================================
           COLOR
           ================================================= */

        if (requirement.color) {

            const colorBox =
                document.createElement(
                    "div"
                );


            colorBox.className =
                "order-option";


            colorBox.style.marginBottom =
                "12px";


            colorBox.innerHTML = `
                <label
                    for="productColor"
                    style="
                        display:block;
                        font-weight:600;
                        margin-bottom:6px;
                    "
                >
                    Color <span style="color:red">*</span>
                </label>

                <input
                    type="text"
                    id="productColor"
                    name="productColor"
                    placeholder="مثلاً Black, Blue, Red"
                    required
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:11px;
                        border:1px solid #ccc;
                        border-radius:8px;
                    "
                />
            `;


            container.appendChild(
                colorBox
            );
        }


        /* =================================================
           SIZE
           ================================================= */

        if (requirement.size) {

            const sizeBox =
                document.createElement(
                    "div"
                );


            sizeBox.className =
                "order-option";


            sizeBox.innerHTML = `
                <label
                    for="productSize"
                    style="
                        display:block;
                        font-weight:600;
                        margin-bottom:6px;
                    "
                >
                    Size <span style="color:red">*</span>
                </label>

                <select
                    id="productSize"
                    name="productSize"
                    required
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:11px;
                        border:1px solid #ccc;
                        border-radius:8px;
                        background:white;
                    "
                >

                    <option value="">
                        اپنا Size منتخب کریں
                    </option>

                    <option value="XS">
                        XS
                    </option>

                    <option value="S">
                        S
                    </option>

                    <option value="M">
                        M
                    </option>

                    <option value="L">
                        L
                    </option>

                    <option value="XL">
                        XL
                    </option>

                    <option value="XXL">
                        XXL
                    </option>

                    <option value="XXXL">
                        XXXL
                    </option>

                    <option value="6">
                        Shoe 6
                    </option>

                    <option value="7">
                        Shoe 7
                    </option>

                    <option value="8">
                        Shoe 8
                    </option>

                    <option value="9">
                        Shoe 9
                    </option>

                    <option value="10">
                        Shoe 10
                    </option>

                    <option value="11">
                        Shoe 11
                    </option>

                    <option value="12">
                        Shoe 12
                    </option>

                </select>
            `;


            container.appendChild(
                sizeBox
            );
        }


        /* =================================================
           OPTIONAL NOTE
           ================================================= */

        if (
            !requirement.color &&
            !requirement.size
        ) {

            const note =
                document.createElement(
                    "div"
                );


            note.style.fontSize =
                "13px";

            note.style.opacity =
                "0.7";

            note.style.marginTop =
                "8px";

            note.textContent =
                "اس Product کے لیے Color یا Size درکار نہیں۔";


            container.appendChild(
                note
            );
        }
    }


    /* =====================================================
       LOAD PRODUCT
       ===================================================== */

    function loadProduct() {

        if (product.title) {

            setText(
                "productTitle",
                product.title
            );
        }


        if (product.description) {

            setText(
                "productDescription",
                product.description
            );
        }


        if (product.price > 0) {

            setText(
                "productPrice",
                "Rs. " +
                money(
                    product.price
                )
            );
        }


        if (product.delivery > 0) {

            setText(
                "deliveryPrice",
                "Rs. " +
                money(
                    product.delivery
                )
            );
        }


        const platform =
            getElement(
                "platform"
            );


        if (platform) {

            platform.value =
                product.platform;
        }


        const badge =
            document.querySelector(
                ".platform-badge"
            );


        if (badge) {

            badge.textContent =
                product.platform;
        }


        /* Product Image */

        const image =
            getElement(
                "productImage"
            );


        const noImage =
            getElement(
                "noImage"
            );


        if (
            image &&
            product.image
        ) {

            image.src =
                product.image;


            image.style.display =
                "block";


            if (noImage) {

                noImage.style.display =
                    "none";
            }


            image.onerror =
                function () {

                    image.style.display =
                        "none";


                    if (noImage) {

                        noImage.style.display =
                            "flex";
                    }
                };
        }


        /* Current Product Link */

        const productLink =
            getElement(
                "productLink"
            );


        if (productLink) {

            productLink.value =
                window.location.href;
        }


        updateTotal();
    }


    /* =====================================================
       TOTAL
       ===================================================== */

    function updateTotal() {

        const quantity =
            Math.max(
                1,
                Number(
                    getValue(
                        "quantity",
                        "1"
                    )
                ) || 1
            );


        const total =
            (
                product.price *
                quantity
            ) +
            product.delivery;


        setText(
            "totalPrice",
            "Rs. " +
            money(total)
        );


        setText(
            "payablePrice",
            "Rs. " +
            money(total)
        );


        return total;
    }


    /* =====================================================
       MOBILE NUMBER
       ===================================================== */

    function cleanPhone(phone) {

        return String(
            phone || ""
        ).replace(
            /[\s\-]/g,
            ""
        );
    }


    function validPhone(phone) {

        return /^03\d{9}$/.test(
            cleanPhone(phone)
        );
    }


    /* =====================================================
       RESULT MESSAGE
       ===================================================== */

    function showResult(
        message,
        success
    ) {

        const box =
            getElement(
                "result"
            );


        if (!box) {

            alert(message);

            return;
        }


        box.classList.remove(
            "hidden"
        );


        box.style.display =
            "block";


        box.style.padding =
            "14px";


        box.style.marginTop =
            "14px";


        box.style.borderRadius =
            "10px";


        box.style.lineHeight =
            "1.8";


        box.style.background =
            success
                ? "#e8f7ed"
                : "#fff0f0";


        box.style.color =
            success
                ? "#126b2f"
                : "#a00000";


        box.textContent =
            message;
    }


    /* =====================================================
       SUBMIT ORDER
       ===================================================== */

    async function submitOrder(
        event
    ) {

        event.preventDefault();


        const form =
            event.currentTarget;


        /* Customer */

        const customerName =
            getValue(
                "customerName"
            );


        const customerPhone =
            cleanPhone(
                getValue(
                    "customerPhone"
                )
            );


        const address =
            getValue(
                "address"
            );


        const quantity =
            Math.max(
                1,
                Number(
                    getValue(
                        "quantity",
                        "1"
                    )
                ) || 1
            );


        const message =
            getValue(
                "message"
            );


        /* Color / Size */

        const requirement =
            needsColorOrSize();


        const selectedColor =
            getValue(
                "productColor"
            );


        const selectedSize =
            getValue(
                "productSize"
            );


        /* =================================================
           VALIDATION
           ================================================= */

        if (!customerName) {

            showResult(
                "براہِ کرم Customer Name لکھیں۔",
                false
            );

            return;
        }


        if (
            !validPhone(
                customerPhone
            )
        ) {

            showResult(
                "براہِ کرم درست پاکستانی موبائل نمبر لکھیں، مثال: 03001234567",
                false
            );

            return;
        }


        if (!address) {

            showResult(
                "براہِ کرم مکمل Delivery Address لکھیں۔",
                false
            );

            return;
        }


        if (
            requirement.color &&
            !selectedColor
        ) {

            showResult(
                "براہِ کرم Product کا Color منتخب/درج کریں۔",
                false
            );

            return;
        }


        if (
            requirement.size &&
            !selectedSize
        ) {

            showResult(
                "براہِ کرم Product کا Size منتخب کریں۔",
                false
            );

            return;
        }


        /* =================================================
           MOBILE = ORDER ID
           ================================================= */

        const orderId =
            customerPhone;


        const total =
            (
                product.price *
                quantity
            ) +
            product.delivery;


        /* =================================================
           BUTTON
           ================================================= */

        const button =
            form.querySelector(
                'button[type="submit"]'
            );


        const oldText =
            button
                ? button.textContent
                : "";


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Order بھیجا جا رہا ہے...";
        }


        /* =================================================
           JSON DATA FOR FORMSUBMIT AJAX
           ================================================= */

        const orderData = {

            _subject:
                "Janjua Traders New Order - " +
                orderId,

            _template:
                "table",

            _captcha:
                "false",

            "Order ID":
                orderId,

            "Customer Name":
                customerName,

            "Mobile / WhatsApp":
                customerPhone,

            "Delivery Address":
                address,

            "Platform":
                product.platform,

            "Product":
                product.title ||
                getValue(
                    "productTitle",
                    "Product"
                ),

            "Product Description":
                product.description ||
                getValue(
                    "productDescription",
                    ""
                ),

            "Quantity":
                String(quantity),

            "Color":
                selectedColor ||
                "Not Required",

            "Size":
                selectedSize ||
                "Not Required",

            "Product Price":
                "Rs. " +
                money(
                    product.price
                ),

            "Delivery Charges":
                "Rs. " +
                money(
                    product.delivery
                ),

            "Total Amount":
                "Rs. " +
                money(total),

            "Additional Message":
                message ||
                "None",

            "Product Link":
                window.location.href
        };


        /* =================================================
           SEND
           ================================================= */

        try {

            const response =
                await fetch(
                    FORM_ENDPOINT,
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
                                orderData
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "FormSubmit Error"
                );
            }


            const resultData =
                await response.json()
                .catch(
                    () => ({ success: true })
                );


            if (
                resultData &&
                resultData.success === false
            ) {

                throw new Error(
                    "FormSubmit rejected the order"
                );
            }


            /* =================================================
               SUCCESS
               ================================================= */

            showResult(

                "آپ کا Order کامیابی سے Submit ہو گیا ہے۔ " +
                "Order ID: " +
                orderId +
                " | " +
                "Color: " +
                (selectedColor || "Not Required") +
                " | " +
                "Size: " +
                (selectedSize || "Not Required"),

                true
            );


            /* Clear customer fields */

            setValue(
                "customerName",
                ""
            );


            setValue(
                "customerPhone",
                ""
            );


            setValue(
                "address",
                ""
            );


            setValue(
                "quantity",
                "1"
            );


            setValue(
                "message",
                ""
            );


            /*
              Color اور Size بھی clear کریں
              تاکہ اگلا customer پچھلے customer
              کا selection نہ لے جائے۔
            */

            setValue(
                "productColor",
                ""
            );


            setValue(
                "productSize",
                ""
            );


            updateTotal();


        } catch (error) {

            console.error(
                "Janjua Traders Order Error:",
                error
            );


            showResult(

                "Order ابھی Submit نہیں ہو سکا۔ " +
                "براہِ کرم Internet چیک کرکے دوبارہ کوشش کریں۔",

                false
            );


        } finally {

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    oldText ||
                    "Order Final Submit کریں";
            }
        }
    }


    /* =====================================================
       START
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadProduct();

            /*
              Color اور Size کے fields
              خود Order Form میں بنیں گے۔
            */

            createVariantFields();


            /* Quantity */

            const quantity =
                getElement(
                    "quantity"
                );


            if (quantity) {

                quantity.addEventListener(
                    "input",
                    updateTotal
                );


                quantity.addEventListener(
                    "change",
                    updateTotal
                );
            }


            /* Order Form */

            const form =
                getElement(
                    "orderForm"
                ) ||
                document.querySelector(
                    "form"
                );


            if (form) {

                form.addEventListener(
                    "submit",
                    submitOrder
                );

            } else {

                console.warn(
                    "Janjua Traders: Order form not found."
                );
            }

        }
    );

})();
