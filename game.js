// --- МЕХАНИКА ВЗАИМОДЕЙСТВИЯ ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0); // Центр экрана (где прицел)

window.addEventListener('touchstart', (e) => {
    // Если нажатие в правой части экрана (зона взаимодействия)
    if (e.touches[0].clientX > window.innerWidth / 2) {
        useUmbrella();
    }
});

function useUmbrella() {
    // Направляем луч из центра камеры через прицел
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const distance = intersects[0].distance;

        // 1. Режим ТРОСТЬ: Нажатие кнопок/рубильников на расстоянии
        if (mode === 1 && distance < 10) {
            if (object.userData.type === "switch") {
                activateSwitch(object);
            }
        }

        // 2. Режим КРЮК: Подтягивание к поручням
        if (mode === 2 && distance < 15) {
            if (object.userData.type === "hookPoint") {
                grappleTo(intersects[0].point);
            }
        }
    }
}

// Функция для ТРОСТИ
function activateSwitch(obj) {
    obj.material.color.set(0x00ff00); // Кнопка стала зеленой
    console.log("Рубильник активирован!");
    // Здесь можно добавить открытие дверей
}

// Функция для КРЮКА
function grappleTo(targetPoint) {
    // Плавное перемещение камеры к точке
    const duration = 500; 
    const startPos = camera.position.clone();
    let startTime = performance.now();

    function leap(now) {
        let t = (now - startTime) / duration;
        if (t > 1) t = 1;
        camera.position.lerpVectors(startPos, new THREE.Vector3(targetPoint.x, targetPoint.y + 1.6, targetPoint.z), t);
        if (t < 1) requestAnimationFrame(leap);
    }
    requestAnimationFrame(leap);
}
