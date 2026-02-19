from django.db import models

# CAMBIO: Show reemplaza la tabla de Marca + Vehiculo (ahora es tabla de funciones de cine)
class Show(models.Model):
    # CAMBIO: movie_title reemplaza "modelo" (nombre de película/función)
    movie_title = models.CharField(max_length=120)
    # CAMBIO: room es nuevo (sala de cine)
    room = models.CharField(max_length=20)
    # CAMBIO: price reemplaza atributos de vehículo (precio de entrada)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # CAMBIO: available_seats es nuevo (asientos disponibles)
    available_seats = models.IntegerField()
    # CAMBIO: created_at reemplaza "creado_en" (mantiene registro de creación)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.movie_title} - Sala {self.room}"

# CAMBIO: Reservation es totalmente nueva (tabla de reservas)
class Reservation(models.Model):
    # CAMBIO: Estados de reserva específicos del cine
    RESERVED = 'RESERVED'
    CONFIRMED = 'CONFIRMED'
    CANCELLED = 'CANCELLED'
    
    STATUS_CHOICES = [
        (RESERVED, 'Reservado'),
        (CONFIRMED, 'Confirmado'),
        (CANCELLED, 'Cancelado'),
    ]
    
    # CAMBIO: ForeignKey a Show (antes era a Marca)
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name="reservations")
    # CAMBIO: customer_name es nuevo (nombre del cliente)
    customer_name = models.CharField(max_length=120)
    # CAMBIO: seats es nuevo (cantidad de asientos reservados)
    seats = models.IntegerField()
    # CAMBIO: status es nuevo (estado de la reserva: RESERVED/CONFIRMED/CANCELLED)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=RESERVED)
    # CAMBIO: created_at reemplaza "creado_en"
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Reserva {self.id} - {self.customer_name} ({self.status})"