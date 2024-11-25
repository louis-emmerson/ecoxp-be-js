const today = new Date()
const dd = String(today.getDate()).padStart(2, "0")
const mm = String(today.getMonth() + 1).padStart(2, "0")
const yyyy = today.getFullYear()
const today_formatted = yyyy + "-" + mm + "-" + dd
Date.prototype.subtractDays = function (d) {
    this.setTime(this.getTime() - (d * 24 * 60 * 60 * 1000));
    return this;
}
let start = new Date();
start.subtractDays(35);

const dd_30 = String(start.getDate()).padStart(2, "0")
const mm_30 = String(start.getMonth() + 1).padStart(2, "0")
const yyyy_30 = today.getFullYear()
start = yyyy_30 + "-" + mm_30 + "-" + dd_30

console.log(today_formatted)
console.log(start)