// Configuración de Supabase
const SUPABASE_URL = 'https://obfepaftolxufyrckxum.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImFub24iLCJpYXQiOjE3ODU5NDI1NTQsImV4cCI6MjEwMTUxODU1NH0.JEUK3fsEAV-T_opNHicYepWwNdlQSgLgbM1UpYT79Y';

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let facturasDisponibles = [];
let clientesDisponibles = [];

const CLIENTES_EJEMPLO = [
 {identificación:'2c7b4c0e-3d4d-4a4a-8e91-101010101001',tipo_documento:'V',numero_documento:'12345678',nombre_razón_social:'María González',teléfono:'0414-555-1201',correo_electrónico:'maria.gonzalez@ejemplo.com',dirección_domicilio:'Caracas, Venezuela',tiene_pagos_pendientes:false,historial_incumplimiento:false},
 {identificación:'2c7b4c0e-3d4d-4a4a-8e91-101010101002',tipo_documento:'V',numero_documento:'18765432',nombre_razón_social:'Carlos Rodríguez',teléfono:'0416-555-2388',correo_electrónico:'carlos.rodriguez@ejemplo.com',dirección_domicilio:'Baruta, Venezuela',tiene_pagos_pendientes:false,historial_incumplimiento:false},
 {identificación:'2c7b4c0e-3d4d-4a4a-8e91-101010101003',tipo_documento:'V',numero_documento:'20987654',nombre_razón_social:'Inversiones Nova C.A.',teléfono:'0212-555-3400',correo_electrónico:'administracion@nova.ejemplo.com',dirección_domicilio:'Chacao, Venezuela',tiene_pagos_pendientes:false,historial_incumplimiento:false},
 {identificación:'2c7b4c0e-3d4d-4a4a-8e91-101010101004',tipo_documento:'V',numero_documento:'24567890',nombre_razón_social:'José Martínez',teléfono:'0412-555-4810',correo_electrónico:'jose.martinez@ejemplo.com',dirección_domicilio:'El Hatillo, Venezuela',tiene_pagos_pendientes:false,historial_incumplimiento:false}
];

document.addEventListener('DOMContentLoaded',()=>{
 inicializarNavegacion();
 if(supabaseClient){ cargarDatosSupabase(); cargarClientesEnSelect(); }
 else { cargarDatosMaqueta(); usarClientesLocales(); }
});

function inicializarNavegacion(){
 document.querySelectorAll('.sidebar-menu li').forEach(item=>item.addEventListener('click',e=>{
  e.preventDefault(); const vistaID=item.dataset.view; cambiarVista(vistaID);
  document.querySelectorAll('.sidebar-menu li').forEach(i=>i.classList.remove('active')); item.classList.add('active');
 }));
}
function cambiarVista(vistaID){
 document.querySelectorAll('.view-section').forEach(sec=>sec.style.display='none');
 const target=document.getElementById(`view-${vistaID}`); if(!target)return; target.style.display='block';
 const titulos={ordenes:'Órdenes & Técnicos',facturacion:'Módulo de Facturación','crear-factura':'Crear Nueva Factura',gestion:'Gestión de Pedidos',pedidos:'Registrar Nuevo Pedido',clientes:'Clientes'};
 document.getElementById('view-title').innerText=titulos[vistaID]||'Sistema Tecno-Innova';
 if(vistaID==='gestion'&&supabaseClient)cargarPedidos();
 if(vistaID==='facturacion'&&supabaseClient)cargarFacturas();
 if(vistaID==='clientes')cargarTablaClientes();
}
async function cargarDatosSupabase(){ await Promise.all([cargarOrdenes(),cargarFacturas(),cargarPedidos(),cargarTecnicos(),cargarClientesEnSelect()]); }

async function cargarOrdenes(){
 const tbody=document.getElementById('tabla-ordenes-body'); if(!supabaseClient)return;
 try{
  const {data,error}=await supabaseClient.from('ordenes_instalacion').select(`identificación, estado, fecha_programada, técnicos(nombre_completo, teléfono), pedidos(código_pedido)`).order('fecha_programada',{ascending:false}).limit(20);
  if(error)throw error; if(!data?.length){mostrarEstadoTabla(tbody,4,'No hay órdenes registradas.');return;}
  tbody.innerHTML=data.map(o=>`<tr><td>#ORD-${escapeHtml(o.pedidos?.código_pedido||String(o.identificación||'').substring(0,4).toUpperCase())}</td><td><div class="tech-cell"><i class="fa-solid fa-user-gear"></i> ${escapeHtml(o.técnicos?.nombre_completo||'Sin técnico asignado')}</div></td><td><span class="badge badge-camino">${escapeHtml(o.estado||'Activa')}</span></td><td>${formatearFecha(o.fecha_programada)}</td></tr>`).join('');
 }catch(err){console.error(err);mostrarEstadoTabla(tbody,4,'No se pudieron cargar las órdenes.');}
}

async function cargarFacturas(){
 const tbody=document.getElementById('tabla-facturas-body'); if(!supabaseClient)return;
 try{
  const {data,error}=await supabaseClient.from('facturas').select('*').order('fecha_emisión',{ascending:false}); if(error)throw error;
  facturasDisponibles=data||[]; if(!facturasDisponibles.length){mostrarEstadoTabla(tbody,8,'No hay facturas registradas.');return;}
  tbody.innerHTML=facturasDisponibles.map((f,index)=>{const c=buscarClientePorId(f.id_cliente);return `<tr><td><b>${escapeHtml(f.numero_factura||'Sin número')}</b></td><td>${escapeHtml(c?.nombre_razón_social||(f.id_cliente?String(f.id_cliente).substring(0,8)+'...':'Sin cliente'))}</td><td>$${Number(f.monto_subtotal||0).toFixed(2)}</td><td>$${Number(f.monto_impuestos||0).toFixed(2)}</td><td><b>$${Number(f.monto_total||0).toFixed(2)}</b></td><td><span class="badge badge-finalizado">Registrada</span></td><td>${formatearFecha(f.fecha_emisión)}</td><td><button class="btn-table" onclick="exportarFacturaPDF(${index})"><i class="fa-solid fa-file-pdf"></i> Exportar a PDF</button></td></tr>`;}).join('');
 }catch(err){console.error(err);facturasDisponibles=[];mostrarEstadoTabla(tbody,8,'No se pudieron cargar las facturas.');}
}

async function cargarPedidos(){
 const tbody=document.getElementById('tabla-pedidos-body'); if(!supabaseClient)return; tbody.innerHTML='<tr><td colspan="6" class="empty-table">Actualizando pedidos...</td></tr>';
 try{
  const {data,error}=await supabaseClient.from('pedidos').select('identificación, código_pedido, id_cliente, monto_total, estado, origen, fecha_pedido').order('fecha_pedido',{ascending:false}).limit(100); if(error)throw error;
  if(!data?.length){mostrarEstadoTabla(tbody,6,'No hay pedidos registrados.');return;}
  tbody.innerHTML=data.map(p=>{const c=buscarClientePorId(p.id_cliente);return `<tr><td><b>#PED-${escapeHtml(p.código_pedido||String(p.identificación||'').substring(0,8).toUpperCase())}</b></td><td>${escapeHtml(c?.nombre_razón_social||'Cliente sin nombre')}</td><td>$${Number(p.monto_total||0).toFixed(2)}</td><td><span class="badge badge-ejecutando">${escapeHtml(p.estado||'pendiente')}</span></td><td>${escapeHtml(p.origen||'web')}</td><td>${formatearFecha(p.fecha_pedido)}</td></tr>`;}).join('');
 }catch(err){console.error(err);mostrarEstadoTabla(tbody,6,'No se pudieron cargar los pedidos. Revisa la conexión con Supabase.');}
}

async function cargarTecnicos(){
 const lista=document.getElementById('lista-tecnicos-disponibles'); if(!supabaseClient||!lista)return;
 try{const {data,error}=await supabaseClient.from('técnicos').select('*').eq('activo',true);if(error)throw error;if(!data?.length){lista.innerHTML='<p class="empty-state">No hay técnicos activos registrados.</p>';return;}
 lista.innerHTML=data.map(t=>`<div class="tech-item"><div class="tech-avatar-wrapper tech-icon-avatar"><i class="fa-solid fa-user-gear"></i><span class="status-dot online"></span></div><div class="tech-details"><h4>${escapeHtml(t.nombre_completo)}</h4><p>${escapeHtml(t.especialidad||'Técnico General')}</p></div><div class="tech-workload"><span>Activo</span><small>${escapeHtml(t.teléfono||'Sin teléfono')}</small></div></div>`).join('');
 }catch(err){console.error(err);lista.innerHTML='<p class="empty-state">No se pudieron cargar los técnicos.</p>';}
}

async function cargarClientesEnSelect(){
 if(!supabaseClient){usarClientesLocales();return;}
 try{
  let {data:clientes,error}=await supabaseClient.from('clientes').select('identificación,tipo_documento,numero_documento,nombre_razón_social,teléfono,correo_electrónico,dirección_domicilio,tiene_pagos_pendientes,historial_incumplimiento').order('nombre_razón_social');
  if(error)throw error;
  if(!clientes?.length){const {data:insertados,error:insertError}=await supabaseClient.from('clientes').upsert(CLIENTES_EJEMPLO,{onConflict:'identificación'}).select();if(!insertError&&insertados?.length)clientes=insertados;else clientes=CLIENTES_EJEMPLO;}
  clientesDisponibles=clientes||[]; llenarSelectClientes(document.getElementById('fac-cliente-select')); llenarSelectClientes(document.getElementById('ped-cliente-select')); cargarTablaClientes();
 }catch(err){console.error('Clientes:',err);usarClientesLocales();}
}
function usarClientesLocales(){clientesDisponibles=CLIENTES_EJEMPLO;llenarSelectClientes(document.getElementById('fac-cliente-select'));llenarSelectClientes(document.getElementById('ped-cliente-select'));cargarTablaClientes();}
function llenarSelectClientes(select){if(!select)return;select.innerHTML='<option value="">Seleccione un cliente</option>'+clientesDisponibles.map(c=>`<option value="${c.identificación}">${escapeHtml(c.nombre_razón_social)} — ${escapeHtml(c.numero_documento||'')}</option>`).join('');}
function buscarClientePorId(id){return clientesDisponibles.find(c=>c.identificación===id)||null;}
function cargarTablaClientes(tbody=document.getElementById('tabla-clientes-body')){if(!tbody)return;if(!clientesDisponibles.length){tbody.innerHTML='<tr><td colspan="5" class="empty-table">No hay clientes registrados.</td></tr>';return;}tbody.innerHTML=clientesDisponibles.map(c=>`<tr><td><b>${escapeHtml(c.nombre_razón_social)}</b></td><td>${escapeHtml(c.tipo_documento||'')}-${escapeHtml(c.numero_documento||'')}</td><td>${escapeHtml(c.teléfono||'N/D')}</td><td>${escapeHtml(c.correo_electrónico||'N/D')}</td><td><span class="badge ${c.tiene_pagos_pendientes?'badge-pendiente':'badge-finalizado'}">${c.tiene_pagos_pendientes?'Pendiente':'Al día'}</span></td></tr>`).join('');}

async function registrarCliente(e){
 e.preventDefault();
 const cliente={identificación:crypto.randomUUID(),tipo_documento:document.getElementById('cli-tipo-documento').value,numero_documento:document.getElementById('cli-numero-documento').value.trim(),nombre_razón_social:document.getElementById('cli-nombre').value.trim(),teléfono:document.getElementById('cli-telefono').value.trim(),correo_electrónico:document.getElementById('cli-correo').value.trim(),dirección_domicilio:document.getElementById('cli-direccion').value.trim(),tiene_pagos_pendientes:false,historial_incumplimiento:false};
 if(supabaseClient){const {data,error}=await supabaseClient.from('clientes').insert([cliente]).select().single();if(error){alert('No se pudo registrar el cliente: '+error.message);return;}clientesDisponibles.push(data||cliente);}else clientesDisponibles.push(cliente);
 llenarSelectClientes(document.getElementById('fac-cliente-select'));llenarSelectClientes(document.getElementById('ped-cliente-select'));cargarTablaClientes();document.getElementById('form-registro-cliente').reset();alert('Cliente registrado correctamente.');
}

function exportarFacturaPDF(index){
 const factura=facturasDisponibles[index]; if(!factura){alert('No se encontró la factura seleccionada.');return;} if(!window.jspdf?.jsPDF){alert('No se pudo cargar el módulo PDF. Comprueba tu conexión a Internet.');return;}
 const cliente=buscarClientePorId(factura.id_cliente);const {jsPDF}=window.jspdf;const doc=new jsPDF();const subtotal=Number(factura.monto_subtotal||0),impuestos=Number(factura.monto_impuestos||0),total=Number(factura.monto_total||0);
 doc.setFontSize(20);doc.text('TECNO-INNOVA C.A.',20,25);doc.setFontSize(11);doc.text('FACTURA / COMPROBANTE DE VENTA',20,33);doc.line(20,40,190,40);doc.setFontSize(12);doc.text(`Factura: ${factura.numero_factura||'Sin número'}`,20,52);doc.text(`Fecha: ${formatearFecha(factura.fecha_emisión)}`,20,60);doc.text(`Cliente: ${cliente?.nombre_razón_social||factura.id_cliente||'Sin cliente'}`,20,68);if(cliente?.numero_documento)doc.text(`Documento: ${cliente.tipo_documento||''}-${cliente.numero_documento}`,20,76);doc.line(20,84,190,84);doc.setFontSize(11);doc.text('DETALLE',20,94);doc.text('Importe',150,94);doc.text('Servicio / producto registrado',20,106);doc.text(`$${subtotal.toFixed(2)}`,150,106);doc.line(20,114,190,114);doc.text(`Subtotal: $${subtotal.toFixed(2)}`,130,126);doc.text(`IVA: $${impuestos.toFixed(2)}`,130,136);doc.setFontSize(14);doc.text(`TOTAL: $${total.toFixed(2)}`,130,149);doc.setFontSize(9);doc.text('Documento generado por el sistema Tecno-Innova.',20,170);
 doc.save(`${sanitizarNombreArchivo(factura.numero_factura||'factura')}.pdf`);
}

function calcularTotalFactura(){const cant=parseFloat(document.getElementById('fac-cantidad').value)||0,precio=parseFloat(document.getElementById('fac-precio').value)||0,subtotal=cant*precio,impuesto=subtotal*0.16,total=subtotal+impuesto;document.getElementById('fac-subtotal-calc').value=`$${subtotal.toFixed(2)}`;document.getElementById('fac-impuesto-calc').value=`$${impuesto.toFixed(2)}`;document.getElementById('fac-total-calc').value=`$${total.toFixed(2)}`;}

async function guardarFactura(e){
 e.preventDefault();const numero_factura=document.getElementById('fac-numero').value.trim(),id_cliente=document.getElementById('fac-cliente-select').value,cantidad=parseFloat(document.getElementById('fac-cantidad').value),precio_unitario=parseFloat(document.getElementById('fac-precio').value);
 if(!id_cliente){alert('Selecciona un cliente antes de generar la factura.');return;}
 const monto_subtotal=cantidad*precio_unitario,monto_impuestos=monto_subtotal*0.16,monto_total=monto_subtotal+monto_impuestos;let factura={numero_factura,id_cliente,monto_subtotal,monto_impuestos,monto_total,fecha_emisión:new Date().toISOString()};
 if(supabaseClient){const {data,error}=await supabaseClient.from('facturas').insert([factura]).select().single();if(error){alert('Error al registrar la factura: '+error.message);return;}Object.assign(factura,data||{});}
 facturasDisponibles.unshift(factura);exportarFacturaPDF(0);document.getElementById('form-crear-factura').reset();calcularTotalFactura();if(supabaseClient)await cargarFacturas();cambiarVista('facturacion');alert('Factura creada y descargada en PDF.');
}

async function guardarPedido(e){
 e.preventDefault();const codigo_pedido=document.getElementById('ped-codigo-pedido').value.trim(),cliente_id=document.getElementById('ped-cliente-select').value,monto_total=parseFloat(document.getElementById('ped-total').value);
 if(!codigo_pedido||!cliente_id||!Number.isFinite(monto_total)){alert('Completa el ID del pedido, selecciona un cliente e indica el monto total.');return;}
 const pedido={código_pedido:codigo_pedido,id_cliente:cliente_id,monto_total,origen:'web',estado:'pendiente',fecha_pedido:new Date().toISOString()};
 if(supabaseClient){const {error}=await supabaseClient.from('pedidos').insert([pedido]);if(error){alert('Error al registrar pedido: '+error.message);return;}}
 alert('Pedido registrado correctamente.');document.getElementById('form-nuevo-pedido').reset();cambiarVista('gestion');if(supabaseClient)await cargarPedidos();
}

function cargarDatosMaqueta(){document.getElementById('tabla-ordenes-body').innerHTML='<tr><td>#ORD-9021</td><td>Carlos M.</td><td><span class="badge badge-camino">En Camino</span></td><td>09/08/2026</td></tr>';facturasDisponibles=[{numero_factura:'FAC-2026-001',id_cliente:CLIENTES_EJEMPLO[0].identificación,monto_subtotal:1200,monto_impuestos:192,monto_total:1392,fecha_emisión:'2026-08-08T00:00:00'}];document.getElementById('tabla-facturas-body').innerHTML='<tr><td><b>FAC-2026-001</b></td><td>María González</td><td>$1,200.00</td><td>$192.00</td><td><b>$1,392.00</b></td><td><span class="badge badge-finalizado">Registrada</span></td><td>08/08/2026</td><td><button class="btn-table" onclick="exportarFacturaPDF(0)"><i class="fa-solid fa-file-pdf"></i> Exportar a PDF</button></td></tr>';document.getElementById('tabla-pedidos-body').innerHTML='<tr><td><b>#PED-1001</b></td><td>María González</td><td>$1,392.00</td><td><span class="badge badge-ejecutando">pendiente</span></td><td>web</td><td>08/08/2026</td></tr>';}
function mostrarEstadoTabla(tbody,columnas,mensaje){if(tbody)tbody.innerHTML=`<tr><td colspan="${columnas}" class="empty-table">${escapeHtml(mensaje)}</td></tr>`;}
function formatearFecha(valor){if(!valor)return'N/D';const f=new Date(valor);return Number.isNaN(f.getTime())?'N/D':f.toLocaleDateString('es-ES');}
function sanitizarNombreArchivo(nombre){return String(nombre).replace(/[\\/:*?"<>|]+/g,'_').trim()||'factura';}
function escapeHtml(valor){return String(valor??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
