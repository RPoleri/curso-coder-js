document.addEventListener('DOMContentLoaded', () => {
    API.initData();

    const btnInd = document.getElementById('btn-individual');
    const btnSem = document.getElementById('btn-semanal');
    const indView = document.getElementById('individual-view');
    const wkView = document.getElementById('weekly-view');
    const filters = document.getElementById('filters');
    const itemsCont = document.getElementById('items-container');
    const weeklyCont = document.getElementById('weekly-container');
    const cartEl = document.getElementById('cart');
    const toggleCart = document.getElementById('toggle-cart-btn');
    const cartList = document.getElementById('cart-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const confirmModal = new bootstrap.Modal('#confirmModal');
    const historyModal = new bootstrap.Modal('#historyModal');

    let allItems = [];
    let cart = [];

    btnInd.addEventListener('click', () => switchView('individual'));
    btnSem.addEventListener('click', () => switchView('weekly'));

    function switchView(view) {
        if (view === 'individual') {
            indView.classList.remove('d-none');
            wkView.classList.add('d-none');
            filters.classList.remove('d-none');
            loadIndividuals();
        } else {
            indView.classList.add('d-none');
            wkView.classList.remove('d-none');
            filters.classList.add('d-none');
            loadWeeklies();
        }
    }

    switchView('individual');

    toggleCart.addEventListener('click', () => {
        cartEl.classList.toggle('collapsed');
    });

    /*  Menú Individual  */

    function loadIndividuals() {
        API.fetchIndividuals().then(items => {
            allItems = items;
            renderIndividualCards(items);
            attachAddEvents(items);
            initFilters();
        });
    }

    function renderIndividualCards(items) {
        itemsCont.innerHTML = '';
        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-sm-6 col-lg-4';
            col.innerHTML = `
        <div class="card h-100">
          <img src="${item.img}" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text mb-4">$ ${item.price}</p>
            <button class="btn btn-outline-primary mt-auto add-btn" data-id="${item.id}">
              Agregar
            </button>
          </div>
        </div>`;
            itemsCont.appendChild(col);
        });
    }

    function attachAddEvents(items) {
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = Number(e.target.dataset.id);
                const dish = items.find(x => x.id === id);
                cart.push(dish);
                updateCartDOM();
            });
        });
    }

    function initFilters() {
        const minInput = document.getElementById('filter-min');
        const maxInput = document.getElementById('filter-max');
        const typeInput = document.getElementById('filter-type');

        [minInput, maxInput, typeInput].forEach(el =>
            el.addEventListener('input', applyFilters)
        );
    }

    function applyFilters() {
        const min = Number(document.getElementById('filter-min').value);
        const max = Number(document.getElementById('filter-max').value);
        const type = document.getElementById('filter-type').value;

        const filtered = allItems.filter(dish =>
            dish.price >= min &&
            dish.price <= max &&
            (!type || dish.type === type)
        );

        renderIndividualCards(filtered);
        attachAddEvents(filtered);
    }

    /*  Menú Semanal  */

    function loadWeeklies() {
        API.fetchWeeklies().then(menus => {
            renderWeeklyMenus(menus);
        });
    }

    function renderWeeklyMenus(menus) {
        weeklyCont.innerHTML = '';
        menus.forEach((menu, idx) => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${menu.week}</h5>
            <ul class="list-group mb-3">
              ${menu.days.map(day => `
                <li class="list-group-item">
                  <strong>${day.id}:</strong> ${day.items.map(i => i.name).join(', ')}
                </li>
              `).join('')}
            </ul>
            <button class="btn btn-primary mt-auto add-weekly-btn" data-idx="${idx}">
              Agregar ${menu.week}
            </button>
          </div>
        </div>`;
            weeklyCont.appendChild(col);
        });

        document.querySelectorAll('.add-weekly-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = Number(e.target.dataset.idx);
                const menu = menus[idx];
                menu.days.forEach(day =>
                    day.items.forEach(item =>
                        cart.push({ id: item.id, name: item.name, price: item.price })
                    )
                );
                updateCartDOM();
            });
        });
    }

    /*  Carrito, Subtotal, Confirmación y Historial  */

    function updateCartDOM() {
        cartList.innerHTML = '';
        cart.forEach((item, i) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            li.innerHTML = `
        <span>${item.name}</span>
        <span>$ ${item.price}</span>
        <button class="btn-close remove-btn" data-idx="${i}"></button>`;
            cartList.appendChild(li);
        });

        // subtotal
        const sum = cart.reduce((acc, cur) => acc + cur.price, 0);
        subtotalEl.textContent = sum;

        // eliminar item
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = Number(e.target.dataset.idx);
                cart.splice(idx, 1);
                updateCartDOM();
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const total = cart.reduce((acc, cur) => acc + cur.price, 0);
        document.getElementById('order-summary').textContent = `Total: $ ${total}`;
        confirmModal.show();
    });

    document.getElementById('confirm-order-btn').addEventListener('click', () => {
        const orders = API.loadOrders();
        orders.push({
            date: new Date().toISOString(),
            items: cart,
            notes: document.getElementById('user-notes').value,
            address: document.getElementById('user-address').value,
            delivered: false
        });
        API.saveOrders(orders);
        cart = [];
        updateCartDOM();
        confirmModal.hide();
        showSuccess();
    });

    document.getElementById('view-history-btn').addEventListener('click', renderHistory);

    function renderHistory() {
        const orders = API.loadOrders();
        const container = document.getElementById('history-container');
        container.innerHTML = '';

        orders.forEach((o, i) => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
        <div class="card-body">
          <h6>Pedido #${i + 1} – ${new Date(o.date).toLocaleString()}</h6>
          <p><strong>Total:</strong> $${o.items.reduce((a, b) => a + b.price, 0)}</p>
          <p><strong>Dirección:</strong> ${o.address}</p>
          <p><strong>Estado:</strong> ${o.delivered ? 'Entregado' : 'En proceso'}</p>
          <button class="btn btn-sm btn-${o.delivered ? 'secondary' : 'success'} simulate-btn" data-idx="${i}">
            ${o.delivered ? '✔ Entregado' : 'Simular entrega'}
          </button>
        </div>`;
            container.appendChild(card);
        });

        document.querySelectorAll('.simulate-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = Number(e.target.dataset.idx);
                const orders = API.loadOrders();
                orders[idx].delivered = true;
                API.saveOrders(orders);
                renderHistory();
            });
        });

        historyModal.show();
    }

    function showSuccess() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed-top m-3';
        alert.textContent = 'Pedido registrado correctamente';
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 2500);
    }

});