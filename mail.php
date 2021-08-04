<?php
if ($_POST) {
    $name = htmlspecialchars($_POST["Имя"]); 
    $phone = htmlspecialchars($_POST["Телефон"]);
    $email = htmlspecialchars($_POST["E-mail"]);
    $payment = htmlspecialchars($_POST["оплата"]);
    $address = htmlspecialchars($_POST["адрес"]);
    $delivery = htmlspecialchars($_POST["доставка"]);
    $firmDelivery = htmlspecialchars($_POST["фирма_доставки"]);
    $subject = htmlspecialchars($_POST["subject"]);

    $object = json_decode($_COOKIE["basket"]);

    $arrayObj = [];

    foreach ($object as $value) {
        $attributes = array(
          'id' => $value->id,
          'Товар' => $value->name,
          'Цена' => $value->price,
          'Кол-во' => $value->count,
          'Ссылка на товар' => $value->href,
        );
        array_push($arrayObj, $attributes);
    };

    $order ="<table style='text-decoration: none;border-collapse:collapse;width:50%;text-align:center;'>
                <tr>
                    <th style='font-weight:normal;font-size:14px;color:#ffffff;background-color:#0f65a3;border: 1px solid #0f65a3;'>Название</th>  
                    <td style='font-weight:normal;font-size:14px;color:#ffffff;background-color:#0f65a3;border: 1px solid #0f65a3;'>Количество</th>  
                    <td style='font-weight:normal;font-size:14px;color:#ffffff;background-color:#0f65a3;border: 1px solid #0f65a3;'>Цена</th>  
                    <td style='font-weight:normal;font-size:14px;color:#ffffff;background-color:#0f65a3;border: 1px solid #0f65a3;'>Всего</th>
                </tr>";

        foreach ($arrayObj as $key => $value) {
             $order .="
                    <tr>
                        <td style='font-size:13px;color:#354251;text-align:left;padding-left:20px;border: 1px solid #0f65a3;'>".$value['Товар']."</td>  
                        <td style='font-size:13px;color:#354251;border: 1px solid #0f65a3;'>".$value['Кол-во']."</td>  
                        <td style='font-size:13px;color:#354251;border: 1px solid #0f65a3;'>".$value['Цена']." руб.</td>  
                        <td style='font-size:13px;color:#354251;border: 1px solid #0f65a3;'>".$value["Цена"] * $value["Кол-во"]." руб.</td>
                    </tr>
                ";
        }
    $order .=" </table>";

    // $json = array(); 
    // if (!$name or !$email or !$subject or !$message) { 
    //     $json['error'] = 'Вы зaпoлнили нe всe пoля.'; 
    //     echo json_encode($json); 
    //     die();
    // }

    // if(!preg_match("|^[-0-9a-z_\.]+@[-0-9a-z_^\.]+\.[a-z]{2,6}$|i", $email)) { 
    //     $json['error'] = 'Нe вeрный фoрмaт почты.'; 
    //     echo json_encode($json); 
    //     die(); 
    // }

    // Кодировка для отправленных писем 
    function mime_header_encode($str, $data_charset, $send_charset) { 
        if($data_charset != $send_charset)
            $str=iconv($data_charset,$send_charset.'//IGNORE',$str);
        return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
    }

    // Класс для отправки писем на почту
    class TEmail {
        public $from_email;
        public $from_name;
        public $to_email;
        public $to_name;
        public $subject;
        public $data_charset='UTF-8';
        public $send_charset='windows-1251';
        public $body='';
        public $type='text/html';

        function send(){
            $dc=$this->data_charset;
            $sc=$this->send_charset;
            $enc_to=mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
            $enc_subject=mime_header_encode($this->subject,$dc,$sc);
            $enc_from=mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
            $enc_body=$dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);
            $headers='';
            $headers.="Mime-Version: 1.0\r\n";
            $headers.="Content-type: ".$this->type."; charset=".$sc."\r\n";
            $headers.="From: ".$enc_from."\r\n";

            return mail($enc_to,$enc_subject,$enc_body,$headers);
        }
    }

        $emailgo = new TEmail; 
        $emailgo->from_email = 'info@xn--71-glch3atogj.xn--p1ai'; // Почта отправителя 
        $emailgo->from_name  = 'Заказ с сайта'; // Имя отправителя 
        $emailgo->to_email   = "anton.imagemark@gmail.com";  // Куда будет отправлено письмо
        $emailgo->to_name    = "Лесторг"; // Имя получателя
        $emailgo->subject    = 'Заказ с сайта'; // Тема
    
        $emailgo->body       = "<span style='font-size:14px;margin-bottom:10px;'><b>Имя</b>: $name</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>E-mail</b>: $email</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Телефон</b>: $phone</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Адрес доставки</b>: $address</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Способ оплаты</b>: $payment</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Способ доставки</b>: $delivery</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Фирма доставки</b>: $firmDelivery</span><br>
                                <span style='font-size:14px;margin-bottom:10px;'><b>Заказ</b>: $order";

        $emailgo->send(); 

        $json['error'] = 0;

        echo json_encode($json);

    } else { 

        echo 'У вас нет прав для входа на эту страницу!'; 

    }
?>