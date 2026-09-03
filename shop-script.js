/*
========================================
JANJUA TRADERS SHOP
SHOP SCRIPT
========================================
*/


const productGrid =
    document.getElementById("productGrid");


const searchBox =
    document.getElementById("searchBox");



/*
========================================
SHOW PRODUCTS
========================================
*/

function showProducts(productList){

    productGrid.innerHTML = "";


    if(productList.length === 0){

        productGrid.innerHTML = `

            <div class="no-product">

                Product نہیں ملا۔

            </div>

        `;

        return;
    }



    productList.forEach(product => {


        const card =
            document.createElement("article");


        card.className =
            "product-card";



        card.innerHTML = `

            <div class="product-image-frame">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                    "
                >

            </div>


            <div class="product-info">


                <div class="product-name">

                    ${product.name}

                </div>



                <div class="product-description">

                    ${product.description}

                </div>



                <div class="product-price">

                    Rs. ${product.price}

                    <span class="old-price">

                        Rs. ${product.oldPrice}

                    </span>

                </div>



                <button
                    class="order-button"
                    onclick="
                        orderProduct('${product.id}')
                    "
                >

                    ORDER NOW

                </button>


            </div>

        `;


        productGrid.appendChild(card);

    });

}



/*
========================================
ORDER PRODUCT
========================================
*/

function orderProduct(productId){


    const product =
        products.find(
            item => item.id === productId
        );


    if(!product){

        alert("Product نہیں ملا۔");

        return;

    }



    /*
    ------------------------------------
    آپ کے موجودہ Order Form کا لنک
    ------------------------------------

    ابھی یہاں اپنا اصل Form Link لگائیں۔

    مثال:

    https://your-form-link.com

    ------------------------------------
    */

    const formLink =
        "FORM_LINK";



    /*
    ------------------------------------
    PRODUCT DATA
    ------------------------------------
    */


    const params =
        new URLSearchParams();


    params.set(
        "Product",
        product.name
    );


    params.set(
        "Product_Price",
        product.price
    );


    params.set(
        "Supplier",
        product.supplier
    );


    params.set(
        "Product_ID",
        product.id
    );


    params.set(
        "Product_Link",
        product.productLink
    );



    /*
    ------------------------------------
    OPEN ORDER FORM
    ------------------------------------
    */


    window.location.href =
        formLink
        + "?"
        + params.toString();

}



/*
========================================
CATEGORY
========================================
*/

function showCategory(category){


    if(category === "All"){

        showProducts(products);

        return;

    }



    const filtered =
        products.filter(
            product =>
                product.category === category
        );


    showProducts(filtered);

}



/*
========================================
SEARCH
========================================
*/

searchBox.addEventListener(
    "input",
    function(){


        const searchText =
            this.value
                .toLowerCase()
                .trim();



        if(searchText === ""){

            showProducts(products);

            return;

        }



        const filtered =
            products.filter(product => {


                return (

                    product.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(searchText)

                );

            });



        showProducts(filtered);

    }
);



/*
========================================
START SHOP
========================================
*/

showProducts(products);
