// Obtener los datos del formulario por medio del boton crear

const formulario = document.getElementById("formulario-tarea");

formulario.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el envío del formulario

  const tarea = {
    titulo: document.getElementById("titulo").value,
    fecha: document.getElementById("fecha").value,
    descripcion: document.getElementById("descripcion").value,
  };  

  // Obtener lista actual desde localStorage o crear una vacía si no hay nada

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  tareas.push(tarea);

  // Guardar la lista actualizada en localStorage
  localStorage.setItem("tareas", JSON.stringify(tareas));

// Limpiar el formulario
formulario.reset(); 

  console.log("Tarea guardada:", tarea);
  console.log("Lista actual de tareas:", tareas);


  mostrarTareas();
});


function mostrarTareas() {
  const tabla = document.querySelector("#tabla-tareas tbody");
  tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar las tareas

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

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
  });

  // Botones "Completar"
  const botonesCompletar = document.querySelectorAll(".btn-completar");
  botonesCompletar.forEach(boton => {
    boton.addEventListener("click", function () {
      const fila = this.closest("tr");
      fila.classList.toggle("completada");
    });
  });

  // Botones "Eliminar"
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", function () {
      const index = this.dataset.index;
      let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
      // Elimina 1 elemento en la posición index
      tareas.splice(index, 1); 
      localStorage.setItem("tareas", JSON.stringify(tareas));
      // Actualizar la tabla después de eliminar
      mostrarTareas(); 
    });
  });
}

mostrarTareas();

