
var nodemailer = require('nodemailer');

var mailer = (emailID,firstName,token) => {
    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        type: 'OAuth2',
                        user: 'testmydjangopage@gmail.com',
                        clientId: '<YOUR CLIENT ID>',
                        clientSecret: '<YOUR CLIENT SECRET>',
                        refreshToken: '<YOUR REFRESH TOKEN>',
                        accessToken: '<YOUR ACCESS TOKEN>',
                        },
                    });

    var htmlTemplate = `
                    <html>
                        <head>
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                            <style type="text/css">
                                    .header {
                                    background: #8a8a8a;
                                }
                                .header .columns {
                                    padding-bottom: 0;
                                }                                
                                .header p {
                                    color: #fff;
                                    padding-top: 15px;
                                }                                
                                .header .wrapper-inner {
                                    padding: 20px;
                                }                                
                                .header .container {
                                    background: transparent;
                                }                                
                                table.button.facebook table td {
                                    background: #3B5998 !important;
                                    border-color: #3B5998;
                                }                                
                                table.button.twitter table td {
                                    backgr truncated 609bytes...
                            </style>
                        </head>
                        <body>
                            <wrapper class="header">
                                <container>
                                    <row class="collapse">
                                        <columns small="6">
                                            <img src="http://placehold.it/200x50/663399">
                                        </columns>
                                        <columns small="6">
                                            <p class="text-right">BASIC</p>
                                        </columns>
                                    </row>
                                </container>
                            </wrapper>
                            <container>
                                <spacer size="16"></spacer>
                                <row>
                                    <columns small="12">
                                        <h1>Hi, `+firstName+`</h1>
                                        <p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, iste, amet consequatur a veniam.</p>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut optio nulla et, fugiat. Maiores accusantium nostrum asperiores provident, quam modi ex inventore dolores id aspernatur architecto odio minima perferendis, explicabo. Lorem ipsum
                                            dolor sit amet, consectetur adipisicing elit. Minima quos quasi itaque beatae natus fugit provident delectus, magnam laudantium odio corrupti sit quam. Optio aut ut repudiandae velit distinctio asperiores?</p>
                                        <form action="http://localhost:3000/user/activate" method="POST">
                                                                                                               
                                            <input type="hidden" name="token" value=`+token+`>
                                            <button class="btn btn-primary">Activate</button> 
                                        </form>
                                    </columns>
                                </row>
                                <wrapper class="secondary">
                                    <spacer size="16"></spacer>
                                    <row>
                                        <columns large="6">
                                            <h5>Connect With Us:</h5>
                                            <button class="facebook expand" href="http://zurb.com">Facebook</button>
                                            <button class="twitter expand" href="http://zurb.com">Twitter</button>
                                            <button class="google expand" href="http://zurb.com">Google+</button>
                                        </columns>
                                        <columns large="6">
                                            <h5>Contact Info:</h5>
                                            <p>Phone: 408-341-0600</p>
                                            <p>Email: <a href="mailto:foundation@zurb.com">foundation@zurb.com</a></p>
                                        </columns>
                                    </row>
                                </wrapper>
                            </container>
                        </body>
                        </html>
                    `;
    var mailOption = {
        rom: 'Foo from @bar.com <donotreply@bar.com>',
        //to: email,
        to: 'kiranshenoy@yahoo.com',
        subject: 'ASS!!',
        html:htmlTemplate
    }
    transporter.sendMail(mailOption,(error, success)=>{
                            if(error){
                            console.log(error);
                            console.log("mail not sent");
                            } else {
                            console.log("mail sent");
                            }
                            
                        })
}

module.exports = mailer;