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
  const title = document.querySelector('.products__title')

  async function sendHttpRequest(method, url) {
    const { data } = await axios(url, { method })
    return data
  }

  let prevQuantity = 0
  async function fetchData(text, type) {
    const responseData = await sendHttpRequest('GET', PRODUCT_URL)

    showProducts(responseData)
    if (text !== undefined && type !== 'category') {
      searchProducts(responseData, text)
    } else if (text !== undefined && type === 'category') {
      searchProductsByCategory(responseData, text)
    }
    prevQuantity = addCart(responseData, prevQuantity)
  }
  window.addEventListener('DOMContentLoaded', fetchData())

  /// ===================================
  // search
  // ===================================
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
      productElClone.querySelector('.products__item').dataset.price = price
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
        productElClone.querySelector('.products__item').dataset.price = price
        productElClone.querySelector('.products__item').id = product.id

        productsList.appendChild(productElClone)
      }
    }
  }

  // ===================================
  // Add cart
  // ===================================
  const cartItemNumEl = document.querySelector('.cart-item')
  const costTotalEl = document.querySelector('.cart-box__total span span')
  let costTotal = 0
  cartItemNumEl.textContent = 0
  let myCart = []
  let showMyCart
  let cartItemNum = 0

  function addCart(products) {
    const toast = document.querySelector('.toast')
    const addBtns = document.querySelectorAll('.btn-add')

    addBtns.forEach(function (addBtn) {
      addBtn.addEventListener('click', function () {
        let quantity = Number(
          this.previousElementSibling.previousElementSibling.value
        )
        const thisId = this.parentNode.parentNode.id
        let subTotal = this.parentNode.parentNode.dataset.price * quantity

        toast.classList.add('active')
        setTimeout(() => toast.classList.remove('active'), 2000)

        if (myCart.length == 0) {
          // adding quantity property
          for (const product of products) {
            if (thisId == product.id) {
              product['quantity'] = quantity
              myCart.push(product)
            }
          }
          makeEl(thisId)
          cartItemNum += quantity
          cartItemNumEl.textContent = cartItemNum

          costTotal += subTotal
          costTotalEl.textContent = costTotal.toFixed(2)
          deleteFn()
          deleteAll()
          return
        }

        // Deleting shown cart items
        while (cartList.firstChild) {
          cartList.removeChild(cartList.firstChild)
        }

        if (isExistsSameValue(myCart, thisId)) {
          console.log('true Exist')

          for (const product of myCart) {
            if (thisId == product.id) {
              let newQ = product.quantity + quantity
              product.quantity = newQ
              updateEl(newQ, thisId)
            }
          }
          cartItemNum += quantity
          cartItemNumEl.textContent = cartItemNum

          costTotal += subTotal
          costTotalEl.textContent = costTotal.toFixed(2)
        } else {
          console.log('not exist')
          for (const product of products) {
            if (thisId == product.id) {
              product['quantity'] = quantity
              myCart.push(product)
            }
          }
          makeEl(thisId)
          cartItemNum += quantity
          cartItemNumEl.textContent = cartItemNum

          costTotal += subTotal
          costTotalEl.textContent = costTotal.toFixed(2)
        }

        deleteFn()
        deleteAll()
        return quantity
      })
    })
  }

  function isExistsSameValue(myCart, thisId) {
    let isExist = false
    showMyCart = new Set(myCart)
    showMyCart.forEach((item) => {
      if (item.id == thisId) {
        isExist = true
        return
      }
    })
    return isExist
  }

  function updateEl(prevQuantity, thisId) {
    myCart.forEach((cartItem) => {
      if (cartItem.quantity != 0) {
        const price = cartItem.price.toFixed(2)
        const cartElClone = document.importNode(cartTemplate.content, true)
        cartElClone.querySelector('.cart-box__item-name').textContent =
          cartItem.title
        cartElClone.querySelector('.cart-box__item-price span').textContent =
          price
        if (thisId == cartItem.id) {
          cartElClone.querySelector(
            '.cart-box__item-quantity span'
          ).textContent = prevQuantity
        } else {
          cartElClone.querySelector(
            '.cart-box__item-quantity span'
          ).textContent = cartItem.quantity
        }
        cartElClone
          .querySelector('.cart-box__img')
          .setAttribute('src', cartItem.image)
        cartElClone.querySelector('.cart-box__item-info')
        cartElClone.querySelector('.cart-box__item').id = cartItem.id

        cartList.appendChild(cartElClone)
      }
      return
    })
  }

  function makeEl() {
    myCart.forEach((cartItem) => {
      if (cartItem.quantity != 0) {
        const price = cartItem.price.toFixed(2)
        const cartElClone = document.importNode(cartTemplate.content, true)
        cartElClone.querySelector('.cart-box__item-name').textContent =
          cartItem.title
        cartElClone.querySelector('.cart-box__item-price span').textContent =
          price
        cartElClone.querySelector('.cart-box__item-quantity span').textContent =
          cartItem.quantity
        cartElClone
          .querySelector('.cart-box__img')
          .setAttribute('src', cartItem.image)
        cartElClone.querySelector('.cart-box__item-info')
        cartElClone.querySelector('.cart-box__item').id = cartItem.id
        cartList.appendChild(cartElClone)
      }
    })
  }

  function deleteFn() {
    const deleteBtns = document.querySelectorAll('.cart-box__delete')
    deleteBtns.forEach(function (deleteBtn) {
      deleteBtn.addEventListener('click', deleteItem)
    })
  }

  function deleteItem() {
    let index = myCart.findIndex(({ id }) => {
      return id == Number(this.parentNode.id)
    })

    for (const product of myCart) {
      if (product.id == this.parentNode.id && product.quantity > 0) {
        console.log('product id: ' + product.id)
        console.log('Node id: ' + this.parentNode.id)
        product.quantity--
        cartItemNum--
        document.querySelector(
          `.cart-box__item[id="${this.parentNode.id}"] .cart-box__item-info .cart-box__item-quantity span`
        ).textContent = product.quantity
        cartItemNumEl.textContent = cartItemNum
      }

      if (product.id == this.parentNode.id && product.quantity == 0)
        this.parentNode.remove()
      cartItemNumEl.textContent = cartItemNum
    }

    subtractCost(myCart[index].price)
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
      cartItemNum = 0
      costTotalEl.textContent = costTotal.toFixed(2)
      cartItemNumEl.textContent = cartItemNum
    })
  }

  function subtractCost(subtractAmount) {
    costTotal -= Math.round(subtractAmount * 100) / 100
    if (costTotal < 0) costTotal = 0
    costTotalEl.textContent = costTotal.toFixed(2)
    // console.log(costTotal)
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
        productElClone.querySelector('.products__item').dataset.price = price
        productElClone.querySelector('.products__item').id = product.id

        productsList.appendChild(productElClone)
      }
    }
  }
}
export default products
