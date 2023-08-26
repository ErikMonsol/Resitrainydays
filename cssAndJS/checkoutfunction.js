document.addEventListener("DOMContentLoaded", function () {
    function showContactInfo() {
        document.getElementById('personalDetailsSection').style.display = 'none';
        document.getElementById('contactInfoSection').style.display = 'block';
    }

    function showPaymentDetails() {
        document.getElementById('contactInfoSection').style.display = 'none';
        document.getElementById('paymentDetailsSection').style.display = 'block';
    }

    function showPaymentSection() {
        // Here you can validate the email and phone number if you wish
        // ...

        // Navigate to the payment section
        document.getElementById('contactInfoSection').style.display = 'none';
        document.getElementById('paymentDetailsSection').style.display = 'block';
    }

    let validCountries = [];

    // Fetch the countries list when the page loads
    window.onload = function () {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                // Extract the country names, convert them to lowercase and store them in the validCountries array
                validCountries = data.map(country => country.name.common.toLowerCase());
            })
            .catch(error => {
                console.error("There was an error fetching the countries:", error);
            });
    };

    function showContactInfo() {
        const userCountryInput = document.getElementById("country").value.toLowerCase(); // Convert user input to lowercase

        if (!validCountries.includes(userCountryInput)) {
            alert("Please enter a valid country.");
            return;
        }

        // If the country is valid:
        alert("Valid country entered!");

        // Hide the personal details section
        document.getElementById('personalDetailsSection').style.display = 'none';

        // Display the contact information section
        document.getElementById('contactInfoSection').style.display = 'block';
    }


    // Function to display cart items on the checkout page
    function displayCheckoutItems() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const checkoutItemsContainer = document.querySelector(".checkout-items-container");
        const checkoutTotalElement = document.getElementById("checkout-total");
        let total = 0;

        checkoutItemsContainer.innerHTML = "";

        cart.forEach(function (item) {
            const checkoutItemDiv = document.createElement("div");
            checkoutItemDiv.classList.add("checkout-item");

            const itemImage = document.createElement("img");
            itemImage.src = item.image;
            itemImage.alt = item.title;
            itemImage.classList.add("checkout-item-image");
            checkoutItemDiv.appendChild(itemImage);

            const itemNameElement = document.createElement("div");
            itemNameElement.classList.add("checkout-item-name");
            itemNameElement.textContent = item.title;
            checkoutItemDiv.appendChild(itemNameElement);

            const itemSizeElement = document.createElement("div");
            itemSizeElement.textContent = `Size: ${item.size}`;
            checkoutItemDiv.appendChild(itemSizeElement);

            const itemPriceElement = document.createElement("div");
            itemPriceElement.textContent = "$" + item.price.toFixed(2);
            checkoutItemDiv.appendChild(itemPriceElement);

            checkoutItemsContainer.appendChild(checkoutItemDiv);
            total += item.price;
        });

        checkoutTotalElement.textContent = total.toFixed(2);
    }

    // Call the function to display checkout items
    displayCheckoutItems();
});
