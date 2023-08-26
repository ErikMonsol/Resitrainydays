function showPopup(productDetails) {
    // Create the overlay element and assign it a class for styling.
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create the popup element and assign it a class for styling.
    const popup = document.createElement('div');
    popup.classList.add('container-popup');

    // Add content to the popup using the provided productDetails object.
    popup.innerHTML = `
<h2>${productDetails.title}</h2>
<img src="${productDetails.image}" alt="${productDetails.title}">
<p>Price: ${productDetails.price}</p>
<p>Size: ${productDetails.size}</p>`;

    // Add the 'popup-image' class to the image
    const productImage = popup.querySelector('img');
    productImage.classList.add('popup-image');

    // Get cart item count
    const itemCount = getCartItemCount();

    // Create "View Bag" button with styling
    const viewBagButton = document.createElement('button');
    viewBagButton.textContent = `View Bag (${itemCount})`;
    viewBagButton.classList.add('view-bag-button'); // Added class for styling
    viewBagButton.addEventListener('click', viewBag);
    popup.appendChild(viewBagButton);

    // Create "Check Out" button with styling
    const checkoutButton = document.createElement('button');
    checkoutButton.textContent = 'Check Out';
    checkoutButton.classList.add('checkout-button'); // Added class for styling
    checkoutButton.addEventListener('click', checkout);
    popup.appendChild(checkoutButton);

    // Create a close button for the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        overlay.remove();
    });
    popup.appendChild(closeButton);

    // Append the popup element to the overlay.
    overlay.appendChild(popup);

    // Append the overlay (with the popup inside it) to the body of the document.
    document.body.appendChild(overlay);

    // Add an event listener to the overlay, so it can be closed by clicking on it.
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}


function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}

function viewBag() {
    window.location.href = 'shoppingcart.html';
}

function checkout() {
    alert('Proceeding to checkout');
}


function checkout() {
    window.location.href = 'checkout.html';


}

function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}



let selectedSize = null; // This variable will remember the selected size
let previouslySelectedButton = null;

function createSizeButtons(sizes, productDetails) {
    const sizeContainer = document.createElement('div');
    sizeContainer.id = 'sizeButtons';

    sizes.forEach(size => {
        const button = document.createElement('button');
        button.textContent = size;
        button.classList.add('size-button');

        button.addEventListener('click', function (event) {
            handleSizeButtonClick(event, size);
        });

        sizeContainer.appendChild(button);
    });

    return sizeContainer;
}


function handleSizeButtonClick(event, size) {  // Add event parameter
    if (previouslySelectedButton) {
        previouslySelectedButton.style.backgroundColor = ''; // reset style of previously selected button
    }

    const currentButton = event.target;  // get the clicked button
    currentButton.style.backgroundColor = 'gray';  // highlight the selected button

    previouslySelectedButton = currentButton;
    selectedSize = size;
}

function addToCartHandler(productDetails) {
    if (!selectedSize) {
        alert("Please select a size first.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const effectivePrice = getEffectivePrice(productDetails);
    const cartItem = {
        ...productDetails,
        price: effectivePrice,
        image: productDetails.image,
        size: selectedSize
    };
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    showPopup(cartItem); // This shows the popup with product details when a product is added to the cart

    console.log("Sending following item to API:", cartItem); // Debug log

    // Send the product to the APIcart
    sendToAPIcart(cartItem).then(response => {
        alert(`Product with size ${selectedSize} added to cart and API!`);
    }).catch(error => {
        console.error("Failed to add to APIcart:", error);
        alert('Failed to add product to APIcart. Please try again.');
    });
}

function getEffectivePrice(productDetails) {
    return productDetails.onSale ? productDetails.discountedPrice : productDetails.price;
}

function createAddToCartButton(productDetails) {
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('add-to-cart-button');
    addToCartButton.textContent = 'Add to Cart';

    addToCartButton.addEventListener('click', function () {
        addToCartHandler(productDetails);
    });

    return addToCartButton;
}



// Function to extract URL parameters
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to fetch product details from the API
async function fetchProductDetailsFromApi(productId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/rainy-days/${productId}`);
        const data = await response.json();
        return data; // Extract product details from the response
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
}

// Function to display product details on the page
async function displayProductDetails(productId) {
    try {
        const productDetails = await fetchProductDetailsFromApi(productId);

        const productDetailsContainer = document.createElement('div');
        productDetailsContainer.classList.add('product-details');

        const productImage = document.createElement('img');
        productImage.classList.add('product-image');
        productImage.src = productDetails.image;
        productImage.alt = 'Product Image';
        productDetailsContainer.appendChild(productImage);

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const productTitle = document.createElement('h1');
        productTitle.classList.add('product-title');
        productTitle.textContent = productDetails.title;
        productInfo.appendChild(productTitle);

        const productDescription = document.createElement('p');
        productDescription.classList.add('product-description');
        productDescription.textContent = productDetails.description;
        productInfo.appendChild(productDescription);

        // Price Section
        const productPrice = document.createElement('p');
        productPrice.classList.add('product-price');
        if (productDetails.onSale) {
            const originalPrice = document.createElement('span');
            originalPrice.classList.add('product-original-price');
            originalPrice.textContent = `$${productDetails.price.toFixed(2)}`;
            originalPrice.style.textDecoration = 'line-through';
            productPrice.appendChild(originalPrice);

            const discountedPrice = document.createElement('span');
            discountedPrice.classList.add('product-discounted-price');
            discountedPrice.textContent = `$${productDetails.discountedPrice.toFixed(2)}`;
            productPrice.appendChild(discountedPrice);
        } else {
            productPrice.textContent = `Price: $${productDetails.price.toFixed(2)}`;
        }
        productInfo.appendChild(productPrice);

        const sizeButtonsContainer = createSizeButtons(productDetails.sizes, productDetails);
        productInfo.appendChild(sizeButtonsContainer);

        // Append other details...
        ['baseColor', 'favorite', 'gender', 'onSale', 'tags'].forEach(detail => {
            const detailElement = document.createElement('p');
            detailElement.classList.add(`product-${detail.toLowerCase()}`);
            switch (detail) {
                case 'tags':
                    detailElement.textContent = `Tags: ${productDetails[detail].join(', ')}`;
                    break;
                case 'favorite':
                case 'onSale':
                    detailElement.textContent = `${detail}: ${productDetails[detail] ? 'Yes' : 'No'}`;
                    break;
                default:
                    detailElement.textContent = `${detail}: ${productDetails[detail]}`;
            }
            productInfo.appendChild(detailElement);
        });

        const addToCartButton = createAddToCartButton(productDetails);
        productInfo.appendChild(addToCartButton);

        productDetailsContainer.appendChild(productInfo);
        document.body.appendChild(productDetailsContainer);

    } catch (error) {
        console.error('Error displaying product details:', error);
    }
}

function createSizeButtons(sizes, productDetails) {
    const sizeButtonsContainer = document.createElement('div');
    sizeButtonsContainer.classList.add('size-buttons-container');

    const firstRowSizes = ['XS', 'S', 'M'];
    const secondRowSizes = ['L', 'XL', 'XXL'];

    const firstRow = document.createElement('div');
    firstRow.classList.add('size-row');
    const secondRow = document.createElement('div');
    secondRow.classList.add('size-row');

    sizes.forEach(size => {
        const sizeButton = document.createElement('button');
        sizeButton.classList.add('size-button');
        sizeButton.textContent = size;

        // Add event listener from second version
        sizeButton.addEventListener('click', function (event) {
            handleSizeButtonClick(event, size);
        });

        if (firstRowSizes.includes(size)) {
            firstRow.appendChild(sizeButton);
        } else if (secondRowSizes.includes(size)) {
            secondRow.appendChild(sizeButton);
        } else {
            sizeButtonsContainer.appendChild(sizeButton);
        }
    });

    sizeButtonsContainer.appendChild(firstRow);
    sizeButtonsContainer.appendChild(secondRow);
    return sizeButtonsContainer;
}

// Assuming you're fetching a product by ID from a URL parameter:
const productId = getParameterByName('id');
displayProductDetails(productId);