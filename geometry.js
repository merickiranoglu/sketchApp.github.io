function getDistance(pt1, pt2) {
    var dx = pt2.x - pt1.x;
    var dy = pt2.y - pt1.y;
return Math.pow((dx * dx + dy * dy),0.5);
}

function getMidPtX(pt1, pt2) {
    return (pt1.x + pt2.x) / 2;
}

function getMidPtY(pt1, pt2) {
    return (pt1.y + pt2.y) / 2;
}

function precise(x) {
    return Number.parseFloat(x).toPrecision(2);
  }