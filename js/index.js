var app = angular.module("GitMeApp", []_

app.controller ("MainDataController", "$scope", function ($scope) {
    $scope.name = "Fuck you";
    $scope.repos = [];
    $scope.num_repos = 0;
    $scope.stars = 0;
    $scope.watchers = 0;
    $scope.languages = {};
    $scope.commits = 0;
    $scope.open_issues = 0;
    $scope.weekday_avgs = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };

    $scope.followers = 0;
    $scope.downloads = 0;


    var new_name = function (name) {
        $.ajax("api.github.com/user/"+$scope.name"/repos", function (data, e) {
            if (e) {
                console.log("Data cannot be received.");
            }

            $scope.repos = data;
            $scope.repos.forEach(function (el, i, arr) {
                $scope.stars += el['stargazers_count'];
                $scope.watchers += el['watchers_count'];
                $scope.open_issues += el['open_issues_count'];
                $scope.num_repos++;
                $.ajax('api.github.com/repos/'+$scope.name+el['name']+"/languages", function (data, e) {
                    Object.keys(data).forEach(function (el, i, arr) {
                        if($scope.languages[el] != undefined) {
                            $scope.languages[el] = 0;
                        }
                        $scope.languages[el] += data[el];
                    });

                });
            });


        });

    };
})
