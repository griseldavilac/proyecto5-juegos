import TresEnRayaView from '../components/tresenrayaView.js'
import TecladoNinjaView from '../components/tecladoninjaView.js'
import BotonHuyeView from '../components/botonhuyeView.js'

const menu = document.getElementById('menu')
const contenedorJuego = document.getElementById('contenedor-juego')

const juegos = {
  tresenraya: TresEnRayaView,
  tecladoninja: TecladoNinjaView,
  botonhuye: BotonHuyeView
}

document.querySelectorAll('.boton-juego').forEach((boton) => {
  boton.addEventListener('click', () => {
    const juego = boton.dataset.juego
    if (juegos[juego]) {
      contenedorJuego.innerHTML = ''
      contenedorJuego.style.display = 'block'
      menu.style.display = 'none'
      document.body.className = ''
      document.body.classList.add('juego-activo', `fondo-${juego}`)
      juegos[juego]()
    } else {
      console.error(`Juego "${juego}" no encontrado.`)
    }
  })
})
