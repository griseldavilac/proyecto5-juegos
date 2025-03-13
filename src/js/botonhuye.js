const boton = document.getElementById('botonHuye')
const puntuacionElemento = document.getElementById('puntuacion')
const volver = document.getElementById('volver')

let puntuacion = localStorage.getItem('puntuacionHuye') || 0
let velocidad = 1000 // Tiempo en ms antes de moverse

puntuacionElemento.textContent = `Puntuación: ${puntuacion}`

// Función para mover el botón a una posición aleatoria
function moverBoton() {
  const maxX = window.innerWidth - boton.clientWidth
  const maxY = window.innerHeight - boton.clientHeight

  const nuevoX = Math.random() * maxX
  const nuevoY = Math.random() * maxY

  boton.style.left = `${nuevoX}px`
  boton.style.top = `${nuevoY}px`
}

// Cuando el mouse se acerca, el botón huye
boton.addEventListener('mouseover', () => {
  setTimeout(moverBoton, 100)
})

// Cuando se hace clic en el botón, se suma puntuación y se mueve más rápido
boton.addEventListener('click', () => {
  puntuacion++
  puntuacionElemento.textContent = `Puntuación: ${puntuacion}`
  localStorage.setItem('puntuacionHuye', puntuacion)

  // Reduce el tiempo de movimiento
  velocidad = Math.max(300, velocidad - 50)
  setTimeout(moverBoton, velocidad)
})

// Reiniciar puntuación si vuelven al menú
volver.addEventListener('click', () => {
  localStorage.removeItem('puntuacionHuye')
})
