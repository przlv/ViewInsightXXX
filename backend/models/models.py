from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Datasets(Base):
    __tablename__ = 'datasets'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, unique=True, index=True)
    created = Column(DateTime, default=datetime.today())

#     items = relationship("Item", back_populates="owner")
#
#
# class Item(Base):
#     __tablename__ = 'items'
#
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey('users.id'))
#
#     owner = relationship("User", back_populates="items")