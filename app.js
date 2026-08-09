// 1. Configuración de Supabase
const supabaseUrl = 'TU_URL_DE_SUPABASE'; 
const supabaseKey = 'TU_KEY_PUBLICA_DE_SUPABASE'; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del formulario en el HTML
    const formPedido = document.getElementById('form-pedido');
    const btnRegistrar = document.getElementById('btn-registrar');
    const btnLimpiar = document.getElementById('btn-limpiar');

    // 2. Lógica para limpiar los campos
    btnLimpiar.addEventListener('click', () => {
        formPedido.reset();
    });

    // 3. Lógica para procesar y enviar el registro
    btnRegistrar.addEventListener('click', async (e) => {
        e.preventDefault();

        // Extraer los valores ingresados por el usuario
        const tipoDocumento = document.getElementById('document_type').value;
        const numeroDocumento = document.getElementById('document_number').value;
        const razonSocial = document.getElementById('full_name').value;
        const telefono = document.getElementById('phone').value;
        const correo = document.getElementById('email').value;
        const direccion = document.getElementById('address').value;
        const zona = document.getElementById('zone').value;
        const origen = document.getElementById('source').value;

        // Validación: Campos obligatorios
        if (!numeroDocumento || !razonSocial || !telefono || !direccion) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, rellene todos los campos obligatorios (*).',
                confirmButtonColor: '#2563eb' // Azul acorde al diseño
            });
            return;
        }

        // Estado de "Cargando" en el botón
        const textoOriginal = btnRegistrar.innerHTML;
        btnRegistrar.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Procesando...';
        btnRegistrar.disabled = true;

        try {
            // 4. Inserción de datos en la tabla 'pedidos' de Supabase
            const { data, error } = await supabase
                .from('pedidos')
                .insert([
                    { 
                        documento: `${tipoDocumento}-${numeroDocumento}`, 
                        razon_social: razonSocial,
                        telefono: telefono,
                        correo: correo,
                        direccion: direccion,
                        zona: zona,
                        origen: origen,
                        estado: 'Pendiente'
                    }
                ]);

            if (error) throw error;

            // Éxito: Mostrar alerta y limpiar
            Swal.fire({
                icon: 'success',
                title: '¡Pedido Registrado!',
                text: 'La orden de servicio ha sido inicializada correctamente en el sistema.',
                confirmButtonColor: '#2563eb'
            });
            
            formPedido.reset();

        } catch (error) {
            console.error('Error al insertar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo registrar el pedido. Verifica tu conexión a la base de datos.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            // Restaurar el botón
            btnRegistrar.innerHTML = textoOriginal;
            btnRegistrar.disabled = false;
        }
    });
});