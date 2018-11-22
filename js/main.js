"use strict";

$('#registration-form').on('submit', function (e) {
    e.preventDefault();
});

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
        },
        agree: 'required'
    },
    highlight: function(element) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function(element) {
        $(element).removeClass('is-invalid');
    },
    errorElement: 'div',
    errorClass: 'invalid-feedback',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group, .form-check').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function(form) {
        $.post('http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration',
            $(form).serialize(), function( data ) {
            if (data.status === 'OK') {
                $('.container.registration').hide();
                $('.container.companies').show();
                getDataCompanies();
            } else {
                alert('Attention!'+ ' ' + data.message);
            }
        });

        return false;
    }
});

function generateColumnChart(data) {
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(function () {
        let options = {
            legend: { position: 'none' },
            vAxis: { minValue: 0 },
        };
        let chart = new google.visualization.ColumnChart(document.getElementById('columnCharts'));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    });
}

function removeSpinner(selector) {
    $(selector).find('.spinner').remove();
}

function getDataCompanies() {

    $.get('http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList', function(data) {
        let total = 0;

        // List of Companies
        removeSpinner('.card-list-of-companies');
        let list = $('.card-list-of-companies .card-body')
            .append('<ul class="list-group"></ul>')
            .find('ul');
        data.list.forEach(function (el) {
            list.append('<li class="list-group-item">' + el.name + '</li>');

            total++;
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

        // Total
        removeSpinner('.card-total-companies');
        $('.card-total-companies .card-body').append('<div class="total">' + total + '</div>');
        $('.card .total').html(total);
    });
}
