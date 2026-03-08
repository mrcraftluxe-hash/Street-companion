// Добавь это внутрь функции createMap в game.js
function createInteractiveObjects() {
    // Создаем рубильник (для режима ТРОСТЬ)
    const switchGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const switchMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sw = new THREE.Mesh(switchGeo, switchMat);
    sw.position.set(0, 2, -10); // На стене впереди
    sw.userData.type = "switch"; // Пометка для рейкастера
    scene.add(sw);

    // Создаем пожарную лестницу/крюк (для режима КРЮК)
    const hookGeo = new THREE.TorusGeometry(0.3, 0.05);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.position.set(5, 6, -15); // Высоко на стене
    hook.userData.type = "hookPoint";
    scene.add(hook);
}
createInteractiveObjects();
