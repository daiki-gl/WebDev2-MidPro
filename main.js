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
