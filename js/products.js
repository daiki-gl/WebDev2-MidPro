const products = (PRODUCT_URL, CATEGORY_URL) => {
  // JSON
  const productsList = document.querySelector('.products__list')
  const productTemplate = document.querySelector('#product-tmp')
  const cartList = document.querySelector('.cart-box__list')
  const cartTemplate = document.querySelector('#cart-tmp')
  const searchBtn = document.querySelector('.header__search-btn')
  const searchText = document.querySelector('.header__search')
  const categoriesList = document.querySelector('.header__category-list')
  const categoriesTemplate = document.querySelector('#category-tmp')

  async function sendHttpRequest(method, url) {
    const { data } = await axios(url, { method })
    // console.log(data)
    return data
  }

  async function fetchData(text, type) {
    const responseData = await sendHttpRequest('GET', PRODUCT_URL)
    console.log(responseData)

    showProducts(responseData)
    if (text !== undefined && type !== 'category') {
      searchProducts(responseData, text)
    } else if (text !== undefined && type === 'category') {
      searchProductsByCategory(responseData, text)
    }
    addCart(responseData)
  }
  window.addEventListener('DOMContentLoaded', fetchData())

  /// ===================================
  // search
  // ===================================
  const title = document.querySelector('.products__title')
  searchBtn.addEventListener('click', function () {
    title.textContent = 'Search keyword: ' + searchText.value
    fetchData(searchText.value)
    searchText.value = ''
  })

  function showProducts(responseData) {
    for (const product of responseData) {
      // product list
      const price = product.price.toFixed(2)
      const productElClone = document.importNode(productTemplate.content, true)
      productElClone.querySelector('.product__title').textContent =
        product.title
      productElClone.querySelector('.product__price span').textContent = price
      productElClone
        .querySelector('.product__img-box img')
        .setAttribute('src', product.image)
      productElClone.querySelector('.product__contents')
      productElClone.querySelector('.products__item').id = product.id

      productsList.appendChild(productElClone)
    }
  }

  function searchProducts(responseData, text) {
    while (productsList.firstChild) {
      productsList.removeChild(productsList.firstChild)
    }
    for (const product of responseData) {
      const productTitle = Object.values(product)[1]
      // product list
      if (productTitle.toLowerCase().includes(text.toLowerCase())) {
        const price = product.price.toFixed(2)
        const productElClone = document.importNode(
          productTemplate.content,
          true
        )
        productElClone.querySelector('.product__title').textContent =
          product.title
        productElClone.querySelector('.product__price span').textContent = price
        productElClone
          .querySelector('.product__img-box img')
          .setAttribute('src', product.image)
        productElClone.querySelector('.product__contents')
        productElClone.querySelector('.products__item').id = product.id

        productsList.appendChild(productElClone)
      }
    }
  }

  // ===================================
  // Add cart
  // ===================================
  const cartItemNum = document.querySelector('.cart-item')
  const costTotalEl = document.querySelector('.cart-box__total span span')
  let costTotal = 0
  cartItemNum.textContent = 0
  let myCart = []

  function addCart(products) {
    // console.log(products)
    const toast = document.querySelector('.toast')
    const addBtns = document.querySelectorAll('.btn-add')
    const pushingData = []

    addBtns.forEach(function (addBtn) {
      addBtn.addEventListener('click', function () {
        for (const product of products) {
          let quantity = Number(
            this.previousElementSibling.previousElementSibling.value
          )

          for (let i = 0; i < quantity; i++) {
            if (this.parentNode.parentNode.id == product.id) {
              myCart.push(product)
              pushingData.push(product)
            }
          }
        }
        // cart list
        for (const cartItem of pushingData) {
          const price = cartItem.price.toFixed(2)
          const cartElClone = document.importNode(cartTemplate.content, true)
          cartElClone.querySelector('.cart-box__item-name').textContent =
            cartItem.title
          cartElClone.querySelector('.cart-box__item-price span').textContent =
            price
          cartElClone
            .querySelector('.cart-box__img')
            .setAttribute('src', cartItem.image)
          cartElClone.querySelector('.cart-box__item-info')
          cartElClone.querySelector('.cart-box__item').id = cartItem.id
          cartList.appendChild(cartElClone)

          costTotal += cartItem.price
        }
        pushingData.splice(0)
        // Show and hide toast
        toast.classList.add('active')
        setTimeout(() => toast.classList.remove('active'), 2000)

        cartItemNum.textContent = myCart.length
        costTotalEl.textContent = costTotal.toFixed(2)

        deleteFn()
        deleteAll()

        console.log(myCart)

        return this
      })
    })
  }

  function deleteFn() {
    const deleteBtns = document.querySelectorAll('.cart-box__delete')
    deleteBtns.forEach(function (deleteBtn) {
      deleteBtn.addEventListener('click', deleteItem)
    })
  }

  function deleteItem() {
    this.parentNode.remove()
    let index = myCart.findIndex(({ id }) => {
      return id == Number(this.parentNode.id)
    })

    subtractCost(myCart[index].price)
    if (index >= 0) {
      myCart.splice(index, 1)
    }
    cartItemNum.textContent = myCart.length
    return
  }

  function deleteAll() {
    const deleteAllBtn = document.querySelector('.cart-box__all-clear')
    deleteAllBtn.addEventListener('click', function () {
      while (cartList.firstChild) {
        cartList.removeChild(cartList.firstChild)
        console.log(cartList.firstChild)
      }

      myCart.splice(0)
      costTotal = 0
      costTotalEl.textContent = costTotal.toFixed(2)
      cartItemNum.textContent = myCart.length
    })
  }

  function subtractCost(subtractAmount) {
    costTotal -= Math.round(subtractAmount * 100) / 100
    if (costTotal < 0) costTotal = 0
    costTotalEl.textContent = costTotal.toFixed(2)
    console.log(costTotal)
    return
  }

  // ===================================
  // Show categories
  // ===================================
  async function fetchCategoryData() {
    const responseData = await sendHttpRequest('GET', CATEGORY_URL)

    showCategories(responseData)
    searchByCategory()
  }

  function showCategories(responseData) {
    for (const category of responseData) {
      const categoryElClone = document.importNode(
        categoriesTemplate.content,
        true
      )
      categoryElClone.querySelector('.header__category-link').textContent =
        category.category
      categoryElClone.querySelector('.header__category-item').id = category.id
      categoriesList.appendChild(categoryElClone)
    }
  }
  window.addEventListener('DOMContentLoaded', fetchCategoryData())

  function searchByCategory() {
    const categoryLinks = document.querySelectorAll('.header__category-link')
    categoryLinks.forEach((link) => {
      link.addEventListener('click', function () {
        fetchData(this.textContent, 'category')
      })
    })
  }

  function searchProductsByCategory(responseData, text) {
    while (productsList.firstChild) {
      productsList.removeChild(productsList.firstChild)
    }
    title.textContent = text
    if (text === 'All Items') return showProducts(responseData)

    for (const product of responseData) {
      // product list
      if (product.category == text) {
        const price = product.price.toFixed(2)
        const productElClone = document.importNode(
          productTemplate.content,
          true
        )
        productElClone.querySelector('.product__title').textContent =
          product.title
        productElClone.querySelector('.product__price span').textContent = price
        productElClone
          .querySelector('.product__img-box img')
          .setAttribute('src', product.image)
        productElClone.querySelector('.product__contents')
        productElClone.querySelector('.products__item').id = product.id

        productsList.appendChild(productElClone)
      }
    }
  }
}
export default products
