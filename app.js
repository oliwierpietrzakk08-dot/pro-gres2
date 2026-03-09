document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const primaryNav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    navToggle.addEventListener('click', () => {
        const visibility = primaryNav.getAttribute('data-visible');
        if (visibility === "false") {
            primaryNav.setAttribute('data-visible', true);
            navToggle.setAttribute('aria-expanded', true);
            navToggle.innerHTML = '<i class="ph ph-x"></i>'; // Close icon
            document.body.classList.add('nav-open');
        } else {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            navToggle.innerHTML = '<i class="ph ph-list"></i>'; // Hamburger icon
            document.body.classList.remove('nav-open');
        }
    });

    // Close mobile nav when clicking a link
    primaryNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            navToggle.innerHTML = '<i class="ph ph-list"></i>';
            document.body.classList.remove('nav-open');
        });
    });

    // Close on backdrop click (for mobile)
    document.addEventListener('click', (e) => {
        if(document.body.classList.contains('nav-open') && 
           !primaryNav.contains(e.target) && 
           !navToggle.contains(e.target)) {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            navToggle.innerHTML = '<i class="ph ph-list"></i>';
            document.body.classList.remove('nav-open');
        }
    });

    // Navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.paddingBlock = '0.5rem';
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.paddingBlock = '1rem';
            navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }
    });

    // Dynamic Gallery Loading
    loadGalleryImages();
});

// Function to load actual UUID images directly from the root repository folder
async function loadGalleryImages() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    // Użytkownik przyniósł uproszczone pliki `1.jpg` do `11.jpg` w katalogu głównym
    const maxFiles = 11;

    galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Ładowanie zdjęć...</div>';
    
    // Helper to check if image exists
    const checkImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    const validImages = [];
    const extensionsToTry = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.webp'];

    for (let i = 1; i <= maxFiles; i++) {
        let found = false;
        
        // Try each extension until one loads
        for (const ext of extensionsToTry) {
            const path = `./${i}${ext}`;
            const exists = await checkImage(path);
            if (exists) {
                validImages.push({ src: path, label: `Realizacja ${i}` });
                found = true;
                break; // stop checking other extensions for this number
            }
        }
    }

    // Render results
    if (validImages.length > 0) {
        galleryContainer.innerHTML = validImages.map(img => createGalleryItemHTML(img)).join('');
    } else {
        galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Brak zdjęć do wyświetlenia. Upewnij się, że pliki 1.jpg do 11.jpg są w głównym folderze!</div>';
    }
}

function createGalleryItemHTML(imageObj) {
    return `
        <div class="gallery-item">
            <img src="${imageObj.src}" alt="${imageObj.label}" loading="lazy">
            <div class="gallery-overlay">
                <span>${imageObj.label}</span>
            </div>
        </div>
    `;
}
