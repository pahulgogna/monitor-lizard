from sqlalchemy import (
    create_engine, 
    Column, 
    Integer, 
    String, 
    ForeignKey,
    Boolean
)
from sqlalchemy.orm import relationship, sessionmaker, joinedload, declarative_base
import os
from contextlib import contextmanager
import logging
from typing import TypedDict

MAX_TRIES = 3

engine = create_engine(os.environ.get('DATABASE_URL'))

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    monitors = relationship('Monitor', back_populates='user', cascade='all, delete-orphan')

class Monitor(Base):
    __tablename__ = 'monitor'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    userId = Column(String, ForeignKey('User.id', ondelete='CASCADE'), nullable=False)

    responseTimeIN = Column(Integer, nullable=False)
    responseTimeUS = Column(Integer, nullable=False)
    responseTimeEU = Column(Integer, nullable=False)

    runningIN = Column('runningIN', Boolean, default=True)
    runningUS = Column('runningUS', Boolean, default=True)
    runningEU = Column('runningEU', Boolean, default=True)
    user = relationship('User', back_populates='monitors')

    eastUS = Column('eastUS', Integer, default=True)
    westEurope = Column('westEurope', Integer, default=True)
    centralIndia = Column('centralIndia', Integer, default=True)

sessionLocal = sessionmaker(bind=engine)
class MonitorType(TypedDict):
    url: str
    email: str
    userName: str
    monitorName: str
    centralIndia: int
    eastUS: int
    westEurope: int
    runningEU: bool
    runningUS: bool

@contextmanager
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

def getMonitorDataInDb() -> list[MonitorType]:
    with get_db() as db:
        tries = 1
        results = []
        while True:
            try:
                results = db.query(Monitor).options(joinedload(Monitor.user)).filter(Monitor.runningIN.is_(True)).all()
                break
            except Exception as e:
                tries += 1
                if(tries == MAX_TRIES):
                    logging.info("Could not get data from the database.")
                    raise e
                logging.info("error while fetching data. Trying again...\n\n" + e.__str__())
                db.rollback()
            

        data = [
            {
                "url": row.url,
                "email": row.user.email,
                "userName": row.user.name,
                "monitorName": row.name,
                "centralIndia": row.centralIndia,
                "eastUS": row.eastUS,
                "westEurope": row.westEurope,
                "runningUS": row.runningUS,
                "runningEU": row.runningEU
            }
            for row in results
        ]

        return data
