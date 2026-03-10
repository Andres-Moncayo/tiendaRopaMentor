// app.js

const API_URL = 'https://fakestoreapi.com/products?limit=16';
let todosProductos = []; // Todos los productos Impresos
let todosFiltrados = []; 
let productSelected = []; // Productos que han seleccionado
let totalProductSelected = [] // Cantidad Individual Productos Seleccionado todos

// Obtener datos
async function obtenerProductos() {
    try{
        const respuesta = await fetch(API_URL);
        todosProductos = await respuesta.json();
        imprimirProductos(todosProductos);
        renderProductos();
    }catch(error) {
        console.error("Error cargando productos:", error);
    }
}

// Ejercicio botones cambian de color al dar click y imprimir los de la categoria correspondiente
function renderProductos(){
    const filtradoBotones = document.querySelectorAll(".c-filter__btn[data-category]");

    filtradoBotones.forEach(btn =>{
        btn.addEventListener("click",()=>{
            filtradoBotones.forEach(b=>b.classList.remove("c-filter__btn--active"))
            btn.classList.add("c-filter__btn--active");
            
            const categoria = btn.getAttribute("data-category");
            
            if (categoria === "all"){
                todosFiltrados = todosProductos;
                console.log("prueba"+todosProductos)
            }else{
                todosFiltrados = todosProductos.filter(p => p.category === categoria);
            }

            imprimirProductos(todosFiltrados);
        })
    })
};

// Ejercicio Configuracion Theming
const root = document.documentElement; 
const temaPalancaBtn = document.getElementById("theme-toggle");

function obtenerTemaActual(){
    return root.getAttribute('data-theme') || 'Auto';
}

function establecerTema(tema){
    root.setAttribute('data-theme', tema)
    localStorage.setItem('Tema', tema)
    if (temaPalancaBtn){
        temaPalancaBtn.textContent = `Tema: ${tema}`
    }
}

function aplicarTema(){
    const guardado = localStorage.getItem('Tema');
    if (guardado === "Blanco" || guardado === "Negro" || guardado === "Auto"){
        establecerTema(guardado);
    }
}

if(temaPalancaBtn){
    temaPalancaBtn.addEventListener('click', ()=>{
        const actual = obtenerTemaActual();
        let siguiente;
        if (actual == 'Auto') siguiente = 'Negro';
        else if (actual === 'Negro') siguiente = 'Blanco';
        else siguiente = 'Auto';
        establecerTema(siguiente);
    });
}

aplicarTema();

async function imprimirProductos(todosProductos){
    const contenedor = document.getElementById("contenedorRopa");
    contenedor.innerHTML = "";

    todosProductos.forEach(producto => {
        let claseExtra = "";

        if (producto.category === "jewelery"){
            claseExtra = 'c-card--featured';
        }

        const productoHTML = `
            <div class=" c-card ${claseExtra}">
                <a href="detalle.html" class="c-card__link"></a>
                <img src="${producto.image}"class="c-card__image">
                <div class="c-card__body">
                    <h2 class="c-card__title">${producto.title}</h2>
                    <p class="c-card__price">$${producto.price}</p>
                    <button class="c-card__btn c-card__btn--buy" data-id="${producto.id}">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });

    // Click a Agregar Carrito
    const buyButtons = document.querySelectorAll('.c-card__btn--buy');

    buyButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            console.log("Producto agregado al carrito");
            let modal = document.querySelector(".modal")
            modal.style.display = "block"
            if(e.target.classList.contains("c-card__btn--buy")){// Verificar que sea el botón
                const id = Number(e.target.dataset.id);// obtener el id del producto

                const exist = productSelected.find(p => p.id === id);// buscar si ya existe en el arreglo

                if(!exist){
                    productSelected.push({
                        id: id,
                        cantidad: 0
                    });
                }

                console.log(productSelected);

                imprimirProductsSelected(productSelected);       
            }
        });
    });

    // Click Al Carrito, Abre Modal
    const cart = document.getElementById("cart");

    cart.addEventListener("click", ()=>{
        let modal = document.querySelector(".modal")
        modal.style.display = "block"
    })

    // Cerrar Carrito
    const modalClose = document.getElementById("closeModalBtn");

    modalClose.addEventListener("click", ()=>{
        let modal = document.querySelector(".modal")
        modal.style.display = "none"
    })
}

// Imprimir Productos en el Modal del Carrito
function imprimirProductsSelected(productSelected){
    const contenedorModal = document.getElementById("cart-sumary");
    contenedorModal.innerHTML = "";

    productSelected.forEach((item)=>{
        const producto = todosProductos.find(p => p.id === item.id); // Buscar el producto en el array del API usando el id
        const limit = 10;
        const limitTitle = producto.title.slice(0,limit);
        const productSelectedHTML = `
        <div class="modal__item">
            <button class="modal__removeProduct" type="button" data-id="${producto.id}">
                <i class="fa-solid fa-minus"></i>
            </button>
            <img src="${producto.image}" class="modal__img">
            <div class="modal__item-info">
                <h3>${limitTitle}</h3>
                <p>Unidad: ${producto.price}</p>
            </div>
            <div class="modal__amount">
                <form>
                    <label>Selecciona la cantidad:</label>
                    <select class="modal__select" data-id="${producto.id}" data-price="${producto.price}">
                        <option value="0" ${item.cantidad == 0 ? "selected" : ""}>0 Unidad</option>
                        <option value="1" ${item.cantidad == 1 ? "selected" : ""}>1 Unidad</option>
                        <option value="2" ${item.cantidad == 2 ? "selected" : ""}>2 Unidades</option>
                        <option value="3" ${item.cantidad == 3 ? "selected" : ""}>3 Unidades</option>
                        <option value="4" ${item.cantidad == 4 ? "selected" : ""}>4 Unidades</option>
                        <option value="5" ${item.cantidad == 5 ? "selected" : ""}>5 Unidades</option>
                    </select>
                </form>
                <div class="modal__total">
                    <h3>Total:$${(producto.price * item.cantidad).toFixed(2)}</h3>
                </div>
            </div>
        </div>
        `;

        contenedorModal.innerHTML += productSelectedHTML;

    });

    // Actualizamos el span del carrito
    actualizarCarritoSpan();

    // Despues de imprimir todo
    const selects = document.querySelectorAll(".modal__select");

    selects.forEach((select)=>{
        select.addEventListener("change", ()=>{
            const cantidad = Number(select.value);
            const precio = Number(select.dataset.price);
            const totalPrenda = cantidad * precio;

            const id = Number(select.dataset.id);
            const productoCarrito = productSelected.find(p => p.id === id);

            if(productoCarrito){
                productoCarrito.cantidad = cantidad;
            }
            calcularTotalCarrito();

            const item = select.closest(".modal__item");
            const totalDiv = item.querySelector(".modal__total"); // Seleccionamos el item del HTML para reemplazarlo

            totalDiv.innerHTML = `<h3>Total: $${totalPrenda.toFixed(2)}</h3>`; //Agregamos con toFixed dos decimales

            actualizarCarritoSpan(); // Actualizamos el span también al cambiar cantidad
        });
    });

    removeProducts();
}

function calcularTotalCarrito(){ // Calcular el total de todo
    let totalCarrito = 0;
    productSelected.forEach((item)=>{
        const producto = todosProductos.find(p => p.id === item.id);

        if(producto){
            totalCarrito += producto.price * item.cantidad;
        }
    });

    document.getElementById("totalCarrito").textContent = totalCarrito.toFixed(2);
    console.log("Total carrito:", totalCarrito.toFixed(2));
}

//for(let i = 0; i < productSelected.length; i++){
//  console.log("Recorriendo los productos seleccionados"+ productSelected[i])
//}

function removeProducts() {
    const removeProduct = document.querySelectorAll(".modal__removeProduct");
    removeProduct.forEach((btn)=>{
        btn.addEventListener("click", (e)=>{
            const id = Number(e.currentTarget.dataset.id); // usar currentTarget para asegurar que sea el boton
            const index = productSelected.findIndex(p => p.id === id); // findIndex Devuelve la posicion encontrada
            if (index !== -1){
                productSelected.splice(index,1)
            }
            imprimirProductsSelected(productSelected); // volver a renderizar el carrito
            calcularTotalCarrito()
            actualizarCarritoSpan(); // Actualizamos el span al eliminar productos
        })
    })
}

// Nueva función: actualizar el número del carrito en el span según las cantidades
function actualizarCarritoSpan() {
    const spanCarrito = document.querySelector("#cart span");
    if(!spanCarrito) return;

    const totalCantidad = productSelected.reduce((acc, item) => acc + item.cantidad, 0);
    spanCarrito.textContent = totalCantidad;
}

obtenerProductos();