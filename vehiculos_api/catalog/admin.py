from django.contrib import admin
# CAMBIO: Importar modelos de cine (Show, Reservation) en lugar de vehículos
from .models import Show, Reservation

# CAMBIO: Registrar Show en admin (reemplaza Marca)
@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    # CAMBIO: Mostrar campos de función de cine
    list_display = ['id', 'movie_title', 'room', 'price', 'available_seats', 'created_at']
    # CAMBIO: Fields en los detalles
    fields = ['movie_title', 'room', 'price', 'available_seats']
    # CAMBIO: Ordenamiento por ID descendente (más recientes primero)
    ordering = ['-id']

# CAMBIO: Registrar Reservation en admin (reemplaza Vehiculo)
@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    # CAMBIO: Mostrar información de reserva
    list_display = ['id', 'show', 'customer_name', 'seats', 'status', 'created_at']
    # CAMBIO: Filtrar por show y status
    list_filter = ['show', 'status', 'created_at']
    # CAMBIO: Búsqueda por customer_name y show movie_title
    search_fields = ['customer_name', 'show__movie_title']
    # CAMBIO: Fields en los detalles
    fields = ['show', 'customer_name', 'seats', 'status', 'created_at']
    # CAMBIO: readonly_fields para created_at
    readonly_fields = ['created_at']
    # CAMBIO: Ordenamiento por ID descendente
    ordering = ['-id']
