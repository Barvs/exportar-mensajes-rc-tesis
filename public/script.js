function redirectToHome() {
  window.location.href = "home.html";
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
var lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
lastWeek = lastWeek.toISOString().split("T")[0];
var lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
lastMonth = lastMonth.toISOString().split("T")[0];

function setToday() {
  document.getElementById("startDate").value = today;
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
