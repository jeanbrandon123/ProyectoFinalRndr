let tablaAspirantes;
let aspiranteActualId = 0;
let emailAspiranteActual = '';

$(document).ready(function() {
    inicializarTablaAspirantes();
    cargarAspirantes();
    configurarEventosCorreo();
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
                            <button type="button" class="btn btn-warning me-2 btn-mensaje" data-id="${asp.idAspirante}" data-email="${asp.emailAspirante}" data-bs-toggle="modal" data-bs-target="#mensaje">Mensaje</button>
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

// Configura los eventos para el envío de correos
function configurarEventosCorreo() {
    // Cuando se hace clic en el botón de mensaje
    $(document).on('click', '.btn-mensaje', function() {
        const idAspirante = $(this).data('id');
        const email = $(this).data('email');

        // Actualiza los campos ocultos y muestra el email en el modal
        $('#id-aspirante').val(idAspirante);
        $('#email-aspirante').val(email);
        $('#destinatario-correo').text(email);
        emailAspiranteActual = email;
        aspiranteActualId = idAspirante;
    });

    // Cuando se hace clic en el botón de enviar correo
    $('#btn-enviar-correo').click(function() {
        enviarCorreo();
    });
}

// Función para enviar el correo
function enviarCorreo() {
    const emailData = {
        idAspirante: parseInt($('#id-aspirante').val()),
        email: $('#email-aspirante').val(),
        asunto: $('input[name="asunto"]').val(),
        mensaje: $('textarea[name="mensaje"]').val()
    };

    // Validación básica
    if (!emailData.asunto || !emailData.mensaje) {
        alert('Por favor complete todos los campos');
        return;
    }
    $.ajax({
        url: '/v1/api/email/enviar', // Nueva ruta
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(emailData),
        success: function(res) {
            if (res.estado === 1) {
                alert('Correo enviado con éxito a ' + emailData.email);
                $('#mensaje').modal('hide');
                $('#form-correo')[0].reset();
            } else {
                alert('Error al enviar el correo: ' + (res.mensaje || 'Error desconocido'));
            }
        },
        error: function(xhr) {
            let errorMsg = 'Error al conectar con el servidor';
            if (xhr.responseJSON && xhr.responseJSON.mensaje) {
                errorMsg += ': ' + xhr.responseJSON.mensaje;
            }
            alert(errorMsg);
            console.error('Detalles del error:', xhr.responseText);
        }
    });
}
// Envío masivo de correos
$('#btnEnviarMasivo').click(function() {
    const asunto = $('input[name="asunto"]', '#formCorreoMasivo').val();
    const mensaje = $('textarea[name="mensaje"]', '#formCorreoMasivo').val();

    if (!asunto || !mensaje) {
        alert('Por favor complete todos los campos');
        return;
    }

    // Mostrar loading
    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...');
    $(this).prop('disabled', true);

    $.ajax({
        url: '/v1/api/email/enviar-masivo',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            asunto: asunto,
            mensaje: mensaje
        },
        success: function(res) {
            if (res.estado === 1) {
                alert(`Correos enviados con éxito a ${res.total_enviados} destinatarios`);
                $('#modalMensajeMasivo').modal('hide');
                $('#formCorreoMasivo')[0].reset();
            } else {
                alert('Error: ' + res.mensaje);
            }
        },
        error: function(xhr) {
            alert('Error al enviar correos: ' + xhr.responseJSON?.mensaje || 'Error desconocido');
        },
        complete: function() {
            $('#btnEnviarMasivo').html('Enviar a todos');
            $('#btnEnviarMasivo').prop('disabled', false);
        }
    });
});

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
    doc.text("Atentamente", 160, y + 40);
    doc.setFontSize(10);
    doc.text("_________________________", 150, y + 50);
    doc.text("Responsable de Admisiones", 150, y + 60);

    // Sello de agua (opcional)
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.text("VÁLIDO", 105, 150, null, null, "center");
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.save(`Constancia_${aspirante.nombreAspirante.replace(/ /g, "_")}.pdf`);
}