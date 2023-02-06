//Swiper.js
const mySwiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,
  loopAdditionalSlides: 1,
  effect: 'fade',
  slidesPerView: 1,
  speed: 1000,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
})

const cartBtn = document.querySelector('#cart')
const sidebarCart = document.querySelector('.cart-box')
const body = document.querySelector('body')

const closeBg = document.querySelector('.close-bg')
const closeBtn = document.querySelector('#close-btn')

cartBtn.addEventListener('click', function () {
  body.classList.add('active')
  closeBg.classList.add('active')
  sidebarCart.classList.add('active')
})

closeBtn.addEventListener('click', function () {
  body.classList.remove('active')
  sidebarCart.classList.remove('active')
  closeBg.classList.remove('active')
})

closeBg.addEventListener('click', function () {
  body.classList.remove('active')
  sidebarCart.classList.remove('active')
  this.classList.remove('active')
})
