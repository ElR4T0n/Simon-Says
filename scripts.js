let secuenciaPC = []
let secuenciaUser = []
let ronda = 0

document.querySelector("#boton").onclick = comenzarJuego

function cambiarEstadoBoton(estado) {
    document.querySelector("#boton").textContent = (estado)
}


actualizarEstado("PRESS START BUTTON")
actualizarNumeroRonda("-");
bloquearInputUser();

function comenzarJuego() {
    reiniciarEstado();
    manejarRonda();
}

function manejarRonda() {
    actualizarEstado("SIMON'S TURN")
    bloquearInputUser();

    const $nuevoCuadro = obtenerCuadroAleatorio();
    secuenciaPC.push($nuevoCuadro);
    const RETRASO_TURNO_JUGADOR = (secuenciaPC.length + 1) * 700;

    secuenciaPC.forEach(function ($cuadro, index) {
        const RETRASO_MS = (index + 1) * 700;
        setTimeout(function () {
            resaltar($cuadro);
            const cuadroIndex = Array.from(document.querySelectorAll('.cuadro')).indexOf($cuadro);
            const cuadroSound = document.getElementById(`audio${cuadroIndex + 1}`);
            cuadroSound.currentTime = 0;
            cuadroSound.play();
        }, RETRASO_MS);
    });

    setTimeout(function () {
        actualizarEstado("YOUR TURN");
        desbloquearInputUser();
    }, RETRASO_TURNO_JUGADOR)

    secuenciaUser = [];
    ronda++;
    actualizarNumeroRonda(ronda);
}

function actualizarEstado(estado) {
    const $estado = document.querySelector("#dialogo")
    $estado.textContent = estado;
}

function reiniciarEstado() {
    secuenciaPC = [];
    secuenciaUser = [];
    ronda = 0;
}

function actualizarNumeroRonda(ronda) {
    document.querySelector("#ronda").textContent = ronda;
}

function resaltar($cuadro) {
    const originalTransform = $cuadro.style.transform;
    const originalOpacity = $cuadro.style.opacity;

    $cuadro.style.opacity = 0.7;
    $cuadro.style.transform = "scale(0.96)";

    setTimeout(function () {
        $cuadro.style.opacity = originalOpacity;
        $cuadro.style.transform = originalTransform;
    }, 280);
}

function manejarInputUser(e) {
    const $cuadro = e.target;
    resaltar($cuadro);
    secuenciaUser.push($cuadro);
    const cuadroIndex = Array.from(document.querySelectorAll('.cuadro')).indexOf($cuadro);
    const cuadroSound = document.getElementById(`audio${cuadroIndex + 1}`);
    cuadroSound.currentTime = 0;
    cuadroSound.play();
    const $cuadroPC = secuenciaPC[secuenciaUser.length - 1];
    if ($cuadro.id !== $cuadroPC.id) {
        perder();
        return;
    }
    if (secuenciaUser.length === secuenciaPC.length) {
        bloquearInputUser();
        setTimeout(function () {
            manejarRonda();
        }, 1000);
    }
}

const soundPlayer = document.getElementById("sound-player");

function playSound(index) {
    soundPlayer.src = `src/audio/SOUND${index}.mp3`;
    soundPlayer.currentTime = 0;
    soundPlayer.play();
}


function Sonidos() {
    const lastCuadroIndex = secuenciaPC.length - 1;
    playSound(lastCuadroIndex);
}


function playStartSound() {
    const startSound = document.getElementById("start");
    startSound.currentTime = 0;
    startSound.play();
}

function playGameOverSound() {
    const startSound = document.getElementById("gameover");
    startSound.currentTime = 0;
    startSound.play();
}

document.querySelector("#boton").onclick = function () {
    comenzarJuego();
    playStartSound();
};

function obtenerCuadroAleatorio() {
    const $cuadros = document.querySelectorAll(".cuadro");
    const indice = Math.floor(Math.random() * $cuadros.length);
    return $cuadros[indice];
}

function bloquearInputUser() {
    document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
        $cuadro.onclick = function () {
        };
    })
}



function desbloquearInputUser() {
    document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
        $cuadro.onclick = manejarInputUser;
    })
}

function perder() {
    bloquearInputUser();
    actualizarEstado("G A M E  O V E R")
    playGameOverSound();
}