define(['jquery',
        'backbone',
        'underscore',
        'i18next',
        'view/index',
        'view/activate',
        'view/settings',
        'text!template/common/error.html'],
    function($,Backbone,_,i18n,IndexView,ActivateView,SettingsView,errorTemplate) {

        var indexView       = new IndexView(),
            activateView    = new ActivateView(),
            settingsView    = new SettingsView()

        return Backbone.Router.extend({
            routes: {
                ''                  :   'index',
                'dashboard'         :   'dashboard',
                'homepage'          :   'homepage',
                'login'             :   'login',
                'register'          :   'register',
                'activate/:code'    :   'activate',
                'settings'          :   'settings',
                'user/profile'      :   'profile',
                '*path'             :   'default'
            },
            index: function() {
                indexView.render();
            },
            dashboard: function() {
                require(['view/dashboard'], function(DashboardView) {
                    var dashboardView = new DashboardView();
                    dashboardView.render();
                });
            },
            register: function() {
                require(['view/register'], function(RegisterView) {
                    var registerView = new RegisterView();
                    registerView.render();
                });
            },
            login: function() {
                require(['view/login'], function(LoginView) {
                    var loginView = new LoginView();
                    loginView.render();
                });
            },
            settings: function(){
                settingsView.render();
            },
            activate: function(code) {
                activateView.render({code: code});
            },
            homepage: function() {
                require(['view/homepage'], function(HomepageView) {
                    var homepageViev = new HomepageView();
                    homepageViev.render();
                });
            },
            profile: function() {
                require(['view/profile'], function(ProfileView) {
                    var profileViev = new ProfileView();
                    profileViev.render();
                });
            },
            default: function() {
                $(".container").html(_.template(errorTemplate,{error:window.location,status:"URL"}));
                $("html").i18n();
            }
        });

    }
);