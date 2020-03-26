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
      url: "http://localhost:8086/units",
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
      { data: "name", className: "dt-body-center" }
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
