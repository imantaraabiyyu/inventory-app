$(function() {
  $("head").load("./modules/template/header.html");
  $("#spinner-load").html(
    "<div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div>"
  );
  history.pushState([], "home", "/inventory/home");
  initChosenSelects();
  load(2000);
});

function initChosenSelects() {
  if ($(".chosen-select").length) {
    $(".chosen-select").chosen({
      disable_search_threshold: 6,
      width: "70%"
    });
  }

  if ($(".chosen-multiple").length) {
    $(".chosen-multiple").chosen({
      disable_search_threshold: 10,
      max_selected_options: 5,
      width: "70%"
    });
  }
}

function load(time) {
  setTimeout(() => {
    $("#spinner-load").fadeOut();
    $("#banner").load("./modules/template/banner.html", () => {
      particlesJS("particles-js", {
        particles: {
          number: { value: 120, density: { enable: true } },
          color: { value: "#ffffff" },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    });
    $("footer").load("./modules/template/footer.html");
    $("section").removeAttr("hidden");
    $("fotter").removeAttr("hidden");
    $("body").removeAttr("style");
    $("#greeting").addClass("animated slideInRight");
    $("#date").html("Date : " + moment().format("LL"));
    $("#sidebar").load("./modules/template/sidebar.html", () => {
      $(".list-menu").each(function(i) {
        setTimeout(() => {
          $(this).addClass("animated fadeInUp");
          $(this).removeAttr("style");
        }, 100 * i);
      });
    });
    $("#content")
      .load("./modules/template/content.html")
      .addClass("animated fadeInUp");
  }, time);
}

function emptyContent() {
  $("#modals").empty();
  $("#content")
    .slideUp(300)
    .empty()
    .delay(50);
}

function home() {
  history.pushState([], "home", "/inventory/home");
  $(".select-menu").removeClass("is-selected");
  $("#home-menu").addClass("is-selected");
  emptyContent();
  $("#content")
    .css("display", "none")
    .fadeIn(400)
    .load("./modules/template/content.html");
}

function stockContent() {
  history.pushState([], "home", "/inventory/stock");
  $(".select-menu").removeClass("is-selected");
  $("#stock-menu").addClass("is-selected");
  emptyContent();

  $("#content")
    .css("display", "none")
    .fadeIn(50)
    .load("./modules/stocks/stock.html", () => {
      $.getScript("./assets/js/modules/stock.js");
    });

  $("#modals").load("./modules/stocks/modals.html", () => {
    initChosenSelects();
  });
}

function itemContent() {
  history.pushState([], "home", "/inventory/item");
  $(".select-menu").removeClass("is-selected");
  $("#item-menu").addClass("is-selected");
  emptyContent();

  $("#content")
    .css("display", "none")
    .fadeIn(50)
    .load("./modules/items/item.html", () => {
      $.getScript("./assets/js/modules/item.js");
    });

  $("#modals").load("./modules/items/modals.html");
}

function unitContent() {
  history.pushState([], "home", "/inventory/unit");
  $(".select-menu").removeClass("is-selected");
  $("#unit-menu").addClass("is-selected");
  emptyContent();

  $("#content")
    .css("display", "none")
    .fadeIn(50)
    .load("./modules/units/unit.html", () => {
      $.getScript("./assets/js/modules/unit.js");
    });

  $("#modals").load("./modules/units/modals.html");
}

function transactionContent() {
  history.pushState([], "home", "/inventory/transaction");
  $(".select-menu").removeClass("is-selected");
  $("#transaction-menu").addClass("is-selected");
  emptyContent();

  $("#content")
    .css("display", "none")
    .fadeIn(50)
    .load("./modules/transactions/transaction.html", () => {
      $.getScript("./assets/js/modules/transaction.js");
    });

  $("#modals").load("./modules/transactions/modals.html");
}

function modalAddRemove() {
  let element = $(".modal-card");

  element.addClass("zoomOutDown");
  element.removeClass("slideInUp");
  setTimeout(() => {
    $("#modal-add").removeClass("is-active");
    element.addClass("slideInUp");
    element.removeClass("zoomOutDown");
  }, 1000);
}

function modalDetailRemove() {
  let element = $(".modal-card");

  element.addClass("zoomOutDown");
  element.removeClass("slideInUp");
  setTimeout(() => {
    $("#modal-detail").removeClass("is-active");
    element.addClass("slideInUp");
    element.removeClass("zoomOutDown");
  }, 1000);
}
