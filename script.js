// SUPABASE INITIALIZATION (Replace with your actual keys!)
const SUPABASE_URL = 'https://gxggetfxkzhegqehcjzv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z2dldGZ4a3poZWdxZWhjanp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTAxNzQsImV4cCI6MjA5Nzc4NjE3NH0.iNqyqCC3ZSrKhOW2JrfmL7iN6MK7J5U_2XXZbxJPGEw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Access Libraries (CMYK included)
const { PDFDocument, rgb, cmyk, degrees, PDFName, drawImage } = PDFLib;
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
const cropToGuidesBtn = document.getElementById('cropToGuidesBtn');
const bleedInp = document.getElementById('bleedInp');
const psdModeModal = document.getElementById('psdModeModal');
const psdModeModalMessage = document.getElementById('psdModeModalMessage');
const psdModeConvertBtn = document.getElementById('psdModeConvertBtn');
const psdModeThumbBtn = document.getElementById('psdModeThumbBtn');
const psdModeCancelBtn = document.getElementById('psdModeCancelBtn');
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

const workspaceContainer = document.getElementById('workspaceContainer');
const rulerCorner = document.getElementById('rulerCorner');
const rulerHorizontal = document.getElementById('rulerHorizontal');
const rulerVertical = document.getElementById('rulerVertical');
const toggleRulerBtn = document.getElementById('toggleRulerBtn');
const clearGuidesBtn = document.getElementById('clearGuidesBtn');

const viewerContainer = document.getElementById('viewerContainer');
const viewerContent = document.getElementById('viewerContent');
const mainRulerCorner = document.getElementById('mainRulerCorner');
const mainRulerHorizontal = document.getElementById('mainRulerHorizontal');
const mainRulerVertical = document.getElementById('mainRulerVertical');
const mainGuideLayer = document.getElementById('mainGuideLayer');

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
let editViewportScale = 1.5; // must match the scale used by page.getViewport() in openWorkspace, so ruler ticks line up with the rendered page
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

    // The in-app pdf.js canvas renderer is used for every platform (rather than handing off to
    // the browser's native PDF viewer on desktop) so the ruler/guides always have real page
    // geometry, at a known zoom, to line up against.
    if (pdfCanvasContainer) pdfCanvasContainer.querySelectorAll('.pdf-page-wrapper .guide-line').forEach(g => g.remove());
    pdfPreview.style.display = 'none';
    pdfPreview.src = '';
    pdfPreviewLayout.style.display = 'flex';
    await loadPdfPreview(bytes);

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
        wrapper.dataset.scale = finalScale; // CSS px per PDF point, used by the main ruler
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
    requestAnimationFrame(() => { resizeMainRulerCanvases(); drawMainRulers(); });
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
            drawMainRulers();
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

// Classifies an incoming file for the import pipeline. Browsers frequently report an empty
// or generic `file.type` for TIFF/PSD, so the file extension is used as the source of truth.
function getFileKind(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (file.type === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (file.type === 'image/svg+xml' || ext === 'svg') return 'svg';
    if (ext === 'tif' || ext === 'tiff' || file.type === 'image/tiff') return 'tiff';
    if (ext === 'psd' || file.type === 'image/vnd.adobe.photoshop') return 'psd';
    if (file.type === 'image/png' || ext === 'png') return 'png';
    return 'jpeg';
}

// Decodes a TIFF file (via UTIF.js) onto a canvas and returns a PNG data URL, since neither
// <img> tags nor pdf-lib can consume raw TIFF bytes directly.
async function tiffToPngDataUrl(file) {
    const buffer = await file.arrayBuffer();
    const ifds = UTIF.decode(buffer);
    UTIF.decodeImage(buffer, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);
    const canvas = document.createElement('canvas');
    canvas.width = ifds[0].width; canvas.height = ifds[0].height;
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba), ifds[0].width, ifds[0].height), 0, 0);
    return canvas.toDataURL('image/png');
}

// Decodes a PSD file (via ag-psd) and returns the flattened composite image as a PNG data URL.
// Layer structure is not preserved — only the merged, visible-to-the-eye result is imported.
// ag-psd (the PSD decoding library) hard-codes an allowlist of "supported" color modes —
// Bitmap, Grayscale, RGB, Indexed — and refuses to read anything else, even though it actually
// already implements CMYK->RGB conversion for the flattened composite image internally; CMYK is
// just excluded from the allowlist. Rather than hosting a modified copy of the library, we fetch
// the real one at first use and patch that one line before executing it, so CMYK PSDs (very
// common in print production) load normally. If the library's source ever changes and the patch
// no longer applies, this fails silently back to the library's original (RGB-only) behavior.
let agPsdLoadPromise = null;
function ensurePatchedAgPsd() {
    if (window.agPsd) return Promise.resolve(window.agPsd);
    if (agPsdLoadPromise) return agPsdLoadPromise;
    agPsdLoadPromise = fetch('https://cdn.jsdelivr.net/npm/ag-psd@31.0.2/dist/bundle.js')
        .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
        .then(src => {
            const target = 'exports.supportedColorModes = [0 /* ColorMode.Bitmap */, 1 /* ColorMode.Grayscale */, 3 /* ColorMode.RGB */, 2 /* ColorMode.Indexed */];';
            const patched = src.includes(target)
                ? src.replace(target, 'exports.supportedColorModes = [0, 1, 3, 2, 4 /* CMYK, patched in at runtime */];')
                : src;
            if (patched === src) console.warn('[ PSD ] ag-psd CMYK patch target not found (library may have updated) — CMYK PSDs may fail to decode.');
            const scriptEl = document.createElement('script');
            scriptEl.text = patched;
            document.head.appendChild(scriptEl);
            if (!window.agPsd) throw new Error('ag-psd failed to initialize');
            return window.agPsd;
        });
    return agPsdLoadPromise;
}

// Last-resort fallback for PSD color modes ag-psd genuinely can't decode at all (Lab, Duotone,
// Multichannel — all rare in practice). Rather than failing the import outright, this hand-parses
// just enough of the PSD's binary layout to pull out its embedded low-res preview thumbnail
// (image resource 1036 or 1033, a plain embedded JPEG) and uses that instead. Lower quality than
// a full decode, but keeps the import from failing entirely. Returns null if no thumbnail exists,
// the file isn't a PSD, or it's the large-document (PSB) variant this quick parser doesn't handle.
async function extractPsdThumbnailDataUrl(buffer) {
    try {
        const view = new DataView(buffer);
        if (String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)) !== '8BPS') return null;
        if (view.getUint16(4) !== 1) return null; // PSB (large document format) not handled here

        let offset = 26; // fixed-size file header
        offset += 4 + view.getUint32(offset); // skip Color Mode Data section
        const resSectionLen = view.getUint32(offset); offset += 4;
        const resEnd = offset + resSectionLen;

        let thumbBytes = null;
        while (offset < resEnd - 8) {
            if (String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3)) !== '8BIM') break;
            offset += 4;
            const resId = view.getUint16(offset); offset += 2;
            const nameLen = view.getUint8(offset);
            let nameFieldTotal = 1 + nameLen;
            if (nameFieldTotal % 2 !== 0) nameFieldTotal += 1;
            offset += nameFieldTotal;
            const dataSize = view.getUint32(offset); offset += 4;
            const dataStart = offset;

            if ((resId === 1036 || resId === 1033) && dataSize > 28) {
                const format = view.getUint32(dataStart);
                if (format === 1) { // kJpegRGB
                    const candidate = new Uint8Array(buffer, dataStart + 28, dataSize - 28);
                    if (resId === 1036 || !thumbBytes) thumbBytes = candidate; // prefer the newer 1036 resource
                }
            }
            offset += dataSize + (dataSize % 2);
        }
        if (!thumbBytes) return null;

        const url = URL.createObjectURL(new Blob([thumbBytes], { type: 'image/jpeg' }));
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('embedded thumbnail failed to decode')); };
            img.src = url;
        });
    } catch (e) {
        return null;
    }
}

const PSD_COLOR_MODE_NAMES = { 0: 'Bitmap', 1: 'Grayscale', 2: 'Indexed', 3: 'RGB', 4: 'CMYK', 7: 'Multichannel', 8: 'Duotone', 9: 'Lab' };

function readPsdHeaderInfo(buffer) {
    const view = new DataView(buffer);
    if (String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)) !== '8BPS') return null;
    return {
        version: view.getUint16(4),
        channelsCount: view.getUint16(12),
        height: view.getUint32(14),
        width: view.getUint32(18),
        bitsPerChannel: view.getUint16(22),
        colorMode: view.getUint16(24),
    };
}

// Shows the PSD color-mode warning modal and resolves to the user's choice: 'convert' for a
// full-resolution best-effort conversion, 'thumbnail' for the fast low-res embedded preview, or
// 'cancel' to skip importing the file.
// Shows the PSD warning modal with configurable message/button text and resolves to whichever
// choice's `value` the user clicked ('convert'/'thumbnail'/'cancel' for unsupported color modes,
// or 'cmyk'/'rgb'/'cancel' for the CMYK preserve-vs-convert prompt below).
function promptPsdChoice(message, buttonLabels) {
    psdModeModalMessage.textContent = message;
    psdModeConvertBtn.textContent = buttonLabels.primary;
    psdModeThumbBtn.textContent = buttonLabels.secondary;
    psdModeCancelBtn.textContent = buttonLabels.cancel;
    psdModeModal.style.display = 'flex';

    return new Promise((resolve) => {
        function cleanup(result) {
            psdModeModal.style.display = 'none';
            psdModeConvertBtn.removeEventListener('click', onPrimary);
            psdModeThumbBtn.removeEventListener('click', onSecondary);
            psdModeCancelBtn.removeEventListener('click', onCancel);
            resolve(result);
        }
        function onPrimary() { cleanup(buttonLabels.primaryValue); }
        function onSecondary() { cleanup(buttonLabels.secondaryValue); }
        function onCancel() { cleanup('cancel'); }
        psdModeConvertBtn.addEventListener('click', onPrimary);
        psdModeThumbBtn.addEventListener('click', onSecondary);
        psdModeCancelBtn.addEventListener('click', onCancel);
    });
}

function promptPsdModeChoice(modeName) {
    const messages = {
        Lab: "This PSD uses Lab color mode, which isn't natively supported. A full-resolution conversion is possible using standard Lab\u2192RGB color-science math, and should look very close to the original \u2014 though it may not exactly match Photoshop's own rendering pixel-for-pixel.",
        Duotone: "This PSD uses Duotone color mode, which isn't natively supported. Photoshop stores its duotone ink colors and curves in a proprietary format this app can't reliably read, so a full-resolution conversion will render as accurate grayscale (correct tone and detail) without the duotone ink tint.",
        Multichannel: "This PSD uses Multichannel color mode, which has no single defined color space \u2014 its channels can represent arbitrary spot colors. A full-resolution conversion can render the first channel as an approximate grayscale preview, but it won't be color-accurate.",
    };
    const message = messages[modeName]
        || `This PSD uses ${modeName} color mode, which isn't natively supported. A full-resolution conversion may be attempted, but results aren't guaranteed to be accurate.`;
    return promptPsdChoice(message, {
        primary: '⚡ Convert at Full Resolution', primaryValue: 'convert',
        secondary: 'Use Low-Res Thumbnail Instead', secondaryValue: 'thumbnail',
        cancel: 'Cancel This Import',
    });
}

// Asks whether a CMYK PSD's original CMYK data should be preserved untouched (embedded as a
// native DeviceCMYK image, no RGB round-trip at all) or converted to RGB as usual.
function promptPsdCmykChoice() {
    const message = "This PSD is in CMYK color mode. Its original CMYK ink values can be preserved exactly \u2014 embedded directly into the PDF as native CMYK, with no RGB conversion at any point \u2014 which is usually best for print. Or it can be converted to RGB instead, which is more broadly viewable but is a lossy, non-reversible conversion.";
    return promptPsdChoice(message, {
        primary: '\u2713 Keep Original CMYK (No Conversion)', primaryValue: 'cmyk',
        secondary: 'Convert to RGB Instead', secondaryValue: 'rgb',
        cancel: 'Cancel This Import',
    });
}

// PackBits/RLE decompression as used by the PSD composite image data section: decodes
// `rowByteCounts.length` compressed rows (starting at byte `offset` in `view`), each expanding
// to `rowByteLength` bytes. Returns the decoded rows plus the buffer offset just past them.
function decodePackBitsRows(view, offset, rowByteCounts, rowByteLength) {
    const rows = [];
    for (let r = 0; r < rowByteCounts.length; r++) {
        const compLen = rowByteCounts[r];
        const out = new Uint8Array(rowByteLength);
        let outPos = 0, inPos = offset;
        const inEnd = offset + compLen;
        while (inPos < inEnd && outPos < rowByteLength) {
            const n = view.getInt8(inPos); inPos++;
            if (n >= 0) {
                const count = n + 1;
                for (let k = 0; k < count && inPos < inEnd; k++) out[outPos++] = view.getUint8(inPos++);
            } else if (n !== -128) {
                const count = 1 - n;
                const val = view.getUint8(inPos); inPos++;
                for (let k = 0; k < count; k++) out[outPos++] = val;
            }
        }
        rows.push(out);
        offset += compLen;
    }
    return { rows, endOffset: offset };
}

// Hand-parses a PSD's global/composite image data at full resolution, bypassing ag-psd
// entirely (it has no decode path at all for Lab/Duotone/Multichannel). Returns one raw
// 8-bit-per-sample Uint8Array plane per channel, in file channel order.
function decodePsdRawComposite(buffer) {
    const view = new DataView(buffer);
    if (String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)) !== '8BPS') throw new Error('Not a PSD file.');
    if (view.getUint16(4) !== 1) throw new Error('Large document format (PSB) is not supported for full-resolution conversion.');

    const channelsCount = view.getUint16(12);
    const height = view.getUint32(14);
    const width = view.getUint32(18);
    const bitsPerChannel = view.getUint16(22);
    const colorMode = view.getUint16(24);
    if (bitsPerChannel !== 8) throw new Error(`Only 8-bit-per-channel PSDs are supported for full-resolution conversion (this file is ${bitsPerChannel}-bit).`);

    let offset = 26;
    offset += 4 + view.getUint32(offset); // skip Color Mode Data section
    offset += 4 + view.getUint32(offset); // skip Image Resources section
    offset += 4 + view.getUint32(offset); // skip Layer & Mask Information section

    const compression = view.getUint16(offset); offset += 2;
    const planes = [];

    if (compression === 0) {
        for (let c = 0; c < channelsCount; c++) {
            planes.push(new Uint8Array(buffer.slice(offset, offset + width * height)));
            offset += width * height;
        }
    } else if (compression === 1) {
        const totalRows = height * channelsCount;
        const rowByteCounts = [];
        for (let r = 0; r < totalRows; r++) { rowByteCounts.push(view.getUint16(offset)); offset += 2; }
        for (let c = 0; c < channelsCount; c++) {
            const channelRowCounts = rowByteCounts.slice(c * height, (c + 1) * height);
            const { rows, endOffset } = decodePackBitsRows(view, offset, channelRowCounts, width);
            offset = endOffset;
            const plane = new Uint8Array(width * height);
            for (let r = 0; r < height; r++) plane.set(rows[r], r * width);
            planes.push(plane);
        }
    } else {
        throw new Error(`Unsupported compression type (${compression}) for full-resolution conversion.`);
    }

    return { width, height, colorMode, channelsCount, planes };
}

// Standard Lab (D50, matching Photoshop's default Lab working space) -> sRGB conversion.
function labPlanesToRgbaCanvas(width, height, planes) {
    const L = planes[0], A = planes[1], B = planes[2];
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    const out = imageData.data;
    const Xn = 0.9642, Yn = 1.0, Zn = 0.8249; // D50 white point
    const finv = (t) => (t * t * t > 0.008856) ? t * t * t : (t - 16 / 116) / 7.787;
    const gamma = (c) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;

    for (let i = 0; i < width * height; i++) {
        const l = (L[i] / 255) * 100;
        const a = A[i] - 128;
        const b = B[i] - 128;
        const fy = (l + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
        const X = Xn * finv(fx), Y = Yn * finv(fy), Z = Zn * finv(fz);
        let r = 3.1338561 * X - 1.6168667 * Y - 0.4906146 * Z;
        let g = -0.9787684 * X + 1.9161415 * Y + 0.0334540 * Z;
        let bl = 0.0719453 * X - 0.2289914 * Y + 1.4052427 * Z;
        r = gamma(r); g = gamma(g); bl = gamma(bl);
        const p = i * 4;
        out[p] = Math.round(Math.min(1, Math.max(0, r)) * 255);
        out[p + 1] = Math.round(Math.min(1, Math.max(0, g)) * 255);
        out[p + 2] = Math.round(Math.min(1, Math.max(0, bl)) * 255);
        out[p + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Duotone's proprietary ink/curve data isn't reliably parseable, so its single tone channel is
// rendered as accurate full-resolution grayscale instead (correct tone and detail, no ink tint).
// The same single-channel-to-grayscale path also serves as the Multichannel approximation.
function grayscalePlaneToRgbaCanvas(width, height, plane) {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    const out = imageData.data;
    for (let i = 0; i < width * height; i++) {
        const v = plane[i];
        const p = i * 4;
        out[p] = v; out[p + 1] = v; out[p + 2] = v; out[p + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

async function convertUnsupportedPsdModeToPngDataUrl(buffer, colorMode) {
    const { width, height, planes } = decodePsdRawComposite(buffer);
    let canvas;
    if (colorMode === 9) canvas = labPlanesToRgbaCanvas(width, height, planes);       // Lab
    else if (colorMode === 8) canvas = grayscalePlaneToRgbaCanvas(width, height, planes[0]); // Duotone
    else if (colorMode === 7) canvas = grayscalePlaneToRgbaCanvas(width, height, planes[0]); // Multichannel
    else throw new Error(`Color mode ${colorMode} has no full-resolution conversion path.`);
    return canvas.toDataURL('image/png');
}

async function psdToPngDataUrl(file) {
    const buffer = await file.arrayBuffer();
    try {
        const agPsdLib = await ensurePatchedAgPsd();
        const psd = agPsdLib.readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });
        return psd.canvas.toDataURL('image/png');
    } catch (err) {
        const header = readPsdHeaderInfo(buffer);
        const unsupportedModeWithConversion = header && [7, 8, 9].includes(header.colorMode); // Multichannel, Duotone, Lab

        if (unsupportedModeWithConversion) {
            const modeName = PSD_COLOR_MODE_NAMES[header.colorMode];
            const choice = await promptPsdModeChoice(modeName);
            if (choice === 'cancel') throw new Error(`Import of "${file.name}" was cancelled.`);
            if (choice === 'convert') {
                try {
                    return await convertUnsupportedPsdModeToPngDataUrl(buffer, header.colorMode);
                } catch (convertErr) {
                    console.warn('[ PSD ] Full-resolution conversion failed, falling back to embedded thumbnail:', convertErr);
                }
            }
        } else {
            console.warn('[ PSD ] Full decode failed, trying embedded preview thumbnail instead:', err);
        }

        const thumbDataUrl = await extractPsdThumbnailDataUrl(buffer);
        if (!thumbDataUrl) throw new Error(`Could not read this PSD file (${err.message || err}). Its color mode isn't supported, and no embedded preview thumbnail was found.`);
        return thumbDataUrl;
    }
}

// Decodes a CMYK PSD's raw composite channels (bypassing ag-psd's RGB conversion entirely) and
// registers them directly in `pdfDoc` as a native DeviceCMYK image XObject — the original ink
// values pass straight through to the PDF, with no RGB round-trip at any point. Returns a
// lightweight descriptor (not a real pdf-lib PDFImage) meant to be drawn via drawImageAny().
function embedRawCmykPsdIntoPdf(pdfDoc, buffer) {
    const { width, height, colorMode, planes } = decodePsdRawComposite(buffer);
    if (colorMode !== 4) throw new Error('Not a CMYK-mode PSD.');

    // PSD channel bytes are stored inverted (255 = no ink, 0 = full ink, so each channel reads
    // like a grayscale "how much white is left" preview); PDF's DeviceCMYK wants the opposite
    // (0 = no ink, max = full ink), so each sample is inverted on the way in.
    const [C, M, Y, K] = planes;
    const n = width * height;
    const interleaved = new Uint8Array(n * 4);
    for (let i = 0; i < n; i++) {
        const p = i * 4;
        interleaved[p] = 255 - C[i];
        interleaved[p + 1] = 255 - M[i];
        interleaved[p + 2] = 255 - Y[i];
        interleaved[p + 3] = 255 - K[i];
    }

    const stream = pdfDoc.context.flateStream(interleaved, {
        Type: 'XObject', Subtype: 'Image', Width: width, Height: height,
        ColorSpace: 'DeviceCMYK', BitsPerComponent: 8,
    });
    const ref = pdfDoc.context.register(stream);
    return { rawCmyk: true, ref, width, height };
}

// Draws either a normal pdf-lib PDFImage (via the usual page.drawImage) or one of our raw
// DeviceCMYK image descriptors from embedRawCmykPsdIntoPdf (via the same low-level XObject +
// content-stream operators page.drawImage uses internally, since it only accepts real PDFImages).
function drawImageAny(page, img, opts) {
    if (img && img.rawCmyk) {
        const xObjectKey = page.node.newXObject('Image', img.ref);
        const contentStream = page.getContentStream();
        contentStream.push(...drawImage(xObjectKey, {
            x: opts.x, y: opts.y, width: opts.width, height: opts.height,
            rotate: degrees(0), xSkew: degrees(0), ySkew: degrees(0),
        }));
    } else {
        page.drawImage(img, opts);
    }
}

// Used by the page-level PSD import flows (Combine Files, Organize \u2192 Insert File). For a
// CMYK PSD, offers the choice to preserve its original CMYK data untouched; otherwise (or if
// that's declined) falls back to the normal RGB conversion path via psdToPngDataUrl. Returns
// either a raw CMYK descriptor (already registered in `pdfDoc`) or a PNG data URL string.
async function importPsdForPageEmbedding(pdfDoc, file) {
    const buffer = await file.arrayBuffer();
    const header = readPsdHeaderInfo(buffer);

    if (header && header.colorMode === 4) {
        const choice = await promptPsdCmykChoice();
        if (choice === 'cancel') throw new Error(`Import of "${file.name}" was cancelled.`);
        if (choice === 'cmyk') {
            try {
                return embedRawCmykPsdIntoPdf(pdfDoc, buffer);
            } catch (err) {
                console.warn('[ PSD ] Raw CMYK embed failed, falling back to RGB conversion:', err);
            }
        }
    }
    return await psdToPngDataUrl(file);
}

// Normalizes any supported raster/vector file into a PNG data URL ready for pdf-lib's embedPng,
// or returns null for PDFs (which are handled separately) or already-JPEG-embeddable files.
async function rasterFileToPngDataUrlIfNeeded(file, kind) {
    if (kind === 'svg') return svgToPngDataUrl(file);
    if (kind === 'tiff') return tiffToPngDataUrl(file);
    if (kind === 'psd') return psdToPngDataUrl(file);
    return null; // png/jpeg are embedded directly from their raw bytes
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

// Crops every page in the document down to a single rectangle, defined by 4 ruler guides
// (2 horizontal marking top/bottom, 2 vertical marking left/right) placed against page 1 in
// the main preview. The rectangle is measured in real PDF points using page 1's own geometry,
// then applied identically to every page.
cropToGuidesBtn.addEventListener('click', async () => {
    if (!currentPdfBytes) return alert('[ ERROR ] No document is open.');

    const pageEl = pdfCanvasContainer.querySelector('.pdf-page-wrapper[data-page-number="1"]');
    if (!pageEl) return alert('[ ERROR ] Could not locate page 1 in the preview to measure guides against.');

    const allGuides = Array.from(pageEl.querySelectorAll(':scope > .guide-line'));
    const horizontals = allGuides.filter(g => g.classList.contains('guide-h'));
    const verticals = allGuides.filter(g => g.classList.contains('guide-v'));

    if (allGuides.length === 0) {
        return alert('[ ERROR ] No ruler guides found on page 1. Drag 4 guides out from the main-page ruler — one each for the top, bottom, left, and right edges of the crop area — then try again.');
    }
    if (horizontals.length !== 2 || verticals.length !== 2) {
        return alert(`[ ERROR ] Crop to Guides needs exactly 4 guides on page 1: 2 horizontal (top + bottom) and 2 vertical (left + right). Found ${horizontals.length} horizontal and ${verticals.length} vertical instead.`);
    }

    statusDisplay.innerText = '[ CROPPING TO GUIDES... ]';
    try {
        const scale = parseFloat(pageEl.dataset.scale) || 1;

        const sourceDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        const page1Size = sourceDoc.getPages()[0].getSize();

        // Guides are positioned directly against page 1's own box, so their style.top/left are
        // already "px from page 1's top/left edge" — just convert px to points.
        const hPtsFromTop = horizontals.map(g => parseFloat(g.style.top) / scale).sort((a, b) => a - b);
        const vPtsFromLeft = verticals.map(g => parseFloat(g.style.left) / scale).sort((a, b) => a - b);

        const cropX = vPtsFromLeft[0];
        const cropRight = vPtsFromLeft[1];
        const cropTopY = page1Size.height - hPtsFromTop[0];    // guide nearer the visual top = upper bound
        const cropBottomY = page1Size.height - hPtsFromTop[1]; // guide nearer the visual bottom = lower bound
        const cropW = cropRight - cropX;
        const cropH = cropTopY - cropBottomY;

        const margin = 2; // points of slack for guides parked right at the page edge
        if (cropW <= 1 || cropH <= 1 || cropX < -margin || cropRight > page1Size.width + margin ||
            cropBottomY < -margin || cropTopY > page1Size.height + margin) {
            statusDisplay.innerText = '[ ERROR: CROP FAILED ]';
            return alert("[ ERROR ] The guides don't form a valid crop area on page 1. Make sure all 4 guides sit within the page and don't overlap each other, then try again.");
        }

        // Bleed (entered in inches) expands the guide-defined box outward, split evenly across
        // both edges of each dimension, so e.g. a 2x2 in box with a 0.125 in bleed becomes 2.125x2.125 in.
        const bleedIn = parseFloat(bleedInp.value);
        const bleedPts = (isNaN(bleedIn) || bleedIn < 0 ? 0 : bleedIn) * 72;
        const finalCropX = cropX - bleedPts / 2;
        const finalCropBottomY = cropBottomY - bleedPts / 2;
        const finalCropW = cropW + bleedPts;
        const finalCropH = cropH + bleedPts;

        const newDoc = await PDFDocument.create();
        const embeddedPages = await newDoc.embedPages(sourceDoc.getPages());
        embeddedPages.forEach((embPage) => {
            const newPage = newDoc.addPage([finalCropW, finalCropH]);
            newPage.drawPage(embPage, { x: -finalCropX, y: -finalCropBottomY, width: embPage.width, height: embPage.height });
        });

        currentPdfBytes = await newDoc.save();
        basePdfBytes = currentPdfBytes;
        await updatePreview(currentPdfBytes);
        statusDisplay.innerText = '[ CROP COMPLETE ]';
    } catch (e) {
        console.error(e);
        statusDisplay.innerText = '[ ERROR: CROP FAILED ]';
        alert('[ ERROR ] Crop to Guides failed: ' + (e.message || e));
    }
});

// --- File System Access API integration ---
// In Chromium-based browsers this lets Open and Export/Download share the browser's native
// file picker, which remembers the last folder used per site — so once a PDF is opened from a
// folder, subsequent exports default to that same folder instead of always landing in Downloads.
// Firefox/Safari don't support it, so everything falls back to the classic anchor-click download.
const supportsFileSystemAccess = typeof window.showSaveFilePicker === 'function';
const PDF_PICKER_TYPES = [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }];

async function saveBytesToFile(bytes, suggestedName) {
    if (supportsFileSystemAccess) {
        try {
            const handle = await window.showSaveFilePicker({ suggestedName, types: PDF_PICKER_TYPES });
            const writable = await handle.createWritable();
            await writable.write(bytes);
            await writable.close();
            return true;
        } catch (err) {
            if (err && err.name === 'AbortError') return false; // user cancelled the dialog — not a failure
            console.warn('[ File System Access ] save failed, falling back to browser download:', err);
        }
    }
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url; link.download = suggestedName;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
}

// Loads a chosen PDF File object into the app (shared by both the File System Access picker
// and the classic <input type="file"> fallback path below).
async function loadOpenedPdfFile(file) {
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
}

openPdfBtn.addEventListener('click', async () => {
    if (supportsFileSystemAccess && typeof window.showOpenFilePicker === 'function') {
        try {
            const [handle] = await window.showOpenFilePicker({ types: PDF_PICKER_TYPES, multiple: false });
            await loadOpenedPdfFile(await handle.getFile());
        } catch (err) {
            if (err && err.name !== 'AbortError') {
                console.warn('[ File System Access ] open failed, falling back to classic file input:', err);
                openPdfInput.click();
            }
        }
        return;
    }
    openPdfInput.click();
});
openPdfInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await loadOpenedPdfFile(file);
    openPdfInput.value = '';
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
            
            const kind = getFileKind(file);
            if (kind === 'pdf') {
                const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                if (i === 0) {
                    targetPdf = srcDoc;
                } else {
                    (await targetPdf.copyPages(srcDoc, srcDoc.getPageIndices())).forEach(p => targetPdf.addPage(p));
                }
            } else {
                if (kind === 'jpeg' && jpegHasCmykComponents(new Uint8Array(arrayBuffer))) isDocCMYK = true;
                hasRasterImages = true; 
                if (!targetPdf) targetPdf = await PDFDocument.create(); 
                
                let imgData;
                if (kind === 'psd') {
                    imgData = await importPsdForPageEmbedding(targetPdf, file);
                    if (imgData && imgData.rawCmyk) isDocCMYK = true;
                } else {
                    const convertedDataUrl = await rasterFileToPngDataUrlIfNeeded(file, kind);
                    if (convertedDataUrl) imgData = await targetPdf.embedPng(convertedDataUrl);
                    else if (kind === 'png') imgData = await targetPdf.embedPng(arrayBuffer);
                    else imgData = await targetPdf.embedJpg(arrayBuffer);
                }
                
                const imgDims = imgData.rawCmyk ? { width: imgData.width, height: imgData.height } : imgData.scale(1);
                const pdfW = (imgDims.width / 300) * 72;
                const pdfH = (imgDims.height / 300) * 72;
                
                drawImageAny(targetPdf.addPage([pdfW, pdfH]), imgData, { x: 0, y: 0, width: pdfW, height: pdfH });
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

        const orgKind = getFileKind(file);
        if (orgKind === 'pdf') {
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
            let isCmykPreserved = false;
            if (orgKind === 'psd') {
                img = await importPsdForPageEmbedding(newDoc, file);
                if (img && img.rawCmyk) isCmykPreserved = true;
            } else {
                const orgConvertedDataUrl = await rasterFileToPngDataUrlIfNeeded(file, orgKind);
                if (orgConvertedDataUrl) img = await newDoc.embedPng(orgConvertedDataUrl);
                else {
                    const imgBytes = await file.arrayBuffer();
                    if (orgKind === 'jpeg' && jpegHasCmykComponents(new Uint8Array(imgBytes))) { isDocCMYK = true; isCmykPreserved = true; }
                    img = orgKind === 'png' ? await newDoc.embedPng(imgBytes) : await newDoc.embedJpg(imgBytes);
                }
            }

            if (isCmykPreserved) {
                // CMYK data (raw PSD or a CMYK JPEG) gets its own page sized to the image's own
                // native dimensions and placed 1:1 — exactly like Combine Files — instead of being
                // fit/scaled into the reference page size below. This isn't about a canvas (no
                // HTML canvas is ever involved in either path); it's specifically to avoid the
                // fit-to-page scale transform changing the placed size relative to the source.
                const imgDims = img.rawCmyk ? { width: img.width, height: img.height } : img.scale(1);
                const pdfW = (imgDims.width / 300) * 72;
                const pdfH = (imgDims.height / 300) * 72;
                const newPage = newDoc.addPage([pdfW, pdfH]);
                drawImageAny(newPage, img, { x: 0, y: 0, width: pdfW, height: pdfH });
            } else {
                const newPage = newDoc.addPage([refW, refH]);
                const imgDims = img.scale(1);
                const scale = Math.min(refW / imgDims.width, refH / imgDims.height);
                const drawW = imgDims.width * scale;
                const drawH = imgDims.height * scale;
                drawImageAny(newPage, img, { x: (refW - drawW) / 2, y: (refH - drawH) / 2, width: drawW, height: drawH });
            }
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
    document.querySelectorAll('.guide-line').forEach(el => el.remove());
    editModal.style.display = 'flex';
    statusDisplay.innerText = "[ INITIALIZING WORKSPACE... ]";

    try {
        const pdf = await pdfjsLib.getDocument({ data: basePdfBytes.slice(0) , maxImageSize: MAX_PDFJS_IMAGE_PIXELS }).promise;
        const page = await pdf.getPage(currentEditPage);
        editViewportScale = 1.5;
        const viewport = page.getViewport({ scale: editViewportScale }); 

        editCanvas.width = viewport.width; editCanvas.height = viewport.height;
        await page.render({ canvasContext: editCanvas.getContext('2d'), viewport }).promise;
        
        if (!pdfLayers[currentEditPage]) pdfLayers[currentEditPage] = [];
        pdfLayers[currentEditPage].forEach(data => {
            const el = createWorkspaceElementDOM(data);
            canvasWrapper.appendChild(el); makeInteractive(el);
        });

        undoStack = []; redoStack = []; saveWorkspaceState();
        statusDisplay.innerText = "[ WORKSPACE READY ]";
        requestAnimationFrame(() => { resizeRulerCanvases(); drawRulers(); });
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

// --- Rulers & Guides (Acrobat-style) ---
// Rulers are drawn in real document units (inches, subdivided into eighths). Shared by the
// Edit workspace ruler (tied to editViewportScale / canvasWrapper) and the main-page ruler
// (tied to whichever page is currently in view, using the per-page scale stamped on its wrapper).

function drawRulerTicks(canvas, orientation, originPx, pxPerInch) {
    const ctx = canvas.getContext('2d');
    const size = orientation === 'h' ? canvas.width : canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a1e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00f3ff'; ctx.fillStyle = '#00f3ff'; ctx.font = '9px "Share Tech Mono", monospace';
    ctx.lineWidth = 1;
    if (!pxPerInch || pxPerInch <= 0) return;

    for (let inch = 0; originPx + inch * pxPerInch <= size; inch++) {
        const pos = originPx + inch * pxPerInch;
        if (pos < -pxPerInch) continue;
        if (pos >= 0) {
            if (orientation === 'h') {
                ctx.beginPath(); ctx.moveTo(Math.round(pos) + 0.5, 4); ctx.lineTo(Math.round(pos) + 0.5, 20); ctx.stroke();
                if (inch > 0) ctx.fillText(String(inch), pos + 2, 12);
            } else {
                ctx.beginPath(); ctx.moveTo(4, Math.round(pos) + 0.5); ctx.lineTo(20, Math.round(pos) + 0.5); ctx.stroke();
                if (inch > 0) {
                    ctx.save(); ctx.textAlign = 'center';
                    ctx.fillText(String(inch), 11, pos + 9);
                    ctx.restore();
                }
            }
        }
        for (let m = 1; m < 8; m++) {
            const mpos = pos + (m / 8) * pxPerInch;
            if (mpos < 0 || mpos > size) continue;
            const near = (m === 4) ? 10 : 15;
            if (orientation === 'h') { ctx.beginPath(); ctx.moveTo(Math.round(mpos) + 0.5, near); ctx.lineTo(Math.round(mpos) + 0.5, 20); ctx.stroke(); }
            else { ctx.beginPath(); ctx.moveTo(near, Math.round(mpos) + 0.5); ctx.lineTo(20, Math.round(mpos) + 0.5); ctx.stroke(); }
        }
    }
}

// -- Edit workspace ruler --
function resizeRulerCanvases() {
    if (!workspaceContainer) return;
    rulerHorizontal.width = Math.max(1, workspaceContainer.clientWidth - 20);
    rulerHorizontal.height = 20;
    rulerVertical.width = 20;
    rulerVertical.height = Math.max(1, workspaceContainer.clientHeight - 20);
}

function drawRulers() {
    if (editModal.style.display === 'none' || !canvasWrapper.offsetParent) return;
    const wrapRect = canvasWrapper.getBoundingClientRect();
    const hRect = rulerHorizontal.getBoundingClientRect();
    const vRect = rulerVertical.getBoundingClientRect();
    const pxPerInch = 72 * editViewportScale;
    drawRulerTicks(rulerHorizontal, 'h', wrapRect.left - hRect.left, pxPerInch);
    drawRulerTicks(rulerVertical, 'v', wrapRect.top - vRect.top, pxPerInch);
}

// -- Main-page ruler --
// Its zero point tracks whichever page is currently visible in the continuous-scroll preview,
// so ticks stay accurate as you scroll or change zoom.
function getMainRulerOriginEl() {
    if (!pdfCanvasContainer) return null;
    return pdfCanvasContainer.querySelector(`.pdf-page-wrapper[data-page-number="${visiblePreviewPage || 1}"]`)
        || pdfCanvasContainer.querySelector('.pdf-page-wrapper');
}

function resizeMainRulerCanvases() {
    if (!viewerContainer || !mainRulerHorizontal || !mainRulerVertical) return;
    mainRulerHorizontal.width = Math.max(1, viewerContainer.clientWidth - 20);
    mainRulerHorizontal.height = 20;
    mainRulerVertical.width = 20;
    mainRulerVertical.height = Math.max(1, viewerContainer.clientHeight - 20);
}

function drawMainRulers() {
    if (!mainRulerHorizontal || !mainRulerVertical || !mainRulerHorizontal.offsetParent) return;
    const pageEl = getMainRulerOriginEl();
    if (!pageEl || pdfPreviewLayout.style.display === 'none') {
        drawRulerTicks(mainRulerHorizontal, 'h', 0, 0);
        drawRulerTicks(mainRulerVertical, 'v', 0, 0);
        return;
    }
    const scale = parseFloat(pageEl.dataset.scale) || 1;
    const pageRect = pageEl.getBoundingClientRect();
    const hRect = mainRulerHorizontal.getBoundingClientRect();
    const vRect = mainRulerVertical.getBoundingClientRect();
    const pxPerInch = 72 * scale;
    drawRulerTicks(mainRulerHorizontal, 'h', pageRect.left - hRect.left, pxPerInch);
    drawRulerTicks(mainRulerVertical, 'v', pageRect.top - vRect.top, pxPerInch);
}

// -- Shared guide-line drag/create logic --
// `layerEl` is where guides live and where drag positions are measured from.
// `getOriginEl()` returns the element whose top-left corresponds to the document's real
// (0,0) point and whose `dataset.scale` (CSS px per PDF point) drives the inch readout —
// for the Edit workspace this is canvasWrapper itself; for the main page it's the
// currently-visible page wrapper.
function computeGuideMetrics(layerEl, originEl, fallbackScale) {
    const layerRect = layerEl.getBoundingClientRect();
    const originRect = originEl ? originEl.getBoundingClientRect() : layerRect;
    const scale = (originEl && parseFloat(originEl.dataset.scale)) || fallbackScale || 1;
    return {
        layerRect,
        offsetX: originRect.left - layerRect.left,
        offsetY: originRect.top - layerRect.top,
        pxPerInch: 72 * scale
    };
}

let guideTooltipEl = null;
function showGuideTooltip(clientX, clientY, pxFromOrigin, pxPerInch) {
    if (!guideTooltipEl) {
        guideTooltipEl = document.createElement('div');
        guideTooltipEl.className = 'guide-tooltip';
        document.body.appendChild(guideTooltipEl);
    }
    guideTooltipEl.textContent = (pxFromOrigin / (pxPerInch || 108)).toFixed(2) + ' in';
    guideTooltipEl.style.left = (clientX + 12) + 'px';
    guideTooltipEl.style.top = (clientY + 12) + 'px';
}
function hideGuideTooltip() { if (guideTooltipEl) { guideTooltipEl.remove(); guideTooltipEl = null; } }

function isPointWithinRect(rect, clientX, clientY) {
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function attachGuideDrag(el, type, layerEl, getOriginEl, fallbackScale) {
    el.addEventListener('mousedown', (e) => {
        e.preventDefault(); e.stopPropagation();
        el.classList.add('dragging');

        function onMove(moveEvent) {
            const metrics = computeGuideMetrics(layerEl, getOriginEl(), fallbackScale);
            if (type === 'h') {
                const y = Math.min(Math.max(moveEvent.clientY - metrics.layerRect.top, 0), metrics.layerRect.height);
                el.style.top = y + 'px';
                showGuideTooltip(moveEvent.clientX, moveEvent.clientY, y - metrics.offsetY, metrics.pxPerInch);
            } else {
                const x = Math.min(Math.max(moveEvent.clientX - metrics.layerRect.left, 0), metrics.layerRect.width);
                el.style.left = x + 'px';
                showGuideTooltip(moveEvent.clientX, moveEvent.clientY, x - metrics.offsetX, metrics.pxPerInch);
            }
        }
        function onUp(upEvent) {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            el.classList.remove('dragging');
            hideGuideTooltip();
            if (!isPointWithinRect(layerEl.getBoundingClientRect(), upEvent.clientX, upEvent.clientY)) el.remove();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
    el.addEventListener('dblclick', (e) => { e.stopPropagation(); el.remove(); });
}

function createGuideElement(type, posPx, layerEl, getOriginEl, fallbackScale) {
    const el = document.createElement('div');
    el.className = 'guide-line ' + (type === 'h' ? 'guide-h' : 'guide-v');
    if (type === 'h') el.style.top = posPx + 'px'; else el.style.left = posPx + 'px';
    layerEl.appendChild(el);
    attachGuideDrag(el, type, layerEl, getOriginEl, fallbackScale);
    return el;
}

// Live-drags a guide out from a ruler: a preview line follows the cursor continuously (visible
// the whole time, not just on drop) and turns into a real, permanent guide on mouse-up.
function startGuideCreationFromRuler(type, e, layerEl, getOriginEl, fallbackScale) {
    e.preventDefault();
    const preview = document.createElement('div');
    preview.className = 'guide-drag-preview ' + (type === 'h' ? 'guide-h' : 'guide-v');
    document.body.appendChild(preview);

    function position(moveEvent) {
        if (type === 'h') preview.style.top = moveEvent.clientY + 'px';
        else preview.style.left = moveEvent.clientX + 'px';
        const metrics = computeGuideMetrics(layerEl, getOriginEl(), fallbackScale);
        const localPos = type === 'h' ? (moveEvent.clientY - metrics.layerRect.top) : (moveEvent.clientX - metrics.layerRect.left);
        const offset = type === 'h' ? metrics.offsetY : metrics.offsetX;
        showGuideTooltip(moveEvent.clientX, moveEvent.clientY, localPos - offset, metrics.pxPerInch);
    }
    position(e);

    function onMove(moveEvent) { position(moveEvent); }
    function onUp(upEvent) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        preview.remove();
        hideGuideTooltip();
        const layerRect = layerEl.getBoundingClientRect();
        if (isPointWithinRect(layerRect, upEvent.clientX, upEvent.clientY)) {
            if (type === 'h') createGuideElement('h', upEvent.clientY - layerRect.top, layerEl, getOriginEl, fallbackScale);
            else createGuideElement('v', upEvent.clientX - layerRect.left, layerEl, getOriginEl, fallbackScale);
        }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}

// Wiring: Edit workspace ruler (guides live inside canvasWrapper, which is also the origin)
if (rulerHorizontal) rulerHorizontal.addEventListener('mousedown', (e) => startGuideCreationFromRuler('h', e, canvasWrapper, () => canvasWrapper, editViewportScale));
if (rulerVertical) rulerVertical.addEventListener('mousedown', (e) => startGuideCreationFromRuler('v', e, canvasWrapper, () => canvasWrapper, editViewportScale));

if (toggleRulerBtn) toggleRulerBtn.addEventListener('click', () => {
    workspaceContainer.classList.toggle('rulers-hidden');
});
if (clearGuidesBtn) clearGuidesBtn.addEventListener('click', () => {
    canvasWrapper.querySelectorAll('.guide-line').forEach(g => g.remove());
});

window.addEventListener('resize', () => { resizeRulerCanvases(); drawRulers(); });
if (workspaceContainer) workspaceContainer.addEventListener('scroll', drawRulers);

// Wiring: main-page ruler. Guides are appended directly onto whichever page wrapper is
// currently in view (so they're part of that page's own box and scroll along with it,
// instead of floating at a fixed screen position while the document scrolls underneath).
if (mainRulerHorizontal) mainRulerHorizontal.addEventListener('mousedown', (e) => {
    const pageEl = getMainRulerOriginEl();
    if (!pageEl) return;
    startGuideCreationFromRuler('h', e, pageEl, () => pageEl, parseFloat(pageEl.dataset.scale) || 1);
});
if (mainRulerVertical) mainRulerVertical.addEventListener('mousedown', (e) => {
    const pageEl = getMainRulerOriginEl();
    if (!pageEl) return;
    startGuideCreationFromRuler('v', e, pageEl, () => pageEl, parseFloat(pageEl.dataset.scale) || 1);
});
if (mainRulerCorner) mainRulerCorner.addEventListener('click', () => {
    pdfCanvasContainer.querySelectorAll('.pdf-page-wrapper .guide-line').forEach(g => g.remove());
});

window.addEventListener('resize', () => { resizeMainRulerCanvases(); drawMainRulers(); });
if (pdfCanvasContainer) pdfCanvasContainer.addEventListener('scroll', drawMainRulers);

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

    const attachKind = getFileKind(file);
    (async () => {
        let srcData;
        const attachConvertedDataUrl = await rasterFileToPngDataUrlIfNeeded(file, attachKind);
        if (attachConvertedDataUrl) {
            srcData = attachConvertedDataUrl;
        } else {
            srcData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target.result);
                reader.readAsDataURL(file);
            });
        }

        await openWorkspace(pageNum);
        const item = createWorkspaceElementDOM({ type: 'image', left: '50px', top: '50px', width: '160px', height: '160px', src: srcData });
        canvasWrapper.appendChild(item); makeInteractive(item); saveWorkspaceState();
        attachInput.value = ''; 
    })();
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

        // Pick a single destination folder up front (Chromium browsers) so all split parts
        // land together in one place, next to the original file, instead of N separate
        // "Save As" dialogs or a pile of files in Downloads.
        let destDirHandle = null;
        if (typeof window.showDirectoryPicker === 'function') {
            try { destDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' }); }
            catch (err) { if (err && err.name !== 'AbortError') console.warn('[ File System Access ] folder pick failed, falling back to downloads:', err); }
        }

        for (let i = 0; i < totalPages; i += chunkSize) {
            const splitPdfDoc = await PDFDocument.create(), pageIndices = [];
            for (let j = i; j < Math.min(i + chunkSize, totalPages); j++) pageIndices.push(j);
            (await splitPdfDoc.copyPages(sourcePdfDoc, pageIndices)).forEach(page => splitPdfDoc.addPage(page));
            const partBytes = await splitPdfDoc.save();
            const partName = `Spiokoks_Doc_Part_${partCounter++}.pdf`;

            if (destDirHandle) {
                const fileHandle = await destDirHandle.getFileHandle(partName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(partBytes);
                await writable.close();
            } else {
                const splitUrl = URL.createObjectURL(new Blob([partBytes], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = splitUrl; link.download = partName;
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(splitUrl), 100);
            }
        }
        statusDisplay.innerText = `[ SPLIT SUCCESS: ${partCounter - 1} PARTS ]`;
    } catch (error) { console.error('[ Split ] split failed:', error); statusDisplay.innerText = '[ ERROR: SPLIT FAILED ]'; }
});

exportBtn.addEventListener('click', async () => {
    if (!currentPdfBytes) return alert('[ ERROR ] No document to export.');

    exportModal.style.display = 'flex';
    statusDisplay.innerText = '[ COMPILING EXPORT FILE... ]';

    try {
        await saveBytesToFile(currentPdfBytes, `${importedBaseFileName}_Combined.pdf`);
        statusDisplay.innerText = '[ EXPORT OPERATIONAL COMPLETE ]';
    } catch (err) {
        console.error(err);
        statusDisplay.innerText = '[ ERROR: EXPORT FAILED ]';
    } finally {
        exportModal.style.display = 'none';
    }
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
        await saveBytesToFile(cmykBytes, `${importedBaseFileName}_Combined_CMYK.pdf`);
        statusDisplay.innerText = '[ CMYK EXPORT COMPLETE ]';
    } catch (err) {
        console.error(err);
        statusDisplay.innerText = '[ ERROR: CMYK CONVERSION FAILED ]';
    } finally {
        exportModal.style.display = 'none';
    }
});