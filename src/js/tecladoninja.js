const palabraElemento = document.getElementById('palabra')
const entrada = document.getElementById('entrada')
const puntuacionElemento = document.getElementById('puntuacion')
const recordElemento = document.getElementById('record')
const tiempoElemento = document.getElementById('temporizador')

const palabras = [
  'shinobi',
  'samurai',
  'ronin',
  'shuriken',
  'kunai',
  'katana',
  'ninjutsu',
  'taijutsu',
  'genjutsu',
  'kenjutsu',
  'bojutsu',
  'kusarigama',
  'fukiya',
  'kyoketsu',
  'seishin',
  'henso',
  'metsuke',
  'Iga',
  'Koga',
  'Edo',
  'Kyoto',
  'Hattori',
  'Fuma',
  'Togakure',
  'Bansenshukai',
  'yoroi',
  'kabuto',
  'hakama',
  'tonpo',
  'gosha',
  'suiren',
  'katayaku',
  'fukimi',
  'tenmon',
  'chimon',
  'saotomichi',
  'tetsubishi',
  'makibishi',
  'kakute',
  'tekkokagi',
  'torinoko',
  'nunchaku',
  'fukibari',
  'manriki',
  'shikomizue',
  'doku',
  'Hattori Hanzo',
  'Fuma Kotaro',
  'Ishikawa Goemon',
  'Mochizuki',
  'Nagato',
  'Sarutobi',
  'Momochi'
]

let puntuacion = 0
let tiempoRestante = 7
let record = localStorage.getItem('recordTecladoNinja') || 0
let palabraActual = ''
let errores = 0
let intervalo
let modoDios = false
let juegoPausado = false

recordElemento.textContent = `Récord: ${record}`

// Función para elegir una palabra aleatoria sin repetir la anterior
function nuevaPalabra() {
  let nueva
  do {
    nueva = palabras[Math.floor(Math.random() * palabras.length)]
  } while (nueva === palabraActual)

  palabraActual = nueva
  palabraElemento.textContent = palabraActual
  entrada.value = ''

  // Calcular tiempo dinámico en función de la longitud de la palabra
  tiempoRestante = Math.max(Math.floor(palabraActual.length * 0.3 + 2), 3) // Mínimo 3 segundos
  actualizarTiempo()
}

// Temporizador que reduce el tiempo y maneja los fallos
function iniciarTemporizador() {
  intervalo = setInterval(() => {
    if (!modoDios && !juegoPausado) {
      if (tiempoRestante > 0) {
        tiempoRestante--
        actualizarTiempo()
      } else {
        manejarTiempoAgotado()
      }
    }
  }, 1000)
}

// Actualizar el tiempo mostrado sin decimales
function actualizarTiempo() {
  tiempoElemento.textContent = tiempoRestante
}

// Función cuando el tiempo se agota sin escribir
function manejarTiempoAgotado() {
  clearInterval(intervalo) // Detener el temporizador
  if (entrada.value.trim() === '') {
    if (puntuacion > 0) {
      puntuacion-- // Restar 1 punto si el jugador tiene puntos
      puntuacionElemento.textContent = `Puntuación: ${puntuacion}`
      mostrarMensaje(`⏳ ¡No escribiste nada! -1 punto`, false)
    } else {
      mostrarMensajeFinal(`💀 ¡El juego ha finalizado!`, true)
    }
  } else {
    registrarFallo()
  }
}

// Función que maneja cuando el jugador pierde
function mostrarMensajeFinal(texto, reiniciar) {
  juegoPausado = true
  clearInterval(intervalo)

  const mensajeDiv = document.createElement('div')
  mensajeDiv.id = 'mensaje-final'
  mensajeDiv.style.position = 'absolute'
  mensajeDiv.style.top = '50%'
  mensajeDiv.style.left = '50%'
  mensajeDiv.style.transform = 'translate(-50%, -50%)'
  mensajeDiv.style.background = '#000000d9'
  mensajeDiv.style.color = '#fff'
  mensajeDiv.style.padding = '30px'
  mensajeDiv.style.borderRadius = '12px'
  mensajeDiv.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.5)'
  mensajeDiv.style.textAlign = 'center'
  mensajeDiv.style.fontSize = '1.5rem'
  mensajeDiv.innerHTML = `<p>${texto}</p><p>Puntuación final: ${puntuacion}</p>`

  const botonReiniciar = document.createElement('button')
  botonReiniciar.textContent = 'Reiniciar'
  botonReiniciar.style.marginTop = '15px'
  botonReiniciar.style.padding = '10px 20px'
  botonReiniciar.style.fontSize = '1rem'
  botonReiniciar.style.border = 'none'
  botonReiniciar.style.borderRadius = '5px'
  botonReiniciar.style.cursor = 'pointer'
  botonReiniciar.style.background = '#ff4444'
  botonReiniciar.style.color = '#fff'
  botonReiniciar.style.transition = 'background 0.3s'

  botonReiniciar.addEventListener('click', () => {
    location.reload()
  })

  mensajeDiv.appendChild(botonReiniciar)
  document.body.appendChild(mensajeDiv)
}

// Detectar si el usuario escribe correctamente o mal
entrada.addEventListener('input', () => {
  if (entrada.value.trim().toLowerCase() === palabraActual.toLowerCase()) {
    puntuacion++
    puntuacionElemento.textContent = `Puntuación: ${puntuacion}`

    if (puntuacion > record) {
      record = puntuacion
      localStorage.setItem('recordTecladoNinja', record)
      recordElemento.textContent = `Récord: ${record}`
    }

    tiempoRestante += 1
    actualizarTiempo()
    nuevaPalabra()
    actualizarNivel()
  } else if (entrada.value.length >= palabraActual.length) {
    registrarFallo()
  }
})

// Función para actualizar el nivel visualmente
function actualizarNivel() {
  if (puntuacion === 10) {
    mostrarMensaje('🥋 Eres un aprendiz ninja.', false, '#2e2b23', '#ffdd57')
  } else if (puntuacion === 30) {
    mostrarMensaje(
      '🏯 Has alcanzado el rango de Maestro del Sigilo.',
      false,
      '#1c3a3e',
      '#57ffba'
    )
  } else if (puntuacion === 50) {
    mostrarMensaje(
      '🐉 Sensei del teclado: Dominas el arte del combate.',
      false,
      '#4b1e1e',
      '#ff7777'
    )
  } else if (puntuacion === 100) {
    activarModoDios()
  }
}

// ACTIVAR EL MODO DIOS 🏆
function activarModoDios() {
  modoDios = true
  clearInterval(intervalo)
  tiempoElemento.textContent = '∞'
  document.body.style.background = 'linear-gradient(135deg, #ff0000, #660000)'
  palabraElemento.style.color = '#fff'
  mostrarMensaje('🔥 ¡HAS DOMINADO EL TECLADO NINJA! 🏆', true)
}

// Iniciar el juego
nuevaPalabra()
iniciarTemporizador()
