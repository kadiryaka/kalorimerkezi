define(['jquery',
        'backbone',
        'i18next',
        'text!template/register.html',
        'util/constants',
        'model/register',
        'jquery.cookie'],
    function($,Backbone,i18n,registerTemplate,constants,registerModel) {


        return Backbone.View.extend({
            el: $('.container'),
            initialize: function(){
            },
            render: function(){
                if($.cookie(constants.token_name)) {
                    $.ajax({
                        type : 'GET',
                        url  : '/api/user/userName',
                        headers: { 'kalori_token' : $.cookie(constants.token_name)},
                        success : function(e) {
                            console.log("register render success");
                            $('.container').show(0);
                            $(".icerik").empty().html(registerTemplate);
                            $("html").i18n();
                        },
                        error : function(e) {
                            window.location = constants.hash+"login";
                        }
                    })
                } else {
                    window.location = constants.hash+"login";
                }
            },
            events: {
                "click #register_ok": "register_ok"
            },
            register_ok : function() {

                var password = $("#password").val().trim();
                var password2 = $("#password2").val().trim();
                var name = $("#name").val().trim();
                var surname = $("#surname").val().trim();
                var mail = $("#mail").val().trim();
                var tel = $('#tel').val().trim();

                if (name == "" || surname == "" || mail == "" || password == "" || password2 == "" || tel == ""
                    || name == undefined || surname == undefined || mail == undefined || password == undefined || password2 == undefined || tel == undefined
                ) {
                    console.log(name + surname + mail + password + password2);
                    $("#feedback-panel").text("Lütfen bilgileri eksiksiz ve doğru giriniz").show(500).css("color", "red");
                } else {
                    if (!isValidEmailAddress(mail)) {
                        $("#feedback-panel").text("Geçersiz mail adresi").show(500).css("color", "red");
                    } else if (password != password2) {
                        $("#feedback-panel").text("Şifre uyuşmuyor").show(500).css("color", "red");
                    } else {
                        $("#feedback-panel").text("").show(0).css("color", "red");
                        var data = {'name': name, 'surname': surname, 'mail': mail, 'tel': tel, 'password': password};

                        $.ajax({
                            type: 'POST',
                            url: 'api/user/register',
                            headers: {'kalori_token': $.cookie(constants.token_name)},
                            data: data,
                            dataType: 'json',
                            success: function () {
                                $("#feedback-panel").text("Kayıt Başarılı").show(0).css("color", "green");
                                //TODO burada 2 sn sonra kullanıcı profiline yönlendirilmesi lazım
                            },
                            error: function () {
                                $("#feedback-panel").text("Kayıt Başarısız!").show(0).css("color", "red");
                            }
                        });
                    }
                }

            }
        });

    }

);

//mail geçerlilik kontrolü
function isValidEmailAddress(emailAddress) {
    return /^[\w_.]+@[\w_.]+\.[\w_.]+$/.test(emailAddress);
}