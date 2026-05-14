const products = [
  { name: "Valora Cloud Sofa", category: "sofas", price: "$3,980", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=82" },
  { name: "Marble Axis Dining Set", category: "dining", price: "$5,420", image: "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=900&q=82" },
  { name: "Astra Walnut Bed", category: "bedroom", price: "$4,120", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=82" },
  { name: "Soren Executive Desk", category: "office", price: "$2,760", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=82" },
  { name: "Linea Floating TV Unit", category: "tv", price: "$1,690", image: "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=82" },
  { name: "Noir Stone Coffee Table", category: "coffee", price: "$1,240", image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=82" },
  { name: "Solara Outdoor Lounge", category: "outdoor", price: "$3,340", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=82" },
  { name: "Elan Wardrobe System", category: "wardrobes", price: "$2,980", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82" }
];

window.addEventListener("load", () => document.body.classList.add("loaded"));

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const topBtn = document.querySelector("#toTop");
  const themeBtn = document.querySelector("#themeToggle");
  const savedTheme = localStorage.getItem("luxe-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 24);
    topBtn?.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("luxe-theme", next);
  });
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.querySelectorAll(".btn-luxe, .btn-outline-luxe").forEach(btn => {
    btn.addEventListener("click", e => {
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      ripple.style.cssText = `position:absolute;border-radius:50%;transform:scale(0);animation:ripple .6s linear;background:rgba(255,255,255,.45);width:120px;height:120px;left:${e.clientX - rect.left - 60}px;top:${e.clientY - rect.top - 60}px;pointer-events:none;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  if (window.AOS) AOS.init({ duration: 850, once: true, offset: 90 });

  document.querySelectorAll("[data-counter]").forEach(counter => {
    const target = Number(counter.dataset.counter);
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const timer = setInterval(() => {
        value += step;
        counter.textContent = value >= target ? target : value;
        if (value >= target) clearInterval(timer);
      }, 18);
      observer.disconnect();
    });
    observer.observe(counter);
  });

  document.querySelectorAll(".swiper.best").forEach(el => new Swiper(el, {
    slidesPerView: 1.15,
    spaceBetween: 22,
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    breakpoints: { 768: { slidesPerView: 2.2 }, 992: { slidesPerView: 3.2 } }
  }));
  document.querySelectorAll(".swiper.testimonials").forEach(el => new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 22,
    autoplay: { delay: 4200 },
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    breakpoints: { 992: { slidesPerView: 3 } }
  }));
  document.querySelectorAll(".swiper.related").forEach(el => new Swiper(el, {
    slidesPerView: 1.2,
    spaceBetween: 20,
    breakpoints: { 768: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }
  }));

  const grid = document.querySelector("#productGrid");
  if (grid) renderProducts(products);
  document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const key = btn.dataset.filter;
    renderProducts(key === "all" ? products : products.filter(p => p.category === key));
  }));
  document.querySelector("#productSearch")?.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)));
  });

  document.querySelectorAll(".wishlist").forEach(btn => btn.addEventListener("click", () => btn.classList.toggle("active")));

  const mainImage = document.querySelector("#mainProductImage");
  document.querySelectorAll(".thumbs img").forEach(img => img.addEventListener("click", () => {
    document.querySelectorAll(".thumbs img").forEach(i => i.classList.remove("active"));
    img.classList.add("active");
    if (mainImage) mainImage.src = img.src;
  }));
  document.querySelectorAll(".color-dot").forEach(dot => dot.addEventListener("click", () => {
    document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
    dot.classList.add("active");
  }));
});

function renderProducts(list) {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;
  grid.innerHTML = list.map((p, i) => `
    <div class="col-sm-6 col-lg-4 col-xl-3" data-aos="fade-up" data-aos-delay="${i * 40}">
      <article class="product-card position-relative h-100">
        <button class="icon-btn wishlist" aria-label="Add ${p.name} to wishlist"><i class="fa-regular fa-heart"></i></button>
        <a href="product-detail.html" class="media-box"><img loading="lazy" src="${p.image}" alt="${p.name}"></a>
        <div class="p-3">
          <span class="badge badge-luxe mb-2">${labelFor(p.category)}</span>
          <h3 class="h5 mb-1">${p.name}</h3>
          <p class="lead-soft small mb-3">Hand-finished proportions, tactile materials, showroom-grade comfort.</p>
          <div class="d-flex align-items-center justify-content-between">
            <span class="price">${p.price}</span>
            <button class="btn btn-sm btn-outline-luxe" data-bs-toggle="modal" data-bs-target="#quickViewModal" data-name="${p.name}" data-image="${p.image}" data-price="${p.price}">Quick view</button>
          </div>
        </div>
      </article>
    </div>`).join("");
  grid.querySelectorAll(".wishlist").forEach(btn => btn.addEventListener("click", () => btn.classList.toggle("active")));
  grid.querySelectorAll("[data-bs-target='#quickViewModal']").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector("#quickViewTitle").textContent = btn.dataset.name;
      document.querySelector("#quickViewPrice").textContent = btn.dataset.price;
      document.querySelector("#quickViewImage").src = btn.dataset.image;
    });
  });
  if (window.AOS) AOS.refresh();
}

function labelFor(key) {
  return ({ sofas: "Luxury Sofas", dining: "Dining Sets", bedroom: "Bedroom", office: "Office", tv: "TV Units", coffee: "Coffee Tables", outdoor: "Outdoor", wardrobes: "Wardrobes" })[key] || key;
}

const style = document.createElement("style");
style.textContent = "@keyframes ripple{to{transform:scale(4);opacity:0}}";
document.head.appendChild(style);
