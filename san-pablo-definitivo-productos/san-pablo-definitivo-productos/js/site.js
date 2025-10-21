// JS clásico: TIENDA en tabla + CARRITO en tarjetas
var STORAGE_KEY = 'sp_products';
var CART_KEY = 'sp_cart';

function storeAll(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; } }
function storeSave(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
function makeId(){ return String(Date.now()) + '-' + String(Math.floor(Math.random()*100000)); }
function moneyARS(n){ n = Number(n||0); return 'ARS $ ' + n.toLocaleString('es-AR'); }

function cartAll(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
function cartSave(list){ localStorage.setItem(CART_KEY, JSON.stringify(list)); }
function cartCount(){ var c = cartAll(), n = 0; for (var i=0;i<c.length;i++){ n += Number(c[i].qty||0); } return n; }
function updateNavCount(){ var els = document.querySelectorAll('#nav-count'); for (var i=0;i<els.length;i++){ els[i].textContent = String(cartCount()); } }

function cartAdd(productId){
  var cart = cartAll();
  var found = false;
  for (var i=0;i<cart.length;i++){ if (cart[i].id === productId){ cart[i].qty += 1; found = true; break; } }
  if (!found){ cart.push({ id: productId, qty: 1 }); }
  cartSave(cart); updateNavCount();
}
function cartChangeQty(productId, delta){
  var cart = cartAll();
  for (var i=0;i<cart.length;i++){
    if (cart[i].id === productId){
      cart[i].qty += delta;
      if (cart[i].qty <= 0){ cart.splice(i,1); }
      break;
    }
  }
  cartSave(cart); renderCart(); updateNavCount();
}
function cartRemove(productId){ var cart = cartAll().filter(function(it){ return it.id !== productId; }); cartSave(cart); renderCart(); updateNavCount(); }

function seedIfEmpty(){
  if (storeAll().length === 0){
    var samples = [
      { id: makeId(), name:'Slip Clásico Blanco',    price:6999, size:'M',  color:'Blanco', image:'./img/products/slip-blanco.jpg' },
      { id: makeId(), name:'Slip Clásico Negro',     price:6999, size:'L',  color:'Negro',  image:'./img/products/slip-negro.jpg' },
      { id: makeId(), name:'Slip Clásico Petróleo',  price:7299, size:'M',  color:'Petróleo', image:'./img/products/slip-petroleo.jpg' },
      { id: makeId(), name:'Boxer Algodón Gris',     price:9499, size:'L',  color:'Gris',   image:'./img/products/boxer-gris.jpg' },
      { id: makeId(), name:'Boxer Deportivo (detalle)', price:9999, size:'M', color:'Negro', image:'./img/products/boxer-deportivo-detalle.jpg' },
      { id: makeId(), name:'Boxer Deportivo Negro',  price:10499, size:'XL', color:'Negro', image:'./img/products/boxer-deportivo-negro.jpg' }
    ];
    storeSave(samples);
  }
}

// === Render tabla en Tienda ===
function renderRows(filter){
  var tbody = document.getElementById('rows');
  if (!tbody) return;
  var q = (filter||'').toLowerCase();
  var list = storeAll().filter(function(p){ return String(p.name||'').toLowerCase().indexOf(q) !== -1; });
  tbody.innerHTML = '';
  for (var i=0;i<list.length;i++){
    var p = list[i];
    var tr = document.createElement('tr');
    tr.innerHTML = ''+
      '<td>'+(p.image?('<img src="'+p.image+'" alt="'+(p.name||'')+'">'):'')+'</td>'+
      '<td>'+ (p.name||'') +'</td>'+
      '<td>'+ moneyARS(p.price) +'</td>'+
      '<td><span class="tag">'+ (p.size||'') +'</span></td>'+
      '<td>'+ (p.color||'') +'</td>'+
      '<td><button class="btn primary" data-add="'+p.id+'">＋</button></td>';
    tbody.appendChild(tr);
  }
}

// === Render carrito en tarjetas ===
function renderCart(){
  var wrap = document.getElementById('cart-rows');
  var total = document.getElementById('cart-total');
  if (!wrap || !total) return;
  wrap.innerHTML = '';
  var list = storeAll();
  var cart = cartAll();
  var sum = 0;
  for (var i=0;i<cart.length;i++){
    var item = cart[i];
    var prod = null;
    for (var j=0;j<list.length;j++){ if (list[j].id === item.id){ prod = list[j]; break; } }
    if (!prod) continue;
    var lineTotal = Number(prod.price) * Number(item.qty);
    sum += lineTotal;
    var card = document.createElement('article');
    card.className = 'cart-card';
    card.innerHTML = ''+
      '<img class="thumb" src="'+(prod.image||'')+'" alt="'+(prod.name||'')+'">'+
      '<div>'+
        '<h3 class="title">'+prod.name+'</h3>'+
        '<p class="meta">'+moneyARS(prod.price)+'</p>'+
        '<div class="qty-controls">'+
          '<button class="btn" data-qty="-1" data-id="'+prod.id+'">−</button>'+
          '<span class="badge">'+item.qty+'</span>'+
          '<button class="btn" data-qty="1" data-id="'+prod.id+'">+</button>'+
        '</div>'+
      '</div>'+
      '<div class="side">'+
        '<div>'+moneyARS(lineTotal)+'</div>'+
        '<button class="btn" data-remove="'+prod.id+'">Quitar</button>'+
      '</div>';
    wrap.appendChild(card);
  }
  total.textContent = moneyARS(sum);
}

// === Init ===
document.addEventListener('DOMContentLoaded', function(){
  seedIfEmpty(); updateNavCount();

  // Tienda
  var rowsEl = document.getElementById('rows');
  if (rowsEl){
    renderRows('');
    var search = document.getElementById('search');
    if (search){ search.addEventListener('input', function(){ renderRows(search.value); }); }
    rowsEl.addEventListener('click', function(e){
      var addId = e.target.getAttribute('data-add');
      if (addId){ cartAdd(addId); updateNavCount(); }
    });
  }

  // Carrito
  var cartWrap = document.getElementById('cart-rows');
  if (cartWrap){
    renderCart();
    cartWrap.addEventListener('click', function(e){
      var minus = e.target.getAttribute('data-qty') === '-1';
      var plus  = e.target.getAttribute('data-qty') === '1';
      var pid   = e.target.getAttribute('data-id');
      var removeId = e.target.getAttribute('data-remove');
      if (minus && pid){ cartChangeQty(pid, -1); }
      if (plus && pid){ cartChangeQty(pid, 1); }
      if (removeId){ cartRemove(removeId); }
    });
    var clearBtn = document.getElementById('cart-clear');
    var checkout = document.getElementById('cart-checkout');
    if (clearBtn){ clearBtn.addEventListener('click', function(){ localStorage.setItem('sp_cart','[]'); renderCart(); updateNavCount(); }); }
    if (checkout){ checkout.addEventListener('click', function(){ if (!cartAll().length){ alert('Tu carrito está vacío.'); return; } alert('Compra simulada para el TP. ¡Gracias!'); localStorage.setItem('sp_cart','[]'); renderCart(); updateNavCount(); }); }
  }
});
