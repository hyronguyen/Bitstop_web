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
            productData.des
        );

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
    const descriptionElement = document.querySelector('.s_product_text p');

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
    descriptionElement.textContent = product.description;

    // Set availability or other fields as needed
    availabilityElement.innerHTML = `<span>Availability</span> : In Stock`;
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
