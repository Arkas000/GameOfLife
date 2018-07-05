//setup User Interface

//start button
$("#start").click(function() {
    life.startAnimation();
    $('#start').css('display','none');
    $('#pause').css('display','initial');
    $('#stop').css('display','initial');
});
//pause button
$("#pause").click(function() {
    life.pauseAnimation();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','initial');
});
//stop button
$("#stop").click(function() {
    life.stopAnimation();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','none');
});
//reset button
$("#reset").click(function() {
    life.reset();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','none');
});
//speedUp button
$("#speedup").click(function() {
    life.increaseSpeed();
    $('#speed').html(life.timeSpeed);
});
//speedDown button
$("#speeddown").click(function() {
    life.decreaseSpeed();
    $('#speed').html(life.timeSpeed);
});