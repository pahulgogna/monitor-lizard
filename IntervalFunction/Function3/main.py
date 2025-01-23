import requests
from utils.Database import getMonitorDataInDb, get_db, Monitor, MonitorType
import threading
from utils.codes import codes
import time
from sqlalchemy.orm import Session
from sqlalchemy import update
import json
import os
import logging

toSendMailData = []

mailClient = os.environ.get('mcl')
responseCodesData = {}

def getStatusCodeData(url) -> dict:
    global responseCodesData
    if 'https://' not in url:
        url = 'https://' + url

    if responseCodesData.get(url):
        return responseCodesData[url]
    
    else:
        responseTime = 0

        try:
            start = time.monotonic_ns()
            data = requests.head(url, allow_redirects=True).status_code
            end = time.monotonic_ns()

            responseTime = (end-start)/1000000

            if data >= 400 and data <= 599:
                responseCodesData[url] = {'status': data, 'working':False, 'running': True, "responseTime":responseTime}
                return responseCodesData[url]
            else:
                responseCodesData[url] = {'status': data, 'working':True, 'running': True, "responseTime":responseTime}
                return responseCodesData[url]
        except:
            return {'status':0, 'working':False, 'running': False, "responseTime":responseTime}


def canSendMail(linkData: MonitorType):
    if((linkData["eastUS"] >= 400 and linkData["centralIndia"] >= 400) or (not linkData["runningUS"] and not linkData["runningIN"])):
        return False
    if((linkData["eastUS"] >= 400 or linkData["centralIndia"] >= 400) or (not linkData["runningUS"] or not linkData["runningIN"])):
        return True
    return False


def handleLink(linkData: MonitorType, db: Session):
    global toSendMailData
    response = getStatusCodeData(linkData["url"])

    if (response['status'] != linkData["westEurope"] and not response['working']):
        if(canSendMail(linkData)):
            toSendMailData.append({
                    "to": linkData["email"],
                    "content": f'Hello {linkData["userName"]},\n\nYour monitor "{linkData["monitorName"]}" for the URL "{linkData["url"]}" has encountered an issue. It returned a status code of {response["status"]}: {codes[str(response["status"])]} and a response time of {int(response["responseTime"])}ms.\n\nPlease check the monitor and take the necessary actions as soon as possible to ensure everything is running smoothly.\n\nBest regards,\nMonitor Lizard Team',
                    "subject": "Monitor Alert: Action Required!"
            })

    try:
        d = db.execute(
            update(Monitor).where(Monitor.url == linkData['url']).values({
                "runningEU": response['running'],
                "responseTimeEU": response['responseTime'],
                "westEurope": response["status"]
            })
        )

        logging.info(f'{linkData["url"]}: \ntime: {response["responseTime"]}\nstatus: {response["status"]}')

    except Exception as e:
        logging.error(e)
        return

    return

def sendMail():
    res = requests.post(mailClient, data=json.dumps([os.environ.get('code'),toSendMailData]))

def main():
    Monitors = getMonitorDataInDb()

    with get_db() as db:
        threads = [threading.Thread(target=handleLink, args=(linkData, db)) for linkData in Monitors]
        [thread.start() for thread in threads]
        [thread.join() for thread in threads]
        db.commit()
    if(toSendMailData):
        sendMail()


if __name__ == "__main__":
    main()