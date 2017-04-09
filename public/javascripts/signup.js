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

