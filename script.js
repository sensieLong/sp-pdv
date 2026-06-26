// SUPABASE INITIALIZATION (Replace with your actual keys!)
const SUPABASE_URL = 'https://gxggetfxkzhegqehcjzv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z2dldGZ4a3poZWdxZWhjanp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTAxNzQsImV4cCI6MjA5Nzc4NjE3NH0.iNqyqCC3ZSrKhOW2JrfmL7iN6MK7J5U_2XXZbxJPGEw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Access Libraries (CMYK included)
const { PDFDocument, rgb, cmyk, degrees } = PDFLib;
const pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// DOM Elements
const openPdfBtn = document.getElementById('openPdfBtn');
const openPdfInput = document.getElementById('openPdfInput');
const combineBtn = document.getElementById('combineBtn');
const fileInput = document.getElementById('fileInput');
const exportBtn = document.getElementById('exportBtn');
const organizeBtn = document.getElementById('organizeBtn');
const splitBtn = document.getElementById('splitBtn');
const editPdfBtn = document.getElementById('editPdfBtn');
const attachBtn = document.getElementById('attachBtn');
const attachInput = document.getElementById('attachInput');
const statusDisplay = document.getElementById('status');
const viewerMessage = document.getElementById('viewerMessage');
const pdfPreview = document.getElementById('pdfPreview');

const applySizeBtn = document.getElementById('applySizeBtn');

// Sidebar Toggle Logic
const toolsMenuToggle = document.getElementById('toolsMenuToggle');
const sidebarRight = document.getElementById('sidebarRight');

toolsMenuToggle.addEventListener('click', () => {
    sidebarRight.classList.toggle('collapsed');
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
// CORE PDF LOGIC (Updated for CMYK Support)
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

// [ NEW ]: CMYK State Tracking
let isDocCMYK = false; 

// [ NEW ]: Quick heuristic to detect if the PDF contains CMYK color spaces
function detectCMYK(bytes) {
    const str = new TextDecoder('ascii', { fatal: false }).decode(bytes);
    return str.includes('/DeviceCMYK') || str.includes('CMYK');
}

async function updatePreview(bytes) {
    currentPdfBytes = bytes;
    const blob = new Blob([bytes], { type: 'application/pdf' });
    if (currentPdfUrl) URL.revokeObjectURL(currentPdfUrl);
    currentPdfUrl = URL.createObjectURL(blob);
    viewerMessage.style.display = 'none';
    pdfPreview.style.display = 'block';
    pdfPreview.src = currentPdfUrl;

    try {
        const pdfDoc = await PDFDocument.load(bytes);
        if(pdfDoc.getPageCount() > 0) {
            const page = pdfDoc.getPage(0);
            const { width, height } = page.getSize();
            document.getElementById('docWidthInp').value = (width / 72).toFixed(2);
            document.getElementById('docHeightInp').value = (height / 72).toFixed(2);
            document.getElementById('docSizeEditor').style.display = 'flex';
        }
    } catch(e) { console.error("Could not parse size.", e); }
}

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
    const wInches = parseFloat(document.getElementById('docWidthInp').value);
    const hInches = parseFloat(document.getElementById('docHeightInp').value);
    
    if(isNaN(wInches) || isNaN(hInches) || wInches <= 0 || hInches <= 0) return alert("[ ERROR ] Invalid numeric input for size.");

    const newWPoints = wInches * 72;
    const newHPoints = hInches * 72;

    statusDisplay.innerText = '[ RESIZING DOCUMENT... ]';
    try {
        const sourceDoc = await PDFDocument.load(currentPdfBytes);
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
        
        isDocCMYK = detectCMYK(buffer); // Scan for CMYK profile
        
        basePdfBytes = await (await PDFDocument.load(buffer)).save(); 
        updatePreview(basePdfBytes);
        
        statusDisplay.innerText = isDocCMYK ? '[ SYSTEM: PDF LOADED (CMYK DETECTED) ]' : '[ SYSTEM: PDF LOADED ]';
    } catch (error) { statusDisplay.innerText = '[ ERROR: LOAD FAILED ]'; }
});

combineBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    statusDisplay.innerText = `[ COMBINING ${files.length} FILES... ]`;
    pdfLayers = {}; 
    let hasRasterImages = false; 
    isDocCMYK = false;

    try {
        let targetPdf;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const arrayBuffer = await file.arrayBuffer();
            
            if(detectCMYK(arrayBuffer)) isDocCMYK = true; // Update global state

            if (file.type === 'application/pdf') {
                const srcDoc = await PDFDocument.load(arrayBuffer);
                
                // Use the FIRST PDF as the structural base to preserve native CMYK ICC profiles
                if (i === 0) {
                    targetPdf = srcDoc;
                } else {
                    (await targetPdf.copyPages(srcDoc, srcDoc.getPageIndices())).forEach(p => targetPdf.addPage(p));
                }
            } else {
                hasRasterImages = true; 
                if (!targetPdf) targetPdf = await PDFDocument.create(); // Fallback
                
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
        
        let statusText = hasRasterImages ? '[ MERGED: FLAT IMAGES ]' : '[ FILES MERGED ]';
        if(isDocCMYK) statusText += ' [ CMYK INTEGRITY PRESERVED ]';
        statusDisplay.innerText = statusText;
        
    } catch (err) { statusDisplay.innerText = '[ ERROR: MERGE FAILED ]'; }
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
        const pdf = await pdfjsLib.getDocument({ data: currentPdfBytes.slice(0) }).promise;
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
        const sourceDoc = await PDFDocument.load(currentPdfBytes);
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
            const addedDoc = await PDFDocument.load(await file.arrayBuffer());
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
        const sourceDoc = await PDFDocument.load(currentPdfBytes);
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
        const sourceDoc = await PDFDocument.load(currentPdfBytes);
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
    } catch (error) { statusDisplay.innerText = '[ ERROR: REORG FAILED ]'; }
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
        const pdf = await pdfjsLib.getDocument({ data: basePdfBytes.slice(0) }).promise;
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
        const pdfDoc = await PDFDocument.load(basePdfBytes);
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
                    
                    // [ NEW ] Dynamically inject the correct color profile
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
        const sourcePdfDoc = await PDFDocument.load(currentPdfBytes); 
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
    } catch (error) { statusDisplay.innerText = '[ ERROR: SPLIT FAILED ]'; }
});

exportBtn.addEventListener('click', () => {
    if (!currentPdfUrl) return alert('[ ERROR ] No document to export.');
    
    exportModal.style.display = 'flex';
    statusDisplay.innerText = '[ COMPILING EXPORT FILE... ]';

    setTimeout(() => {
        const link = document.createElement('a');
        link.href = currentPdfUrl; 
        link.download = 'Spiokoks_Document_Final.pdf';
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
        
        exportModal.style.display = 'none';
        statusDisplay.innerText = '[ EXPORT OPERATIONAL COMPLETE ]';
    }, 1500);
});