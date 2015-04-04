define(['jquery',
        'backbone',
        'util/constants',
        'model/activate',
        'jquery.ui',
        'jquery.easing',
        'notify'],
    function($,Backbone,constants,activateMdl) {

        return Backbone.View.extend({
            el: $('.container'),
            initialize: function(){
            },
            render: function(options){
                var activate = new activateMdl.Activate();
                activate.fetch({
                    data: $.param({ activationCode: options.code}),
                    success: function(){
                        var notes = $('#notes').notify({
                            removeIcon: '<i class="icon icon-remove"></i>'
                        });

                        if(activate.get("type")=="error") {
                            notes.show(i18n.t("error."+activate.get("message")), {
                                type: 'info',
                                title: 'info',
                                icon: '<i class="icon icon-info-sign"></i>'
                            });
                        } else {
                            notes.show(i18n.t("info."+activate.get("message")), {
                                type: 'info',
                                title: 'info',
                                icon: '<i class="icon icon-info-sign"></i>'
                            });
                        }
                        window.location = constants.hash;
                    }
                });
            }
        });
    }
);