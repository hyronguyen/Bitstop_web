let currentdisplay = null;


document.addEventListener('DOMContentLoaded', () => {
    // lấy authToken từ localStorage
    const authToken = localStorage.getItem('authToken');
    

    if (!authToken) {
        // nếu chưa đăng nhập (không có token)
        window.location.href = 'login.html'; 
    } else {
        console.log('Auth token is present. User is logged in.');

        LoadProducts();
        AddAction();
        FilterProductByPrice();
    }
});

function AddAction(){
    FilterbyPlat();
}


//Load Product
async function LoadProducts() {
    try{
        const productData = await apigetAllProducts();
        const productList = productData.map(items => {
            return new Product(
                items.id,
                items.title,
                items.category,
                items.price,
                items.platform,
                items.img
            );
        });
        
        currentdisplay=productList;
        DisplayProducts(currentdisplay);
    }
    catch (error){
        console.log(error);
    }
}

//Render product ra view
function DisplayProducts(products) {
    const productContainer = document.querySelector('.lattest-product-area .row');
    productContainer.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="single-product">
                    <img class="img-fluid" src="${product.img}" alt="${product.title}" style="height:280px; weight:260px;object-fit:cover;">
                    <div class="product-details">
                        <h6>${product.title}</h6>
                        <div class="price">
                            <h6>$${product.price}</h6>
                            <h6 class="l-through">$${product.price + 100000 || 'N/A'}</h6>
                        </div>
                        <div class="prd-bottom">
                            <a href="#" class="social-info">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to bag</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-sync"></span>
                                <p class="hover-text">compare</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-move"></span>
                                <p class="hover-text">view more</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productHTML;
    });
}

//Load product dự trên platform
async function LoadProductsByPlatform(platform) {
    try {
        const response = await apigetProductsByPlat(platform);
        const productList = response.map(product => {
            return new Product(
                product.id,
                product.title,
                product.category,
                product.price,
                product.platform,
                product.img
            );
        });
        currentdisplay = productList;
        DisplayProducts(currentdisplay);
    } catch (error) {
        console.error('Error loading products by platform:', error);
    }
}


//Filter dự trên platform
function FilterbyPlat(){
    const platLinks = document.querySelectorAll('.main-nav-list.child a');
    platLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const plat = link.textContent.trim();

            if(plat=="All")
            {
                LoadProducts();
            }
            else
            {
                LoadProductsByPlatform(plat);
            }
        });
    });
}

function FilterProductByPrice(){
    const applyFilterBtn = document.getElementById('apply-filter-btn');

    // Event listener for "Apply Filter" button
    applyFilterBtn.addEventListener('click', () => {
        const lowerValue = parseInt(document.getElementById('lower-value').textContent, 10);
        const upperValue = parseInt(document.getElementById('upper-value').textContent, 10);
        

        const filteredProducts = currentdisplay.filter(product => 
            product.price >= lowerValue && product.price <= upperValue
        );
    
        const productContainer = document.querySelector('.lattest-product-area .row');

        if (filteredProducts.length === 0) {
            // Render message if no products are found
            productContainer.innerHTML = 
            '<section class="section_gap"> <p class="no-products-message">No products found for the selected price range.</p></section>';
        } else {
            // Display the filtered products
            DisplayProducts(filteredProducts);
        }
    });
}