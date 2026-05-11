/*!
 * ScriptName: shared.js
 * Version: 1.6
 *
 * Project: FC-Blog
 *
 * FoodConnection
 * http://foodconnection.jp/
 * http://foodconnection.vn/
 *
 */

document.querySelectorAll("time").forEach(el => {
    const date = new Date(el.textContent.replace(" ", "T") + "+09:00");

    const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Amsterdam",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const formatted = formatter.format(date).replace(",", "");
    el.textContent = formatted;
});