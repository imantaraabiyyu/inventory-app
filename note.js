let url = window.location.href;
// let route = url.split("/");
// let routeData = route[4];
console.log(url);
// if (routeData == "") {
//   history.pushState([], "home", "/inventory/home");
// } else {
//   history.pushState([], "home", "/inventory/item");
//   itemContent();
// }

let url = "http://localhost/inventory/";
let links = document.getElementsByTagName("link"),
  hrefs = [];
for (var i = 0; i < links.length; i++) {
  let href = links[i].href;
  let makehref = href.split("http://localhost/");
  if (makehref.length > 1) {
    links[i].href = url + makehref[1];
  }
}

<div class="component-block">
  <div class="field">
    <div class="control">
      <select
        class="chosen-select"
        data-placeholder="Project category"
        style="display: none;"
      >
        <option label="App category"></option>
        <option>Document management</option>
        <option>HR management</option>
        <option>ERP</option>
      </select>
    </div>
  </div>
</div>;

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
      images.forEach(image => {
        console.log(images);

        let templateImage = "";
        templateImage = `<div class="column is-two-fifths-desktop is-half-tablet">
        <div class="card">
          <div class="card-image">
            <figure class="image is-3by2">
              <img
                src=${image.url}
                alt=""
              />
            </figure>
            <div class="card-content is-overlay is-clipped">
              <span class="tag is-info">
                ${image.fileName}
              </span>
            </div>
          </div>
          <footer class="card-footer">
            <a id=${response.data.id} data-name=${image.fileName} onclick="removeImage(this)" class="card-footer-item">
              REMOVE
            </a>
          </footer>
        </div>
      </div>`;

        itemImagesContainer.append(templateImage);
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
  let imagesEdit = new Dropzone("#imagesEdit", {
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
}

function modalDetailEdit(element) {
  $("#item-name-detail").removeAttr("disabled");
  $("#description-detail").removeAttr("disabled");
  $("#images-detail").empty();
}

function removeImage(image) {
  let fileName = $(image).data("name");
  let id = $(image).attr("id");
  $.ajax({
    type: "DELETE",
    url: `http://localhost:8086/items/${id}/images/${fileName}`,
    dataType: "JSON",
    cache: false,
    contentType: "application/json",
    success: function(response) {
      itemDetail(id);
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
