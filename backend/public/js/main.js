// конфигурация API
const API_URL = '/api';
let currentUser = null;
let slideIndex = 0;


// функции при ошибках
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) element.innerText = message;
}
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
}
function showMessage(message, isSuccess = true) {
    alert(message);
}

function updateNavigation() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        const user = JSON.parse(userStr);
        currentUser = user;
        
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-cabinet').style.display = 'inline';
        document.getElementById('nav-logout').style.display = 'inline';
        
        if (user.role === 'admin') {
            document.getElementById('nav-admin').style.display = 'inline';
        } else {
            document.getElementById('nav-admin').style.display = 'none';
        }
    } else {
        document.getElementById('nav-register').style.display = 'inline';
        document.getElementById('nav-login').style.display = 'inline';
        document.getElementById('nav-cabinet').style.display = 'none';
        document.getElementById('nav-admin').style.display = 'none';
        document.getElementById('nav-logout').style.display = 'none';
    }
}

// навигация
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    window.location.hash = page;

    switch(page) {
        case 'competencies':
            loadCompetencies();
            break;
        case 'participants':
            loadFilters();
            filterParticipants();
            break;
        case 'register':
            loadRegions();
            break;
        case 'cabinet':
            loadCabinet();
            break;
        case 'admin':
            loadAdminPanel();
            break;
    }
}

// регионы
async function loadRegions() {
    try {
        const response = await fetch(`${API_URL}/regions`);
        const regions = await response.json();
        // для формы регистрации
        const select = document.getElementById('region');
        if (select) {
            select.innerHTML = '<option value="">Выберите регион</option>' +
                regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        }      
        // для фильтра участников
        const filterRegion = document.getElementById('filter-region');
        if (filterRegion) {
            filterRegion.innerHTML = '<option value="">Все регионы</option>' +
                regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки регионов:', error);
    }
}

// ==============================================
// Компетенции
// ==============================================
async function loadCompetencies() {
    try {
        const response = await fetch(`${API_URL}/competencies`);
        const competencies = await response.json();
        
        const list = document.getElementById('competencies-list');
        if (!list) return;
        
        list.innerHTML = competencies.map(comp => `
            <div class="spoiler">
                <div class="spoiler-header" onclick="toggleSpoiler(this)">
                    <span>${comp.name}</span>
                    <span>▼</span>
                </div>
                <div class="spoiler-content">
                    <p>${comp.description}</p>
                    ${comp.task_file ? 
                        `<button class="btn" onclick="downloadTask('${comp.task_file}')">Скачать задание</button>` : 
                        '<p>Задание пока не загружено</p>'}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки компетенций:', error);
    }
}

function toggleSpoiler(header) {
    header.parentElement.classList.toggle('active');
}

function downloadTask(filename) {
    window.open(`${API_URL}/uploads/${filename}`, '_blank');
}

// ==============================================
// Участники и фильтры
// ==============================================
async function loadFilters() {
    try {
        const [competencies, regions] = await Promise.all([
            fetch(`${API_URL}/competencies`).then(r => r.json()),
            fetch(`${API_URL}/regions`).then(r => r.json())
        ]);

        const compSelect = document.getElementById('filter-competency');
        if (compSelect) {
            compSelect.innerHTML = '<option value="">Все компетенции</option>' +
                competencies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }

        const regionSelect = document.getElementById('filter-region');
        if (regionSelect) {
            regionSelect.innerHTML = '<option value="">Все регионы</option>' +
                regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
    }
}

async function filterParticipants() {
    const params = new URLSearchParams();
    const name = document.getElementById('search-name')?.value;
    const competency = document.getElementById('filter-competency')?.value;
    const category = document.getElementById('filter-category')?.value;
    const region = document.getElementById('filter-region')?.value;
    
    if (name) params.append('name', name);
    if (competency) params.append('competency_id', competency);
    if (category) params.append('category', category);
    if (region) params.append('region_id', region);

    try {
        const response = await fetch(`${API_URL}/participants?${params.toString()}`);
        const participants = await response.json();

        const grid = document.getElementById('participants-grid');
        if (!grid) return;
        
        if (participants.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Участники не найдены</p>';
            return;
        }
        
        grid.innerHTML = participants.map(p => `
            <div class="card">
                <img src="${p.photo || 'https://via.placeholder.com/200x200?text=Нет+фото'}" 
                     alt="${p.firstname} ${p.lastname}" 
                     style="width: 100%; height: 200px; object-fit: cover;">
                <div class="card-content">
                    <h3>${p.lastname} ${p.firstname} ${p.middlename || ''}</h3>
                    <p><strong>Компетенция:</strong> ${p.competency_name || 'Не указана'}</p>
                    <p><strong>Категория:</strong> ${getCategoryName(p.category)}</p>
                    <p><strong>Регион:</strong> ${p.region_name || 'Не указан'}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка фильтрации:', error);
    }
}

function getCategoryName(category) {
    const categories = {
        'schoolboy': 'Школьник',
        'student': 'Студент',
        'specialist': 'Специалист'
    };
    return categories[category] || category;
}

// регистрация 
async function handleRegister(event) {
    event.preventDefault();
    clearErrors();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    let isValid = true;
    // валидация пароля
    if (password.length < 8) {
        showError('password-error', 'Пароль должен содержать минимум 8 символов');
        isValid = false;
    }
    if (password !== confirmPassword) {
        showError('confirm-password-error', 'Пароли не совпадают');
        isValid = false;
    }
    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) {
        // проверка размера (макс 5MB)
        if (photoFile.size > 5 * 1024 * 1024) {
            showError('photo-error', 'Фото не должно превышать 5MB');
            isValid = false;
        }
        if (!photoFile.type.startsWith('image/')) {
            showError('photo-error', 'Можно загружать только изображения');
            isValid = false;
        }
    }

    if (!isValid) return;

    // FormData для отправки файла
    const formData = new FormData();
    formData.append('lastname', document.getElementById('lastname').value);
    formData.append('firstname', document.getElementById('firstname').value);
    formData.append('middlename', document.getElementById('middlename').value || '');
    formData.append('email', document.getElementById('email').value);
    formData.append('password', password);
    formData.append('education', document.getElementById('education').value);
    formData.append('institution', document.getElementById('institution').value || '');
    formData.append('region_id', document.getElementById('region').value || '');
    formData.append('category', document.getElementById('user-category').value);
    if (photoFile) {
        formData.append('photo', photoFile);
    }
    try {
        // индикатор загрузки
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Регистрация...';
        submitBtn.disabled = true;

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            body: formData  
        });
        const data = await response.json();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка регистрации');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        currentUser = data.user;
        updateNavigation();
        showMessage('Регистрация успешна!');
        navigateTo('cabinet');
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        showMessage(error.message, false);
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Зарегистрироваться';
            submitBtn.disabled = false;
        }
    }
}
// превью фото перед загрузкой
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('photo-preview');
            const previewImg = preview ? preview.querySelector('img') : null;
            if (file && preview && previewImg) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else if (preview) {
                preview.style.display = 'none';
            }
        });
    }
});

// вход
async function handleLogin(event) {
    event.preventDefault();
    const login = document.getElementById('login-username').value;  
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })  
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка входа');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        currentUser = data.user;
        updateNavigation();

        if (data.user.role === 'admin') {
            navigateTo('admin');
        } else {
            navigateTo('cabinet');
        }
        
        showMessage('Вход выполнен успешно!');
    } catch (error) {
        console.error('Ошибка входа:', error);
        showMessage(error.message, false);
    }
}

// выход
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateNavigation();
    navigateTo('home');
    showMessage('Вы вышли из системы');
}

// личный кабинет
async function loadCabinet() {
    const token = localStorage.getItem('token');
    if (!token) {
        navigateTo('login');
        return;
    }

    await Promise.all([
        loadCompetenciesForSelect(),
        loadMyApplications()
    ]);
}


async function loadCompetenciesForSelect() {
    try {
        const response = await fetch(`${API_URL}/competencies`);
        const competencies = await response.json();

        const select = document.getElementById('application-competency');
        if (select) {
            select.innerHTML = '<option value="">Выберите компетенцию...</option>' +
                competencies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки компетенций:', error);
    }
}

async function searchCompetencies() {
    const query = document.getElementById('competency-search').value;
    if (!query) {
        document.getElementById('competency-search-results').innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/competencies/search?q=${encodeURIComponent(query)}`);
        const competencies = await response.json();

        const results = document.getElementById('competency-search-results');
        results.innerHTML = competencies.map(c => `
            <div class="card" onclick="selectCompetency(${c.id})">
                <div class="card-content">
                    <h3>${c.name}</h3>
                    <p>${c.description.substring(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

function selectCompetency(id) {
    document.getElementById('application-competency').value = id;
    document.getElementById('competency-search-results').innerHTML = '';
    document.getElementById('competency-search').value = '';
}

async function handleApplication(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        navigateTo('login');
        return;
    }

    const applicationData = {
        competency_id: document.getElementById('application-competency').value,
        experience: document.getElementById('experience').value
    };

    if (!applicationData.competency_id) {
        showMessage('Выберите компетенцию', false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(applicationData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showMessage('Заявка успешно подана!');
        document.getElementById('application-form').reset();
        loadMyApplications();
    } catch (error) {
        showMessage(error.message, false);
    }
}

async function loadMyApplications() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/applications/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const applications = await response.json();

        const list = document.getElementById('applications-list');
        if (!list) return;
        
        if (applications.length === 0) {
            list.innerHTML = '<tr><td colspan="4" style="text-align: center;">У вас пока нет заявок</td></tr>';
            return;
        }
        
        list.innerHTML = applications.map(a => `
            <tr>
                <td>${a.competency_name}</td>
                <td>${new Date(a.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                    <span class="status-${a.status}">
                        ${getStatusName(a.status)}
                    </span>
                </td>
                <td>
                    ${a.status === 'pending' ? 
                        `<button onclick="cancelApplication(${a.id})" class="btn-secondary">Отменить</button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
    }
}

function getStatusName(status) {
    const statuses = {
        'pending': 'На рассмотрении',
        'approved': 'Одобрена',
        'rejected': 'Отклонена'
    };
    return statuses[status] || status;
}

async function cancelApplication(id) {
    if (!confirm('Отменить заявку?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/applications/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showMessage('Заявка отменена');
        loadMyApplications();
    } catch (error) {
        showMessage(error.message, false);
    }
}

// админка
async function loadAdminPanel() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
        navigateTo('home');
        return;
    }

    await loadCompetenciesForAdmin();
}

async function loadCompetenciesForAdmin() {
    try {
        const response = await fetch(`${API_URL}/competencies`);
        const competencies = await response.json();

        const table = document.getElementById('competencies-table');
        if (!table) return;
        
        if (competencies.length === 0) {
            table.innerHTML = '<tr><td colspan="4" style="text-align: center;">Нет компетенций</td></tr>';
            return;
        }
        
        table.innerHTML = competencies.map(c => `
            <tr>
                <td>${c.name}</td>
                <td>${c.description}</td>
                <td>
                    ${c.task_file ? 
                        `<a href="${API_URL}/uploads/${c.task_file}" target="_blank">Скачать</a>` : 
                        'Нет файла'}
                </td>
                <td>
                    <button onclick="deleteCompetency(${c.id})" class="btn-secondary">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки компетенций:', error);
    }
}

async function handleAddCompetency(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    formData.append('name', document.getElementById('competency-name').value);
    formData.append('description', document.getElementById('competency-description').value);
    
    const taskFile = document.getElementById('task-file').files[0];
    if (taskFile) {
        formData.append('task_file', taskFile);
    }

    try {
        const response = await fetch(`${API_URL}/admin/competencies`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showMessage('Компетенция добавлена');
        document.getElementById('competency-form').reset();
        loadCompetenciesForAdmin();
    } catch (error) {
        showMessage(error.message, false);
    }
}

async function deleteCompetency(id) {
    if (!confirm('Удалить компетенцию? Это действие нельзя отменить.')) return;
    
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/admin/competencies/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showMessage('Компетенция удалена');
        loadCompetenciesForAdmin();
    } catch (error) {
        showMessage(error.message, false);
    }
}

// слайдер
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slideIndex = (slideIndex + direction + slides.length) % slides.length;
    document.querySelector('.slider-container').style.transform = `translateX(-${slideIndex * 100}%)`;
}

// счетчик
function updateCountdown() {
    const eventDate = new Date('2026-06-15').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h3>Фестиваль начался!</h3>';
        return;
    }
    document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000);
}

// обратная связь
function handleFeedback(event) {
    event.preventDefault();
    showMessage('Сообщение отправлено! (Демо-режим)');
}

// инициализация
window.onload = function() {
    updateNavigation();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    const hash = window.location.hash.slice(1) || 'home';
    navigateTo(hash);
    // автоматическая прокрутка слайдера каждые 5 секунд
    setInterval(() => changeSlide(1), 5000);
}; 
