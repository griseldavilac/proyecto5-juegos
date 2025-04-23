import '../styles/tecladoninja.css'

export default function TecladoNinjaView() {
  document.getElementById('contenedor-juego').innerHTML = `
    <a href="#" id="volver">⏪ Volver</a>
    <h1>Teclado Ninja</h1>
    <div class="contenedor-juego">
      <p id="tiempo">Tiempo: <span id="temporizador">10</span>s</p>
      <p id="palabra">...</p>
      <input type="text" id="entrada" placeholder="Escribe aquí..." autofocus />
      <p id="puntuacion">Puntuación: 0</p>
      <p id="record">Récord: 0</p>
    </div>
  `

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

  function nuevaPalabra() {
    if (palabras.length === 0 || juegoPausado) return

    let nueva
    do {
      nueva = palabras[Math.floor(Math.random() * palabras.length)]
    } while (nueva === palabraActual)

    palabraActual = nueva
    palabraElemento.textContent = palabraActual
    entrada.value = ''

    clearInterval(intervalo)
    tiempoRestante = Math.max(Math.floor(palabraActual.length * 0.3 + 2), 3)
    actualizarTiempo()
    iniciarTemporizador()
  }

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

  function actualizarTiempo() {
    tiempoElemento.textContent = tiempoRestante
  }

  function manejarTiempoAgotado() {
    clearInterval(intervalo)
    if (entrada.value.trim() === '') {
      if (puntuacion > 0) {
        puntuacion--
        puntuacionElemento.textContent = `Puntuación: ${puntuacion}`
        if (puntuacion === 5) mostrarMensaje('⚡ ¡Estás en racha, ninja!')
        else if (puntuacion === 10)
          mostrarMensaje('🔥 ¡Nivel letal desbloqueado!')
        else if (puntuacion === 15) mostrarMensaje('💀 ¡Maestría absoluta!')
        else if (puntuacion === 20) mostrarMensaje('🌪️ ¡Reflejos sobrehumanos!')
        mostrarMensaje('⏳ ¡No escribiste nada! -1 punto')
      } else {
        mostrarMensajeFinal(`💀 ¡El juego ha finalizado!`)
      }
    } else {
      registrarFallo()
    }
  }

  function mostrarMensajeFinal(texto) {
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
    mensajeDiv.style.textAlign = 'center'
    mensajeDiv.style.fontSize = '1.5rem'
    mensajeDiv.innerHTML = `<p>${texto}</p><p>Puntuación final: ${puntuacion}</p>`

    const boton = document.createElement('button')
    boton.textContent = 'Reiniciar'
    boton.style.marginTop = '15px'
    boton.onclick = () => location.reload()
    mensajeDiv.appendChild(boton)

    document.body.appendChild(mensajeDiv)
    entrada.disabled = true
  }

  function mostrarMensaje(msg) {
    const aviso = document.createElement('div')
    aviso.textContent = msg
    aviso.style.position = 'fixed'
    aviso.style.bottom = '20px'
    aviso.style.left = '50%'
    aviso.style.transform = 'translateX(-50%)'
    aviso.style.background = '#333'
    aviso.style.color = '#fff'
    aviso.style.padding = '10px 20px'
    aviso.style.borderRadius = '8px'
    aviso.style.zIndex = '1000'
    document.body.appendChild(aviso)
    setTimeout(() => aviso.remove(), 2000)
  }

  function registrarFallo() {
    errores++
    if (errores >= 3) {
      mostrarMensajeFinal('💀 ¡Demasiados fallos!')
      return
    }

    if (puntuacion > 0) {
      puntuacion--
      puntuacionElemento.textContent = `Puntuación: ${puntuacion}`
    }
    mostrarMensaje('❌ ¡Fallo! Palabra incorrecta.')
    entrada.value = ''
    nuevaPalabra()
  }

  entrada.addEventListener('input', () => {
    if (juegoPausado) return
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
    } else if (entrada.value.length >= palabraActual.length) {
      registrarFallo()
    }
  })

  document.getElementById('volver').addEventListener('click', () => {
    // Eliminar mensaje final si estaba presente
    const mensajeFinal = document.getElementById('mensaje-final')
    if (mensajeFinal) mensajeFinal.remove()

    // Limpiar temporizador
    if (intervalo) clearInterval(intervalo)

    // Resetear variables de control
    juegoPausado = true
    modoDios = false
    palabraActual = ''
    errores = 0

    // Volver al menú y limpiar estilos
    document.getElementById('contenedor-juego').innerHTML = ''
    document.getElementById('contenedor-juego').style.display = 'none'
    document.getElementById('menu').style.display = 'block'
    document.body.className = ''
    document.body.classList.add('menu-activo')
  })

  nuevaPalabra()
  iniciarTemporizador()
}
