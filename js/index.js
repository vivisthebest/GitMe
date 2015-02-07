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
    // sunday - saturday (0 - 6)
    $scope.weekday_avgs = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };
    $scope.collaborators = {};
    $scope.followers = 0;
    $scope.downloads = 0;


    var new_name = function (name) {
        $.ajax("api.github.com/user/"+$scope.name"/repos", function (data, e) {
            if (e) {
                console.log("Data cannot be received.");
            }

            $scope.repos = data;

            $.ajax('api.github.com/users/'+$scope.name, function (data, e) {
                $scope.num_repos = data['public_repos'];
            });

            $scope.repos.forEach(function (el, i, arr) {
                $scope.stars += el['stargazers_count'];
                $scope.watchers += el['watchers_count'];
                $scope.open_issues += el['open_issues_count'];
                $.ajax('api.github.com/repos/'+$scope.name+'/'+el['name']+"/languages", function (data, e) {
                    Object.keys(data).forEach(function (el, i, arr) {
                        if($scope.languages[el] == undefined) {
                            $scope.languages[el] = 0;
                        }
                        $scope.languages[el] += data[el];
                    });

                });

                $.ajax('api.github.com/repos/'+$scope.name+'/'+el['name']+'stats/punch_card', function(data, e) {
                    data.forEach(function(el, i, arr) {
                        $scope.weekday_avgs[el[0]] += (el[2] / $scope.num_repos);
                    });
                });

                $.ajax('api.github.com/repos/'+$scope.name+'/'+el['name']+'/collaborators', function(data, e) {
                    data.forEach(function(el, i, arr) {
                        if($scope.collaborators[el['login']] == undefined) {
                            $scope.collaborators[el['login']] = 0;
                        }
                        $scope.collaborators[el['login']]++;
                    });
                });


        });


    };

})
