/* =====================================================
   CONFIG
===================================================== */
const API = "http://localhost:8080/Recipet-Kids/api/registro";

let modalBS;
let modoGrupo = "existente"; // existente | nuevo
let registrosGlobal = [];
let gruposGlobal = [];

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    modalBS = new bootstrap.Modal(document.getElementById("modalRegistro"));

    cargarGrupos();
    cargarRegistros();
    cargarEstadisticas();
       cargarMaestros(); 
});

/* =====================================================
   CARGAR GRUPOS
===================================================== */
function cargarGrupos() {

    fetch(`${API}/listarGrupos`)
        .then(r => r.json())
        .then(data => {

            const filtroGrupo = document.getElementById("filtroGrupo");
            const modalGrupo = document.getElementById("modalGrupo");

            filtroGrupo.innerHTML = `<option value="">-- Elige grupo --</option>`;
            modalGrupo.innerHTML = `<option value="">-- Selecciona grupo --</option>`;

            // 🔥 Eliminamos duplicados por idGrado + nombre
            const mapa = new Map();

            data.forEach(g => {
                const clave = g.idGrado + "-" + g.nombre;

                if (!mapa.has(clave)) {
                    mapa.set(clave, g);
                }
            });

            gruposGlobal = Array.from(mapa.values());

            gruposGlobal.forEach(g => {

                const texto = `${g.idGrado}°${g.nombre}`;

                filtroGrupo.innerHTML +=
                    `<option value="${g.idGrupo}">${texto}</option>`;

                modalGrupo.innerHTML +=
                    `<option value="${g.idGrupo}">${texto}</option>`;
            });
        })
        .catch(error => {
            console.error("Error al cargar grupos:", error);
        });
}


/* =====================================================
   Carga Maestro
===================================================== */
function cargarMaestros() {

    fetch(`${API}/listarMaestros`)
        .then(response => response.json())
        .then(data => {

            const select = document.getElementById("nuevoMaestroSelect");

            select.innerHTML = `<option value="">-- Selecciona maestro --</option>`;

            data.forEach(m => {
                select.innerHTML += `
                    <option value="${m.idMaestro}">
                        ${m.nombre} ${m.apellidoPat} ${m.apellidoMat}
                    </option>
                `;
            });
        })
        .catch(error => {
            console.error("Error al cargar maestros:", error);
        });
}

/* =====================================================
   CAMBIO GRADO
===================================================== */
function onCambioGrado() {

    const grado = document.getElementById("filtroGrado").value;
    const filtroGrupo = document.getElementById("filtroGrupo");

    if (grado === "especifico") {
        filtroGrupo.style.display = "block";
    } else {
        filtroGrupo.style.display = "none";
        cargarRegistros();
    }
}

/* =====================================================
   LIMPIAR FILTROS
===================================================== */
function limpiarFiltros() {

    document.getElementById("filtroFecha").value = "";
    document.getElementById("filtroGrado").value = "";
    document.getElementById("filtroGrupo").style.display = "none";

    cargarRegistros();
}

/* =====================================================
   CARGAR REGISTROS
===================================================== */
function cargarRegistros() {

    const fecha = document.getElementById("filtroFecha").value;
    const grado = document.getElementById("filtroGrado").value;
    const grupoEspecifico = document.getElementById("filtroGrupo").value;

    let url = `${API}/listar?`;

    if (fecha) url += `fecha=${fecha}&`;
    if (grado && grado !== "especifico") url += `grado=${grado}&`;
    if (grado === "especifico" && grupoEspecifico)
        url += `grupo=${grupoEspecifico}&`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            registrosGlobal = data;
            renderTabla(data);
        });
}

/* =====================================================
   RENDER TABLA
===================================================== */
function renderTabla(data) {

    const tbody = document.getElementById("tbodyRegistros");
    const sinResultados = document.getElementById("divSinResultados");

    tbody.innerHTML = "";

    if (data.length === 0) {
        sinResultados.style.display = "block";
        return;
    }

    sinResultados.style.display = "none";

    data.forEach(r => {

        tbody.innerHTML += `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.grupo}</td>
                <td>${r.maestro || "—"}</td>
                <td><span class="badge-kg">${r.kilogramos} kg</span></td>
                <td>
                    <button class="btn-accion-editar me-1"
                        onclick="abrirModalEditar(${r.idRegistro})">
                        Editar
                    </button>
                    <button class="btn-accion-eliminar"
                        onclick="eliminarRegistro(${r.idRegistro})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

/* =====================================================
   ESTADÍSTICAS
===================================================== */
function cargarEstadisticas() {

    fetch(`${API}/estadisticas`)
        .then(r => r.json())
        .then(data => {

            document.getElementById("statTotalKg").innerText =
                data.total + " kg";

            document.getElementById("statGrupos").innerText =
                data.grupos;
        });
}

/* =====================================================
   MODAL NUEVO
===================================================== */
function abrirModalNuevo() {

    document.getElementById("tituloModal").innerText = "Nuevo Registro";
    document.getElementById("modalIdRegistro").value = "";
    document.getElementById("modalFecha").value = "";
    document.getElementById("modalKg").value = "";
    document.getElementById("modalObs").value = "";

    document.getElementById("divTabs").style.display = "flex";

    activarTab("existente");

    modalBS.show();
    cargarMaestros();
}

/* =====================================================
   MODAL EDITAR
===================================================== */
function abrirModalEditar(idRegistro) {

    const reg = registrosGlobal.find(r => r.idRegistro == idRegistro);
    if (!reg) return;

    document.getElementById("tituloModal").innerText = "Editar Registro";

    document.getElementById("modalIdRegistro").value = reg.idRegistro;
    document.getElementById("modalFecha").value = reg.fecha;
    document.getElementById("modalKg").value = reg.kilogramos;
    document.getElementById("modalObs").value = reg.observaciones || "";

    document.getElementById("modalGrupo").value = reg.idGrupo;

    document.getElementById("divTabs").style.display = "none";

    modalBS.show();
}

/* =====================================================
   TABS MODAL
===================================================== */
function activarTab(tipo) {

    modoGrupo = tipo;

    document.getElementById("tabExistente").classList.remove("active");
    document.getElementById("tabNuevo").classList.remove("active");

    document.getElementById("panelExistente").style.display = "none";
    document.getElementById("panelNuevo").style.display = "none";

    if (tipo === "existente") {
        document.getElementById("tabExistente").classList.add("active");
        document.getElementById("panelExistente").style.display = "block";
    } else {
        document.getElementById("tabNuevo").classList.add("active");
        document.getElementById("panelNuevo").style.display = "block";
    }
}

/* =====================================================
   GUARDAR
===================================================== */
function guardarRegistro() {

    const idRegistro = document.getElementById("modalIdRegistro").value;
    const fecha = document.getElementById("modalFecha").value;
    const kg = document.getElementById("modalKg").value;
    const obs = document.getElementById("modalObs").value || "";

    if (!fecha || !kg) {
        Swal.fire("Completa los campos obligatorios");
        return;
    }

    if (modoGrupo === "existente") {

        const idGrupo = document.getElementById("modalGrupo").value;

        fetch(`${API}/${idRegistro ? "modificar" : "agregar"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idRegistro: idRegistro || undefined,
                idGrupo,
                fechaPesaje: fecha,
                kilogramos: kg,
                observaciones: obs
            })
        })
        .then(r => r.json())
        .then(() => {
            modalBS.hide();
            cargarRegistros();
            cargarEstadisticas();
        });

    } else {

        const grado = document.getElementById("nuevoGrado").value;
        const letra = document.getElementById("nuevoLetra").value.toUpperCase();
        const idMaestro = document.getElementById("nuevoMaestroSelect").value;

        fetch(`${API}/agregarGrupo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ grado, nombre: letra, idMaestro })
        })
        .then(r => r.json())
        .then(nuevoGrupo => {

            return fetch(`${API}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idGrupo: nuevoGrupo.idGrupo,
                    fechaPesaje: fecha,
                    kilogramos: kg,
                    observaciones: obs
                })
            });
        })
        .then(() => {
            modalBS.hide();
            cargarGrupos();
            cargarRegistros();
            cargarEstadisticas();
        });
    }
}

/* =====================================================
   ELIMINAR
===================================================== */
function eliminarRegistro(idRegistro) {

    Swal.fire({
        title: "¿Eliminar registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar"
    }).then(result => {

        if (result.isConfirmed) {

            fetch(`${API}/eliminar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idRegistro })
            })
            .then(() => {
                cargarRegistros();
                cargarEstadisticas();
            });
        }
    });
}
function confirmarLogout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Tu sesión actual se cerrará.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {

            // Limpia almacenamiento si usas sesión local
            localStorage.clear();
            sessionStorage.clear();

            // Redirige al login
            window.location.href = "../index.html";
        }
    });
}