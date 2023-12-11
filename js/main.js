document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('loggedIn');

    if (isLoggedIn) {
    } else {
        showLoginForm();
    }
});

function initializeShoppingCart() {
    const shoppingCart = [];
    sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function showShoppingCart() {
    const carritosGuardados = JSON.parse(sessionStorage.getItem('carritosGuardados')) || [];
    const listaCarrito = document.querySelector('#carrito-container');

    if (!listaCarrito) {
        console.error('Element with id "carrito-container" not found.');
        return;
    }

    listaCarrito.innerHTML = '';

    if (carritosGuardados.length > 0) {
        // Itera sobre los carritos guardados
        carritosGuardados.forEach((carrito, index) => {
            const carritoCard = document.createElement('div');
            carritoCard.classList.add('carrito-card');

            carritoCard.innerHTML = `
                <p>Carrito ${index + 1}:</p>
                <ul>
                    ${carrito.map(item => `
                        <li>
                            <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px;">
                            ${item.nombre} - ${item.cantidad} unidades
                        </li>`).join('')}
                </ul>
            `;

            listaCarrito.appendChild(carritoCard);
        });
    } else {
        listaCarrito.innerHTML += '<p>No tienes carritos guardados.</p>';
    }
}


function addToCart(product) {
    const id = product.id;
    const nombre = product.title;
    const precio = product.price;

    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        const nuevoProducto = {
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: product.image  
        };
        carrito.push(nuevoProducto);
    }

    sessionStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();
}

function vaciarCarrito() {
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    if (carrito.length > 0) {
        carrito.pop();  // Elimina el último producto del carrito
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const listaCarrito = document.querySelector('#carrito-container');

    if (!listaCarrito) {
        console.error('Element with id "carrito-container" not found.');
        return;
    }

    listaCarrito.innerHTML = '';

    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    carrito.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.style.width = '50px';  // Ajustamos el tamaño de la imagen

        const nombre = document.createElement('p');
        nombre.textContent = producto.nombre;

        const precio = document.createElement('p');
        precio.textContent = `$${producto.precio.toFixed(2)}`;

        const cantidad = document.createElement('p');
        cantidad.textContent = `Cantidad: ${producto.cantidad}`;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.dataset.id = producto.id;
        botonEliminar.addEventListener('click', () => eliminarProducto(producto.id));

        const botonGuardar = document.createElement('button');
        botonGuardar.textContent = 'Confirmar compra';
        botonGuardar.dataset.id = producto.id;
        botonGuardar.addEventListener('click', () => guardarCarrito(producto.id));

        card.appendChild(imagen);
        card.appendChild(nombre);
        card.appendChild(precio);
        card.appendChild(cantidad);
        card.appendChild(botonEliminar);
        card.appendChild(botonGuardar);

        listaCarrito.appendChild(card);
    });
}

function eliminarProducto(id) {
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const productoExistente = carrito.find(producto => producto.id === id);

    if (productoExistente) {
        if (productoExistente.cantidad > 1) {
            productoExistente.cantidad--;  // Si hay más de uno, reduce la cantidad
        } else {
            carrito = carrito.filter(producto => producto.id !== id);  // Elimina el producto si solo hay uno
        }

        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}

function guardarCarrito(idProducto) {
    const carritoActual = JSON.parse(sessionStorage.getItem('carrito')) || [];
    
    // Encuentra el producto en el carrito actual
    const productoGuardado = carritoActual.find(producto => producto.id === idProducto);

    if (productoGuardado) {
        // Obtiene todos los carritos guardados del sessionStorage
        const carritosGuardados = JSON.parse(sessionStorage.getItem('carritosGuardados')) || [];
        
        // Agrega el carrito actual al historial
        carritosGuardados.push(carritoActual);

        // Actualiza el sessionStorage con los carritos guardados
        sessionStorage.setItem('carritosGuardados', JSON.stringify(carritosGuardados));

        // Reinicia el carrito actual después de guardarlo
        sessionStorage.setItem('carrito', JSON.stringify([]));

        // Actualiza la visualización del carrito en la interfaz
        actualizarCarrito();
    } else {
        console.error('Producto no encontrado en el carrito actual.');
    }
}

function displayPurchaseHistory(username) {
    const purchaseHistoryContainer = document.createElement('div');
    purchaseHistoryContainer.id = 'purchaseHistory';
    purchaseHistoryContainer.innerHTML = '<h3>Purchase History</h3>';

    const purchaseHistory = JSON.parse(sessionStorage.getItem('carritosGuardados')) || [];
    if (purchaseHistory.length > 0) {
        purchaseHistory.forEach((carrito, index) => {
            const carritoCard = document.createElement('div');
            carritoCard.classList.add('carrito-card');

            carritoCard.innerHTML = `
                <p>Carrito ${index + 1}:</p>
                <ul>
                    ${carrito.map(item => `
                        <li>
                            <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px;">
                            ${item.nombre} - ${item.cantidad} unidades
                        </li>`).join('')}
                </ul>
            `;

            purchaseHistoryContainer.appendChild(carritoCard);
        });
    } else {
        purchaseHistoryContainer.innerHTML += '<p>No hay carritos guardados.</p>';
    }

    const profileContainer = document.getElementById('profileSection');
    profileContainer.appendChild(purchaseHistoryContainer);
}

function displayLoggedInUser(username) {
    // Oculta todos los elementos innecesarios
    hideLoginForm();
    hideRegisterButton();
    hideLoginButton();
    hideAddProductButton();
    hideViewProfileButton();

    // Muestra el mensaje de bienvenida
    const welcomeMessage = document.createElement('div');
    welcomeMessage.id = 'welcomeMessage';
    welcomeMessage.textContent = `¡Hola, ${username}!`;
    document.querySelector('header').appendChild(welcomeMessage);

    // Muestra el botón "View Profile"
    const viewProfileButton = document.createElement('button');
    viewProfileButton.id = 'viewProfileButton';
    viewProfileButton.textContent = 'View Profile';
    viewProfileButton.addEventListener('click', () => viewProfile(username));
    document.getElementById('userSection').appendChild(viewProfileButton);

    // Muestra el botón "Log Out"
    const logOutButton = document.createElement('button');
    logOutButton.textContent = 'Log Out';
    logOutButton.addEventListener('click', () => logOut());
    document.getElementById('userSection').appendChild(logOutButton);

    // Muestra el formulario de filtro de categorías
    fetchCategoriesAndShowFilterForm();

    // Muestra la sección de productos
    showProductsSection();

    // Muestra el botón "Add Product"
    showAddProductButton();

    // Aplica estilos adicionales si es necesario
    const style = document.createElement('style');
    style.innerHTML = `
        #welcomeMessage {
            font-size: 2em;
            font-weight: bold;
            color: #4CAF50;
            margin-right: 20px;
        }
    `;
    document.head.appendChild(style);
}

function displayLoggedInUser(username) {
    // Oculta todos los elementos innecesarios
    hideLoginForm();
    hideRegisterButton();
    hideLoginButton();
    hideAddProductButton();
    hideViewProfileButton();

    // Muestra el mensaje de bienvenida
    const welcomeMessage = document.createElement('div');
    welcomeMessage.id = 'welcomeMessage';
    welcomeMessage.textContent = `¡Hola, ${username}!`;
    document.querySelector('header').appendChild(welcomeMessage);

    // Muestra el botón "View Profile"
    const viewProfileButton = document.createElement('button');
    viewProfileButton.id = 'viewProfileButton';
    viewProfileButton.textContent = 'View Profile';
    viewProfileButton.addEventListener('click', () => viewProfile(username));
    document.getElementById('userSection').appendChild(viewProfileButton);

    // Muestra el botón "Log Out"
    const logOutButton = document.createElement('button');
    logOutButton.textContent = 'Log Out';
    logOutButton.addEventListener('click', () => logOut());
    document.getElementById('userSection').appendChild(logOutButton);

    // Muestra el formulario de filtro de categorías
    fetchCategoriesAndShowFilterForm();

    // Muestra la sección de productos
    showProductsSection();

    // Muestra el botón "Add Product"
    showAddProductButton();

    // Aplica estilos adicionales si es necesario
    const style = document.createElement('style');
    style.innerHTML = `
        #welcomeMessage {
            font-size: 2em;
            font-weight: bold;
            color: #4CAF50;
            margin-right: 20px;
        }
    `;
    document.head.appendChild(style);
}

function showAddProductButton() {
    const footer = document.querySelector('footer');
    if (footer && !document.getElementById('addProductButton')) {
        // Crea el botón "Add Product" si no existe
        const addProductButton = document.createElement('button');
        addProductButton.id = 'addProductButton';
        addProductButton.textContent = 'Add Product';

        // Añade el evento clic para mostrar el formulario al hacer clic en el botón
        addProductButton.addEventListener('click', toggleAddProductForm);

        // Agrega el botón al footer
        footer.appendChild(addProductButton);
    }
}

function toggleAddProductForm() {
    const isFormVisible = isElementVisible('addProductFormContainer');

    if (isFormVisible) {
        // Oculta el formulario si ya está visible
        hideAddProductForm();
        showAddProductButton();  // Muestra el botón de nuevo
    } else {
        // Muestra el formulario si está oculto
        showAddProductForm();
        hideAddProductButton();  // Oculta el botón mientras se muestra el formulario
    }
}

function showAddProductForm() {
    // Oculta la sección de productos y el formulario de categorías
    hideProductsSection();
    hideCategoryForm();

    const addProductFormContainer = createAndAppendElement('div', 'addProductFormContainer', document.body);

    // Crea el formulario de añadir producto
    const addProductForm = createAndAppendElement('form', 'addProductForm', addProductFormContainer);
    addProductForm.innerHTML = `
        <label for="product-name">Product Name:</label>
        <input type="text" id="product-name" required>
        <br>
        <label for="product-price">Product Price:</label>
        <input type="text" id="product-price" required>
        <br>
        <label for="product-description">Product Description:</label>
        <textarea id="product-description" required></textarea>
        <br>
        <label for="product-image">Product Image URL:</label>
        <input type="text" id="product-image" placeholder="Enter image URL">
        <br>
        <label for="product-file">Upload Image:</label>
        <input type="file" id="product-file" accept="image/*">
        <br>
        <button type="button" onclick="addProduct()">Add Product</button>
    `;

    // Muestra el formulario
    addProductFormContainer.style.display = 'block';
}

function hideAddProductForm() {
    hideElement('addProductFormContainer');
}

function addProduct() {
    // Obtiene los valores del formulario
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const productImageInput = document.getElementById('product-image');
    const productFileInput = document.getElementById('product-file');

    // Valida que los campos no estén vacíos
    if (!productName || !productPrice || !productDescription) {
        alert('Please fill in all fields.');
        return;
    }

    // Crea el objeto del nuevo producto
    const newProduct = {
        id: generateProductId(),
        title: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        image: '',
    };

    // Si se proporciona una URL de imagen, úsala
    if (productImageInput && productImageInput.value) {
        newProduct.image = productImageInput.value;
    } else if (productFileInput && productFileInput.files.length > 0) {
        // Si se proporciona un archivo, guárdalo y usa su URL
        const imageFile = productFileInput.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        newProduct.image = imageUrl;
    }

    // Obtiene los productos existentes del localStorage
    const storedProducts = getStoredEditedProducts();

    // Agrega el nuevo producto a la lista de productos
    storedProducts.push(newProduct);

    // Actualiza el localStorage con la nueva lista de productos
    localStorage.setItem('editedProducts', JSON.stringify(storedProducts));

    // Muestra la página de productos actualizada
    showProductsPage();

    // Oculta el formulario después de agregar el producto
    hideAddProductForm();
}

function hideAddProductButton() {
    hideElement('addProductButton');
}

// Funciones de utilidad para manipulación de elementos
function createAndAppendElement(tagName, id, parent) {
    const element = document.createElement(tagName);
    element.id = id;
    parent.appendChild(element);
    return element;
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

function isElementVisible(id) {
    const element = document.getElementById(id);
    return element && element.style.display === 'block';
}

function hideCategoryForm() {
    const categoryFormContainer = document.getElementById('categoryFormContainer');
    if (categoryFormContainer) {
        // Oculta el formulario de categorías
        categoryFormContainer.style.display = 'none';
    }
}

function hideCategoryForm() {
    const categoryFormContainer = document.getElementById('categoryFormContainer');
    if (categoryFormContainer) {
        // Oculta el formulario de categorías
        categoryFormContainer.style.display = 'none';
    }
}

function displayProductCard(product) {
    const productsListContainer = document.getElementById('productsSection');

    if (!productsListContainer) {
        console.error('Element with id "productsSection" not found.');
        return;
    }

    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    // Crea los elementos con sus respectivos contenidos

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.title;
    productImage.classList.add('product-image');

    const productTitle = document.createElement('h3');
    productTitle.textContent = product.title;

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;

    const productPrice = document.createElement('p');
    productPrice.textContent = `${product.price} $`;

    const viewButton = document.createElement('button');
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => viewProduct(product.id));

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', () => addToCart(product));

    // Agrega los elementos al contenedor del producto
    productDiv.appendChild(productImage);
    productDiv.appendChild(productTitle);
    productDiv.appendChild(productDescription);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addToCartButton);
    productDiv.appendChild(viewButton);

    // Agrega el contenedor del producto al contenedor principal
    productsListContainer.appendChild(productDiv);
}

function generateProductId() {
    return Math.floor(Math.random() * 1000);
}

function getStoredEditedProducts() {
    // Obtiene los productos existentes del localStorage
    return JSON.parse(localStorage.getItem('editedProducts')) || [];
}



function filterProductsByCategory() {
    const filterButton = document.getElementById('filterButton');

    // Verifica si el elemento existe antes de intentar acceder a su valor
    if (filterButton) {
        // Maneja el evento click del botón
        filterButton.addEventListener('click', function () {
            const categorySelect = document.getElementById('category');

            // Verifica si el elemento existe antes de intentar acceder a su valor
            if (categorySelect) {
                const selectedCategory = categorySelect.value;

                // Obtener productos editados localmente
                const editedProducts = getStoredEditedProducts();

                // Filtrar productos editados por categoría seleccionada
                const filteredProducts = editedProducts.filter(product => {
                    return selectedCategory === 'all' || product.category === selectedCategory;
                });

                // Muestra los productos filtrados
                displayProductsOnPage(filteredProducts);
            } else {
                console.error('Element with id "category" not found.');
            }
        });
    } else {
        console.error('Element with id "filterButton" not found.');
    }
}

function fetchCategoriesAndShowFilterForm() {
    // Hacer la llamada a la API para obtener las categorías

    fetch('https://fakestoreapi.com/products/categories')
        .then(response => {
            // Verifica si la respuesta es exitosa (código de estado 200)
            if (response.ok) {
                return response.json();
            } else {
                // Lanza un error con información detallada sobre el código de estado
                throw new Error(`Failed to fetch categories (Status: ${response.status} ${response.statusText})`);
            }
        })
        .then(categories => {
            // Verifica si las categorías se obtuvieron correctamente y no están vacías

            if (Array.isArray(categories) && categories.length > 0) {
                // Llama a la función para mostrar el formulario de filtro con las categorías obtenidas

                showCategoryFilterForm(categories);
            } else {
                console.error('Categories array is empty or undefined.', categories);
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error.message);
        });
}

function showCategoryFilterForm(categories) {
    let categoryFormContainer = document.getElementById('categoryFormContainer');
    // Verifica si las categorías son válidas

    if (!categories || categories.length === 0) {
        console.error('Categories array is empty or undefined.');
        return;
    }
    // Verifica si el contenedor del formulario ya existe

    if (!categoryFormContainer) {
        // Crea el contenedor del formulario si no existe

        const header = document.querySelector('header');
        categoryFormContainer = document.createElement('div');
        categoryFormContainer.id = 'categoryFormContainer';
        header.appendChild(categoryFormContainer);
    }

    // Crea el formulario de filtro de categorías

    const categoryForm = document.createElement('form');
    categoryForm.id = 'categoryForm';
    categoryForm.innerHTML = `
        <label for="category">Select Category:</label>
        <select id="category">
            <option value="all">All Categories</option>
            ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
        <button type="button" id="filterButton">Apply Filter</button>
    `;

    // Agrega el formulario al contenedor
    categoryFormContainer.innerHTML = ''; // Limpia el contenido previo
    categoryFormContainer.appendChild(categoryForm);

    // Llama a la función para configurar el evento de filtro

    filterProductsByCategory();
}

function displayUserInfo(username) {
    const userSection = document.getElementById('userSection');
    const usernameDisplay = document.getElementById('usernameDisplay');

    // Oculta la sección de usuario

    userSection.style.display = 'none';

    // Muestra la sección de usuario y el nombre de usuario

    userSection.style.display = 'block';
    usernameDisplay.textContent = `¡Hola, ${username}!`;

    // Muestra el botón de perfil
    const profileButton = document.createElement('button');
    profileButton.textContent = 'View Profile';
    profileButton.addEventListener('click', () => viewProfile(username));
    userSection.appendChild(profileButton);
}

function fetchProducts(category = 'all') {
    const apiUrl = category === 'all'
        ? 'https://fakestoreapi.com/products'
        : `https://fakestoreapi.com/products/category/${category}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching products:', error);
            throw error;
        });
}

function displayProductsOnPage(products) {
    const productsListContainer = document.getElementById('productsSection');

    if (!productsListContainer) {
        console.error('Element with id "productsSection" not found.');
        return;
    }

    productsListContainer.style.display = 'grid';
    productsListContainer.innerHTML = '';

    products.forEach(product => {
        displayProductCard(product);
    });
}

function viewProfile(username) {
    const productsListContainer = document.getElementById('productsSection');
    if (productsListContainer) {
        productsListContainer.style.display = 'none';
    }
    let profileContainer = document.getElementById('profileSection');
    if (!profileContainer) {
        const mainContainer = document.querySelector('main');
        profileContainer = document.createElement('div');
        profileContainer.id = 'profileSection';
        mainContainer.appendChild(profileContainer);
    }

    profileContainer.innerHTML = `
        <h2>${username}'s Profile</h2>
        <p>Username: ${username}</p>
        <button onclick="toggleChangePasswordForm()">Change Password</button>
        <div id="changePasswordForm" style="display:none;">
            <label for="current-password">Current Password:</label>
            <input type="password" id="current-password" required>
            <label for="new-password">New Password:</label>
            <input type="password" id="new-password" required>
            <button onclick="changePassword('${username}')">Change Password</button>
        </div>
        <button onclick="deleteUser('${username}')">Delete User</button>
        <button onclick="goBack()">Back</button>
    `;

    // Muestra la información de los carritos guardados
    displayPurchaseHistory(username);
}


function toggleChangePasswordForm() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.style.display = changePasswordForm.style.display === 'none' ? 'block' : 'none';
    }
}

function changePassword(username) {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {

        if (users[userIndex].password === currentPassword) {
    
            users[userIndex].password = newPassword;

            localStorage.setItem('users', JSON.stringify(users));

            alert('Password changed successfully.');
        } else {
            alert('Current password is incorrect.');
        }
    } else {
        console.error('Error: User not found in localStorage');
    }
}

function deleteUser(username) {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(u => u.username !== username);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        sessionStorage.clear();
        location.reload();
    }
}

function showProductsPage() {
    // Asegúrate de que la sección de productos esté visible
    const productsListContainer = document.getElementById('productsSection');
    if (productsListContainer) {
        productsListContainer.style.display = 'grid';
    }

    // Asegúrate de que el formulario de categorías también esté visible
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.style.display = 'block';
    }

    getAllProducts()
        .then(products => {
            // Muestra la información del usuario y los productos
            const loggedInUser = sessionStorage.getItem('loggedIn');
            displayUserInfo(loggedInUser);
            displayProductsOnPage(products);

            // Elimina el formulario de inicio de sesión si existe
            removeLoginForm();

            // Muestra el botón "Add Product" después de cargar los productos
            showAddProductButton();

            // Utiliza fetchCategoriesAndShowFilterForm para obtener y mostrar las categorías
            fetchCategoriesAndShowFilterForm();
        })
        .catch(error => {
            console.error('Error displaying products:', error);
        });
}

function viewProduct(productId) {
    getAllProducts()
        .then(products => {
            const product = products.find(p => p.id === productId);
            hideProductsSection();
            displayProductDetails(product);
        })
        .catch(error => console.error('Error displaying product details:', error));
}

function hideProductsSection() {
    const productsListContainer = document.getElementById('productsSection');
    if (productsListContainer) {
        productsListContainer.style.display = 'none';
    }

    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.style.display = 'none';
    }
}

function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetails');

    if (!productDetailsContainer) {
        console.error('Error: productDetailsContainer not found');
        return;
    }

    const productDetailsHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>${product.price} $</p>
        <button onclick="goBack()">Back</button>
        <button onclick="showEditForm(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
    `;

    productDetailsContainer.innerHTML = productDetailsHTML;
    productDetailsContainer.style.display = 'block';
}

// Obtener los productos desde la API
function getProductsFromApi() {
    return fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('Error fetching products from API:', error);
            return [];
        });
}

// Obtener los productos almacenados en localStorage
function getStoredProducts() {
    const storedProducts = localStorage.getItem('editedProducts');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function editProduct(event, productId) {
    event.preventDefault();

    const editedProductName = document.getElementById('editProductName').value;
    const editedProductDescription = document.getElementById('editProductDescription').value;
    const editedProductPrice = document.getElementById('editProductPrice').value;

    // Obtener todos los productos, incluyendo los editados localmente
    getAllProducts()
        .then(products => {
            // Encontrar el producto editado por su ID
            const editedProductIndex = products.findIndex(p => p.id === productId);

            if (editedProductIndex !== -1) {
                // Actualizar los datos del producto editado
                products[editedProductIndex].title = editedProductName;
                products[editedProductIndex].description = editedProductDescription;
                products[editedProductIndex].price = parseFloat(editedProductPrice);

                // Actualizar el localStorage con la lista de productos editados
                localStorage.setItem('editedProducts', JSON.stringify(products));

                // Actualizar la lista de productos en la interfaz
                displayProductsOnPage(products);

                // Ocultar el formulario de edición después de guardar los cambios
                hideEditForm();
            } else {
                console.error('Product not found for editing:', productId);
            }
        })
        .catch(error => console.error('Error editing product:', error));
}

function hideEditForm() {
    const editProductFormContainer = document.getElementById('editProductFormContainer');
    if (editProductFormContainer) {
        // Oculta el formulario de edición
        editProductFormContainer.style.display = 'none';
    }
}

function deleteProduct(productId) {
    // Obtener todos los productos editados localmente
    const editedProducts = getStoredEditedProducts();

    // Encontrar el índice del producto eliminado por su ID
    const deletedProductIndex = editedProducts.findIndex(p => p.id === productId);

    if (deletedProductIndex !== -1) {
        // Eliminar el producto de la lista de productos editados localmente
        editedProducts.splice(deletedProductIndex, 1);

        // Actualizar el localStorage con la lista de productos editados
        updateStoredEditedProducts(editedProducts);

        // Actualizar la lista de productos en la interfaz
        displayProductsOnPage(editedProducts);
    } else {
        console.error('Product not found for deletion:', productId);
    }
}

// Actualizar los productos editados en el localStorage
function updateStoredEditedProducts(editedProducts) {
    const editedProductsJSON = JSON.stringify(editedProducts);
    localStorage.setItem('editedProducts', editedProductsJSON);
}



// Obtener todos los productos (desde la API y almacenados en localStorage)
function getAllProducts() {
    return Promise.all([getProductsFromApi(), getStoredProducts()])
        .then(([productsFromApi, storedProducts]) => {
            // Filtrar los productos de la API para excluir los que estén editados localmente
            const filteredApiProducts = productsFromApi.filter(apiProduct => {
                const isEditedLocally = storedProducts.some(storedProduct => storedProduct.id === apiProduct.id);
                return !isEditedLocally;
            });

            // Combinar productos de la API y almacenados en localStorage
            const allProducts = [...filteredApiProducts, ...storedProducts];
            return allProducts;
        });
}

// Obtener un producto por ID (desde la API o almacenado en localStorage)
function getProductById(productId) {
    return getAllProducts()
        .then(products => products.find(p => p.id === productId));
}

function showEditForm(productId) {
    getProductById(productId)
        .then(product => {
            const productDetailsContainer = document.getElementById('productDetails');

            if (!productDetailsContainer) {
                console.error('Error: productDetailsContainer not found');
                return;
            }

            const editFormHTML = `
                <form onsubmit="editProduct(event, ${product.id})">
                    <label for="editProductName">Name:</label>
                    <input type="text" id="editProductName" value="${product.title}" required>
                    <label for="editProductDescription">Description:</label>
                    <textarea id="editProductDescription" required>${product.description}</textarea>
                    <label for="editProductPrice">Price:</label>
                    <input type="number" id="editProductPrice" value="${product.price}" step="0.01" required>
                    <button type="submit">Save Changes</button>
                </form>
            `;

            productDetailsContainer.innerHTML = editFormHTML;
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function goBack() {
    const productDetailsContainer = document.getElementById('productDetails');
    if (productDetailsContainer) {
        productDetailsContainer.style.display = 'none';
    } else {
        console.error('Error: productDetailsContainer not found');
    }

    const profileContainer = document.getElementById('profileSection');
    if (profileContainer) {
        profileContainer.innerHTML = '';  // Clear the content of the profile section
    }

    showProductsSection();
}

function showProductsSection() {
    const productsListContainer = document.getElementById('productsSection');
    if (productsListContainer) {
        productsListContainer.style.display = 'grid';
    }

    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.style.display = 'block';
    }
}

function saveEditedProduct(productId) {
    const editedProducts = getStoredEditedProducts();
    const index = editedProducts.findIndex(p => p.id === productId);

    if (index !== -1) {
        // Actualizar los datos del producto editado
        editedProducts[index].title = document.getElementById('productName').value;
        editedProducts[index].description = document.getElementById('productDescription').value;
        editedProducts[index].price = parseFloat(document.getElementById('productPrice').value);

        // Actualizar el localStorage con la lista de productos editados
        updateStoredEditedProducts(editedProducts);

        // Recargar la página
        location.reload();
    }
}

function cancelEdit() {
    // Volver a mostrar los detalles del producto sin cambios
    const productId = getProductIdFromUrl(); // Implementa la lógica para obtener el ID del producto actual
    viewProduct(productId);
}

// Obtener los productos editados del localStorage
function getStoredEditedProducts() {
    const editedProductsJSON = localStorage.getItem('editedProducts');
    return editedProductsJSON ? JSON.parse(editedProductsJSON) : [];
}

// Actualizar los productos editados en el localStorage
function updateStoredEditedProducts(editedProducts) {
    const editedProductsJSON = JSON.stringify(editedProducts);
    localStorage.setItem('editedProducts', editedProductsJSON);
}



function showLoginForm() {

    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.style.display = 'none';
    }

    const mainContainer = document.querySelector('main');
    const loginForm = document.createElement('div');
    loginForm.classList.add('login-form');
    loginForm.innerHTML = `
        <h2>Login</h2>
        <div id="login-form">
            <label for="login-username">Username:</label>
            <input type="text" id="login-username" required>
            <br>
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" required>
            <br>
            <button type="button" onclick="login()">Login</button>
        </div>
        <p id="toggle-form-message">Don't have an account? <a href="#" onclick="showRegisterForm()">Register here</a></p>
    `;
    mainContainer.appendChild(loginForm);
}


function showRegisterForm() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.style.display = 'none';
    }

    const mainContainer = document.querySelector('main');
    const registerForm = document.createElement('div');
    registerForm.classList.add('register-form');
    registerForm.innerHTML = `
        <h2>Register</h2>
        <div id="register-form">
            <label for="register-username">Username:</label>
            <input type="text" id="register-username" required>
            <br>
            <label for="register-password">Password:</label>
            <input type="password" id="register-password" required>
            <br>
            <button type="button" onclick="register()">Register</button>
        </div>
        <p id="toggle-form-message">Already have an account? <a href="#" onclick="showLoginForm()">Login here</a></p>
    `;
    mainContainer.appendChild(registerForm);
}

function login() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username.trim() !== '' && password.trim() !== '') {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem('loggedIn', username);

            showProductsPage();
        } else {
            alert('Nombre de usuario o contraseña no válidos.');
        }
    } else {
        alert('Por favor, ingresa tanto el nombre de usuario como la contraseña.');
    }
}

function register() {
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username.trim() !== '' && password.trim() !== '') {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username);

        if (!existingUser) {
            // Agregar el nuevo usuario al array de usuarios en LocalStorage

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));

            // Iniciar sesión automáticamente con el nuevo usuario

            sessionStorage.setItem('loggedIn', username);

            // Mostrar la información del usuario y obtener productos

            displayUserInfo(username);
            fetchProducts()
                .then(products => displayProductsOnPage(products))
                .catch(error => console.error('Error displaying products:', error));

            // Eliminar el formulario de registro

            const registerForm = document.querySelector('.register-form');
            if (registerForm) {
                registerForm.parentNode.removeChild(registerForm);
            }
        } else {
            alert('El nombre de usuario ya existe. Por favor, elige un nombre de usuario diferente.');
        }
    } else {
        alert('Por favor, ingresa tanto el nombre de usuario como la contraseña.');
    }
}

function performLogout() {
    // Limpiar sessionStorage y recargar la página para volver al estado de inicio de sesión

    sessionStorage.clear();
    location.reload();
}

function hideProductsSection() {
    const productsListContainer = document.getElementById('productsSection');
    if (productsListContainer) {
        productsListContainer.style.display = 'none';
    }
}

// Función para ocultar el formulario de categorías

function hideCategoryForm() {
    const categoryFormContainer = document.getElementById('categoryFormContainer');
    if (categoryFormContainer) {
        categoryFormContainer.style.display = 'none';
    }
}

// Función para eliminar el formulario de inicio de sesión

function removeLoginForm() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.remove();
    }
}

