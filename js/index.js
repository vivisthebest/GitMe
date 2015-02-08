$('.graphs').hide();
var app = angular.module("GitMeApp", []);
var BreakException = {};

var circle = 0;
window.onload = function onLoad() {
    circle = new ProgressBar.Circle('#loader', {
        color: '#FCB03C',
        strokeWidth: 3.5,
        trailWidth: 1.5,
        duration: 5000,
        easing: 'easeInOut',
        text: {
            value: '0'
        },
        step: function(state, bar) {
            bar.setText((bar.value() * 100).toFixed(0));
        }
    });
    $('#loader').hide();
    $('.loader').hide();

};


app.controller ("MainDataController", function ($scope) {


    $scope.search = function () {
        var name = $(".search-text")[0].value;
        $('.splash').slideUp(1000);
        $('.logo').animate({opacity: 0});
        $('.headstuff').animate({opacity:0});
        $('.big-search').animate({opacity:0});
        $('.OCTOCAT').animate({opacity:0});
        setTimeout(function() {
            $('#loader').show();
            $('.loader').show();
            $('.loader').css('opacity', 0);
            $('.loader').animate({opacity: 1, duration: 500})
            setTimeout(function () {
                $('.hide-this').hide('slow');
            }, 4000);
        }, 1001);
        circle.animate(1);
        setTimeout(function () {
            $('.graphs').show();
        }, 5000);
        console.log("Searching for "+name+"...");
        new_name(name);
    };

    /*
    var ctx = document.getElementById("myChart").getContext("2d");

    $scope.data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    setTimeout(function () {
      myBarChart.datasets[0].bars[0].value -= 20;
      myBarChart.update();
    }, 2000);


    var myBarChart = new Chart(ctx).Bar($scope.data);
    */
    $scope.name = "";
    $scope.repos = [];
    $scope.biggest_repos = [
        {
            'name': '',
            'size': -1
        },
        {
            'name': '',
            'size': -1
        },
        {
            'name': '',
            'size': -1
        }
    ];
    $scope.counter = 0;
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
    $scope.peers = {};
    $scope.followers = 0;
    $scope.downloads = 0;
    $scope.lines = 0;

    var client_id = "4cb3db40db885450d09f",
        client_secret = "f143655f867cb8ae4036101c32c1bef807c7f3bb";

    var new_name = function (name) {
        $scope.name = name.toLowerCase();
        $.ajax("https://api.github.com/users/"+$scope.name+"/repos?client_id="+client_id+"&client_secret="+client_secret).done(function (data) {
            $scope.repos = data;

            $.ajax('https://api.github.com/users/'+$scope.name+"?client_id="+client_id+"&client_secret="+client_secret).done(function (data) {
                $scope.num_repos = data['public_repos'];
            });

            $scope.repos.forEach(function (repo, repo_num, arr) {
                $scope.stars += repo['stargazers_count'];
                $scope.watchers += repo['watchers_count'];
                $scope.open_issues += repo['open_issues_count'];
                $scope.counter = 0
                $.ajax({
                    url: 'https://api.github.com/repos/'+$scope.name+'/'+repo['name']+"/languages"+"?client_id="+client_id+"&client_secret="+client_secret,
                    async: true
                }).done(function (data) {
                    Object.keys(data).forEach(function (el, i, arr) {
                        if($scope.languages[el] == undefined) {
                            $scope.languages[el] = 0;
                        }
                        $scope.languages[el] += data[el];
                        $scope.counter += data[el];
                    });

                });

                try {
                    $scope.biggest_repos.forEach(function (el, i, arr) {
                        if($scope.counter > el['size']) {
                            $scope.biggest_repos.splice(i, 0, {'name': repo['name'], 'size': $scope.counter});
                            $scope.biggest_repos.pop();
                            throw BreakException;
                        }
                    });
                } catch (e) {
                    if (e!=BreakException) throw e;
                }


                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/stats/punch_card'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    data.forEach(function(el, i, arr) {
                        $scope.weekday_avgs[el[0]] += (el[2] / $scope.num_repos);
                    });
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/commits'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    data.forEach(function(el, i, arr) {
                        if (el.author != null){
                            if (el['author']['login'].toLowerCase() == $scope.name) {
                                $scope.commits++;
                            }

/*c
                            if($scope.name == el['author']['login']) {
                                $scope.lines += el['weeks']['a'];
                                $scope.lines -= el['weeks']['d'];

                            }*/
                        }
                    });
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/stats/contributors'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    if (!(data.forEach)) {
                        console.dir(data);
                    }
                    data.forEach(function(el, i, arr) {
                        if(el.author.login.toLowerCase() == $scope.name) {
                            el.weeks.forEach(function (week, j, week_arr) {
                                $scope.lines += week.a;
                                $scope.lines -= week.d;
                            });
                        } else {
                            if (el.author != null) {
                                if (!(el.author.login in $scope.peers)) {
                                    $scope.peers[el.author.login] = 0;
                                    el.weeks.forEach(function (week, j, week_arr) {
                                        $scope.peers[el.author.login] += week.a;
                                        $scope.peers[el.author.login] -= week.d;
                                    });
                                }
                            }
                        }
                    });
                });
            });


        });
        setTimeout(function () {
            console.log($scope.commits)
            console.log($scope.biggest_repos)
            console.log($scope.languages)
            console.log($scope.peers)
            console.log($scope.stars)
            console.log($scope.watchers)
            console.log($scope.num_repos)

        }, 1000)
    };
    //new_name("echiou");
});
