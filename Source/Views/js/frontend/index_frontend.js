let currentdisplay;
document.addEventListener('DOMContentLoaded', () => {
    
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        console.log('Auth token is present. User is logged in.');
        LoadProducts();
        
    }
});

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
                items.img,
                items.description,
                items.quan
            );
        });
        
        
        const latestGamesList = getRandomProducts(productList, 8);
        displayProducts(latestGamesList);
        }
    catch (error){
        console.log(error);
    }
}

function getRandomProducts(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayProducts(products) {
    const productSection = document.querySelector('#product-cards-container');
    
    // Clear any existing content
    productSection.innerHTML = ''; 

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-lg-3', 'col-md-6'); // Adjust column sizes

        productCard.innerHTML = `
            <div style="cursor: pointer;" class="single-product" onclick="selectProduct('${product.id}')">
                <img class="img-fluid product-image" src="${product.img.split(' ')[0]}" alt="${product.id}">
                <div class="product-details">
                    <h6>${product.title}</h6>
                    <div class="price">
                        <h6>${product.price.toLocaleString()} VND</h6>
                        <h6 class="l-through">${(product.price * 1.15).toLocaleString()} VND</h6> <!-- Assuming the original price is 15% higher -->
                    </div>
                    <div class="prd-bottom">
                        <a href="#" class="social-info">
                            <span class="lnr lnr-heart"></span>
                            <p class="hover-text">Wishlist</p>
                        </a>
                        <a href="#" class="social-info">
                            <span class="lnr lnr-sync"></span>
                            <p class="hover-text">Compare</p>
                        </a>
                        <a href="product_detail.html?id=${product.id}" class="social-info">
                            <span class="lnr lnr-move"></span>
                            <p class="hover-text">View more</p>
                        </a>
                    </div>
                </div>
            </div>
        `;
        productSection.appendChild(productCard);

    });
}

function selectProduct(productId) {
    sessionStorage.setItem('selectedProductId', productId); // Store the selected product ID
    window.location.href = 'single-product.html'; // Redirect to the product detail page
}