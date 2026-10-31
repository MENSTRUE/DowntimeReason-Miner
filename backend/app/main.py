from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, classify, cluster, analytics
from app.inference.model_loader import ModelUnavailable

app = FastAPI(title='DowntimeReason Miner API', version='0.1.0',
              description='Research prototype: aviation logbook labels, synthetic maintenance themes, and historical PIADE analytics. NOT physical root-cause diagnosis.')
app.add_middleware(CORSMiddleware, allow_origins=settings.origins,
                   allow_credentials=False, allow_methods=['GET','POST'], allow_headers=['Content-Type'])

@app.exception_handler(ModelUnavailable)
async def handle_model_unavailable(_request: Request, error: ModelUnavailable):
    return JSONResponse(status_code=503, content={'error':'model_unavailable','detail':str(error)})

app.include_router(health.router, prefix='/api/v1')
app.include_router(classify.router, prefix='/api/v1')
app.include_router(cluster.router, prefix='/api/v1')
app.include_router(analytics.router, prefix='/api/v1')

@app.get('/')
def index():
    return {'service':'DowntimeReason Miner API', 'docs':'/docs', 'health':'/api/v1/health'}
