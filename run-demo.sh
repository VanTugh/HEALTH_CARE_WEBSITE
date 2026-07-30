#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/TTCSN/Back_end"
FRONTEND="$ROOT/TTCSN/Front_end"
MAVEN_REPO="$ROOT/maven_repo"
MVN_ARGS=(-Dmaven.repo.local="$MAVEN_REPO")

echo "=========================================="
echo " HealthCare Website - Demo (khong can DB)"
echo "=========================================="
echo ""
echo "Tai khoan test:"
echo "  Admin:   admin@healthcare.com / admin123"
echo "  Patient: patient@healthcare.com / admin123"
echo "  Doctor:  doctor@healthcare.com / admin123"
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

cd "$BACKEND"
mvn -q spring-boot:run -Dspring-boot.run.profiles=demo "${MVN_ARGS[@]}" &
BACKEND_PID=$!

echo "Dang khoi dong backend..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:8080/api/specialties >/dev/null 2>&1; then
    echo "Backend da san sang."
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Backend khong khoi dong duoc. Kiem tra log phia tren."
    exit 1
  fi
  sleep 2
done

cd "$FRONTEND"
if [[ ! -d node_modules ]]; then
  echo "Dang cai dat npm packages..."
  npm install
fi

echo "Dang khoi dong frontend..."
npm run dev
