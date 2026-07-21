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

    // Function to render products (used on index.html and products.html)
    async function renderProducts(containerId, isFeatured = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error.message);
            container.innerHTML = '<p class="text-red-500">Tsy afaka maka vokatra. Andramo indray azafady.</p>';
            return;
        }

        container.innerHTML = ''; // Clear existing content

        const productsToDisplay = isFeatured ? products.slice(0, 3) : products;

        if (productsToDisplay.length === 0) {
            container.innerHTML = '<p class="text-gray-600 text-center col-span-full">Tsy misy vokatra haseho amin\'izao fotoana izao.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'product-card');
            productCard.setAttribute('data-id', product.id);
            productCard.setAttribute('data-name', product.name);
            productCard.setAttribute('data-price', product.price);
            productCard.setAttribute('data-stock', product.stock);

            // Construct image URL from Supabase storage if path exists
            let imageUrl = 'https://picsum.photos/400/300'; // Default placeholder
            if (product.image_path) {
                const { data } = supabase.storage.from('product_images').getPublicUrl(product.image_path);
                if (data && data.publicUrl) {
                    imageUrl = data.publicUrl;
                }
            }

            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 mb-2 text-sm">${product.description || 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra.'}</p>
                    <p class="text-gray-500 text-xs mb-4">Stock: ${product.stock !== undefined ? product.stock : 'Tsy voafaritra'}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-blue-600 font-bold text-lg">Ar ${parseFloat(product.price).toLocaleString('mg-MG')}</span>
                        <button class="add-to-cart-btn bg-blue-500 text-white py-2 px-4 rounded-full text-sm hover:bg-blue-600 transition duration-300" ${product.stock <= 0 ? 'disabled' : ''}>
                            ${product.stock <= 0 ? 'Tsy misy intsony' : 'Ampidiro anaty Panier'}
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(productCard);
        });

        // Add event listeners for new buttons
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.product-card');
                if (parseInt(productCard.dataset.stock) <= 0) {
                    alert('Tsy misy intsony io vokatra io.');
                    return;
                }
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: parseFloat(productCard.dataset.price)
                };
                addToCart(product);
            });
        });
    }

    // Load products on specific pages
    if (document.getElementById('featured-products-container')) {
        renderProducts('featured-products-container', true);
    }
    if (document.getElementById('all-products-container')) {
        renderProducts('all-products-container');
    }

    // Cart page specific functions
    if (document.getElementById('cart-items')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-600 text-center">Tsy misy vokatra ao anaty panier.</p>';
                cartTotalElement.textContent = 'Ar 0';
                checkoutBtn.classList.add('hidden');
                return;
            }

            cart.forEach(item => {
                total += item.price * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.classList.add('flex', 'flex-col', 'sm:flex-row', 'justify-between', 'items-center', 'bg-white', 'p-4', 'rounded-lg', 'shadow-sm', 'mb-4');
                itemElement.innerHTML = `
                    <div class="mb-2 sm:mb-0">
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

    // Admin page specific logic
    if (window.location.pathname.endsWith('/admin.html')) {
        const activationCode = '080600'; // Code d'activation privé
        const enteredCode = prompt('Ampidiro ny code d\'activation:');

        if (enteredCode !== activationCode) {
            alert('Code d\'activation diso!');
            window.location.href = 'index.html'; // Rediriger si le code est incorrect
            return;
        }

        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const name = document.getElementById('product-name').value;
                const description = document.getElementById('product-description').value;
                const price = parseFloat(document.getElementById('product-price').value);
                const stock = parseInt(document.getElementById('product-stock').value);
                const imageFile = document.getElementById('product-image-upload').files[0]; // Get the file input

                if (!name || !price || isNaN(price) || !stock || isNaN(stock)) {
                    alert('Fenoy azafady ny anarana, ny vidiny ary ny tahiry.');
                    return;
                }

                let imagePath = null;
                if (imageFile) {
                    const fileExtension = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}.${fileExtension}`;
                    const filePath = `public/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('product_images')
                        .upload(filePath, imageFile);

                    if (uploadError) {
                        console.error('Error uploading image:', uploadError.message);
                        alert('Tsy nahomby ny fampidirana sary: ' + uploadError.message);
                        return;
                    }
                    imagePath = filePath;
                }

                const { data, error } = await supabase
                    .from('products')
                    .insert([
                        { name, description, price, stock, image_path: imagePath } // Store the path, not the URL
                    ]);

                if (error) {
                    console.error('Error adding product:', error.message);
                    alert('Tsy nahomby ny fampidirana vokatra: ' + error.message);
                } else {
                    alert('Vokatra nampidirina soa aman-tsara!');
                    addProductForm.reset();
                }
            });
        }
    }
});
