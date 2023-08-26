document.addEventListener('DOMContentLoaded', function () {

    function addToCartHandler(productDetails) {
        // Retrieve the existing cart from local storage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Push the product details to the cart array, including the image URL
        cart.push({
            ...productDetails,
            image: productDetails.image // Include the image URL
        });

        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        console.log('Product added to cart:', productDetails);

        // Optionally, display a confirmation message
        alert('Product added to cart!');
    }

    const rainyDaysList = document.getElementById('rainy-days-list');

    // Function to fetch rainy days data from the API
    async function fetchRainyDaysFromApi() {
        try {
            const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
            const data = await response.json();
            return data; // Extract rainy days data from the response
        } catch (error) {
            console.error('Error fetching rainy days:', error);
            throw error;
        }
    }

    // Function to display the rainy days list on the page
    async function displayRainyDaysList() {
        try {
            const rainyDays = await fetchRainyDaysFromApi();

            rainyDays.forEach(rainyDay => {
                // Create a container for each rainy day
                const rainyDayContainer = document.createElement('a'); // Changed from 'div' to 'a'
                rainyDayContainer.href = `Productpage.html?id=${rainyDay.id}`;
                rainyDayContainer.classList.add('rainy-day-container');

                // Create an image element for the product image
                const image = document.createElement('img');
                image.classList.add('rainy-day-image');
                image.src = rainyDay.image;
                image.alt = rainyDay.title;

                // Create a heading for the rainy day's title
                const title = document.createElement('h2');
                title.classList.add('rainy-day-title');
                title.textContent = rainyDay.title;

                // Create a paragraph for the rainy day's description
                const description = document.createElement('p');
                description.classList.add('rainy-day-description');
                description.textContent = rainyDay.description;

                // Add the elements to the rainy day container
                rainyDayContainer.appendChild(image);
                rainyDayContainer.appendChild(title);
                rainyDayContainer.appendChild(description);

                // Add the rainy day container to the rainy days list
                rainyDaysList.appendChild(rainyDayContainer);
            });
        } catch (error) {
            // Handle error by displaying an error message
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'An error occurred while fetching rainy days.';
            rainyDaysList.appendChild(errorMessage);
        }
    }

    // Call the function to display the rainy days list
    displayRainyDaysList();
});
