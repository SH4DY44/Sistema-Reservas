#!/bin/bash
# Script para verificar comportamiento Síncrono vs Asíncrono

echo "--- TEST SINCRONO (Bloqueante) ---"
echo "Esperando respuesta... (Debería tardar ~5 segundos)"
start_time=$(date +%s%3N)
curl -X POST http://localhost:3000/reportes?tipo=sync \
     -H "Content-Type: application/json" \
     -d '{"usuario_id": 123}'
end_time=$(date +%s%3N)
elapsed=$((end_time - start_time))
echo -e "\n\nTiempo transcurrido: ${elapsed} ms\n"

echo "----------------------------------"

echo "--- TEST ASINCRONO (No Bloqueante) ---"
echo "Esperando respuesta... (Debería ser instantáneo)"
start_time_async=$(date +%s%3N)
curl -X POST http://localhost:3000/reportes?tipo=async \
     -H "Content-Type: application/json" \
     -d '{"usuario_id": 123}'
end_time_async=$(date +%s%3N)
elapsed_async=$((end_time_async - start_time_async))
echo -e "\n\nTiempo transcurrido: ${elapsed_async} ms\n"

echo "Mira los logs del servidor para ver cuando termina realmente el proceso asíncrono."
