
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresWarn = document.getElementById("address-warn")

let cart = [];

// Abrir modal
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal();
})

// Fechar modal
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name= parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

    
        addToCart(name, price)
    }
})


function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1
    }else{
            cart.push({
                name,
                price,
                quantity: 1,
            })
    }

    updateCartModal()
}


function updateCartModal() {
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                    <button class="add-more-btn" data-name="${item.name}">
                        Adicionar
                    </button>
                    <button class="remove-btn" data-name="${item.name}">
                        Remover
                    </button>

                
            </div>
        `

        total += item.price * item.quantity;

        cartItemContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

    const addMoreButtons = document.querySelectorAll(".add-more-btn");
    addMoreButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            const itemName = event.target.getAttribute("data-name");
            const item = cart.find(item => item.name === itemName);
            if (item) {
                addToCart(itemName, item.price); // Chama a função addToCart com o nome e preço do item
                updateCartModal(); // Atualiza o modal do carrinho após adicionar o item
            }
        });
    });
}


cartItemContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];
        console.log(item)

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}


addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    
    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addresWarn.classList.add("hidden")
    }
})


checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops! O Restaurante está fechado.",
            className: "info",
            close: true,
            duration: 3000,
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #ff512f, #dd2476)",
            }
          }).showToast();
        return;
    }

    
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addresWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return (
           ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11970423341"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

    cart.length = 0;
    updateCartModal();
})


function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 21 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}