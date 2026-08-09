// =========================================================================
// 1. CONFIGURACIÓN DE SUPABASE
// =========================================================================
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co'; // Reemplazar
const SUPABASE_KEY = 'TU_LLAVE_PUBLICA_ANONIMA'; // Reemplazar

// Inicializar el cliente
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================================================================
// 2. ELEMENTOS DEL DOM
// =========================================================================
const form = document.getElementById('pedidoForm');
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');
const alertIcon = document.getElementById('alertIcon');
const btnSubmit = document.getElementById('btnSubmit');
const selectZona = document.getElementById('zonaGeograficaId');

// =========================================================================
// 3. CARGAR ZONAS GEOGRÁFICAS AL INICIAR
// =========================================================================
async function cargarZonas() {
    try {
        const { data, error } = await supabase.from('zonas_geograficas').select('id, nombre');
        
        if (error) throw error;

        if (data && data.length > 0) {
            selectZona.innerHTML = '<option value="" disabled selected>Seleccione una zona...</option>';
            data.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona.id; 
                option.textContent = zona.nombre;
                selectZona.appendChild(option);
            });
        } else {
            selectZona.innerHTML = '<option value="" disabled>No hay zonas (Regístralas en Supabase primero)</option>';
        }
    } catch (error) {
        console.error("Error al cargar zonas:", error);
        selectZona.innerHTML = '<option value="" disabled>Error de conexión. Verifica las credenciales.</option>';
    }
}

// Ejecutar la carga al estar listo el DOM
document.addEventListener('DOMContentLoaded', cargarZonas);

// =========================================================================
// 4. PROCESAR FORMULARIO (INSERTAR CLIENTE Y PEDIDO)
// =========================================================================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Deshabilitar botón temporalmente para evitar doble envío
    const originalBtnHtml = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando...';
    btnSubmit.disabled = true;

    const numDoc = document.getElementById('numeroDocumento').value;

    try {
        // A. VERIFICAR SI EL CLIENTE YA EXISTE
        let clienteId = null;
        const { data: clienteExistente, error: errorBusqueda } = await supabase
            .from('clientes')
            .select('id')
            .eq('numero_documento', numDoc)
            .maybeSingle();

        if (errorBusqueda) throw errorBusqueda;

        if (clienteExistente) {
            clienteId = clienteExistente.id;
        } else {
            // B. INSERTAR NUEVO CLIENTE (Si no existe)
            const clienteData = {
                tipo_documento: document.getElementById('tipoDocumento').value,
                numero_documento: numDoc,
                nombre_razon_social: document.getElementById('nombreRazonSocial').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                direccion_domicilio: document.getElementById('direccion').value,
                zona_geografica_id: document.getElementById('zonaGeograficaId').value
            };

            const { data: nuevoCliente, error: errorInsertCliente } = await supabase
                .from('clientes')
                .insert([clienteData])
                .select('id')
                .single();

            if (errorInsertCliente) throw errorInsertCliente;
            clienteId = nuevoCliente.id;
        }

        // C. CREAR EL PEDIDO ASIGNADO A ESE CLIENTE
        const pedidoData = {
            cliente_id: clienteId,
            origen: document.getElementById('origenPedido').value,
            estado: 'pendiente_validacion'
        };

        const { error: errorPedido } = await supabase
            .from('pedidos')
            .insert([pedidoData]);

        if (errorPedido) throw errorPedido;

        // D. MOSTRAR ÉXITO Y LIMPIAR
        showAlert('Completado', 'El pedido fue ingresado al sistema de Tecno-Innova exitosamente.', 'success');
        form.reset();

    } catch (error) {
        console.error("Error en la operación:", error);
        showAlert('Error', 'No se pudo guardar la información: ' + error.message, 'error');
    } finally {
        // Restaurar estado del botón
        btnSubmit.innerHTML = originalBtnHtml;
        btnSubmit.disabled = false;
    }
});

// =========================================================================
// 5. UTILIDAD PARA ALERTAS EN PANTALLA
// =========================================================================
function showAlert(title, message, type) {
    alertBox.style.display = 'flex';
    alertMessage.innerHTML = `<strong>${title}:</strong> ${message}`;
    
    if (type === 'success') {
        alertBox.className = 'alert alert-success';
        alertIcon.className = 'fa-solid fa-circle-check';
    } else {
        alertBox.className = 'alert alert-error';
        alertIcon.className = 'fa-solid fa-triangle-exclamation';
    }

    // Ocultar alerta después de 6 segundos
    setTimeout(() => { 
        alertBox.style.display = 'none'; 
    }, 6000);
}
