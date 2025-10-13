// Load JSON dynamically
let current = 0;
let images = [];

async function loadProduct() {
    const res = await fetch("products.json");
    const data = await res.json();

    // Get product from URL ?id=dress1
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "dress1";
    const product = data.find(p => p.id === id);

    if (!product) return;

    images = product.images;

    const mainPhoto = document.getElementById("mainPhoto");
    const thumbs = document.getElementById("thumbs");

    mainPhoto.src = images[0];

    // Thumbnails
    images.forEach((img, i) => {
        const thumb = document.createElement("img");
        thumb.src = img;
        if (i === 0) thumb.classList.add("active");
        thumb.addEventListener("click", () => {
            mainPhoto.src = img;
            document.querySelectorAll(".thumbs-belt img").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
            current = i;
        });
        thumbs.appendChild(thumb);
    });

    // Product info
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = `$${product.price}`;
    document.getElementById("productDesc").textContent = product.desc;
    document.getElementById("productColors").innerHTML = `<strong>Colors:</strong> ${product.colors.join(", ")}`;
}

loadProduct();

// Lightbox
const mainPhoto = document.getElementById("mainPhoto");
const lightbox = document.getElementById("lightbox");
const lbImg = document.querySelector(".lightbox-image");
const lbClose = document.querySelector(".close");
const lbLeft = document.querySelector(".nav.left");
const lbRight = document.querySelector(".nav.right");
const lbCounter = document.querySelector(".counter");

mainPhoto.addEventListener("click", () => openLightbox(current));

function openLightbox(i) {
    lightbox.classList.add("visible");
    updateLightbox(i);
}

function updateLightbox(i) {
    lbImg.src = images[i];
    lbCounter.textContent = `${i + 1} / ${images.length}`;
}

function closeLightbox() { lightbox.classList.remove("visible"); }

lbClose.onclick = closeLightbox;
lbLeft.onclick = () => { current = (current - 1 + images.length) % images.length; updateLightbox(current); };
lbRight.onclick = () => { current = (current + 1) % images.length; updateLightbox(current); };
document.querySelector(".lb-overlay").addEventListener("click", closeLightbox);

// Swipe support for mobile
let startX = 0;
lbImg.addEventListener("touchstart", e => startX = e.touches[0].clientX);
lbImg.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) lbLeft.click();
    else if (startX - endX > 50) lbRight.click();
});
