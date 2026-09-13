/* ==========================================
   SUARA RAKYAT V1
   ========================================== */


/* ================= DATA ================= */

const defaultReports = [
  {
    id: 1,
    title: "Jalan berlubang di Jalan Merdeka",
    category: "Infrastruktur",
    location: "Jalan Merdeka",
    description:
      "Terdapat beberapa lubang yang cukup mengganggu pengguna jalan, terutama saat malam hari.",
    supports: 127,
    status: "progress",
    createdAt: Date.now() - 86400000 * 2
  },

  {
    id: 2,
    title: "Sampah menumpuk di dekat pasar",
    category: "Kebersihan",
    location: "Area Pasar Utama",
    description:
      "Sampah terlihat menumpuk dan belum diangkut selama beberapa hari.",
    supports: 94,
    status: "new",
    createdAt: Date.now() - 86400000
  },

  {
    id: 3,
    title: "Lampu penerangan jalan mati",
    category: "Fasilitas Umum",
    location: "Jalan Kenanga",
    description:
      "Beberapa lampu penerangan jalan tidak menyala sehingga area menjadi cukup gelap.",
    supports: 81,
    status: "progress",
    createdAt: Date.now() - 3600000 * 8
  },

  {
    id: 4,
    title: "Halte bus membutuhkan perbaikan",
    category: "Transportasi",
    location: "Halte Sentral",
    description:
      "Atap halte mengalami kerusakan dan tempat duduk sudah kurang layak.",
    supports: 65,
    status: "new",
    createdAt: Date.now() - 3600000 * 5
  },

  {
    id: 5,
    title: "Taman lingkungan perlu dibersihkan",
    category: "Lingkungan",
    location: "Taman RW 04",
    description:
      "Rumput sudah cukup tinggi dan beberapa bagian taman dipenuhi sampah.",
    supports: 43,
    status: "done",
    createdAt: Date.now() - 86400000 * 4
  },

  {
    id: 6,
    title: "Tempat sampah umum sudah rusak",
    category: "Kebersihan",
    location: "Lapangan Kecamatan",
    description:
      "Beberapa tempat sampah umum sudah rusak sehingga sampah sering berserakan.",
    supports: 36,
    status: "new",
    createdAt: Date.now() - 3600000 * 2
  }
];


let reports = JSON.parse(
  localStorage.getItem("suaraRakyatReports")
) || defaultReports;


let supportedReports = JSON.parse(
  localStorage.getItem("supportedReports")
) || [];


/* ================= SAVE ================= */

function saveData() {

  localStorage.setItem(
    "suaraRakyatReports",
    JSON.stringify(reports)
  );

  localStorage.setItem(
    "supportedReports",
    JSON.stringify(supportedReports)
  );
}


/* ================= MENU ================= */

function toggleMenu() {

  document
    .getElementById("navMenu")
    .classList.toggle("open");
}


/* ================= MODAL ================= */

function openReportModal() {

  document
    .getElementById("reportModal")
    .classList.add("show");

  document.body.style.overflow = "hidden";
}


function closeReportModal() {

  document
    .getElementById("reportModal")
    .classList.remove("show");

  document.body.style.overflow = "";
}


function closeDetail() {

  document
    .getElementById("detailModal")
    .classList.remove("show");

  document.body.style.overflow = "";
}


/* ================= FORM ================= */

document
  .getElementById("reportForm")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    const title =
      document.getElementById("reportTitle").value.trim();

    const category =
      document.getElementById("reportCategory").value;

    const location =
      document.getElementById("reportLocation").value.trim();

    const description =
      document.getElementById("reportDescription").value.trim();


    const newReport = {

      id: Date.now(),

      title: title,

      category: category,

      location: location,

      description: description,

      supports: 0,

      status: "new",

      createdAt: Date.now()

    };


    reports.unshift(newReport);

    saveData();

    renderReports();

    updateStatistics();

    this.reset();

    closeReportModal();

    showToast("✅ Laporan berhasil dibuat!");

    document
      .getElementById("laporan")
      .scrollIntoView({ behavior: "smooth" });

  });


/* ================= RENDER REPORTS ================= */

function renderReports() {

  const container =
    document.getElementById("reportsContainer");

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase()
      .trim();

  const category =
    document
      .getElementById("categoryFilter")
      .value;

  const sort =
    document
      .getElementById("sortFilter")
      .value;


  let filtered = reports.filter(report => {

    const matchesSearch =
      report.title.toLowerCase().includes(search) ||
      report.description.toLowerCase().includes(search) ||
      report.location.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" ||
      report.category === category;

    return matchesSearch && matchesCategory;

  });


  if (sort === "popular") {

    filtered.sort(
      (a, b) => b.supports - a.supports
    );

  } else {

    filtered.sort(
      (a, b) => b.createdAt - a.createdAt
    );

  }


  container.innerHTML = "";


  const empty =
    document.getElementById("emptyState");


  if (filtered.length === 0) {

    empty.classList.remove("hidden");

    return;

  }


  empty.classList.add("hidden");


  filtered.forEach(report => {

    container.appendChild(
      createReportCard(report)
    );

  });

}


/* ================= CARD ================= */

function createReportCard(report) {

  const card =
    document.createElement("article");

  card.className = "report-card";


  const statusText = {

    new: "Baru",

    progress: "Ditindaklanjuti",

    done: "Selesai"

  };


  const isSupported =
    supportedReports.includes(report.id);


  card.innerHTML = `

    <div class="report-top">

      <span class="category">
        ${getCategoryIcon(report.category)}
        ${report.category}
      </span>

      <span class="status ${report.status}">
        ${statusText[report.status]}
      </span>

    </div>


    <h3>
      ${escapeHTML(report.title)}
    </h3>


    <p class="report-description">
      ${escapeHTML(report.description)}
    </p>


    <div class="location">
      📍 ${escapeHTML(report.location)}
    </div>


    <div class="report-footer">

      <button
        class="support-btn ${isSupported ? "supported" : ""}"
        onclick="toggleSupport(${report.id})"
      >
        ${isSupported ? "👍 Didukung" : "👍 Dukung"}
        · ${report.supports}
      </button>


      <div>

        <button
          class="detail-btn"
          onclick="showDetail(${report.id})"
        >
          Lihat detail →
        </button>

        <div class="time">
          ${timeAgo(report.createdAt)}
        </div>

      </div>

    </div>

  `;


  return card;
}


/* ================= SUPPORT ================= */

function toggleSupport(id) {

  const report =
    reports.find(item => item.id === id);

  if (!report) return;


  if (supportedReports.includes(id)) {

    report.supports--;

    supportedReports =
      supportedReports.filter(
        item => item !== id
      );

    showToast("Dukungan dibatalkan.");

  } else {

    report.supports++;

    supportedReports.push(id);

    showToast("👍 Dukungan berhasil diberikan!");

  }


  saveData();

  renderReports();

  updateStatistics();

}


/* ================= DETAIL ================= */

function showDetail(id) {

  const report =
    reports.find(item => item.id === id);

  if (!report) return;


  const statusText = {

    new: "🟠 Laporan Baru",

    progress: "🔵 Sedang Ditindaklanjuti",

    done: "🟢 Laporan Selesai"

  };


  document.getElementById("detailBody").innerHTML = `

    <div class="detail-category">

      <span class="category">
        ${getCategoryIcon(report.category)}
        ${report.category}
      </span>

    </div>


    <h2>
      ${escapeHTML(report.title)}
    </h2>


    <span class="status ${report.status}">
      ${statusText[report.status]}
    </span>


    <p class="detail-description">
      ${escapeHTML(report.description)}
    </p>


    <div class="detail-meta">

      <p>📍 <strong>Lokasi:</strong>
        ${escapeHTML(report.location)}
      </p>

      <p>🕐 <strong>Dibuat:</strong>
        ${timeAgo(report.createdAt)}
      </p>

      <p>👍 <strong>Dukungan:</strong>
        ${report.supports} warga
      </p>

    </div>


    <div class="detail-support">

      <button
        class="support-btn ${
          supportedReports.includes(report.id)
            ? "supported"
            : ""
        }"
        onclick="toggleSupport(${report.id}); showDetail(${report.id})"
      >
        👍 ${
          supportedReports.includes(report.id)
            ? "Didukung"
            : "Saya Mendukung"
        }
        · ${report.supports}
      </button>

    </div>

  `;


  document
    .getElementById("detailModal")
    .classList.add("show");

  document.body.style.overflow = "hidden";
}


/* ================= STATISTICS ================= */

function updateStatistics() {

  const total =
    reports.length;


  const solved =
    reports.filter(
      report => report.status === "done"
    ).length;


  const supports =
    reports.reduce(
      (sum, report) => sum + report.supports,
      0
    );


  document.getElementById(
    "totalReports"
  ).textContent = total;


  document.getElementById(
    "solvedReports"
  ).textContent = solved;


  document.getElementById(
    "totalSupports"
  ).textContent = supports;


  renderCategoryStats();

  renderPopularReports();

}


/* ================= CATEGORY STATS ================= */

function renderCategoryStats() {

  const categories = {

    "Infrastruktur": 0,
    "Kebersihan": 0,
    "Transportasi": 0,
    "Fasilitas Umum": 0,
    "Lingkungan": 0,
    "Lainnya": 0

  };


  reports.forEach(report => {

    if (categories[report.category] !== undefined) {

      categories[report.category]++;

    }

  });


  const max =
    Math.max(...Object.values(categories), 1);


  const container =
    document.getElementById("categoryStats");


  container.innerHTML = "";


  Object.entries(categories).forEach(
    ([name, count]) => {

      const percent =
        Math.round((count / max) * 100);


      container.innerHTML += `

        <div class="category-row">

          <div class="category-info">

            <span>
              ${getCategoryIcon(name)}
              ${name}
            </span>

            <strong>
              ${count}
            </strong>

          </div>

          <div class="progress-bar">

            <div
              class="progress-fill"
              style="width:${percent}%"
            ></div>

          </div>

        </div>

      `;

    }
  );

}


/* ================= POPULAR ================= */

function renderPopularReports() {

  const popular =
    [...reports]
      .sort((a, b) => b.supports - a.supports)
      .slice(0, 4);


  const container =
    document.getElementById("popularReports");


  container.innerHTML = "";


  popular.forEach((report, index) => {

    container.innerHTML += `

      <div class="popular-item">

        <div class="rank">
          ${["🥇","🥈","🥉","4️⃣"][index]}
        </div>

        <div>

          <h4>
            ${escapeHTML(report.title)}
          </h4>

          <p>
            ${report.supports} dukungan ·
            ${report.category}
          </p>

        </div>

      </div>

    `;

  });

}


/* ================= HELPERS ================= */

function getCategoryIcon(category) {

  const icons = {

    "Infrastruktur": "🚧",

    "Kebersihan": "🗑️",

    "Transportasi": "🚌",

    "Fasilitas Umum": "🏫",

    "Lingkungan": "🌳",

    "Lainnya": "📌"

  };

  return icons[category] || "📌";

}


function timeAgo(timestamp) {

  const seconds =
    Math.floor(
      (Date.now() - timestamp) / 1000
    );


  if (seconds < 60)
    return "Baru saja";


  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60)
    return `${minutes} menit lalu`;


  const hours =
    Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} jam lalu`;


  const days =
    Math.floor(hours / 24);

  if (days < 30)
    return `${days} hari lalu`;


  return `${Math.floor(days / 30)} bulan lalu`;

}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* ================= TOAST ================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");


  toast.textContent = message;

  toast.classList.add("show");


  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


/* ================= MODAL OUTSIDE CLICK ================= */

window.addEventListener("click", function(event) {

  const reportModal =
    document.getElementById("reportModal");

  const detailModal =
    document.getElementById("detailModal");


  if (event.target === reportModal) {

    closeReportModal();

  }


  if (event.target === detailModal) {

    closeDetail();

  }

});


/* ================= START ================= */

renderReports();

updateStatistics();