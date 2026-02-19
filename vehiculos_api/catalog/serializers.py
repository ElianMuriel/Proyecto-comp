from rest_framework import serializers
# CAMBIO: Modelos importados cambian de Marca/Vehiculo a Show/Reservation
from .models import Show, Reservation

# CAMBIO: ShowSerializer reemplaza MarcaSerializer (ahora serializa funciones de cine)
class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        # CAMBIO: Fields ahora incluyen movie_title, room, price, available_seats (datos de función)
        fields = ["id", "movie_title", "room", "price", "available_seats", "created_at"]

# CAMBIO: ReservationSerializer es nueva (serializa reservas de cine)
class ReservationSerializer(serializers.ModelSerializer):
    # CAMBIO: show_movie_title es nuevo (mostrar nombre de película en lectura)
    show_movie_title = serializers.CharField(source="show.movie_title", read_only=True)
    # CAMBIO: show_room es nuevo (mostrar sala en lectura)
    show_room = serializers.CharField(source="show.room", read_only=True)

    class Meta:
        model = Reservation
        # CAMBIO: Fields ahora incluyen show, customer_name, seats, status, created_at
        fields = ["id", "show", "show_movie_title", "show_room", "customer_name", "seats", "status", "created_at"]