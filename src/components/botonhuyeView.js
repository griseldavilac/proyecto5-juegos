import '../styles/botonhuye.css'

export default function BotonHuyeView() {
  document.getElementById('contenedor-juego').innerHTML = `
    <a href="#" id="volver">⏪ Volver</a>
    <h1>El Botón que Huye</h1>
    <p id="puntuacion">Puntuación: 0</p>
    <button id="botonHuye">¡Haz clic aquí!</button>
  `

  const boton = document.getElementById('botonHuye')
  const puntuacionElemento = document.getElementById('puntuacion')
  let puntuacion = localStorage.getItem('puntuacionHuye') || 0
  let velocidad = 1000

  puntuacionElemento.textContent = `Puntuación: ${puntuacion}`

  function moverBoton() {
    const maxX = window.innerWidth - boton.clientWidth
    const maxY = window.innerHeight - boton.clientHeight

    const nuevoX = Math.random() * maxX
    const nuevoY = Math.random() * maxY

    boton.style.position = 'absolute'
    boton.style.left = `${nuevoX}px`
    boton.style.top = `${nuevoY}px`
  }

  boton.addEventListener('mouseover', () => {
    setTimeout(moverBoton, 100)
  })

  boton.addEventListener('click', () => {
    puntuacion++
    puntuacionElemento.textContent = `Puntuación: ${puntuacion}`
    localStorage.setItem('puntuacionHuye', puntuacion)
    velocidad = Math.max(300, velocidad - 50)
    setTimeout(moverBoton, velocidad)
  })

  document.getElementById('volver').addEventListener('click', () => {
    localStorage.removeItem('puntuacionHuye')
    document.getElementById('contenedor-juego').innerHTML = ''
    document.getElementById('contenedor-juego').style.display = 'none'
    document.getElementById('menu').style.display = 'block'
    document.body.className = ''
    document.body.classList.add('menu-activo')
  })

  moverBoton() // Primer movimiento al cargar
}
