$("#loginform").submit(function(event) {
    $("#email, #password").each(function(){
        if($.trim(this.value) == ""){
            event.preventDefault();
           $("#"+this.id+"message").html("This is a required field").css("color","red");
           $(this).css("border","2px solid red");
        }
    })   
})