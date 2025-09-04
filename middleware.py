"""
Custom middleware for Student Management System.
Logs all incoming requests with method, URL, and processing time.
"""

import time
import logging # Starlette
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("SMS_RequestLogger")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all incoming HTTP requests.
    Logs method, URL, client IP, and processing time.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """Process request and log details."""
        start_time = time.time()
        
        # Get client IP (handle proxy headers if needed)
        client_ip = request.client.host if request.client else "unknown"
        
        # Log incoming request
        logger.info(
            f"Incoming request: {request.method} {request.url.path} "
            f"from {client_ip}"
        )
        
        # Process the request
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log response details
            logger.info(
                f"Request completed: {request.method} {request.url.path} "
                f"- Status: {response.status_code} "
                f"- Time: {process_time:.4f}s"
            )
            
            # Add processing time to response headers
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            
            # Log error
            logger.error(
                f"Request failed: {request.method} {request.url.path} "
                f"- Error: {str(e)} "
                f"- Time: {process_time:.4f}s"
            )
            
            # Re-raise the exception to let FastAPI handle it
            raise e
