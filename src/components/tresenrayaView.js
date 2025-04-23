import '../styles/tresenraya.css'

export default function TresEnRayaView() {
  document.getElementById('contenedor-juego').innerHTML = `
    <div class="juego-wrapper">
      <a href="#" id="volver">⏪ Volver</a>
      <h1>Tres en Raya Caótico</h1>
      <div id="tablero"></div>
      <p id="mensaje"></p>
      <button id="reiniciar">Reiniciar Juego</button>
    </div>
  `

  const tablero = document.getElementById('tablero')
  const mensaje = document.getElementById('mensaje')
  const reiniciarBtn = document.getElementById('reiniciar')

  const jugadas = ['', '', '', '', '', '', '', '', '']
  let turnoActual = '❌'
  let caosActivo = false

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

  function verificarGanador() {
    const combinaciones = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    return combinaciones.some(([a, b, c]) => {
      return (
        jugadas[a] && jugadas[a] === jugadas[b] && jugadas[a] === jugadas[c]
      )
    })
  }

  function guardarPuntuacion(ganador) {
    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || {
      '❌': 0,
      '⭕': 0
    }
    puntuaciones[ganador]++
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones))
  }

  function reiniciarJuego() {
    jugadas.fill('')
    turnoActual = '❌'
    mensaje.textContent = ''
    iniciarTablero()
    tablero.style.transform = 'rotate(0deg)'
  }

  function aplicarCaos() {
    if (!caosActivo && Math.random() < 0.3) {
      caosActivo = true
      const efecto = Math.random()
      if (efecto < 0.5) {
        girarTablero()
      } else {
        eliminarCasilla()
      }
      setTimeout(() => (caosActivo = false), 1000)
    }
  }

  function girarTablero() {
    tablero.style.transform = `rotate(${
      [90, 180, 270][Math.floor(Math.random() * 3)]
    }deg)`
  }

  function eliminarCasilla() {
    const disponibles = jugadas
      .map((_, i) => i)
      .filter((i) => jugadas[i] === '')
    if (disponibles.length > 0) {
      const idx = disponibles[Math.floor(Math.random() * disponibles.length)]
      jugadas[idx] = '-'
      const celda = document.querySelector(`[data-index='${idx}']`)
      if (celda) {
        celda.textContent = '❌'
        celda.style.backgroundColor = '#ddd'
      }
    }
  }

  reiniciarBtn.addEventListener('click', reiniciarJuego)

  document.getElementById('volver').addEventListener('click', () => {
    document.getElementById('contenedor-juego').innerHTML = ''
    document.getElementById('contenedor-juego').style.display = 'none'
    document.getElementById('menu').style.display = 'block'
    document.body.className = ''
    document.body.classList.remove(
      'fondo-tecladoninja',
      'fondo-tresenraya',
      'fondo-botonhuye'
    )
    document.body.classList.add('menu-activo')
  })

  iniciarTablero()
}
