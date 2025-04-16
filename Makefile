.PHONY: install run-backend run-frontend run-all clean

# Default target
all: run-all

# Install dependencies for both frontend and backend
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Run the backend server
run-backend:
	@echo "Starting backend server..."
	cd backend && python src/main.py

# Run the frontend development server
run-frontend:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

# Run both frontend and backend concurrently
run-all:
	@echo "Starting both frontend and backend servers..."
	@echo "Backend will run on http://localhost:5000"
	@echo "Frontend will run on http://localhost:5173"
	@echo "Press Ctrl+C to stop both servers"
	@echo "----------------------------------------"
	@make -j 2 run-backend run-frontend

# Clean up generated files
clean:
	@echo "Cleaning up..."
	rm -rf backend/__pycache__
	rm -rf backend/*.pyc
	rm -rf frontend/node_modules
	rm -rf frontend/dist 