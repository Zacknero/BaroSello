/**
 * Created by Davide Zamballetti on 19/03/2017.
 */
(function () {
    'use strict';

    angular.module("myApp", [])

        .controller("baroSelloController",
            function ($scope, baroSelloService, $interval) {

                $scope.barosello = {
                    numberInput: 0,
                    outputStep: '',
                    outputStep1: ''
                };

                var promise;
                var timeToNexT = 1000; //tempo di ciclo - 1000 = 1 secondo
                $scope.showManualInput = true;

                $scope.typeInput = function (type) {

                    if (type && type === 'M') {
                        //entra solo se è il tipo di input è manuale
                        $scope.barosello.outputStep = '';
                        $scope.barosello.outputStep1 = '';
                        calculate();
                        calculateMulti7();
                    } else if (type && type === 'A') {
                        //entra se il tipo input è automatico - ciclo for
                        $scope.showManualInput = false;
                        $scope.barosello.outputStep = '';
                        $scope.barosello.outputStep1 = '';
                        $scope.barosello.numberInput = 0;
                        var i = 0;
                        promise = $interval(function () {
                            calculate();
                            calculateMulti7();
                            $scope.barosello.numberInput = i;
                            i++;
                        }, timeToNexT, 101);
                        if (i == 101)
                            $scope.showManualInput = true;
                    }
                };

                $scope.terminateFor = function () {
                    //termina il ciclo for
                    $interval.cancel(promise);
                    $scope.barosello.outputStep = '';
                    $scope.barosello.outputStep1 = '';
                    $scope.barosello.numberInput = 0;
                    $scope.showManualInput = true;
                };

                //calcola multipli di 3 e 5 chiamando il servizio
                function calculate() {
                    $scope.barosello.outputStep = baroSelloService.calculateMultply($scope.barosello.numberInput);
                }

                //calcola multipli di 3, 5 e 7 chiamando il servizio
                function calculateMulti7() {
                    $scope.barosello.outputStep1 = baroSelloService.calculateMultplySeven($scope.barosello.numberInput);
                }

                $scope.isNumber = function () {
                    return angular.isNumber($scope.barosello.outputStep1);
                };

            })

        //servizio da simulare com BackEnd
        .factory('baroSelloService', [
            function () {

                var service = {
                    calculateMultply: _calculateMultply,
                    calculateMultplySeven: _calculateMultplySeven
                };

                //funzione del calcolo multipli 3 e 5
                function _calculateMultply(numberInput) {
                    var multi3 = 0;
                    var multi5 = 0;

                    if (numberInput) {

                        multi3 = numberInput % 3;
                        multi5 = numberInput % 5;

                        if (multi3 === 0 && multi5 !== 0)
                            return 'Baro';
                        else if (multi3 !== 0 && multi5 === 0)
                            return 'Sello';
                        else if (multi3 === 0 && multi5 === 0)
                            return 'BaroSello';
                        else
                            return numberInput;
                    }
                    else if (numberInput === 0)
                        return numberInput;
                }

                //funzione del calcolo multipli 3, 5 e 7
                function _calculateMultplySeven(nmberInput) {
                    var multi7 = 0;

                    if (angular.isNumber(_calculateMultply(nmberInput)) && nmberInput !== 0) {
                        multi7 = _calculateMultply(nmberInput) % 7;
                        if (multi7 === 0)
                            return 'Nardo';
                        else
                            return nmberInput;
                    }
                    else
                        return _calculateMultply(nmberInput);
                }

                return service;
            }
        ]);

})();