// Variables del juego
let jugadorY, computadoraY;
let jugadorAlto = 100, computadoraAlto = 100;
let raquetaAncho = 15;
let pelotaX, pelotaY, pelotaTam = 20;
let pelotaVelX = 5, pelotaVelY = 3;
let jugadorPuntuacion = 0, computadoraPuntuacion = 0;
let golesLimite = 10;
let juegoTerminado = false;
let fondo, barraJugador, barraComputadora, bola;
let anguloPelota = 0;
let sonidoRebote, sonidoGameOver;

function preload() {
  fondo = loadImage('fondo1.png');
  barraJugador = loadImage('barra1.png');
  barraComputadora = loadImage('barra2.png');
  bola = loadImage('bola.png');
  sonidoRebote = loadSound('bounce.wav');
  sonidoGameOver = loadSound('game_over.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  jugadorAlto = height * 0.25;
  computadoraAlto = height * 0.25;
  raquetaAncho = width * 0.02;
  pelotaTam = width * 0.03;
  
  jugadorY = height / 2 - jugadorAlto / 2;
  computadoraY = height / 2 - computadoraAlto / 2;
  pelotaX = width / 2;
  pelotaY = height / 2;
}

function draw() {
  background(fondo);

  fill("#2b3FD6");
  noStroke();
  rect(0, 0, width, 10); // Marco superior
  rect(0, height - 10, width, 10); // Marco inferior

  if (juegoTerminado) {
    mostrarGanador();
  } else {
    mostrarPuntuacion();
    dibujarPorterias();
    moverRaquetas();
    mostrarRaquetas();
    moverPelota();
    mostrarPelota();
    comprobarColisiones();
    moverComputadora();
    comprobarGanador();
  }
}

function mostrarPuntuacion() {
  fill(255);
  textSize(24);
  text(jugadorPuntuacion, width / 4, 30);
  text(computadoraPuntuacion, 3 * width / 4, 30);
}

function moverRaquetas() {
  if (keyIsDown(UP_ARROW)) {
    jugadorY -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jugadorY += 5;
  }
  
  jugadorY = constrain(jugadorY, 10, height - jugadorAlto - 10);
}

function mostrarRaquetas() {
  image(barraJugador, 10, jugadorY, raquetaAncho, jugadorAlto);
  image(barraComputadora, width - 10 - raquetaAncho, computadoraY, raquetaAncho, computadoraAlto);
}

function dibujarPorterias() {
  strokeWeight(2);
  line(15, 10, 15, height - 10);
  line(width - 15, 10, width - 15, height - 10);
}

function moverPelota() {
  pelotaX += pelotaVelX;
  pelotaY += pelotaVelY;
  
  if (pelotaY <= 10 || pelotaY >= height - pelotaTam - 10) {
    pelotaVelY *= -1;
  }
  
  if (pelotaX <= 0) {
    computadoraPuntuacion++;
    reiniciarPelota();
    sonidoGameOver.play();
    narrarGol("PC"); // Llama a la narración del gol de la computadora
  } else if (pelotaX >= width) {
    jugadorPuntuacion++;
    reiniciarPelota();
    sonidoGameOver.play();
    narrarGol("jugador"); // Llama a la narración del gol del jugador
  }
  
  let velocidad = dist(0, 0, pelotaVelX, pelotaVelY);
  anguloPelota += velocidad * 0.05;
}

function mostrarPelota() {
  push();
  translate(pelotaX, pelotaY);
  rotate(anguloPelota);
  imageMode(CENTER);
  image(bola, 0, 0, pelotaTam, pelotaTam);
  pop();
}

function comprobarColisiones() {
  if (pelotaX - pelotaTam / 2 <= 20 + raquetaAncho && 
      pelotaY >= jugadorY && 
      pelotaY <= jugadorY + jugadorAlto) {
    pelotaVelX *= -1;
    pelotaVelX *= 1.05;
    pelotaVelY *= 1.05;
    sonidoRebote.play();
  }

  if (pelotaX + pelotaTam / 2 >= width - 20 - raquetaAncho && 
      pelotaY >= computadoraY && 
      pelotaY <= computadoraY + computadoraAlto) {
    pelotaVelX *= -1;
    pelotaVelX *= 1.05;
    pelotaVelY *= 1.05;
    sonidoRebote.play();
  }
}

function moverComputadora() {
  let computadoraVel = 4;
  if (pelotaY < computadoraY + computadoraAlto / 2) {
    computadoraY -= computadoraVel;
  } else if (pelotaY > computadoraY + computadoraAlto / 2) {
    computadoraY += computadoraVel;
  }
  
  computadoraY = constrain(computadoraY, 10, height - computadoraAlto - 10);
}

function reiniciarPelota() {
  pelotaX = width / 2;
  pelotaY = height / 2;
  pelotaVelX = random([-5, 5]);
  pelotaVelY = random([-3, 3]);
  anguloPelota = 0;
}

function comprobarGanador() {
  if (jugadorPuntuacion >= golesLimite || computadoraPuntuacion >= golesLimite) {
    juegoTerminado = true;
  }
}

function mostrarGanador() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  if (jugadorPuntuacion >= golesLimite) {
    text("¡Ganaste!", width / 2, height / 2);
  } else if (computadoraPuntuacion >= golesLimite) {
    text("¡Perdiste!", width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  jugadorAlto = height * 0.25;
  computadoraAlto = height * 0.25;
  raquetaAncho = width * 0.02;
  pelotaTam = width * 0.03;
  jugadorY = height / 2 - jugadorAlto / 2;
  computadoraY = height / 2 - computadoraAlto / 2;
  pelotaX = width / 2;
  pelotaY = height / 2;
}
// Función para narrar el gol y el marcador actual
function narrarGol(autor) {
  let narrador = new SpeechSynthesisUtterance();
  narrador.lang = 'es-MX';
   // Reanudar síntesis en Chrome
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }
    speechSynthesis.speak(narrador);
  let mensaje = `Gol de ${autor}! El marcador está: jugador ${jugadorPuntuacion}, computadora ${computadoraPuntuacion}`;
  narrador.text = mensaje;
  window.speechSynthesis.speak(narrador);
}
