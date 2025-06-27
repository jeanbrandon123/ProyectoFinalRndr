let tablaAspirantes;
let aspiranteActualId = 0;

$(document).ready(function() {
    inicializarTablaAspirantes();
    cargarAspirantes();
});

// Inicializa la tabla con columnas
function inicializarTablaAspirantes() {
    tablaAspirantes = $('#tablaAspirantes').DataTable({
        responsive: true
    });
}

// Carga los datos vía AJAX
function cargarAspirantes() {
    $.ajax({
        url: '/v1/api/aspirantes',
        method: 'GET',
        success: function(res) {
            if (res.estado === 1) {
                tablaAspirantes.clear();

                res.aspirantes.forEach(asp => {
                    let botones = `
                        <div class="d-flex">
                            <button type="button" class="btn btn-warning me-2 btn-mensaje" data-id="${asp.idAspirante}" data-bs-toggle="modal" data-bs-target="#mensaje">Mensaje</button>
                            <button type="button" class="btn btn-info me-2 btn-ver" data-id="${asp.idAspirante}" data-bs-toggle="modal" data-bs-target="#informacion">Información</button>
                            <button type="button" class="btn btn-light me-2 btn-constancia" data-id="${asp.idAspirante}">Constancia</button>
                        </div>`;

                    tablaAspirantes.row.add([
                        asp.nombreAspirante,
                        asp.emailAspirante,
                        botones
                    ]);
                });

                tablaAspirantes.draw();
            } else {
                console.warn('No se pudieron cargar aspirantes');
            }
        },
        error: function() {
            console.error('Error cargando aspirantes');
        }
    });
}

// Ver información
$('#tablaAspirantes tbody').on('click', 'button.btn-ver', function () {
    const id = $(this).data('id');
    mostrarDetalleAspirante(id);
});

// Mostrar modal con detalle
function mostrarDetalleAspirante(id) {
    $.ajax({
        url: '/v1/api/aspirantes/' + id,
        method: 'GET',
        success: function(res) {
            if (res.estado === 1) {
                let a = res.aspirante;
                $('#modalAspirante .modal-title').html('Aspirante: <strong>' + a.nombreAspirante + '</strong>');
                $('#nombre_aspirante').val(a.nombreAspirante);
                $('#telefono_aspirante').val(a.telefonoAspirante);
                $('#email_aspirante').val(a.emailAspirante);
                $('#carrera_aspirante').val(a.nombreCarrera);
                $('#modalAspirante').modal('show');
            } else {
                console.warn('Aspirante no encontrado');
            }
        },
        error: function() {
            console.error('Error obteniendo detalle');
        }
    });
}

// Descargar constancia en PDF
$('#tablaAspirantes tbody').on('click', 'button.btn-constancia', function () {
    const id = $(this).data('id');

    $.ajax({
        url: '/v1/api/aspirantes/' + id,
        method: 'GET',
        success: function(res) {
            if (res.estado === 1) {
                const a = res.aspirante;
                generarConstanciaPDF(a);
            } else {
                console.warn('No se pudo obtener el aspirante');
            }
        },
        error: function() {
            console.error('Error al obtener el aspirante');
        }
    });
});

function generarConstanciaPDF(aspirante) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Texto negro

    // Margen izquierdo para todo el documento
    const marginLeft = 20;
    let yPosition = 30; // Posición vertical inicial

    // Logo del IPN (deberías reemplazar esto con tu imagen real)
    // doc.addImage(logoIPN, 'PNG', marginLeft, 15, 30, 30);

    // Encabezado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUTO POLITÉCNICO NACIONAL", 105, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text("DIRECCIÓN DE EDUCACIÓN CONTINUA", 105, yPosition, { align: "center" });
    yPosition += 20;

    // Título de la constancia
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CONSTANCIA", 105, yPosition, { align: "center" });
    yPosition += 20;

    // Texto "A QUIEN CORRESPONDA:"
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("A QUIEN CORRESPONDA:", marginLeft, yPosition);
    yPosition += 15;

    // Cuerpo de la constancia
    const textoConstancia = [
        "Por medio de la presente se hace constar que:",
        `${aspirante.nombreAspirante}`,
        `con número de matrícula 2024670185, se encuentra inscrito en el Curso de`,
        "Preparación para el Ingreso al Nivel Superior del Instituto Politécnico Nacional (IPN).",
        "",
        "El curso tiene como objetivo brindar a los alumnos las herramientas y conocimientos",
        "necesarios para enfrentar con éxito el examen de admisión al nivel superior de nuestra",
        "institución. La duración del curso es de 6 meses y se desarrolla en las",
        "instalaciones de la Unidad Profesional Interdisciplinaria de Ingeniería.",
        "",

        "",
        "Para cualquier información adicional, favor de comunicarse a nuestras oficinas o al",
        `${aspirante.telefonoAspirante}`,
        "",
        "Sin más por el momento, quedo a sus órdenes."
    ];

    // Agregar cada línea del texto
    textoConstancia.forEach(linea => {
        if (linea === "") {
            yPosition += 5; // Espacio entre párrafos
        } else {
            doc.text(linea, marginLeft, yPosition);
            yPosition += 7;
        }
    });

    yPosition += 15;

    // Firma
    doc.text("Atentamente,", marginLeft, yPosition);
    yPosition += 20;

    doc.text("_________________________", marginLeft, yPosition);
    yPosition += 7;
    doc.text("Efrain Arredonodo Morales", marginLeft, yPosition);
    yPosition += 7;
    doc.text("Director del Curso", marginLeft, yPosition);
    yPosition += 7;
    doc.text("Unidad de Educación Continua", marginLeft, yPosition);
    yPosition += 7;
    doc.text("Instituto Politécnico Nacional", marginLeft, yPosition);
    yPosition += 15;

    // Fecha de emisión
    const fechaEmision = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    doc.text(`Fecha de emisión: ${fechaEmision}`, marginLeft, yPosition);

    // Guardar el PDF
    doc.save(`Constancia_IPN_${aspirante.nombreAspirante.replace(/ /g, "_")}.pdf`);
}