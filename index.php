<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Оформление заказа");
?>

<div class="order-gratitude" style="display: none">
    <svg><use href="/local/templates/main/assets/svg/sprite-map.svg#thankIcon"></svg>
    <div class="order-gratitude__title">
        Заказ успешно оформлен
    </div>
    <div class="order-gratitude__subtitle">
        В самое ближайшее время мы свяжемся с Вами
    </div>
    Перейти на <a href="/">главную</a> или <a href="/catalog/">продолжить покупки</a>
</div>

<form action="#" method="POST" id="orderForm">
    <div class="form-group">
        <span class="form__title title-rule">Выберите способ доставки</span>
        <div class="custom-radio">
            <input id="delivery1" type="radio" name="доставка" value="Самовывоз" class="visual-hidden" data-field="empty" checked>
            <label for="delivery1"><span>Самовывоз</span></label>
        </div>
        <div class="custom-radio">
            <input id="delivery2" type="radio" name="доставка" value="Доставка силами компании" class="visual-hidden" data-field="address">
            <label for="delivery2"><span>Доставка силами компании</span></label>
        </div>
        <div class="custom-radio">
            <input id="delivery3" type="radio" name="доставка" value="Доставка по России" class="visual-hidden" data-field="delivery">
            <label for="delivery3"><span>Доставка по России</span></label>
        </div>
    </div>
    <div class="form-group _firm-delivery" id="delivery">
        <span class="form__subtitle title-rule">Выберите способ доставки</span>
        <div class="custom-radio__image">
            <input id="firmDelivery1" type="radio" name="фирма доставки" value="ЖелДорЭкспедиция" class="visual-hidden" checked>
            <label for="firmDelivery1"><img src="/local/templates/main/images/order_form/1.png" alt=""></label>
        </div>
        <div class="custom-radio__image">
            <input id="firmDelivery2" type="radio" name="фирма доставки" value="ДеловыеЛинии" class="visual-hidden">
            <label for="firmDelivery2"><img src="/local/templates/main/images/order_form/2.png" alt=""></label>
        </div>
        <div class="custom-radio__image">
            <input id="firmDelivery3" type="radio" name="фирма доставки" value="ПЭК" class="visual-hidden">
            <label for="firmDelivery3"><img src="/local/templates/main/images/order_form/3.png" alt=""></label>
        </div>
    </div>
    <div class="form-input" id="address">
        <span class="form__subtitle">Введите ваш адрес</span>
        <input type="address" name='адрес' value="">
    </div>
    <div class="form-group">
        <span class="form__title title-rule">Выберите способ оплаты</span>
        <div class="custom-radio">
            <input id="payment1" type="radio" name="оплата" value="Наличными" class="visual-hidden" checked>
            <label for="payment1"><span>Наличными</span></label>
        </div>
        <div class="custom-radio">
            <input id="payment2" type="radio" name="оплата" value="Безналичный расчет" class="visual-hidden">
            <label for="payment2"><span>Безналичный расчет</span></label>
        </div>
    </div>
    <span class="form__title">Заполните форму</span>
    <div class="form-input">
        <label>Ваше Ф.И.О. <small>*</small></label>
        <input type="text" required name="Имя" required value="" placeholder="Введите ваше Ф.И.О.">
    </div>
    <div class="form-input">
        <label>Ваш номер телефона <small>*</small></label>
        <input type="tel" required name="Телефон" value="" placeholder="+ 7 (___) ___-__-__">
    </div>
    <div class="form-input">
        <label>Ваш email <small>*</small></label>
        <input type="email" required name="E-mail" value="" placeholder="Введите email ">
    </div>
    <div class="form-submit">
        <input type="submit" name="submit" value="Оформить заказ"  class="btn btn-success" />
        <span class="submit-loader"></span>
    </div>
</form>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>