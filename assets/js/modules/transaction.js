getData();

$(".modal-background").click(function() {
  modalAddRemove();
});

function getData() {
  $("#datatable").DataTable({
    paging: true,
    autoWidth: true,
    processing: true,
    language: {
      processing: '<i  class="fas fa-circle-notch fa-spin fa-fw"></i> '
    },
    ajax: {
      type: "GET",
      url: "http://localhost:8086/transactions",
      dataSrc: function(data) {
        if (data.data.list == null) {
          return [];
        } else {
          return data.data.list;
        }
      }
    },
    columns: [
      {
        data: "id",
        className: "dt-body-center",
        render: function(data) {
          return "<input value=" + data + " type='checkbox'>";
        }
      },

      { data: "id", className: "dt-body-center" },
      { data: "amount", className: "dt-body-center" },
      {
        data: "type",
        className: "dt-body-center",
        render: function(data) {
          if (data == 0) {
            return "<td>PURCHASE</td>";
          } else if (data == 1) {
            return "<td>SELL</td>";
          } else if (data == 2) {
            return "<td>PAYDAY</td>";
          } else {
            return "<td>UNKNOWN</td>";
          }
        }
      },
      { data: "description", className: "dt-body-center" }
    ],
    createdRow: function(row, data, index) {
      $(row).attr("onclick", "rowDetail()");
      $(row).attr("data-rowid", data.id);
    }
  });
}

function rowDetail() {
  modalDetailShow();
}

function reloadTable() {
  $("#buttonReload").addClass("is-loading");
  setTimeout(() => {
    $("#datatable")
      .DataTable()
      .ajax.reload();
    $("#buttonReload").removeClass("is-loading");
  }, 2000);
}
