$('.graphs').hide();
var app = angular.module("GitMeApp", []);
var BreakException = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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


    $scope.name_refresh = function () {
        $scope.apply();
        return $scope.full_name;
    }
    $scope.search = function () {
        setTimeout(function() {
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
            circle.animate(1, function() {circle.animate(0)});
            setTimeout(function () {
                $('.graphs').show().css('opacity', 0);
                $('.graphs').animate({opacity: 1, duration: 4000});
            }, 5200);
            console.log("Searching for "+name+"...");
            new_name(name);
        }, 400);
    };


    /*
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
    $scope.full_name = '';
    $scope.profile_url = '';

    var client_id = "4cb3db40db885450d09f",
        client_secret = "f143655f867cb8ae4036101c32c1bef807c7f3bb";

    var new_name = function (name) {
        $scope.name = name.toLowerCase();
        $.ajax("https://api.github.com/users/"+$scope.name+"?client_id="+client_id+"&client_secret="+client_secret).done(function (data) {
            $scope.full_name = data.name;
            $scope.profile_url = data.avatar_url;
            setTimeout(function() {
                $('.full-name').text($scope.full_name);
                $('.prof').attr('src', $scope.profile_url);
            }, 5200);
        });
        $.ajax('https://api.github.com/users/'+$scope.name+"?client_id="+client_id+"&client_secret="+client_secret).done(function (data) {
            $scope.num_repos = data['public_repos'];
            $('.num-repos').text(numberWithCommas($scope.num_repos));
        });
        $.ajax("https://api.github.com/users/"+$scope.name+"/repos?client_id="+client_id+"&client_secret="+client_secret).done(function (data) {
            $scope.repos = data;

            $scope.repos.forEach(function (repo, repo_num, arr) {
                $scope.stars += repo['stargazers_count'];
                $scope.watchers += repo['watchers_count'];
                $scope.open_issues += repo['open_issues_count'];
                $scope.counter = 0
                $.ajax({
                    url: 'https://api.github.com/repos/'+$scope.name+'/'+repo['name']+"/languages"+"?client_id="+client_id+"&client_secret="+client_secret,
                    async: false
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


                var ctx = document.getElementById("languages-doughnut").getContext("2d");

                var colors = [
                    ["#00FFB1", "#36C19A"],
                    ["#230CE8", "#260CE8"],
                    ["#FF0000", "#FF3400"],
                    ["#E8A80C", "#E8C70C"],
                    ["#29FF00", "#00FF3E"],
                    ["#190CC1", "#332DC1"],
                    ["#E80C9D", "#E837A7"],
                    ["#FF6700", "#FF8930"],
                    ["#E8CC0C", "#E8D737"],
                    ["#05FF00", "#30FF49"],
                    ["#270DC1", "#442FC1"],
                    ["#E80C76", "#E83587"],
                    ["#FF7700", "#FF932E"],
                    ["#E8D600", "#E8DD2A"],
                    ["#03FF27", "#45FF6D"]
                ];
                var data = [];
                try {
                    Object.keys($scope.languages).forEach(function (lang, i, arr) {
                        if (i == 10) {
                            throw BreakException
                        }
                        data.push({
                            value: $scope.languages[lang],
                            color: colors[i][0],
                            highlight: colors[i][1],
                            label: lang
                        });
                    });
                } catch (e) {
                    if (e != BreakException) throw e;
                }

                var myDoughnut = new Chart(ctx).Doughnut(data)




                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/stats/punch_card'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    data.forEach(function(el, i, arr) {
                        $scope.weekday_avgs[el[0]] += el[2];
                    });
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/commits'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    data.forEach(function(el, i, arr) {
                        if (el.author != null){
                            if (el['author']['login'].toLowerCase() == $scope.name) {
                                $scope.commits++;
                            }
                        }
                    });
                    $('.num-commits').text(numberWithCommas($scope.commits));
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/stats/contributors'+"?client_id="+client_id+"&client_secret="+client_secret).done(function(data) {
                    if (!(data.forEach)) {
                        console.dir(data);
                        return;
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
            setTimeout(function() {
                $('.ind-repo-0').text($scope.biggest_repos[0].name);
                $('.ind-repo-0-bits').text(numberWithCommas($scope.biggest_repos[0].size));
                $('.ind-repo-1').text($scope.biggest_repos[1].name);
                $('.ind-repo-1-bits').text(numberWithCommas($scope.biggest_repos[1].size));
                $('.ind-repo-2').text($scope.biggest_repos[2].name);
                $('.ind-repo-2-bits').text(numberWithCommas($scope.biggest_repos[2].size));
                $('.num-lines').text(numberWithCommas($scope.lines));
            }, 2000);


        });
        setTimeout(function () {
            var data = {
                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                datasets: [
                    {
                        label: "Days of the week",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: $scope.weekday_avgs
                    },
                ]
            };

            var ctx = document.getElementById("weekday-dist").getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data, bar_options)
        }, 8000);

    };
    //new_name("echiou");
});

var doughnut_options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : false,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : false,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

}

var bar_options = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 4,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 3,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

}
