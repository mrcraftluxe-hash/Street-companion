// Вставь в начало функции useUmbrella()
umbrella.position.z -= 0.5; // Зонт делает выпад вперед
setTimeout(() => {
    umbrella.position.z += 0.5; // Возвращается назад
}, 100);
