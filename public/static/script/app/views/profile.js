define(['jquery',
        'backbone',
        'underscore',
        'i18next',
        'model/user',
        'text!template/profile.html',
        'util/constants',
        'model/logout',
        'jquery.cookie'],
    function($,Backbone,_,i18n,User,profileTemplate,constants,logoutMdl) {

        return Backbone.View.extend({
            el: $('.container'),
            initialize: function(){
            },
            render: function(){
                if($.cookie(constants.kalori_token)) {
                    console.log("profile girmesi lazım");
                    $('.container').show(0);
                    $(".icerik").html(_.template(profileTemplate));
                } else {
                    window.location = constants.hash;
                }
            },
            events: {

            }
        });

    }
);