/**
 * Myosig — Admin Banners (banners.html)
 * Upload with crop, preview, delete banner images
 */

const BANNER_COLLECTION = 'app_banners';
const MAX_BANNERS = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const BANNER_RATIO = 3; // width / height = 3:1
const BANNER_OUTPUT_W = 1200;
const BANNER_OUTPUT_H = 400;

// Banner list state
let bannerDocs = [];

// Crop state
let cropFile = null;
let cropImgNatW = 0;
let cropImgNatH = 0;
let cropOffsetY = 0;
let cropDragging = false;
let cropStartY = 0;
let cropStartOffset = 0;

initAdminPage(function () {
    loadBanners();
});

/* =========================================================
   LOAD BANNERS
   ========================================================= */
async function loadBanners() {
    const container = document.getElementById('bannerList');
    if (!container) return;

    container.innerHTML = '<div class="admin-list-loading"><i class="bi bi-hourglass-split"></i><p>Memuat banner...</p></div>';

    try {
        const snap = await firestore.collection(BANNER_COLLECTION).orderBy('order', 'asc').get();
        setText('bannerCount', snap.size + ' / ' + MAX_BANNERS);

        if (snap.empty) {
            container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-images"></i><p>Belum ada banner. Tambahkan gambar di bawah.</p></div>';
            return;
        }

        // Collect docs for reorder reference
        bannerDocs = [];
        snap.forEach(doc => {
            bannerDocs.push({ id: doc.id, ...doc.data() });
        });

        renderBannerList();
        initBannerDragSort();

    } catch (e) {
        console.error('Banner load error:', e);
        container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-exclamation-triangle"></i><p>Gagal memuat banner</p></div>';
    }
}

/* =========================================================
   RENDER + REORDER
   ========================================================= */
function renderBannerList() {
    const container = document.getElementById('bannerList');
    if (!container) return;

    const total = bannerDocs.length;
    container.innerHTML = bannerDocs.map((b, i) => `
        <div class="admin-banner-item" data-idx="${i}">
            <div class="admin-banner-drag-handle" touch-action="none">
                <i class="bi bi-grip-vertical"></i>
            </div>
            <div class="admin-banner-img">
                <img src="${b.url}" alt="${esc(b.alt || 'Banner')}" loading="lazy">
            </div>
            <div class="admin-banner-meta">
                <span class="admin-banner-order">#${i + 1}</span>
                <span class="admin-banner-name">${esc(b.alt || 'Banner')}</span>
            </div>
            <div class="admin-banner-actions">
                <button onclick="moveBanner(${i}, -1)" class="admin-reorder-btn" title="Pindah ke atas" ${i === 0 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-up"></i>
                </button>
                <button onclick="moveBanner(${i}, 1)" class="admin-reorder-btn" title="Pindah ke bawah" ${i === total - 1 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-down"></i>
                </button>
                <button onclick="deleteBanner('${b.id}')" class="admin-reorder-btn admin-reorder-btn-danger" title="Hapus">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

async function moveBanner(fromIdx, direction) {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= bannerDocs.length) return;

    // Swap in local array
    [bannerDocs[fromIdx], bannerDocs[toIdx]] = [bannerDocs[toIdx], bannerDocs[fromIdx]];
    renderBannerList();
    initBannerDragSort();

    // Save new order to Firestore
    await saveBannerOrder();
}

async function saveBannerOrder() {
    try {
        const batch = firestore.batch();
        bannerDocs.forEach((b, i) => {
            batch.update(firestore.collection(BANNER_COLLECTION).doc(b.id), { order: i });
        });
        await batch.commit();
    } catch (e) {
        console.error('Reorder save error:', e);
        showAlert('Gagal menyimpan urutan: ' + e.message, 'Kesalahan');
    }
}

/* =========================================================
   DRAG TO REORDER
   Item stays inside the container using position:absolute
   ========================================================= */
let dragState = null;

function initBannerDragSort() {
    const container = document.getElementById('bannerList');
    if (!container) return;

    container.querySelectorAll('.admin-banner-drag-handle').forEach(handle => {
        handle.addEventListener('pointerdown', onDragStart);
    });
}

function onDragStart(e) {
    e.preventDefault();
    const item = e.target.closest('.admin-banner-item');
    const container = document.getElementById('bannerList');
    if (!item || !container) return;

    const idx = parseInt(item.dataset.idx);
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemH = itemRect.height + parseFloat(getComputedStyle(container).gap || 0);

    // Prepare container: set relative + fixed height so it doesn't collapse
    container.style.position = 'relative';
    container.style.height = container.offsetHeight + 'px';
    container.style.overflow = 'hidden';

    // Position all items absolutely
    const items = Array.from(container.querySelectorAll('.admin-banner-item'));
    items.forEach((el, i) => {
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.right = '0';
        el.style.top = (i * itemH) + 'px';
        el.style.zIndex = '1';
        el.style.transition = 'top 0.2s ease';
    });

    // Dragged item on top, no transition
    item.style.zIndex = '100';
    item.style.transition = 'none';
    item.classList.add('admin-banner-dragging');

    const startY = e.clientY;
    const startTop = idx * itemH;

    dragState = {
        item, container, items, idx,
        currentIdx: idx,
        startY, startTop, itemH,
        totalItems: items.length
    };

    const Doc = document;
    Doc.addEventListener('pointermove', onDragMove);
    Doc.addEventListener('pointerup', onDragEnd);
    Doc.addEventListener('pointercancel', onDragEnd);
    item.setPointerCapture(e.pointerId);
}

function onDragMove(e) {
    if (!dragState) return;
    const { item, items, idx, startY, startTop, itemH, totalItems } = dragState;

    // Calculate new top, clamped inside container
    const delta = e.clientY - startY;
    const maxTop = (totalItems - 1) * itemH;
    const newTop = Math.max(0, Math.min(maxTop, startTop + delta));
    item.style.top = newTop + 'px';

    // Determine which slot we're hovering
    const hoverIdx = Math.round(newTop / itemH);
    if (hoverIdx !== dragState.currentIdx) {
        dragState.currentIdx = hoverIdx;
        // Reposition other items to make room
        let slot = 0;
        for (let i = 0; i < totalItems; i++) {
            if (i === idx) continue; // skip dragged item
            if (slot === hoverIdx) slot++; // leave gap for dragged item
            items[i].style.top = (slot * itemH) + 'px';
            slot++;
        }
    }
}

async function onDragEnd() {
    if (!dragState) return;

    const { item, container, idx, currentIdx } = dragState;

    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragEnd);
    document.removeEventListener('pointercancel', onDragEnd);

    item.classList.remove('admin-banner-dragging');

    // Reset inline styles
    container.style.position = '';
    container.style.height = '';
    container.style.overflow = '';
    dragState.items.forEach(el => {
        el.style.position = '';
        el.style.left = '';
        el.style.right = '';
        el.style.top = '';
        el.style.zIndex = '';
        el.style.transition = '';
    });

    const finalIdx = Math.max(0, Math.min(dragState.totalItems - 1, currentIdx));
    dragState = null;

    // Reorder array if changed
    if (finalIdx !== idx) {
        const [moved] = bannerDocs.splice(idx, 1);
        bannerDocs.splice(finalIdx, 0, moved);
        await saveBannerOrder();
    }

    renderBannerList();
    initBannerDragSort();
}

/* =========================================================
   FILE SELECT → CROP PREVIEW
   ========================================================= */
async function onBannerFileSelect(input) {
    const file = input.files[0];
    input.value = '';
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        showAlert('Ukuran file maksimal 2MB.', 'File Terlalu Besar');
        return;
    }

    const existing = await firestore.collection(BANNER_COLLECTION).get();
    if (existing.size >= MAX_BANNERS) {
        showAlert('Maksimal ' + MAX_BANNERS + ' banner. Hapus salah satu terlebih dahulu.', 'Limit Tercapai');
        return;
    }

    cropFile = file;

    // Show crop area FIRST so container has dimensions
    document.getElementById('bannerCropArea').style.display = 'block';

    // Load image into a new Image object to get dimensions reliably
    const objectUrl = URL.createObjectURL(file);
    const tempImg = new Image();
    tempImg.onload = function () {
        cropImgNatW = tempImg.naturalWidth;
        cropImgNatH = tempImg.naturalHeight;

        const container = document.getElementById('cropContainer');
        const cropImg = document.getElementById('cropImage');

        // Wait a frame so container layout is computed
        requestAnimationFrame(function () {
            const containerW = container.offsetWidth;
            const containerH = containerW / BANNER_RATIO;

            // Scale image to fill container width
            const scaledH = (cropImgNatH / cropImgNatW) * containerW;

            cropImg.style.width = '100%';
            cropImg.style.height = scaledH + 'px';

            // Center vertically by default
            const maxOffset = Math.max(0, scaledH - containerH);
            cropOffsetY = maxOffset / 2;
            cropImg.style.top = -cropOffsetY + 'px';

            // Set src on the visible img element
            cropImg.src = objectUrl;

            // Bind drag events
            container.onpointerdown = onCropPointerDown;
            container.onpointermove = onCropPointerMove;
            container.onpointerup = onCropPointerUp;
            container.onpointercancel = onCropPointerUp;
        });
    };
    tempImg.src = objectUrl;
}

function onCropPointerDown(e) {
    const container = document.getElementById('cropContainer');
    const img = document.getElementById('cropImage');
    const containerH = container.offsetWidth / BANNER_RATIO;
    const scaledH = parseFloat(img.style.height);

    if (scaledH <= containerH) return; // nothing to drag

    cropDragging = true;
    cropStartY = e.clientY;
    cropStartOffset = cropOffsetY;
    container.setPointerCapture(e.pointerId);
}

function onCropPointerMove(e) {
    if (!cropDragging) return;

    const container = document.getElementById('cropContainer');
    const img = document.getElementById('cropImage');
    const containerH = container.offsetWidth / BANNER_RATIO;
    const scaledH = parseFloat(img.style.height);
    const maxOffset = Math.max(0, scaledH - containerH);

    const delta = cropStartY - e.clientY;
    cropOffsetY = Math.max(0, Math.min(maxOffset, cropStartOffset + delta));
    img.style.top = -cropOffsetY + 'px';
}

function onCropPointerUp() {
    cropDragging = false;
}

function cancelCrop() {
    document.getElementById('bannerCropArea').style.display = 'none';
    cropFile = null;
}

/* =========================================================
   CONFIRM CROP → CANVAS RENDER → UPLOAD
   ========================================================= */
async function confirmCrop() {
    if (!cropFile) return;

    const container = document.getElementById('cropContainer');
    const img = document.getElementById('cropImage');
    const containerW = container.offsetWidth;
    const containerH = containerW / BANNER_RATIO;
    const scaledH = parseFloat(img.style.height);
    const scale = cropImgNatW / containerW;

    // Source coordinates in original image
    const sx = 0;
    const sy = cropOffsetY * scale;
    const sw = cropImgNatW;
    const sh = containerH * scale;

    // Draw to canvas at output size
    const canvas = document.createElement('canvas');
    canvas.width = BANNER_OUTPUT_W;
    canvas.height = BANNER_OUTPUT_H;
    const ctx = canvas.getContext('2d');

    // Draw cropped region
    const drawImg = new Image();
    drawImg.crossOrigin = 'anonymous';
    drawImg.src = img.src;

    await new Promise(resolve => {
        if (drawImg.complete) resolve();
        else drawImg.onload = resolve;
    });

    ctx.drawImage(drawImg, sx, sy, sw, sh, 0, 0, BANNER_OUTPUT_W, BANNER_OUTPUT_H);

    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));

    // Hide crop area
    document.getElementById('bannerCropArea').style.display = 'none';

    // Upload
    const progress = document.getElementById('bannerUploadProgress');
    const progressText = document.getElementById('bannerUploadText');
    progress.style.display = 'block';
    progressText.textContent = 'Mengupload banner...';

    try {
        const existing = await firestore.collection(BANNER_COLLECTION).get();
        const url = await uploadBannerBlob(blob, cropFile.name);

        await firestore.collection(BANNER_COLLECTION).add({
            url: url,
            alt: cropFile.name.replace(/\.[^.]+$/, ''),
            order: existing.size,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        progressText.textContent = 'Banner berhasil ditambahkan!';
        setTimeout(() => { progress.style.display = 'none'; }, 1500);
        cropFile = null;
        loadBanners();

    } catch (e) {
        console.error('Upload error:', e);
        progressText.textContent = 'Gagal upload: ' + e.message;
        setTimeout(() => { progress.style.display = 'none'; }, 3000);
    }
}

/* =========================================================
   UPLOAD
   ========================================================= */
async function uploadBannerBlob(blob, originalName) {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
        throw new Error('Supabase belum dikonfigurasi. Periksa config.js');
    }

    const bucket = 'banners';
    const safeName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = Date.now() + '_' + safeName + '.jpg';
    const uploadUrl = `${window.SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`;

    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + window.SUPABASE_ANON_KEY,
            'Content-Type': 'image/jpeg',
            'x-upsert': 'true'
        },
        body: blob
    });

    if (!res.ok) {
        let detail = res.statusText;
        try { const err = await res.json(); detail = err.message || err.error || detail; } catch (_) {}
        throw new Error('Upload gagal (' + res.status + '): ' + detail);
    }

    return `${window.SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
}

/* =========================================================
   DELETE
   ========================================================= */
async function deleteFromSupabase(url) {
    if (!url || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;
    if (!url.startsWith(window.SUPABASE_URL)) return;
    try {
        const publicPrefix = '/storage/v1/object/public/';
        const idx = url.indexOf(publicPrefix);
        if (idx === -1) return;
        const filePath = url.substring(idx + publicPrefix.length);
        const bucket = filePath.split('/')[0];
        const paths = [filePath.substring(bucket.length + 1)];
        await fetch(`${window.SUPABASE_URL}/storage/v1/object/${bucket}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + window.SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prefixes: paths })
        });
    } catch (e) {
        console.warn('Supabase delete failed:', e.message);
    }
}

async function deleteBanner(docId) {
    showConfirm('Hapus banner ini?', 'Konfirmasi Hapus', async () => {
        try {
            const doc = await firestore.collection(BANNER_COLLECTION).doc(docId).get();
            const bannerUrl = doc.exists ? doc.data().url : null;

            await firestore.collection(BANNER_COLLECTION).doc(docId).delete();
            if (bannerUrl) await deleteFromSupabase(bannerUrl);

            const snap = await firestore.collection(BANNER_COLLECTION).orderBy('order', 'asc').get();
            const batch = firestore.batch();
            let i = 0;
            snap.forEach(d => { batch.update(d.ref, { order: i++ }); });
            await batch.commit();

            loadBanners();
        } catch (e) {
            console.error('Delete error:', e);
            showAlert('Gagal menghapus: ' + e.message, 'Kesalahan');
        }
    });
}
