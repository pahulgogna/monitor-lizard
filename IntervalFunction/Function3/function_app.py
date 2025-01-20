import logging
import azure.functions as func
import main

app = func.FunctionApp()

@app.timer_trigger(schedule="10/15 * * * *", arg_name="myTimer", run_on_startup=False,
              use_monitor=False) 
def timer_trigger(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info('The timer is past due!')

    try:
        main.main()
    except Exception as e:
        logging.error(e.__str__())
        raise e
    