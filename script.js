// Datos
const products = [
  // Hamburguesas
  {id:1,  name:'Clásica',    cat:'hamburguesa', price:10000},
  {id:2,  name:'Doble Queso',cat:'hamburguesa', price:12000},
  {id:3,  name:'BBQ Bacon',  cat:'hamburguesa', price:13000},
  {id:4,  name:'Veggie',     cat:'hamburguesa', price:11000},
  // Pizzas
  {id:5,  name:'Muzzarella',  cat:'pizza', price:9000},
  {id:6,  name:'Pepperoni',  cat:'pizza', price:11000},
  {id:7,  name:'4 Quesos',   cat:'pizza', price:12000},
  {id:8,  name:'Hawaiana',   cat:'pizza', price:10000},
  // Ensaladas
  {id:9,  name:'Cesar',      cat:'ensalada', price:8000},
  {id:10, name:'Griega',     cat:'ensalada', price:7000},
  {id:11, name:'Atún',       cat:'ensalada', price:9000},
  {id:12, name:'Mixta',      cat:'ensalada', price:6000},
  // Milanesas
  {id:13, name:'Clásica',    cat:'milanesa', price:11000},
  {id:14, name:'Napolitana', cat:'milanesa', price:12000},
  {id:15, name:'Con Huevo',  cat:'milanesa', price:10000},
  {id:16, name:'Vegetal',    cat:'milanesa', price:9000},
];

// Estado del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Referencias DOM
const prodDiv  = document.getElementById('products');
const cartUl   = document.getElementById('cart');
const totalSp  = document.getElementById('total');
const filterBtns = document.querySelectorAll('#filters button');
const clearBtn = document.getElementById('clear');

// Mostrar lista
function renderProducts(list) {
  prodDiv.innerHTML = list
    .map(p => `
      <div class="product" data-id="${p.id}">
        <strong>${p.name}</strong><br>
        $${p.price}<br>
        <button>Agregar</button>
      </div>
    `).join('');
}

// Total carrito
function renderCart() {
  cartUl.innerHTML = cart
    .map(item => `
      <li>
        ${item.name} x${item.qty} - $${item.price * item.qty}
        <button data-rid="${item.id}">x</button>
      </li>
    `).join('');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalSp.textContent = total;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Filtros
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;
    const list = cat === 'all'
      ? products
      : products.filter(p => p.cat === cat);

    renderProducts(list);
  });
});

// Agregar al carrito
prodDiv.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  const id = +e.target.parentElement.dataset.id;
  const prod = products.find(p => p.id === id);
  const found = cart.find(i => i.id === id);
  found ? found.qty++ : cart.push({ ...prod, qty: 1 });
  renderCart();
});

// Quitar ítem
cartUl.addEventListener('click', e => {
  if (!e.target.dataset.rid) return;
  const id = +e.target.dataset.rid;
  cart = cart.filter(i => i.id !== id);
  renderCart();
});

// Vaciar carrito
clearBtn.addEventListener('click', () => {
  cart = [];
  renderCart();
});

// Inicialización
renderProducts(products);
renderCart();