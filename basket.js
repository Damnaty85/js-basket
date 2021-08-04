document.addEventListener('DOMContentLoaded', function() {

	function cache (key, value) {
		if (typeof value == 'undefined') {
		 	return cache[key];
		 }
		 cache[key] = value;
	}

	function querySelectorCache (selector) {
        if (!cache(selector)) {
            cache(selector, document.querySelector(selector))
        }
        return cache(selector);
    }


	window.removeEventListener('click', addToCart)
	let objProp = {};
	const cartWrapper = querySelectorCache('#smallCart')
	const smallCartCount = querySelectorCache('#smallCart span.small-basket__text');
	const smallCartInner = querySelectorCache('#smallCartInner');
	const basketContainer = querySelectorCache('#basketContent');

	const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

	function getBasketData(){
		return JSON.parse(localStorage.getItem('inBasket'));
	};

	function setBasketData(name){
		localStorage.setItem('inBasket', JSON.stringify(name));
		return false;
	};

	function declOfNum(number, words) {  
	    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
	}

	function emptyBasketMessage() {
		smallCartInner.innerHTML = '<img width="130px" height="130px" src="/local/templates/main/images/empty-shopping-cart-icon.png"/><br><span>В вашей корзине пока пусто, <a href="/catalog/">начать</a> покупки</span></br>';
		smallCartCount.innerHTML = ``;
	}

	const generateCartProductTemplate = (id, img, title, price, unit, count, href) => {
		return (`
			<div class="cart-content__item" id=${id}>
				<a class="cart-content__product cart-product" href="${href}">
					<div class="cart-product__img">
						<img src="${img}" alt="${title}">
					</div>
					<div class="cart-product__text">
						<h3 class="cart-product__title">${title}</h3>
						<span class="cart-product__price">Цена: ${price} ${unit ? unit : 'руб./шт'}</span>
						<span class="cart-product__count">Количество ${count}</span>
					</div>
				</a>
				<button class="cart-product__remove"><svg><use href="/local/templates/main/assets/svg/sprite-map.svg#deleteItem"></svg></button>
			</div>
		`);
	};

	function basketHeaderTemplate () {
		return(`
			<div class="basket-table">
				<div class="basket-table__header">
					<div class="basket-table__info">
						<span>наименование</span>
					    <span>цена</span>
					    <span>кол-во</span>
					    <span>стоимость</span>
					</div>
				    <span></span>
				</tr>
			</table>
		`)
	};

	function basketItemTemplate (image, name, price, count, id, unit, link) {
		return(`
			<div class="basket-table__item" id='${id}'>
				<div class="basket-table__info">
					<span><img src="${image}"/> <a href='${link}'>${name}</a></span>
					<span>${price} ${unit ? unit : 'руб./шт'}</span>
					<span class="item-count" data-price="${price}"><button class="item-count__minus">-</button><input type="number" value='${count}' min="1" readonly><button class="item-count__plus">+</button></span>
					<span class="item-total__price" data-total="${price * count}"><b>${priceFormat.format(price * count)}</b></span>
				</div>
				<button class="cart-product__remove"><svg><use href="/local/templates/main/assets/svg/sprite-map.svg#deleteItem"></svg></button>
			</div>
		`)
	};

	function smallBasketFooterTemplate (price) {
		return(`
			<div class="basket__footer">
				<a href="/basket/">Перейти в корзину</a>
				<span class="basket-clear__button">Очистить корзину</span>
				<span class="total-price">Итого: <b>${price}</b></span>
			</div>
		`)
	}

	function basketFooterTemplate (price) {
		return(`
			<div class="basket__footer _cart">
				<div class="basket__footer__total-price" data-total="${price}">
					Итого: ${priceFormat.format(price)}
				</div>
				<a href="order/" class="basket__footer__order">Оформить заказ</a>
			</div>`)
	}

	function addToCart(evt) {
		evt.target.style.ponterEvents = 'none';
		let basketData = getBasketData() || {};
		const itemId = evt.target.getAttribute('data-id');
		const itemName = evt.target.getAttribute('data-name');
		const itemPrice = evt.target.getAttribute('data-price');
		const itemCount = evt.target.getAttribute('data-count');
		const itemUnit = evt.target.getAttribute('data-unit');
		const itemImage = evt.target.getAttribute('data-image');
		const itemLink = evt.target.getAttribute('data-link');

		objProp = {
			'id': itemId, 
			'name': itemName,
			'image': itemImage,
			'price': Number(itemPrice),
			'count': Number(itemCount), 
			'unit': itemUnit,
			'href': itemLink
		}

		if (basketData.hasOwnProperty(itemId)) {
			basketData[itemId].count += 1;
		} else {
			basketData[itemId] = objProp;
		}

		if(!setBasketData(basketData)){
			evt.target.style.ponterEvents = 'auto';
		}

		if (getBasketData()) {
			renderSmallBasket();
		} 

		smallCartInner.innerHTML = '';
		renderSmallBasketItem();
		totalPriceCalc();
		clearBasket(smallCartInner);
	}

	function clearBasket(selector) {
		let basketData = getBasketData() || {};
		if (Object.keys(basketData).length !== 0) {
			const clearButton = selector.querySelector('.basket-clear__button');

			clearButton.addEventListener('click', () => {
				localStorage.removeItem('inBasket');
				emptyBasketMessage();
			})
		}
	}

	function snackBarComponent (target, color, text) {
		target.style.pointerEvents = 'none';
		const body = querySelectorCache('body');
		const message = document.createElement('div');
		message.classList.add('snackbar-message');
		message.innerHTML = `${text}`;
		message.style.backgroundColor = color;
		body.insertAdjacentElement("beforeend", message);

		setTimeout(() => {
			message.style.opacity = '1';
			setTimeout(() => {
				message.style.opacity = '0';
				target.style.pointerEvents = 'unset';
				setTimeout(() => {
					message.remove();
				}, 225)
			}, 1000)
		}, 225)
	}

	if (querySelectorCache('.catalog-section')) {
		const items = document.querySelectorAll('.catalog-section__item');
		items.forEach(function(item) {
			const buyButton = item.querySelector('.add-item-to-basket');
			if (item.querySelector('.catalog-section__price').textContent.trim() != '') {
				buyButton.classList.remove('catalog-section__buy');
				buyButton.innerHTML = `Купить`;

				buyButton.addEventListener('click', addToCart);
				buyButton.addEventListener('click', function() {
					snackBarComponent(this, '#367e50', 'Товар успешно добавлен в корзину');
				});
			}
		})

		const emptyItems = document.querySelectorAll('.catalog-section__buy');
		emptyItems.forEach((item) => {
			item.addEventListener('click', () => {
				querySelectorCache(".zakaz").style.display = 'block';
			})
		})
	}

	if (querySelectorCache('.catalog-detail')) {
		const detailPage = querySelectorCache('.catalog-detail');
		const buyButtonDetail = detailPage.querySelector('.add-item-to-basket');
		const priceDetail = detailPage.querySelector('.catalog-detail__price span');

		if (detailPage.querySelector('.catalog-detail__price span')) {
			if (priceDetail.textContent.trim() != '') {
				buyButtonDetail.classList.remove('det-zakazat');
				buyButtonDetail.innerHTML = `Купить`;

				buyButtonDetail.addEventListener('click', addToCart, false);
				buyButtonDetail.addEventListener('click', function() {
					snackBarComponent(this, '#367e50', 'Товар успешно добавлен в корзину')
				});
			}
		} else if (buyButtonDetail.classList.contains('det-zakazat')) {
			buyButtonDetail.addEventListener('click', () => {
				querySelectorCache(".zakaz").style.display = 'block';
			})
		}
	}	

	if (querySelectorCache('.detail-like__container')) {
		const items = document.querySelectorAll('.detail-like__item');
		items.forEach(function(item) {
			const buyButton = item.querySelector('.add-item-to-basket');
			if (item.querySelector('.detail-like__price')) {
				if (item.querySelector('.detail-like__price').textContent.trim() != '') {
					buyButton.classList.remove('detail-like__buy');
					buyButton.innerHTML = `Купить`;

					buyButton.addEventListener('click', addToCart);
					buyButton.addEventListener('click', function() {
						snackBarComponent(this, '#367e50', 'Товар успешно добавлен в корзину');
					});
				}
			}
		})

		const emptyItems = document.querySelectorAll('.detail-like__buy');
		emptyItems.forEach((item) => {
			item.addEventListener('click', () => {
				querySelectorCache(".zakaz").style.display = 'block';
			})
		})
	}

	function renderSmallBasket() {
		totalPriceCalc();
		smallCartCount.innerHTML = `<span>${Object.keys(getBasketData()).length}</span>`
	}

	function renderSmallBasketItem() {
		deleteItemFromCart(smallCartInner);
		smallCartInner.innerHTML = ' ';
		smallCartInner.insertAdjacentHTML('afterbegin', Object.values(getBasketData()).map((it) => (
			generateCartProductTemplate(it.id, it.image, it.name, it.price, it.unit, it.count, it.href)
		)).join(' '));
	}

	function totalPriceCalc() {
		let summ;
		if (smallCartInner.querySelector('.basket__footer')) {
			smallCartInner.querySelector('.basket__footer').remove();
		}
		let basketData = getBasketData() || {};
		if (Object.keys(basketData).length !== 0) {
			const totalPrice = [];
			Object.values(getBasketData()).map(it => totalPrice.push(it.price * it.count))
			summ = totalPrice.reduce(function (accumulator, currentValue) {
				return accumulator + currentValue;
			})
			smallCartInner.insertAdjacentHTML('beforeend', smallBasketFooterTemplate(priceFormat.format(summ)));
			clearBasket(smallCartInner);
		}
		return summ;
	}

	function deleteItemFromCart(selector) {
		const priceArray = [];
		if (selector.childNodes) {
			let basketData = getBasketData() || {};
			setTimeout(() => {
				const deleteButtons = selector.querySelectorAll('.cart-product__remove')

				deleteButtons.forEach(function (button) {
					button.addEventListener('click', function(){
						
						const itemId = this.parentNode.getAttribute('id');

						delete basketData[itemId]
						if(!setBasketData(basketData)){
							renderSmallBasket();
							this.parentNode.remove();
							totalPriceCalc();
						}
						if (Object.keys(getBasketData()).length === 0) {
							localStorage.removeItem('inBasket');
							emptyBasketMessage();
						}
						snackBarComponent(this, '#f44336', 'Товар удален из корзины')
					})
					if(!setBasketData(basketData)){
						//обновляем данные
					}
				})
			}, 100)
		}
	}

	function setCookie(name, value, options) {
		options = options || {};
		let expires = options.expires;
		if (typeof expires == "number" && expires) {
			let date = new Date();
			date.setTime(date.getTime() + expires * 1000);
			expires = options.expires = date;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);
		let updatedCookie = name + "=" + value;

		for (let propName in options) {
			updatedCookie += "; " + propName;
			let propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue
			}
		}
		document.cookie = updatedCookie;
	}

	function deleteCookie (name){
		let date = new Date ( );
		date.setTime ( date.getTime() - 1 );
		document.cookie = name += "=; expires=" + date.toGMTString();
	}

	function getCookie (name){
		let results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );
		if ( results )
			return ( unescape ( results[2] ) );
		else
			return null;
	}

	if (location.pathname === '/basket/' || location.pathname === '/basket/order/') {
		cartWrapper.style.display = 'none';
	}

	if (location.pathname === '/basket/') {
		if (getCookie('basket')) {
			deleteCookie('basket')
		}
		let basketData = getBasketData() || {};
		let totalPriceData = localStorage.getItem('totalPrice') || '';

		basketContainer.insertAdjacentHTML('afterbegin', basketHeaderTemplate());

		basketContainer.querySelector('.basket-table').insertAdjacentHTML('beforeend', Object.values(basketData).map((it) => (
			basketItemTemplate(it.image, it.name, it.price, it.count, it.id, it.unit, it.href)
		)).join(' '))

		let priceArray = [];

		const removeItemButtons = basketContainer.querySelectorAll('.item-count__minus');
		const addItemButtons = basketContainer.querySelectorAll('.item-count__plus');
		const deleteFromBasketButton = basketContainer.querySelectorAll('.cart-product__remove');

		function recalculatePriceInBasket(selector, value) {

			const itemPrice = selector.parentNode.getAttribute("data-price");
			const totalPrice = selector.parentNode.parentNode.querySelector('.item-total__price b');
			totalPrice.innerHTML = `${priceFormat.format(itemPrice * value)}`
			selector.parentNode.parentNode.querySelector('.item-total__price').setAttribute('data-total', itemPrice * value);

			let priceRecalcArray = [];

			calculateTotalPriceInBasket(priceRecalcArray, '.item-total__price');

		}

		removeItemButtons.forEach((item) => {
			if (Number(item.nextElementSibling.getAttribute('value')) <= 1) {
				item.disabled = 'true';
			}
			item.addEventListener('click', function() {
				let basketData = getBasketData() || {};
				let value = Number(this.parentNode.querySelector('input').getAttribute('value'));
				let newValue = value -= 1;
				const itemId = this.parentNode.parentNode.parentNode.getAttribute('id');
				basketData[itemId].count -= 1;
				recalculatePriceInBasket(this, newValue);
				this.parentNode.querySelector('input').setAttribute('value', newValue);
				if (newValue <= 1) {
					this.disabled = 'true';
				}
				if(!setBasketData(basketData)){
						//обновляем данные
				}
			})
		})

		addItemButtons.forEach((item) => {
			item.addEventListener('click', function() {
				let basketData = getBasketData() || {};
				let value = Number(this.parentNode.querySelector('input').getAttribute('value'));
				let newValue = value += 1;
				const itemId = this.parentNode.parentNode.parentNode.getAttribute('id');
				basketData[itemId].count += 1;
				this.parentNode.querySelector('input').setAttribute('value', newValue);
				recalculatePriceInBasket(this, newValue)
				if (newValue >= 1) {
					this.parentNode.querySelector('.item-count__minus').removeAttribute('disabled');
				}
				if(!setBasketData(basketData)){
					//обновляем данные
				}
			})
		})

		deleteFromBasketButton.forEach((deleteButton) => {
			deleteButton.addEventListener('click', function() {
				let basketData = getBasketData() || {};
				const itemTotalPrice = deleteButton.parentNode.querySelector('.item-total__price').getAttribute('data-total');
				let totalPriceHTML = localStorage.getItem('totalPrice');
				let newTotalPriceHTML = totalPriceHTML -= itemTotalPrice;
				localStorage.setItem('totalPrice', newTotalPriceHTML);

				if (basketContainer.querySelector('.basket__footer._cart')) {
					basketContainer.querySelector('.basket__footer._cart').remove();
				}
				basketContainer.querySelector('.basket-table').insertAdjacentHTML('beforeend', basketFooterTemplate(newTotalPriceHTML))

				if(!setBasketData(basketData)){
					//обновляем данные
				}
				snackBarComponent(this, '#f44336', 'Товар удален из корзины')
			})
		})

		function calculateTotalPriceInBasket(array, selector) {
			let totalPrice;
			let basketData = getBasketData() || {};
			const allTotalPrice = basketContainer.querySelectorAll(selector);
			if (basketContainer.querySelector('.basket__footer')) {
				basketContainer.querySelector('.basket__footer').remove();
			}

			allTotalPrice.forEach((item) => {
				const price = Number(item.getAttribute('data-total'));
				array.push(price);
			})

			if (array.length !== 0) {
				totalPrice = array.reduce(function (accumulator, currentValue) {
					return accumulator + currentValue;
				})

				localStorage.setItem('totalPrice', totalPrice);

				basketContainer.querySelector('.basket-table').insertAdjacentHTML('beforeend', basketFooterTemplate(totalPrice))
			}

			if(!setBasketData(basketData)){
					//обновляем данные
			}

			return totalPrice;
		}
		
		calculateTotalPriceInBasket(priceArray, '.item-total__price')


		if (querySelectorCache('.basket__footer__order')) {
			let basketData = getBasketData() || {};
			const orderButton = document.querySelector('.basket__footer__order');

			orderButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				const href = evt.target.href;
				setCookie("basket", JSON.stringify(basketData));
				setTimeout(() => {
					location.href = href;
				}, 1200)
			});

		}

		deleteItemFromCart(basketContainer);
	}

	if (getBasketData()) {
		totalPriceCalc();
		renderSmallBasketItem();
		renderSmallBasket();
	} else {
		emptyBasketMessage();
	}
})