const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const ui = {
  preloader: document.querySelector(".preloader"),
  petalsContainer: document.querySelector(".petals-container"),
  particlesContainer: document.querySelector(".hero-particles"),
  modal: document.querySelector(".modal"),
  modalImage: document.querySelector(".modal-image"),
  modalClose: document.querySelector(".modal-close"),
  explosionContainer: document.querySelector(".heart-explosion"),
  loveButton: document.querySelector(".love-btn"),
}

window.addEventListener("load", () => {
  setTimeout(() => {
    ui.preloader?.classList.add("hidden")
  }, 850)

  setupReveal()
  setupSmoothScroll()
  setupGalleryModal()
  setupLoveButton()

  if (!prefersReducedMotion) {
    startPetals()
    createHeroParticles()
  }
})

function setupReveal() {
  const items = document.querySelectorAll(".reveal, .stanza")
  if (!items.length) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )

  items.forEach(el => observer.observe(el))
}

function setupSmoothScroll() {
  document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const targetSelector = button.getAttribute("data-scroll")
      const target = targetSelector ? document.querySelector(targetSelector) : null
      target?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  })
}

function startPetals() {
  if (!ui.petalsContainer) return

  const symbols = ["🌸", "🌹", "🌷", "💮", "✨"]
  const maxPetals = 28

  const spawnPetal = () => {
    if (!ui.petalsContainer) return
    if (ui.petalsContainer.childElementCount > maxPetals) return

    const petal = document.createElement("span")
    petal.className = "petal"
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)]
    petal.style.left = `${Math.random() * 100}vw`
    petal.style.fontSize = `${Math.random() * 10 + 12}px`
    petal.style.animationDuration = `${Math.random() * 4 + 8}s`
    petal.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 120}px`)

    ui.petalsContainer.appendChild(petal)
    setTimeout(() => petal.remove(), 12000)
  }

  for (let i = 0; i < 8; i += 1) {
    setTimeout(spawnPetal, i * 220)
  }

  setInterval(spawnPetal, 700)
}

function createHeroParticles() {
  if (!ui.particlesContainer) return

  const amount = Math.min(35, Math.max(16, Math.floor(window.innerWidth / 36)))

  for (let i = 0; i < amount; i += 1) {
    const dot = document.createElement("span")
    dot.className = "hero-particle"
    dot.style.left = `${Math.random() * 100}%`
    dot.style.top = `${Math.random() * 100}%`
    dot.style.animationDelay = `${Math.random() * 5}s`
    dot.style.animationDuration = `${Math.random() * 4 + 4}s`
    if (Math.random() > 0.6) dot.style.background = "#ff6ca1"
    ui.particlesContainer.appendChild(dot)
  }
}

function setupGalleryModal() {
  const cards = document.querySelectorAll(".gallery-card")
  if (!cards.length || !ui.modal || !ui.modalImage) return

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img")
      if (!image) return

      ui.modalImage.src = image.src
      ui.modalImage.alt = image.alt
      if (typeof ui.modal.showModal === "function") {
        ui.modal.showModal()
      }
    })
  })

  ui.modalClose?.addEventListener("click", () => ui.modal?.close())
  ui.modal.addEventListener("click", event => {
    const rect = ui.modal.getBoundingClientRect()
    const inDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width

    if (!inDialog) ui.modal?.close()
  })
}

function setupLoveButton() {
  if (!ui.loveButton || !ui.explosionContainer) return

  const symbols = ["💖", "💗", "💕", "💘", "🌹", "✨"]

  ui.loveButton.addEventListener("click", () => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 30; i += 1) {
      setTimeout(() => {
        const heart = document.createElement("span")
        heart.className = "explosion-heart"
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)]
        heart.style.left = `${centerX}px`
        heart.style.top = `${centerY}px`
        heart.style.setProperty("--tx", `${(Math.random() - 0.5) * window.innerWidth * 0.9}px`)
        heart.style.setProperty("--ty", `${(Math.random() - 0.5) * window.innerHeight * 0.85}px`)
        heart.style.setProperty("--rot", `${(Math.random() - 0.5) * 640}deg`)
        heart.style.fontSize = `${Math.random() * 18 + 16}px`

        ui.explosionContainer.appendChild(heart)
        setTimeout(() => heart.remove(), 1900)
      }, i * 35)
    }

    const initialText = ui.loveButton.textContent
    ui.loveButton.textContent = "💖 Люблю тебя! 💖"
    setTimeout(() => {
      ui.loveButton.textContent = initialText
    }, 1800)
  })
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    ui.modal?.close()
  }
})
