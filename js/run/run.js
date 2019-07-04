(function() {
    'use strict'

    const app = angular.module('myApp')

    app.run(function($rootScope, $http, $transitions, $window, auth) {
        validateUser()
        $rootScope.$on('$locationChangeStart', () => validateUser())

        function validateUser() {
            const user = auth.getUser()

            if (!user) {
                $rootScope.logado = false
            } else if (user && !user.isValid) {
                auth.validateToken(user.token, (err, valid) => {
                    if (!valid) {
                        $rootScope.logado = false
                    } else {
                        user.isValid = true
                        $http.defaults.headers.common.Authorization = user.token
                        $rootScope.logado = true
                        $rootScope.user = auth.getUser() // Variável global para printar na DOM
                    }
                })
            }
        }

        $rootScope.logout = function() {
            $rootScope.logado = false
            auth.logout()
        }


        const mobileScreen = $(window).width() < 768

        // Fade effect
        $transitions.onEnter({}, function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $('body').addClass('animated fadeIn');
        })
        $transitions.onExit({}, function() {
            $('body').removeClass('animated fadeIn');
        })

        // Sidebar collapse
        if(mobileScreen) {
            $rootScope.sidebarCollapsed = true
            $transitions.onEnter({}, function() {
                $rootScope.sidebarCollapsed = true
            })
        } else {
            $rootScope.sidebarCollapsed = false
        }
        $rootScope.sidebarCollapse = function() {
            $rootScope.sidebarCollapsed = !$rootScope.sidebarCollapsed
        }
    })
})()