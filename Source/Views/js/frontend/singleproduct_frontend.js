document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
        window.location.href = 'login.html'; 
    } else 
    {
        const selected = sessionStorage.getItem('selectedProductId')

        if(selected){
            LoadProduct(selected);
        }
        else{
            console.log("Chưa chọn sản phẩm");
        }
        
       
    }
});




async function LoadProduct(selectedId){

    try{
        const productData = await apigetProductsById(selectedId);
    
        const product = new Product(
            productData.id,
            productData.title,
            productData.category,
            productData.price,
            productData.platform,
            productData.img,
            productData.des,
            productData.quan
        );
        console.log(product);


        document.querySelector('.product-name').textContent=capitalizeEachWord(product.title);
        RenderProduct(product);
    }
    catch(error){
        console.log(error);
    }
}

function RenderProduct(product) {
    const imageCarousel = document.querySelector('.s_Product_carousel');
    const titleElement = document.querySelector('.s_product_text h3');
    const priceElement = document.querySelector('.s_product_text h2');
    const categoryElement = document.querySelector('.s_product_text .list li:first-child');
    const availabilityElement = document.querySelector('.s_product_text .list li:nth-child(2)');
    const platformElement = document.querySelector('.s_product_text p');
    const des = document.getElementById("description");
    des.innerHTML = product.description;
    // Split image URLs
    const imageUrls = product.img.split(' ');
    const defaultimg = imageUrls[0];
    imageUrls.unshift(defaultimg,defaultimg);
    // Get all image elements within the carousel
    const imageElements = imageCarousel.querySelectorAll('img');

    // Update src of existing images, up to 3 images
    imageElements.forEach((img, index) => {
        if (index < imageUrls.length) {
            img.src = imageUrls[index];
            img.alt = product.title;
        } else {
            img.src = imageUrls[0]; // Clear src if there are fewer images
            
        }
    });

    // Render giá tiền, tên 
    titleElement.textContent =capitalizeEachWord(product.title);
    priceElement.textContent = formatNumberWithCommas(product.price) + ' VND';
    categoryElement.innerHTML = `<span>Category</span> : ${product.category}`;
    
    const platforms = product.platform.split(',').map(platform => platform.trim());
    platformElement.innerHTML = platforms.map(platform => 
        `<span class="badge bg-dark text-white fs-6  me-2 p-2">${platform}</span>`
    ).join(' ');

    // Set availability or other fields as needed
    availabilityElement.innerHTML = `<span>Availability</span> : In Stock`;

    document.getElementById("addtocart").addEventListener("click", () => {
        const quantity = document.getElementById('sst').value;
        addToCart(product.id, quantity); // Pass the product ID and quantity to addToCart
    });
}


function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function capitalizeEachWord(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}




function addToCart(productId, quantity) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        // If the product already exists in the cart, update the quantity
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += parseInt(quantity); // Ensure quantity is an integer
        } else {
            // Add new product with the specified quantity
            cart.push({ id: productId, quantity: parseInt(quantity) });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert("Product added to cart successfully!");
    } catch (error) {
        console.log('Error adding product to cart:', error);
    }
}
