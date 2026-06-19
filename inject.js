```html
javascript:(function() {
    // Mencegah duplikasi UI
    if (document.getElementById("iosGlassHost")) return;

    const DRAFT = "IOS_GLASS_DRAFT_HTML";

    // Membuat Shadow DOM agar kebal dari CSS website asli
    const host = document.createElement("div");
    host.id = "iosGlassHost";
    host.style.cssText = "position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    // CSS Tema Terang (White Glass) & Anti-Overflow Layout
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
        box-sizing: border-box; /* Kunci agar elemen tidak keluar jalur */
    }

    :host {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    #iosGlassCard {
        position: fixed; /* Fixed agar selalu di area layar */
        top: 5vh;
        left: 5vw;
        width: 90vw;
        height: 85vh; /* Batas maksimal tinggi layar */
        max-width: 600px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.85); /* Putih transparan */
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column; /* Susunan vertikal */
        color: #1C1C1E;
        pointer-events: auto;
        overflow: hidden; /* Mencegah tombol keluar dari Card */
        opacity: 0;
        transform: scale(0.95);
        animation: popupOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popupOpen { to { opacity: 1; transform: scale(1); } }
    @keyframes popupClose { to { opacity: 0; transform: scale(0.95); } }

    #iosTopBar {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        background: rgba(255, 255, 255, 0.4);
        cursor: grab;
        touch-action: none;
        flex-shrink: 0; /* Header tidak boleh menyusut */
    }
    #iosTopBar:active { cursor: grabbing; }

    .icon-app {
        width: 40px; height: 40px;
        background: #FFFFFF;
        border-radius: 10px;
        display: flex; justify-content: center; align-items: center;
        color: #007AFF;
        box-shadow: 0 4px 10px rgba(0, 122, 255, 0.15);
        border: 1px solid rgba(0, 122, 255, 0.1);
    }
    .icon-app svg { width: 22px; height: 22px; }

    .title-box { display: flex; flex-direction: column; pointer-events: none; }
    .title-box h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1C1C1E; }
    .title-box p { margin: 0; font-size: 12px; color: #8E8E93; font-weight: 500; }

    #iosContent {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0; /* Kunci agar textarea bisa scroll dan tidak menabrak batas bawah */
    }

    #iosEditor {
        flex: 1;
        width: 100%;
        background: #F2F2F7;
        border: 1.5px solid rgba(0, 0, 0, 0.05);
        border-radius: 16px;
        padding: 16px;
        color: #1C1C1E;
        font-family: ui-monospace, monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: none;
        outline: none;
        transition: all 0.2s;
        margin-bottom: 16px; /* Jarak antara editor dan tombol */
    }
    #iosEditor:focus { 
        background: #FFFFFF;
        border-color: #007AFF;
        box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
    }

    .ios-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0; /* Tombol tidak boleh menyusut tertekan textarea */
    }

    /* Gaya Tombol: Putih tapi Mencolok */
    .ios-btn {
        height: 50px;
        background: #FFFFFF;
        border-radius: 14px;
        font-size: 14px; font-weight: 600;
        cursor: pointer;
        display: flex; justify-content: center; align-items: center; gap: 6px;
        transition: all 0.1s;
    }
    .ios-btn:active { transform: scale(0.95); }
    .ios-btn svg { width: 18px; height: 18px; }

    /* Tombol Execute (Biru Mencolok) */
    .btn-exec {
        flex: 2;
        color: #007AFF;
        border: 1.5px solid #007AFF;
        box-shadow: 0 6px 16px rgba(0, 122, 255, 0.2);
    }
    /* Tombol Restore (Merah Mencolok) */
    .btn-restore {
        flex: 1.5;
        color: #FF3B30;
        border: 1.5px solid #FF3B30;
        box-shadow: 0 6px 16px rgba(255, 59, 48, 0.2);
    }
    /* Tombol Close (Abu-abu Lembut) */
    .btn-close {
        flex: 1;
        color: #8E8E93;
        border: 1.5px solid #D1D1D6;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    /* Toast Notifikasi */
    .toast {
        position: fixed; bottom: 30px; left: 50%; transform: translate(-50%, 20px);
        background: rgba(0, 0, 0, 0.8); color: white;
        padding: 12px 20px; border-radius: 20px; font-size: 13px; font-weight: 500;
        opacity: 0; transition: all 0.3s; pointer-events: none; z-index: 9999;
        display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px);
    }
    .toast.show { opacity: 1; transform: translate(-50%, 0); }

    /* Loading Overlay */
    #loader {
        position: absolute; inset: 0; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(5px);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 10; opacity: 0; transition: opacity 0.3s;
    }
    .spinner {
        width: 36px; height: 36px; border: 3px solid rgba(0, 122, 255, 0.2);
        border-top-color: #007AFF; border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    const ui = document.createElement("div");
    ui.id = "iosGlassCard";
    ui.innerHTML = `
        <div id="loader">
            <div class="spinner"></div>
            <div style="margin-top: 10px; font-weight: 600; color: #007AFF;">Executing...</div>
        </div>
        <div id="iosTopBar">
            <div class="icon-app">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <div class="title-box">
                <h3>Glass Studio</h3>
                <p>Code Injector</p>
            </div>
        </div>
        <div id="iosContent">
            <textarea id="iosEditor" spellcheck="false" placeholder="<!-- Ketik HTML, CSS, JS disini... -->"></textarea>
            <div class="ios-actions">
                <button class="ios-btn btn-exec" id="btn-exec">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Run
                </button>
                <button class="ios-btn btn-restore" id="btn-restore">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg> Restore
                </button>
                <button class="ios-btn btn-close" id="btn-close" aria-label="Close">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    `;
    shadow.appendChild(ui);

    const editor = shadow.getElementById("iosEditor");
    const card = shadow.getElementById("iosGlassCard");
    const topBar = shadow.getElementById("iosTopBar");
    const loader = shadow.getElementById("loader");
    let isInjected = false;

    editor.value = localStorage.getItem(DRAFT) || "";
    editor.addEventListener("input", () => localStorage.setItem(DRAFT, editor.value));

    function showToast(msg) {
        const t = document.createElement("div");
        t.className = "toast";
        t.innerHTML = `<span>${msg}</span>`;
        shadow.appendChild(t);
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2000);
    }

    // --- LOGIKA DRAG (Touch Android & Mouse) ---
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
        card.style.transform = `translate(${initialX}px, ${initialY}px)`;
    };

    const dragEnd = () => { isDragging = false; };

    topBar.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);
    topBar.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove, { passive: false });
    window.addEventListener('mouseup', dragEnd);

    // --- AKSI TOMBOL ---
    shadow.getElementById("btn-close").onclick = () => {
        card.style.animation = "popupClose 0.2s forwards";
        setTimeout(() => host.remove(), 250);
        if(isInjected) showToast("Disembunyikan. HTML masih berjalan.");
    };

    shadow.getElementById("btn-exec").onclick = () => {
        const htmlCode = editor.value.trim();
        if (!htmlCode) return showToast("⚠️ Code masih kosong!");

        loader.style.display = "flex";
        requestAnimationFrame(() => loader.style.opacity = "1");

        setTimeout(() => {
            const oldFrame = document.getElementById("glassStudioFrame");
            if(oldFrame) oldFrame.remove();

            Array.from(document.body.children).forEach(child => {
                if(child.id !== "iosGlassHost" && child.tagName !== "STYLE" && child.tagName !== "SCRIPT") {
                    if(!child.hasAttribute('data-display-origin')) {
                        child.setAttribute('data-display-origin', getComputedStyle(child).display);
                    }
                    child.style.display = "none";
                }
            });

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
            shadow.getElementById("btn-close").click();
        }, 600);
    };

    shadow.getElementById("btn-restore").onclick = () => {
        if (!isInjected) return showToast("Tidak ada yang perlu direstore.");
        
        const iframe = document.getElementById("glassStudioFrame");
        if(iframe) iframe.remove();

        Array.from(document.body.children).forEach(child => {
            if(child.hasAttribute('data-display-origin')) {
                child.style.display = child.getAttribute('data-display-origin');
            }
        });

        isInjected = false;
        showToast("✅ Halaman Asli Kembali");
    };

    showToast("✨ Glass Studio Siap");
})();


```
