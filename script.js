/* =========================================================
   JANJUA TRADERS - COMPLETE ORDER FORM SCRIPT
   FormSubmit + Product Details + Color + Size
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    /* -----------------------------------------------------
       BASIC ELEMENTS
       ----------------------------------------------------- */

    const customerName = document.getElementById("customerName");
    const customerPhone = document.getElementById("customerPhone");
    const address = document.getElementById("address");
    const quantity = document.getElementById("quantity");
    const message = document.getElementById("message");

    const productTitle = document.getElementById("productTitle");
    const productDescription = document.getElementById("productDescription");
    const productPrice = document.getElementById("productPrice");
    const deliveryPrice = document.getElementById("deliveryPrice");

    const platformElement = document.querySelector(
        "#platform, select[name='Platform'], input[name='Platform']"
    );

    const productLinkElement = document.querySelector(
        "#productLink, input[name='Product_Link']"
    );

    /* -----------------------------------------------------
       PRODUCT INFORMATION
       ----------------------------------------------------- */

    function cleanText(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/\s+/g, " ")
            .trim();
    }

    function getProductTitle() {
        if (!productTitle) return "";
        return cleanText(productTitle.textContent || productTitle.value);
    }

    function getProductDescription() {
        if (!productDescription) return "";
        return cleanText(
            productDescription.textContent || productDescription.value
        );
    }

    function getProductPrice() {
        if (!productPrice) return "0";

        const text = cleanText(
            productPrice.textContent || productPrice.value
        );

        const numbers = text.replace(/[^0-9.]/g, "");

        return numbers || "0";
    }

    function getDeliveryPrice() {
        if (!deliveryPrice) return "0";

        const text = cleanText(
            deliveryPrice.textContent || deliveryPrice.value
        );

        const numbers = text.replace(/[^0-9.]/g, "");

        return numbers || "0";
    }

    /* -----------------------------------------------------
       PLATFORM
       ----------------------------------------------------- */

    function getPlatform() {

        if (!platformElement) {
            return "Janjua Traders";
        }

        if (
            platformElement.tagName === "SELECT"
        ) {
            return cleanText(platformElement.value);
        }

        return cleanText(
            platformElement.value ||
            platformElement.textContent
        );
    }

    /* -----------------------------------------------------
       PRODUCT LINK
       ----------------------------------------------------- */

    function getProductLink() {

        if (productLinkElement) {

            if (productLinkElement.tagName === "A") {
                return productLinkElement.href || "";
            }

            return cleanText(
                productLinkElement.value ||
                productLinkElement.textContent
            );
        }

        return window.location.href;
    }

    /* -----------------------------------------------------
       DETECT WHETHER PRODUCT NEEDS COLOR / SIZE
       ----------------------------------------------------- */

    function productNeedsVariants() {

        const text = (
            getProductTitle() +
            " " +
            getProductDescription()
        ).toLowerCase();

        const variantWords = [
            "shoe",
            "shoes",
            "sandal",
            "sandals",
            "slipper",
            "slippers",
            "shirt",
            "t-shirt",
            "tshirt",
            "dress",
            "jeans",
            "pant",
            "pants",
            "trouser",
            "clothing",
            "jacket",
            "coat",
            "kurta",
            "shalwar",
            "suit",
            "clothes",
            "کپڑے",
            "جوتے",
            "چپل",
            "شرٹ",
            "ٹی شرٹ",
            "لباس"
        ];

        return variantWords.some(function (word) {
            return text.includes(word);
        });
    }

    /* -----------------------------------------------------
       CREATE COLOR + SIZE SECTION
       ----------------------------------------------------- */

    let variantBox = document.getElementById("productVariants");

    if (!variantBox) {

        variantBox = document.createElement("div");

        variantBox.id = "productVariants";

        variantBox.style.marginTop = "15px";
        variantBox.style.marginBottom = "15px";

        const quantityLabel =
            quantity ?
            quantity.closest("label") :
            null;

        if (quantityLabel) {
            quantityLabel.parentNode.insertBefore(
                variantBox,
                quantityLabel
            );
        } else {
            form.appendChild(variantBox);
        }
    }

    function createVariantFields() {

        variantBox.innerHTML = "";

        const needsVariants = productNeedsVariants();

        if (!needsVariants) {
            variantBox.style.display = "none";
            return;
        }

        variantBox.style.display = "block";

        /* COLOR */

        const colorLabel = document.createElement("label");

        colorLabel.innerHTML = `
            Color
            <input
                type="text"
                id="productColor"
                name="Product_Color"
                placeholder="مثلاً Black, White, Blue"
                autocomplete="off"
            >
        `;

        /* SIZE */

        const sizeLabel = document.createElement("label");

        sizeLabel.innerHTML = `
            Size
            <input
                type="text"
                id="productSize"
                name="Product_Size"
                placeholder="مثلاً 40, 41, 42, 44, XL"
                autocomplete="off"
            >
        `;

        variantBox.appendChild(colorLabel);
        variantBox.appendChild(sizeLabel);

        const colorInput =
            document.getElementById("productColor");

        const sizeInput =
            document.getElementById("productSize");

        colorInput.required = true;
        sizeInput.required = true;

        /* Simple styling */

        [colorInput, sizeInput].forEach(function (input) {

            input.style.width = "100%";
            input.style.boxSizing = "border-box";
            input.style.padding = "12px";
            input.style.marginTop = "6px";
            input.style.marginBottom = "12px";

        });
    }

    createVariantFields();

    /* -----------------------------------------------------
       HIDDEN FIELDS FOR FORMSUBMIT
       THESE GUARANTEE THAT GMAIL RECEIVES THE DATA
       ----------------------------------------------------- */

    function setHiddenField(name, value) {

        let input = form.querySelector(
            'input[type="hidden"][name="' + name + '"]'
        );

        if (!input) {

            input = document.createElement("input");

            input.type = "hidden";
            input.name = name;

            form.appendChild(input);
        }

        input.value = cleanText(value);
    }

    /* -----------------------------------------------------
       UPDATE ALL ORDER DATA
       ----------------------------------------------------- */

    function updateOrderData() {

        /* Customer */

        setHiddenField(
            "Order_ID",
            customerPhone ? customerPhone.value : ""
        );

        setHiddenField(
            "Customer_Name",
            customerName ? customerName.value : ""
        );

        setHiddenField(
            "Mobile_WhatsApp",
            customerPhone ? customerPhone.value : ""
        );

        setHiddenField(
            "Delivery_Address",
            address ? address.value : ""
        );

        /* Platform */

        setHiddenField(
            "Platform",
            getPlatform()
        );

        /* Product */

        setHiddenField(
            "Product",
            getProductTitle()
        );

        setHiddenField(
            "Product_Description",
            getProductDescription()
        );

        /* Quantity */

        setHiddenField(
            "Quantity",
            quantity ? quantity.value : "1"
        );

        /* Prices */

        setHiddenField(
            "Product_Price",
            "Rs. " + getProductPrice()
        );

        setHiddenField(
            "Delivery_Charges",
            "Rs. " + getDeliveryPrice()
        );

        /* Color */

        const colorInput =
            document.getElementById("productColor");

        setHiddenField(
            "Product_Color",
            colorInput ? colorInput.value : "N/A"
        );

        /* Size */

        const sizeInput =
            document.getElementById("productSize");

        setHiddenField(
            "Product_Size",
            sizeInput ? sizeInput.value : "N/A"
        );

        /* Additional message */

        setHiddenField(
            "Additional_Message",
            message ? message.value : ""
        );

        /* Product URL */

        setHiddenField(
            "Product_Link",
            getProductLink()
        );
    }

    /* -----------------------------------------------------
       TOTAL AMOUNT
       ----------------------------------------------------- */

    function calculateTotal() {

        const price =
            parseFloat(getProductPrice()) || 0;

        const delivery =
            parseFloat(getDeliveryPrice()) || 0;

        const qty =
            parseInt(
                quantity ? quantity.value : "1",
                10
            ) || 1;

        const total =
            (price * qty) + delivery;

        setHiddenField(
            "Total_Amount",
            "Rs. " + total
        );

        const totalElement =
            document.getElementById("totalAmount");

        if (totalElement) {

            totalElement.textContent =
                "Rs. " + total;
        }
    }

    /* -----------------------------------------------------
       INPUT EVENTS
       ----------------------------------------------------- */

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

                /* Mobile number is our Order ID */

                setHiddenField(
                    "Order_ID",
                    customerPhone.value
                );

                setHiddenField(
                    "Mobile_WhatsApp",
                    customerPhone.value
                );
            }
        );
    }

    /* -----------------------------------------------------
       FORM SUBMISSION
       ----------------------------------------------------- */

    form.addEventListener(
        "submit",
        function (event) {

            /*
             IMPORTANT:
             We do NOT prevent the normal form submission.

             FormSubmit must receive the form normally.
            */

            const needsVariants =
                productNeedsVariants();

            if (needsVariants) {

                const colorInput =
                    document.getElementById("productColor");

                const sizeInput =
                    document.getElementById("productSize");

                if (
                    !colorInput ||
                    !cleanText(colorInput.value)
                ) {

                    event.preventDefault();

                    alert(
                        "براہِ کرم Product کا Color منتخب/درج کریں۔"
                    );

                    if (colorInput) {
                        colorInput.focus();
                    }

                    return;
                }

                if (
                    !sizeInput ||
                    !cleanText(sizeInput.value)
                ) {

                    event.preventDefault();

                    alert(
                        "براہِ کرم Product کا Size درج کریں۔"
                    );

                    if (sizeInput) {
                        sizeInput.focus();
                    }

                    return;
                }
            }

            /* Put everything into the form */

            updateOrderData();

            calculateTotal();

            /*
             FormSubmit receives:
             Customer
             Mobile
             Address
             Platform
             Product
             Description
             Color
             Size
             Quantity
             Product Price
             Delivery Charges
             Total Amount
             Message
             Product Link
            */
        }
    );

    /* -----------------------------------------------------
       INITIAL DATA
       ----------------------------------------------------- */

    updateOrderData();
    calculateTotal();

});
