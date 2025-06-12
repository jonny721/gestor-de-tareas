// Obtener elementos del DOM
const listForm = document.getElementById("list-form");
const listInput = document.getElementById("list-input");
const taskList = document.getElementById("task-list");
const taskArea = document.getElementById("task-area");
const toggleBtn = document.getElementById("toggle-sidebar");
const container = document.querySelector(".container");
const closeBtn = document.getElementById("close-sidebar");

let isCollapsed = false;

toggleBtn.addEventListener("click", () => {
  isCollapsed = !isCollapsed;
  container.classList.toggle("collapsed", isCollapsed);
});

closeBtn.addEventListener("click", () => {
  isCollapsed = false;
  container.classList.remove("collapsed");
});

// Objeto para rastrear las listas y sus IDs
let lists = {};

function createTaskManager(listId) {
  // Crear el formulario y tabla para esta lista
  taskArea.innerHTML = `
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

  // Inicializar o cargar tareas para esta lista
  let tareas = JSON.parse(localStorage.getItem(`tareas_${listId}`)) || [];
  lists[listId] = tareas;

  // Manejar envío del formulario
  const form = document.getElementById(`formulario-tarea-${listId}`);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tarea = {
      titulo: document.getElementById(`titulo-${listId}`).value,
      fecha: document.getElementById(`fecha-${listId}`).value,
      descripcion: document.getElementById(`descripcion-${listId}`).value,
    };
    tareas.push(tarea);
    localStorage.setItem(`tareas_${listId}`, JSON.stringify(tareas));
    form.reset();
    mostrarTareas(listId);
  });

  // Mostrar tareas iniciales
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
        <button class="btn btn-success btn-completar" data-index="${index}">Completar</button>
        <button class="btn btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);

    // Botón Completar
    fila.querySelector(".btn-completar").addEventListener("click", () => {
      fila.classList.toggle("completada");
    });

    // Botón Eliminar
    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
      tareas.splice(index, 1);
      localStorage.setItem(`tareas_${listId}`, JSON.stringify(tareas));
      mostrarTareas(listId);
    });
  });
}

// Manejar creación de lista
listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = listInput.value.trim();
  if (listName) {
    const listId = Date.now().toString();
    const li = document.createElement("li");
    li.textContent = listName;
    li.addEventListener("click", () => createTaskManager(listId));
    taskList.appendChild(li);
    // Eliminar lista (opcional, si quieres agregar un botón)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "btn-eliminar-lista";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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
          li.remove();
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
    });
    li.appendChild(deleteBtn);

    listInput.value = "";
  }
});
