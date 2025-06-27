let tablaAspirantes;
let aspiranteActualId = 0;
let emailAspiranteActual = '';

$(document).ready(function() {
    inicializarTablaAspirantes();
    cargarAspirantes();
    configurarEventosCorreo(); // <-- llamada agregada
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

                tablaAspirantes.draw(false); // No reiniciar la paginación
            } else {
                console.warn('No se pudieron cargar aspirantes');
            }
        },
        error: function() {
            console.error('Error cargando aspirantes');
        }
    });
}

// Mostrar detalle de aspirante
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

// Ver información
$('#tablaAspirantes tbody').on('click', 'button.btn-ver', function () {
    const id = $(this).data('id');
    mostrarDetalleAspirante(id);
});

// Descargar constancia
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

    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const marginLeft = 20;
    let yPosition = 30;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUTO POLITÉCNICO NACIONAL", 105, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text("DIRECCIÓN DE EDUCACIÓN CONTINUA", 105, yPosition, { align: "center" });
    yPosition += 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CONSTANCIA", 105, yPosition, { align: "center" });
    yPosition += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("A QUIEN CORRESPONDA:", marginLeft, yPosition);
    yPosition += 15;

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

    textoConstancia.forEach(linea => {
        yPosition += (linea === "") ? 5 : 7;
        if (linea !== "") doc.text(linea, marginLeft, yPosition);
    });

    yPosition += 15;

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

    const fechaEmision = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    doc.text(`Fecha de emisión: ${fechaEmision}`, marginLeft, yPosition);

    doc.save(`Constancia_IPN_${aspirante.nombreAspirante.replace(/ /g, "_")}.pdf`);
}

// Configura los eventos para el envío de correos
function configurarEventosCorreo() {
    $(document).on('click', '.btn-mensaje', function() {
        const idAspirante = $(this).data('id');
        const email = $(this).data('email');

        $('#id-aspirante').val(idAspirante);
        $('#email-aspirante').val(email);
        $('#destinatario-correo').text(email);
        emailAspiranteActual = email;
        aspiranteActualId = idAspirante;
    });

    $('#btn-enviar-correo').click(function() {
        enviarCorreo();
    });
}

// Función para enviar el correo individual
function enviarCorreo() {
    const emailData = {
        idAspirante: parseInt($('#id-aspirante').val()),
        email: $('#email-aspirante').val(),
        asunto: $('input[name="asunto"]').val(),
        mensaje: $('textarea[name="mensaje"]').val()
    };




    $.ajax({
        url: '/v1/api/email/enviar',
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
            alert('Error al enviar correos: ' + (xhr.responseJSON?.mensaje || 'Error desconocido'));
        },
        complete: function() {
            $('#btnEnviarMasivo').html('Enviar a todos');
            $('#btnEnviarMasivo').prop('disabled', false);
        }
    });
});
