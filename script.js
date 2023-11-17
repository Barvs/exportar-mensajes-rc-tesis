//import { group } from "console";
//import fileName from "./server/index";

function redirectToHome() {
  var email = document.getElementById("email");
  console.log(email);
  var password = document.getElementById("password");
  console.log(password);

  if (
    email.value === "bernardo@manzanares.com.ve" &&
    password.value === "12345678"
  ) {
    window.location.href = "home.html";
  } else {
    alert("La cuenta de correo electrónico o contraseña son inválidas.");
  }
}

// function changeScreen(screenName) {
//   document.getElementById("screenText").innerHTML =
//     "Has seleccionado: " + screenName;
// }

// function exportMessages() {
//   var selectedChannel = document.getElementById("channelSelect").value;
//   var startDate = document.getElementById("startDate").value;
//   var endDate = document.getElementById("endDate").value;

//   // Lógica para exportar los mensajes del canal seleccionado
//   console.log("Canal seleccionado: " + selectedChannel);
//   console.log("Fecha de inicio: " + startDate);
//   console.log("Fecha de fin: " + endDate);
// }

// Establecer fechas predeterminadas
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

// const buttons = document.querySelectorAll(".button_common");

// buttons.forEach((button) => {
//   button.addEventListener("click", (event) => {
//     const clickedButton = event.target;

//     buttons.forEach((btn) => {
//       btn.classList.remove("active");
//     });

//     clickedButton.classList.add("active");
//   });
// });

// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://localhost:3000/rc/get-groups", true);
// xhr.onload = function () {
//   if (xhr.status === 200) {
//     var response = JSON.parse(xhr.responseText);
//     var groups = response.groups;

//     var select = document.getElementById("channelSelect");

//     // Generar opciones del select
//     groups.forEach(function (group) {
//       var option = document.createElement("option");
//       option.value = group.id;
//       option.textContent = group.name;
//       select.appendChild(option);
//     });
//   }
// };
// xhr.send();

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/rc/get-groups", true);
xhr.onload = function () {
  if (xhr.status === 200) {
    var response = JSON.parse(xhr.responseText);
    var groups = response.groups;

    var select = document.getElementById("channelSelect");

    // Generar opciones del select
    groups.forEach(function (group) {
      var option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      select.appendChild(option);
    });

    // Establecer opción predeterminada
    // var defaultOption = "que-hice-hoy";
    // var defaultChannel = groups.find(function (group) {
    //   return group.name === defaultOption;
    // });

    // if (defaultChannel) {
    //   select.value = defaultChannel.id;
    // }
  }
};
xhr.send();

//Funcion que me devuelve el id del grupo

//var select = document.getElementById("membersSelect");

document.addEventListener("DOMContentLoaded", function () {
  const channelSelect = document.getElementById("channelSelect");
  let channelId;

  channelSelect.addEventListener("change", function () {
    channelId = channelSelect.options[channelSelect.selectedIndex].value;

    apiUrl = `http://localhost:3000/rc/get-group-members?group_id=${channelId}`;

    console.log(apiUrl);

    let xhr = new XMLHttpRequest();
    console.log(xhr);

    xhr.open("GET", apiUrl, true);
    console.log(xhr);

    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var members = response.members;

        var select = document.getElementById("membersSelect");

        select.innerHTML = '<option value="">Todos</option>';

        // Generar opciones del select
        members.forEach(function (member) {
          var option = document.createElement("option");
          option.value = member.id;
          option.textContent = member.name;
          select.appendChild(option);
        });
      }
    };
    xhr.send();

    // console.log(channelId);
    // console.log(apiUrl);
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

  let apiUrl = `http://localhost:3000/rc/get-group-messages?group_id=${groupId}&user_id${userId}&from_date=${fromDate}&to_date=${toDate}`;

  console.log(apiUrl);

  let xhr = new XMLHttpRequest();
  console.log(xhr);

  xhr.open("GET", apiUrl, true);
  console.log(xhr);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var messages = response.messages;

      var list = document.getElementById("messages_preview");
      var boxMenssages = "";

      messages.forEach(function (message) {
        console.log(message);

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

  //exportButton.addEventListener("click", function () {
  var groupId = document.getElementById("channelSelect").value;
  var userId = document.getElementById("membersSelect").value;
  var fromDate = document.getElementById("startDate").value;
  var toDate = document.getElementById("endDate").value;

  // var params = {
  //   userId: userId === "userAll" ? null : userId,
  //   fromDate: fromDate ? new Date(fromDate).toISOString() : null,
  //   toDate: toDate ? new Date(toDate).toISOString() : null,
  // };

  if (userId == "") {
  } else {
    userId = "=" + userId;
  }

  // var apiUrl_mensajes = `http://localhost:3000/rc/get-group-messages?group_id=${groupId}&user_id${userId}&from_date=${fromDate}&to_date=${toDate}`;

  // console.log(apiUrl_mensajes);

  var apiUrl = `http://localhost:3000/rc/export-group-messages?group_id=${groupId}&user_id${userId}&from_date=${fromDate}&to_date=${toDate}`;

  console.log(apiUrl);

  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", apiUrl, true);
  // xhr.onload = function () {
  //   if (xhr.status === 200) {
  //     var response = JSON.parse(xhr.responseText);
  //     console.log(response);
  //   }
  // };
  // xhr.send();

  location.href = apiUrl;

  // const timestampFull = new Date().getTime();

  // timestamp = String(timestampFull).slice(0, -4);
  // console.log("timestamp desde script: " + timestamp);

  // const fileName = `group_${groupId}_messages_${timestamp}.csv`;

  // console.log(timestamp);

  // function descargarArchivoCSV(datos, nombreArchivo) {
  //   const contenido =
  //     "data:text/csv;charset=utf-8," + encodeURIComponent(datos);
  //   const enlace = document.createElement("a");
  //   enlace.setAttribute("href", contenido);
  //   enlace.setAttribute("download", nombreArchivo);
  //   enlace.style.display = "none";
  //   document.body.appendChild(enlace);
  //   enlace.click();
  //   document.body.removeChild(enlace);
  // }

  // // Ejemplo de uso
  // const datosCSV = "Nombre,Apellido,Edad\nJohn,Doe,30\nJane,Smith,25";
  // const nombreArchivo = "datos.csv";

  // document
  //   .getElementById("btnDescargar")
  //   .addEventListener("click", function () {
  //     descargarArchivoCSV(datosCSV, nombreArchivo);
  //   });

  //});
}
