javascript:(function() {
    // Mencegah duplikasi jika sudah ditekan sebelumnya
    if (document.getElementById("iosGlassHost")) return;

    const DRAFT = "IOS_GLASS_DRAFT_HTML";

    // Membuat Shadow DOM Host agar CSS tidak tercampur dengan CSS website
    const host = document.createElement("div");
    host.id = "iosGlassHost";
    // Wrapper dibuat transparan dan tidak mengganggu klik website di luarnya
    host.style.cssText = "position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";
    document.body.appendChild(host);

    // Mengaktifkan Shadow Root
    const shadow = host.attachShadow({ mode: "open" });

    // CSS Tema Terang, Professional, & Menonjol
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    :host {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    #iosGlassCard {
        position: absolute;
        top: 8vh;
        left: 5vw;
        width: 90vw;
        height: 75vh;
        max-width: 600px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.6);
        display: flex;
        flex-direction: column;
        color: #1C1C1E;
        pointer-events: auto; /* Agar card bisa diklik */
        overflow: hidden;
        opacity: 0;
        transform: scale(0.95);
        animation: popupSpring 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popupSpring { 
        to { opacity: 1; transform: scale(1) translate(0, 0); } 
    }
    @keyframes popupHide { 
        to { opacity: 0; transform: scale(0.95); } 
    }

    #iosTopBar {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: rgba(255, 255, 255, 0.5);
        cursor: grab;
        touch-action: none; /* Cegah scroll saat di-drag di Android */
    }
    #iosTopBar:active { cursor: grabbing; }

    .ios-header-info { display: flex; align-items: center; gap: 14px; pointer-events: none; }
    
    .ios-icon-box {
        width: 42px; height: 42px;
        background: #F2F2F7;
        border-radius: 12px;
        display: flex; justify-content: center; align-items: center;
        color: #007AFF;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .ios-icon-box svg { width: 22px; height: 22px; }

    .ios-titles h3 { margin: 0; font-size: 16px; font-weight: 600; color: #000; letter-spacing: -0.3px; }
    .ios-titles p { margin: 2px 0 0; font-size: 12px; color: #6E6E73; }

    #iosContent {
        padding: 16px 20px;
        display: flex; flex-direction: column; gap: 16px; flex: 1;
    }

    #iosEditor {
        flex: 1;
        background: rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        padding: 16px;
        color: #1C1C1E;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: none;
        outline: none;
        transition: all 0.2s;
        -webkit-overflow-scrolling: touch;
    }
    #iosEditor:focus { 
        border-color: #007AFF; 
        background: #FFFFFF;
        box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15);
    }
    #iosEditor::placeholder { color: #A1A1A6; }

    .ios-actions { display: flex; gap: 10px; }

    .ios-btn {
        height: 48px;
        border: none; border-radius: 14px;
        font-size: 14px; font-weight: 600;
        cursor: pointer;
        display: flex; justify-content: center; align-items: center; gap: 8px;
        transition: transform 0.1s, filter 0.2s;
    }
    .ios-btn:active { transform: scale(0.94); }
    .ios-btn svg { width: 18px; height: 18px; }

    /* Desain Tombol Menonjol */
    .btn-exec { flex: 2; background: #007AFF; color: white; box-shadow: 0 6px 16px rgba(0, 122, 255, 0.3); }
    .btn-restore { flex: 1; background: #FF3B30; color: white; box-shadow: 0 6px 16px rgba(255, 59, 48, 0.3); }
    .btn-close { flex: 1; background: #E5E5EA; color: #1C1C1E; }

    /* Toast Notification Professional */
    .ios-toast {
        position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: rgba(30, 30, 30, 0.9); backdrop-filter: blur(15px);
        color: white; padding: 12px 24px; border-radius: 30px;
        font-size: 13px; font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        opacity: 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none; z-index: 2147483647;
        display: flex; align-items: center; gap: 10px;
    }
    .ios-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* Loading Overlay */
    #iosLoader {
        position: absolute; inset: 0; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 10; border-radius: 24px; opacity: 0; transition: opacity 0.3s;
    }
    .spinner {
        width: 36px; height: 36px;
        border: 3px solid rgba(0, 122, 255, 0.2); border-top-color: #007AFF;
        border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    `;

    // Inject CSS ke dalam Shadow DOM
    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    // Create UI dengan SVG Vektor murni
    const ui = document.createElement("div");
    ui.id = "iosGlassCard";
    ui.innerHTML = `
        <div id="iosLoader">
            <div class="spinner"></div>
            <div style="margin-top: 12px; font-weight: 600; color: #007AFF; font-size: 14px;">Executing...</div>
        </div>
        <div id="iosTopBar">
            <div class="ios-header-info">
                <div class="ios-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <div class="ios-titles">
                    <h3>Code Injector</h3>
                    <p>Floating Studio</p>
                </div>
            </div>
        </div>
        <div id="iosContent">
            <textarea id="iosEditor" spellcheck="false" placeholder="<!-- Paste HTML, CSS, JS here... -->"></textarea>
            <div class="ios-actions">
                <button class="ios-btn btn-close" id="btn-close" title="Close">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <button class="ios-btn btn-restore" id="btn-restore" title="Restore">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <polyline points="3 3 3 8 8 8"></polyline>
                    </svg>
                </button>
                <button class="ios-btn btn-exec" id="btn-exec">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 3v18l15-9L5 3z"></path>
                    </svg>
                    Run
                </button>
            </div>
        </div>
    `;
    shadow.appendChild(ui);

    // Ambil Elemen dari Shadow DOM
    const editor = shadow.getElementById("iosEditor");
    const card = shadow.getElementById("iosGlassCard");
    const topBar = shadow.getElementById("iosTopBar");
    const loader = shadow.getElementById("iosLoader");
    let isInjected = false;

    // Load Data
    editor.value = localStorage.getItem(DRAFT) || "";
    editor.addEventListener("input", () => localStorage.setItem(DRAFT, editor.value));

    // Toast Notification dengan Vektor SVG
    function showToast(msg, type = "info") {
        const icons = {
            info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
            success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
            error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
        };

        const t = document.createElement("div");
        t.className = "ios-toast";
        t.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${icons[type]}</svg> <span>${msg}</span>`;
        
        shadow.appendChild(t);
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => {
            t.classList.remove("show");
            setTimeout(() => t.remove(), 400);
        }, 2000);
    }

    // --- LOGIKA DRAG (Dioptimalkan untuk Touch Android) ---
    let isDragging = false, startX, startY, initialX = 0, initialY = 0;
    
    const dragStart = (e) => {
        isDragging = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        startX = clientX - initialX;
        startY = clientY - initialY;
        card.style.transition = 'none';
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        initialX = clientX - startX;
        initialY = clientY - startY;
        card.style.transform = `translate(${initialX}px, ${initialY}px) scale(1)`;
    };

    const dragEnd = () => {
        if (isDragging) {
            isDragging = false;
        }
    };

    topBar.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);
    topBar.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove, { passive: false });
    window.addEventListener('mouseup', dragEnd);

    // --- TOMBOL AKSI ---

    // Close Button (Tutup Popup)
    shadow.getElementById("btn-close").onclick = () => {
        card.style.animation = "popupHide 0.3s forwards";
        setTimeout(() => host.remove(), 350);
        if(isInjected) showToast("Studio closed. Script is running.", "info");
    };

    // Execute Button (Inject ke Fullscreen iFrame)
    shadow.getElementById("btn-exec").onclick = () => {
        const htmlCode = editor.value.trim();
        if (!htmlCode) return showToast("Code is empty!", "error");

        loader.style.display = "flex";
        requestAnimationFrame(() => loader.style.opacity = "1");

        setTimeout(() => {
            const oldFrame = document.getElementById("glassStudioFrame");
            if(oldFrame) oldFrame.remove();

            // Sembunyikan web asli (kecuali shadow host popup ini)
            Array.from(document.body.children).forEach(child => {
                if(child.id !== "iosGlassHost" && child.tagName !== "STYLE" && child.tagName !== "SCRIPT") {
                    if(!child.hasAttribute('data-display-origin')) {
                        child.setAttribute('data-display-origin', getComputedStyle(child).display);
                    }
                    child.style.display = "none";
                }
            });

            // Buat Frame Injeksi
            const iframe = document.createElement("iframe");
            iframe.id = "glassStudioFrame";
            iframe.style.cssText = "position:fixed; inset:0; width:100vw; height:100vh; border:none; z-index:2147483646; background:#fff;";
            document.body.appendChild(iframe);

            iframe.contentDocument.open();
            iframe.contentDocument.write(htmlCode);
            iframe.contentDocument.close();

            isInjected = true;
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 300);
            
            showToast("Injection Successful!", "success");
            // Sembunyikan otomatis window editor setelah berhasil
            shadow.getElementById("btn-close").click();

        }, 800);
    };

    // Restore Button (Hapus Frame, Munculkan Web Asli

    showToast("Studio Ready", "info");
})();
