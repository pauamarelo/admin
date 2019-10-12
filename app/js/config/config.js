const app = angular.module('myApp')

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('inicio', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        })
        .state('noticias', {
            url: '/noticias',
            templateUrl: 'views/noticias.html',
            controller: 'noticiasCtrl',
            controllerAs: 'vm'
        })
        .state('perfil', {
            url: '/perfil',
            templateUrl: 'views/perfil.html',
            controller: 'perfilCtrl',
            controllerAs: 'vm',
            resolve: {
                loadMyFactory: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('js/factories/authFactory.js')
                }]
            }
        })
        .state('integrantes', {
            url: '/integrantes',
            templateUrl: 'views/integrantes.html',
            controller: 'integrantesCtrl',
            controllerAs: 'vm'
        })
        .state('galeria', {
            url: '/galeria',
            templateUrl: 'views/galeria.html',
            controller: 'galeriaCtrl',
            controllerAs: 'vm'
        })
        .state('partidas', {
            url: '/partidas',
            templateUrl: 'views/partidas.html',
            controller: 'partidasCtrl',
            controllerAs: 'vm'
        })

    $locationProvider.html5Mode(true)
})