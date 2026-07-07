// SUPABASE INITIALIZATION (Replace with your actual keys!)
const SUPABASE_URL = 'https://gxggetfxkzhegqehcjzv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z2dldGZ4a3poZWdxZWhjanp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTAxNzQsImV4cCI6MjA5Nzc4NjE3NH0.iNqyqCC3ZSrKhOW2JrfmL7iN6MK7J5U_2XXZbxJPGEw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Access Libraries (CMYK included)
const { PDFDocument, rgb, cmyk, degrees, PDFName } = PDFLib;
const pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
const MAX_PDFJS_IMAGE_PIXELS = 4096 * 4096; // ~16.8 million pixels; protects against OOM on huge embedded raster images (e.g. large-format print PDFs)

// DOM Elements
const openPdfBtn = document.getElementById('openPdfBtn');
const openPdfInput = document.getElementById('openPdfInput');
const combineBtn = document.getElementById('combineBtn');
const fileInput = document.getElementById('fileInput');
const exportBtn = document.getElementById('exportBtn');
const convertCmykExportBtn = document.getElementById('convertCmykExportBtn');
const organizeBtn = document.getElementById('organizeBtn');
const splitBtn = document.getElementById('splitBtn');
const editPdfBtn = document.getElementById('editPdfBtn');
const attachBtn = document.getElementById('attachBtn');
const attachInput = document.getElementById('attachInput');
const statusDisplay = document.getElementById('status');
const viewerMessage = document.getElementById('viewerMessage');
const pdfPreviewLayout = document.getElementById('pdfPreviewLayout');
const pdfThumbRail = document.getElementById('pdfThumbRail');
const pdfCanvasContainer = document.getElementById('pdfCanvasContainer');
const pdfPreview = document.getElementById('pdfPreview');
const pdfNavToolbar = document.getElementById('pdfNavToolbar');
const pdfCurrentPageDisplay = document.getElementById('pdfCurrentPageDisplay');
const pdfPageCount = document.getElementById('pdfPageCount');
const pdfZoomOutBtn = document.getElementById('pdfZoomOutBtn');
const pdfZoomInBtn = document.getElementById('pdfZoomInBtn');
const pdfZoomLevel = document.getElementById('pdfZoomLevel');

const applySizeBtn = document.getElementById('applySizeBtn');
const docWidthInp = document.getElementById('docWidthInp');
const docHeightInp = document.getElementById('docHeightInp');
const docResInp = document.getElementById('docResInp');
const linkWhBtn = document.getElementById('linkWhBtn');
const linkHResBtn = document.getElementById('linkHResBtn');
const docUnitSelect = document.getElementById('docUnitSelect');

// Sidebar Toggle Logic
const toolsMenuToggle = document.getElementById('toolsMenuToggle');
const sidebarRight = document.getElementById('sidebarRight');

toolsMenuToggle.addEventListener('click', () => {
    sidebarRight.classList.toggle('collapsed');
    setTimeout(positionPdfNavToolbar, 320); // wait out the 0.3s sidebar width transition
});

// Modals
const organizeModal = document.getElementById('organizeModal');
const closeOrgBtn = document.getElementById('closeModalBtn');
const applyOrgBtn = document.getElementById('applyOrgBtn');
const orgUndoBtn = document.getElementById('orgUndoBtn');
const orgRedoBtn = document.getElementById('orgRedoBtn');
const orgAddBtn = document.getElementById('orgAddBtn');
const orgAddInput = document.getElementById('orgAddInput');
const orgAddBlankBtn = document.getElementById('orgAddBlankBtn'); 
const thumbnailGrid = document.getElementById('thumbnailGrid');

const editModal = document.getElementById('editModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const applyEditsBtn = document.getElementById('applyEditsBtn');
const editCanvas = document.getElementById('editCanvas');
const canvasWrapper = document.getElementById('canvasWrapper');
const globalTrashBtn = document.getElementById('globalTrashBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

const docsMenuBtn = document.getElementById('docsMenuBtn');
const aboutMenuBtn = document.getElementById('aboutMenuBtn');
const docsModal = document.getElementById('docsModal');
const aboutModal = document.getElementById('aboutModal');
const exportModal = document.getElementById('exportModal');
const closeDocsModalBtn = document.getElementById('closeDocsModalBtn');
const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');

// Auth & Donate Elements
const loginMenuBtn = document.getElementById('loginMenuBtn');
const logoutMenuBtn = document.getElementById('logoutMenuBtn');
const donateMenuBtn = document.getElementById('donateMenuBtn');
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const donateModal = document.getElementById('donateModal');
const closeDonateModalBtn = document.getElementById('closeDonateModalBtn');
const adContainer = document.getElementById('adContainer');

// Setup Navigation Event Listeners
docsMenuBtn.addEventListener('click', () => docsModal.style.display = 'flex');
aboutMenuBtn.addEventListener('click', () => aboutModal.style.display = 'flex');
loginMenuBtn.addEventListener('click', () => authModal.style.display = 'flex');
donateMenuBtn.addEventListener('click', () => donateModal.style.display = 'flex');

closeDocsModalBtn.addEventListener('click', () => docsModal.style.display = 'none');
closeAboutModalBtn.addEventListener('click', () => aboutModal.style.display = 'none');
closeAuthModalBtn.addEventListener('click', () => authModal.style.display = 'none');
closeDonateModalBtn.addEventListener('click', () => donateModal.style.display = 'none');

window.addEventListener('click', (e) => {
    if (e.target === docsModal) docsModal.style.display = 'none';
    if (e.target === aboutModal) aboutModal.style.display = 'none';
    if (e.target === authModal) authModal.style.display = 'none';
    if (e.target === donateModal) donateModal.style.display = 'none';
});


// ==========================================
// SUPABASE AUTHENTICATION & SUBSCRIPTION LOGIC
// ==========================================

let isLoginMode = true;
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authMessage = document.getElementById('authMessage');
const donateStatusDisplay = document.getElementById('donateStatusDisplay');

tabLogin.addEventListener('click', () => {
    isLoginMode = true;
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    authSubmitBtn.innerText = 'AUTHENTICATE';
    authMessage.innerText = '';
});

tabRegister.addEventListener('click', () => {
    isLoginMode = false;
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    authSubmitBtn.innerText = 'REGISTER';
    authMessage.innerText = '';
});

authSubmitBtn.addEventListener('click', async () => {
    const email = authEmail.value;
    const password = authPassword.value;
    if(!email || !password) return authMessage.innerText = "[ ERROR: Empty fields ]";

    authSubmitBtn.innerText = 'PROCESSING...';
    
    if (isLoginMode) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) authMessage.innerText = `[ ERROR: ${error.message} ]`;
        else {
            authModal.style.display = 'none';
            checkSession();
        }
    } else {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) authMessage.innerText = `[ ERROR: ${error.message} ]`;
        else authMessage.innerText = "[ SUCCESS: Registration complete. Please log in. ]";
    }
    
    authSubmitBtn.innerText = isLoginMode ? 'AUTHENTICATE' : 'REGISTER';
});

logoutMenuBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    checkSession();
});

const unsubscribeBtn = document.getElementById('unsubscribeBtn');
unsubscribeBtn.addEventListener('click', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('[ ERROR ] You must be logged in to unsubscribe.');
        return;
    }

    const confirmed = confirm(
        '[ WARNING ] This will permanently delete your profile and donation record from our database. ' +
        'This cannot be undone. Your account will lose its Donator status, and any donation history on file will be erased.\n\n' +
        'Click OK to permanently delete your data, or Cancel to keep your account.'
    );
    if (!confirmed) return;

    unsubscribeBtn.disabled = true;
    unsubscribeBtn.querySelector('.tool-text').innerText = 'Deleting...';

    try {
        const { error } = await supabaseClient
            .from('profiles')
            .delete()
            .eq('id', session.user.id);

        if (error) {
            alert(`[ ERROR ] Could not delete your data: ${error.message}`);
        } else {
            alert('[ SYSTEM ] Your profile and donation data have been deleted. You will now be logged out.');
            await supabaseClient.auth.signOut();
            checkSession();
            donateModal.style.display = 'none';
        }
    } catch (e) {
        console.error('[ Unsubscribe ] delete failed:', e);
        alert('[ ERROR ] Something went wrong while deleting your data. Please try again.');
    } finally {
        unsubscribeBtn.disabled = false;
        unsubscribeBtn.querySelector('.tool-text').innerText = 'Unsubscribe & Delete My Data';
    }
});

async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
        // User is logged in
        loginMenuBtn.style.display = 'none';
        logoutMenuBtn.style.display = 'block';
        checkDonationStatus(session.user);
    } else {
        // User is logged out
        loginMenuBtn.style.display = 'block';
        logoutMenuBtn.style.display = 'none';
        adContainer.style.display = 'flex'; // Show ads for free users
        donateStatusDisplay.innerHTML = `[ <strong style="color:var(--neon-pink);">ACCESS DENIED</strong> ]<br><span style="font-size:12px; color:#888;">Please log in to check your Donator status.</span>`;
    }
}

async function checkDonationStatus(user) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('donation_active_until')
        .eq('id', user.id)
        .single();

    if (data && data.donation_active_until) {
        const expirationDate = new Date(data.donation_active_until);
        const now = new Date();

        if (expirationDate > now) {
            // User is a Donator
            adContainer.style.display = 'none'; // REMOVE ADS
            donateStatusDisplay.innerHTML = `[ <strong style="color:var(--neon-cyan);">DONATOR ACTIVE</strong> ]<br><span style="font-size:12px; color:#888;">No ads. Expires on: ${expirationDate.toLocaleDateString()}</span>`;
            return;
        }
    }
    
    // User is logged in but NOT an active donator
    adContainer.style.display = 'flex'; // SHOW ADS
    donateStatusDisplay.innerHTML = `[ <strong style="color:var(--neon-yellow);">STANDARD TIER</strong> ]<br><span style="font-size:12px; color:#888;">Logged in as: ${user.email}</span>`;
}

// Check session on page load
checkSession();

// ==========================================
// NEW FEATURE: PROPORTIONAL RESIZING & RESOLUTION LINKING
// ==========================================

let aspectRatio = 1;
let basePixelsW = 0;
let basePixelsH = 0;
let isUpdatingSize = false;
let previousSizeUnit = 'in';

// Points-per-unit for physical units (72pt = 1 inch, the PDF native unit).
// Pixels aren't a fixed physical size — they depend on resolution (DPI),
// so they're handled separately via the res parameter below.
function unitToInches(value, unit, res) {
    if (isNaN(value)) return NaN;
    switch (unit) {
        case 'cm': return value / 2.54;
        case 'mm': return value / 25.4;
        case 'pt': return value / 72;
        case 'px': return value / (res > 0 ? res : 300);
        case 'in':
        default: return value;
    }
}
function inchesToUnit(inches, unit, res) {
    switch (unit) {
        case 'cm': return inches * 2.54;
        case 'mm': return inches * 25.4;
        case 'pt': return inches * 72;
        case 'px': return inches * (res > 0 ? res : 300);
        case 'in':
        default: return inches;
    }
}
function unitToPoints(value, unit, res) {
    return unitToInches(value, unit, res) * 72;
}
function formatUnitValue(value, unit) {
    return unit === 'px' ? Math.round(value).toString() : value.toFixed(2);
}

function updateSizeCalculations(source) {
    if(isUpdatingSize) return;
    isUpdatingSize = true;

    const unit = docUnitSelect.value;
    const res0 = parseFloat(docResInp.value);

    // All size math below happens in inches (unit-agnostic canonical
    // form) — only reading/writing the visible inputs converts through
    // whichever unit is currently selected, so switching units never
    // changes the actual document size, just how it's displayed.
    let w = unitToInches(parseFloat(docWidthInp.value), unit, res0);
    let h = unitToInches(parseFloat(docHeightInp.value), unit, res0);
    let res = res0;

    // Only process mathematically if all fields contain valid numbers above 0
    if (w > 0 && h > 0 && res > 0) {
        if (source === 'w') {
            if (!linkWhBtn.classList.contains('unlinked')) {
                h = w / aspectRatio;
                docHeightInp.value = formatUnitValue(inchesToUnit(h, unit, res), unit);
            }
            if (!linkHResBtn.classList.contains('unlinked')) {
                res = basePixelsH / h;
                docResInp.value = res.toFixed(2);
            }
        } else if (source === 'h') {
            if (!linkWhBtn.classList.contains('unlinked')) {
                w = h * aspectRatio;
                docWidthInp.value = formatUnitValue(inchesToUnit(w, unit, res), unit);
            }
            if (!linkHResBtn.classList.contains('unlinked')) {
                res = basePixelsH / h;
                docResInp.value = res.toFixed(2);
            }
        } else if (source === 'res') {
            if (!linkHResBtn.classList.contains('unlinked')) {
                h = basePixelsH / res;
                docHeightInp.value = formatUnitValue(inchesToUnit(h, unit, res), unit);
                if (!linkWhBtn.classList.contains('unlinked')) {
                    w = h * aspectRatio;
                    docWidthInp.value = formatUnitValue(inchesToUnit(w, unit, res), unit);
                }
            }
        }
    }

    // Update baseline states (in inches/pixels — unit-agnostic) to reflect the new geometry
    w = unitToInches(parseFloat(docWidthInp.value), unit, parseFloat(docResInp.value));
    h = unitToInches(parseFloat(docHeightInp.value), unit, parseFloat(docResInp.value));
    res = parseFloat(docResInp.value);

    if (w > 0 && h > 0 && res > 0) {
        aspectRatio = w / h;
        basePixelsW = w * res;
        basePixelsH = h * res;
    }

    isUpdatingSize = false;
}

// Attach event listeners for real-time sizing edits
docWidthInp.addEventListener('input', () => updateSizeCalculations('w'));
docHeightInp.addEventListener('input', () => updateSizeCalculations('h'));
docResInp.addEventListener('input', () => updateSizeCalculations('res'));

// Switching units re-displays the SAME physical size in the new unit —
// it converts the currently shown values (interpreted in the unit they
// were just displayed in) rather than re-deriving anything, so no
// rounding drift accumulates beyond the display itself.
docUnitSelect.addEventListener('change', () => {
    const res = parseFloat(docResInp.value) || 300;
    const wOld = parseFloat(docWidthInp.value);
    const hOld = parseFloat(docHeightInp.value);
    const newUnit = docUnitSelect.value;

    if (!isNaN(wOld) && !isNaN(hOld)) {
        const wInches = unitToInches(wOld, previousSizeUnit, res);
        const hInches = unitToInches(hOld, previousSizeUnit, res);
        docWidthInp.value = formatUnitValue(inchesToUnit(wInches, newUnit, res), newUnit);
        docHeightInp.value = formatUnitValue(inchesToUnit(hInches, newUnit, res), newUnit);
    }
    docWidthInp.step = newUnit === 'px' ? '1' : '0.01';
    docHeightInp.step = newUnit === 'px' ? '1' : '0.01';
    previousSizeUnit = newUnit;
});

linkWhBtn.addEventListener('click', () => {
    linkWhBtn.classList.toggle('unlinked');
    updateSizeCalculations('none'); 
});

linkHResBtn.addEventListener('click', () => {
    linkHResBtn.classList.toggle('unlinked');
    updateSizeCalculations('none');
});


// ==========================================
// CORE PDF LOGIC 
// ==========================================

// State Management
let currentPdfUrl = null; 
let basePdfBytes = null;
let currentPdfBytes = null; 
let currentEditPage = 1;
let pdfLayers = {}; 
let undoStack = [];
let redoStack = [];
let organizeState = []; 
let orgUndoStack = [];
let orgRedoStack = [];
let isDocCMYK = false; 
let importedBaseFileName = 'Spiokoks_Document';
let pdfJsDoc = null;

function getBaseFileName(name) {
    return name.replace(/\.[^/.]+$/, '') || 'Spiokoks_Document';
}

function updateCmykButtonVisibility() {
    // No auto-detection anymore (it was unreliable and slow) — just offer
    // the option whenever a document is loaded and let the user decide.
    convertCmykExportBtn.style.display = currentPdfBytes ? 'flex' : 'none';
}
let previewZoom = 1;
let visiblePreviewPage = 1;
let pageVisibilityObserver = null;
let isPinching = false;
let pinchStartDistance = 0;
let pinchStartZoom = 1;


// Minimal JPEG SOF-marker parser: a standalone image file (not yet wrapped
// in a PDF) has no PDF structure to inspect, but its component count is a
// precise, well-defined signal — 4 components means CMYK/YCCK.
function jpegHasCmykComponents(bytes) {
    const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (data.length < 4 || data[0] !== 0xFF || data[1] !== 0xD8) return false;
    let offset = 2;
    while (offset < data.length - 1) {
        if (data[offset] !== 0xFF) { offset++; continue; }
        const marker = data[offset + 1];
        if (marker === 0xD8 || marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7)) { offset += 2; continue; }
        const isSOF = (marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCF && marker !== 0xCC);
        if (isSOF) {
            const numComponents = data[offset + 9];
            return numComponents === 4;
        }
        const segLength = (data[offset + 2] << 8) | data[offset + 3];
        if (segLength < 2) break;
        offset += 2 + segLength;
    }
    return false;
}

// Decides which preview engine to use:
// - Desktop PCs (Windows/macOS/Linux/ChromeOS) reliably render PDFs inline
//   via the browser's native plugin, so we use the original lightweight
//   iframe approach there.
// - Android, other mobile/tablet devices, and anything we can't confidently
//   identify fall back to the pdf.js canvas renderer, since embedded iframes
//   can't display PDFs on Android Chrome (and we'd rather be safe on unknown
//   devices than show a blank viewer).
function detectIsDesktopPC() {
    try {
        if (navigator.userAgentData) {
            if (typeof navigator.userAgentData.mobile === 'boolean' && navigator.userAgentData.mobile) {
                return false; // Chromium reports this device as mobile
            }
            const platform = (navigator.userAgentData.platform || '').toLowerCase();
            if (platform.includes('android')) return false;
            if (['windows', 'macos', 'linux', 'chrome os'].some(p => platform.includes(p))) return true;
        }
    } catch (e) { /* fall through to UA sniffing */ }

    const ua = navigator.userAgent || '';
    if (/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook|BB10/i.test(ua)) return false;
    if (/Windows NT|Macintosh|Mac OS X|Linux x86_64|CrOS/i.test(ua)) return true;

    return false; // Unrecognized device: default to the safer canvas renderer
}

async function updatePreview(bytes) {
    currentPdfBytes = bytes;
    const blob = new Blob([bytes], { type: 'application/pdf' });
    if (currentPdfUrl) URL.revokeObjectURL(currentPdfUrl);
    currentPdfUrl = URL.createObjectURL(blob);
    viewerMessage.style.display = 'none';

    if (detectIsDesktopPC()) {
        pdfPreviewLayout.style.display = 'none';
        pdfNavToolbar.style.display = 'none';
        pdfJsDoc = null;
        pdfPreview.style.display = 'block';
        pdfPreview.src = currentPdfUrl;
    } else {
        pdfPreview.style.display = 'none';
        pdfPreview.src = '';
        pdfPreviewLayout.style.display = 'flex';
        await loadPdfPreview(bytes);
    }

    try {
        const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        if(pdfDoc.getPageCount() > 0) {
            const page = pdfDoc.getPage(0);
            const { width, height } = page.getSize(); // exact, in points (the PDF's native unit)
            
            // Re-apply standard resolution logic dynamically on import
            if (!docResInp.value) docResInp.value = "300"; 
            const res = parseFloat(docResInp.value) || 300;
            const unit = docUnitSelect.value;
            
            docWidthInp.value = formatUnitValue(inchesToUnit(width / 72, unit, res), unit);
            docHeightInp.value = formatUnitValue(inchesToUnit(height / 72, unit, res), unit);
            
            document.getElementById('docSizeEditor').style.display = 'flex';
            
            // Set fundamental baselines on import
            updateSizeCalculations('none'); 
        }
    } catch(e) { console.error("Could not parse size.", e); }
}

// Keeps the fixed-position toolbar centered over the canvas preview area
// (excluding the thumbnail rail), since position:fixed doesn't know about
// our flex layout on its own. Re-run on resize/orientation/sidebar toggle.
function positionPdfNavToolbar() {
    if (!pdfNavToolbar || pdfNavToolbar.style.display === 'none') return;
    const rect = pdfCanvasContainer.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    pdfNavToolbar.style.left = `${rect.left + rect.width / 2}px`;
    pdfNavToolbar.style.transform = 'translateX(-50%)';
}
window.addEventListener('resize', positionPdfNavToolbar);
window.addEventListener('orientationchange', () => setTimeout(positionPdfNavToolbar, 200));
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionPdfNavToolbar);
}

// Loads a PDF via pdf.js once, then renders every page into a continuously
// scrollable column (like a native mobile PDF viewer) instead of one page
// at a time. Page position is tracked via IntersectionObserver so the
// toolbar's page counter (and the thumbnail rail's highlighted page)
// update automatically as you scroll.
async function loadPdfPreview(bytes) {
    pdfCanvasContainer.innerHTML = `
        <div class="loader-container">
            <div class="cyber-spinner"></div>
            <div class="loader-text">[ RENDERING PREVIEW... ]</div>
        </div>`;
    pdfThumbRail.innerHTML = '';
    pdfNavToolbar.style.display = 'none';

    try {
        pdfJsDoc = await pdfjsLib.getDocument({ data: bytes.slice(0) , maxImageSize: MAX_PDFJS_IMAGE_PIXELS }).promise;
        previewZoom = 1;
        visiblePreviewPage = 1;
        pdfPageCount.textContent = pdfJsDoc.numPages;
        pdfCurrentPageDisplay.textContent = '1';
        pdfZoomLevel.textContent = '100%';
        pdfNavToolbar.style.display = 'flex';
        positionPdfNavToolbar();
        await renderThumbRail();
        await renderAllPdfPages();
        positionPdfNavToolbar();
    } catch (err) {
        console.error('Preview render failed:', err);
        pdfJsDoc = null;
        pdfNavToolbar.style.display = 'none';
        pdfThumbRail.innerHTML = '';
        pdfCanvasContainer.innerHTML = `
            <div class="viewer-message">
                <h2 class="neon-text">[ PREVIEW ERROR ]</h2>
                <p>Unable to render document preview. The file may be corrupted.</p>
            </div>`;
    }
}

// Renders every page at the current zoom level into a fresh "zoom layer"
// div. Called on initial load and again after zoom changes (button click or
// pinch gesture) so pages stay crisp instead of blurring from a CSS scale.
async function renderAllPdfPages() {
    if (!pdfJsDoc) return;
    if (pageVisibilityObserver) { pageVisibilityObserver.disconnect(); pageVisibilityObserver = null; }

    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const containerWidth = (pdfCanvasContainer.clientWidth || 800) - 40;

    const zoomLayer = document.createElement('div');
    zoomLayer.id = 'pdfZoomLayer';
    zoomLayer.className = 'pdf-zoom-layer';

    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.max(containerWidth / baseViewport.width, 0.25);
        const finalScale = Math.min(fitScale * previewZoom, 4);
        const viewport = page.getViewport({ scale: finalScale });

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page-canvas';
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const wrapper = document.createElement('div');
        wrapper.className = 'pdf-page-wrapper';
        wrapper.dataset.pageNumber = i;
        wrapper.appendChild(canvas);
        zoomLayer.appendChild(wrapper);

        try {
            const ctx = canvas.getContext('2d');
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
            await page.render({ canvasContext: ctx, viewport, transform }).promise;
        } catch (err) {
            console.warn(`[Preview] page ${i} failed to render, showing placeholder:`, err);
            wrapper.innerHTML = `<div class="viewer-message" style="padding:20px;"><p class="neon-text">[ PAGE ${i}: RENDER FAILED ]</p></div>`;
        }
    }

    pdfCanvasContainer.innerHTML = '';
    pdfCanvasContainer.appendChild(zoomLayer);
    pdfZoomLevel.textContent = Math.round(previewZoom * 100) + '%';

    setupPageVisibilityTracking(zoomLayer);
}

function setupPageVisibilityTracking(zoomLayer) {
    pageVisibilityObserver = new IntersectionObserver((entries) => {
        let bestEntry = null;
        entries.forEach(entry => {
            if (entry.isIntersecting && (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)) {
                bestEntry = entry;
            }
        });
        if (bestEntry) {
            visiblePreviewPage = parseInt(bestEntry.target.dataset.pageNumber, 10);
            pdfCurrentPageDisplay.textContent = visiblePreviewPage;
            updateActiveThumb(visiblePreviewPage);
        }
    }, { root: pdfCanvasContainer, threshold: [0.25, 0.5, 0.75] });

    zoomLayer.querySelectorAll('.pdf-page-wrapper').forEach(w => pageVisibilityObserver.observe(w));
}

// Renders a small thumbnail for every page into the left-hand rail.
// Clicking a thumbnail scrolls the main preview to that page.
async function renderThumbRail() {
    if (!pdfJsDoc) return;
    pdfThumbRail.innerHTML = '';

    const thumbWidth = 70;
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);

    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: thumbWidth / baseViewport.width });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        const item = document.createElement('div');
        item.className = 'pdf-thumb-item';
        item.dataset.pageNumber = i;

        const label = document.createElement('div');
        label.className = 'pdf-thumb-label';
        label.textContent = i;

        item.appendChild(canvas);
        item.appendChild(label);
        item.addEventListener('click', () => jumpToPreviewPage(i));
        pdfThumbRail.appendChild(item);

        try {
            const ctx = canvas.getContext('2d');
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
            await page.render({ canvasContext: ctx, viewport, transform }).promise;
        } catch (err) {
            console.warn(`[Thumb rail] page ${i} thumbnail failed to render:`, err);
        }
    }

    updateActiveThumb(visiblePreviewPage);
}

function jumpToPreviewPage(pageNum) {
    const wrapper = pdfCanvasContainer.querySelector(`.pdf-page-wrapper[data-page-number="${pageNum}"]`);
    if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateActiveThumb(pageNum) {
    pdfThumbRail.querySelectorAll('.pdf-thumb-item').forEach(item => {
        const isActive = parseInt(item.dataset.pageNumber, 10) === pageNum;
        item.classList.toggle('active', isActive);
        if (isActive) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

pdfZoomInBtn.addEventListener('click', () => {
    previewZoom = Math.min(previewZoom + 0.25, 3);
    renderAllPdfPages();
});
pdfZoomOutBtn.addEventListener('click', () => {
    previewZoom = Math.max(previewZoom - 0.25, 0.5);
    renderAllPdfPages();
});

// Two-finger pinch-to-zoom: gives live CSS-transform feedback while
// pinching (cheap, instant), then commits the new zoom level and
// re-renders the actual canvases at that resolution once fingers lift,
// so the page stays sharp instead of staying blurry from the CSS scale.
function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}

pdfCanvasContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        isPinching = true;
        pinchStartDistance = getTouchDistance(e.touches);
        pinchStartZoom = previewZoom;
    }
}, { passive: true });

pdfCanvasContainer.addEventListener('touchmove', (e) => {
    if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const liveZoom = Math.min(Math.max(pinchStartZoom * (currentDistance / pinchStartDistance), 0.5), 4);
        const zoomLayer = document.getElementById('pdfZoomLayer');
        if (zoomLayer) zoomLayer.style.transform = `scale(${liveZoom / previewZoom})`;
    }
}, { passive: false });

function endPinch() {
    if (!isPinching) return;
    isPinching = false;
    const zoomLayer = document.getElementById('pdfZoomLayer');
    if (zoomLayer) {
        const match = /scale\(([^)]+)\)/.exec(zoomLayer.style.transform);
        const appliedScale = match ? parseFloat(match[1]) : 1;
        previewZoom = Math.min(Math.max(previewZoom * appliedScale, 0.5), 4);
        zoomLayer.style.transform = 'none';
    }
    renderAllPdfPages();
}

pdfCanvasContainer.addEventListener('touchend', (e) => { if (e.touches.length < 2) endPinch(); });
pdfCanvasContainer.addEventListener('touchcancel', endPinch);

async function svgToPngDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function saveWorkspaceState() {
    const items = [];
    document.querySelectorAll('.draggable-item').forEach(item => {
        items.push({
            type: item.dataset.type, left: item.style.left, top: item.style.top,
            width: item.style.width, height: item.style.height,
            fontSize: item.dataset.fontSize || '14',
            text: item.dataset.type === 'text' ? item.querySelector('.drag-text').innerText : '',
            src: item.dataset.type === 'image' ? item.dataset.src : ''
        });
    });
    undoStack.push(JSON.stringify(items));
    redoStack = []; 
}

function restoreWorkspaceState(stateStr) {
    document.querySelectorAll('.draggable-item').forEach(el => el.remove());
    JSON.parse(stateStr).forEach(data => {
        const item = createWorkspaceElementDOM(data);
        canvasWrapper.appendChild(item);
        makeInteractive(item);
    });
}

function createWorkspaceElementDOM(data) {
    const item = document.createElement('div');
    item.className = 'draggable-item';
    item.style.left = data.left; item.style.top = data.top;
    item.style.width = data.width; item.style.height = data.height;
    item.dataset.type = data.type; item.dataset.fontSize = data.fontSize || 14;

    if (data.type === 'text') {
        item.innerHTML = `
            <div class="item-controls"><span class="drag-handle">⠿ Move</span><span class="delete-btn">X</span></div>
            <div class="item-content"><div class="drag-text" contenteditable="true" style="font-size: ${data.fontSize}px; background: transparent; color: black; border-radius:2px;">${data.text || ''}</div></div>
            <div class="resizer"></div>
        `;
        item.querySelector('.drag-text').addEventListener('blur', () => saveWorkspaceState());
    } else if (data.type === 'image') {
        item.dataset.src = data.src;
        item.innerHTML = `
            <div class="item-controls"><span class="drag-handle">⠿ Move</span><span class="delete-btn">X</span></div>
            <div class="item-content"><img src="${data.src}" style="width:100%; height:100%; object-fit:contain; pointer-events:none; display:block;" /></div>
            <div class="resizer"></div>
        `;
    }
    item.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); item.remove(); saveWorkspaceState(); });
    return item;
}

applySizeBtn.addEventListener('click', async () => {
    if(!currentPdfBytes) return;
    const unit = docUnitSelect.value;
    const res = parseFloat(docResInp.value) || 300;
    const wRaw = parseFloat(docWidthInp.value);
    const hRaw = parseFloat(docHeightInp.value);
    
    if(isNaN(wRaw) || isNaN(hRaw) || wRaw <= 0 || hRaw <= 0) return alert("[ ERROR ] Invalid numeric input for size.");

    const newWPoints = unitToPoints(wRaw, unit, res);
    const newHPoints = unitToPoints(hRaw, unit, res);

    statusDisplay.innerText = '[ RESIZING DOCUMENT... ]';
    try {
        const sourceDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();
        const embeddedPages = await newDoc.embedPages(sourceDoc.getPages());

        embeddedPages.forEach((embPage) => {
            const newPage = newDoc.addPage([newWPoints, newHPoints]);
            newPage.drawPage(embPage, { x: 0, y: 0, width: newWPoints, height: newHPoints });
        });

        currentPdfBytes = await newDoc.save();
        basePdfBytes = currentPdfBytes;
        updatePreview(currentPdfBytes);
        statusDisplay.innerText = '[ RESIZE COMPLETE ]';
    } catch(e) {
        console.error(e);
        statusDisplay.innerText = '[ ERROR: RESIZE FAILED ]';
    }
});

openPdfBtn.addEventListener('click', () => openPdfInput.click());
openPdfInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        pdfLayers = {}; 
        const buffer = await file.arrayBuffer();
        
        const loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        isDocCMYK = false; // no auto-detection anymore; the CMYK export option is just always offered
        importedBaseFileName = getBaseFileName(file.name);
        
        basePdfBytes = await loadedDoc.save(); 
        updatePreview(basePdfBytes);
        updateCmykButtonVisibility();
        
        statusDisplay.innerText = '[ SYSTEM: PDF LOADED ]';
    } catch (error) { console.error('[ Open PDF ] load failed:', error); statusDisplay.innerText = '[ ERROR: LOAD FAILED ]'; }
});

combineBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    statusDisplay.innerText = `[ COMBINING ${files.length} FILES... ]`;
    pdfLayers = {}; 
    let hasRasterImages = false; 
    isDocCMYK = false;
    importedBaseFileName = getBaseFileName(files[0].name);

    try {
        let targetPdf;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const arrayBuffer = await file.arrayBuffer();
            
            if (file.type === 'application/pdf') {
                const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                if (i === 0) {
                    targetPdf = srcDoc;
                } else {
                    (await targetPdf.copyPages(srcDoc, srcDoc.getPageIndices())).forEach(p => targetPdf.addPage(p));
                }
            } else {
                if (file.type === 'image/jpeg' && jpegHasCmykComponents(new Uint8Array(arrayBuffer))) isDocCMYK = true;
                hasRasterImages = true; 
                if (!targetPdf) targetPdf = await PDFDocument.create(); 
                
                let imgData;
                if (file.type === 'image/svg+xml') imgData = await targetPdf.embedPng(await svgToPngDataUrl(file));
                else if (file.type === 'image/png') imgData = await targetPdf.embedPng(arrayBuffer);
                else imgData = await targetPdf.embedJpg(arrayBuffer);
                
                const imgDims = imgData.scale(1);
                const pdfW = (imgDims.width / 300) * 72;
                const pdfH = (imgDims.height / 300) * 72;
                
                targetPdf.addPage([pdfW, pdfH]).drawImage(imgData, { x: 0, y: 0, width: pdfW, height: pdfH });
            }
        }
        basePdfBytes = await targetPdf.save(); 
        updatePreview(basePdfBytes);
        updateCmykButtonVisibility();
        
        let statusText = hasRasterImages ? '[ MERGED: FLAT IMAGES ]' : '[ FILES MERGED ]';
        if(isDocCMYK) statusText += ' [ CMYK INTEGRITY PRESERVED ]';
        statusDisplay.innerText = statusText;
        
    } catch (err) { console.error('[ Combine Files ] merge failed:', err); statusDisplay.innerText = '[ ERROR: MERGE FAILED ]'; }
});

function saveOrgState() { orgUndoStack.push(JSON.parse(JSON.stringify(organizeState))); orgRedoStack = []; }

function renderThumbnails() {
    thumbnailGrid.innerHTML = '';
    organizeState.forEach((pageObj, index) => {
        const item = document.createElement('div');
        item.className = 'thumbnail-item'; item.draggable = true; item.dataset.stateIndex = index;
        item.innerHTML = `
            <div class="thumb-controls">
                <button class="thumb-btn rotate-ccw" title="Rotate Counter-Clockwise">↺</button>
                <button class="thumb-btn rotate-cw" title="Rotate Clockwise">↻</button>
                <button class="thumb-btn delete-thumb" title="Delete Page">🗑</button>
            </div>
            <img src="${pageObj.imgSrc}" style="transform: rotate(${pageObj.rotation}deg);" />
            <span>Page ${index + 1}</span>
        `;
        thumbnailGrid.appendChild(item);
    });
}

organizeBtn.addEventListener('click', async () => {
    if (!currentPdfBytes) return alert('[ ERROR ] Load a document first.');
    thumbnailGrid.innerHTML = '<p style="color:var(--neon-cyan); grid-column: 1/-1; text-align:center;">[ INITIALIZING PREVIEWS... ]</p>';
    organizeModal.style.display = 'flex';
    organizeState = []; orgUndoStack = []; orgRedoStack = [];

    try {
        const pdf = await pdfjsLib.getDocument({ data: currentPdfBytes.slice(0) , maxImageSize: MAX_PDFJS_IMAGE_PIXELS }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.4 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width; canvas.height = viewport.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
            organizeState.push({ originalIndex: i - 1, rotation: 0, imgSrc: canvas.toDataURL() });
        }
        saveOrgState(); renderThumbnails();
    } catch (err) { console.error(err); }
});

closeOrgBtn.addEventListener('click', () => organizeModal.style.display = 'none');

orgAddBtn.addEventListener('click', () => orgAddInput.click());
orgAddInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    statusDisplay.innerText = '[ PROCESSING INSERTION... ]';
    
    try {
        const sourceDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();

        for (const pageObj of organizeState) {
            const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageObj.originalIndex]);
            if (pageObj.rotation !== 0) copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageObj.rotation));
            newDoc.addPage(copiedPage);
        }

        const pageCount = newDoc.getPageCount();
        if (pageCount === 0) throw new Error("Document is empty.");
        const lastPage = newDoc.getPage(pageCount - 1);
        const { width: refW, height: refH } = lastPage.getSize();

        if (file.type === 'application/pdf') {
            const addedDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
            const embeddedPages = await newDoc.embedPages(addedDoc.getPages());
            
            embeddedPages.forEach((embPage) => {
                const newPage = newDoc.addPage([refW, refH]);
                const scale = Math.min(refW / embPage.width, refH / embPage.height);
                const drawW = embPage.width * scale;
                const drawH = embPage.height * scale;
                const drawX = (refW - drawW) / 2;
                const drawY = (refH - drawH) / 2;
                newPage.drawPage(embPage, { x: drawX, y: drawY, width: drawW, height: drawH });
            });
        } else {
            let img;
            if (file.type === 'image/svg+xml') img = await newDoc.embedPng(await svgToPngDataUrl(file));
            else {
                const imgBytes = await file.arrayBuffer();
                img = file.type === 'image/png' ? await newDoc.embedPng(imgBytes) : await newDoc.embedJpg(imgBytes);
            }
            
            const newPage = newDoc.addPage([refW, refH]);
            const imgDims = img.scale(1);
            const scale = Math.min(refW / imgDims.width, refH / imgDims.height);
            const drawW = imgDims.width * scale;
            const drawH = imgDims.height * scale;
            newPage.drawImage(img, { x: (refW - drawW) / 2, y: (refH - drawH) / 2, width: drawW, height: drawH });
        }

        currentPdfBytes = await newDoc.save();
        basePdfBytes = currentPdfBytes; 
        updatePreview(currentPdfBytes);
        
        organizeBtn.click(); 
        statusDisplay.innerText = '[ INSERTION SUCCESSFUL ]';

    } catch (err) {
        console.error(err);
        statusDisplay.innerText = '[ ERROR: INSERTION FAILED ]';
    } finally {
        orgAddInput.value = ''; 
    }
});

orgAddBlankBtn.addEventListener('click', async () => {
    statusDisplay.innerText = '[ ADDING BLANK PAGE... ]';
    
    try {
        const sourceDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();

        for (const pageObj of organizeState) {
            const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageObj.originalIndex]);
            if (pageObj.rotation !== 0) copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageObj.rotation));
            newDoc.addPage(copiedPage);
        }

        let refW = 595.28, refH = 841.89; 
        const pageCount = newDoc.getPageCount();
        if (pageCount > 0) {
            const size = newDoc.getPage(pageCount - 1).getSize();
            refW = size.width; refH = size.height;
        }

        newDoc.addPage([refW, refH]);
        
        currentPdfBytes = await newDoc.save();
        basePdfBytes = currentPdfBytes;
        updatePreview(currentPdfBytes);

        organizeBtn.click(); 
        statusDisplay.innerText = '[ BLANK PAGE ADDED ]';
    } catch (err) {
        console.error(err);
        statusDisplay.innerText = '[ ERROR: FAILED TO ADD PAGE ]';
    }
});

thumbnailGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb-btn');
    if (!btn) return;
    
    const item = e.target.closest('.thumbnail-item');
    const stateIndex = parseInt(item.dataset.stateIndex);

    if (btn.classList.contains('rotate-cw')) organizeState[stateIndex].rotation += 90;
    else if (btn.classList.contains('rotate-ccw')) organizeState[stateIndex].rotation -= 90;
    else if (btn.classList.contains('delete-thumb')) organizeState.splice(stateIndex, 1);
    
    saveOrgState(); renderThumbnails();
});

let draggedStateIndex = null;
thumbnailGrid.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.thumbnail-item');
    if (item) { draggedStateIndex = parseInt(item.dataset.stateIndex); setTimeout(() => item.classList.add('dragging'), 0); }
});

thumbnailGrid.addEventListener('dragover', (e) => {
    e.preventDefault();
    const hoveredItem = e.target.closest('.thumbnail-item');
    if (hoveredItem) {
        const rect = hoveredItem.getBoundingClientRect();
        const next = (e.clientX - rect.left) / (rect.right - rect.left) > 0.5;
        thumbnailGrid.insertBefore(document.querySelector('.dragging'), next ? hoveredItem.nextSibling : hoveredItem);
    }
});

thumbnailGrid.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggingEl = document.querySelector('.dragging');
    if (draggingEl && draggedStateIndex !== null) {
        draggingEl.classList.remove('dragging');
        organizeState = Array.from(document.querySelectorAll('.thumbnail-item')).map(el => organizeState[parseInt(el.dataset.stateIndex)]);
        draggedStateIndex = null;
        saveOrgState(); renderThumbnails();
    }
});

applyOrgBtn.addEventListener('click', async () => {
    if (organizeState.length === 0) return alert('[ ERROR ] Cannot apply: Document must contain at least 1 page.');
    statusDisplay.innerText = '[ COMPILING STRUCTURAL CHANGES... ]';
    
    try {
        const sourceDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();

        for (const pageObj of organizeState) {
            const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageObj.originalIndex]);
            if (pageObj.rotation !== 0) copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageObj.rotation));
            newDoc.addPage(copiedPage);
        }

        basePdfBytes = await newDoc.save();
        pdfLayers = {}; 
        updatePreview(basePdfBytes);
        organizeModal.style.display = 'none';
        statusDisplay.innerText = '[ REORGANIZATION SUCCESSFUL ]';
    } catch (error) { console.error('[ Organize ] reorg failed:', error); statusDisplay.innerText = '[ ERROR: REORG FAILED ]'; }
});

orgUndoBtn.addEventListener('click', () => {
    if (orgUndoStack.length > 1) {
        orgRedoStack.push(orgUndoStack.pop());
        organizeState = JSON.parse(JSON.stringify(orgUndoStack[orgUndoStack.length - 1]));
        renderThumbnails();
    }
});

orgRedoBtn.addEventListener('click', () => {
    if (orgRedoStack.length > 0) {
        const nextState = orgRedoStack.pop();
        orgUndoStack.push(JSON.parse(JSON.stringify(nextState)));
        organizeState = nextState;
        renderThumbnails();
    }
});

async function openWorkspace(pageNum) {
    if (!basePdfBytes) return alert("[ ERROR ] Load a document first.");
    currentEditPage = parseInt(pageNum);
    
    document.querySelectorAll('.draggable-item').forEach(el => el.remove());
    editModal.style.display = 'flex';
    statusDisplay.innerText = "[ INITIALIZING WORKSPACE... ]";

    try {
        const pdf = await pdfjsLib.getDocument({ data: basePdfBytes.slice(0) , maxImageSize: MAX_PDFJS_IMAGE_PIXELS }).promise;
        const page = await pdf.getPage(currentEditPage);
        const viewport = page.getViewport({ scale: 1.5 }); 

        editCanvas.width = viewport.width; editCanvas.height = viewport.height;
        await page.render({ canvasContext: editCanvas.getContext('2d'), viewport }).promise;
        
        if (!pdfLayers[currentEditPage]) pdfLayers[currentEditPage] = [];
        pdfLayers[currentEditPage].forEach(data => {
            const el = createWorkspaceElementDOM(data);
            canvasWrapper.appendChild(el); makeInteractive(el);
        });

        undoStack = []; redoStack = []; saveWorkspaceState();
        statusDisplay.innerText = "[ WORKSPACE READY ]";
    } catch (err) { console.error("Workspace error", err); }
}

function makeInteractive(el) {
    const handle = el.querySelector('.drag-handle'), resizer = el.querySelector('.resizer');

    el.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (e.target.classList.contains('resizer') || e.target.classList.contains('delete-btn')) return;
        document.querySelectorAll('.draggable-item').forEach(item => item.classList.remove('selected'));
        el.classList.add('selected');
    });

    const dragTarget = el.dataset.type === 'image' ? el : handle;
    dragTarget.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('delete-btn')) return;
        if (el.dataset.type === 'text' && e.target.classList.contains('drag-text') && el.classList.contains('selected')) return; 
        
        e.preventDefault(); e.stopPropagation();
        document.querySelectorAll('.draggable-item').forEach(item => item.classList.remove('selected'));
        el.classList.add('selected');

        let startX = e.clientX, startY = e.clientY;
        let initialLeft = parseFloat(el.style.left) || 0, initialTop = parseFloat(el.style.top) || 0;

        function onMouseMove(moveEvent) { el.style.left = `${initialLeft + (moveEvent.clientX - startX)}px`; el.style.top = `${initialTop + (moveEvent.clientY - startY)}px`; }
        function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); saveWorkspaceState(); }

        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    });

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault(); e.stopPropagation();
        let startX = e.clientX, startY = e.clientY;
        let initialWidth = el.offsetWidth, initialHeight = el.offsetHeight;

        function onMouseMove(moveEvent) { el.style.width = `${initialWidth + (moveEvent.clientX - startX)}px`; el.style.height = `${initialHeight + (moveEvent.clientY - startY)}px`; }
        function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); saveWorkspaceState(); }

        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    });
}

document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.draggable-item') && !e.target.closest('.workspace-toolbar') && !e.target.closest('.tool-btn')) {
        document.querySelectorAll('.draggable-item').forEach(item => item.classList.remove('selected'));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('drag-text')) {
        return; 
    }
    if (e.key === 'Enter') {
        document.querySelectorAll('.draggable-item').forEach(item => {
            item.classList.remove('selected');
            const innerText = item.querySelector('.drag-text');
            if (innerText) innerText.blur();
        });
    }
});

if (globalTrashBtn) globalTrashBtn.addEventListener('click', () => {
    const selectedItem = document.querySelector('.draggable-item.selected');
    if (selectedItem) { selectedItem.remove(); saveWorkspaceState(); } 
    else alert("[ ERROR ] Target unselected. Select text/image node first.");
});

if (undoBtn) undoBtn.addEventListener('click', () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        restoreWorkspaceState(undoStack[undoStack.length - 1]);
    }
});

if (redoBtn) redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(nextState); restoreWorkspaceState(nextState);
    }
});

editPdfBtn.addEventListener('click', () => {
    if (!basePdfBytes) return alert("[ ERROR ] Load a document first.");
    const pageNum = prompt("Input Target Page Number:", "1");
    if (!pageNum) return;
    
    openWorkspace(pageNum).then(() => {
        const item = createWorkspaceElementDOM({ type: 'text', left: '50px', top: '50px', width: '220px', height: '40px', fontSize: 16, text: 'Type text here...' });
        canvasWrapper.appendChild(item); makeInteractive(item); saveWorkspaceState();
    });
});

attachBtn.addEventListener('click', () => {
    if (!basePdfBytes) return alert("[ ERROR ] Load a document first.");
    attachInput.click();
});

attachInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const pageNum = prompt("Input Target Page Number:", "1");
    if (!pageNum) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
        let srcData = ev.target.result;
        if (file.type === 'image/svg+xml') srcData = await svgToPngDataUrl(file);

        await openWorkspace(pageNum);
        const item = createWorkspaceElementDOM({ type: 'image', left: '50px', top: '50px', width: '160px', height: '160px', src: srcData });
        canvasWrapper.appendChild(item); makeInteractive(item); saveWorkspaceState();
        attachInput.value = ''; 
    };
    reader.readAsDataURL(file);
});

applyEditsBtn.addEventListener('click', async () => {
    statusDisplay.innerText = "[ PROCESSING OVERLAYS... ]";
    try {
        const pdfDoc = await PDFDocument.load(basePdfBytes, { ignoreEncryption: true });
        pdfLayers[currentEditPage] = [];
        document.querySelectorAll('.draggable-item').forEach(item => {
            pdfLayers[currentEditPage].push({
                type: item.dataset.type, left: item.style.left, top: item.style.top,
                width: item.style.width, height: item.style.height, fontSize: parseFloat(item.dataset.fontSize) || 14,
                text: item.dataset.type === 'text' ? item.querySelector('.drag-text').innerText : '',
                src: item.dataset.type === 'image' ? item.dataset.src : ''
            });
        });

        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
            const layers = pdfLayers[i + 1];
            if (!layers || layers.length === 0) continue;

            const page = pages[i], pdfSize = page.getSize();
            const pageCanvasW = pdfSize.width * 1.5, pageCanvasH = pdfSize.height * 1.5;

            for (const data of layers) {
                const relX = (parseFloat(data.left) || 0) / pageCanvasW, relY = (parseFloat(data.top) || 0) / pageCanvasH;
                const relW = (parseFloat(data.width) || 0) / pageCanvasW, relH = (parseFloat(data.height) || 0) / pageCanvasH;

                const pdfX = relX * pdfSize.width, pdfW = relW * pdfSize.width, pdfH = relH * pdfSize.height;
                const pdfTopY = pdfSize.height - (relY * pdfSize.height), pdfY = pdfTopY - pdfH;

                if (data.type === 'text') {
                    const pdfFontSize = data.fontSize / 1.5; 
                    
                    const textColor = isDocCMYK ? cmyk(0, 0, 0, 1) : rgb(0, 0, 0);

                    page.drawText(data.text, { 
                        x: pdfX + (4 / pageCanvasW) * pdfSize.width, 
                        y: pdfTopY - pdfFontSize - (4 / pageCanvasH) * pdfSize.height, 
                        size: pdfFontSize, 
                        color: textColor,
                        maxWidth: pdfW,
                        lineHeight: pdfFontSize * 1.2
                    });
                } else if (data.type === 'image') {
                    let img = data.src.includes('image/jpeg') ? await pdfDoc.embedJpg(data.src) : await pdfDoc.embedPng(data.src);
                    let boxRatio = pdfW / pdfH, imgRatio = img.width / img.height;
                    let drawW = pdfW, drawH = pdfH;
                    
                    if (boxRatio > imgRatio) drawW = pdfH * imgRatio; else drawH = pdfW / imgRatio;
                    page.drawImage(img, { x: pdfX + (pdfW - drawW) / 2, y: pdfY + (pdfH - drawH) / 2, width: drawW, height: drawH });
                }
            }
        }
        updatePreview(await pdfDoc.save()); editModal.style.display = 'none'; statusDisplay.innerText = "[ MODIFICATIONS APPLIED ]";
    } catch (err) { statusDisplay.innerText = "[ ERROR: APPLY FAILED ]"; }
});

closeEditModalBtn.addEventListener('click', () => editModal.style.display = 'none');

splitBtn.addEventListener('click', async () => {
    if (!currentPdfBytes) return statusDisplay.innerText = '[ ERROR ] Load a document first.';
    const chunkSize = parseInt(prompt('Input chunk size (pages per split file):', '1'), 10);
    if (isNaN(chunkSize) || chunkSize <= 0) return statusDisplay.innerText = '[ ERROR ] Invalid numeric input.';

    statusDisplay.innerText = '[ SPLITTING DOCUMENT... ]';
    try {
        const sourcePdfDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true }); 
        const totalPages = sourcePdfDoc.getPageCount();
        let partCounter = 1;

        for (let i = 0; i < totalPages; i += chunkSize) {
            const splitPdfDoc = await PDFDocument.create(), pageIndices = [];
            for (let j = i; j < Math.min(i + chunkSize, totalPages); j++) pageIndices.push(j);
            (await splitPdfDoc.copyPages(sourcePdfDoc, pageIndices)).forEach(page => splitPdfDoc.addPage(page));

            const splitUrl = URL.createObjectURL(new Blob([await splitPdfDoc.save()], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = splitUrl; link.download = `Spiokoks_Doc_Part_${partCounter++}.pdf`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(splitUrl), 100);
        }
        statusDisplay.innerText = `[ SPLIT SUCCESS: ${partCounter - 1} PARTS ]`;
    } catch (error) { console.error('[ Split ] split failed:', error); statusDisplay.innerText = '[ ERROR: SPLIT FAILED ]'; }
});

exportBtn.addEventListener('click', () => {
    if (!currentPdfUrl) return alert('[ ERROR ] No document to export.');
    
    exportModal.style.display = 'flex';
    statusDisplay.innerText = '[ COMPILING EXPORT FILE... ]';

    setTimeout(() => {
        const link = document.createElement('a');
        link.href = currentPdfUrl; 
        link.download = `${importedBaseFileName}_Combined.pdf`;
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
        
        exportModal.style.display = 'none';
        statusDisplay.innerText = '[ EXPORT OPERATIONAL COMPLETE ]';
    }, 1500);
});

// Rasterizes each page via pdf.js and remaps every pixel through the CMYK
// gamut before re-flattening it back to an image. Note: browsers have no
// native way to author a PDF with a true /DeviceCMYK colorspace tag on live
// vector content (there's no in-browser CMYK JPEG encoder), so this bakes
// each page down to a print-safe-color raster image instead — the same
// image-embedding technique already used by the Combine Files flow.
async function convertPdfPagesToCmykRaster(bytes) {
    const srcPdf = await pdfjsLib.getDocument({ data: bytes.slice(0) , maxImageSize: MAX_PDFJS_IMAGE_PIXELS }).promise;
    const outDoc = await PDFDocument.create();

    const targetDpi = 300; // print-quality baseline (PDF points are 72/inch)
    const maxCanvasDim = 4500; // safety cap so oversized pages don't blow past mobile canvas/memory limits

    for (let i = 1; i <= srcPdf.numPages; i++) {
        const page = await srcPdf.getPage(i);
        const basePageSize = page.getViewport({ scale: 1 });

        let renderScale = targetDpi / 72;
        const largestProjectedDim = Math.max(basePageSize.width, basePageSize.height) * renderScale;
        if (largestProjectedDim > maxCanvasDim) {
            renderScale *= maxCanvasDim / largestProjectedDim;
        }
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let p = 0; p < data.length; p += 4) {
            const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
            const k = 1 - Math.max(r, g, b);
            const c = k < 1 ? (1 - r - k) / (1 - k) : 0;
            const m = k < 1 ? (1 - g - k) / (1 - k) : 0;
            const y = k < 1 ? (1 - b - k) / (1 - k) : 0;
            data[p]     = Math.round(255 * (1 - c) * (1 - k));
            data[p + 1] = Math.round(255 * (1 - m) * (1 - k));
            data[p + 2] = Math.round(255 * (1 - y) * (1 - k));
        }
        ctx.putImageData(imageData, 0, 0);

        // PNG instead of JPEG: lossless, so the CMYK color remap is the only
        // change applied to the pixels — no compression artifacts stacked
        // on top of it.
        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
        const embeddedImg = await outDoc.embedPng(pngBytes);

        const newPage = outDoc.addPage([basePageSize.width, basePageSize.height]);
        newPage.drawImage(embeddedImg, { x: 0, y: 0, width: basePageSize.width, height: basePageSize.height });
    }

    return outDoc.save();
}

convertCmykExportBtn.addEventListener('click', async () => {
    if (!currentPdfBytes) return alert('[ ERROR ] No document to export.');

    exportModal.style.display = 'flex';
    statusDisplay.innerText = '[ CONVERTING TO CMYK... ]';

    try {
        const cmykBytes = await convertPdfPagesToCmykRaster(currentPdfBytes);
        const cmykUrl = URL.createObjectURL(new Blob([cmykBytes], { type: 'application/pdf' }));

        const link = document.createElement('a');
        link.href = cmykUrl;
        link.download = `${importedBaseFileName}_Combined_CMYK.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(cmykUrl);

        exportModal.style.display = 'none';
        statusDisplay.innerText = '[ CMYK EXPORT COMPLETE ]';
    } catch (err) {
        console.error(err);
        exportModal.style.display = 'none';
        statusDisplay.innerText = '[ ERROR: CMYK CONVERSION FAILED ]';
    }
});