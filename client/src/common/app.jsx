// entry point
setTimeout(function(){
    chant.isCurrentPage = true;
    React.render(
        <Contents name="CHANT" myself={Config.myself} />,
        document.getElementById('container')
    );
    window.onfocus = function() {
        chant.clearUnread();
    };
    window.onblur = function () {
        chant.isCurrentPage = false;
    };
}, 0);
