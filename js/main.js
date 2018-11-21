"use strict";

$('#registration-form').validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true,
        },
        pass: {
            required: true,
        }
    }
});

$('#registration-form').on('submit', function (e) {
    let form = $(this);
    $.post('http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration', form.serialize(), function( data ) {
        console.log(data.status);
        if (data.status === 'OK') {
            getDataCompains();
        } else {
            alert('Attention!'+ ' ' + data.message);
        }

    });
    e.preventDefault();
});


// convert time unix

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var time = date + '.' + month + '.' + year ;
    return time;
}

// chart from google

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
    ]);

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night',
        'width':400,
        'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart-companies-by-location'));
    chart.draw(data, options);
    ///////

}

// end chart from google

function generateColumnChart(data) {
    let options = {
        legend: { position: "none" },
    };
    let chart = new google.visualization.ColumnChart(document.getElementById('columnCharts'));
    chart.draw(google.visualization.arrayToDataTable(data), options);
}

function getDataCompains() {

    $.get('http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList', function(data) {
        let list = $('.card-list-of-companies ul');
        let total = 0;
        data.list.forEach(function (el) {
            list.append('<li class="list-group-item">' + el.name + '</li>');

            total++;
            el.partners.forEach(function () {
                total++;
            });
        });

        list.on('click', 'li', function () {
            // Unhighlight elements
            list.find('li').each(function () {
               $(this).removeClass('active');
            });

            $(this).addClass('active');

            let partners = data.list[$(this).index()].partners;
            partners = partners.map(function (el) {
                return [el.name, el.value];
            });
            generateColumnChart([
                ['Element', '']
            ].concat(partners));

            $('.card-chart-company-partners').show();
        });

        $('.card .total').html(total);
    });
}

getDataCompains();
// column chart

