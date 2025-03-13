const tablero = document.getElementById('tablero')
const mensaje = document.getElementById('mensaje')
const reiniciarBtn = document.getElementById('reiniciar')

const jugadas = ['', '', '', '', '', '', '', '', '']
let turnoActual = '❌'
let caosActivo = false

// Crear el tablero dinámicamente
function iniciarTablero() {
  tablero.innerHTML = ''
  jugadas.forEach((_, i) => {
    const celda = document.createElement('div')
    celda.classList.add('celda')
    celda.dataset.index = i
    celda.addEventListener('click', manejarTurno)
    tablero.appendChild(celda)
  })
}

// Manejar cada turno
function manejarTurno(evento) {
  const indice = evento.target.dataset.index

  if (jugadas[indice] === '' && !verificarGanador()) {
    jugadas[indice] = turnoActual
    evento.target.textContent = turnoActual
    turnoActual = turnoActual === '❌' ? '⭕' : '❌'

    if (verificarGanador()) {
      mensaje.textContent = `¡${jugadas[indice]} gana!`
      guardarPuntuacion(jugadas[indice])
    } else if (!jugadas.includes('')) {
      mensaje.textContent = '¡Empate!'
    } else {
      aplicarCaos()
    }
  }
}

// Verificar si hay un ganador
function verificarGanador() {
  const combinaciones = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Filas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columnas
    [0, 4, 8],
    [2, 4, 6] // Diagonales
  ]

  return combinaciones.some((combinacion) => {
    const [a, b, c] = combinacion
    return jugadas[a] && jugadas[a] === jugadas[b] && jugadas[a] === jugadas[c]
  })
}

// Almacenar puntuación en localStorage
function guardarPuntuacion(ganador) {
  let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || {
    '❌': 0,
    '⭕': 0
  }
  puntuaciones[ganador]++
  localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones))
}

// Reiniciar el juego
function reiniciarJuego() {
  jugadas.fill('')
  turnoActual = '❌'
  mensaje.textContent = ''
  iniciarTablero()
}

// Función de caos: Girar el tablero o eliminar casillas
function aplicarCaos() {
  if (!caosActivo && Math.random() < 0.3) {
    // 30% de probabilidad de activar caos
    caosActivo = true
    const efecto = Math.random()

    if (efecto < 0.5) {
      girarTablero()
    } else {
      eliminarCasilla()
    }

    setTimeout(() => {
      caosActivo = false
    }, 1000)
  }
}

// Girar el tablero aleatoriamente
function girarTablero() {
  tablero.style.transform = `rotate(${
    [90, 180, 270][Math.floor(Math.random() * 3)]
  }deg)`
}

// Eliminar una casilla aleatoria
function eliminarCasilla() {
  const indicesDisponibles = jugadas
    .map((_, i) => i)
    .filter((i) => jugadas[i] === '')
  if (indicesDisponibles.length > 0) {
    const indexEliminar =
      indicesDisponibles[Math.floor(Math.random() * indicesDisponibles.length)]
    jugadas[indexEliminar] = '-' // Casilla inutilizable
    document.querySelector(`[data-index='${indexEliminar}']`).textContent = '❌'
    document.querySelector(
      `[data-index='${indexEliminar}']`
    ).style.backgroundColor = '#ddd'
  }
}

reiniciarBtn.addEventListener('click', reiniciarJuego)

iniciarTablero()
