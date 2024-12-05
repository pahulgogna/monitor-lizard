import azure.functions as func
import logging
import smtplib
import json
import os
from email.message import EmailMessage

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

user = {
    'user' : os.environ.get('user'),
    'password': os.environ.get('password')
}

send_code = os.environ.get('code')

@app.route(route="email_alert")
def email_alert(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(f'Python HTTP trigger function processed a request.')
    
    try:

        data = json.loads(req.get_body())

        code = data[0]

        if(code == send_code):

            emails = data[1]

            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(user=user['user'], password=user['password'])

            

            for email in emails:
                logging.info("sending...\n")
                msg = EmailMessage()
                msg['from'] = user['user']
                msg['to'] = email['to']
                msg.set_content(email['content'])
                msg['subject'] = email['subject']
                server.send_message(msg)
            logging.info(f'{len(emails)} Email/s sent')
            server.quit()

            return json.dumps({'success':True})
        
        else:
            logging.info(f'{len(emails)} Email/s sent')
            raise Exception("Invalid Password.")

    except Exception as e:
        logging.info(f'{len(emails)} Email/s sent')
        return json.dumps({'success':False,'error':e.__str__()})
