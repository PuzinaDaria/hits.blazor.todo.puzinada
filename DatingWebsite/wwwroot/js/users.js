// wwwroot/js/users.js
// Простая база данных пользователей в localStorage

const USERS_KEY = 'datingWebsiteUsers';

// Инициализация тестовых пользователей
function initializeUsers() {
    let users = getAllUsers();

    if (users.length === 0) {
        console.log('Создаю тестовых пользователей...');

        users = [
            {
                id: 1,
                firstName: "Анна",
                lastName: "Иванова",
                age: 24,
                email: "anna@example.com",
                description: "Люблю кино, путешествия и спорт. Ищу серьёзные отношения.",
                lookingFor: "Серьезные отношения",
                interests: ["Кино", "Путешествия", "Спорт", "Кулинария"],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                firstName: "Максим",
                lastName: "Петров",
                age: 28,
                email: "maxim@example.com",
                description: "Программист, увлекаюсь технологиями и книгами. Ищу друзей.",
                lookingFor: "Друзей",
                interests: ["Программирование", "Книги", "Игры", "Музыка"],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                firstName: "Екатерина",
                lastName: "Смирнова",
                age: 26,
                email: "ekaterina@example.com",
                description: "Дизайнер, люблю искусство и фотографию. Ищу интересного собеседника.",
                lookingFor: "Общение",
                interests: ["Искусство", "Фотография", "Мода", "Танцы"],
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                firstName: "Дмитрий",
                lastName: "Соколов",
                age: 30,
                email: "dmitry@example.com",
                description: "Предприниматель, занимаюсь спортом. Ищу девушку для отношений.",
                lookingFor: "Отношения",
                interests: ["Спорт", "Автомобили", "Бизнес", "Путешествия"],
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                firstName: "Ольга",
                lastName: "Кузнецова",
                age: 22,
                email: "olga@example.com",
                description: "Студентка, учусь на психолога. Люблю животных и природу.",
                lookingFor: "Друга",
                interests: ["Психология", "Животные", "Природа", "Йога"],
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log('Тестовые пользователи созданы:', users.length);
    } else {
        console.log('Пользователи уже существуют:', users.length);
    }

    return users;
}

// Получить всех пользователей
function getAllUsers() {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        return [];
    }
}



// Получить пользователя по ID
function getUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id);
}

// Добавить нового пользователя
function addUser(userData) {
    const users = getAllUsers();
    const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log('Пользователь добавлен:', newUser);
    return newUser;
}

// Удалить пользователя
function deleteUser(id) {
    const users = getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    return true;
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', function () {
    console.log('users.js загружен');
    initializeUsers();
});