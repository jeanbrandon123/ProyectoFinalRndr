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

    const fecha = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Configuración inicial
    doc.setFont("helvetica");
    doc.setFontSize(12);

    // Encabezado con fondo de color
    doc.setFillColor(44, 62, 80); // Azul oscuro
    doc.rect(0, 0, 210, 30, 'F');

    // Título
    // Encabezado con fondo guinda
    doc.setFillColor(128, 0, 32); // Color guinda (RGB)
    doc.rect(0, 0, 210, 30, 'F'); // Fondo rectangular

// Título en blanco sobre fondo guinda
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text("CONSTANCIA DE REGISTRO", 105, 20, null, null, "center");

    // Logo institucional (simulado)
    // doc.addImage(logoData, 'PNG', 160, 35, 30, 30);

    // Cuerpo del documento
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("Se hace constar que:", 20, 50);

    // Tabla con la información
    const datos = [
        ["Nombre del aspirante:", aspirante.nombreAspirante],
        ["Correo electrónico:", aspirante.emailAspirante],
        ["Teléfono:", aspirante.telefonoAspirante],
        ["Carrera seleccionada:", aspirante.nombreCarrera],
        ["Fecha de registro:", fecha]
    ];

    let y = 70;
    datos.forEach(([etiqueta, valor]) => {
        doc.setFont("helvetica", "bold");
        doc.text(etiqueta, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(valor, 70, y);
        y += 10;
    });

    // Separador decorativo
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 15, 190, y + 15);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("ATTE: EL DIRE", 105, y + 25, null, null, "center");


    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Atentamente", 160, y + 40);  // Texto "Atentamente"
    doc.setFontSize(10);
    doc.text("_________________________", 150, y + 50);  // Línea de firma (espacio amplio)
    doc.text("Responsable de Admisiones", 150, y + 60);  // Cargo (más abajo)



    // Sello de agua (opcional)
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.text("VÁLIDO", 105, 150, null, null, "center");
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.save(`Constancia_${aspirante.nombreAspirante.replace(/ /g, "_")}.pdf`);
}