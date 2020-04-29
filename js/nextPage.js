
var dataURL = localStorage.getItem('imgDataURL');
var width = localStorage.getItem('canvasWidth');
var height = localStorage.getItem('canvasHeight');
var points = JSON.parse(localStorage.getItem("points"));

img1.src = dataURL; 
img1.width = width.substring(0, width.length - 2) / 2;
img1.height = height.substring(0, height.length - 2) / 2;
img1.border = "1px solid black";

btnGetPoints.onclick = function () {

    while (divTable.firstChild) {
        divTable.removeChild(divTable.lastChild);
      }

      var table = document.createElement("TABLE");
      var headerRow = table.insertRow(0);
      var headerCaptionCell = headerRow.insertCell(0);
      headerCaptionCell.innerHTML = "Points";
      var headerXCell = headerRow.insertCell(1);
      headerXCell.innerHTML = "x";
      var headerYCell = headerRow.insertCell(2);
      headerYCell.innerHTML = "y";

    for (var i = 0; i < points.length; i++) {
        var row = table.insertRow(i+1);
        var cellIndex = row.insertCell(0);
        cellIndex.innerHTML = i;
        var cellX = row.insertCell(1);
        cellX.innerHTML = points[i].x;
        var cellY = row.insertCell(2);
        cellY.innerHTML = points[i].y;
    }
    divTable.appendChild(table);
}


console.log(points);
