var app = angular.module("GitMeApp", [])
var BreakException = {};

Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: false,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: false,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
}

app.controller ("MainDataController", function ($scope) {

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


    var new_name = function (name) {
        $scope.name = name;
        $.ajax("https://api.github.com/users/"+$scope.name+"/repos").done(function (data) {
            $scope.repos = data;

            $.ajax('https://api.github.com/users/'+$scope.name).done(function (data) {
                $scope.num_repos = data['public_repos'];
            });

            $scope.repos.forEach(function (repo, repo_num, arr) {
                $scope.stars += repo['stargazers_count'];
                $scope.watchers += repo['watchers_count'];
                $scope.open_issues += repo['open_issues_count'];
                $scope.counter = 0
                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+"/languages").done(function (data) {
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


                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/stats/punch_card').done(function(data) {
                    data.forEach(function(el, i, arr) {
                        $scope.weekday_avgs[el[0]] += (el[2] / $scope.num_repos);
                    });
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/commits').done(function(data) {
                    data.forEach(function(el, i, arr) {
                        if (el['author']['login'] == $scope.name) {
                            $scope.commit++;
                        }

                        if($scope.name == el['author']['login']) {
                            $scope.lines += el['weeks']['a'];
                            $scope.lines -= el['weeks']['d'];
                        }
                    });
                });

                $.ajax('https://api.github.com/repos/'+$scope.name+'/'+repo['name']+'/pu/contributors').done(function(data) {
                    data.forEach(function(el, i, arr) {
                        if(el.author == $scope.name) {
                            el.weeks.forEach(function (week, j, week_arr) {
                                $scope.lines += week.a;
                                $scope.lines -= weel.d;
                            });
                        }
                    });
                });
            });


        });
    };
    new_name("kylelh");

})
