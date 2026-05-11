const menu = document.getElementById("menu-toggle");
// const fxContact = document.querySelector(".fx-contact");

document.addEventListener("touchmove", function (e) {
    if (
        document.body.classList.contains("menu-open")
        // document.body.classList.contains("menu-open") ||
        // document.body.classList.contains("fix-open")
    ) {
        if (
            (!menu.contains(e.target)) &&
            (!fxContact.contains(e.target))
        ) {
            e.preventDefault();
        }
    }
}, { passive: false });

menu.addEventListener("touchstart", function (e) {
    let start = this.scrollTop;

    if (start <= 0) this.scrollTop = 1;

    if (start + this.offsetHeight >= this.scrollHeight) {
        this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
    }
});

// fxContact.addEventListener("touchstart", function (e) {
//     let start = this.scrollTop;

//     if (start <= 0) this.scrollTop = 1;

//     if (start + this.offsetHeight >= this.scrollHeight) {
//         this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
//     }
// });
