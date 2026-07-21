// Custom JavaScript for E-commerce site with Cart functionality

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hamorona E-commerce site loaded!');

    // Example: Add a simple animation to hero section on load
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = 0;
        hero.style.transform = 'translateY(20px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            hero.style.opacity = 1;
            hero.style.transform = 'translateY(0)';
        }, 100);
    }

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            cartCountElement.classList.toggle('hidden', totalItems === 0);
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} nampidirina tao anaty panier!`);
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price)
            };
            addToCart(product);
        });
    });

    // Cart page specific functions
    if (document.getElementById('cart-items')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-600">Tsy misy vokatra ao anaty panier.</p>';
                cartTotalElement.textContent = 'Ar 0';
                checkoutBtn.classList.add('hidden');
                return;
            }

            cart.forEach(item => {
                total += item.price * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.classList.add('flex', 'justify-between', 'items-center', 'bg-white', 'p-4', 'rounded-lg', 'shadow-sm', 'mb-4');
                itemElement.innerHTML = `
                    <div>
                        <h3 class="font-semibold text-lg">${item.name}</h3>
                        <p class="text-gray-600">${item.price.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="update-quantity-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300" data-id="${item.id}" data-action="decrease">-</button>
                        <span class="font-bold">${item.quantity}</span>
                        <button class="update-quantity-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300" data-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${item.id}">Fafao</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            cartTotalElement.textContent = total.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' });
            checkoutBtn.classList.remove('hidden');
        }

        function updateQuantity(id, action) {
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                if (action === 'increase') {
                    cart[itemIndex].quantity++;
                } else if (action === 'decrease') {
                    cart[itemIndex].quantity--;
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
                    }
                }
                saveCart();
                renderCart();
            }
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            renderCart();
        }

        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('update-quantity-btn')) {
                const id = event.target.dataset.id;
                const action = event.target.dataset.action;
                updateQuantity(id, action);
            } else if (event.target.classList.contains('remove-from-cart-btn')) {
                const id = event.target.dataset.id;
                removeFromCart(id);
            }
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Tsy misy vokatra ao anaty panier mba hanaovana commande.');
                return;
            }

            let whatsappMessage = "Salama, te hanao commande ireto vokatra ireto aho:\n\n";
            let totalAmount = 0;

            cart.forEach(item => {
                whatsappMessage += `- ${item.name} x ${item.quantity} (${item.price.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}/unité)\n`;
                totalAmount += item.price * item.quantity;
            });

            whatsappMessage += `\nTotal: ${totalAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}`;

            const whatsappURL = `https://wa.me/261323911654?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappURL, '_blank');

            // Optionally clear cart after checkout
            // cart = [];
            // saveCart();
            // renderCart();
        });

        renderCart();
    }

    updateCartCount(); // Initial update of cart count on all pages
});
