$(document).ready(function () { 
  "use strict"; 
  
  // let base_table_vue = new Vue({
  //   el: '#basic-datatable',
  //   data: {
  //     items: [{
  //       name: 'Tiger Nixon',
  //       position: 'System Architect',
  //       office: 'Edinburgh',
  //       age: 61,
  //       start_date: '2011/04/25',
  //       salary: '$320,800'
  //     }, {
  //       name: 'Garrett Winters',
  //       position: 'Accountant',
  //       office: 'Tokyo',
  //       age: 63,
  //       start_date: '2011/07/25',
  //       salary: '$170,750'
  //     }, {
  //       name: 'Ashton Cox',
  //       position: 'Junior Technical Author',
  //       office: 'San Francisco',
  //       age: 66,
  //       start_date: '2009/01/12',
  //       salary: '$86,000'
  //     }]
  //   }
  // });

  let base_table_jq = $("#basic-datatable").DataTable({ 
    keys: !0, 
    language: { 
      paginate: { 
        previous: "<i class='mdi mdi-chevron-left'>", 
        next: "<i class='mdi mdi-chevron-right'>" 
      } 
    }, 
    columns: [
      {data: 'name'},
      {data: 'position'},
      {data: 'office'},
      {data: 'age'},
      {data: 'start_date'},
      {data: 'salary'},
      {
        class: 'table-action',
        orderable: false,
        data: function(row) {
          return "<button class='btn btn-primary btn-update-info' data-row_name='"+row.name+"'>update</button>";
        },
        defaultContent: ''
      }
    ],
    drawCallback: function () { 
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
    }
  } );

  let init_base_data = [{
    name: 'Tiger Nixon',
    position: 'System Architect',
    office: 'Edinburgh',
    age: 61,
    start_date: '2011/04/25',
    salary: '$320,800'
  }, {
    name: 'Garrett Winters',
    position: 'Accountant',
    office: 'Tokyo',
    age: 63,
    start_date: '2011/07/25',
    salary: '$170,750'
  }, {
    name: 'Ashton Cox',
    position: 'Junior Technical Author',
    office: 'San Francisco',
    age: 66,
    start_date: '2009/01/12',
    salary: '$86,000'
  }];

  // init table data
  init_base_data.forEach(element => {
    base_table_jq.row.add(element).draw(false);
  });

  // setInterval(function() {
  //   base_table_jq.row.add({
  //     name: 'Cedric Kelly',
  //     position: 'Senior Javascript Developer',
  //     office: 'Edinburgh',
  //     age: 22,
  //     start_date: '2012/03/29',
  //     salary: '$433,060'
  //   }).draw(false);
  // }, 1000 * 10);

  $('#basic-datatable').on('click', '.btn-update-info', function(){
    alert($(this).data('row_name'));
  });

  var a = $("#datatable-buttons").DataTable({ 
    lengthChange: !1, 
    buttons: ["copy", "print"], 
    language: { 
      paginate: { 
        previous: "<i class='mdi mdi-chevron-left'>", 
        next: "<i class='mdi mdi-chevron-right'>" 
      } 
    }, 
    drawCallback: function () { 
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
    } 
  }); 
  $("#selection-datatable").DataTable({ 
    select: { 
      style: "multi" 
    }, 
    language: { 
      paginate: { 
        previous: "<i class='mdi mdi-chevron-left'>", 
        next: "<i class='mdi mdi-chevron-right'>" 
      } 
    }, 
    drawCallback: function () { 
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
    } 
  }), 
  a.buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)");
});