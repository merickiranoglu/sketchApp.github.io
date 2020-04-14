const two = new Two
    ({
        fullscreen: true,
        type: Two.Types.canvas
    })

two.appendTo(divSketch);
const canvas = divSketch.getElementsByTagName('canvas')[0];

divSketch.style["width"] = "100%";
divSketch.style["height"] = "95%";
divSketch.style["border"] = "2px solid black";
var gridSize = 10;

two.clear();

var points = [];
var extraLengths = [];
var advancedEdit = false;
var drawCurve = false;
let isPolygonClosed = false;

for (i = 0; i < 100; i++) {
    extraLengths.push(0);
}
var inputLineCounter = 1;
var inputPointCounter = 1;

enterDrawLineMode();
two.play()

lblDrawLineMode.onclick = function (events) {
    advancedEdit = false;
    drawCurve = false;
    enterDrawLineMode();
}

lblDrawCurveMode.onclick = function (events) {
    advancedEdit = false;
    drawCurve = true;
    enterDrawCurveMode();
}

lblEditMode.onclick = function (events) {
    advancedEdit = false;
    drawCurve = false;
    enterEditMode();
}

lblAdvancedEditMode.onclick = function (events) {
    advancedEdit = true;
    drawCurve = false;
    enterAdvancedEditMode();
}


btnUndo.onclick = function (events) {
    points.pop();
    two.clear();
    updateDraw(points, extraLengths);
}

btnReset.onclick = function (events) {
    two.clear();
    inputLineCounter = 1;
    inputPointCounter = 1;
    points = [];
    enterDrawLineMode();
}

;

document.getElementById("btnClosed").addEventListener('click', function () {

    if (isPolygonClosed == false) {
        isPolygonClosed = true;
        btnClosed.style.backgroundImage = "url('img/circle-notch-solid.svg')";
        points.push(new Two.Anchor(points[0].x, points[0].y, 0, 0, 0, 0, Two.Commands.line));
    }
    else if (isPolygonClosed == true) {
        isPolygonClosed = false;
        btnClosed.style.backgroundImage = "url('img/circle-regular.svg')";
        points.pop();
    }
    updateDraw(points, extraLengths);

}, false);

btnClosed.onclick = function (events) {
}

function updateDraw(points, extraLengths = null, previewPoint = null, highlightPointIndex = -1, highlightLineIndex = -1, showTexts = false) {

    var centerX = 0;
    var centerY = 0;

    if (isPolygonClosed) {
        for (i = 0; i < points.length - 1; i++) {
            centerX += points[i].x;
            centerY += points[i].y;
        }
        centerX /= points.length - 1;
        centerY /= points.length - 1;
    }
    else {
        for (i = 0; i < points.length; i++) {
            centerX += points[i].x;
            centerY += points[i].y;
        }
        centerX /= points.length;
        centerY /= points.length;
    }

    two.clear();

    if (previewPoint != null) {

        if (drawCurve) {
            var LastPt = points[points.length - 1];
            var PtBeforeLastPt = points[points.length - 2];

            var dx = LastPt.x - PtBeforeLastPt.x;
            var dy = LastPt.y - PtBeforeLastPt.y;
            var angle = Math.atan2(dy, dx);

            angle = angle + Math.PI / 2;

            var curvePtX = LastPt.x + 20 * Math.cos(angle);
            var curvePtY = LastPt.y + 20 * Math.sin(angle);
            var curvePt = new Two.Anchor(curvePtX, curvePtY, -20, -20, 0, -20, Two.Commands.curve);

            points.push(curvePt);

            // var snappedPointX = findClosestPoint(previewPoint, LastPt, PtBeforeLastPt, true, false);
            // var snappedPointY = findClosestPoint(previewPoint, LastPt, PtBeforeLastPt, false, true);

            // var snappedPreviewPoint = previewPoint;
            // snappedPreviewPoint.x = snappedPointX
            // snappedPreviewPoint.y = snappedPointY
            // points.push(snappedPreviewPoint);
        }
        else {
            points.push(previewPoint);
        }

    }

    for (i = 0; i < points.length - 1; i++) {
        var pt = points[i];
        var nextPt = points[i + 1];


        if (nextPt.command == "C") {

            var prevPt = points[i - 1];

            var dx = pt.x - prevPt.x;
            var dy = pt.y - prevPt.y;
            var angle = Math.atan2(dy, dx);

            var xx = 20 * Math.cos(angle);
            var yy = 20 * Math.sin(angle);

            var curve = two.makeCurve(pt.x, pt.y, getMidPtX(pt, nextPt) + xx, getMidPtY(pt, nextPt) + yy, nextPt.x, nextPt.y, true);
            curve.stroke = "black";
            curve.noFill();
            curve.linewidth = 3;
        }
        else //line
        {
            let line = new Two.Line(pt.x, pt.y, nextPt.x, nextPt.y);
            if (i == highlightLineIndex) {
                line.stroke = "red"
            }
            else {
                line.stroke = "black"
            }
            line.linewidth = 3;
            two.add(line);
        }
    }

    let ptMarkCenter = new Two.Circle(centerX, centerY, 2);
    ptMarkCenter.fill = "red";
    ptMarkCenter.stroke = "red";
    ptMarkCenter.linewidth = 2;
    // two.add(ptMarkCenter);

    for (i = 0; i < points.length; i++) {
        if (i == highlightPointIndex) {
            let ptMark = new Two.Circle(points[i].x, points[i].y, 8);
            ptMark.fill = "red";
            ptMark.stroke = "red";
            ptMark.linewidth = 3;
            two.add(ptMark);
        }
        else {
            let ptMark = new Two.Circle(points[i].x, points[i].y, 4);
            ptMark.fill = "black";
            ptMark.stroke = "black";
            ptMark.linewidth = 3;
            two.add(ptMark);
        }
    }

    if (showTexts) {
        for (i = 0; i < points.length - 1; i++) {

            var pt = points[i];

            var nextPt = points[i + 1];
            var dist = getDistance(pt, nextPt);

            if (nextPt.command == "C") {
                continue;
            }

            var dxNext = nextPt.x - pt.x;
            var dyNext = nextPt.y - pt.y;
            var angleNext = Math.atan2(dyNext, dxNext);

            if (angleNext < 0) { angleNext += Math.PI * 2; }

            if (angleNext < Math.PI / 2 * 3 && angleNext > Math.PI / 2) {
                angleNext += Math.PI;
            }

            var txtLocationX = getMidPtX(pt, nextPt) + Math.cos(angleNext + Math.PI / 2) * 10;
            var txtLocationY = getMidPtY(pt, nextPt) + Math.sin(angleNext + Math.PI / 2) * 10;

            var advancedEdittxtLocationX = getMidPtX(pt, nextPt) + Math.cos(angleNext + Math.PI / 2) * 25;
            var advancedEdittxtLocationY = getMidPtY(pt, nextPt) + Math.sin(angleNext + Math.PI / 2) * 25;

            var dx1 = getMidPtX(pt, nextPt) - centerX;
            var dy1 = getMidPtY(pt, nextPt) - centerY;
            var distFromMidPtToCenter = Math.sqrt(dx1 * dx1 + dy1 * dy1);

            var dx2 = txtLocationX - centerX;
            var dy2 = txtLocationY - centerY;
            var distFromTxtPtToCenter = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distFromMidPtToCenter > distFromTxtPtToCenter) {

                if (pt.command == "C") {
                    txtLocationX = getMidPtX(pt, nextPt) + Math.cos(angleNext + Math.PI / 2) * 10;
                    txtLocationY = getMidPtY(pt, nextPt) + Math.sin(angleNext + Math.PI / 2) * 10;
                    advancedEdittxtLocationX = getMidPtX(pt, nextPt) + Math.cos(angleNext + Math.PI / 2) * 25;
                    advancedEdittxtLocationY = getMidPtY(pt, nextPt) + Math.sin(angleNext + Math.PI / 2) * 25;
                }
                else {
                    txtLocationX = getMidPtX(pt, nextPt) - Math.cos(angleNext + Math.PI / 2) * 10;
                    txtLocationY = getMidPtY(pt, nextPt) - Math.sin(angleNext + Math.PI / 2) * 10;
                    advancedEdittxtLocationX = getMidPtX(pt, nextPt) - Math.cos(angleNext + Math.PI / 2) * 25;
                    advancedEdittxtLocationY = getMidPtY(pt, nextPt) - Math.sin(angleNext + Math.PI / 2) * 25;
                }


            }

            var txt = new Two.Text(Math.round(dist), txtLocationX, txtLocationY);
            txt.rotation = angleNext;
            two.add(txt);

            if (advancedEdit && extraLengths != null) {
                var extratxt = new Two.Text("(" + extraLengths[i] + ")", advancedEdittxtLocationX, advancedEdittxtLocationY);

                extratxt.rotation = angleNext;
                extratxt.weight = 600;
                two.add(extratxt);
            }
        }

        for (i = 0; i < points.length - 1; i++) {

            if (i == 0 && isPolygonClosed == false) {
                continue;
            }

            if (points.length > 2 && i < points.length) {

                var pt = points[i];

                var prevPt = points[i];
                var nextPt = points[i];

                if (i == points.length) {
                    prevPt = points[i - 1];
                    nextPt = points[0];
                }
                else if (i == 0) {
                    prevPt = points[points.length - 2];
                    nextPt = points[i + 1];
                }
                else {
                    prevPt = points[i - 1];
                    nextPt = points[i + 1];
                }

                if (nextPt.command == "C" || pt.command == "C") {
                    continue;
                }

                var dxNext = nextPt.x - pt.x;
                var dyNext = nextPt.y - pt.y;
                var angleNext = Math.atan2(dyNext, dxNext);

                var dxPrev = prevPt.x - pt.x;
                var dyPrev = prevPt.y - pt.y;
                var anglePrev = Math.atan2(dyPrev, dxPrev);

                if (angleNext > anglePrev) {
                    anglePrev += Math.PI * 2.0;
                }

                var arc = two.makeArcSegment(pt.x, pt.y, 0, 20, anglePrev, angleNext)
                if (i == highlightPointIndex) {
                    arc.fill = "red";
                }
                else {
                    arc.fill = "white";
                }

                var angleDiff = (anglePrev - angleNext) * 180 / Math.PI;
                var txtMoveAngle = (angleNext + anglePrev) / 2;

                var angleTextLocationX = pt.x + 35 * Math.cos(txtMoveAngle);
                var angleTextLocationY = pt.y + 35 * Math.sin(txtMoveAngle);

                two.makeText(Math.round(angleDiff) + "°", angleTextLocationX, angleTextLocationY, {
                    alignment: 'center'
                });
            }



        }



        // for (i = 0; i < points.length; i++) {


        //     if (points[i].command == "C")
        //     {
        //         var nextPt = points[i+1];
        //         var pt = points[i];

        //         var dxNext = nextPt.x - pt.x;
        //         var dyNext = nextPt.y - pt.y;
        //         var angleNext = Math.atan2(dyNext, dxNext);

        //         if (angleNext < 0) { angleNext += Math.PI * 2; }

        //         if (angleNext < Math.PI / 2 * 3 && angleNext > Math.PI / 2) {
        //             angleNext += Math.PI;
        //         }

        //         var dist = getDistance(pt, nextPt);

        //         txtLocationX = getMidPtX(pt, nextPt) + Math.cos(angleNext + Math.PI / 2) * 10;
        //         txtLocationY = getMidPtY(pt, nextPt) + Math.sin(angleNext + Math.PI / 2) * 10;

        //         var txt = new Two.Text(Math.round(dist), txtLocationX, txtLocationY);
        //         txt.rotation = angleNext;
        //         two.add(txt);
        //     }


        // }

    }


}

function enterDrawLineMode() {
    console.log("Draw Line Mode activated.");
    divSketch.classList.add("grid");
    btnUndo.disabled = false;
    btnClosed.disabled = false;
    updateDraw(points, extraLengths);

    canvas.ontouchend = function (ev) {
        ev.preventDefault();

        let x = ev.changedTouches[0].pageX;
        let y = ev.changedTouches[0].pageY;

        if (points.length == 0) {
            points.push(new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.move));
        }
        else {
            points.push(new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.line));
        }
        updateDraw(points, extraLengths);
    }

    canvas.ontouchmove = function (ev) {
        ev.preventDefault();
        let x = ev.touches[0].pageX;
        let y = ev.touches[0].pageY;

        var previewPoint = new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.line);

        if (points.length > 0) {
            two.clear();
            updateDraw(points, extraLengths, previewPoint);
            points.pop();
        }
    }

    // btnUndo.style.display = "inline";
}

function enterDrawCurveMode() {
    console.log("Draw Curve Mode activated.");
    divSketch.classList.add("grid");
    btnUndo.disabled = false;
    btnClosed.disabled = false;
    updateDraw(points, extraLengths);

    canvas.ontouchend = function (ev) {
        ev.preventDefault();

        let x = ev.changedTouches[0].pageX;
        let y = ev.changedTouches[0].pageY;

        if (points.length == 0) {
            points.push(new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.move));
        }
        else {
            if (drawCurve) {

                var LastPt = points[points.length - 1];
                var PtBeforeLastPt = points[points.length - 2];

                var dx = LastPt.x - PtBeforeLastPt.x;
                var dy = LastPt.y - PtBeforeLastPt.y;
                var angle = Math.atan2(dy, dx);

                angle = angle + Math.PI / 2;

                var curvePtX = LastPt.x + 20 * Math.cos(angle);
                var curvePtY = LastPt.y + 20 * Math.sin(angle);
                var curvePt = new Two.Anchor(curvePtX, curvePtY, -20, -20, 0, -20, Two.Commands.curve);

                points.push(curvePt);

                // var mousePt = new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.line);

                // var snappedPointX = findClosestPoint(mousePt, LastPt, PtBeforeLastPt, true, false);
                // var snappedPointY = findClosestPoint(mousePt, LastPt, PtBeforeLastPt, false, true);

                // var snappedPt = new Two.Anchor(snappedPointX, snappedPointY, 0, 0, 0, 0, Two.Commands.line);
                // points.push(snappedPt);
            }
            else {
                points.push(new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.line));
            }
        }
        updateDraw(points, extraLengths);
    }

    canvas.ontouchmove = function (ev) {
        ev.preventDefault();
        let x = ev.touches[0].pageX;
        let y = ev.touches[0].pageY;

        var previewPoint = new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.line);

        if (points.length > 0) {
            two.clear();
            updateDraw(points, extraLengths, previewPoint);
            points.pop();
            // if (drawCurve) {
            //     points.pop();
            // }
        }
    }

    // btnUndo.style.display = "inline";
}

function enterEditMode() {
    console.log("Edit mode activated.");
    btnUndo.disabled = true;
    btnClosed.disabled = true;
    divSketch.classList.remove("grid");

    updateDraw(points, extraLengths, null, -1, -1, true);

    canvas.ontouchmove = function (ev) {

    }

    canvas.ontouchend = function (ev) {
        ev.preventDefault();

        let x = ev.changedTouches[0].pageX;
        let y = ev.changedTouches[0].pageY;

        var mousePt = new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.move);

        var closestPointIndex = 0;
        var closestLineIndex = 0;
        var minDistToPoint = Number.MAX_VALUE;
        var minDistToLine = Number.MAX_VALUE;

        for (i = 0; i < points.length; i++) {
            var distToPoint = getDistance(mousePt, points[i]);
            if (distToPoint < minDistToPoint) {
                minDistToPoint = distToPoint;
                closestPointIndex = i;
            }
        }

        for (i = 0; i < points.length - 1; i++) {
            if (i < points.length - 1) {
                var LineMidPt = new Two.Anchor((points[i].x + points[i + 1].x) / 2, (points[i].y + points[i + 1].y) / 2, 0, 0, 0, 0, Two.Commands.move);
                var distToLine = getDistance(mousePt, LineMidPt);
                if (distToLine < minDistToLine) {
                    minDistToLine = distToLine;
                    closestLineIndex = i;
                }
            }
        }

        two.clear();

        if (minDistToLine < minDistToPoint) {
            updateDraw(points, extraLengths, null, -1, closestLineIndex, true);


            setTimeout(function () {
                var LineMidPt = new Two.Anchor((points[closestLineIndex].x + points[closestLineIndex + 1].x) / 2, (points[closestLineIndex].y + points[closestLineIndex + 1].y) / 2, 0, 0, 0, 0, Two.Commands.move);
                var lineLength = getDistance(points[closestLineIndex], points[closestLineIndex + 1]);

                var length = prompt("Please enter new length:", Math.round(lineLength, 2));

                if (length == null) {
                    length = lineLength;
                }

                var dxNext = points[closestLineIndex + 1].x - points[closestLineIndex].x;
                var dyNext = points[closestLineIndex + 1].y - points[closestLineIndex].y;

                var xRatio = dxNext / lineLength;
                var yRatio = dyNext / lineLength;

                var dxNewNext = length * xRatio;
                var dyNewNext = length * yRatio;

                points[closestLineIndex + 1].x = points[closestLineIndex].x + dxNewNext;
                points[closestLineIndex + 1].y = points[closestLineIndex].y + dyNewNext;

                // var distDiff = length - lineLength;
                // var dxOtherPts = distDiff * xRatio;
                // var dyOtherPts = distDiff * yRatio;

                // console.log("prev length = " + lineLength);
                // console.log("new length = " + length);

                // for (i = closestLineIndex + 1; i < points.length - 1; i++) {
                //     points[i + 1].x = points[i + 1].x + dxOtherPts;
                //     points[i + 1].y = points[i + 1].y + dyOtherPts;
                // }

                updateDraw(points, extraLengths, null, -1, closestLineIndex, true);

            }, 25);
        }
        else {

            updateDraw(points, extraLengths, null, closestPointIndex, -1, true);
            setTimeout(function () {

                var pt = points[closestPointIndex];
                var nextPt = points[closestPointIndex];
                var prevPt = points[closestPointIndex];

                if (closestPointIndex == 0) {
                    if (isPolygonClosed) {
                        pt = points[closestPointIndex];
                        nextPt = points[closestPointIndex + 1];
                        prevPt = points[closestPointIndex.length - 2];


                    }
                    else { } //dont draw.
                }
                else if (closestPointIndex == points.length - 1) {
                    if (!isPolygonClosed) {
                        pt = points[closestPointIndex];
                        nextPt = points[0];
                        prevPt = points[closestPointIndex - 1];
                    }
                    else { } //dont draw.
                }
                else {

                    pt = points[closestPointIndex];
                    nextPt = points[closestPointIndex + 1];
                    prevPt = points[closestPointIndex - 1];

                    length = getDistance(pt, nextPt);

                    var dxNext = nextPt.x - pt.x;
                    var dyNext = nextPt.y - pt.y;
                    var angleNext = Math.atan2(dyNext, dxNext);

                    var dxPrev = prevPt.x - pt.x;
                    var dyPrev = prevPt.y - pt.y;
                    var anglePrev = Math.atan2(dyPrev, dxPrev);

                    var angleDiff = (anglePrev - angleNext) * 180 / Math.PI;

                    console.clear();

                    var newAngle = prompt("Please enter new angle:", Math.round(angleDiff, 2));

                    if (newAngle == null) { newAngle = angleDiff; }

                    var newAngleNext = (anglePrev * 180 / Math.PI) - newAngle;

                    var dxNew = length * Math.cos(newAngleNext * Math.PI / 180);
                    var dyNew = length * Math.sin(newAngleNext * Math.PI / 180);

                    points[closestPointIndex + 1].x = points[closestPointIndex].x + dxNew;
                    points[closestPointIndex + 1].y = points[closestPointIndex].y + dyNew;

                    updateDraw(points, extraLengths, null, closestPointIndex, -1, true);
                }
            }, 25);
        }

    }

}

function enterAdvancedEditMode() {
    console.log("Advanced Edit mode activated.");
    btnUndo.disabled = true;
    btnClosed.disabled = true;
    divSketch.classList.remove("grid");

    updateDraw(points, extraLengths, null, -1, -1, true);

    canvas.ontouchmove = function (ev) {
    }

    canvas.ontouchend = function (ev) {
        ev.preventDefault();

        let x = ev.changedTouches[0].pageX;
        let y = ev.changedTouches[0].pageY;

        var mousePt = new Two.Anchor(x, y, 0, 0, 0, 0, Two.Commands.move);
        var minDistToLine = Number.MAX_VALUE;

        var closestLineIndex = 0;

        for (i = 0; i < points.length - 1; i++) {
            if (i < points.length - 1) {
                var LineMidPt = new Two.Anchor((points[i].x + points[i + 1].x) / 2, (points[i].y + points[i + 1].y) / 2, 0, 0, 0, 0, Two.Commands.move);
                var distToLine = getDistance(mousePt, LineMidPt);
                if (distToLine < minDistToLine) {
                    minDistToLine = distToLine;
                    closestLineIndex = i;
                }
            }
        }

        two.clear();

        updateDraw(points, extraLengths, null, -1, closestLineIndex, true);

        setTimeout(function () {
            var lineLength = getDistance(points[closestLineIndex], points[closestLineIndex + 1]);
            var length = prompt("Please enter EXTRA length:", extraLengths[closestLineIndex]);

            if (length == null) { length = extraLengths[closestLineIndex]; }
            extraLengths[closestLineIndex] = length;

            updateDraw(points, extraLengths, null, -1, closestLineIndex, true);

        }, 25);

    }
}

