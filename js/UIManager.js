/**
 * Created by m.marangon on 21/10/2016.
 */
$("#start").click(function() {
    life.startAnimation();
    $('#start').css('display','none');
    $('#pause').css('display','initial');
    $('#stop').css('display','initial');
});

$("#pause").click(function() {
    life.pauseAnimation();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','initial');
});

$("#stop").click(function() {
    life.stopAnimation();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','none');
});

$("#reset").click(function() {
    life.reset();
    $('#start').css('display','initial');
    $('#pause').css('display','none');
    $('#stop').css('display','none');
});

$("#benchmark").click(function() {
    $('#start').css('display','none');
    $('#pause').css('display','none');
    $('#stop').css('display','initial');
    life.startBenchmark();
});