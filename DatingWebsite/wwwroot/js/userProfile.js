// wwwroot/js/userProfile.js
export function getUserById(userId) {
    try {
        console.log('Поиск пользователя с ID:', userId);

        const users = JSON.parse(localStorage.getItem('datingWebsiteUsers') || '[]');
        console.log('Всего пользователей:', users.length);

        // Ищем пользователя (сравниваем как строки)
        const user = users.find(u => String(u.id) === String(userId));

        if (user) {
            console.log('Пользователь найден:', user);
            return {
                id: user.id.toString(),
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || 0,
                email: user.email || '',
                description: user.description || '',
                lookingFor: user.lookingFor || '',
                interests: user.interests || []
            };
        } else {
            console.log('Пользователь не найден');
            return null;
        }
    } catch (error) {
        console.error('Ошибка при поиске пользователя:', error);
        return null;
    }
}

export function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Ошибка получения текущего пользователя:', error);
        return null;
    }
}