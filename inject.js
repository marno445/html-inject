
javascript:(function() {
    // Mencegah duplikasi UI
    if (document.getElementById("iosGlassStudio")) return;

    const DRAFT = "IOS_GLASS_DRAFT_HTML";

    // CSS bergaya iOS / Apple Glassmorphism (Dioptimalkan untuk Mobile/Android)
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');

    #iosGlassStudio {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(5px);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        opacity: 0;
        animation: iosFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: none;
    }

    #iosGlassCard {
        position: relative;
        width: min(92vw, 720px);
        height: min(88vh, 650px);
        border-radius: 32px;
        background: rgba(30, 30, 30, 0.65);
        backdrop-filter: blur(40px) saturate(200%);
        -webkit-backdrop-filter: blur(40px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
        display: flex;
        flex-direction: column;
        color: #fff;
        transform: scale(0.9) translateY(20px);
        animation: iosSpringUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: auto;
        overflow: hidden;
    }

    #iosGlassCard::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; height: 100%;
        background: radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%);
        pointer-events: none;
        z-index: 0;
    }

    @keyframes iosFadeIn { to { opacity: 1; } }
    @keyframes iosSpringUp { to { transform: scale(1) translateY(0); } }
    @keyframes iosFadeOut { to { opacity: 0; transform: scale(0.95); } }

    #iosTopBar {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        z-index: 1;
        touch-action: none; /* Mencegah layar ikut scroll saat elemen digeser di Android */
    }
    #iosTopBar:active { cursor: grabbing; }

    .ios-header-info { display: flex; align-items: center; gap: 14px; }
    
    .ios-icon-box {
        width: 44px; height: 44px;
        background: linear-gradient(135deg, #0A84FF, #5E5CE6);
        border-radius: 14px;
        display: flex; justify-content: center; align-items: center;
        box-shadow: 0 8px 20px rgba(10, 132, 255, 0.4);
        border: 1px solid rgba(255,255,255,0.2);
    }
    .ios-icon-box svg { width: 22px; height: 22px; fill: white; }

    .ios-titles h3 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: 0.3px; }
    .ios-titles p { margin: 2px 0 0; font-size: 12px; color: rgba(255,255,255,0.6); }

    #iosContent {
        padding: 16px 20px;
        display: flex; flex-direction: column; gap: 14px; flex: 1; z-index: 1;
    }

    #iosEditor {
        flex: 1;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 16px;
        color: #A9DC76;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: none;
        outline: none;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
        transition: border 0.3s;
        -webkit-overflow-scrolling: touch;
    }
    #iosEditor:focus { border-color: #0A84FF; }
    #iosEditor::placeholder { color: rgba(255,255,255,0.3); }

    .ios-actions { display: flex; gap: 10px; }

    .ios-btn {
        flex: 1; height: 48px;
        border: none; border-radius: 14px;
        font-size: 14px; font-weight: 600; letter-spacing: 0.3px;
        cursor: pointer;
        display: flex; justify-content: center; align-items: center; gap: 6px;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(10px);
    }
    .ios-btn:active { transform: scale(0.96); }
    .ios-btn svg { width: 18px; height: 18px; }

    .btn-exec { background: #0A84FF; color: white; box-shadow: 0 4px 15px rgba(10,132,255,0.3); }
    .btn-restore { background: rgba(255, 69, 58, 0.15); color: #FF453A; border: 1px solid rgba(255, 69, 58, 0.3); }
    .btn-close { background: rgba(255, 255, 255, 0.1); color: white; }

    /* Toast Notification Apple Style */
    .ios-toast {
        position: fixed; top: 40px; left: 50%; transform: translateX(-50%) translateY(-20px);
        background: rgba(30, 30, 30, 0.85); backdrop-filter: blur(20px);
        color: white; padding: 12px 24px; border-radius: 30px;
        font-size: 14px; font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        opacity: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 2147483647; pointer-events: none;
    }
    .ios-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* Loading Overlay */
    #iosLoader {
        position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 10; border-radius: 32px; opacity: 0; transition: opacity 0.3s;
    }
    .spinner {
        width: 40px; height: 40px;
        border: 4px solid rgba(255,255,255,0.2); border-top-color: #0A84FF;
        border-radius: 50%; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    `;

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // Create UI
    const ui = document.createElement("div");
    ui.id = "iosGlassStudio";
    ui.innerHTML = `
        <div id="iosGlassCard">
            <div id="iosLoader">
                <div class="spinner"></div>
                <div style="margin-top: 16px; font-weight: 500; letter-spacing: 1px;">Injecting...</div>
            </div>
            <div id="iosTopBar">
                <div class="ios-header-info">
                    <div class="ios-icon-box">
                        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div class="ios-titles">
                        <h3>Glass Injector</h3>
                        <p>Android Dev Environment</p>
                    </div>
                </div>
            </div>
            <div id="iosContent">
                <textarea id="iosEditor" spellcheck="false" placeholder="<!-- Paste your HTML, CSS, JS here... -->"></textarea>
                <div class="ios-actions">
                    <button class="ios-btn btn-close" id="btn-close">Close</button>
                    <button class="ios-btn btn-restore" id="btn-restore">Restore</button>
                    <button class="ios-btn btn-exec" id="btn-exec">Execute</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    // State & Elements
    const editor = document.getElementById("iosEditor");
    const card = document.getElementById("iosGlassCard");
    const topBar = document.getElementById("iosTopBar");
    const loader = document.getElementById("iosLoader");
    let isInjected = false;

    // Load Draft
    editor.value = localStorage.getItem(DRAFT) || "";
    editor.addEventListener("input", () => localStorage.setItem(DRAFT, editor.value));

    // Toast Notification Function
    function showToast(msg) {
        const t = document.createElement("div");
        t.className = "ios-toast";
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => {
            t.classList.remove("show");
            setTimeout(() => t.remove(), 400);
        }, 2500);
    }

    // --- TOUCH & MOUSE DRAGGING LOGIC (Optimized for Android) ---
    let isDragging = false, startX, startY, initialX = 0, initialY = 0;
    
    const dragStart = (e) => {
        isDragging = true;
        // Deteksi apakah input dari touch (jari) atau mouse
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        startX = clientX - initialX;
        startY = clientY - initialY;
        card.style.transition = 'none'; // Matikan animasi saat jari menggeser
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Mencegah layar ikut ke-scroll saat mendrag
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        initialX = clientX - startX;
        initialY = clientY - startY;
        card.style.transform = `translate(${initialX}px, ${initialY}px) scale(1)`;
    };

    const dragEnd = () => {
        if (isDragging) {
            isDragging = false;
            card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'; // Kembalikan efek spring Apple
        }
    };

    // Event Listener untuk Mouse
    topBar.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove, { passive: false });
    window.addEventListener('mouseup', dragEnd);

    // Event Listener untuk Layar Sentuh Android (Touch)
    topBar.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);


    // --- TOMBOL LOGIC ---

    // Close Button (Hanya menyembunyikan UI, HTML yang diinject tetap berjalan)
    document.getElementById("btn-close").onclick = () => {
        card.style.animation = "iosFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        ui.style.animation = "iosFadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        setTimeout(() => ui.style.display = "none", 400);
        if(isInjected) showToast("Studio hidden. HTML is still running.");
    };

    // Execute Logic (Menggunakan Fullscreen iFrame agar web asli tetap aman di background)
    document.getElementById("btn-exec").onclick = () => {
        const htmlCode = editor.value.trim();
        if (!htmlCode) return showToast("⚠️ Code is empty!");

        loader.style.display = "flex";
        requestAnimationFrame(() => loader.style.opacity = "1");

        setTimeout(() => {
            const oldFrame = document.getElementById("injectedGlassFrame");
            if(oldFrame) oldFrame.remove();

            // Sembunyikan isi web asli
            Array.from(document.body.children).forEach(child => {
                if(child.id !== "iosGlassStudio" && child.tagName !== "STYLE" && child.tagName !== "SCRIPT") {
                    if(!child.hasAttribute('data-original-display')) {
                        child.setAttribute('data-original-display', getComputedStyle(child).display);
                    }
                    child.style.display = "none";
                }
            });

            // Buat iFrame layar penuh untuk inject
            const iframe = document.createElement("iframe");
            iframe.id = "injectedGlassFrame";
            iframe.style.cssText = "position:fixed; inset:0; width:100vw; height:100vh; border:none; z-index:2147483646; background:#fff;";
            document.body.appendChild(iframe);

            iframe.contentDocument.open();
            iframe.contentDocument.write(htmlCode);
            iframe.contentDocument.close();

            isInjected = true;
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 300);
            
            // Otomatis sembunyikan kotak script
            document.getElementById("btn-close").click();
            showToast("🚀 Injection Successful!");

        }, 800);
    };

    // Restore Logic (Menghapus iFrame dan mengembalikan web asli)
    document.getElementById("btn-restore").onclick = () => {
        if (!isInjected) return showToast("Nothing to restore.");
        
        const iframe = document.getElementById("injectedGlassFrame");
        if(iframe) iframe.remove();

        // Munculkan kembali isi web asli
        Array.from(document.body.children).forEach(child => {
            if(child.hasAttribute('data-original-display')) {
                child.style.display = child.getAttribute('data-original-display');
            }
        });

        isInjected = false;
        showToast("♻️ Page Restored");
    };

    showToast("Glass Studio Ready ✨");
})();

