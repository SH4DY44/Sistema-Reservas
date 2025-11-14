#!/bin/bash

# Prueba: crear usuario sin email
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nombre":"SinEmail"}'

# Prueba: crear usuario con email duplicado
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nombre":"Juan", "email":"juan@email.com"}'

# Prueba: crear reserva con fecha inicio >= fecha fin
curl -X POST http://localhost:3000/reservas -H "Content-Type: application/json" -d '{"usuario_id":1, "recurso_id":1, "fecha_inicio":"2025-11-13T12:00:00", "fecha_fin":"2025-11-13T10:00:00"}'

# Prueba: crear reserva solapada
curl -X POST http://localhost:3000/reservas -H "Content-Type: application/json" -d '{"usuario_id":1, "recurso_id":1, "fecha_inicio":"2025-11-13T10:00:00", "fecha_fin":"2025-11-13T12:00:00"}'
curl -X POST http://localhost:3000/reservas -H "Content-Type: application/json" -d '{"usuario_id":1, "recurso_id":1, "fecha_inicio":"2025-11-13T11:00:00", "fecha_fin":"2025-11-13T13:00:00"}'
