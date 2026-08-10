// Configuración de Supabase
const SUPABASE_URL = 'https://obfepaftolxufyrckxum.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmVwYWZ0b2x4dWZ5cmNreHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDI1NTQsImV4cCI6MjEwMTUxODU1NH0.JEUK3fsEAV-T_opNHicYepW1wNdlQSgLgbM1UpYT79Y';

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Facturas cargadas en memoria para permitir exportarlas a PDF sin modificar la BD.
let facturasDisponibles = [];

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

// Carga de datos sincronizada con Supabase
async function cargarDatosSupabase() {
    const tbodyOrdenes = document.getElementById('tabla-ordenes-body');
    const tbodyFacturas = document.getElementById('tabla-facturas-body');
    const tbodyPedidos = document.getElementById('tabla-pedidos-body');
    const listaTec = document.getElementById('lista-tecnicos-disponibles');

    if (!supabaseClient) {
        mostrarEstadoTabla(tbodyPedidos, 4, 'No se pudo conectar con Supabase.');
        return;
    }

    try {
        // 1. Órdenes de instalación
        const { data: ordenes, error: errOrdenes } = await supabaseClient
            .from('ordenes_instalacion')
            .select(`identificación, estado, fecha_programada, técnicos ( nombre_completo, teléfono ), pedidos ( código_pedido )`)
            .order('fecha_programada', { ascending: false })
            .limit(10);

        if (errOrdenes) {
            console.error('Error cargando órdenes:', errOrdenes.message);
            mostrarEstadoTabla(tbodyOrdenes, 4, 'No se pudieron cargar las órdenes.');
        } else if (!ordenes || ordenes.length === 0) {
            mostrarEstadoTabla(tbodyOrdenes, 4, 'No hay órdenes registradas.');
        } else {
            tbodyOrdenes.innerHTML = '';
            ordenes.forEach((o) => {
                tbodyOrdenes.innerHTML += `
                    <tr>
                        <td>#ORD-${o.pedidos?.código_pedido || String(o.identificación || '').substring(0,4).toUpperCase()}</td>
                        <td><div class="tech-cell"><i class="fa-solid fa-user-gear"></i> ${o.técnicos?.nombre_completo || 'Sin técnico asignado'}</div></td>
                        <td><span class="badge badge-camino">${o.estado || 'Activa'}</span></td>
                        <td>${o.fecha_programada ? new Date(o.fecha_programada).toLocaleDateString('es-ES') : 'N/D'}</td>
                    </tr>`;
            });
        }

        // 2. Facturas
        const { data: facturas, error: errFacturas } = await supabaseClient
            .from('facturas')
            .select('*')
            .order('fecha_emisión', { ascending: false });

        if (errFacturas) {
            console.error('Error cargando facturas:', errFacturas.message);
            facturasDisponibles = [];
            mostrarEstadoTabla(tbodyFacturas, 8, 'No se pudieron cargar las facturas.');
        } else if (!facturas || facturas.length === 0) {
            facturasDisponibles = [];
            mostrarEstadoTabla(tbodyFacturas, 8, 'No hay facturas registradas.');
        } else {
            facturasDisponibles = facturas;
            tbodyFacturas.innerHTML = '';
            facturas.forEach((f, index) => {
                tbodyFacturas.innerHTML += `
                    <tr>
                        <td><b>${f.numero_factura || 'Sin número'}</b></td>
                        <td>${f.id_cliente ? String(f.id_cliente).substring(0,8) + '...' : 'Cliente General'}</td>
                        <td>$${Number(f.monto_subtotal || 0).toFixed(2)}</td>
                        <td>$${Number(f.monto_impuestos || 0).toFixed(2)}</td>
                        <td><b>$${Number(f.monto_total || 0).toFixed(2)}</b></td>
                        <td><span class="badge badge-finalizado">Emitida</span></td>
                        <td>${f.fecha_emisión ? new Date(f.fecha_emisión).toLocaleDateString('es-ES') : 'Reciente'}</td>
                        <td><button class="btn-table" onclick="exportarFacturaPDF(${index})" title="Exportar factura a PDF"><i class="fa-solid fa-file-pdf"></i> PDF</button></td>
                    </tr>`;
            });
        }

        // 3. Gestión de pedidos: siempre reemplazamos el estado "Cargando..."
        const { data: pedidos, error: errPedidos } = await supabaseClient
            .from('pedidos')
            .select('identificación, código_pedido, id_cliente, monto_total, estado, origen, fecha_pedido')
            .order('fecha_pedido', { ascending: false })
            .limit(50);

        if (errPedidos) {
            console.error('Error cargando pedidos:', errPedidos.message);
            mostrarEstadoTabla(tbodyPedidos, 5, 'No se pudieron cargar los pedidos.');
        } else if (!pedidos || pedidos.length === 0) {
            mostrarEstadoTabla(tbodyPedidos, 5, 'No hay pedidos registrados en Supabase.');
        } else {
            tbodyPedidos.innerHTML = '';
            pedidos.forEach(p => {
                const cliente = p.id_cliente ? String(p.id_cliente).substring(0,8) + '...' : 'Sin cliente';
                const estado = p.estado || 'pendiente';
                tbodyPedidos.innerHTML += `
                    <tr>
                        <td><b>#PED-${p.código_pedido || String(p.identificación || '').substring(0,8).toUpperCase()}</b></td>
                        <td>${cliente}</td>
                        <td>$${Number(p.monto_total || 0).toFixed(2)}</td>
                        <td><span class="badge badge-ejecutando">${estado}</span></td>
                        <td>${p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleDateString('es-ES') : 'N/D'}</td>
                    </tr>`;
            });
        }

        // 4. Técnicos disponibles
        const { data: tecnicos, error: errTecnicos } = await supabaseClient
            .from('técnicos')
            .select('*')
            .eq('activo', true);

        if (errTecnicos) {
            console.error('Error cargando técnicos:', errTecnicos.message);
            if (listaTec) listaTec.innerHTML = '<p class="empty-state">No se pudieron cargar los técnicos.</p>';
        } else if (!tecnicos || tecnicos.length === 0) {
            if (listaTec) listaTec.innerHTML = '<p class="empty-state">No hay técnicos activos registrados.</p>';
        } else if (listaTec) {
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
    } catch (err) {
        console.error('Error sincronizando con Supabase:', err);
        mostrarEstadoTabla(tbodyPedidos, 5, 'Ocurrió un error al cargar los pedidos.');
    }
}

function mostrarEstadoTabla(tbody, columnas, mensaje) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="${columnas}" class="empty-table">${mensaje}</td></tr>`;
}

function exportarFacturaPDF(index) {
    const factura = facturasDisponibles[index];
    if (!factura) {
        alert('No se encontró la factura seleccionada. Actualiza la lista e inténtalo de nuevo.');
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('No se pudo cargar el módulo PDF. Comprueba tu conexión a Internet y vuelve a intentarlo.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const subtotal = Number(factura.monto_subtotal || 0);
    const impuestos = Number(factura.monto_impuestos || 0);
    const total = Number(factura.monto_total || 0);
    const fecha = factura.fecha_emisión ? new Date(factura.fecha_emisión).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES');

    doc.setFontSize(20);
    doc.text('TECNO-INNOVA C.A.', 20, 25);
    doc.setFontSize(11);
    doc.text('Factura / Comprobante de venta', 20, 33);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(12);
    doc.text(`Factura: ${factura.numero_factura || 'Sin número'}`, 20, 52);
    doc.text(`Fecha: ${fecha}`, 20, 60);
    doc.text(`Cliente ID: ${factura.id_cliente || 'Cliente General'}`, 20, 68);

    doc.line(20, 78, 190, 78);
    doc.setFontSize(11);
    doc.text('Resumen de facturación', 20, 88);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 130, 100);
    doc.text(`IVA: $${impuestos.toFixed(2)}`, 130, 110);
    doc.setFontSize(13);
    doc.text(`TOTAL: $${total.toFixed(2)}`, 130, 123);

    doc.setFontSize(9);
    doc.text('Documento generado desde el sistema Tecno-Innova.', 20, 145);
    doc.save(`${factura.numero_factura || 'factura'}.pdf`);
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

function cargarDatosMaqueta() {
    document.getElementById('tabla-ordenes-body').innerHTML = `
        <tr><td>#ORD-9021</td><td>Carlos M.</td><td><span class="badge badge-camino">En Camino</span></td><td>2026-08-09</td></tr>`;
    document.getElementById('tabla-facturas-body').innerHTML = `
        <tr><td><b>FAC-2026-001</b></td><td>Corp. Synergy S.A.</td><td>$1,200.00</td><td>$192.00</td><td><b>$1,392.00</b></td><td><span class="badge badge-finalizado">Emitida</span></td><td>2026-08-08</td></tr>`;
}

// Cálculo automático de montos fiscales
function calcularTotalFactura() {
    const cant = parseFloat(document.getElementById('fac-cantidad').value) || 0;
    const precio = parseFloat(document.getElementById('fac-precio').value) || 0;
    const subtotal = cant * precio;
    const impuesto = subtotal * 0.16;
    const total = subtotal + impuesto;
    
    document.getElementById('fac-subtotal-calc').value = `$${subtotal.toFixed(2)}`;
    document.getElementById('fac-impuesto-calc').value = `$${impuesto.toFixed(2)}`;
    document.getElementById('fac-total-calc').value = `$${total.toFixed(2)}`;
}

// Inserción de Factura en Supabase
async function guardarFactura(e) {
    e.preventDefault();
    const numero_factura = document.getElementById('fac-numero').value;
    const id_cliente = document.getElementById('fac-cliente-select').value;
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
            alert("Error al registrar la factura: " + error.message);
            return;
        }
    }
    
    alert("¡Factura emitida y guardada exitosamente en la base de datos!");
    document.getElementById('form-crear-factura').reset();
    cambiarVista('facturacion');
    if (supabaseClient) cargarDatosSupabase();
}

// Inserción de Pedido en Supabase
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