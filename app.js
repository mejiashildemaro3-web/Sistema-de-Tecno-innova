// Configuración de Supabase (Sustituye con tus credenciales reales del proyecto)
const SUPABASE_URL = 'obfepaftolxufyrckxum';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmVwYWZ0b2x4dWZ5cmNreHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDI1NTQsImV4cCI6MjEwMTUxODU1NH0.JEUK3fsEAV-T_opNHicYepW1wNdlQSgLgbM1UpYT79Y';

// Inicializar cliente (si están vacías las credenciales, operará en modo maqueta visual)
let supabaseClient = null;
if (SUPABASE_URL !== 'obfepaftolxufyrckxum') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    if (supabaseClient) {
        cargarDatosSupabase();
    } else {
        console.info("Modo demostración visual activo. Configura SUPABASE_URL y SUPABASE_ANON_KEY en app.js para conectar tu base de datos.");
    }
});

// Función para obtener órdenes y técnicos desde Supabase en tiempo real
async function cargarDatosSupabase() {
    try {
        // Consultando la tabla 'ordenes_instalacion' y relacionando con 'tecnicos' y 'clientes'
        const { data: ordenes, error } = await supabaseClient
            .from('ordenes_instalacion')
            .select(`
                identificacion,
                estado,
                fecha_programada,
                tecnicos ( nombre_completo, telefono ),
                pedidos ( id_cliente )
            `)
            .limit(10);

        if (error) throw error;

        if (ordenes && ordenes.length > 0) {
            const tbody = document.getElementById('tabla-ordenes-body');
            tbody.innerHTML = ''; // Limpiar datos estáticos de ejemplo

            ordenes.forEach((orden, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#ORD-${orden.identificacion ? orden.identificacion.substring(0,4).toUpperCase() : '90' + index}</td>
                    <td><div class="tech-cell"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt=""> ${orden.tecnicos?.nombre_completo || 'Técnico Asignado'}</div></td>
                    <td>Cliente #${index + 1}</td>
                    <td><span class="badge badge-camino">${orden.estado || 'Activa'}</span></td>
                    <td><span class="priority-alta">Alta</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error("Error al conectar con Supabase:", err.message);
    }
}