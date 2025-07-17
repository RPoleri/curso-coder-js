const DATA = {
    individuals: [
        { id: 1, name: "Milanesa con papas", price: 550, type: "Plato fuerte", img:"../media/milanga.jpg" },
        { id: 2, name: "Pizza muzza", price: 680, type: "Plato fuerte", img: "https://via.placeholder.com/300" },
        { id: 3, name: "Hamburguesa", price: 750, type: "Plato fuerte", img: "https://via.placeholder.com/300" },
        { id: 4, name: "Ensalada César", price: 420, type: "Entrada", img: "https://via.placeholder.com/300" },
        { id: 5, name: "Empanadas (6)", price: 360, type: "Entrada", img: "https://via.placeholder.com/300" },
        { id: 6, name: "Lasaña vegetariana", price: 620, type: "Plato fuerte", img: "https://via.placeholder.com/300" },
        { id: 7, name: "Sopa de calabaza", price: 300, type: "Entrada", img: "https://via.placeholder.com/300" },
        { id: 8, name: "Tiramisú", price: 280, type: "Postre", img: "https://via.placeholder.com/300" },
        { id: 9, name: "Brownie", price: 250, type: "Postre", img: "https://via.placeholder.com/300" },
        { id: 10, name: "Gaseosa 500 ml", price: 200, type: "Bebida", img: "https://via.placeholder.com/300" }
    ],
    weeklies: [
        {
            week: "Semana actual",
            days: [
                { id: "Lunes", items: [{ id: 101, name: "Pollo al horno", price: 600, type: "Plato fuerte" }, { id: 102, name: "Ensalada rusa", price: 320, type: "Entrada" }] },
                { id: "Martes", items: [{ id: 201, name: "Carne al disco", price: 700, type: "Plato fuerte" }, { id: 202, name: "Puré de calabaza", price: 300, type: "Entrada" }] },
                { id: "Miércoles", items: [{ id: 301, name: "Pescado a la plancha", price: 650, type: "Plato fuerte" }, { id: 302, name: "Ensalada mixta", price: 350, type: "Entrada" }] }
            ]
        },
        {
            week: "Semana siguiente",
            days: [
                { id: "Lunes", items: [{ id: 401, name: "Moussaka", price: 630, type: "Plato fuerte" }, { id: 402, name: "Gazpacho", price: 300, type: "Entrada" }] },
                { id: "Martes", items: [{ id: 501, name: "Estofado", price: 680, type: "Plato fuerte" }, { id: 502, name: "Tabulé", price: 340, type: "Entrada" }] },
                { id: "Miércoles", items: [{ id: 601, name: "Strogonoff", price: 700, type: "Plato fuerte" }, { id: 602, name: "Brócoli al vapor", price: 280, type: "Entrada" }] }
            ]
        }
    ]
};

const API = {
    initData: () => {
        if (!localStorage.getItem('individuals')) {
            localStorage.setItem('individuals', JSON.stringify(DATA.individuals));
        }
        if (!localStorage.getItem('weeklies')) {
            localStorage.setItem('weeklies', JSON.stringify(DATA.weeklies));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', '[]');
        }
    },

    fetchIndividuals: () =>
        Promise.resolve(JSON.parse(localStorage.getItem('individuals'))),

    fetchWeeklies: () =>
        Promise.resolve(JSON.parse(localStorage.getItem('weeklies'))),

    loadOrders: () =>
        JSON.parse(localStorage.getItem('orders')),

    saveOrders: orders =>
        localStorage.setItem('orders', JSON.stringify(orders))
};