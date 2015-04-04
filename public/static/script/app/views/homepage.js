define(['jquery',
        'backbone',
        'underscore',
        'i18next',
        'model/user',
        'text!template/homepage.html',
        'util/constants',
        'model/logout',
        'jquery.cookie'],
    function($,Backbone,_,i18n,User,homePageTemplate,constants) {

        //dashboard açılırken burası çalışıyor
        return Backbone.View.extend({
            el: $('.icerik'),
            initialize: function(){
            },
            render: function(){
                $('.container').show(0);
                $(".icerik").html(_.template(homePageTemplate));
            },
            events: {

            }

        });

    }
);
