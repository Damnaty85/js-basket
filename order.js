document.addEventListener('DOMContentLoaded', function () {

    const field = document.querySelectorAll('input[data-field]');

    function clearRadio (selector) {
        const allInputRadio = document.getElementById(selector).querySelectorAll('input');
        allInputRadio.forEach((radio) => {
            radio.checked = false;
        })
    }
    
    field.forEach((it) => {
        it.addEventListener('click', () => {

            const blockId = it.getAttribute('data-field');
            if (blockId !== "empty") {
                document.getElementById(blockId).style.display = 'grid';
            }

            if (blockId === "address") {
                document.getElementById('delivery').style.display = 'none';
                clearRadio("delivery");
            } else if (blockId === "delivery") {
                document.getElementById("address").style.display = 'grid';     
            } else if (blockId === "empty") {
                document.getElementById('delivery').style.display = 'none';
                document.getElementById('address').style.display = 'none';
                document.getElementById('address').querySelector('input').value = '';
                clearRadio("delivery");
            }
        })
    })
})

$(document).ready(function() { 
    $("#orderForm").submit(function(){ 
        var form = $(this); 
        var error = false; 

        if (!error) {
            var data = form.serialize();
            $.ajax({ 
                type: 'POST', 
                url: 'mail.php', 
                dataType: 'json',
                data: data,
                beforeSend: function(data) {
                    form.find('input[type="submit"]').attr('disabled', 'disabled');
                    $(".submit-loader").text('Отправляю...');
                },
                success: function(data){
                    if (data['error']) { 
                        console.log(data['error']);
                    } else { 
                        $(".order-gratitude").css({'display': "block"});
                        form.css({'display': 'none'});
                        localStorage.removeItem('inBasket');
                        localStorage.removeItem('totalPrice');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { 
                    console.log(xhr.status); 
                    console.log(thrownError);
                },
                complete: function(data) {
                    form.find('input[type="submit"]').prop('disabled', false);
                }
            });
        }
        return false;
    });
});