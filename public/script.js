function redirectToHome() {
  var email = document.getElementById("email");
  //console.log(email);
  var password = document.getElementById("password");
  //console.log(password);

  if (
    email.value === "bernardo@manzanares.com.ve" &&
    password.value === "12345678"
  ) {
    window.location.href = "home.html";
  } else {
    alert("La cuenta de correo electrónico o contraseña son inválidas.");
  }
}

var today = new Date().toISOString().split("T")[0];

var yesterday = new Date();

yesterday.setDate(yesterday.getDate() - 1);
yesterday = yesterday.toISOString().split("T")[0];

var lastWeek = new Date();

lastWeek.setDate(lastWeek.getDate() - 7);
lastWeek = lastWeek.toISOString().split("T")[0];

var lastMonth = new Date();

lastMonth.setMonth(lastMonth.getMonth() - 1);
lastMonth = lastMonth.toISOString().split("T")[0];

function setToday() {
  document.getElementById("startDate").value = yesterday;
  document.getElementById("endDate").value = today;
}

function setLastWeek() {
  document.getElementById("startDate").value = lastWeek;
  document.getElementById("endDate").value = today;
}

function setLastMonth() {
  document.getElementById("startDate").value = lastMonth;
  document.getElementById("endDate").value = today;
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "/rc/get-groups", true);
xhr.onload = function () {
  if (xhr.status === 200) {
    var response = JSON.parse(xhr.responseText);
    var groups = response.groups;

    var select = document.getElementById("channelSelect");

    groups.forEach(function (group) {
      var option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      select.appendChild(option);
    });
  }
};
xhr.send();

document.addEventListener("DOMContentLoaded", function () {
  const channelSelect = document.getElementById("channelSelect");
  let channelId;

  channelSelect.addEventListener("change", function () {
    channelId = channelSelect.options[channelSelect.selectedIndex].value;

    apiUrl = `/rc/get-group-members?group_id=${channelId}`;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", apiUrl, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var members = response.members;

        var select = document.getElementById("membersSelect");

        select.innerHTML = '<option value="">Todos</option>';

        members.forEach(function (member) {
          var option = document.createElement("option");
          option.value = member.id;
          option.textContent = member.name;
          select.appendChild(option);
        });
      }
    };
    xhr.send();
  });
});

function previewMessages() {
  var groupId = document.getElementById("channelSelect").value;
  var userId = document.getElementById("membersSelect").value;
  var fromDate = document.getElementById("startDate").value;
  var toDate = document.getElementById("endDate").value;

  if (userId == "") {
  } else {
    userId = "=" + userId;
  }

  let apiUrl = `/rc/get-group-messages?group_id=${groupId}&user_id${userId}&from_date=${fromDate}&to_date=${toDate}`;

  let xhr = new XMLHttpRequest();

  xhr.open("GET", apiUrl, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var messages = response.messages;

      var list = document.getElementById("messages_preview");
      var boxMenssages = "";

      messages.forEach(function (message) {
        var arrayName = message.user_name.split(" ");

        var initials = `${
          arrayName[0].charAt(0) + arrayName[1]?.charAt(0)
        }`.trim();

        const fecha = new Date(message.date);

        const formatoHora = `${fecha.getHours()}:${
          (fecha.getMinutes() < 10 ? "0" : "") + fecha.getMinutes()
        }`;
        const formatoFecha = `${fecha.getDate()}/${
          fecha.getMonth() + 1
        }/${fecha.getFullYear()}`;

        const formatoFinal = `${formatoHora} ${formatoFecha}`;

        const messageHTML = message.message.replace(/\n/g, "<br>");

        boxMenssages += `<div class="message_container">
          <div class="avatar">${initials}</div>
          <div>
            <div class="name_date">
              <h3 class="message_name">${message.user_name}</h3>
              <h3 class="message_date">${formatoFinal}</h3>
            </div>
            <p class="message_preview">
              ${messageHTML}
            </p>
          </div>
        </div>`;
      });

      list.innerHTML = boxMenssages;
    }
  };
  xhr.send();
}

function exportMessages() {
  var exportButton = document.querySelector(".button_export");

  var groupId = document.getElementById("channelSelect").value;
  var userId = document.getElementById("membersSelect").value;
  var fromDate = document.getElementById("startDate").value;
  var toDate = document.getElementById("endDate").value;

  if (userId == "") {
  } else {
    userId = "=" + userId;
  }

  var apiUrl = `/rc/export-group-messages?group_id=${groupId}&user_id${userId}&from_date=${fromDate}&to_date=${toDate}`;

  location.href = apiUrl;
}

function listExport() {
  var modes = document.querySelector("#downloadList");

  modes.style.opacity = 1;

  modes.classList.toggle("modes_menu--mostrar");
  modes.classList.toggle("modes_menu--ocultar");

  var apiUrl = "/export-list";

  let xhr = new XMLHttpRequest();

  xhr.open("GET", apiUrl, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var listExport = response;

      var list = document.getElementById("listExport");

      listExportHTML = "";

      listExport.forEach(function (archive) {
        listExportHTML += `<li class="archive_name_list"><a href="#" class = "archive_name" onclick="downloadOldArchive('${archive}')">${archive}</a></li>`;
      });

      list.innerHTML = listExportHTML;
    }
  };
  xhr.send();
}

function downloadOldArchive(nameArchive) {
  var apiUrl = `/download-old-archive?fileName=${nameArchive}`;
  location.href = apiUrl;
}
