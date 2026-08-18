/* =========================================================
   JANJUA TRADERS
   COMPLETE ORDER SCRIPT
   COLOR + SIZE FOR EVERY PRODUCT
   FORMSUBMIT EMAIL ORDER SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    /* =====================================================
       HELPER
       ===================================================== */

    function clean(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/\s+/g, " ")
            .trim();
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function getValue(id) {

        const el = getElement(id);

        if (!el) {
            return "";
        }

        return clean(
            el.value !== undefined
                ? el.value
                : el.textContent
        );
    }

    /* =====================================================
       MAIN FORM FIELDS
       ===================================================== */

    const customerName = getElement("customerName");
    const customerPhone = getElement("customerPhone");
    const address = getElement("address");
    const quantity = getElement("quantity");
    const message = getElement("message");

    /* =====================================================
       PRODUCT DISPLAY FIELDS
       ===================================================== */

    const productTitle = getElement("productTitle");
    const productDescription = getElement("productDescription");
    const productPrice = getElement("productPrice");
    const deliveryPrice = getElement("deliveryPrice");

    /* =====================================================
       CREATE / UPDATE HIDDEN FORMSUBMIT FIELD
       ===================================================== */

    function hiddenField(name, value) {

        let field = form.querySelector(
            'input[type="hidden"][name="' + name + '"]'
        );

        if (!field) {

            field = document.createElement("input");

            field.type = "hidden";
            field.name = name;

            form.appendChild(field);
        }

        field.value = clean(value);

        return field;
    }

    /* =====================================================
       PRODUCT COLOR + SIZE
       THESE ARE AVAILABLE FOR EVERY PRODUCT
       ===================================================== */

    let variantBox =
        document.getElementById("productVariants");

    if (!variantBox) {

        variantBox = document.createElement("div");

        variantBox.id = "productVariants";

        variantBox.style.marginTop = "18px";
        variantBox.style.marginBottom = "18px";
        variantBox.style.width = "100%";

        /*
           Put Color + Size before Additional Message
        */

        if (message) {

            const messageLabel =
                message.closest("label");

            if (messageLabel) {

                messageLabel.parentNode.insertBefore(
                    variantBox,
                    messageLabel
                );

            } else {

                form.insertBefore(
                    variantBox,
                    message
                );
            }

        } else {

            form.appendChild(variantBox);
        }
    }

    /* =====================================================
       ALWAYS SHOW COLOR + SIZE
       ===================================================== */

    function createVariantFields() {

        variantBox.innerHTML = "";

        const heading =
            document.createElement("div");

        heading.innerHTML =
            "<strong>Product Color & Size</strong>";

        heading.style.fontSize = "18px";
        heading.style.marginBottom = "10px";

        variantBox.appendChild(heading);

        /* COLOR */

        const colorLabel =
            document.createElement("label");

        colorLabel.innerHTML = `
            <span>Color / رنگ</span>
            <input
                type="text"
                id="productColor"
                name="Product_Color"
                placeholder="مثلاً Black, Blue, Green"
                autocomplete="off"
            >
        `;

        /* SIZE */

        const sizeLabel =
            document.createElement("label");

        sizeLabel.innerHTML = `
            <span>Size / سائز</span>
            <input
                type="text"
                id="productSize"
                name="Product_Size"
                placeholder="مثلاً 40, 41, 42, XL, XXL"
                autocomplete="off"
            >
        `;

        variantBox.appendChild(colorLabel);
        variantBox.appendChild(sizeLabel);

        const color =
            document.getElementById("productColor");

        const size =
            document.getElementById("productSize");

        /*
           IMPORTANT:
           دونوں OPTIONAL ہیں۔
           ہر Product میں نظر آئیں گے،
           لیکن ہر Product کے لیے لازمی نہیں۔
        */

        color.required = false;
        size.required = false;

        color.style.width = "100%";
        color.style.boxSizing = "border-box";
        color.style.padding = "12px";
        color.style.marginTop = "6px";
        color.style.marginBottom = "12px";

        size.style.width = "100%";
        size.style.boxSizing = "border-box";
        size.style.padding = "12px";
        size.style.marginTop = "6px";
        size.style.marginBottom = "12px";
    }

    createVariantFields();

    /* =====================================================
       REMOVE OLD "NO COLOR OR SIZE REQUIRED" MESSAGE
       ===================================================== */

    function removeOldVariantMessage() {

        const allElements =
            document.querySelectorAll("p, div, span");

        allElements.forEach(function (element) {

            const text =
                clean(element.textContent);

            if (
                text.includes("Color یا Size درکار نہیں") ||
                text.includes("Color or Size is not required") ||
                text.includes("Color or Size") &&
                text.includes("required")
            ) {

                /*
                   Do not remove our actual Color/Size box
                */

                if (
                    element.id !== "productVariants" &&
                    !element.closest("#productVariants")
                ) {
                    element.style.display = "none";
                }
            }
        });
    }

    removeOldVariantMessage();

    /* =====================================================
       PRODUCT DATA
       ===================================================== */

    function productName() {

        if (!productTitle) {
            return "";
        }

        return clean(
            productTitle.value ||
            productTitle.textContent
        );
    }

    function productDescription() {

        if (!productDescription) {
            return "";
        }

        return clean(
            productDescription.value ||
            productDescription.textContent
        );
    }

    function priceValue() {

        if (!productPrice) {
            return "0";
        }

        const text =
            clean(
                productPrice.value ||
                productPrice.textContent
            );

        const number =
            text.replace(/[^0-9.]/g, "");

        return number || "0";
    }

    function deliveryValue() {

        if (!deliveryPrice) {
            return "0";
        }

        const text =
            clean(
                deliveryPrice.value ||
                deliveryPrice.textContent
            );

        const number =
            text.replace(/[^0-9.]/g, "");

        return number || "0";
    }

    /* =====================================================
       PLATFORM
       ===================================================== */

    function platformValue() {

        const select =
            document.querySelector(
                "select[name='Platform']"
            );

        if (select) {
            return clean(select.value);
        }

        const platform =
            getElement("platform");

        if (platform) {

            return clean(
                platform.value ||
                platform.textContent
            );
        }

        return "Janjua Traders";
    }

    /* =====================================================
       PRODUCT LINK
       ===================================================== */

    function productLink() {

        const input =
            document.querySelector(
                "input[name='Product_Link']"
            );

        if (input && clean(input.value)) {
            return clean(input.value);
        }

        const link =
            getElement("productLink");

        if (link) {

            return clean(
                link.href ||
                link.value ||
                link.textContent
            );
        }

        return window.location.href;
    }

    /* =====================================================
       TOTAL
       ===================================================== */

    function calculateTotal() {

        const price =
            parseFloat(priceValue()) || 0;

        const delivery =
            parseFloat(deliveryValue()) || 0;

        const qty =
            parseInt(
                quantity
                    ? quantity.value
                    : "1",
                10
            ) || 1;

        const total =
            (price * qty) + delivery;

        hiddenField(
            "Total_Amount",
            "Rs. " + total
        );

        const totalElement =
            getElement("totalAmount");

        if (totalElement) {

            totalElement.textContent =
                "Rs. " + total;
        }

        return total;
    }

    /* =====================================================
       PREPARE COMPLETE ORDER
       ===================================================== */

    function prepareOrder() {

        const phone =
            customerPhone
                ? clean(customerPhone.value)
                : "";

        const color =
            getValue("productColor");

        const size =
            getValue("productSize");

        /* -----------------------------------------------
           CUSTOMER
           ----------------------------------------------- */

        hiddenField(
            "Order_ID",
            phone
        );

        hiddenField(
            "Customer_Name",
            customerName
                ? customerName.value
                : ""
        );

        hiddenField(
            "Mobile_WhatsApp",
            phone
        );

        hiddenField(
            "Delivery_Address",
            address
                ? address.value
                : ""
        );

        /* -----------------------------------------------
           PLATFORM
           ----------------------------------------------- */

        hiddenField(
            "Platform",
            platformValue()
        );

        /* -----------------------------------------------
           PRODUCT
           ----------------------------------------------- */

        hiddenField(
            "Product",
            productName()
        );

        hiddenField(
            "Product_Description",
            productDescription()
        );

        /* -----------------------------------------------
           COLOR
           ----------------------------------------------- */

        hiddenField(
            "Product_Color",
            color || "Not specified"
        );

        /* -----------------------------------------------
           SIZE
           ----------------------------------------------- */

        hiddenField(
            "Product_Size",
            size || "Not specified"
        );

        /* -----------------------------------------------
           QUANTITY
           ----------------------------------------------- */

        hiddenField(
            "Quantity",
            quantity
                ? quantity.value
                : "1"
        );

        /* -----------------------------------------------
           PRICE
           ----------------------------------------------- */

        hiddenField(
            "Product_Price",
            "Rs. " + priceValue()
        );

        hiddenField(
            "Delivery_Charges",
            "Rs. " + deliveryValue()
        );

        /* -----------------------------------------------
           TOTAL
           ----------------------------------------------- */

        calculateTotal();

        /* -----------------------------------------------
           ADDITIONAL MESSAGE
           ----------------------------------------------- */

        hiddenField(
            "Additional_Message",
            message
                ? message.value
                : ""
        );

        /* -----------------------------------------------
           PRODUCT LINK
           ----------------------------------------------- */

        hiddenField(
            "Product_Link",
            productLink()
        );
    }

    /* =====================================================
       LIVE UPDATE
       ===================================================== */

    if (quantity) {

        quantity.addEventListener(
            "input",
            function () {
                calculateTotal();
            }
        );
    }

    if (customerPhone) {

        customerPhone.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Order_ID",
                    customerPhone.value
                );

                hiddenField(
                    "Mobile_WhatsApp",
                    customerPhone.value
                );
            }
        );
    }

    /* =====================================================
       FINAL SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        function () {

            /*
               Do NOT stop FormSubmit.
               Just prepare all data before normal submission.
            */

            prepareOrder();

        }
    );

    /* =====================================================
       INITIALIZE
       ===================================================== */

    prepareOrder();

});
