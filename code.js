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
    const mlt = 4 * Math.sqrt(s) * 1.35 / 100;
    const w1 = stdDiameter(d1);
    const w2 = stdDiameter(d2);
    const a1 = Math.PI * w1 * w1 / 4;
    const a2 = Math.PI * w2 * w2 / 4;
    const len1 = n1 * mlt;
    const len2 = n2 * mlt;
    const r1 = 0.0172 * len1 / a1;
    const r2 = 0.0172 * len2 / a2;
    const m1 = a1 * len1 * 8.9;
    const m2 = a2 * len2 * 8.9;
    const loss = i1 * i1 * r1 + i2 * i2 * r2;
    const rTotal = r2 + r1 * Math.pow(n2 / n1, 2);
    const drop = i2 * rTotal;
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
    document.getElementById("tr-w1").textContent = standardWire(d1);
    document.getElementById("tr-w2").textContent = standardWire(d2);
    document.getElementById("tr-len1").textContent = lesn1.toFixed(1);
    document.getElementById("tr-m1").textContent = m1.toFixed(0);
    document.getElementById("tr-r1").textContent = r1.toFixed(2);
    document.getElementById("tr-len2").textContent = len2.toFixed(1);
    document.getElementById("tr-m2").textContent = m2.toFixed(0);
    document.getElementById("tr-r2").textContent = r2.toFixed(3);
    document.getElementById("tr-loss").textContent = loss.toFixed(2);
    document.getElementById("tr-drop").textContent = drop.toFixed(2);
}
document.getElementById("tr-calc").addEventListener("click", calcTransformer);

function calcRewind() {
    const u1 = parseFloat(document.getElementById("rw-u1").value);
    const testTurns = parseFloat(document.getElementById("rw-test-turns").value);
    const testVolt = parseFloat(document.getElementById("rw-test-volt").value);
    const u2 = parseFloat(document.getElementById("rw-sec-volt").value);
    const i2 = parseFloat(document.getElementById("rw-sec-curr").value);
    const j = parseFloat(document.getElementById("rw-density").value);
    const a = parseFloat(document.getElementById("rw-core-a").value);
    const b = parseFloat(document.getElementById("rw-core-b").value);
    const error = document.getElementById("rw-error");

    if ([u1, testTurns, testVolt, u2, i2, j, a, b].some(v => isNaN(v) || v <= 0)) {
        error.textContent = "Please fill in all values (greater than 0).";
        return;
    }
    
    const n = testTurns / testVolt;
    const n1 = Math.round(u1 * n);
    const n2 = Math.round(u2 * n * 1.05);
    const d2 = 1.13 * Math.sqrt(i2 / j);
    const s = a * b / 100;
    const pMax = Math.pow(s / 1.2, 2) * 0.85;
    const p2 = u2 * i2;

    error.textContent = "";
    document.getElementById("rw-n").textContent = n.toFixed(2);
    document.getElementById("rw-n1").textContent = n1;
    document.getElementById("rw-n2").textContent = n2;
    document.getElementById("rw-d2").textContent = d2.toFixed(2);
    document.getElementById("rw-i2out").textContent = i2.toFixed(2);
    document.getElementById("rw-w2").textContent = standardWire(d2);
    document.getElementById("rw-s").textContent = s.toFixed(2);
    document.getElementById("rw-pmax").textContent = pMax.toFixed(1);

    const warning = document.getElementById("rw-warning");
    if (p2 > pMax) {
        warning.textContent = "Warning: " + p2.toFixed(1) + " W is more than this core can handle!";
        warning.style.color = "#ff6b6b";
    } else {
        warning.textContent = "OK: " + p2.toFixed(1) + " W is within the core's capacity.";
        warning.style.color = "#6bcf7f";
    }
}
document.getElementById("rw-calc").addEventListener("click", calcRewind);

const wireDiameters = [
    0.10, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.28, 0.30, 0.32,
    0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80,
    0.85, 0.90, 1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.80,
    2.00, 2.24, 2.50 
];
function buildWireTable() {
    const j = parseFloat(document.getElementById("wr-j").value);
    const body = document.getElementById("wr-body");
    body.innerHTML = "";

    wireDiameters.forEach(d => {
        const area = Math.PI * d * d / 4;
        const r = 0.0172 / area;
        const awg= Math.round(36 - 39 * Math.log(d / 0.127) / Math.log(92));
        const imax = area * j;

        const values = [
            d.toFixed(2),
            awg,
            area.toFixed(3),
            r.toFixed(3),
            isNaN(imax) ? "-" : imax.toFixed(2)
        ];

        const row = document.createElement("tr");
        values.forEach(v => {
            const cell = document.createElement("td");
            cell.textContent = v;
            row.appendChild(cell);
        });
        body.appendChild(row);
    });
}
document.getElementById("wr-j").addEventListener("input", buildWireTable);
buildWireTable();

function standardWire(d) {
    const w = wireDiameters.find(x => x >= d);
    if (w === undefined) {
        return "over 2.50 mm - use parallel wires";
    }
    const awg = Math.round(36 - 39 * Math.log(w / 0.127) / Math.log(92));
    return w.toFixed(2) + " mm (AWG " + awg + ")";
}
function stdDiameter(d) {
    const w = wireDiameters.find(x => x >= d);
    return w === undefined ? d : w;
}

function wireBelow(d) {
    const fits = wireDiameters.filter(x => x <= d);
    if (fits.length === 0) {
        return "less than 0.10 mm - too many turns for one layer";
    }
    const w = fits[fits.length - 1];
    const awg = Math.round(36 - 39 * Math.log(w / 0.127) / Math.log(92));
    const imax = Math.PI * w * w / 4 * 3;
    return w.toFixed(2) + " mm (AWG " + awg + "), max " + imax.toFixed(2) + " A";
}
    const coType = document.getElementById("co-type");
    coType.addEventListener("change", () => {
        const isToroid = coType.value ==="toroid";
        document.getElementById("co-solenoid").classList.toggle("hidden", isToroid);
        document.getElementById("co-toroid").classList.toggle("hidden", !isToroid);
    });
    const coMat = document.getElementById("co-mat");

    function updateSwatch() {
        const option = coMat.options[coMat.selectedIndex];
        const colors = option.dataset.color.split(",");
        const swatch = document.getElementById("co-swatch");

        if (colors.length === 1) {
            swatch.style.background = colors[0];
        } else {
            swatch.style.background = "conic-gradient(" + colors[0] +" 0 50%, " + colors[1] + " 50% 100%)";
        }
    }
    coMat.addEventListener("change", updateSwatch);
    updateSwatch();

    function calcCoil(mode) {
        const type = coType.value;
        const error = document.getElementById("co-error");
        let c;
        let space;
    if (type === "solenoid") {
        const d = parseFloat(document.getElementById("co-d").value);
        const len = parseFloat(document.getElementById("co-len").value);
        if ([d, len].some(v => isNaN(v) || v <= 0)) {
            error.textContent = "Please fill in coil diameter and length.";
            return;
        }
        c = d * d / (457.2 * d + 1016 * len);
        space = len;
    } else {
        const mu = parseFloat(document.getElementById("co-mat").value);
        const od = parseFloat(document.getElementById("co-od").value);
        const id = parseFloat(document.getElementById("co-id").value);
        const h = parseFloat(document.getElementById("co-h").value);
        if ([od, id, h].some(v => isNaN(v) || v <= 0) || od <= id) {
            error.textContent = "Please check core dimensions (outer must be bigger than inner).";
            return;
        }
        c = 0.2 * mu * h * Math.log(od / id) / 1000;
        space = Math.PI * id;
    }
    let n;
    if (mode === "turns") {
        const L = parseFloat(document.getElementById("co-l").value);
        if (isNaN(L) || L <= 0) {
            error.textContent = "Please enter the inductance.";
            return;
        }
        n = Math.max(1, Math.round(Math.sqrt(L / c)));
    } else {
        n = Math.round(parseFloat(document.getElementById("co-turns").value));
        if (isNaN(n) || n <= 0) {
            error.textContent = "Please enter  the number of turns.";
            return;
        }
    }
    const lReal = c * n * n;
    const wire = space /n;

    error.textContent = "";
    document.getElementById("co-n").textContent = n;
    document.getElementById("co-lreal").textContent = lReal.toFixed(2);
    document.getElementById("co-al").textContent = type === "toroid" ? (c * 1000).toFixed(2) : "-";
    document.getElementById("co-wire").textContent = wire.toFixed(2);
    document.getElementById("co-std").textContent = wireBelow(wire);
}

document.getElementById("co-find-n").addEventListener("click", () => calcCoil("turns"));
document.getElementById("co-find-l").addEventListener("click", () => calcCoil("inductance"));

