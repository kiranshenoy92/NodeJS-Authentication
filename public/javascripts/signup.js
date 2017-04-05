$( "#confirmPassword" ).focusout(function() {
    if($(this).val() != $("#password").val()){
        $("#message").html("Password donot match").css("color","red");
        $("#password").css("border","2px solid red");
        $(this).css("border","2px solid red");

    } else {
         $("#message").html("");
         $("#password").css("border","none");
         $(this).css("border","none");
    }
});

$("#submitForm").submit(function(event) {
    $("#firstName, #lastName, #employeeID, #email, #password, #confirmPassword").each(function(){
        if($.trim(this.value) == ""){
            event.preventDefault();
           $("#"+this.id+"message").html("This is a required field").css("color","red");
           $(this).css("border","2px solid red");
        }
        else if($("#confirmPassword").val() != $("#password").val()){
             event.preventDefault();
        } else {
            $(this).css("border","2px solid green");
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
