from django.conf import settings
from pymongo import MongoClient

_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB]

# CAMBIO: Función auxiliar para obtener colecciones de MongoDB
def get_mongo_collection(collection_name):
    """
    CAMBIO: Obtiene una colección de MongoDB
    collection_name: Nombre de la colección (ej: "movie_catalog", "reservation_events")
    """
    return db[collection_name]