(function() {
    const TARGET_NAME = 'testtttt';
    const WATCHED_DOMAIN = 'test-cookiebot.vercel.app';

    function startIntercepting() {
        // Kiểm tra xem đã chạy chưa để tránh lặp
        if (window.isInterceptingActive) return;
        
        console.log("%c[System] Kích hoạt chế độ đánh chặn Cookie...", "color: #00ffff; font-weight: bold;");

        const proto = Document.prototype.hasOwnProperty('cookie') ? Document.prototype : HTMLDocument.prototype;
        const cookieDescriptor = Object.getOwnPropertyDescriptor(proto, 'cookie');

        if (!cookieDescriptor) {
            console.error("Không thể truy cập thuộc tính cookie.");
            return;
        }

        window.isInterceptingActive = true;

        // --- BƯỚC 1: DỌN DẸP COOKIE GỐC ---
        const currentCookies = document.cookie.split(';');
        currentCookies.forEach(c => {
            const name = c.split('=')[0].trim();
            if (name !== 'CookieConsent' && name !== TARGET_NAME) {
                // Thử xóa ở mọi cấp độ (path/domain)
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${location.hostname};`;
            }
        });

        // --- BƯỚC 2: THIẾT LẬP BẪY ĐÁNH CHẶN ---
        Object.defineProperty(document, 'cookie', {
            get: function() { 
                return cookieDescriptor.get.call(document); 
            },
            set: function(val) {
                const stack = new Error().stack;
                // Nếu đúng "thằng" provider đó đang ghi
                if (stack && stack.includes(WATCHED_DOMAIN)) {
                    const parts = val.split(';');
                    const nameValue = parts[0].split('=');
                    if (nameValue.length > 1) {
                        const value = nameValue.slice(1).join('=');
                        // Ép tên thành testtttt và ghi đè
                        const newCookie = `${TARGET_NAME}=${value};path=/;${parts.slice(1).filter(p => !p.trim().toLowerCase().startsWith('path=')).join(';')}`;
                        
                        console.log(`%c[Intercepted] Đã ép ${nameValue[0].trim()} thành ${TARGET_NAME}`, "color: #ff00ff");
                        cookieDescriptor.set.call(document, newCookie);
                        return;
                    }
                }
                // Nếu là script khác thì cho qua bình thường
                cookieDescriptor.set.call(document, val);
            },
            configurable: true
        });
    }

    // --- BƯỚC 3: LOGIC KÍCH HOẠT (QUAN TRỌNG) ---

    // Trường hợp 1: Chờ User bấm Accept trên Banner
    window.addEventListener('CookiebotOnAccept', function() {
        console.log("Sự kiện: User vừa bấm Accept.");
        startIntercepting();
    });

    // Trường hợp 2: User đã Accept từ trước (đã có cookie consent trong máy)
    // Kiểm tra định kỳ cho đến khi đối tượng Cookiebot sẵn sàng
    const checkConsent = setInterval(() => {
        if (window.Cookiebot && window.Cookiebot.consented) {
            console.log("Trạng thái: Đã có Consent từ trước.");
            startIntercepting();
            clearInterval(checkConsent);
        }
    }, 500);

    // Dừng kiểm tra sau 10 giây để tránh tốn tài nguyên
    setTimeout(() => clearInterval(checkConsent), 10000);

})();