var sess_lastActivity,
    sess_warning = 1000*60*15,
    sess_expiration = 1000*60*20,
    sess_pollInterval = 1000*60,
    sess_intervalID;

/* //debug settings
var sess_lastActivity,
    sess_warning = 1000*10,
    sess_expiration = 1000*30,
    sess_pollInterval = 1000*5,
    sess_intervalID;*/

$(function(){
    $.ajaxSetup({ cache: false });
    var openr = window;
    var isChild = false;
    while(openr.opener) {
        openr = openr.opener;
        isChild = true;
    }
    openr.sess_lastActivity = Date.now();
    $(document)
        .keydown(function(e){
            openr.sess_lastActivity = Date.now();
        })
        .mousedown(function(e){
            openr.sess_lastActivity = Date.now();
            //$('#div1',openr.document).append(openr.sess_lastActivity+"<br/>");
        });
    
    function checkLastActivity(){
        $.get('../../checksession.aspx')
            .done(function(data){
                if(parseInt(data)==0){
                    alert('Session was lost!');
                    location.href = '../../logoutuser.aspx';
                }
            })
            .fail(function(e){
                alert('HTTP error status code: ' + e.status);
                location.href = '../../logoutuser.aspx';
            });

        var now = Date.now();
        var diff = now-sess_lastActivity;
        //$('#div1').append(now.getTime()+"-"+sess_lastActivity.getTime()+"="+diff+"<br/>");
        if (diff >= sess_warning && diff < sess_expiration) {
            clearInterval(sess_intervalID);
            if(confirm('Your session will expire in ' + (sess_expiration - sess_warning)/1000/60 +
            ' minutes (as of ' + (new Date).toTimeString() + '). \nSelect OK to remain logged in ' +
            'or select Cancel to log off. \nIf you are logged off, any changes not saved will be lost.')){
                now = Date.now();
                diff = now - sess_lastActivity;
                if (diff > sess_expiration) {
                    location.href = '../../logoutuser.aspx';
                }
                else {
                    sess_lastActivity = Date.now();
                    sess_intervalID = setInterval(checkLastActivity,sess_pollInterval);
                }
            }else{
                location.href = '../../logoutuser.aspx';
            }
        }
    }
    if(!isChild){
        sess_intervalID = setInterval(checkLastActivity,sess_pollInterval);
    }
})
