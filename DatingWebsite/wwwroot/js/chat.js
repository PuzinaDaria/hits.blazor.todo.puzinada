// chat.js - полный файл
// Система чатов и сообщений

const CHATS_KEY = 'datingWebsiteChats';
const MESSAGES_KEY = 'datingWebsiteMessages';

// Инициализация тестовых чатов
function initializeChats() {
    let chats = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
    let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
}

// Получить все чаты текущего пользователя
function getUserChats() {
    const chats = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
    return chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
}

// Получить или создать чат с пользователем
// Получить или создать чат с пользователем
function getOrCreateChat(userId, userName) {
    const chats = getUserChats();

    // Ищем существующий чат - СРАВНИВАЕМ КАК ЧИСЛА!
    let chat = chats.find(c => Number(c.userId) === Number(userId));

    if (!chat) {
        console.log('Создаем новый чат для пользователя ID:', userId);
        // Создаем новый чат
        chat = {
            id: Date.now(),
            userId: userId,
            userName: userName,
            lastMessage: "",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
        };

        chats.push(chat);
        localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
        console.log('Новый чат создан:', chat);
    } else {
        console.log('Найден существующий чат:', chat);
    }

    return chat;
}

// Добавь в конец chat.js
function cleanupDuplicateChats() {
    const chats = getUserChats();
    const uniqueChats = [];
    const seenUserIds = new Set();

    // Идем с конца, чтобы сохранить последние чаты
    for (let i = chats.length - 1; i >= 0; i--) {
        const chat = chats[i];
        const userId = chat.userId.toString();

        if (!seenUserIds.has(userId)) {
            seenUserIds.add(userId);
            uniqueChats.unshift(chat); // Добавляем в начало
        } else {
            console.log('Удаляем дубликат чата для пользователя:', userId);
        }
    }

    if (chats.length !== uniqueChats.length) {
        localStorage.setItem(CHATS_KEY, JSON.stringify(uniqueChats));
        console.log(`Удалено ${chats.length - uniqueChats.length} дубликатов чатов`);
        alert(`Удалено ${chats.length - uniqueChats.length} дубликатов чатов!`);

        if (window.location.pathname.includes('/messages') && typeof displayMessages === 'function') {
            displayMessages();
        }
    }

    return uniqueChats;
}

// Для вызова из консоли
window.cleanupDuplicateChats = cleanupDuplicateChats;

// Получить сообщения чата
function getChatMessages(chatId) {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return allMessages
        .filter(msg => msg.chatId === chatId)
        .sort((a, b) => new Date(a.time) - new Date(b.time));
}

// Отправить сообщение
// Отправить сообщение (в chat.js)
// Отправить сообщение
function sendMessage(chatId, text, senderId = 0, receiverId) {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const chats = getUserChats();

    // Создаем сообщение
    const message = {
        id: Date.now(),
        chatId: chatId,
        senderId: senderId,
        receiverId: receiverId,
        text: text,
        time: new Date().toISOString(),
        isRead: false
    };

    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    // Обновляем чат - ВАЖНО: ищем чат по ID
    const chatIndex = chats.findIndex(c => String(c.id) === String(chatId));

    if (chatIndex !== -1) {
        // Обрезаем текст для preview
        const previewText = text.length > 30 ? text.substring(0, 30) + '...' : text;
        chats[chatIndex].lastMessage = previewText;
        chats[chatIndex].lastMessageTime = new Date().toISOString();

        // Если отправил другой пользователь, увеличиваем счетчик непрочитанных
        if (senderId !== 0) {
            chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
        }

        localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
        console.log('Чат обновлен:', chats[chatIndex]);
    } else {
        console.error('Чат не найден для обновления:', chatId);
    }

    // Имитируем ответ через 2-5 секунд
    if (senderId === 0) {
        setTimeout(() => {
            simulateReply(chatId, receiverId);
        }, 2000 + Math.random() * 3000);
    }

    return message;
}

// Имитация ответа
function simulateReply(chatId, senderId) {
    const replies = [
        "Привет! Рада тебя слышать!",
        "Как твои дела?",
        "Что нового?",
        "Давай встретимся на выходных?",
        "Я тоже люблю это хобби!",
        "Отличная идея!",
        "Согласен с тобой полностью",
        "Когда сможешь встретиться?",
        "Отправлю тебе фото позже",
        "Спасибо за сообщение!"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    sendMessage(chatId, randomReply, senderId, 0);
}

// Пометить сообщения как прочитанные
function markMessagesAsRead(chatId) {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const chats = getUserChats();

    // Помечаем сообщения как прочитанные
    messages.forEach(msg => {
        if (msg.chatId === chatId && msg.senderId !== 0 && !msg.isRead) {
            msg.isRead = true;
        }
    });

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    // Сбрасываем счетчик непрочитанных в чате
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
        chats[chatIndex].unreadCount = 0;
        localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    }
}

// Удалить чат
function deleteChat(chatId) {
    try {
        console.log('Удаление чата ID:', chatId);

        // Получаем все чаты
        let chats = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');

        // Фильтруем чаты, оставляя все кроме удаляемого
        chats = chats.filter(chat => String(chat.id) !== String(chatId));

        // Сохраняем обновленный список
        localStorage.setItem(CHATS_KEY, JSON.stringify(chats));

        // Удаляем сообщения этого чата
        let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
        messages = messages.filter(msg => String(msg.chatId) !== String(chatId));
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

        console.log('Чат удален');

        // Если мы в чате - перенаправляем на страницу сообщений
        if (window.location.pathname.includes('/chat/')) {
            alert('Чат удален!');
            window.location.href = '/messages';
        }

        // Если на странице сообщений - обновляем список
        if (window.location.pathname.includes('/messages') && typeof displayMessages === 'function') {
            displayMessages();
        }

        return true;
    } catch (error) {
        console.error('Ошибка при удалении чата:', error);
        alert('Ошибка при удалении чата');
        return false;
    }
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', initializeChats);