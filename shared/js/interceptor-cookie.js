function startIntercepting() {
    const TARGET_NAME = 'testtttt';
    const WATCHED_DOMAIN = 'test-cookiebot.vercel.app';
    const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                             Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

    if (window.isInterceptingActive) return;
    window.isInterceptingActive = true;

    // --- BƯỚC 1: DỌN DẸP COOKIE CŨ ---
    const currentCookies = document.cookie.split(';');
    currentCookies.forEach(c => {
        const name = c.split('=')[0].trim();
        // Nếu muốn dọn dẹp sạch sẽ các cookie cũ của provider này
        // (Lưu ý: Vì không biết cookie nào của ai, ta có thể lọc theo pattern hoặc xóa hết các cookie lạ)
        if (name !== 'CookieConsent' && name !== TARGET_NAME) {
            // Xóa cookie cũ bằng cách set expires về quá khứ
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${location.hostname};`;
        }
    });

    // --- BƯỚC 2: ĐÁNH CHẶN LỆNH GHI MỚI ---
    Object.defineProperty(document, 'cookie', {
        get: function() { return cookieDescriptor.get.call(document); },
        set: function(val) {
            const stack = new Error().stack;
            if (stack && stack.includes(WATCHED_DOMAIN)) {
                const parts = val.split(';');
                const nameValue = parts[0].split('=');
                if (nameValue.length > 1) {
                    const value = nameValue.slice(1).join('=');
                    // Ép tên về testtttt
                    const newCookie = `${TARGET_NAME}=${value};${parts.slice(1).join(';')}`;
                    cookieDescriptor.set.call(document, newCookie);
                    return;
                }
            }
            cookieDescriptor.set.call(document, val);
        },
        configurable: true
    });
}