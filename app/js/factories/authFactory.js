(function() {
    'use strict'

    const app = angular.module('myApp')

    app.factory('auth', [
        '$http',
        'config',
        '$window',
        AuthFactory
    ])
    function AuthFactory($http, config, $window) {
        let user = null

        function signup(user, callback) {
            submit(config.signup, user, callback)
        }

        function login(user, callback) {
            submit(config.login, user, callback)
        }

        function submit(url, user, callback) {
            $http.post(url, user)
            .then(function(response) {
                localStorage.setItem(config.userKey, JSON.stringify(response.data))
                $window.location.reload() // recarrega a página após o login
                $http.defaults.headers.common.Authorization = response.data.token
                $window.location.href = '/'
                if(callback) callback(null, response.data)
            }).catch(function(response) {
                if(callback) callback(response.data.errors, null)
            })
        }

        function logout(callback) {
            user = null
            localStorage.removeItem(config.userKey)
            $http.defaults.headers.common.Authorization = ''
            $window.location.reload()
            if (callback) callback(null)
        }

        function getUser() {
            if(!user) {
                user = JSON.parse(localStorage.getItem(config.userKey))
            }
            // console.log(user)
            return user
        }

        function validateToken(token, callback) {
            if (token) {
                $http.post(config.validateToken, { token })
                .then(response => {
                    if (!response.data.valid) {
                        logout()
                    } else {
                        $http.defaults.headers.common.Authorization = getUser().token
                    }
                    if (callback) callback(null, response.data.valid)
                })
                .catch(function (response) {
                    if (callback) callback(response.data.errors)
                })
            } else {
                if (callback) callback('Token inválido.')
            }
        }

        return {signup, login, logout, getUser, validateToken}
    }
})()