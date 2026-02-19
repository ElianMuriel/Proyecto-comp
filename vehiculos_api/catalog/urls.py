from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MarcaViewSet, VehiculoViewSet
from .service_types_views import service_types_list_create, service_types_detail
from .vehicle_services_views import vehicle_services_list_create, vehicle_services_detail

router = DefaultRouter()
router.register(r"marcas", MarcaViewSet, basename="marcas")
router.register(r"vehiculos", VehiculoViewSet, basename="vehiculos")

urlpatterns = [
    # Mongo
    path("service-types/", service_types_list_create),
    path("service-types//", service_types_detail),
    path("vehicle-services/", vehicle_services_list_create),
    path("vehicle-services//", vehicle_services_detail),
]

urlpatterns += router.urls