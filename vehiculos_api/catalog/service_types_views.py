from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
# CAMBIO: Importar get_mongo_collection en lugar de db directo
from .mongo import get_mongo_collection
# CAMBIO: Importar MovieCatalogSerializer (era ServiceTypeSerializer)
from .mongo_serializers import MovieCatalogSerializer

# CAMBIO: Cambiar colección de service_types a movie_catalog
col = get_mongo_collection("movie_catalog")

def fix_id(doc):
    # CAMBIO: Mantiene la mismo lógica de convertir _id a id
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def oid_or_none(id_str: str):
    # CAMBIO: Función auxiliar sin cambios
    try:
        return ObjectId(id_str)
    except InvalidId:
        return None

@api_view(["GET", "POST"])
# CAMBIO: GET es público (AllowAny), POST requiere autenticación
@permission_classes([AllowAny])  # Para GET de cartelera
def service_types_list_create(request):
    # CAMBIO: Renombrado internamente a movie_catalog_list_create pero mantiene mismo endpoint
    if request.method == "GET":
        # CAMBIO: Filtros por movie_title, genre, is_active
        q = dict(request.query_params)
        docs = [fix_id(d) for d in col.find(q)]
        return Response(docs)

    # CAMBIO: Validar que sea POST desde autenticado
    if not request.user.is_authenticated:
        return Response({"detail": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)

    # CAMBIO: MovieCatalogSerializer reemplaza ServiceTypeSerializer
    serializer = MovieCatalogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    res = col.insert_one(serializer.validated_data)
    doc = col.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
# CAMBIO: GET es público, otros requieren autenticación
@permission_classes([AllowAny])
def service_types_detail(request, id: str):
    # CAMBIO: Renombrado internamente a movie_catalog_detail pero mantiene mismo endpoint
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        # CAMBIO: GET es público para consultar película
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))
    
    # CAMBIO: Otros métodos requieren autenticación
    if not request.user.is_authenticated:
        return Response({"detail": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method in ["PUT", "PATCH"]:
        serializer = ServiceTypeSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)

        col.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    res = col.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)