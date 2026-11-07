// Generator Email Web Client
// Menggunakan API Generator.email

const BASE_URL = 'https://generator.email';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Fungsi bantu untuk menampilkan hasil
function showResult(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `<div class="result ${type}">${message}</div>`;
    
    // Scroll ke hasil jika diperlukan
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fungsi bantu untuk menampilkan loading
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `<div class="result info"><span class="loading"></span>Loading...</div>`;
}

// Fungsi untuk mengambil token dan cookie dari halaman utama
async function initGenerator() {
    try {
        const response = await fetch(BASE_URL, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Ambil token dari meta tag
        const tokenMeta = doc.querySelector('meta[name="api-token"]');
        const token = tokenMeta ? tokenMeta.getAttribute('content') : null;
        
        // Ambil email default dari form
        const userInput = doc.getElementById('userName');
        const domainSelect = doc.getElementById('domainName2');
        
        const currentUser = userInput ? userInput.value : '';
        const currentDomain = domainSelect ? domainSelect.value : '';
        
        return {
            token,
            currentUser,
            currentDomain,
            email: currentUser && currentDomain ? `${currentUser}@${currentDomain}` : null
        };
    } catch (error) {
        console.error('Error initializing generator:', error);
        throw error;
    }
}

// Fungsi untuk mengenerate email baru
async function generateEmail() {
    try {
        showLoading('emailResult');
        
        const { token, currentUser, currentDomain, email } = await initGenerator();
        
        if (!token || !currentUser || !currentDomain) {
            throw new Error('Gagal menginisialisasi generator email');
        }
        
        // Cek uptime untuk email yang dihasilkan
        const uptimeResponse = await fetch(`${BASE_URL}/uptime.php`, {
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-API-Token': token,
                'Referer': BASE_URL
            },
            body: `dmn=${encodeURIComponent(currentDomain)}&usr=${encodeURIComponent(currentUser)}`
        });
        
        const uptimeData = await uptimeResponse.json();
        
        const resultHtml = `
            <h3>Email Baru Dibuat:</h3>
            <p><strong>${email}</strong></p>
            <p><strong>Uptime:</strong> ${uptimeData.uptime || 'Tidak tersedia'}</p>
            <div class="actions">
                <button onclick="checkInbox('${email}')" class="btn btn-secondary" style="margin-top: 10px;">Cek Inbox</button>
            </div>
        `;
        
        showResult('emailResult', resultHtml, 'success');
        
        // Simpan email terakhir ke localStorage
        localStorage.setItem('lastGeneratedEmail', email);
        
    } catch (error) {
        console.error('Error generating email:', error);
        showResult('emailResult', `❌ Gagal mengenerate email: ${error.message}`, 'error');
    }
}

// Fungsi untuk menggunakan email kustom
async function useCustomEmail() {
    try {
        const emailInput = document.getElementById('customEmail');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            showResult('customResult', '❌ Format email tidak valid. Gunakan format user@domain.com', 'error');
            return;
        }
        
        showLoading('customResult');
        
        // Redirect ke halaman email kustom
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(`${BASE_URL}/${encodedEmail}`, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': BASE_URL
            }
        });
        
        if (response.ok) {
            // Cek apakah email valid dengan mengambil halaman inbox
            const inboxResponse = await fetch(`${BASE_URL}/inbox7/`, {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Referer': `${BASE_URL}/${encodedEmail}`
                }
            });
            
            if (inboxResponse.ok) {
                const resultHtml = `
                    <h3>Email Kustom Digunakan:</h3>
                    <p><strong>${email}</strong></p>
                    <p>✅ Email berhasil diakses</p>
                    <div class="actions">
                        <button onclick="checkInbox('${email}')" class="btn btn-secondary" style="margin-top: 10px;">Cek Inbox</button>
                    </div>
                `;
                showResult('customResult', resultHtml, 'success');
                localStorage.setItem('lastGeneratedEmail', email);
            } else {
                throw new Error('Email tidak dapat diakses');
            }
        } else {
            throw new Error('Email tidak ditemukan atau tidak valid');
        }
        
    } catch (error) {
        console.error('Error using custom email:', error);
        showResult('customResult', `❌ Gagal menggunakan email kustom: ${error.message}`, 'error');
    }
}

// Fungsi untuk cek inbox email
async function checkInbox(email) {
    try {
        const emailToCheck = email || document.getElementById('inboxEmail').value.trim();
        
        if (!emailToCheck || !emailToCheck.includes('@')) {
            showResult('inboxResult', '❌ Masukkan email yang valid untuk cek inbox', 'error');
            return;
        }
        
        showLoading('inboxResult');
        
        // Ambil halaman inbox
        const response = await fetch(`${BASE_URL}/inbox7/`, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': `${BASE_URL}/${encodeURIComponent(emailToCheck)}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Gagal mengakses inbox');
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Ekstrak pesan dari HTML
        const messages = [];
        const messageElements = doc.querySelectorAll('#email-table .list-group-item');
        
        messageElements.forEach(el => {
            const from = el.querySelector('.from_div_45g45gg')?.textContent?.trim() || 'Tidak diketahui';
            const subject = el.querySelector('.subj_div_45g45gg')?.textContent?.trim() || '(tanpa subjek)';
            const time = el.querySelector('.time_div_45g45gg')?.textContent?.trim() || 'Waktu tidak diketahui';
            
            if (from !== 'Tidak diketahui' || subject !== '(tanpa subjek)') {
                messages.push({ from, subject, time });
            }
        });
        
        // Tampilkan hasil
        let resultHtml = `<h3>Inbox untuk ${emailToCheck}:</h3>`;
        
        if (messages.length === 0) {
            resultHtml += '<p>Tidak ada pesan baru</p>';
        } else {
            resultHtml += `<p><strong>Total pesan:</strong> ${messages.length}</p>`;
            
            // Tampilkan daftar pesan
            const messagesHtml = messages.map((msg, index) => `
                <div class="message-item">
                    <h4>${msg.subject}</h4>
                    <p><strong>Dari:</strong> ${msg.from}</p>
                    <p class="time"><strong>Waktu:</strong> ${msg.time}</p>
                </div>
            `).join('');
            
            document.getElementById('inboxMessages').innerHTML = messagesHtml;
        }
        
        showResult('inboxResult', resultHtml, 'success');
        
    } catch (error) {
        console.error('Error checking inbox:', error);
        showResult('inboxResult', `❌ Gagal cek inbox: ${error.message}`, 'error');
        document.getElementById('inboxMessages').innerHTML = '';
    }
}

// Fungsi untuk mencari domain
async function searchDomains() {
    try {
        const queryInput = document.getElementById('searchDomain');
        const query = queryInput.value.trim();
        
        if (!query) {
            showResult('searchResult', '❌ Masukkan kata kunci untuk pencarian', 'error');
            return;
        }
        
        showLoading('searchResult');
        
        const response = await fetch(`${BASE_URL}/search.php?key=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': BASE_URL
            }
        });
        
        if (!response.ok) {
            throw new Error('Gagal melakukan pencarian');
        }
        
        const data = await response.json();
        
        let resultHtml = `<h3>Hasil Pencarian untuk "${query}":</h3>`;
        
        if (data.results && data.results.length > 0) {
            resultHtml += `<p><strong>Jumlah hasil:</strong> ${data.results.length}</p>`;
            resultHtml += '<ul>' + data.results.map(domain => `<li>${domain}</li>`).join('') + '</ul>';
        } else {
            resultHtml += '<p>Tidak ditemukan domain yang cocok</p>';
        }
        
        showResult('searchResult', resultHtml, 'info');
        
    } catch (error) {
        console.error('Error searching domains:', error);
        showResult('searchResult', `❌ Gagal mencari domain: ${error.message}`, 'error');
    }
}

// Fungsi untuk menampilkan daftar domain aktif
async function listDomains() {
    try {
        showLoading('domainsResult');
        
        const response = await fetch(`${BASE_URL}/api/domains.php`, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': BASE_URL
            }
        });
        
        if (!response.ok) {
            throw new Error('Gagal mengambil daftar domain');
        }
        
        const data = await response.json();
        
        let resultHtml = '<h3>Daftar Domain Aktif:</h3>';
        
        if (Array.isArray(data) && data.length > 0) {
            resultHtml += `<p><strong>Total domain:</strong> ${data.length}</p>`;
            
            // Tampilkan 20 domain pertama
            const domainsToShow = data.slice(0, 20);
            resultHtml += '<ul>' + domainsToShow.map(domain => `<li>${domain}</li>`).join('') + '</ul>';
            
            if (data.length > 20) {
                resultHtml += `<p><em>Menampilkan 20 dari ${data.length} domain...</em></p>`;
            }
        } else {
            resultHtml += '<p>Tidak ditemukan domain aktif</p>';
        }
        
        showResult('domainsResult', resultHtml, 'info');
        
    } catch (error) {
        console.error('Error listing domains:', error);
        showResult('domainsResult', `❌ Gagal mengambil daftar domain: ${error.message}`, 'error');
    }
}

// Fungsi untuk cek uptime email
async function checkUptime() {
    try {
        const emailInput = document.getElementById('uptimeEmail');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            showResult('uptimeResult', '❌ Masukkan email yang valid untuk cek uptime', 'error');
            return;
        }
        
        showLoading('uptimeResult');
        
        const [user, domain] = email.split('@');
        
        const response = await fetch(`${BASE_URL}/uptime.php`, {
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': BASE_URL
            },
            body: `dmn=${encodeURIComponent(domain)}&usr=${encodeURIComponent(user)}`
        });
        
        if (!response.ok) {
            throw new Error('Gagal memeriksa uptime');
        }
        
        const data = await response.json();
        
        let resultHtml = `<h3>Uptime untuk ${email}:</h3>`;
        
        if (data.uptime !== undefined) {
            resultHtml += `<p><strong>Status:</strong> ${data.uptime}</p>`;
            
            // Tambahkan indikator visual
            if (data.uptime === 'Online') {
                resultHtml += '<p><strong>✅ Server aktif</strong></p>';
            } else if (data.uptime === 'Offline') {
                resultHtml += '<p><strong>❌ Server tidak aktif</strong></p>';
            }
        } else {
            resultHtml += '<p>Tidak dapat menentukan status uptime</p>';
        }
        
        showResult('uptimeResult', resultHtml, 'info');
        
    } catch (error) {
        console.error('Error checking uptime:', error);
        showResult('uptimeResult', `❌ Gagal cek uptime: ${error.message}`, 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tombol
    document.getElementById('generateBtn').addEventListener('click', generateEmail);
    document.getElementById('customBtn').addEventListener('click', useCustomEmail);
    document.getElementById('inboxBtn').addEventListener('click', () => checkInbox());
    document.getElementById('searchBtn').addEventListener('click', searchDomains);
    document.getElementById('domainsBtn').addEventListener('click', listDomains);
    document.getElementById('uptimeBtn').addEventListener('click', checkUptime);
    
    // Tombol Enter untuk input field
    document.getElementById('customEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') useCustomEmail();
    });
    
    document.getElementById('inboxEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkInbox();
    });
    
    document.getElementById('searchDomain').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchDomains();
    });
    
    document.getElementById('uptimeEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkUptime();
    });
    
    // Tampilkan email terakhir jika tersedia
    const lastEmail = localStorage.getItem('lastGeneratedEmail');
    if (lastEmail) {
        document.getElementById('inboxEmail').value = lastEmail;
        document.getElementById('uptimeEmail').value = lastEmail;
    }
});