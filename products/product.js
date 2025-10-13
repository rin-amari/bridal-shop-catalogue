document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id"); // e.g., ?id=dress1

    const mainPhoto = document.getElementById("mainPhoto");
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productDesc = document.getElementById("productDesc");
    const thumbsBelt = document.getElementById("thumbsBelt");

    const lightbox = document.getElementById("lightbox");
    const lbImg = document.querySelector(".lightbox-image");
    const lbClose = document.querySelector(".close");
    const lbLeft = document.querySelector(".nav.left");
    const lbRight = document.querySelector(".nav.right");
    const lbCounter = document.querySelector(".counter");

    let current = 0;
    let images = [];

    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (!product) return;

            productName.textContent = product.name;
            productPrice.textContent = `$${product.price.toLocaleString()}`;
            productDesc.textContent = product.desc;
            images = product.images;
            mainPhoto.src = images[0];

            // Thumbnails
            images.forEach((src, i) => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.classList.add('thumb');
                if (i === 0) thumb.classList.add('active');
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    mainPhoto.src = src;
                    current = i;
                });
                thumbsBelt.appendChild(thumb);
            });
        });

    // Lightbox
    mainPhoto.addEventListener('click', () => openLightbox(current));

    function openLightbox(index) {
        lightbox.classList.remove('hidden');
        updateLightbox(index);
    }

    function updateLightbox(i) {
        lbImg.src = images[i];
        lbCounter.textContent = `${i + 1} / ${images.length}`;
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
    }

    lbLeft.onclick = () => {
        current = (current - 1 + images.length) % images.length;
        updateLightbox(current);
    };

    lbRight.onclick = () => {
        current = (current + 1) % images.length;
        updateLightbox(current);
    };

    lbClose.onclick = closeLightbox;
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
});