(function () {
    console.log("%c[Interceptor Cookie] Script loaded", "color: cyan; font-weight: bold;");
    // 1. Hàm kích hoạt Interceptor
    function startIntercepting() {
        const TARGET_NAME = "testtttt";
        const WATCHED_DOMAIN = "127.0.0.1";

        const cookieDescriptor =
            Object.getOwnPropertyDescriptor(Document.prototype, "cookie") ||
            Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");

        // Tránh định nghĩa đè nhiều lần nếu user nhấn Accept nhiều lần
        if (window.isInterceptingActive) return;
        window.isInterceptingActive = true;

        Object.defineProperty(document, "cookie", {
            get: function () {
                return cookieDescriptor.get.call(document);
            },
            set: function (val) {
                const stack = new Error().stack;
                if (stack && stack.includes(WATCHED_DOMAIN)) {
                    const parts = val.split(";");
                    const nameValue = parts[0].split("=");
                    if (nameValue.length > 1) {
                        const value = nameValue.slice(1).join("=");
                        const newCookie = `${TARGET_NAME}=${value};${parts.slice(1).join(";")}`;
                        console.log(
                            `%c[Intercepted Post-Accept] ${WATCHED_DOMAIN} -> ${TARGET_NAME}`,
                            "color: lime",
                        );
                        cookieDescriptor.set.call(document, newCookie);
                        return;
                    }
                }
                cookieDescriptor.set.call(document, val);
            },
            configurable: true,
        });
    }

    // 2. Lắng nghe sự kiện từ Cookiebot
    window.addEventListener("CookiebotOnAccept", function () {
        console.log("User đã Accept. Bắt đầu đánh chặn cookie...");
        startIntercepting();
    });

    // 3. Trường hợp user đã accept từ trước (đã có cookie consent)
    window.addEventListener("load", function () {
        if (window.Cookiebot && Cookiebot.consented) {
            startIntercepting();
        }
    });
})();
