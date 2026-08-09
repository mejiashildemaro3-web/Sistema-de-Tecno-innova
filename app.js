// Configuración de Supabase (Credenciales del proyecto)
const SUPABASE_URL = 'obfepaftolxufyrckxum';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmVwYWZ0b2x4dWZ5cmNreHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDI1NTQsImV4cCI6MjEwMTUxODU1NH0.JEUK3fsEAV-T_opNHicYepW1wNdlQSgLgbM1UpYT79Y';

let supabaseClient = null;
if (SUPABASE_URL !== 'obfepaftolxufyrckxum') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();
    if (supabaseClient) {
        cargarDatosSupabase();
        cargarClientesEnSelect();
    } else {
        console.info("Modo demostración visual activo.");
        cargarDatosMaqueta();
    }
});

// Sistema de Navegación por Vistas (SPA)
function inicializarNavegacion() {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const vistaID = item.getAttribute('data-view');
            cambiarVista(vistaID);
            
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function cambiarVista(vistaID) {
    document.querySelectorAll('.view-section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(`view-${vistaID}`);
    if (target) {
        target.style.display = 'block';
        const titulos = {
            'ordenes': 'Órdenes & Técnicos',
            'facturacion': 'Módulo de Facturación',
            'crear-factura': 'Crear Nueva Factura',
            'gestion': 'Gestión de Pedidos',
            'pedidos': 'Registrar Nuevo Pedido'
        };
        document.getElementById('view-title').innerText = titulos[vistaID] || 'Sistema Tecno-Innova';
    }
}

// Carga de datos sincronizada con el esquema exacto de Supabase
async function cargarDatosSupabase() {
    try {
        // 1. Órdenes de Instalación con relación a técnicos y pedidos
        const { data: ordenes, error: errOrdenes } = await supabaseClient
            .from('ordenes_instalacion')
            .select(`
                identificación,
                estado,
                fecha_programada,
                técnicos ( nombre_completo, teléfono ),
                pedidos ( código_pedido )
            `)
            .limit(10);

        if (!errOrdenes && ordenes && ordenes.length > 0) {
            const tbody = document.getElementById('tabla-ordenes-body');
            tbody.innerHTML = '';
            ordenes.forEach((o) => {
                tbody.innerHTML += `
                    <tr>
                        <td>#ORD-${o.pedidos?.código_pedido || o.identificación.substring(0,4).toUpperCase()}</td>
                        <td><div class="tech-cell"><i class="fa-solid fa-user-gear"></i> ${o.técnicos?.nombre_completo || 'Técnico Asignado'}</div></td>
                        <td><span class="badge badge-camino">${o.estado || 'Activa'}</span></td>
                        <td>${o.fecha_programada ? new Date(o.fecha_programada).toLocaleDateString() : 'N/D'}</td>
                    </tr>`;
            });
        }

        // 2. Facturas utilizando campos exactos: monto_subtotal, monto_impuestos, monto_total
        const { data: facturas, error: errFacturas } = await supabaseClient
            .from('facturas')
            .select('*')
            .order('fecha_emisión', { ascending: false });

        if (!errFacturas && facturas && facturas.length > 0) {
            const tbodyFac = document.getElementById('tabla-facturas-body');
            tbodyFac.innerHTML = '';
            facturas.forEach(f => {
                tbodyFac.innerHTML += `
                    <tr>
                        <td><b>${f.numero_factura}</b></td>
                        <td>${f.id_cliente ? f.id_cliente.substring(0,8) + '...' : 'Cliente General'}</td>
                        <td>$${Number(f.monto_subtotal || 0).toFixed(2)}</td>
                        <td>$${Number(f.monto_impuestos || 0).toFixed(2)}</td>
                        <td><b>$${Number(f.monto_total || 0).toFixed(2)}</b></td>
                        <td><span class="badge badge-finalizado">Emitida</span></td>
                        <td>${f.fecha_emisión ? new Date(f.fecha_emisión).toLocaleDateString() : 'Reciente'}</td>
                    </tr>`;
            });
        }

        // 3. Cargar Gestión de Pedidos
        const { data: pedidos, error: errPedidos } = await supabaseClient
            .from('pedidos')
            .select('*')
            .limit(15);

        if (!errPedidos && pedidos && pedidos.length > 0) {
            const tbodyPed = document.getElementById('tabla-pedidos-body');
            if (tbodyPed) {
                tbodyPed.innerHTML = '';
                pedidos.forEach(p => {
                    tbodyPed.innerHTML += `
                        <tr>
                            <td>#PED-${p.código_pedido}</td>
                            <td>${p.id_cliente.substring(0,8)}...</td>
                            <td>$${Number(p.monto_total || 0).toFixed(2)}</td>
                            <td><span class="badge badge-ejecutando">${p.estado}</span></td>
                        </tr>`;
                });
            }
        }

        // 4. Cargar Técnicos Disponibles en el Panel Lateral
        const { data: tecnicos, error: errTecnicos } = await supabaseClient
            .from('técnicos')
            .select('*')
            .eq('activo', true);

        if (!errTecnicos && tecnicos && tecnicos.length > 0) {
            const listaTec = document.getElementById('lista-tecnicos-disponibles');
            if (listaTec) {
                listaTec.innerHTML = '';
                tecnicos.forEach(t => {
                    listaTec.innerHTML += `
                        <div class="tech-item">
                            <div class="tech-avatar-wrapper">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="">
                                <span class="status-dot online"></span>
                            </div>
                            <div class="tech-details">
                                <h4>${t.nombre_completo}</h4>
                                <p>${t.especialidad || 'Técnico General'}</p>
                            </div>
                            <div class="tech-workload">
                                <span>Activo</span>
                                <small>${t.teléfono || 'Sin telf'}</small>
                            </div>
                        </div>`;
                });
            }
        }

    } catch (err) {
        console.error("Error sincronizando con Supabase:", err.message);
    }
}

// Poblar selector de clientes desde la tabla 'clientes'
async function cargarClientesEnSelect() {
    const { data: clientes } = await supabaseClient.from('clientes').select('identificación, nombre_razón_social');
    const selectCliente = document.getElementById('fac-cliente-select');
    if (selectCliente && clientes) {
        selectCliente.innerHTML = '<option value="">Seleccione un cliente registrado</option>';
        clientes.forEach(c => {
            selectCliente.innerHTML += `<option value="${c.identificación}">${c.nombre_razón_social}</option>`;
        });
    }
}

// Datos de respaldo si opera sin conexión a Supabase
function cargarDatosMaqueta() {
    document.getElementById('tabla-ordenes-body').innerHTML = `
        <tr><td>#ORD-9021</td><td>Carlos M.</td><td><span class="badge badge-camino">En Camino</span></td><td>2026-08-09</td></tr>`;
    document.getElementById('tabla-facturas-body').innerHTML = `
        <tr><td><b>FAC-2026-001</b></td><td>Corp. Synergy S.A.</td><td>$1,200.00</td><td>$192.00</td><td><b>$1,392.00</b></td><td><span class="badge badge-finalizado">Emitida</span></td><td>2026-08-08</td></tr>`;
}

// Cálculo automático de montos fiscales para facturación
function calcularTotalFactura() {
    const cant = parseFloat(document.getElementById('fac-cantidad').value) || 0;
    const precio = parseFloat(document.getElementById('fac-precio').value) || 0;
    const subtotal = cant * precio;
    const impuesto = subtotal * 0.16; // 16% IVA estándar
    const total = subtotal + impuesto;
    
    document.getElementById('fac-subtotal-calc').value = `$${subtotal.toFixed(2)}`;
    document.getElementById('fac-impuesto-calc').value = `$${impuesto.toFixed(2)}`;
    document.getElementById('fac-total-calc').value = `$${total.toFixed(2)}`;
}

// Inserción profesional de Factura en la tabla 'facturas' de Supabase
async function guardarFactura(e) {
    e.preventDefault();
    const numero_factura = document.getElementById('fac-numero').value;
    const id_cliente = document.getElementById('fac-cliente-select').value;
    const descripcion = document.getElementById('fac-descripcion').value;
    const cantidad = parseFloat(document.getElementById('fac-cantidad').value);
    const precio_unitario = parseFloat(document.getElementById('fac-precio').value);
    
    const monto_subtotal = cantidad * precio_unitario;
    const monto_impuestos = monto_subtotal * 0.16;
    const monto_total = monto_subtotal + monto_impuestos;

    if (supabaseClient) {
        const { error } = await supabaseClient.from('facturas').insert([{
            numero_factura,
            id_cliente: id_cliente || null,
            monto_subtotal,
            monto_impuestos,
            monto_total,
            fecha_emisión: new Date().toISOString()
        }]);

        if (error) {
            alert("Error al registrar la factura en Supabase: " + error.message);
            return;
        }
    }
    
    alert("¡Factura emitida y guardada exitosamente en la base de datos!");
    document.getElementById('form-crear-factura').reset();
    cambiarVista('facturacion');
    if (supabaseClient) cargarDatosSupabase();
}

// Inserción de Nuevo Pedido conectado a la tabla 'pedidos'
async function guardarPedido(e) {
    e.preventDefault();
    const cliente_id = document.getElementById('ped-cliente-id').value;
    const monto_total = parseFloat(document.getElementById('ped-total').value);

    if (supabaseClient) {
        const { error } = await supabaseClient.from('pedidos').insert([{
            id_cliente: cliente_id,
            monto_total,
            origen: 'web',
            estado: 'pendiente',
            fecha_pedido: new Date().toISOString()
        }]);

        if (error) {
            alert("Error al registrar pedido: " + error.message);
            return;
        }
    }

    alert("¡Pedido registrado exitosamente en Supabase!");
    document.getElementById('form-nuevo-pedido').reset();
    cambiarVista('gestion');
    if (supabaseClient) cargarDatosSupabase();
}