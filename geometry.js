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

function findClosestPoint(pt1, lineP1, lineP2, returnX = false, returnY = false)
{
    var dx = lineP2.x - lineP1.x;
    var dy = lineP2.y - lineP1.y;

    var dist = ((pt1.x - lineP1.x) * dx + (pt1.y - lineP1.y) * dy) /
    (dx * dx + dy * dy);

    console.log(dist);

    var closestX = lineP1.x + dist * dx;
    var closestY = lineP1.y + dist * dy;

    if (returnX)
    {
        return closestX;
    }
    if (returnY)
    {
        return closestY;
    }
}