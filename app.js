// Datos iniciales
let productes = [
  { id: 1, nom: "Portátil Pro", categoria: "Electrònica", preu: 950, stock: 4 },
  { id: 2, nom: "Camiseta algodón", categoria: "Roba", preu: 18, stock: 25 },
  { id: 3, nom: "Auriculares", categoria: "Electrònica", preu: 45, stock: 0 },
  { id: 4, nom: "Libro JS Avanzado", categoria: "Llibres", preu: 32, stock: 12 }
];

let estatOrdenacio = { columna: null, ascendent: true };

// --- RENDERIZADO DE LA TABLA Y MÉTRICAS ---
function actualitzarDashboard() {
  mostrarProductes(productes);
  actualitzarMetriques();
}

function mostrarProductes(llista) {
  const tbody = document.getElementById("taula-productes");
  tbody.innerHTML = "";

  llista.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td><strong>${prod.nom}</strong></td>
      <td>${prod.categoria}</td>
      <td>${prod.preu.toFixed(2)} €</td>
      <td>${prod.stock}</td>
      <td>
        <button class="btn btn-sm btn-edit" onclick="carregarPerEditar(${prod.id})">Editar</button>
        <button class="btn btn-sm btn-delete" onclick="eliminarProducte(${prod.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// --- TAREA 1: MÉTRICAS DEL DASHBOARD (reduce, at, some, every) ---
function actualitzarMetriques() {
  // TODO 1.1: Utiliza 'reduce' para calcular el valor total (preu * stock)
  const total = productes.reduce((acc, num) => acc + num.preu * num.stock, 0);

  document.getElementById("val-total").innerText = `${total.toFixed(2)} €`;

  // TODO 1.2: Utiliza el método 'at(-1)' para obtener el último producto añadido al array
  const ultim = productes.at(-1)
  document.getElementById("val-ultim").innerText = ultim ? ultim.nom : "-";

  // TODO 1.3: Utiliza 'some' para comprobar si hay algún producto sin stock (stock === 0)
  const téSenseStock = productes.some(producte => producte.stock === 0);
  document.getElementById("val-sense-stock").innerText = téSenseStock ? "⚠️ Falta stock" : "✅ Ok";

  // TODO 1.4: Utiliza 'every' para comprobar si todos los precios son superiores a 0
  const totsValids = productes.every(producte => producte.preu > 0)
  document.getElementById("val-preu-valid").innerText = totsValids ? "✅ Correcto" : "❌ Error";
}


// --- TAREA 2: AÑADIR Y EDITAR PRODUCTOS (push, with, map y Math.max) ---
document.getElementById("form-producte").addEventListener("submit", (e) => {
  e.preventDefault();

  const editId = document.getElementById("edit-id").value;
  const dadesForm = {
    nom: document.getElementById("nom").value,
    categoria: document.getElementById("categoria").value,
    preu: parseFloat(document.getElementById("preu").value),
    stock: parseInt(document.getElementById("stock").value)
  };

  if (editId) {
    // EDITAR PRODUCTO EXISTENTE
    const idNum = parseInt(editId);

    // TODO 2.3: Encuentra el índice del producto con 'findIndex'
    const index = productes.findIndex(producte => producte.id === idNum);

    if (index !== -1) {
      const producteEditat = { id: idNum, ...dadesForm };
      // TODO 2.3: Actualiza el array 'productes' utilizando el método inmutable 'with' (ES2023)
      productes = productes.with(index, producteEditat)
    }
  } else {
    // CREAR NUEVO PRODUCTO
    // TODO 2.1: Calcula la nueva ID encontrando la máxima actual con 'map' y 'Math.max' (si no hay productos, usa 0)
    const maxId = productes.length > 0 ? Math.max(...productes.map(parametro => parametro.id)) : 0;
    const nouProducte = { id: maxId + 1, ...dadesForm };

    // TODO 2.2: Añade 'nouProducte' al array 'productes' con 'push'
    // ESCRIBE TU CÓDIGO AQUÍ
    productes.push(nouProducte)
  }

  netejarFormulari();
  actualitzarDashboard();
});


// --- TAREA 3: ELIMINAR DE MANERA INMUTABLE (findIndex y toSpliced) ---
function eliminarProducte(id) {
  // TODO 3.1: Encuentra el índice del producto con 'findIndex'
  const index = productes.findIndex(producte => producte.id === id);

  if (index !== -1) {
    // TODO 3.2: Reemplaza el array 'productes' por uno nuevo sin el producto eliminado usando 'toSpliced' (ES2023)
    productes = productes.toSpliced(index, 2)
    actualitzarDashboard();
  }
}


// --- TAREA 4: BÚSQUEDA AVANZADA DEL ÚLTIMO ELEMENTO (findLast) ---
document.getElementById("btn-cerca-last").addEventListener("click", () => {
  const cat = document.getElementById("cerca-cat-last").value;

  // TODO 4.1: Utiliza 'findLast' para encontrar el último producto que pertenezca a la categoría 'cat'
  const ultimCat = productes.findLast(producte => producte.categoria === cat)

  if (ultimCat) {
    alert(`Último producto encontrado de ${cat}: ${ultimCat.nom} (${ultimCat.preu}€)`);
  } else {
    alert(`No hay ningún producto de la categoría ${cat}`);
  }
});


// --- TAREA 5: ORDENACIÓN POR COLUMNA (toSorted y toReversed) ---
document.querySelectorAll(".sortable").forEach(th => {
  th.addEventListener("click", () => {
    const columna = th.dataset.sort;

    if (estatOrdenacio.columna === columna) {
      estatOrdenacio.ascendent = !estatOrdenacio.ascendent;
    } else {
      estatOrdenacio.columna = columna;
      estatOrdenacio.ascendent = true;
    }

    // TODO 5.1: Utiliza 'toSorted' (ES2023) para obtener un array ordenado según la columna (nom, preu o stock)

    llistaOrdenada = productes.toSorted((a, b) => {
      if (columna === "nom")
      {
        return a.nom.localeCompare(b.nom);
      }
      if (columna === "preu") {
        return a.preu - b.preu;
      }
      if (columna === "stock") {
        return a.stock - b.stock;
      }
    });

    // TODO 5.2: Si 'estatOrdenacio.ascendent' es falso, invierte la lista utilizando 'toReversed' (ES2023)
    if (!estatOrdenacio.ascendent) {
      llistaOrdenada = llistaOrdenada.toReversed()
    }
    mostrarProductes(llistaOrdenada);
  });
});


// --- TAREA 6: BÚSQUEDA Y FILTROS COMBINADOS (filter e includes) ---
document.getElementById("input-cerca").addEventListener("input", aplicarFiltres);
document.getElementById("filtre-categoria").addEventListener("change", aplicarFiltres);

function aplicarFiltres() {
  const text = document.getElementById("input-cerca").value.toLowerCase();
  const cat = document.getElementById("filtre-categoria").value;

  // TODO 6.1: Utiliza 'filter' y el método 'includes' para filtrar los productos por nombre y/o categoría
  const filtrats = productes.filter(p => { return p.nom.toLowerCase().includes(text.toLowerCase()) && (cat === "Totes" || p.categoria === cat) });

  mostrarProductes(filtratsCat);
}


// --- FUNCIONES AUXILIARES DE EDICIÓN Y FORMULARIO ---
function carregarPerEditar(id) {
  const prod = productes.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("edit-id").value = prod.id;
  document.getElementById("nom").value = prod.nom;
  document.getElementById("categoria").value = prod.categoria;
  document.getElementById("preu").value = prod.preu;
  document.getElementById("stock").value = prod.stock;

  document.getElementById("form-title").innerText = "✏️ Editar Producto";
  document.getElementById("btn-submit").innerText = "Actualizar (with)";
  document.getElementById("btn-cancel").style.display = "block";
}

document.getElementById("btn-cancel").addEventListener("click", netejarFormulari);

function netejarFormulari() {
  document.getElementById("form-producte").reset();
  document.getElementById("edit-id").value = "";
  document.getElementById("form-title").innerText = "➕ Añadir Producto";
  document.getElementById("btn-submit").innerText = "Guardar (push / with)";
  document.getElementById("btn-cancel").style.display = "none";
}

// Inicialización
actualitzarDashboard();
