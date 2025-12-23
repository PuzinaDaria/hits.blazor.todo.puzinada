// wwwroot/js/login.js - ОБНОВЛЕННАЯ ВЕРСИЯ
async function handleLogin() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loginButton = document.getElementById('loginButton');

    // Сбрасываем ошибки
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Валидация
    let isValid = true;

    if (!email) {
        emailError.textContent = 'Email обязателен';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        emailError.textContent = 'Некорректный email';
        emailError.style.display = 'block';
        isValid = false;
    }

    if (!password) {
        passwordError.textContent = 'Пароль обязателен';
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    // Блокируем кнопку
    loginButton.disabled = true;
    loginButton.innerHTML = '<span style="margin-right: 10px;">⏳</span>Вход...';

    // === ПРОВЕРКА В LOCALSTORAGE ДЛЯ ЗАРЕГИСТРИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ===
    try {
        // Получаем всех пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('datingWebsiteUsers') || '[]');
        console.log('Всего пользователей:', users.length);

        // Ищем пользователя с таким email
        const user = users.find(u => u.email === email);

        if (user) {
            console.log('Найден пользователь:', user);

            // Проверяем пароль (в реальном приложении нужно хеширование!)
            if (user.password === password) {
                console.log('Пароль верный, вход выполнен');

                // Сохраняем пользователя (без пароля для безопасности)
                const userWithoutPassword = { ...user };
                delete userWithoutPassword.password;

                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                localStorage.setItem('isLoggedIn', 'true');

                console.log('Пользователь сохранен в localStorage:', userWithoutPassword);

                // Показываем успех
                successMessage.textContent = 'Вход выполнен успешно! Переходим на главную...';
                successMessage.style.display = 'block';

                // Обновляем меню если функция существует
                if (typeof updateMenu !== 'undefined') {
                    updateMenu();
                }

                // Перезагружаем страницу
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);

                return; // Выходим из функции
            } else {
                console.log('Неверный пароль');
                errorMessage.textContent = 'Неверный пароль';
                errorMessage.style.display = 'block';
                loginButton.disabled = false;
                loginButton.innerHTML = '<span style="margin-right: 10px;">🔑</span>Войти';
                return;
            }
        }

        // Если пользователь не найден в localStorage, проверяем демо-вход
        console.log('Пользователь не найден в localStorage, проверяем демо-вход');

    } catch (error) {
        console.error('Ошибка при проверке localStorage:', error);
    }

    // === ДЕМО-ВХОД ДЛЯ ТЕСТОВЫХ ДАННЫХ (на всякий случай) ===
    if (email === 'test@example.com' && password === '123456') {
        console.log('Демо-вход с тестовыми данными');

        const demoUser = {
            Id: 1,
            Email: email,
            FirstName: 'Тест',
            LastName: 'Пользователь',
            Age: 25,
            Description: 'Тестовый пользователь',
            LookingFor: 'Друга',
            PreferredAgeRange: '18-25',
            Interests: 'Кино, Музыка'
        };

        // Показываем успех
        successMessage.textContent = 'Демо-вход выполнен успешно! Переходим на главную...';
        successMessage.style.display = 'block';

        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Демо-пользователь сохранен:', demoUser);

        // Обновляем меню если функция существует
        if (typeof updateMenu !== 'undefined') {
            updateMenu();
        }

        // Перезагружаем страницу
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);

        return; // Выходим из функции
    }

    // Если ни один из вариантов не сработал
    errorMessage.textContent = 'Неверный email или пароль';
    errorMessage.style.display = 'block';
    loginButton.disabled = false;
    loginButton.innerHTML = '<span style="margin-right: 10px;">🔑</span>Войти';
}

// Автозаполнение тестовыми данными для удобства
document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    // Проверяем localStorage при загрузке страницы
    const user = localStorage.getItem('currentUser');
    if (user) {
        console.log('Текущий пользователь в localStorage:', JSON.parse(user));
    }

    // Добавляем тестовую кнопку
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Тест: test/123456';
    testButton.style.cssText = 'position: fixed; bottom: 20px; left: 20px; padding: 8px 12px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer; z-index: 100; font-size: 12px;';
    testButton.onclick = function () {
        if (emailInput) emailInput.value = 'test@example.com';
        if (passwordInput) passwordInput.value = '123456';
        handleLogin();
    };
    document.body.appendChild(testButton);
});