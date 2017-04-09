$("#loginform").submit(function(event) {
    $("#email, #password").each(function(){
        if($.trim(this.value) == ""){
            event.preventDefault();
           $("#"+this.id+"message").html("This is a required field").css("color","red");
           $(this).css("border","2px solid red");
        }
    })   
})

var togglePassword = () =>  {
    if($("#password").attr('type')=='password'){
        $("#password").attr('type','text');
    } else {
        $("#password").attr('type','password');
    }
}

$('#password + .glyphicon').on('click', function() {
  $(this).toggleClass('glyphicon-eye-close').toggleClass('glyphicon-eye-open'); // toggle our classes for the eye icon
  togglePassword(); // activate the hideShowPassword plugin
});
