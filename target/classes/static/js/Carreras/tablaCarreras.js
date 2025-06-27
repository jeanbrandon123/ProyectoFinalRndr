let tablaCarreras;
let carreraActualId = 0;

$(document).ready(function() {
    inicializarDataTableCarreras();
    obtenerCarreras();
    console.log("Inicializando tabla...");
    console.log("Elemento tabla:", $('#tablaCarreras').length);
});

function inicializarDataTableCarreras() {
    if ($.fn.DataTable.isDataTable('#tablaCarreras')) {
        $('#tablaCarreras').DataTable().clear().destroy();
    }

    tablaCarreras = $('#tablaCarreras').DataTable({
        columns: [
            { title: "ID" },
            { title: "Nombre" },
            { title: "Semestres" },
            { title: "Observaciones" },
            {
                title: "Acciones",
                orderable: false,
                searchable: false
            }
        ],
        responsive: true,
    });
}

function obtenerCarreras() {
    $.ajax({
        method: "GET",
        url: "/v1/api/carreras",
        success: function(resultado) {
            if(resultado.estado === 1) {
                tablaCarreras.clear();

                resultado.carreras.forEach(carrera => {
                    let botones = '<button type="button" class="btn btn-success me-2" onclick="seleccionarCarreraActualizar('+carrera.idCarrera+')">Editar</button>' +
                        '<button type="button" class="btn btn-danger" onclick="seleccionarCarreraEliminar('+carrera.idCarrera+', \''+carrera.nombreCarrera+'\')">Eliminar</button>';

                    tablaCarreras.row.add([
                        carrera.idCarrera,
                        carrera.nombreCarrera,
                        carrera.semestreCarrera,
                        carrera.observacionCarrera,
                        botones
                    ]);
                });
                tablaCarreras.draw(false);
                tablaCarreras.rows().every(function(index) {
                    const data = this.data();
                    const rowNode = this.node();
                    if (rowNode) {
                        rowNode.id = "renglon_" + data[0];
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener carreras:", error);
        }
    });
}

function guardarCarrera() {
    let carrera = {
        nombreCarrera: $('#nombre_carrera').val(),
        semestreCarrera: $('#semestre_carrera').val(),
        observacionCarrera: $('#observacion_carrera').val()
    };

    if(!carrera.nombreCarrera || !carrera.semestreCarrera) {
        console.warn("Campos obligatorios incompletos");
        return;
    }

    $.ajax({
        url: "/v1/api/carreras",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(carrera),
        success: function(resultado) {
            if(resultado.estado === 1) {
                $('#modalCrud_nueva').modal('hide');
                obtenerCarreras();
                $('#nombre_carrera, #semestre_carrera, #observacion_carrera').val('');
                console.log("Carrera guardada");
            } else {
                console.warn("Guardar carrera - respuesta:", resultado.mensaje);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al guardar carrera:", error);
        }
    });
}

function seleccionarCarreraActualizar(id) {
    carreraActualId = id;
    $.ajax({
        url: "/v1/api/carreras/actualizar/" + id,
        method: "GET",
        success: function(resultado) {
            if(resultado.estado === 1) {
                $('#nombre_carrera_editar').val(resultado.carrera.nombreCarrera);
                $('#semestre_carrera_editar').val(resultado.carrera.semestreCarrera);
                $('#observacion_carrera_editar').val(resultado.carrera.observacionCarrera);
                $('#modalCrud_editar').modal('show');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al seleccionar carrera para actualizar:", error);
        }
    });
}

function actualizarCarrera() {
    let carrera = {
        idCarrera: carreraActualId,
        nombreCarrera: $('#nombre_carrera_editar').val(),
        semestreCarrera: $('#semestre_carrera_editar').val(),
        observacionCarrera: $('#observacion_carrera_editar').val()
    };

    if(!carrera.nombreCarrera || !carrera.semestreCarrera) {
        console.warn("Campos obligatorios incompletos para actualizar");
        return;
    }

    $.ajax({
        url: "/v1/api/carreras/actualizar/" + carreraActualId,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(carrera),
        success: function(resultado) {
            if(resultado.estado === 1) {
                $('#modalCrud_editar').modal('hide');
                obtenerCarreras();
                console.log("Carrera actualizada");
            } else {
                console.warn("Actualizar carrera - respuesta:", resultado.mensaje);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al actualizar carrera:", error);
        }
    });
}

function seleccionarCarreraEliminar(id, nombre) {
    carreraActualId = id;
    $('#nombre_carrera_eliminar').text(nombre);
    $('#modalCrud_eliminar').modal('show');
}

function eliminarCarrera() {
    $.ajax({
        url: "/v1/api/carreras/eliminar",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: carreraActualId }),
        success: function(resultado) {
            if (resultado.estado === 1) {
                $('#modalCrud_eliminar').modal('hide');
                obtenerCarreras();
                console.log("Carrera eliminada");
            } else {
                console.warn("Eliminar carrera - respuesta:", resultado.mensaje);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error inesperado al eliminar carrera:", error);
        }
    });
}
