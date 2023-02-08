import { PRODUCT_URL } from './config.js'
import { CATEGORY_URL } from './config.js'
import { mySwiper } from './js/swiper.js'
import { openCart } from './js/openCart.js'
import products from './js/products.js'

openCart()
products(PRODUCT_URL, CATEGORY_URL)
