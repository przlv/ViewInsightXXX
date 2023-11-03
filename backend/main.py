from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.bd import engine as db
from routes import users
import uvicorn

app = FastAPI()


@app.on_event("startup")
async def startup():
    # когда приложение запускается устанавливаем соединение с БД
    db.connect()


@app.on_event("shutdown")
async def shutdown():
    # когда приложение останавливается разрываем соединение с БД
    await db.dispose()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Указываем разрешенные домены (фронтенд)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
