from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

DB_USER = "lhsd"
DB_PASSWORD = urllib.parse.quote_plus("LHsd123@")  # URL 编码，重要
DB_HOST = "pgm-bp1n6ip293s5y7fxco.pg.rds.aliyuncs.com"
DB_PORT = "5432"
DB_NAME = "postdoc"

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
