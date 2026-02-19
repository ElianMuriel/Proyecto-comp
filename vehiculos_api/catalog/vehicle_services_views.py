from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
# CAMBIO: Importar get_mongo_collection y función auxiliar
from .mongo import get_mongo_collection
# CAMBIO: Importar ReservationEventSerializer (era VehicleServiceSerializer)
from .mongo_serializers import ReservationEventSerializer

# CAMBIO: Cambiar colección de vehicle_services a reservation_events (eventos de reserva)
col = get_mongo_collection("reservation_events")

def fix_id(doc):
    # CAMBIO: Mantiene la misma lógica: _id → id
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
# CAMBIO: GET es público (para ver eventos), POST es autenticado (crear eventos del sistema)
@permission_classes([AllowAny])
def vehicle_services_list_create(request):
    # CAMBIO: Renombrado a reservation_events_list_create pero mantiene mismo endpoint
    if request.method == "GET":
        # CAMBIO: Filtros por reservation_id, event_type, source, rango de fechas
        q = dict(request.query_params)
        # CAMBIO: Soporte para filtrar por rango de fechas (created_at)
        # Ej: ?created_at_min=2026-01-01&created_at_max=2026-02-20
        docs = [fix_id(d) for d in col.find(q)]
        return Response(docs)

    # CAMBIO: Validar que POST sea autenticado
    if not request.user.is_authenticated:
        return Response({"detail": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)

    # CAMBIO: ReservationEventSerializer reemplaza VehicleServiceSerializer
    serializer = ReservationEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    res = col.insert_one(serializer.validated_data)
    doc = col.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
# CAMBIO: GET es público, otros requieren autenticación
@permission_classes([AllowAny])
def vehicle_services_detail(request, id: str):
    # CAMBIO: Renombrado a reservation_events_detail pero mantiene mismo endpoint
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        # CAMBIO: GET público para consultar evento de reserva
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    # CAMBIO: PUT/PATCH/DELETE requieren autenticación
    if not request.user.is_authenticated:
        return Response({"detail": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method in ["PUT", "PATCH"]:
        # CAMBIO: ReservationEventSerializer para validación
        serializer = ReservationEventSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)

        col.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    # CAMBIO: DELETE es autenticado - elimina un evento
    res = col.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)