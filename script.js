/* =========================================================
   JANJUA TRADERS
   COMPLETE ORDER SCRIPT
   COLOR + SIZE ORDER FORM
   FORMSUBMIT EMAIL SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function clean(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value).replace(/\s+/g, " ").trim();
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function getValue(id) {
        const element = getElement(id);

        if (!element) {
            return "";
        }

        return clean(element.value);
    }

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
       REMOVE OLD ADDITIONAL MESSAGE
       ===================================================== */

    const oldMessage = getElement("message");

    if (oldMessage) {

        const oldLabel = oldMessage.closest("label");

        if (oldLabel) {
            oldLabel.remove();
        } else {
            oldMessage.remove();
        }
    }

    /* =====================================================
       REMOVE OLD COLOR / SIZE MESSAGE
       ===================================================== */

    document.querySelectorAll("p, div, span").forEach(function (element) {

        const text = clean(element.textContent).toLowerCase();

        if (
            text.includes("color یا size") ||
            text.includes("color or size") ||
            text.includes("size درکار نہیں") ||
            text.includes("color درکار نہیں")
        ) {

            if (
                element.id !== "productVariants" &&
                !element.closest("#productVariants")
            ) {
                element.remove();
            }
        }
    });

    /* =====================================================
       FIND A GOOD PLACE FOR COLOR + SIZE
       ===================================================== */

    let variantBox = getElement("productVariants");

    if (!variantBox) {

        variantBox = document.createElement("div");

        variantBox.id = "productVariants";

        variantBox.style.marginTop = "20px";
        variantBox.style.marginBottom = "20px";
        variantBox.style.width = "100%";

        const quantityField = getElement("quantity");

        if (quantityField) {

            const quantityLabel =
                quantityField.closest("label");

            if (quantityLabel && quantityLabel.parentNode) {

                quantityLabel.parentNode.insertBefore(
                    variantBox,
                    quantityLabel.nextSibling
                );

            } else {

                form.appendChild(variantBox);
            }

        } else {

            form.appendChild(variantBox);
        }
    }

    /* =====================================================
       CREATE COLOR + SIZE FIELDS
       ===================================================== */

    function createVariantFields() {

        variantBox.innerHTML = "";

        /* ---------- HEADING ---------- */

        const heading =
            document.createElement("div");

        heading.textContent =
            "Product Color & Size";

        heading.style.fontWeight = "700";
        heading.style.fontSize = "20px";
        heading.style.marginBottom = "15px";

        variantBox.appendChild(heading);

        /* ---------- COLOR ---------- */

        const colorLabel =
            document.createElement("label");

        colorLabel.setAttribute(
            "for",
            "productColor"
        );

        colorLabel.innerHTML = `
            <span>Color / رنگ</span>
        `;

        const colorInput =
            document.createElement("input");

        colorInput.type = "text";
        colorInput.id = "productColor";
        colorInput.name = "Product_Color";
        colorInput.placeholder =
            "مثلاً White, Black, Blue, Green";
        colorInput.autocomplete = "off";
        colorInput.required = false;

        colorLabel.appendChild(colorInput);

        variantBox.appendChild(colorLabel);

        /* ---------- SIZE ---------- */

        const sizeLabel =
            document.createElement("label");

        sizeLabel.setAttribute(
            "for",
            "productSize"
        );

        sizeLabel.innerHTML = `
            <span>Size / سائز</span>
        `;

        const sizeInput =
            document.createElement("input");

        sizeInput.type = "text";
        sizeInput.id = "productSize";
        sizeInput.name = "Product_Size";
        sizeInput.placeholder =
            "مثلاً 40, 41, 42, L, XL, XXL";
        sizeInput.autocomplete = "off";
        sizeInput.required = false;

        sizeLabel.appendChild(sizeInput);

        variantBox.appendChild(sizeLabel);

        /* ---------- STYLING ---------- */

        [colorInput, sizeInput].forEach(function (input) {

            input.style.width = "100%";
            input.style.boxSizing = "border-box";
            input.style.padding = "14px";
            input.style.marginTop = "7px";
            input.style.marginBottom = "15px";
            input.style.fontSize = "16px";
        });

        [colorLabel, sizeLabel].forEach(function (label) {

            label.style.display = "block";
            label.style.fontWeight = "600";
            label.style.marginBottom = "8px";
        });
    }

    createVariantFields();

    /* =====================================================
       PRODUCT INFORMATION
       ===================================================== */

    function getProductName() {

        const element =
            getElement("productTitle");

        if (!element) {
            return "";
        }

        return clean(
            element.value ||
            element.textContent
        );
    }

    function getProductDescription() {

        const element =
            getElement("productDescription");

        if (!element) {
            return "";
        }

        return clean(
            element.value ||
            element.textContent
        );
    }

    function getProductPrice() {

        const element =
            getElement("productPrice");

        if (!element) {
            return "0";
        }

        const raw =
            clean(
                element.value ||
                element.textContent
            );

        const number =
            raw.replace(/[^0-9.]/g, "");

        return number || "0";
    }

    function getDeliveryCharges() {

        const element =
            getElement("deliveryPrice");

        if (!element) {
            return "0";
        }

        const raw =
            clean(
                element.value ||
                element.textContent
            );

        const number =
            raw.replace(/[^0-9.]/g, "");

        return number || "0";
    }

    /* =====================================================
       PLATFORM
       ===================================================== */

    function getPlatform() {

        const platformSelect =
            form.querySelector(
                'select[name="Platform"]'
            );

        if (platformSelect) {
            return clean(platformSelect.value);
        }

        const platform =
            getElement("platform");

        if (platform) {

            return clean(
                platform.value ||
                platform.textContent
            );
        }

        return "Markaz";
    }

    /* =====================================================
       PRODUCT LINK
       ===================================================== */

    function getProductLink() {

        const hiddenLink =
            form.querySelector(
                'input[name="Product_Link"]'
            );

        if (
            hiddenLink &&
            clean(hiddenLink.value)
        ) {
            return clean(hiddenLink.value);
        }

        const productLink =
            getElement("productLink");

        if (productLink) {

            return clean(
                productLink.href ||
                productLink.value ||
                productLink.textContent
            );
        }

        return window.location.href;
    }

    /* =====================================================
       TOTAL AMOUNT
       ===================================================== */

    function calculateTotal() {

        const price =
            parseFloat(
                getProductPrice()
            ) || 0;

        const delivery =
            parseFloat(
                getDeliveryCharges()
            ) || 0;

        const quantityElement =
            getElement("quantity");

        const quantity =
            parseInt(
                quantityElement
                    ? quantityElement.value
                    : "1",
                10
            ) || 1;

        const total =
            (price * quantity) + delivery;

        hiddenField(
            "Total_Amount",
            "Rs. " + total
        );

        const totalDisplay =
            getElement("totalAmount");

        if (totalDisplay) {

            totalDisplay.textContent =
                "Rs. " + total;
        }

        return total;
    }

    /* =====================================================
       PREPARE ORDER FOR FORMSUBMIT
       ===================================================== */

    function prepareOrder() {

        const name =
            getValue("customerName");

        const phone =
            getValue("customerPhone");

        const address =
            getValue("address");

        const quantityElement =
            getElement("quantity");

        const quantity =
            quantityElement
                ? clean(quantityElement.value)
                : "1";

        const color =
            getValue("productColor");

        const size =
            getValue("productSize");

        /* =================================================
           CUSTOMER INFORMATION
           ================================================= */

        hiddenField(
            "Order_ID",
            phone
        );

        hiddenField(
            "Customer_Name",
            name
        );

        hiddenField(
            "Mobile_WhatsApp",
            phone
        );

        hiddenField(
            "Delivery_Address",
            address
        );

        /* =================================================
           PLATFORM
           ================================================= */

        hiddenField(
            "Platform",
            getPlatform()
        );

        /* =================================================
           PRODUCT
           ================================================= */

        hiddenField(
            "Product",
            getProductName()
        );

        hiddenField(
            "Product_Description",
            getProductDescription()
        );

        /* =================================================
           COLOR
           =================================================

           اگر customer نے Color لکھا ہے
           تو وہی Gmail میں جائے گا۔

           اگر خالی چھوڑا ہے
           تو صرف اسی صورت میں Not Required جائے گا۔
        */

        hiddenField(
            "Color",
            color !== ""
                ? color
                : "Not Required"
        );

        /* =================================================
           SIZE
           ================================================= */

        hiddenField(
            "Size",
            size !== ""
                ? size
                : "Not Required"
        );

        /* =================================================
           QUANTITY
           ================================================= */

        hiddenField(
            "Quantity",
            quantity
        );

        /* =================================================
           PRICE
           ================================================= */

        hiddenField(
            "Product_Price",
            "Rs. " + getProductPrice()
        );

        hiddenField(
            "Delivery_Charges",
            "Rs. " + getDeliveryCharges()
        );

        /* =================================================
           TOTAL
           ================================================= */

        calculateTotal();

        /* =================================================
           REMOVE ADDITIONAL MESSAGE COMPLETELY
           ================================================= */

        const additionalMessage =
            form.querySelector(
                '[name="Additional_Message"]'
            );

        if (additionalMessage) {
            additionalMessage.remove();
        }

        /* =================================================
           PRODUCT LINK
           ================================================= */

        hiddenField(
            "Product_Link",
            getProductLink()
        );
    }

    /* =====================================================
       LIVE TOTAL UPDATE
       ===================================================== */

    const quantity =
        getElement("quantity");

    if (quantity) {

        quantity.addEventListener(
            "input",
            function () {
                calculateTotal();
            }
        );
    }

    /* =====================================================
       LIVE COLOR UPDATE
       ===================================================== */

    const color =
        getElement("productColor");

    if (color) {

        color.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Color",
                    clean(color.value) !== ""
                        ? color.value
                        : "Not Required"
                );
            }
        );
    }

    /* =====================================================
       LIVE SIZE UPDATE
       ===================================================== */

    const size =
        getElement("productSize");

    if (size) {

        size.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Size",
                    clean(size.value) !== ""
                        ? size.value
                        : "Not Required"
                );
            }
        );
    }

    /* =====================================================
       PHONE -> ORDER ID
       ===================================================== */

    const phone =
        getElement("customerPhone");

    if (phone) {

        phone.addEventListener(
            "input",
            function () {

                hiddenField(
                    "Order_ID",
                    phone.value
                );

                hiddenField(
                    "Mobile_WhatsApp",
                    phone.value
                );
            }
        );
    }

    /* =====================================================
       FINAL FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        function () {

            /*
               تمام معلومات Submit ہونے سے پہلے
               hidden fields میں تیار کر دی جائیں گی۔
            */

            prepareOrder();
        }
    );

    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    prepareOrder();

});
