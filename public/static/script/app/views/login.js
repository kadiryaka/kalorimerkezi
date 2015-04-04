define(['jquery',
        'backbone',
        'i18next',
        'text!template/login.html',
        'text!template/dashboard.html',
        'util/constants',
        'model/login',
        'jquery.cookie',
        'jquery.ui',
        'jquery.easing',
        'notify'],
    function($,Backbone,i18n,loginTemplate,dashboardTemplate,constants,loginModel) {

        console.log("yok artık mk login js");

        return Backbone.View.extend({
            el: $('.login'),
            initialize: function(){
            },
            render: function(){
                if($.cookie(constants.token_name)) {
                    window.location = constants.base_link + "/#dashboard";
                } else {
                    $('.container').hide(0);
                    $(".login").html(loginTemplate);
                    $("html").i18n();
                }
            },
            events: {
                "click #login_ok"   : "login_ok",
                "click #sign_up"    : "sign_up",
                "click .sender"     : "loginSend"
            },
            /**
             *girişe basılınca mail ve şifreyi kontrol eder ve kullanıcı varsa cookie'e değer atar
             */
            loginSend: function() {
                var mail = $('#mail').val();
                var pass = $('#password').val();
                var data = {'mail' : mail, 'password' : pass};
                $.ajax({
                    type: 'POST',
                    url: '/token/login',
                    data : data,
                    dataType : 'json',
                    success: function (response) {
                        if(response.result == "error") {
                            alert("kullanıcı adı veya şifre yanlış");
                        } else if (response.result == "success") {
                            console.log("cookie atıycak username : " +response.username)
                            $.cookie(constants.token_name, response.data);
                            $.cookie(constants.cookie_username, response.username);
                            console.log("cookie at")
                            window.location = constants.hash + 'dashboard';
                        }
                    },
                    error: function() {
                        alert("bir hata oluştu");
                    }
                });
            },
            login_ok : function() {

                var notes = $('#notes').notify({
                    removeIcon: '<i class="icon icon-remove"></i>'
                });

                var login = new loginModel.Login();



                login.fetch({
                    data: $.param({ username: $("#username").val(), password: $("#password").val()}),
                    success: function(){
                        if(login.get("type")=="token") {
                            $.cookie(constants.token_name,login.get("message"));
                            $.cookie(constants.cookie_username,login.get("username"));
                            window.location = constants.hash+"dashboard";
                        } else {
                            notes.show(i18n.t("error."+login.get("message")), {
                                type: 'info',
                                title: 'info',
                                icon: '<i class="icon icon-info-sign"></i>'
                            });
                        }
                    }
                });

            },
            sign_up : function() {
                window.location = constants.hash+"register";
            }
        });

    }
);