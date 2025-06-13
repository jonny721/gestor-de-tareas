// Obtener elementos del DOM
const listForm = document.getElementById("list-form");
const listInput = document.getElementById("list-input");
const taskList = document.getElementById("task-list");
const taskArea = document.getElementById("task-area");
const toggleBtn = document.getElementById("toggle-sidebar");
const container = document.querySelector(".container");
const closeBtn = document.getElementById("close-sidebar");

let isCollapsed = false;
let lists = {};

// Función para guardar en localStorage
function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Función para eliminar una lista
function eliminarLista(listId, listName, liElement) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Se eliminará la lista "${listName}" y todas sus tareas.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(`tareas_${listId}`);
      delete lists[listId];
      guardarEnStorage("listas", lists);
      liElement.remove();
      taskArea.innerHTML = "";

      Swal.fire({
        title: "¡Eliminado!",
        text: "La lista ha sido eliminada.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// Función para crear un elemento de lista en el sidebar
function crearElementoLista(listId, listName) {
  const li = document.createElement("li");
  li.textContent = listName;
  li.addEventListener("click", () => createTaskManager(listId));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-eliminar-lista";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    eliminarLista(listId, listName, li);
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Función para generar HTML del área de tareas
function generarHTMLTareas(listId) {
  return `
    <form id="formulario-tarea-${listId}">
      <label for="titulo-${listId}">Título de la tarea:</label>
      <input type="text" id="titulo-${listId}" required>
      <label for="fecha-${listId}">Fecha de la tarea:</label>
      <input type="date" id="fecha-${listId}" required>
      <label for="descripcion-${listId}">Descripción:</label>
      <textarea id="descripcion-${listId}" required></textarea>
      <button type="submit">Agregar tarea</button>
    </form>
    <h2>Lista de Tareas</h2>
    <table id="tabla-tareas-${listId}">
      <thead>
        <tr>
          <th>Id</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
}

function createTaskManager(listId) {
  taskArea.innerHTML = generarHTMLTareas(listId);

  let tareas = JSON.parse(localStorage.getItem(`tareas_${listId}`)) || [];

  const form = document.getElementById(`formulario-tarea-${listId}`);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tarea = {
      titulo: document.getElementById(`titulo-${listId}`).value,
      fecha: document.getElementById(`fecha-${listId}`).value,
      descripcion: document.getElementById(`descripcion-${listId}`).value,
    };
    tareas.push(tarea);
    guardarEnStorage(`tareas_${listId}`, tareas);
    form.reset();
    mostrarTareas(listId);
  });

  mostrarTareas(listId);
}

function mostrarTareas(listId) {
  const tabla = document.querySelector(`#tabla-tareas-${listId} tbody`);
  tabla.innerHTML = "";
  let tareas = JSON.parse(localStorage.getItem(`tareas_${listId}`)) || [];

  tareas.forEach((tarea, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${tarea.titulo}</td>
      <td>${tarea.fecha}</td>
      <td>${tarea.descripcion}</td>
      <td>
        <button class="btn btn-success btn-completar" data-index="${index}">✓</button>
        <button class="btn btn-danger btn-eliminar" data-index="${index}">X</button>
      </td>
    `;
    tabla.appendChild(fila);

    // Botón completar
    fila.querySelector(".btn-completar").addEventListener("click", () => {
      fila.classList.toggle("completada");
    });

    // Botón eliminar con manejo de errores
    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
      try {
        // Obtenemos el índice actual desde el atributo del botón
        const indexActual = parseInt(fila.querySelector(".btn-eliminar").dataset.index);
        if (isNaN(indexActual) || indexActual < 0 || indexActual >= tareas.length) {
          throw new Error("Índice inválido para eliminar tarea.");
        }

        tareas.splice(indexActual, 1);
        guardarEnStorage(`tareas_${listId}`, tareas);
        mostrarTareas(listId);
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        alert("Ocurrió un error al intentar eliminar la tarea.");
      } finally {
        console.log("Operación de eliminar tarea finalizada.");
      }
    });
  });
}


listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = listInput.value.trim();
  if (listName) {
    const listId = Date.now().toString();
    crearElementoLista(listId, listName);
    lists[listId] = listName;
    guardarEnStorage("listas", lists);

    Toastify({
      text: "Lista creada exitosamente",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        background: "#4CAF50",
      },
    }).showToast();

    listInput.value = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  lists = JSON.parse(localStorage.getItem("listas")) || {};
  Object.entries(lists).forEach(([listId, listName]) => {
    crearElementoLista(listId, listName);
  });
});

// Sidebar toggle
toggleBtn.addEventListener("click", () => {
  isCollapsed = !isCollapsed;
  container.classList.toggle("collapsed", isCollapsed);
});

closeBtn.addEventListener("click", () => {
  isCollapsed = false;
  container.classList.remove("collapsed");
});
