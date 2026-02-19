from rest_framework import serializers

# CAMBIO: MovieCatalogSerializer reemplaza ServiceTypeSerializer (ahora para películas)
class MovieCatalogSerializer(serializers.Serializer):
    # CAMBIO: movie_title es el nombre de la película
    movie_title = serializers.CharField(max_length=120)
    # CAMBIO: genre es el género de la película (drama, comedia, etc.)
    genre = serializers.CharField(max_length=50, required=False, allow_blank=True)
    # CAMBIO: duration_min es la duración en minutos
    duration_min = serializers.IntegerField(required=False)
    # CAMBIO: rating es la calificación (PG-13, R, etc.)
    rating = serializers.CharField(max_length=20, required=False, allow_blank=True)
    # CAMBIO: is_active indica si la película está disponible
    is_active = serializers.BooleanField(default=True)

# CAMBIO: ReservationEventSerializer reemplaza VehicleServiceSerializer (ahora para eventos de reserva)
class ReservationEventSerializer(serializers.Serializer):
    # CAMBIO: reservation_id es la ID de la reserva creada en PostgreSQL
    reservation_id = serializers.IntegerField()
    # CAMBIO: event_type son los estados: CREATED, CONFIRMED, CANCELLED, CHECKED_IN
    event_type = serializers.CharField(max_length=20)
    # CAMBIO: source indica dónde se generó (WEB, MOBILE, SYSTEM)
    source = serializers.CharField(max_length=20, required=False, allow_blank=True)
    # CAMBIO: note es una nota descriptiva del evento
    note = serializers.CharField(required=False, allow_blank=True)
    # CAMBIO: created_at es la fecha y hora del evento
    created_at = serializers.DateTimeField(required=False)