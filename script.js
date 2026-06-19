const dataFiles = [
  "data/smallest-birds.json",
  "data/largest-birds.json",
  "data/common-birds.json",
  "data/extinct-birds.json"
];

const birdGrid = document.getElementById("birdGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const themeBtn = document.getElementById("themeBtn");
const birdOfDay = document.getElementById("birdOfDay");

let allBirds = [];

async function loadBirdData() {
  try {
    const requests = dataFiles.map(file => fetch(file).then(res => res.json()));
    const results = await Promise.all(requests);

    allBirds = results.flat();

    updateStats();
    displayBirdOfDay();
    displayBirds(allBirds);
  } catch (error) {
    birdGrid.innerHTML = `
      <p class="error">
        Bird data could not be loaded. Please check your data folder and JSON file names.
      </p>
    `;
    console.error(error);
  }
}

function updateStats() {
  document.getElementById("totalCount").textContent = allBirds.length;
  document.getElementById("livingCount").textContent =
    allBirds.filter(bird => bird.status === "Living").length;
  document.getElementById("extinctCount").textContent =
    allBirds.filter(bird => bird.status === "Extinct").length;
}

function displayBirdOfDay() {
  if (allBirds.length === 0) return;

  const today = new Date();
  const index = today.getDate() % allBirds.length;
  const bird = allBirds[index];

  birdOfDay.innerHTML = `
    <div class="day-card">
      <img src="${bird.image}" alt="${bird.name}">
      <div>
        <h3>${bird.name}</h3>
        <p><em>${bird.scientific_name}</em></p>
        <p>${bird.lifestyle}</p>
      </div>
    </div>
  `;
}

function displayBirds(birds) {
  birdGrid.innerHTML = "";

  if (birds.length === 0) {
    birdGrid.innerHTML = "<p>No birds found.</p>";
    return;
  }

  birds.forEach(bird => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openModal(bird);

    card.innerHTML = `
      <img src="${bird.image}" alt="${bird.name}">
      <div class="card-content">
        <span class="badge ${bird.status}">${bird.status}</span>
        <span class="badge category">${bird.category}</span>

        <h3>${bird.name}</h3>
        <p class="scientific">${bird.scientific_name}</p>

        <p><strong>Region:</strong> ${bird.region}</p>
        <p><strong>Habitat:</strong> ${bird.habitat}</p>
        <p><strong>Diet:</strong> ${bird.diet}</p>
        <p><strong>Lifestyle:</strong> ${bird.lifestyle}</p>

        ${
          bird.status === "Extinct"
          ? `<div class="reason"><strong>Extinction Reason:</strong> ${bird.extinction_reason}</div>`
          : ""
        }
      </div>
    `;

    birdGrid.appendChild(card);
  });
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const status = statusFilter.value;

  const filtered = allBirds.filter(bird => {
    const matchesSearch =
      bird.name.toLowerCase().includes(search) ||
      bird.scientific_name.toLowerCase().includes(search) ||
      bird.region.toLowerCase().includes(search) ||
      bird.habitat.toLowerCase().includes(search) ||
      bird.diet.toLowerCase().includes(search) ||
      bird.lifestyle.toLowerCase().includes(search);

    const matchesCategory = category === "all" || bird.category === category;
    const matchesStatus = status === "all" || bird.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  displayBirds(filtered);
}

function openModal(bird) {
  modal.style.display = "block";

  modalContent.innerHTML = `
    <img src="${bird.image}" alt="${bird.name}">
    <div class="modal-info">
      <span class="badge ${bird.status}">${bird.status}</span>
      <span class="badge category">${bird.category}</span>

      <h2>${bird.name}</h2>
      <p class="scientific">${bird.scientific_name}</p>

      <p><strong>Region:</strong> ${bird.region}</p>
      <p><strong>Habitat:</strong> ${bird.habitat}</p>
      <p><strong>Size:</strong> ${bird.size}</p>
      <p><strong>Wingspan:</strong> ${bird.wingspan}</p>
      <p><strong>Diet:</strong> ${bird.diet}</p>
      <p><strong>Lifestyle:</strong> ${bird.lifestyle}</p>
      <p><strong>Behavior:</strong> ${bird.behavior}</p>
      <p><strong>Special Fact:</strong> ${bird.special_fact}</p>

      ${
        bird.status === "Extinct"
        ? `<div class="reason"><strong>Reason for Extinction:</strong> ${bird.extinction_reason}</div>`
        : `<p><strong>Conservation:</strong> ${bird.conservation}</p>`
      }
    </div>
  `;
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modal) {
    closeModal();
  }
};

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

loadBirdData();
