document.querySelector('#search_input_box form').addEventListener('submit', async function (event) {
    event.preventDefault();  

    const searchInput = document.querySelector('#search_input').value.trim();
    if (searchInput) {
        // Fetch and display products
        const products = await apigetProductsByKeyword(searchInput);
        
        localStorage.setItem('searchResults', JSON.stringify(products));
        window.location.href = 'category.html';
    } else {
        alert('Please enter a search keyword.');
    }
});