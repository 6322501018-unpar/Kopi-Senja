document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen HTML yang didefinisikan di atas
    const body = document.body;
    const globalVibeToggle = document.getElementById('global-vibe-toggle');
    const menuContainer = document.getElementById('menu-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navigationMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqAccordion = document.querySelector('.faq-accordion');
    const bookingForm = document.getElementById('whatsapp-booking-form');
    
    // Elemen untuk mengganti konten di bagian Hero secara dinamis
    const heroBadge = document.getElementById('dynamic-hero-badge');
    const heroTitle = document.getElementById('dynamic-hero-title');
    const heroDesc = document.getElementById('dynamic-hero-desc');
    const heroPrimaryCta = document.getElementById('hero-primary-cta');
    const heroSecondaryCta = document.getElementById('hero-secondary-cta');
    const floatingPromo = document.getElementById('dynamic-floating-promo');
    const promoTitle = document.getElementById('promo-title');
    const promoDesc = document.getElementById('promo-desc');
    
    // Elemen-elemen formulir pemesanan
    const bookingVibe = document.getElementById('booking-vibe');
    const bookingTime = document.getElementById('booking-time');
    
    // Tempat menyimpan data menu dari file JSON
    let menuData = [];

    // Nomor WhatsApp Daffa (Ketua Kelompok 1)
    // Silakan ganti nomor di bawah ini dengan nomor HP Daffa
    const WHATSAPP_NUMBER = "628988486988"; 

    // Panggil fungsi untuk ambil data menu saat halaman pertama dimuat
    fetchMenuData();

    // Atur tanggal default di formulir ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', today);
    document.getElementById('booking-date').value = today;

    // ==========================================
    // LOGIKA PENGUBAH SUASANA (PAGI / SORE)
    // ==========================================
    globalVibeToggle.addEventListener('click', () => {
        if (body.classList.contains('mode-pagi')) {
            switchVibe('sore');
        } else {
            switchVibe('pagi');
        }
    });

    function switchVibe(mode) {
        if (mode === 'sore') {
            body.classList.remove('mode-pagi');
            body.classList.add('mode-sore');
            
            // Ubah teks dan tombol hero sesuai mode pagi/sore
            heroBadge.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Mode Nongkrong Aktif`;
            heroTitle.innerHTML = `Akhiri Sore dengan <span class="highlight">Kehangatan Lofi & Obrolan</span>`;
            heroDesc.textContent = `Rasakan atmosfer lofi santai, permainan papan (board games), cireng bumbu rujak hangat, dan kopi seduh manual yang nikmat mulai jam 15:00 s.d. 22:00.`;
            
            heroPrimaryCta.innerHTML = `<i class="fa-solid fa-users"></i> Pesan Area Nongkrong`;
            heroSecondaryCta.innerHTML = `<i class="fa-solid fa-cookie-bite"></i> Lihat Menu Sore`;
            
            promoTitle.textContent = "Paket Santai Sore";
            promoDesc.textContent = "Beli Manual Brew + Cireng Rujak Diskon 15% (15:00 - 18:00)";
            
            // Otomatis filter menu makanan sesuai suasananya
            triggerMenuFilter('sore');
            
            // Otomatis ubah dropdown form booking sesuai pilihan suasana
            bookingVibe.value = "Social Area (Semi-Outdoor)";
            
        } else {
            body.classList.remove('mode-sore');
            body.classList.add('mode-pagi');
            
            // Ubah teks dan tombol hero sesuai mode pagi/sore
            heroBadge.innerHTML = `<i class="fa-solid fa-briefcase"></i> Mode Produktif Aktif`;
            heroTitle.innerHTML = `Mulai Pagi dengan <span class="highlight">Fokus & Produktivitas</span>`;
            heroDesc.textContent = `Nikmati Wi-Fi berkecepatan tinggi, colokan listrik di setiap sudut, dan atmosfer tenang untuk bekerja jarak jauh (WFC) dari jam 09:00 s.d. 15:00.`;
            
            heroPrimaryCta.innerHTML = `<i class="fa-solid fa-chair"></i> Pesan Working Space`;
            heroSecondaryCta.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Lihat Menu Sarapan`;
            
            promoTitle.textContent = "Paket WFC Pagi";
            promoDesc.textContent = "Kopi Susu Aren + Butter Croissant hanya Rp40.000 (09:00 - 12:00)";
            
            // Otomatis filter menu makanan sesuai suasananya
            triggerMenuFilter('pagi');
            
            // Otomatis ubah dropdown form booking sesuai pilihan suasana
            bookingVibe.value = "Workspace Indoor (Silent)";
        }
    }

    // ==========================================
    // AMBIL DATA MENU DARI FILE JSON & FILTERNYA
    // ==========================================
    function fetchMenuData() {
        fetch('menu.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal mengambil data menu');
                }
                return response.json();
            })
            .then(data => {
                menuData = data;
                // Tampilkan menu pagi dulu pas pertama kali load karena defaultnya mode-pagi
                renderMenu('pagi');
            })
            .catch(error => {
                console.error('Error loading menu:', error);
                menuContainer.innerHTML = `
                    <div class="menu-loading" style="color: #ef4444;">
                        <i class="fa-solid fa-circle-exclamation"></i> Gagal memuat data menu. Silakan segarkan halaman.
                    </div>
                `;
            });
    }

    function renderMenu(categoryFilter) {
        menuContainer.innerHTML = '';
        
        let filteredMenu = menuData;
        if (categoryFilter !== 'all') {
            filteredMenu = menuData.filter(item => item.category === categoryFilter || item.category === 'all');
        }
        
        if (filteredMenu.length === 0) {
            menuContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Tidak ada menu yang sesuai.</p>`;
            return;
        }

        filteredMenu.forEach(item => {
            const card = document.createElement('article');
            card.className = 'menu-card';
            
            const badgeHTML = item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : '';
            const priceFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price);
            
            card.innerHTML = `
                <div class="menu-img-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="menu-img" loading="lazy">
                    ${badgeHTML}
                </div>
                <div class="menu-info">
                    <div class="menu-title-row">
                        <h4>${item.name}</h4>
                        <span class="menu-price">${priceFormatted}</span>
                    </div>
                    <p>${item.description}</p>
                    <a href="#booking" class="menu-cta-booking" data-product="${item.name}">
                        <i class="fa-solid fa-cart-plus"></i> Pesan Sekarang
                    </a>
                </div>
            `;
            
            // Tambahkan event klik ke tombol pesan di dalam kartu menu
            const bookingCta = card.querySelector('.menu-cta-booking');
            bookingCta.addEventListener('click', (e) => {
                const productName = e.currentTarget.getAttribute('data-product');
                document.getElementById('booking-notes').value = `Saya ingin memesan menu: ${productName}`;
            });

            menuContainer.appendChild(card);
        });
    }

    // Logika tombol tab filter menu
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.currentTarget.getAttribute('data-filter');
            
            // Hapus class active dari tombol lain
            filterButtons.forEach(b => b.classList.remove('active'));
            // Tambahkan class active ke tombol yang diklik
            e.currentTarget.classList.add('active');
            
            renderMenu(filterValue);
        });
    });

    function triggerMenuFilter(category) {
        filterButtons.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            if (filterValue === category) {
                btn.classList.add('active');
                renderMenu(category);
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ==========================================
    // INTERAKSI FAQ ACCORDION (BISA DIBUKA-TUTUP)
    // ==========================================
    if (faqAccordion) {
        faqAccordion.addEventListener('click', (e) => {
            const header = e.target.closest('.accordion-header');
            if (!header) return;
            
            const currentItem = header.parentElement;
            const allItems = faqAccordion.querySelectorAll('.accordion-item');
            
            // Ganti status aktif
            const isActive = currentItem.classList.contains('active');
            
            // Tutup semua accordion lainnya
            allItems.forEach(item => item.classList.remove('active'));
            
            // Kalau belum aktif, baru dibuka
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    }

    // ==========================================
    // MENU NAVIGASI HP (TAMPILAN MOBILE)
    // ==========================================
    menuToggleBtn.addEventListener('click', () => {
        navigationMenu.classList.toggle('mobile-active');
        const icon = menuToggleBtn.querySelector('i');
        if (navigationMenu.classList.contains('mobile-active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Tutup menu kalau ada link navigasi yang diklik
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigationMenu.classList.remove('mobile-active');
            const icon = menuToggleBtn.querySelector('i');
            icon.className = 'fa-solid fa-bars';
            
            // Ubah link active kalau diklik
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Fitur Scroll Spy (Ganti link aktif otomatis pas discroll)
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset + 120; // Jarak offset tinggi header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // SISTEM PESAN MEJA LANGSUNG KE WHATSAPP
    // ==========================================
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Ambil nilai input dari form
        const name = document.getElementById('booking-name').value.trim();
        const phone = document.getElementById('booking-phone').value.trim();
        const dateInput = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const pax = document.getElementById('booking-pax').value;
        const vibe = bookingVibe.value;
        const notes = document.getElementById('booking-notes').value.trim();
        
        // Format tanggal ke DD/MM/YYYY khas Indonesia
        const dateParts = dateInput.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Susun pesan WhatsApp kustom dengan rapi
        let message = `Halo Kedai Kopi Senja! 🌅\n\n`;
        message += `Saya ingin melakukan reservasi meja. Berikut detail data pemesanan saya:\n\n`;
        message += `👤 *Nama Lengkap:* ${name}\n`;
        message += `📞 *Nomor WhatsApp:* ${phone}\n`;
        message += `📅 *Tanggal Kunjungan:* ${formattedDate}\n`;
        message += `⏰ *Jam Tiba:* ${time} WIB\n`;
        message += `👥 *Jumlah Orang:* ${pax}\n`;
        message += `☕ *Pilihan Suasana:* ${vibe}\n`;
        
        if (notes !== "") {
            message += `📝 *Catatan Menu Tambahan:* ${notes}\n`;
        } else {
            message += `📝 *Catatan Menu Tambahan:* Tidak ada\n`;
        }
        
        message += `\nMohon konfirmasi ketersediaan tempatnya ya Kak. Terima kasih! 🙏`;

        // Encode teks agar bisa masuk URL WhatsApp
        const encodedMessage = encodeURIComponent(message);
        
        // Bikin URL WhatsApp API
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
        
        // Buka link di tab baru
        window.open(whatsappUrl, '_blank');
        
        // Tampilkan pop-up pemberitahuan ke user
        alert("Terima kasih! Anda akan dialihkan ke WhatsApp untuk menyelesaikan reservasi.");
    });
});
