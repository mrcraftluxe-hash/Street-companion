import * as THREE from 'three';

// --- ИНИЦИАЛИЗАЦИЯ ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.1);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- ПЕРЕМЕННЫЕ УПРАВЛЕНИЯ ---
let joyPos = { x: 0, y: 0 };
let look = { yaw: 0, pitch: 0 };
let mode = 1;
let battery = 100;

// --- СОЗДАНИЕ КАРТЫ (МОДЕЛЬКИ) ---
function createMap() {
    // Пол
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x0a0a0a }));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Добавляем мусорные баки (для Шага 3)
    const binGeo = new THREE.BoxGeometry(1.5, 2, 1);
    const binMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for(let i=0; i<5; i++) {
        const bin = new THREE.Mesh(binGeo, binMat);
        bin.position.set(Math.random()*30-15, 1, Math.random()*-40);
        scene.add(bin);
    }

    // Фонарные столбы
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    for(let i=0; i<6; i++) {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(i % 2 === 0 ? -8 : 8, 4, i * -15);
        scene.add(pole);
        
        // Слабый мигающий свет фонаря
        const lamp = new THREE.PointLight(0xffaa00, 0.5, 10);
        lamp.position.set(0, 4, 0);
        pole.add(lamp);
    }
}
createMap();

// --- ГЕРОЙ И ЗОНТ ---
const umbrella = new THREE.Group();
const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1), new THREE.MeshStandardMaterial({color: 0x000}));
handle.rotation.x = Math.PI/2;
umbrella.add(handle);
camera.add(umbrella);
umbrella.position.set(0.3, -0.4, -0.7);
scene.add(camera);

// --- МОНСТР ---
const whisperer = new THREE.Group();
whisperer.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 0.2), new THREE.MeshStandardMaterial({color: 0x000})));
whisperer.position.set(0, 1.25, -20);
scene.add(whisperer);

// --- ЛОГИКА ДЖОЙСТИКА (УПРОЩЕННО) ---
const stick = document.getElementById('joy-stick');
window.addEventListener('touchmove', (e) => {
    for (let t of e.touches) {
        if (t.clientX < window.innerWidth / 2) {
            const rect = document.getElementById('joy-base').getBoundingClientRect();
            joyPos.x = (t.clientX - (rect.left + 60)) / 60;
            joyPos.y = (t.clientY - (rect.top + 60)) / 60;
            stick.style.transform = `translate(${joyPos.x * 40}px, ${joyPos.y * 40}px)`;
        } else {
            if (window.lx) {
                look.yaw -= (t.clientX - window.lx) * 0.005;
                look.pitch -= (t.clientY - window.ly) * 0.005;
            }
            window.lx = t.clientX; window.ly = t.clientY;
        }
    }
});
window.addEventListener('touchend', () => { joyPos = {x:0, y:0}; window.lx = null; stick.style.transform = 'translate(0,0)'; });

// --- КНОПКИ ---
document.getElementById('m1').onclick = () => mode = 1;
document.getElementById('m2').onclick = () => mode = 2;
document.getElementById('m3').onclick = () => mode = 3;

// --- ЦИКЛ ИГРЫ ---
function animate() {
    requestAnimationFrame(animate);
    camera.rotation.set(look.pitch, look.yaw, 0, 'YXZ');
    
    // Движение через джойстик
    const s = mode === 3 ? 0.02 : 0.1;
    camera.translateZ(joyPos.y * s);
    camera.translateX(joyPos.x * s);
    camera.position.y = 1.6;

    // Радар и Шептун
    const dist = camera.position.distanceTo(whisperer.position);
    const dot = document.getElementById('enemy-dot');
    if(dist < 20) {
        dot.style.display = 'block';
        dot.style.left = (50 + (whisperer.position.x - camera.position.x) * 3) + '%';
        dot.style.top = (50 + (whisperer.position.z - camera.position.z) * 3) + '%';
        
        if(mode !== 3) {
            const dir = new THREE.Vector3().subVectors(camera.position, whisperer.position).normalize();
            whisperer.position.x += dir.x * 0.04;
            whisperer.position.z += dir.z * 0.04;
        }
    }

    renderer.render(scene, camera);
}
animate();
