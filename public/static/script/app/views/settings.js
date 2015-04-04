define(['jquery',
        'backbone',
        'underscore',
        'i18next',
        'model/user',
        'text!template/dashboard.html',
        'text!template/settings.html',
        'util/constants',
        'model/logout',
        'jquery.cookie'],
    function($,Backbone,_,i18n,User,dashboardTemplate,settingsTemplate,constants,logoutMdl) {

        return Backbone.View.extend({
            el: $('.container'),
            initialize: function(){
            },
            render: function(){
                if($.cookie(constants.token_name)) {
                    var user = new User.User({username: $.cookie(constants.cookie_username)});
                    user.fetch({
                        success: function() {
                            if(user.get("type")=="error") {
                                logout();
                            } else {
                                $(".container").html(_.template(settingsTemplate,{user : user}));
                                $("html").i18n();
                            }
                        }
                    });
                } else {
                    window.location = constants.hash;
                }
            },
            events: {

            }
        });

    }
);