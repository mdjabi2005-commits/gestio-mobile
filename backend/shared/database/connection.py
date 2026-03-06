# Backward compatibility - redirect to database package
from shared.database.database import get_db_connection, close_connection

__all__ = ['get_db_connection', 'close_connection']
