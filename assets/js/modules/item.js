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
      url: "http://localhost:8086/items",
      dataSrc: function(data) {
        if (data.status == 200) {
          if (data.data.list == null) {
            return [];
          } else {
            return data.data.list;
          }
        } else {
          alert(
            "Error Code: " +
              data.code +
              ", Status code: " +
              data.status +
              ", message: " +
              data.messege
          );
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
      {
        data: "id",
        className: "dt-body-center"
      },
      { data: "name", className: "dt-body-center" }
    ],
    createdRow: function(row, data, index) {
      $(row)
        .find("td:gt(0)")
        .attr("onclick", "modalDetailShow(this.attributes['data-id'].value)");
      $(row)
        .find("td:gt(0)")
        .attr("data-id", data.id);
    }
  });
}

function modalAddShow() {
  $("#modal-add").addClass("is-active");
}

function modalDetailShow(id) {
  itemDetail(id);
  $("#edit-item").attr("data-id", id);
  $("#modal-detail").addClass("is-active");
}

function itemDetail(id) {
  let item = $("#item-name-detail");
  let description = $("#description-detail");
  let itemImagesContainer = $("#images-detail");
  item.empty();
  description.empty();
  itemImagesContainer.empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:8086/items/" + id,
    dataType: "JSON",
    cache: false,
    contentType: "application/json",
    success: function(response) {
      item.val(response.data.name);
      description.val(response.data.description);
      let images = response.data.images;
      let itemUpdate = new Dropzone("#imagesEdit", {
        autoProcessQueue: false,
        url: `http://localhost:8086/items/${id}/images`,
        maxFilesize: 2,
        method: "post",
        acceptedFiles: "image/*",
        paramName: "files",
        dictInvalidFileType: "File Type not supported",
        addRemoveLinks: true,
        init: function() {
          $("#item-update").click(function() {
            itemUpdate.processQueue();
          });

          this.on("queuecomplete", function() {
            this.options.autoProcessQueue = false;
          });

          this.on("processing", function() {
            this.options.autoProcessQueue = true;
          });

          images.forEach(image => {
            let mockFile = image;
            this.options.addedfile.call(this, mockFile);
            this.options.thumbnail.call(this, mockFile, image.url);
            mockFile.previewElement.classList.add("dz-complete");
          });
          this.on("resetFiles", function() {
            if (this.files.length != 0) {
              for (i = 0; i < this.files.length; i++) {
                this.files[i].previewElement.remove();
              }
              this.files.length = 0;
            }
          });
        },
        accept: function(file, done) {
          let re = /(?:\.([^.]+))?$/;
          let ext = re.exec(file.name)[1];
          ext = ext.toUpperCase();
          if (ext == "JPG" || ext == "JPEG" || ext == "PNG") {
            done();
          } else {
            done("Please select only supported picture files.");
          }
        },
        success: function(file, response) {},
        removedfile: function(file) {
          $.ajax({
            type: "DELETE",
            url: `http://localhost:8086/items/${id}/images/${file.fileName}`,
            dataType: "JSON",
            cache: false,
            contentType: "application/json",
            success: function(response) {
              file.previewElement.remove();
              $("#imagesEdit").removeClass("dz-default dz-message");
            },
            error: function(response) {
              Swal.fire({
                timer: 3000,
                title: "Oops!",
                text: "Please check your internet connention",
                type: "error"
              });
            }
          });
        }
      });
    },
    error: function(response) {
      Swal.fire({
        timer: 3000,
        title: "Oops!",
        text: "Please check your internet connention",
        type: "error"
      });
    }
  });
}

function modalDetailRemove() {
  let element = $(".modal-card");

  element.addClass("zoomOutDown");
  element.removeClass("slideInUp");
  setTimeout(() => {
    $("#modal-detail").removeClass("is-active");
    element.addClass("slideInUp");
    element.removeClass("zoomOutDown");
    let imagesEdit = $("#imagesEdit").get(0).dropzone;
    $("#imagesEdit").html(
      `<div class="dz-default dz-message"><span>Drop files here to upload</span></div>`
    );
    imagesEdit.destroy();
  }, 1000);
}

function modalDetailEdit(element) {
  $("#item-name-detail").removeAttr("disabled");
  $("#description-detail").removeAttr("disabled");
  $("#imagesEdit").removeClass("dz-clickable");
  $("#images-detail").empty();
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

let imagesAdd = new Dropzone("#imagesAdd", {
  autoProcessQueue: false,
  url: "http://localhost:8086/items/${id}/images",
  maxFilesize: 2,
  method: "post",
  acceptedFiles: "image/*",
  paramName: "files",
  dictInvalidFileType: "File Type not supported",
  addRemoveLinks: true,
  init: function() {
    this.on("queuecomplete", function() {
      this.options.autoProcessQueue = false;
    });

    this.on("processing", function() {
      this.options.autoProcessQueue = true;
    });
  },
  accept: function(file, done) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file.name)[1];
    ext = ext.toUpperCase();
    if (ext == "JPG" || ext == "JPEG" || ext == "PNG") {
      done();
    } else {
      done("Please select only supported picture files.");
    }
  },
  success: function(file, response) {}
});

function modalAddSave() {
  let element = $(".modal-card");
  let data = {
    name: $("#item-name").val(),
    description: $("#description").val()
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:8086/items",
    dataType: "JSON",
    cache: false,
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(response) {
      imagesAdd.options.url =
        "http://localhost:8086/items/" + response.data.id + "/images";
      imagesAdd.processQueue();
    },
    error: function(response) {
      Swal.fire({
        timer: 3000,
        title: "Oops!",
        text: "Please check your internet connention",
        type: "error"
      });
    }
  });

  element.addClass("fadeOutUp");
  element.removeClass("slideInUp");
  setTimeout(() => {
    $("#modal-add").removeClass("is-active");
    element.addClass("slideInUp");
    element.removeClass("fadeOutUp");
  }, 1000);
}

function modalDetailSave() {
  let element = $(".modal-card");

  let data = {
    id: $("#edit-item").data("id"),
    name: $("#item-name-detail").val(),
    description: $("#description-detail").val()
  };
  $.ajax({
    type: "PUT",
    url: "http://localhost:8086/items",
    dataType: "JSON",
    cache: false,
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(response) {},
    error: function(response) {
      Swal.fire({
        timer: 3000,
        title: "Oops!",
        text: "Please check your internet connention",
        type: "error"
      });
    }
  });

  element.addClass("fadeOutUp");
  element.removeClass("slideInUp");
  setTimeout(() => {
    $("#modal-detail").removeClass("is-active");
    element.addClass("slideInUp");
    element.removeClass("fadeOutUp");
  }, 1000);
}
