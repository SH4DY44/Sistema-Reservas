#!/bin/bash

curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nombre":"Maria", "email":"maria@email.com", "password":"abcd"}'
