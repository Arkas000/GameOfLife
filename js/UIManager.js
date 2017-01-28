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
//benchmark button
$("#benchmark").click(function() {
    $('#start').css('display','none');
    $('#pause').css('display','none');
    $('#stop').css('display','initial');
    life.startBenchmark();
});