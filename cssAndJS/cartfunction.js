document.addEventListener('DOMContentLoaded', function () {
    let selectedSize = null;
    let previouslySelectedButton = null;

    function checkout() {
        window.location.href = 'checkout.html';
    }

    // Function to display cart items on the cart page
    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartItemsContainer = document.querySelector(".cart-items");
        const cartTotalElement = document.getElementById("cart-total");
        let total = 0;

        cartItemsContainer.innerHTML = "";

        cart.forEach(function (item, index) {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");

            const itemImage = document.createElement("img");
            itemImage.src = item.image;
            itemImage.alt = item.title;
            itemImage.classList.add("cart-item-image");
            cartItemDiv.appendChild(itemImage);

            const itemNameElement = document.createElement("div");
            itemNameElement.classList.add("cart-item-name");
            itemNameElement.textContent = item.title;
            cartItemDiv.appendChild(itemNameElement);

            const itemSizeElement = document.createElement("div");
            itemSizeElement.textContent = `Size: ${item.size}`;
            cartItemDiv.appendChild(itemSizeElement);

            const itemPriceElement = document.createElement("div");
            itemPriceElement.textContent = "$" + item.price.toFixed(2);
            cartItemDiv.appendChild(itemPriceElement);

            // Create a "Remove" button for each item
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.addEventListener("click", function () {
                removeFromCart(index);
            });
            cartItemDiv.appendChild(removeButton);

            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price;
        });

        cartTotalElement.textContent = "$" + total.toFixed(2);

        // Check if checkout button already exists
        const existingCheckoutButton = document.querySelector(".checkout-button");
        if (!existingCheckoutButton) {
            // If it doesn't exist, create and append it
            const checkoutButton = document.createElement("button");
            checkoutButton.textContent = "Checkout";
            checkoutButton.classList.add("checkout-button");

            // Attach the checkout function as an event listener to the button
            checkoutButton.addEventListener("click", checkout);

            // Append the button to the summary div
            const summaryDiv = document.querySelector(".summary");
            summaryDiv.appendChild(checkoutButton);
        }
    }

    // Function to remove an item from the cart
    function removeFromCart(index) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1); // Remove the item at the specified index
            localStorage.setItem("cart", JSON.stringify(cart)); // Update the cart in localStorage
            displayCartItems(); // Update the displayed cart items
        }
    }

    // Call the function to display cart items
    displayCartItems();
});
