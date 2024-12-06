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
    responseTime = Column(Integer, nullable=False)
    status = Column(Integer, nullable=False)
    running = Column('running', Boolean, default=True)
    user = relationship('User', back_populates='monitors')

sessionLocal = sessionmaker(bind=engine)

@contextmanager
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

def getMonitorDataInDb() -> list:
    with get_db() as db:
            
        results = db.query(Monitor).options(joinedload(Monitor.user)).filter(Monitor.running.is_(True)).all()

        data = [
            {
                "url": row.url,
                "status": row.status,
                "email": row.user.email,
                "userName": row.user.name,
                "monitorName": row.name
            }
            for row in results
        ]

        return data
