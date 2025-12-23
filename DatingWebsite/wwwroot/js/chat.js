// chat.js - полный файл
// Система чатов и сообщений

const CHATS_KEY = 'datingWebsiteChats';
const MESSAGES_KEY = 'datingWebsiteMessages';

// Инициализация тестовых чатов
function initializeChats() {
    let chats = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
    let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');

    // Если нет чатов, создаём тестовые

    // Если нет сообщений, создаём тестовые
    if (messages.length === 0) {
        messages = [
            {
                id: 1,
                chatId: 1,
                senderId: 1, // Анна
                receiverId: 0, // Текущий пользователь
                text: "Привет! Как дела?",
                time: new Date(Date.now() - 3600000).toISOString(),
                isRead: false
            },
            {
                id: 2,
                chatId: 1,
                senderId: 0, // Текущий пользователь
                receiverId: 1, // Анна
                text: "Привет! Всё отлично, спасибо!",
                time: new Date(Date.now() - 3500000).toISOString(),
                isRead: true
            },
            {
                id: 3,
                chatId: 2,
                senderId: 2, // Максим
                receiverId: 0, // Текущий пользователь
                text: "Посмотрел твой профиль, интересно...",
                time: new Date(Date.now() - 86400000).toISOString(),
                isRead: true
            }
        ];

        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
}

// Получить все чаты текущего пользователя
function getUserChats() {
    const chats = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
    return chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
}

// Получить или создать чат с пользователем
function getOrCreateChat(userId, userName) {
    const chats = getUserChats();

    // Ищем существующий чат
    let chat = chats.find(c => c.userId === userId);

    if (!chat) {
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
    }

    return chat;
}

// Получить сообщения чата
function getChatMessages(chatId) {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return allMessages
        .filter(msg => msg.chatId === chatId)
        .sort((a, b) => new Date(a.time) - new Date(b.time));
}

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

    // Обновляем чат
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
        chats[chatIndex].lastMessage = text.length > 30 ? text.substring(0, 30) + '...' : text;
        chats[chatIndex].lastMessageTime = new Date().toISOString();

        // Если отправил другой пользователь, увеличиваем счетчик непрочитанных
        if (senderId !== 0) {
            chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
        }

        localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
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