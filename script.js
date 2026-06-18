// Tunggu sampai seluruh halaman HTML selesai dimuat sebelum menjalankan JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. INISIALISASI ELEMEN & VARIABEL UTAMA
    // ==========================================
    const body = document.body;
    const globalVibeToggle = document.getElementById('global-vibe-toggle');
    const menuContainer = document.getElementById('menu-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navigationMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const bookingForm = document.getElementById('whatsapp-booking-form');
    
    // Elemen untuk mengubah konten di bagian Hero secara dinamis (Pagi/Sore)
    const heroBadge = document.getElementById('dynamic-hero-badge');
    const heroTitle = document.getElementById('dynamic-hero-title');
    const heroDesc = document.getElementById('dynamic-hero-desc');
    const heroPrimaryCta = document.getElementById('hero-primary-cta');
    const heroSecondaryCta = document.getElementById('hero-secondary-cta');
    const promoTitle = document.getElementById('promo-title');
    const promoDesc = document.getElementById('promo-desc');
    
    // Elemen formulir pemesanan
    const bookingVibe = document.getElementById('booking-vibe');
    const bookingNotes = document.getElementById('booking-notes');

    // Nomor WhatsApp tujuan pemesanan (Nomor HP Daffa)
    const WHATSAPP_NUMBER = "628988486988"; 

    // Atur tanggal default di formulir booking ke hari ini
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }

    // Tampilkan menu 'pagi' secara default saat pertama kali dimuat
    filterMenu('pagi');

    // ==========================================
    // 2. FITUR FILTER/SARING MENU
    // ==========================================
    // Fungsi utama untuk menyaring kartu menu berdasarkan kategori
    function filterMenu(category) {
        // Ganti status aktif pada tombol filter
        filterButtons.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            if (filterValue === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Saring setiap kartu menu di HTML
        menuCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            // Tampilkan kartu jika kategori filter cocok atau bernilai 'all'
            if (category === 'all' || cardCategory === category || cardCategory === 'all') {
                card.style.display = 'flex'; // Tampilkan
            } else {
                card.style.display = 'none'; // Sembunyikan
            }
        });
    }

    // Berikan event listener klik untuk setiap tombol filter menu
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedCategory = e.currentTarget.getAttribute('data-filter');
            filterMenu(selectedCategory);
        });
    });

    // ==========================================
    // 3. FITUR TOMBOL SWITCHER VIBE (PAGI / SORE)
    // ==========================================
    globalVibeToggle.addEventListener('click', () => {
        // Cek apakah saat ini sedang mode pagi
        if (body.classList.contains('mode-pagi')) {
            // GANTI KE MODE SORE
            body.classList.remove('mode-pagi');
            body.classList.add('mode-sore');
            
            // Ubah teks dan ikon di bagian Hero
            heroBadge.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Mode Nongkrong Aktif`;
            heroTitle.innerHTML = `Akhiri Sore dengan <span class="highlight">Kehangatan Lofi & Obrolan</span>`;
            heroDesc.textContent = `Rasakan atmosfer lofi santai, permainan papan (board games), cireng bumbu rujak hangat, dan kopi seduh manual yang nikmat mulai jam 15:00 s.d. 22:00.`;
            
            // Ubah teks tombol CTA Hero
            heroPrimaryCta.innerHTML = `<i class="fa-solid fa-users"></i> Pesan Area Nongkrong`;
            heroSecondaryCta.innerHTML = `<i class="fa-solid fa-cookie-bite"></i> Lihat Menu Sore`;
            
            // Ubah isi kartu promo mengambang
            promoTitle.textContent = "Paket Santai Sore";
            promoDesc.textContent = "Beli Manual Brew + Cireng Rujak Diskon 15% (15:00 - 18:00)";
            
            // Otomatis filter menu makanan ke mode Sore
            filterMenu('sore');
            
            // Otomatis sesuaikan pilihan area di formulir booking
            if (bookingVibe) {
                bookingVibe.value = "Social Area (Semi-Outdoor)";
            }
        } else {
            // GANTI KE MODE PAGI
            body.classList.remove('mode-sore');
            body.classList.add('mode-pagi');
            
            // Ubah teks dan ikon di bagian Hero
            heroBadge.innerHTML = `<i class="fa-solid fa-briefcase"></i> Mode Produktif Aktif`;
            heroTitle.innerHTML = `Mulai Pagi dengan <span class="highlight">Fokus & Produktivitas</span>`;
            heroDesc.textContent = `Nikmati Wi-Fi berkecepatan tinggi, colokan listrik di setiap sudut, dan atmosfer tenang untuk bekerja jarak jauh (WFC) dari jam 09:00 s.d. 15:00.`;
            
            // Ubah teks tombol CTA Hero
            heroPrimaryCta.innerHTML = `<i class="fa-solid fa-chair"></i> Pesan Working Space`;
            heroSecondaryCta.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Lihat Menu Sarapan`;
            
            // Ubah isi kartu promo mengambang
            promoTitle.textContent = "Paket WFC Pagi";
            promoDesc.textContent = "Kopi Susu Aren + Butter Croissant hanya Rp40.000 (09:00 - 12:00)";
            
            // Otomatis filter menu makanan ke mode Pagi
            filterMenu('pagi');
            
            // Otomatis sesuaikan pilihan area di formulir booking
            if (bookingVibe) {
                bookingVibe.value = "Workspace Indoor (Silent)";
            }
        }
    });

    // ==========================================
    // 4. TOMBOL PESAN PADA KARTU MENU (AUTO FILL FORM)
    // ==========================================
    // Ambil semua tombol "Pesan Sekarang" di dalam kartu menu
    const bookingCtas = document.querySelectorAll('.menu-cta-booking');
    bookingCtas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            // Ambil nama menu dari atribut data-product
            const productName = e.currentTarget.getAttribute('data-product');
            // Masukkan teks ke kolom catatan pemesanan secara otomatis
            if (bookingNotes) {
                bookingNotes.value = `Saya ingin memesan menu: ${productName}`;
            }
        });
    });

    // ==========================================
    // 5. ACCORDION FAQ (TANYA JAWAB BISA DIKLIK)
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            // Tutup semua item accordion yang lain terlebih dahulu
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Jika sebelumnya tidak aktif, buka item yang di-klik
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. MENU NAVIGASI HP (TAMPILAN MOBILE)
    // ==========================================
    if (menuToggleBtn && navigationMenu) {
        menuToggleBtn.addEventListener('click', () => {
            navigationMenu.classList.toggle('mobile-active');
            const icon = menuToggleBtn.querySelector('i');
            
            // Ubah ikon hamburger ke silang (x) saat menu aktif
            if (navigationMenu.classList.contains('mobile-active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Tutup menu otomatis ketika salah satu link navigasi diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navigationMenu.classList.remove('mobile-active');
                const icon = menuToggleBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
                
                // Atur status class 'active' ke navigasi yang sedang dipilih
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // ==========================================
    // 7. SISTEM INTEGRASI FORMULIR RESERVASI KE WHATSAPP
    // ==========================================
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            // Cegah halaman dari reload saat form dikirim
            e.preventDefault();
            
            // Ambil semua data dari kolom input
            const name = document.getElementById('booking-name').value.trim();
            const phone = document.getElementById('booking-phone').value.trim();
            const dateVal = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            const pax = document.getElementById('booking-pax').value;
            const vibe = bookingVibe ? bookingVibe.value : '';
            const notes = bookingNotes ? bookingNotes.value.trim() : '';
            
            // Konversi format tanggal YYYY-MM-DD ke DD/MM/YYYY khas Indonesia
            const dateParts = dateVal.split('-');
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : dateVal;
    
            // Susun teks pesan WhatsApp dengan format yang rapi dan menarik
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
    
            // Ubah teks pesan menjadi format URL yang aman (URL encoding)
            const encodedMessage = encodeURIComponent(message);
            
            // Buat tautan WhatsApp API
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
            
            // Buka WhatsApp di tab peramban baru
            window.open(whatsappUrl, '_blank');
            
            // Tampilkan notifikasi konfirmasi ke pengguna
            alert("Terima kasih! Pemesanan Anda telah disiapkan. Halaman ini akan mengalihkan Anda ke WhatsApp.");
        });
    }
});
