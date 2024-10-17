document.querySelector('#search_input_box form').addEventListener('submit', async function (event) {
    event.preventDefault();  

    const searchInput = document.querySelector('#search_input').value.trim();
    if (searchInput) {
        // Fetch and display products
        const products = await apigetProductsByKeyword(searchInput);
        const productList = products.map(items => {
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
        
        localStorage.setItem('searchResults', JSON.stringify(productList));
        window.location.href = 'category.html';
    } else {
        alert('Please enter a search keyword.');
    }
});