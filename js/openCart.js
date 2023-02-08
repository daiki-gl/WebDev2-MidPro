// Open cart
const openCart = () => {
  const cartBtn = document.querySelector('#cart')
  const sidebarCart = document.querySelector('.cart-box')
  const body = document.querySelector('body')
  const closeBg = document.querySelector('.close-bg')
  const closeBtn = document.querySelector('#close-btn')

  function addActive() {
    body.classList.add('active')
    closeBg.classList.add('active')
    sidebarCart.classList.add('active')
  }
  function removeActive() {
    body.classList.remove('active')
    sidebarCart.classList.remove('active')
    closeBg.classList.remove('active')
  }

  cartBtn.addEventListener('click', addActive)
  closeBtn.addEventListener('click', removeActive)
  closeBg.addEventListener('click', removeActive)
}
export { openCart }
