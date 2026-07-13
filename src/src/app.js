// CLAVE: Inicializar base de datos virtual (Leer / Read básico)
let glosario = JSON.parse(localStorage.getItem('glosario_educativo'));

if (!glosario) {
    glosario = terminosIniciales;
    localStorage.setItem('glosario_educativo', JSON.stringify(glosario));
}

// Elementos del DOM
const tablaCuerpo = document.getElementById('tabla-cuerpo');
const formulario = document.getElementById('formulario-termino');
const inputId = document.getElementById('id-termino');
const inputConcepto = document.getElementById('concepto');
const inputDefinicion = document.getElementById('definicion');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloFormulario = document.getElementById('titulo-formulario');

// 1. LEER (Read) - Renderizar los datos en la tabla
function mostrarTerminos() {
    tablaCuerpo.innerHTML = '';
    
    glosario.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${item.concepto}</strong></td>
            <td>${item.definicion}</td>
            <td>
                <button class="btn-editar" onclick="cargarFormulario(${item.id})">✏️</button>
                <button class="btn-eliminar" onclick="eliminarTermino(${item.id})">🗑️</button>
            </td>
        `;
        tablaCuerpo.appendChild(fila);
    });
}

// 2. CREAR y ACTUALIZAR (Create / Update)
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = inputId.value;
    const concepto = inputConcepto.value.trim();
    const definicion = inputDefinicion.value.trim();
    
    if (id === '') {
        // OPERACIÓN: CREAR
        const nuevoTermino = {
            id: Date.now(), // Genera un ID único basado en el tiempo
            concepto: concepto,
            definicion: definicion
        };
        glosario.push(nuevoTermino);
    } else {
        // OPERACIÓN: ACTUALIZAR
        const index = glosario.findIndex(item => item.id == id);
        if (index !== -1) {
            glosario[index].concepto = concepto;
            glosario[index].definicion = definicion;
        }
    }
    
    guardarYRefrescar();
    resetearFormulario();
});

// Auxiliar para pasar datos al formulario en modo edición
window.cargarFormulario = function(id) {
    const item = glosario.find(item => item.id == id);
    if (item) {
        inputId.value = item.id;
        inputConcepto.value = item.concepto;
        inputDefinicion.value = item.definicion;
        
        tituloFormulario.innerText = "Editar Término";
        btnGuardar.innerText = "Actualizar";
        btnCancelar.style.display = "inline-block";
    }
};

// 3. BORRAR (Delete)
window.eliminarTermino = function(id) {
    if (confirm('¿Seguro que deseas eliminar este término educativo?')) {
        glosario = glosario.filter(item => item.id != id);
        guardarYRefrescar();
        resetearFormulario();
    }
};

// Funciones de utilidad globales
function guardarYRefrescar() {
    localStorage.setItem('glosario_educativo', JSON.stringify(glosario));
    mostrarTerminos();
}

function resetearFormulario() {
    formulario.reset();
    inputId.value = '';
    tituloFormulario.innerText = "Agregar Nuevo Término";
    btnGuardar.innerText = "Guardar Término";
    btnCancelar.style.display = "none";
}

btnCancelar.addEventListener('click', resetearFormulario);

// Ejecución inicial al abrir la página
mostrarTerminos();
