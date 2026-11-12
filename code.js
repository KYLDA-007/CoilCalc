const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

function calcTransformer() {
    const u1 = parseFloat(document.getElementById("tr-u1").value);
    const f = parseFloat(document.getElementById("tr-f").value);
    const u2 = parseFloat(document.getElementById("tr-u2").value);
    const i2 = parseFloat(document.getElementById("tr-i2").value);
    const core = document.getElementById("tr-core").value;
    const j = parseFloat(document.getElementById("tr-j").value);
    const error = document.getElementById("tr-error");


    if ([u1, f, u2, i2, j].some(v => isNaN(v) || v <= 0)) {
        error.textContent = "Please fill in all values (greater than 0).";
        return;
    }
    const B = core === "toroid" ? 1.5 : 1.2;
    const k = core === "toroid" ? 1.0 : 1.2;
    const eff = core === "toroid" ? 0.9 : 0.85;

    const p2 = u2 * i2;
    const p1 = p2 / eff;
    const s = k * Math.sqrt(p1);
    const n = 10000 / (4.44 * f * B * s);
    const n1 = Math.round(u1 * n);
    const n2 = Math.round(u2 * n * 1.05);
    const i1 = p1 / u1;
    const d1 = 1.13 * Math.sqrt(i1 / j);
    const d2 = 1.13 * Math.sqrt(i2 / j);
    error.textContent = "";
    document.getElementById("tr-p2").textContent = p2.toFixed(1);
    document.getElementById("tr-p1").textContent = p1.toFixed(1);
    document.getElementById("tr-s").textContent = s.toFixed(2);
    document.getElementById("tr-n").textContent = n.toFixed(2);
    document.getElementById("tr-n1").textContent = n1;
    document.getElementById("tr-d1").textContent = d1.toFixed(2);
    document.getElementById("tr-i1").textContent = i1.toFixed(3);
    document.getElementById("tr-n2").textContent = n2;
    document.getElementById("tr-d2").textContent = d2.toFixed(2);
    document.getElementById("tr-i2out").textContent = i2.toFixed(2);
}
document.getElementById("tr-calc").addEventListener("click", calcTransformer);