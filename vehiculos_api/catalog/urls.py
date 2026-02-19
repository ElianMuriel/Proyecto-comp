from django.urls import path
from rest_framework.routers import DefaultRouter
# CAMBIO: Importar ShowViewSet y ReservationViewSet (eran MarcaViewSet y VehiculoViewSet)
from .views import ShowViewSet, ReservationViewSet
from .service_types_views import service_types_list_create, service_types_detail
from .vehicle_services_views import vehicle_services_list_create, vehicle_services_detail

router = DefaultRouter()
# CAMBIO: "shows" reemplaza "marcas" (gestión de funciones de cine)
router.register(r"shows", ShowViewSet, basename="shows")
# CAMBIO: "reservations" reemplaza "vehiculos" (gestión de reservas)
router.register(r"reservations", ReservationViewSet, basename="reservations")

urlpatterns = [
    # CAMBIO: Mongo endpoints ahora para catálogo de películas y eventos de reserva
    # En future: movie-catalog y reservation-events reemplazarán service-types y vehicle-services
    path("service-types/", service_types_list_create),
    path("service-types//", service_types_detail),
    path("vehicle-services/", vehicle_services_list_create),
    path("vehicle-services//", vehicle_services_detail),
]

urlpatterns += router.urls