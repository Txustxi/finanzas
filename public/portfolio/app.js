/* global Chart */

(() => {
  const API_BASE = `${location.protocol}//${location.hostname}:${location.port || 80}`;

  // DOM refs
  const yearSpan = document.getElementById("year");
  const posBody  = document.getElementById("positions-body");
  const connStat = document.getElementById("connection-status");

  yearSpan.textContent = new Date().getFullYear();

  // =====================
  // REST helpers
  // =====================
  async function getJSON(path) {
    const r = await fetch(`${API_BASE}${path}`);
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  }

  // =====================
  // Render helpers
  // =====================
  function renderPositions(data) {
    posBody.innerHTML = "";
    data.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-3 py-1 font-mono">${p.ticker}</td>
        <td class="px-3 py-1 text-right">${p.quantity}</td>
        <td class="px-3 py-1 text-right">${p.price.toFixed(2)}</td>
        <td class="px-3 py-1 text-right">${(p.price * p.quantity).toFixed(2)}</td>
        <td class="px-3 py-1 text-right ${p.pl_pct >= 0 ? 'text-green-600' : 'text-red-600'}">${(p.pl_pct * 100).toFixed(2)}%</td>`;
      posBody.appendChild(tr);
    });
  }

  // =====================
  // Equity chart
  // =====================
  const ctx = document.getElementById("equity-chart").getContext("2d");
  const equityChart = new Chart(ctx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Equity", data: [], fill: false }] },
    options: { responsive: true, maintainAspectRatio: false }
  });

  function updateEquityCurve(point) {
    equityChart.data.labels.push(point.time);
    equityChart.data.datasets[0].data.push(point.equity);
    if (equityChart.data.labels.length > 200) {
      equityChart.data.labels.shift();
      equityChart.data.datasets[0].data.shift();
    }
    equityChart.update();
  }

  // =====================
  // WebSocket real‑time
  // =====================
  let ws;
  function connectWS() {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${location.host}/ws/stream`);
    ws.onopen = () => (connStat.textContent = "live");
    ws.onclose = () => {
      connStat.textContent = "offline";
      // Retry with backoff
      setTimeout(connectWS, 5_000);
    };
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "positions") renderPositions(msg.data);
      if (msg.type === "equity") updateEquityCurve(msg.data);
    };
  }

  // =====================
  // Init
  // =====================
  (async () => {
    try {
      const positions = await getJSON("/positions");
      renderPositions(positions);
      const hist = await getJSON("/equity?limit=100");
      hist.forEach(updateEquityCurve);
    } catch (err) {
      console.error(err);
    }
    connectWS();
  })();
})();
