from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
# CAMBIO: Importar modelos de cine (Show, Reservation) en lugar de vehículos
from .models import Show, Reservation
# CAMBIO: Importar serializers de cine
from .serializers import ShowSerializer, ReservationSerializer
from .permissions import IsAdminOrReadOnly
# CAMBIO: Importar MongoDB para registrar eventos de reserva
from .mongo import get_mongo_collection

# CAMBIO: ShowViewSet reemplaza MarcaViewSet (ahora maneja funciones de cine)
class ShowViewSet(viewsets.ModelViewSet):
    # CAMBIO: Queryset ordena funciones por ID (era marca)
    queryset = Show.objects.all().order_by("id")
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # CAMBIO: Búsqueda por movie_title y room (era nombre de marca)
    search_fields = ["movie_title", "room"]
    # CAMBIO: Ordenamiento por campos de función (era nombre)
    ordering_fields = ["id", "movie_title", "room", "price", "available_seats"]

# CAMBIO: ReservationViewSet es nueva (maneja reservas de cine)
class ReservationViewSet(viewsets.ModelViewSet):
    # CAMBIO: Queryset ordena reservas por ID descendente (más recientes primero)
    queryset = Reservation.objects.select_related("show").all().order_by("-id")
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # CAMBIO: Filtrar por show_id y status (antes era por marca)
    filterset_fields = ["show", "status"]
    # CAMBIO: Búsqueda por customer_name y show movie_title
    search_fields = ["customer_name", "show__movie_title"]
    # CAMBIO: Ordenamiento por campos específicos de reserva
    ordering_fields = ["id", "customer_name", "seats", "status", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        # CAMBIO: Filtrar por show_id si se proporciona (antes no había filtro similar)
        show_id = self.request.query_params.get("show_id")
        if show_id:
            qs = qs.filter(show_id=int(show_id))
        # CAMBIO: Filtrar por rango de asientos
        seats_min = self.request.query_params.get("seats_min")
        seats_max = self.request.query_params.get("seats_max")
        if seats_min:
            qs = qs.filter(seats__gte=int(seats_min))
        if seats_max:
            qs = qs.filter(seats__lte=int(seats_max))
        return qs

    def get_permissions(self):
        # CAMBIO: Público puede listar (GET) toda funciones y reservas
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # CAMBIO: Al crear reserva, también crear evento en MongoDB
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # CAMBIO: Crear evento en colección reservation_events de MongoDB
        reservation = serializer.instance
        self._log_reservation_event(
            reservation_id=reservation.id,
            event_type="CREATED",
            source="WEB",
            note=f"Reserva creada para {reservation.customer_name}"
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def _log_reservation_event(self, reservation_id, event_type, source, note):
        # CAMBIO: Método auxiliar para registrar eventos en MongoDB
        try:
            from datetime import datetime
            collection = get_mongo_collection("reservation_events")
            event_document = {
                "reservation_id": reservation_id,  # CAMBIO: ID de la reserva SQL
                "event_type": event_type,  # CAMBIO: CREATED, CONFIRMED, CANCELLED, CHECKED_IN
                "source": source,  # CAMBIO: WEB, MOBILE, SYSTEM
                "note": note,
                "created_at": datetime.now()
            }
            collection.insert_one(event_document)
        except Exception as e:
            print(f"Error logging reservation event: {e}")